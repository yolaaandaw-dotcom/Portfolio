// Plate for the Diagnostic Mazes row. A new maze on every load.
// The line runs from the entrance to the cell under the pointer and stays where it was left.
const MZ_COLS = 36, MZ_ROWS = 8, MZ_CELL = 20;
const MZ_W = MZ_COLS * MZ_CELL, MZ_H = MZ_ROWS * MZ_CELL;
const MZ_IN = (MZ_ROWS >> 1) * MZ_COLS;            // entrance, left edge
const MZ_OUT = MZ_IN - 1;                          // exit, right edge, one row up

function mazeBuild() {
  const n = MZ_COLS * MZ_ROWS;
  const open = Array.from({ length: n }, () => []);
  const seen = new Uint8Array(n);
  const stack = [MZ_IN];
  seen[MZ_IN] = 1;
  while (stack.length) {
    const c = stack[stack.length - 1];
    const x = c % MZ_COLS, y = (c - x) / MZ_COLS;
    const next = [];
    if (x > 0 && !seen[c - 1]) next.push(c - 1);
    if (x < MZ_COLS - 1 && !seen[c + 1]) next.push(c + 1);
    if (y > 0 && !seen[c - MZ_COLS]) next.push(c - MZ_COLS);
    if (y < MZ_ROWS - 1 && !seen[c + MZ_COLS]) next.push(c + MZ_COLS);
    if (!next.length) { stack.pop(); continue; }
    const d = next[Math.floor(Math.random() * next.length)];
    open[c].push(d); open[d].push(c);
    seen[d] = 1; stack.push(d);
  }

  // Step back toward the entrance from every cell.
  const from = new Int32Array(n).fill(-1);
  const queue = [MZ_IN];
  from[MZ_IN] = MZ_IN;
  for (let i = 0; i < queue.length; i++) {
    for (const d of open[queue[i]]) {
      if (from[d] < 0) { from[d] = queue[i]; queue.push(d); }
    }
  }

  let walls = '';
  const yIn = (MZ_IN / MZ_COLS) * MZ_CELL, yOut = ((MZ_OUT + 1) / MZ_COLS - 1) * MZ_CELL;
  walls += `M0 0H${MZ_W}M0 ${MZ_H}H${MZ_W}`;
  walls += `M0 0V${yIn}M0 ${yIn + MZ_CELL}V${MZ_H}`;
  walls += `M${MZ_W} 0V${yOut}M${MZ_W} ${yOut + MZ_CELL}V${MZ_H}`;
  for (let c = 0; c < n; c++) {
    const x = c % MZ_COLS, y = (c - x) / MZ_COLS;
    if (x < MZ_COLS - 1 && !open[c].includes(c + 1)) walls += `M${(x + 1) * MZ_CELL} ${y * MZ_CELL}v${MZ_CELL}`;
    if (y < MZ_ROWS - 1 && !open[c].includes(c + MZ_COLS)) walls += `M${x * MZ_CELL} ${(y + 1) * MZ_CELL}h${MZ_CELL}`;
  }
  return { from, walls };
}

function mazeTrail(from, cell) {
  const mid = (c) => `${(c % MZ_COLS + 0.5) * MZ_CELL} ${(Math.floor(c / MZ_COLS) + 0.5) * MZ_CELL}`;
  let d = '';
  for (let c = cell; ; c = from[c]) {
    d += `${d ? 'L' : 'M'}${mid(c)}`;
    if (c === MZ_IN) break;
  }
  return d + `L0 ${(Math.floor(MZ_IN / MZ_COLS) + 0.5) * MZ_CELL}`;
}

function MazePlate({ ink = '#0a0a0a', muted = 'rgba(10,10,10,0.55)' }) {
  const maze = React.useMemo(mazeBuild, []);
  const [cell, setCell] = React.useState(-1);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(MZ_COLS - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * MZ_COLS)));
    const y = Math.min(MZ_ROWS - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * MZ_ROWS)));
    setCell(y * MZ_COLS + x);
  };
  return (
    <svg
      viewBox={`-1 -1 ${MZ_W + 2} ${MZ_H + 2}`} role="img" aria-label="A generated maze"
      onPointerMove={move}
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      <path d={maze.walls} fill="none" stroke={muted} strokeWidth="1" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
      {cell >= 0 && (
        <path d={mazeTrail(maze.from, cell)} fill="none" stroke={ink} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}

window.MazePlate = MazePlate;
