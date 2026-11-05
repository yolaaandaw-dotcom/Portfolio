// Live version of the selection loop on the Diagnostic Mazes page.
// The belief grid, the choice model and the expected-gain calculation are the ones in the paper.
// The maze library is small, and each maze is reduced to its three forks.
const MS_INK = '#0a0a0a';
const MS_MUTED = 'rgba(10,10,10,0.55)';
const MS_RULE = 'rgba(10,10,10,0.14)';
const MS_AXES = ['Explore', 'Save effort', 'Collect', 'Take risks'];
const MS_LEVELS = [0, 0.25, 0.5, 0.75, 1];
const MS_SCALE = [1, 0.4, 1, 1];    // set by hand here; the paper calibrates these four against 18 annotated forks
const MS_LIBRARY = 24, MS_FORKS = 3, MS_ROUNDS = 8;

// Preferences are a point on a 5-level grid over four axes: 625 states.
const MS_THETA = [];
for (const e of MS_LEVELS) for (const f of MS_LEVELS) for (const c of MS_LEVELS) for (const r of MS_LEVELS) MS_THETA.push([e, f, c, r]);

function msRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A fork is two branches. Each branch is counted the way the paper counts cells:
// side rooms, steps, items, risk-zone cells. The contrast vector is the scaled,
// normalised difference between the two counts.
function msFork(rand) {
  const n = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  const kind = n(0, 3);
  const a = { rooms: 0, steps: n(3, 6), items: 0, risk: 0 };
  const b = { rooms: 0, steps: a.steps, items: 0, risk: 0 };
  if (kind === 0) { a.rooms = n(1, 3); a.steps += n(1, 4); }      // side rooms cost a few steps
  if (kind === 1) { b.steps += n(3, 6); }                         // short against long
  if (kind === 2) { a.items = n(1, 3); a.steps += n(0, 4); }      // items, sometimes off the short path
  if (kind === 3) { a.risk = n(1, 3); b.steps += n(2, 5); }       // shortcut through a risk zone
  if (rand() < 0.35) { if (kind === 2) b.rooms = 1; else b.items = 1; }
  const d = [a.rooms - b.rooms, b.steps - a.steps, a.items - b.items, a.risk - b.risk].map((v, i) => v * MS_SCALE[i]);
  const len = Math.hypot(...d);
  const phi = d.map((v) => v / len);
  // P(take A | preferences) = sigmoid(theta . phi), no bias term
  const p = MS_THETA.map((t) => 1 / (1 + Math.exp(-(t[0] * phi[0] + t[1] * phi[1] + t[2] * phi[2] + t[3] * phi[3]))));
  return { a, b, phi, p };
}

const MS_MAZES = (() => {
  const rand = msRandom(16460);
  return Array.from({ length: MS_LIBRARY }, () => Array.from({ length: MS_FORKS }, () => msFork(rand)));
})();

// Expected information gain of a maze under a belief, in nats.
// Exact: every outcome of the three forks against every one of the 625 states.
function msGain(forks, belief) {
  let gain = 0;
  const like = new Float64Array(MS_THETA.length);
  for (let o = 0; o < 1 << forks.length; o++) {
    let total = 0;
    for (let s = 0; s < like.length; s++) {
      let l = 1;
      for (let k = 0; k < forks.length; k++) l *= (o >> k) & 1 ? forks[k].p[s] : 1 - forks[k].p[s];
      like[s] = l;
      total += belief[s] * l;
    }
    for (let s = 0; s < like.length; s++) if (belief[s] > 0) gain += belief[s] * like[s] * Math.log(like[s] / total);
  }
  return gain;
}

function msUpdate(belief, fork, tookA) {
  const next = new Float64Array(belief.length);
  let total = 0;
  for (let s = 0; s < next.length; s++) { next[s] = belief[s] * (tookA ? fork.p[s] : 1 - fork.p[s]); total += next[s]; }
  for (let s = 0; s < next.length; s++) next[s] /= total;
  return next;
}

// Per-axis distribution over the five levels, and its mean.
function msMarginals(belief) {
  return MS_AXES.map((_, axis) => {
    const bars = MS_LEVELS.map(() => 0);
    let mean = 0;
    for (let s = 0; s < belief.length; s++) {
      bars[MS_LEVELS.indexOf(MS_THETA[s][axis])] += belief[s];
      mean += belief[s] * MS_THETA[s][axis];
    }
    return { bars, mean };
  });
}

function msPick(belief, used) {
  const gains = MS_MAZES.map((m) => msGain(m, belief));
  let cur = -1;
  gains.forEach((g, i) => { if (!used.includes(i) && (cur < 0 || g > gains[cur])) cur = i; });
  return { cur, gains };
}

function msStart(hidden) {
  const belief = new Float64Array(MS_THETA.length).fill(1 / MS_THETA.length);
  return { belief, used: [], round: 0, answers: MS_MAZES[0].map(() => null), done: false, hidden, ...msPick(belief, []) };
}

