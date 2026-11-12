// Walkable version of the selection loop on the Diagnostic Mazes page.
// The belief grid, the choice model and the expected-gain calculation are the ones in the paper.
// The maze library is small, and every maze is three forks in a row along one corridor.
const MS_INK = '#0a0a0a';
const MS_MUTED = 'rgba(10,10,10,0.68)';
const MS_RULE = 'rgba(10,10,10,0.14)';
const MS_AXES = ['Explore', 'Save effort', 'Collect', 'Take risks'];
const MS_NOUN = ['exploring', 'saving effort', 'collecting', 'taking risks'];
const MS_LEVELS = [0, 0.25, 0.5, 0.75, 1];
const MS_SCALE = [1, 0.4, 1, 1];    // set by hand here; the paper calibrates these four against 18 annotated forks
const MS_LIBRARY = 24, MS_FORKS = 3, MS_ROUNDS = 8;
const MS_COLS = 19, MS_ROWS = 7, MS_MID = 3, MS_CELL = 30;   // drawing grid
const MS_STEP = 70;                 // ms the dot takes per cell
const MS_PAUSE = 1500;              // ms a finished maze stays on screen

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

// A fork is an upper path (a) and a lower path (b) between the same two cells, d columns apart.
// `reach` is how many rows a path swings away from the corridor. Both swing out, so the two paths never touch.
// Steps are the cells of the path as drawn. The contrast vector is the scaled, normalised
// difference between the two paths' counts, the way the paper sums cell features per branch.
function msFork(rand) {
  const n = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  const kind = n(0, 3), d = n(3, 4);
  const a = { rooms: 0, items: 0, risk: 0 }, b = { rooms: 0, items: 0, risk: 0 };
  if (kind === 0) { b.reach = n(1, 2); a.reach = Math.min(2, b.reach + n(0, 1)); a.rooms = n(1, 2); }   // side rooms, same length or longer
  if (kind === 1) { a.reach = n(1, 2); b.reach = Math.min(3, a.reach + n(1, 2)); }                      // short against long
  if (kind === 2) { b.reach = n(1, 2); a.reach = Math.min(3, b.reach + n(0, 1)); a.items = n(1, 3); }   // items, sometimes off the short path
  if (kind === 3) { a.reach = n(1, 2); b.reach = Math.min(3, a.reach + n(1, 2)); a.risk = n(1, 3); }    // shortcut through a risk zone
  if (rand() < 0.35) { if (kind === 2) b.rooms = 1; else b.items = 1; }
  for (const br of [a, b]) {
    br.steps = 2 * br.reach + d - 1;
    br.risk = Math.min(br.risk, br.steps);
    br.items = Math.min(br.items, br.steps - br.risk);
  }
  const diff = [a.rooms - b.rooms, b.steps - a.steps, a.items - b.items, a.risk - b.risk].map((v, i) => v * MS_SCALE[i]);
  const len = Math.hypot(...diff);
  const phi = diff.map((v) => v / len);
  // P(take the upper path | preferences) = sigmoid(theta . phi), no bias term
  const p = MS_THETA.map((t) => 1 / (1 + Math.exp(-(t[0] * phi[0] + t[1] * phi[1] + t[2] * phi[2] + t[3] * phi[3]))));
  return { a, b, d, phi, p };
}

