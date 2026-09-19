// Wordmark drawn the way the reference is drawn: a module grid, one rounded bar
// per horizontal run, gaps of a module between runs. Printed bottom layer first,
// nozzle travelling left to right at constant speed.
//
// Grid: 12 rows. 0-9 cap/ascender, 4-9 x-height, 10-11 descender.
const LOGO_ROWS = 12, LOGO_BASE = 10;
const G = {
  Y: ['X...X','X...X','X...X','X...X','XX.XX','.XXX.','..X..','..X..','..X..','..X..','.....','.....'],
  W: ['X.......X','X.......X','X.......X','X...X...X','X...X...X','X...X...X','X...X...X','X...X...X','X...X...X','XXXXXXXXX','.........','.........'],
  a: ['.....','.....','.....','.....','.XXXX','....X','XXXXX','X...X','X...X','XXXXX','.....','.....'],
  o: ['.....','.....','.....','.....','XXXXX','X...X','X...X','X...X','X...X','XXXXX','.....','.....'],
  n: ['.....','.....','.....','.....','XXXXX','X...X','X...X','X...X','X...X','X...X','.....','.....'],
  g: ['.....','.....','.....','.....','XXXXX','X...X','X...X','XXXXX','....X','....X','....X','XXXXX'],
};

// Optical kerning: pairs where the grid leaves a hole the metric gap can't fix.
// Values are in cells, applied on top of letterGap.
const KERN = { Ya: -1.8, ao: -0.2, on: -0.2, an: -0.2, ng: -0.2, Wa: -0.3 };

function logoRuns(text, { letterGap = 1, wordGap = 3, kern = 1 } = {}) {
  const runs = [];
  let col = 0, cols = 0, prev = null;
  for (const ch of text) {
    if (ch === ' ') { col += wordGap; prev = null; continue; }
    const g = G[ch];
    if (!g) continue;
    if (prev) col += (KERN[prev + ch] || 0) * kern;
    const w = g[0].length;
    for (let r = 0; r < LOGO_ROWS; r++) {
      const line = g[r];
      let s = -1;
      for (let c = 0; c <= w; c++) {
        const on = line[c] === 'X';
        if (on && s < 0) s = c;
        if (!on && s >= 0) { runs.push({ r, c: col + s, len: c - s }); s = -1; }
      }
    }
    col += w + letterGap;
    cols = Math.max(cols, col - letterGap);
    prev = ch;
  }
  const rowsUsed = runs.length ? Math.max(...runs.map((r) => r.r)) + 1 : LOGO_ROWS;
  return { runs, cols, rowsUsed };
}

function PrintLogo({
  text = 'Yao Wang', height = 48, color = '#0a0a0a', playKey = 0,
  layerMs = 130, passMs = 300, mode = 'layer', track = null,
  aspect = 1.3,      // cell width / cell height
  barRatio = 0.86,   // bar height within the layer
  gapRatio = 0,      // horizontal gap between bars, in cell widths
  sub = 1,           // layer lines per grid row
  letterGap = 0.7, wordGap = 1.4, kern = 0.6, cap = 'round',
}) {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { runs, cols, rowsUsed } = React.useMemo(
    () => logoRuns(text, { letterGap, wordGap, kern }), [text, letterGap, wordGap, kern]
  );
  const cellH = 100 / LOGO_BASE;          // cap height = 100 units
  const cellW = cellH * aspect;
  const layerH = cellH / sub;
  const barH = layerH * barRatio;
  const gap = cellW * gapRatio;
  const vw = cols * cellW, vh = rowsUsed * cellH;
  const layers = rowsUsed * sub;
  const scale = height / (LOGO_BASE * cellH);
  const bars = [];
  for (const r of runs) {
    for (let s = 0; s < sub; s++) {
      bars.push({ x: r.c * cellW + gap / 2, w: Math.max(barH, r.len * cellW - gap), layer: r.r * sub + s });
    }
  }
  return (
    <svg
      key={playKey}
      width={Math.round(vw * scale)} height={Math.round(vh * scale)}
      viewBox={`0 0 ${vw} ${vh}`} role="img" aria-label={text}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {track && Array.from({ length: layers }).map((_, L) => (
        <rect
          key={`t${L}`}
          x={gap / 2} y={L * layerH + (layerH - barH) / 2}
          width={Math.max(barH, cols * cellW - gap)} height={barH}
          rx={cap === 'square' ? 0 : barH / 2} fill={track}
        />
      ))}
      {bars.map((b, i) => {
        const start = (mode === 'layer' ? (layers - 1 - b.layer) * (layerMs / sub) : 0) + (b.x / vw) * passMs;
        const dur = Math.max(60, (b.w / vw) * passMs);
        const spread = mode === 'spread';
        return (
          <rect
            key={i} x={b.x} y={b.layer * layerH + (layerH - barH) / 2} width={b.w} height={barH}
            rx={cap === 'square' ? 0 : barH / 2} fill={color}
            style={reduced ? undefined : (spread ? {
              '--dx': `${-b.x}px`,
              animation: `logoSpread ${Math.round(passMs * 1.6)}ms cubic-bezier(.16,1,.3,1) both`,
              animationDelay: `${Math.round((b.x / vw) * passMs * 0.35)}ms`,
            } : {
              transformBox: 'fill-box', transformOrigin: 'left center',
              animation: `logoExtrude ${Math.round(dur)}ms linear both`,
              animationDelay: `${Math.round(start)}ms`,
            })}
          />
        );
      })}
    </svg>
  );
}

if (!document.getElementById('logo-print-kf')) {
  const s = document.createElement('style');
  s.id = 'logo-print-kf';
  s.textContent = '@keyframes logoExtrude{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes logoSpread{from{transform:translateX(var(--dx))}to{transform:translateX(0)}}';
  document.head.appendChild(s);
}

window.PrintLogo = PrintLogo;