function msBranchText(b) {
  const part = (v, one, many) => (v ? [`${v} ${v === 1 ? one : many}`] : []);
  return [`${b.steps} steps`, ...part(b.items, 'item', 'items'), ...part(b.risk, 'risk cell', 'risk cells'), ...part(b.rooms, 'side room', 'side rooms')].join(' · ');
}

function MsBranch({ b }) {
  const x0 = 4, unit = 14, y = 15, x1 = x0 + b.steps * unit;
  const at = (j, count) => x0 + ((j + 1) / (count + 1)) * (x1 - x0);
  const marks = [];
  for (let j = 0; j < b.rooms; j++) marks.push(<rect key={`r${j}`} x={at(j, b.rooms) - 3.5} y={y - 10} width="7" height="7" fill="#fff" stroke={MS_INK} strokeWidth="1" />);
  for (let j = 0; j < b.risk; j++) marks.push(<rect key={`k${j}`} x={at(j, b.risk) - 3.5} y={y - 3.5} width="7" height="7" fill={MS_INK} />);
  for (let j = 0; j < b.items; j++) marks.push(<circle key={`i${j}`} cx={at(j, b.items + (b.rooms ? 1 : 0)) + (b.rooms ? 12 : 0)} cy={y} r="3.2" fill="#fff" stroke={MS_INK} strokeWidth="1" />);
  return (
    <svg viewBox="0 0 180 22" aria-hidden="true" style={{ display: 'block', width: '100%', maxWidth: 220, height: 'auto' }}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={MS_INK} strokeWidth="1" />
      <line x1={x1} y1={y - 3} x2={x1} y2={y + 3} stroke={MS_INK} strokeWidth="1" />
      {marks}
    </svg>
  );
}