// Put three forks on the drawing grid: start cell, then fork, one joining cell, fork, joining cell, fork, exit.
function msLayout(forks) {
  const trunk = [[0, MS_MID]];
  let col = 1;
  forks.forEach((f) => {
    f.col = col;
    for (const [br, side] of [[f.a, -1], [f.b, 1]]) {
      const cells = [];
      for (let i = 1; i <= br.reach; i++) cells.push([col, MS_MID + side * i]);
      for (let j = 1; j < f.d; j++) cells.push([col + j, MS_MID + side * br.reach]);
      for (let i = br.reach; i >= 1; i--) cells.push([col + f.d, MS_MID + side * i]);
      br.cells = cells;
      const run = cells.filter(([x]) => x > col && x < col + f.d);
      br.roomAt = (br.rooms === 1 ? [run[run.length >> 1]] : br.rooms ? [run[0], run[run.length - 1]] : []).map(([x, y]) => [x, y + side, side]);
      const first = Math.floor((cells.length - br.risk) / 2);
      br.riskAt = cells.slice(first, first + br.risk);
      const free = cells.filter((c) => !br.riskAt.includes(c));
      br.itemAt = Array.from({ length: br.items }, (_, i) => free[Math.floor(((i + 0.5) * free.length) / br.items)]);
    }
    trunk.push([col, MS_MID], [col + f.d, MS_MID], [col + f.d + 1, MS_MID]);
    col += f.d + 2;
  });
  return { forks, trunk, cols: col };
}