function MazeSim() {
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [s, setS] = React.useState(() => msStart(null));
  const forks = MS_MAZES[s.cur];
  const settled = s.answers.every((v) => v !== null);

  const answer = (k, tookA) => setS((old) => {
    if (old.done || old.answers[k] !== null) return old;
    const answers = old.answers.slice();
    answers[k] = tookA;
    return { ...old, answers, belief: msUpdate(old.belief, MS_MAZES[old.cur][k], tookA) };
  });

  // All three forks answered: stop after the last round, otherwise pick the next maze.
  React.useEffect(() => {
    if (!settled || s.done) return;
    const t = setTimeout(() => setS((old) => {
      if (old.round + 1 >= MS_ROUNDS) return { ...old, done: true };
      const used = [...old.used, old.cur];
      return { ...old, used, round: old.round + 1, answers: old.answers.map(() => null), ...msPick(old.belief, used) };
    }), still ? 0 : 700);
    return () => clearTimeout(t);
  }, [settled, s.done, s.round]);

  // A simulated player answers each fork by the same choice model, from preferences the system cannot see.
  React.useEffect(() => {
    if (!s.hidden || s.done || settled) return;
    const k = s.answers.indexOf(null);
    const tookA = Math.random() < forks[k].p[MS_THETA.indexOf(s.hidden)];
    const t = setTimeout(() => answer(k, tookA), still ? 0 : 320);
    return () => clearTimeout(t);
  }, [s.hidden, s.done, s.answers, s.cur]);

  const marg = msMarginals(s.belief);
  // Gains across the library differ only in the third decimal, so the bars are drawn from just below the lowest one.
  const top = Math.max(...s.gains), low = Math.min(...s.gains);
  const floor = low - (top - low) * 0.25;
  const label = { fontSize: 10, color: MS_MUTED, textTransform: 'uppercase', letterSpacing: 1.2 };
  const link = { border: 0, padding: 0, background: 'none', font: 'inherit', fontWeight: 300, color: MS_INK, cursor: 'pointer', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 };
  const error = s.hidden ? Math.hypot(...marg.map((m, i) => m.mean - s.hidden[i])) : 0;

  return (
    <div style={{ fontSize: 14, lineHeight: 1.6, color: MS_INK }}>
      <p style={{ margin: 0, maxWidth: '64ch', fontSize: 15, lineHeight: 1.65 }}>
        Choose a branch at each fork. Or <button style={link} onClick={() => setS(msStart(MS_THETA[Math.floor(Math.random() * MS_THETA.length)]))}>let a simulated player</button> with
        hidden preferences do it. <button style={link} onClick={() => setS(msStart(null))}>Start again</button>
      </p>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 16px' }}>
        <span style={label}>Maze {s.round + 1} of {MS_ROUNDS}</span>
        <span style={{ fontSize: 12, color: MS_MUTED, fontVariantNumeric: 'tabular-nums' }}>
          best of {MS_LIBRARY - s.used.length} unused · expected gain {s.gains[s.cur].toFixed(3)} nats
        </span>
      </div>
      <div style={{ marginTop: 10, height: 44, display: 'flex', alignItems: 'flex-end', gap: 3, borderBottom: `1px solid ${MS_RULE}` }}>
        {s.gains.map((g, i) => (
          <span key={i} style={{
            flex: 1, height: Math.max(2, ((g - floor) / (top - floor || 1)) * 44), boxSizing: 'border-box',
            background: i === s.cur ? MS_INK : s.used.includes(i) ? 'transparent' : 'rgba(10,10,10,0.22)',
            boxShadow: s.used.includes(i) ? `inset 0 0 0 1px ${MS_RULE}` : 'none',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 10.5, color: MS_MUTED, marginTop: 8, letterSpacing: 0.4 }}>
        One bar per maze in the library: its expected gain under the current estimate, from {low.toFixed(4)} to {top.toFixed(4)} nats.
        The bars start just below the lowest value so the differences show. Black is the maze shown. Outlined ones were shown already.
      </div>

      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '24px 32px' }}>
        {forks.map((f, k) => (
          <div key={`${s.cur}-${k}`}>
            <div style={{ ...label, marginBottom: 8 }}>Fork {k + 1}</div>
            {[['A', f.a, true], ['B', f.b, false]].map(([name, b, tookA]) => {
              const chosen = s.answers[k] === tookA, open = s.answers[k] === null && !s.done && !s.hidden;
              return (
                <button key={name} disabled={!open} onClick={() => answer(k, tookA)} style={{
                  display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', columnGap: 8, alignItems: 'center', width: '100%',
                  padding: '8px 0', border: 0, borderTop: `1px solid ${MS_RULE}`, background: 'none', font: 'inherit', textAlign: 'left',
                  color: MS_INK, cursor: open ? 'pointer' : 'default', opacity: s.answers[k] === null || chosen ? 1 : 0.35,
                }}>
                  <span style={{ fontWeight: chosen ? 500 : 300 }}>{name}</span>
                  <span>
                    <MsBranch b={b} />
                    <span style={{ display: 'block', fontSize: 12, color: MS_MUTED, fontWeight: chosen ? 400 : 300 }}>{msBranchText(b)}{chosen ? ' · taken' : ''}</span>
                  </span>
                </button>
              );
            })}
            <div style={{ borderTop: `1px solid ${MS_RULE}`, paddingTop: 8, fontSize: 12, color: MS_MUTED, fontVariantNumeric: 'tabular-nums' }}>
              A counts for: {f.phi.map((v, i) => [v, i]).filter(([v]) => Math.abs(v) >= 0.15).map(([v, i]) => `${MS_AXES[i].toLowerCase()} ${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`).join(' · ')}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10.5, color: MS_MUTED, marginTop: 12, letterSpacing: 0.4 }}>
        Line length is the number of steps. Circle: item. Black square: risk-zone cell. Open square: side room.
      </div>

      <div style={{ ...label, marginTop: 36, marginBottom: 12 }}>Estimate after {s.round * MS_FORKS + s.answers.filter((v) => v !== null).length} choices</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px 28px' }}>
        {marg.map((m, i) => (
          <div key={i}>
            <div style={{ height: 56, display: 'flex', alignItems: 'flex-end', gap: 4, borderBottom: `1px solid ${MS_INK}`, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: 56 * 0.4, borderTop: `1px dashed ${MS_RULE}` }} />
              {m.bars.map((v, j) => (
                <span key={j} style={{
                  flex: 1, height: Math.min(56, (v / 0.5) * 56), background: MS_INK,
                  opacity: s.done && s.hidden && s.hidden[i] === MS_LEVELS[j] ? 1 : s.done && s.hidden ? 0.3 : 0.8,
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: MS_MUTED, marginTop: 4 }}><span>0</span><span>1</span></div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{MS_AXES[i]} <span style={{ color: MS_MUTED, fontVariantNumeric: 'tabular-nums' }}>{m.mean.toFixed(2)}</span></div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10.5, color: MS_MUTED, marginTop: 12, letterSpacing: 0.4 }}>
        Probability of each of the five levels, per axis, with the mean. The dashed line is the starting point, 0.2 everywhere.
      </div>

      {s.done && (
        <p style={{ margin: '24px 0 0', maxWidth: '64ch', fontSize: 15, lineHeight: 1.65 }}>
          {s.hidden
            ? `The player's hidden preferences were ${s.hidden.map((v, i) => `${MS_AXES[i].toLowerCase()} ${v.toFixed(2)}`).join(', ')}, marked in solid black above. Distance from the estimate: ${error.toFixed(2)}.`
            : `${MS_ROUNDS} mazes, ${MS_ROUNDS * MS_FORKS} choices.`}
          {' '}The estimate moves only a little. The paper finds the same: 24 binary choices are too few to settle a 625-state belief.
        </p>
      )}

      <p style={{ margin: '24px 0 0', maxWidth: '72ch', fontSize: 12, lineHeight: 1.6, color: MS_MUTED }}>
        Simplified from the paper: {MS_LIBRARY} mazes instead of 46 to 263, each maze reduced to its three forks, and the four
        scale factors set by hand. The 625-state grid, the choice model and the exact gain calculation are unchanged.
      </p>
    </div>
  );
}

window.MazeSim = MazeSim;