const MS_MAZES = (() => {
  const rand = msRandom(16460);
  return Array.from({ length: MS_LIBRARY }, () => msLayout(Array.from({ length: MS_FORKS }, () => msFork(rand))));
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

function msUpdate(belief, fork, tookUpper) {
  const next = new Float64Array(belief.length);
  let total = 0;
  for (let s = 0; s < next.length; s++) { next[s] = belief[s] * (tookUpper ? fork.p[s] : 1 - fork.p[s]); total += next[s]; }
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
  const gains = MS_MAZES.map((m) => msGain(m.forks, belief));
  let cur = -1;
  gains.forEach((g, i) => { if (!used.includes(i) && (cur < 0 || g > gains[cur])) cur = i; });
  return { cur, gains, route: [[0, MS_MID], [1, MS_MID]], at: 0, answers: MS_MAZES[cur].forks.map(() => null) };
}

function msStart(hidden) {
  const belief = new Float64Array(MS_THETA.length).fill(1 / MS_THETA.length);
  return { belief, used: [], round: 0, done: false, hidden, said: '', ...msPick(belief, []) };
}

const msList = (words) => (words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`);

function msPathText(br) {
  const part = (v, one, many) => (v ? [`${v} ${v === 1 ? one : many}`] : []);
  return [`${br.steps} steps`, ...part(br.items, 'item', 'items'), ...part(br.risk, 'risk cell', 'risk cells'), ...part(br.rooms, 'side room', 'side rooms')].join(', ');
}

// One plain sentence for a choice: which path, and which way it moves the estimate.
function msSay(f, tookUpper, who) {
  const mine = tookUpper ? f.a : f.b, other = tookUpper ? f.b : f.a;
  const length = mine.steps < other.steps ? 'shorter ' : mine.steps > other.steps ? 'longer ' : '';
  const feats = [mine.items && (mine.items > 1 ? 'with items' : 'with an item'), mine.risk && 'through the risk zone', mine.rooms && (mine.rooms > 1 ? 'past side rooms' : 'past a side room')].filter(Boolean);
  const path = length || feats.length ? `the ${length}path${feats.length ? ` ${feats.join(' and ')}` : ''}` : `the ${tookUpper ? 'upper' : 'lower'} path`;
  const lean = f.phi.map((v) => (tookUpper ? v : -v));
  const toward = MS_NOUN.filter((_, i) => lean[i] > 0.15), away = MS_NOUN.filter((_, i) => lean[i] < -0.15);
  const counts = [toward.length && `toward ${msList(toward)}`, away.length && `away from ${msList(away)}`].filter(Boolean).join(' and ');
  return `${who} took ${path}. That counts ${counts}.`;
}

// What a maze mostly tests: the axes its three forks load on most.
function msTests(forks) {
  const load = MS_NOUN.map((_, i) => forks.reduce((sum, f) => sum + Math.abs(f.phi[i]), 0));
  const order = load.map((v, i) => i).sort((x, y) => load[y] - load[x]);
  return msList(order.filter((i, rank) => rank === 0 || (rank === 1 && load[i] > 0.6 * load[order[0]])).map((i) => MS_NOUN[i]));
}

function MsMaze({ maze, answers, route, at, waiting, fast, onPick }) {
  const [hover, setHover] = React.useState(null);
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = MS_CELL, shift = ((MS_COLS - maze.cols) / 2) * C;
  const mid = ([x, y]) => [shift + (x + 0.5) * C, (y + 0.5) * C];
  const walked = route.slice(0, at + 1);
  const passed = new Set(walked.map(([x, y]) => `${x},${y}`));
  const cell = ([x, y], key, stroke) => <rect key={key} x={shift + x * C + 0.5} y={y * C + 0.5} width={C - 1} height={C - 1} fill="#fff" stroke={stroke} strokeWidth="1" />;
  const [dx, dy] = mid(route[at]);
  const exit = mid(maze.trunk[maze.trunk.length - 1]);

  return (
    <svg viewBox={`0 0 ${MS_COLS * C} ${MS_ROWS * C}`} role="img" aria-label="A maze with three forks" style={{ display: 'block', width: '100%', maxWidth: 720, height: 'auto' }}>
      {maze.trunk.map((c, i) => cell(c, `t${i}`, MS_MUTED))}
      {maze.forks.map((f, k) => [[f.a, true], [f.b, false]].map(([br, upper]) => {
        const open = waiting === k, lit = open && hover === `${k}${upper}`;
        const stroke = lit ? MS_INK : MS_MUTED;
        return (
          <g key={`${k}${upper}`} opacity={answers[k] !== null && answers[k] !== upper ? 0.22 : 1}>
            {br.cells.map((c, i) => cell(c, `c${i}`, stroke))}
            {br.riskAt.map(([x, y], i) => <rect key={`k${i}`} x={shift + x * C + 3} y={y * C + 3} width={C - 6} height={C - 6} fill="rgba(10,10,10,0.8)" />)}
            {br.roomAt.map(([x, y, side], i) => (
              <g key={`r${i}`}>
                <line x1={shift + (x + 0.5) * C} y1={(y + 0.5) * C} x2={shift + (x + 0.5) * C} y2={(y + 0.5 - side * 0.5) * C} stroke={MS_INK} strokeWidth="1" />
                <rect x={shift + x * C + 7} y={y * C + 7} width={C - 14} height={C - 14} fill="#fff" stroke={MS_INK} strokeWidth="1" />
              </g>
            ))}
            {br.itemAt.filter(([x, y]) => !passed.has(`${x},${y}`)).map((c, i) => <circle key={`i${i}`} cx={mid(c)[0]} cy={mid(c)[1]} r={C * 0.2} fill="#fff" stroke={MS_INK} strokeWidth="1.2" />)}
            {lit && <polyline points={br.cells.map((c) => mid(c).join(',')).join(' ')} fill="none" stroke={MS_INK} strokeWidth="1.5" strokeDasharray="3 4" />}
            {open && (
              <polyline
                points={br.cells.map((c) => mid(c).join(',')).join(' ')} fill="none" stroke="transparent" strokeWidth={C} strokeLinecap="square"
                style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                onMouseEnter={() => setHover(`${k}${upper}`)} onMouseLeave={() => setHover(null)} onClick={() => onPick(k, upper)}
              />
            )}
          </g>
        );
      }))}
      <path d={`M${exit[0] + C * 0.5 + 4} ${exit[1]}h${C * 0.45}m-6 -5l6 5l-6 5`} fill="none" stroke={MS_INK} strokeWidth="1.2" />
      {walked.length > 1 && <polyline points={walked.map((c) => mid(c).join(',')).join(' ')} fill="none" stroke={MS_INK} strokeWidth="1.5" strokeLinejoin="round" style={{ pointerEvents: 'none' }} />}
      <circle r={C * 0.24} fill={MS_INK} stroke="#fff" strokeWidth="1.5" style={{ transform: `translate(${dx}px, ${dy}px)`, transition: still ? 'none' : `transform ${fast ? MS_STEP / 2 : MS_STEP}ms linear`, pointerEvents: 'none' }} />
    </svg>
  );
}

function MazeSim() {
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [s, setS] = React.useState(() => msStart(null));
  const [numbers, setNumbers] = React.useState(false);
  const maze = MS_MAZES[s.cur], forks = maze.forks;
  const arrived = s.at === s.route.length - 1;
  const next = s.answers.indexOf(null);              // the fork the dot is walking to, -1 after the third
  const waiting = arrived && !s.done ? next : -1;    // the fork that can be answered now
  const who = s.hidden ? 'The player' : 'You';

  const pick = (k, upper) => setS((old) => {
    if (old.done || old.answers[k] !== null || old.at !== old.route.length - 1 || old.answers.indexOf(null) !== k) return old;
    const f = MS_MAZES[old.cur].forks[k], end = f.col + f.d;
    const answers = old.answers.slice();
    answers[k] = upper;
    const onward = k < MS_FORKS - 1 ? [[end + 1, MS_MID], [end + 2, MS_MID]] : [[end + 1, MS_MID]];
    return {
      ...old, answers, belief: msUpdate(old.belief, f, upper), said: msSay(f, upper, old.hidden ? 'The player' : 'You'),
      route: [...old.route, ...(upper ? f.a : f.b).cells, [end, MS_MID], ...onward],
    };
  });

  // The dot walks one cell at a time.
  React.useEffect(() => {
    if (arrived) return;
    const t = setTimeout(() => setS((old) => ({ ...old, at: still ? old.route.length - 1 : Math.min(old.at + 1, old.route.length - 1) })), still ? 0 : s.hidden ? MS_STEP / 2 : MS_STEP);
    return () => clearTimeout(t);
  }, [s.at, s.route.length]);

  // Out of the maze: stop after the last round, otherwise pick the next maze.
  React.useEffect(() => {
    if (next >= 0 || !arrived || s.done) return;
    const t = setTimeout(() => setS((old) => {
      if (old.round + 1 >= MS_ROUNDS) return { ...old, done: true };
      const used = [...old.used, old.cur];
      return { ...old, used, round: old.round + 1, said: '', ...msPick(old.belief, used) };
    }), s.hidden ? MS_PAUSE * 0.6 : MS_PAUSE);
    return () => clearTimeout(t);
  }, [next, arrived, s.done, s.round]);

  // A simulated player picks a path by the same choice model, from preferences the system cannot see.
  React.useEffect(() => {
    if (!s.hidden || waiting < 0) return;
    const upper = Math.random() < forks[waiting].p[MS_THETA.indexOf(s.hidden)];
    const t = setTimeout(() => pick(waiting, upper), 300);
    return () => clearTimeout(t);
  }, [s.hidden, waiting, s.cur]);

  const marg = msMarginals(s.belief);
  const choices = s.round * MS_FORKS + s.answers.filter((v) => v !== null).length;
  const top = Math.max(...s.gains), low = Math.min(...s.gains), floor = low - (top - low) * 0.25;
  const error = s.hidden ? Math.hypot(...marg.map((m, i) => m.mean - s.hidden[i])) : 0;
  const label = { fontSize: 10, color: MS_MUTED, textTransform: 'uppercase', letterSpacing: 1.2 };
  const small = { fontSize: 12, lineHeight: 1.6, color: MS_MUTED };
  const link = { border: 0, padding: 0, background: 'none', font: 'inherit', fontWeight: 300, color: MS_INK, cursor: 'pointer', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 };

  const why = s.round === 0
    ? `${s.hidden ? 'The system knows nothing about this player yet' : 'The system knows nothing about you yet'}, so it starts with the maze expected to tell it the most.`
    : `Of the ${MS_LIBRARY - s.used.length} mazes left, this is the one expected to narrow the estimate the most. Its forks mostly test ${msTests(forks)}.`;

  return (
    <div style={{ fontSize: 15, lineHeight: 1.65, color: MS_INK }}>
      <p style={{ margin: 0, maxWidth: '64ch' }}>
        {s.hidden
          ? 'This player\'s preferences are hidden from the system. It only sees which paths the player takes.'
          : 'Walk the maze. At each fork, pick a path.'}
      </p>

      <div style={{ ...label, marginTop: 28 }}>Maze {s.round + 1} of {MS_ROUNDS}</div>
      <p style={{ ...small, margin: '6px 0 14px', maxWidth: '72ch' }}>{why}</p>
      <MsMaze maze={maze} answers={s.answers} route={s.route} at={s.at} waiting={s.hidden ? -1 : waiting} fast={!!s.hidden} onPick={pick} />
      <div style={{ fontSize: 10.5, color: MS_MUTED, marginTop: 8, letterSpacing: 0.4 }}>
        Circle: item. Dark cell: risk zone. Small square: side room.
      </div>

      <div style={{ marginTop: 18, minHeight: 78 }}>
        {s.said && <p style={{ margin: 0, maxWidth: '64ch' }}>{s.said}</p>}
        {waiting >= 0 && (
          <p style={{ ...small, margin: s.said ? '8px 0 0' : 0, maxWidth: '72ch' }}>
            Fork {waiting + 1}. Upper path: {msPathText(forks[waiting].a)}. Lower path: {msPathText(forks[waiting].b)}.
            {!s.hidden && (
              <span> <button style={{ ...link, fontSize: 12 }} onClick={() => pick(waiting, true)}>Take the upper path</button> · <button style={{ ...link, fontSize: 12 }} onClick={() => pick(waiting, false)}>Take the lower path</button></span>
            )}
          </p>
        )}
      </div>

      <div style={{ ...label, marginTop: 20, marginBottom: 4 }}>{s.hidden ? 'What the system thinks this player prefers' : 'What the system thinks you prefer'}</div>
      <div style={{ maxWidth: 520 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 16, fontSize: 10, color: MS_MUTED }}>
          <span /><span style={{ display: 'flex', justifyContent: 'space-between' }}><span>less</span><span>more</span></span>
        </div>
        {marg.map((m, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 16, alignItems: 'center', padding: '7px 0', borderTop: `1px solid ${MS_RULE}` }}>
            <span style={{ fontSize: 13 }}>{MS_AXES[i]}</span>
            <span style={{ position: 'relative', height: 12, display: 'block' }}>
              <span style={{ position: 'absolute', left: '50%', top: -3, bottom: -3, borderLeft: `1px solid ${MS_MUTED}` }} />
              <span style={{
                position: 'absolute', top: 2, bottom: 2, background: MS_INK,
                left: `${Math.min(m.mean, 0.5) * 100}%`, width: `${Math.abs(m.mean - 0.5) * 100}%`,
                transition: still ? 'none' : 'left .3s ease, width .3s ease',
              }} />
              {s.done && s.hidden && <span style={{ position: 'absolute', top: -4, bottom: -4, left: `calc(${s.hidden[i] * 100}% - 1px)`, width: 3, background: MS_INK }} />}
            </span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${MS_RULE}` }} />
      </div>
      <p style={{ ...small, margin: '8px 0 0', maxWidth: '72ch' }}>
        Every bar starts in the middle. Each choice moves it a little. {choices} of {MS_ROUNDS * MS_FORKS} choices made.
      </p>

      {s.done && (
        <p style={{ margin: '20px 0 0', maxWidth: '64ch' }}>
          {s.hidden
            ? `The thick marks show this player's real preferences: ${s.hidden.map((v, i) => `${MS_NOUN[i]} ${v.toFixed(2)}`).join(', ')}. The estimate is ${error.toFixed(2)} away from them.`
            : `${MS_ROUNDS} mazes, ${MS_ROUNDS * MS_FORKS} choices.`}
          {' '}The estimate is still loose. The paper finds the same: 24 two-way choices are too few to pin a person down.
        </p>
      )}

      <p style={{ ...small, margin: '20px 0 0' }}>
        <button style={{ ...link, fontSize: 12 }} onClick={() => setS(msStart(MS_THETA[Math.floor(Math.random() * MS_THETA.length)]))}>Let a simulated player walk instead</button> ·{' '}
        <button style={{ ...link, fontSize: 12 }} onClick={() => setS(msStart(null))}>Start again</button> ·{' '}
        <button style={{ ...link, fontSize: 12 }} onClick={() => setNumbers((v) => !v)}>{numbers ? 'Hide the numbers' : 'Show the numbers'}</button>
      </p>

      {numbers && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${MS_RULE}`, fontSize: 12, color: MS_MUTED, fontVariantNumeric: 'tabular-nums' }}>
          <div style={label}>Expected gain of every maze in the library</div>
          <div style={{ marginTop: 10, height: 44, display: 'flex', alignItems: 'flex-end', gap: 3, borderBottom: `1px solid ${MS_RULE}` }}>
            {s.gains.map((g, i) => (
              <span key={i} style={{
                flex: 1, height: Math.max(2, ((g - floor) / (top - floor || 1)) * 44), boxSizing: 'border-box',
                background: i === s.cur ? MS_INK : s.used.includes(i) ? 'transparent' : 'rgba(10,10,10,0.22)',
                boxShadow: s.used.includes(i) ? `inset 0 0 0 1px ${MS_RULE}` : 'none',
              }} />
            ))}
          </div>
          <p style={{ margin: '8px 0 0', maxWidth: '72ch' }}>
            One bar per maze, from {low.toFixed(4)} to {top.toFixed(4)} nats under the estimate at the start of this maze. The bars start just below the
            lowest value so the differences show. Black is the maze on screen ({s.gains[s.cur].toFixed(4)} nats). Outlined ones were shown already.
          </p>

          <div style={{ ...label, marginTop: 20 }}>What taking the upper path counts for, per fork</div>
          {forks.map((f, k) => (
            <div key={k} style={{ padding: '6px 0', borderTop: k ? `1px solid ${MS_RULE}` : 'none', marginTop: k ? 0 : 8 }}>
              Fork {k + 1}: {f.phi.map((v, i) => `${MS_AXES[i].toLowerCase()} ${v < 0 ? '−' : '+'}${Math.abs(v).toFixed(2)}`).join(' · ')}
            </div>
          ))}

          <div style={{ ...label, marginTop: 20, marginBottom: 12 }}>Probability of each of the five levels, per axis</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px 24px' }}>
            {marg.map((m, i) => (
              <div key={i}>
                <div style={{ height: 48, display: 'flex', alignItems: 'flex-end', gap: 4, borderBottom: `1px solid ${MS_INK}`, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, right: 0, bottom: 48 * 0.4, borderTop: `1px dashed ${MS_RULE}` }} />
                  {m.bars.map((v, j) => <span key={j} style={{ flex: 1, height: Math.min(48, (v / 0.5) * 48), background: MS_INK, opacity: 0.8 }} />)}
                </div>
                <div style={{ marginTop: 4 }}>{MS_AXES[i]}, mean {m.mean.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <p style={{ margin: '8px 0 0' }}>Levels 0, 0.25, 0.5, 0.75 and 1 from left to right. The dashed line is the starting point, 0.2 everywhere.</p>
        </div>
      )}

      <p style={{ ...small, margin: '24px 0 0', maxWidth: '72ch' }}>
        Simplified from the paper: {MS_LIBRARY} mazes instead of 46 to 263, every maze drawn as three forks in a row along one corridor,
        and the four scale factors set by hand. The 625-state grid, the choice model and the exact gain calculation are unchanged.
      </p>
    </div>
  );
}

window.MazeSim = MazeSim;
