// The name, bent from one continuous line. Pull the loose end and the form comes
// undone into a straight thread, last part first. Let go after a real pull and the
// thread winds itself into the next form (Yao Wang, 王瑶, a flower, then back); after a small
// tug it goes back to the same one. One part of the form settles late.
//
// Each form is a list of parts, each part a run of corners [x, y, r] in pen order.
// The line runs straight from corner to corner and bends with radius r; 0 is a sharp fold.
// Baseline at y = 100, x-height at 50, cap height at 10. Parts continue from one another,
// and what stands on the baseline is joined by it.
//
// fine: the form has short strokes that double back a lot. Wound in like the letters it
// shakes, so it moves differently: the loose end glides straight home instead of following
// every stroke, what has formed stays put, no part settles late, and on release the form
// is pulled flat in one motion instead of coming undone stroke by stroke.
const RN_FORMS = [
  {
    label: 'Yao Wang',
    parts: [
      [[0, 10, 0], [22, 54, 0], [44, 10, 0], [22, 54, 0], [22, 100, 0]],
      [[74, 100, 0], [74, 50, 0], [34, 50, 20], [34, 100, 20]],
      [[128, 100, 21], [128, 50, 21], [86, 50, 21], [86, 100, 21]],
      [[174, 100, 0], [160, 10, 0], [174, 100, 0], [188, 44, 0], [202, 100, 0], [216, 10, 0], [202, 100, 0]],
      [[260, 100, 0], [260, 50, 0], [220, 50, 20], [220, 100, 20]],
      [[272, 100, 0], [272, 50, 0], [310, 50, 18], [310, 100, 0]],
      [[362, 100, 0], [362, 50, 0], [322, 50, 20], [322, 100, 20], [362, 100, 0], [362, 134, 10], [328, 134, 10], [328, 117, 0], [390, 117, 0]],
    ],
  },
  {
    label: '王瑶',
    fine: true,
    parts: [
      // 王
      [[8, 14, 0], [72, 14, 0], [40, 14, 0], [40, 55, 0], [14, 55, 0], [66, 55, 0], [40, 55, 0], [40, 100, 0], [0, 100, 0], [80, 100, 0]],
      // 瑶, left side
      [[100, 100, 0], [132, 86, 0], [116, 93, 0], [116, 54, 0], [103, 54, 0], [129, 54, 0], [116, 54, 0], [116, 18, 0], [102, 18, 0], [130, 18, 0]],
      // 瑶, right side: top stroke and the three ticks as one zigzag
      [[148, 21, 0], [192, 12, 0], [184, 46, 0], [171, 34, 0], [172, 46, 0], [155, 34, 0], [158, 46, 0]],
      // 瑶, right side below
      [[163, 52, 0], [151, 63, 0], [155, 59, 0], [188, 59, 0], [170, 59, 0], [170, 73, 0], [144, 73, 0], [196, 73, 0], [170, 73, 0], [170, 100, 0],
        [152, 100, 0], [152, 84, 0], [152, 100, 0], [188, 100, 0], [188, 84, 0], [188, 100, 0], [212, 100, 0]],
    ],
  },
  {
    // a small flower with a line running back and forth on either side of it
    label: 'A small flower',
    fine: true,
    parts: [
      [[0, 100, 0], [0, 22, 6.5], [13, 22, 6.5], [13, 100, 6.5], [26, 100, 6.5], [26, 22, 6.5], [39, 22, 6.5], [39, 100, 6.5], [52, 100, 6.5], [52, 22, 6.5], [65, 22, 6.5], [65, 75.2, 4]],
      [[115.4, 58.8, 0], [81, 65.1, 12], [94.6, 23.3, 12], [118.7, 48.7, 0], [102, 17.9, 12], [146, 17.9, 12], [129.3, 48.7, 0]],
      [[153.4, 23.3, 12], [167, 65.1, 12], [132.6, 58.8, 0], [164.2, 73.9, 12], [128.6, 99.8, 12], [124, 65, 0], [119.4, 99.8, 12], [83.8, 73.9, 12], [115.4, 58.8, 0], [132.6, 58.8, 0]],
      [[183, 75.2, 4], [183, 100, 6.5], [196, 100, 6.5], [196, 22, 6.5], [209, 22, 6.5], [209, 100, 6.5], [222, 100, 6.5], [222, 22, 6.5], [235, 22, 6.5], [235, 100, 6.5], [248, 100, 6.5], [248, 22, 6.5], [261, 22, 6.5], [261, 100, 0]],
    ],
  },
];
const RN_SCALE = 0.42;
const RN_TOP = 6;             // grid units trimmed above the caps
const RN_W = 398, RN_H = 142;
const RN_STEP = 2;            // px between points on the line
const RN_REEL = 300;          // px of thread wound in per second
const RN_UNDO = 1500;         // px per second at which the rest of a form lets go before the next one winds
const RN_NEXT = 60;           // px of thread that has to be out for a release to move on to the next form
const RN_FOLLOW = 20;         // how fast the line follows, per second
const RN_CRISP = 70;          // the same for formed strokes of a fine form
const RN_FLAT = 0.3;          // seconds a fine form takes to be pulled flat
const RN_LAG = 2.4;           // the same for the part that settles late
const RN_LATE = 0.45;         // seconds the late part keeps lagging after the rest is home
const RN_DOT = '#00b7d6';     // the pull tab at the loose end
const RN_OPEN = 250;          // ms the page shows the thread pulled out before winding the name in
const RN_NUDGE = 2600;        // ms after that, the tab slides out and back once: it can be pulled

// Points along the whole line, and the arc length at which each part ends.
function ribbonLine(parts) {
  const corners = [], last = [];
  for (const cs of parts) { corners.push(...cs); last.push(corners.length - 1); }
  const pts = [[corners[0][0], corners[0][1]]], marks = [];
  const lineTo = (x, y) => {
    const [px, py] = pts[pts.length - 1];
    const k = Math.max(1, Math.ceil((Math.hypot(x - px, y - py) * RN_SCALE) / RN_STEP));
    for (let j = 1; j <= k; j++) pts.push([px + ((x - px) * j) / k, py + ((y - py) * j) / k]);
  };
  for (let i = 1; i < corners.length; i++) {
    const [x, y, r] = corners[i], next = corners[i + 1];
    if (!r || !next) lineTo(x, y);
    else {
      let ix = x - corners[i - 1][0], iy = y - corners[i - 1][1], ox = next[0] - x, oy = next[1] - y;
      const il = Math.hypot(ix, iy), ol = Math.hypot(ox, oy);
      ix /= il; iy /= il; ox /= ol; oy /= ol;
      const turn = Math.acos(Math.max(-1, Math.min(1, ix * ox + iy * oy)));
      const side = Math.sign(ix * oy - iy * ox) || 1;
      const t = r * Math.tan(turn / 2);
      lineTo(x - ix * t, y - iy * t);
      const cx = x - ix * t - iy * side * r, cy = y - iy * t + ix * side * r;
      const a0 = Math.atan2(y - iy * t - cy, x - ix * t - cx);
      const k = Math.max(2, Math.ceil(r * turn * RN_SCALE));
      for (let j = 1; j <= k; j++) {
        const a = a0 + (side * turn * j) / k;
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
    }
    if (last.includes(i)) marks.push(pts.length - 1);
  }
  const rest = pts.map(([x, y]) => [x * RN_SCALE, (y - RN_TOP) * RN_SCALE]);
  const arc = [0];
  for (let i = 1; i < rest.length; i++) arc.push(arc[i - 1] + Math.hypot(rest[i][0] - rest[i - 1][0], rest[i][1] - rest[i - 1][1]));
  return { rest, arc, ends: marks.map((i) => arc[i]) };
}

if (!document.getElementById('ribbon-name-kf')) {
  const s = document.createElement('style');
  s.id = 'ribbon-name-kf';
  s.textContent = '@keyframes rnBlink{0%,100%{opacity:1}50%{opacity:.12}}@keyframes rnNudge{0%,100%{translate:0 0}45%{translate:14px 0}}';
  document.head.appendChild(s);
}

function RibbonName({ ink = '#0a0a0a' }) {
  const svg = React.useRef(null), line = React.useRef(null);
  const dot = React.useRef(null), grip = React.useRef(null);

  React.useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let form = 0;
    let { rest, arc, ends } = ribbonLine(RN_FORMS[form].parts);
    let n = rest.length, L = arc[n - 1];
    let pos = rest.map((p) => p.slice());

    let mode = 'rest';              // rest · open · drag · undo · reel · settle
    let front = L;                  // arc length where the form stops and the straight thread starts
    let end = rest[n - 1].slice();  // where the loose end is held
    let stretch = 1;                // straight thread drawn per unit of line still to wind in
    let grab = [0, 0], late = null, lateFor = 0, frame = 0, last = 0, opening = 0;
    let nudging;
    let fine = false, held = end.slice(), front0 = 0, flatFrom = null, flatT = 0;

    const restAt = (l) => {
      let lo = 0, hi = n - 1;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (arc[mid] <= l) lo = mid; else hi = mid; }
      const t = Math.min(1, Math.max(0, (l - arc[lo]) / (arc[hi] - arc[lo] || 1)));
      return [rest[lo][0] + (rest[hi][0] - rest[lo][0]) * t, rest[lo][1] + (rest[hi][1] - rest[lo][1]) * t];
    };

    // The thread is taut: find how much of the line has to come out straight to reach the held end.
    const findFront = () => {
      let after = Math.hypot(end[0] - rest[n - 1][0], end[1] - rest[n - 1][1]);
      for (let i = n - 2; i >= 0; i--) {
        const g = Math.hypot(end[0] - rest[i][0], end[1] - rest[i][1]) - (L - arc[i]);
        if (g <= 0) return arc[i] + (arc[i + 1] - arc[i]) * (-g / (after - g || 1));
        after = g;
      }
      return 0;
    };

    const draw = () => {
      let path = '';
      for (let i = 0; i < n; i++) path += `${i ? 'L' : 'M'}${pos[i][0].toFixed(1)} ${pos[i][1].toFixed(1)}`;
      line.current.setAttribute('d', path);
      for (const el of [dot.current, grip.current]) {
        el.setAttribute('cx', pos[n - 1][0]); el.setAttribute('cy', pos[n - 1][1]);
      }
    };

    const load = (i) => {
      form = i;
      ({ rest, arc, ends } = ribbonLine(RN_FORMS[form].parts));
      n = rest.length; L = arc[n - 1];
      fine = !!RN_FORMS[form].fine;
      svg.current.setAttribute('aria-label', RN_FORMS[form].label);
    };

    // Wind in what is out. One of the parts that came fully undone settles late.
    const reel = () => {
      const from = restAt(front);
      stretch = L - front > 1 ? Math.hypot(end[0] - from[0], end[1] - from[1]) / (L - front) : 1;
      const undone = ends.map((e, k) => [k ? ends[k - 1] : 0, e]).filter(([a]) => a >= front - 1);
      late = undone.length && !fine ? undone[Math.floor(Math.random() * undone.length)] : null;
      held = end.slice(); front0 = front;
      lateFor = RN_LATE;
      mode = 'reel';
      wake();
    };

    // The old form is all out as one straight thread: lay the next form's line along it and wind that in.
    const next = () => {
      const a = pos[0].slice(), b = pos[n - 1].slice();
      load((form + 1) % RN_FORMS.length);
      pos = arc.map((l) => [a[0] + ((b[0] - a[0]) * l) / L, a[1] + ((b[1] - a[1]) * l) / L]);
      front = 0; end = b;
      reel();
    };

    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      if (mode === 'flat') {
        // every point goes straight to its place on the thread, so the form flattens without spikes
        flatT = Math.min(1, flatT + dt / RN_FLAT);
        const e = 1 - Math.pow(1 - flatT, 3);
        for (let i = 0; i < n; i++) {
          const tx = rest[0][0] + ((end[0] - rest[0][0]) * arc[i]) / L, ty = rest[0][1] + ((end[1] - rest[0][1]) * arc[i]) / L;
          pos[i][0] = flatFrom[i][0] + (tx - flatFrom[i][0]) * e; pos[i][1] = flatFrom[i][1] + (ty - flatFrom[i][1]) * e;
        }
        if (flatT === 1) next();
        draw();
        frame = requestAnimationFrame(step);
        return;
      }
      const base = restAt(front);
      let ux = end[0] - base[0], uy = end[1] - base[1];
      const ul = Math.hypot(ux, uy) || 1;
      ux /= ul; uy /= ul;
      if (mode === 'drag') {
        front = findFront();
        if (front === 0) end = [rest[0][0] + ux * L, rest[0][1] + uy * L];
      } else if (mode === 'undo') {
        front = Math.max(0, front - RN_UNDO * dt);
      } else if (mode === 'reel') {
        front = Math.min(L, front + RN_REEL * dt);
        if (fine) {
          const p = L - front0 > 1 ? (front - front0) / (L - front0) : 1, e = p * p * (3 - 2 * p);
          end = [held[0] + (rest[n - 1][0] - held[0]) * e, held[1] + (rest[n - 1][1] - held[1]) * e];
        } else end = [base[0] + ux * (L - front) * stretch, base[1] + uy * (L - front) * stretch];
        if (front === L) mode = 'settle';
      } else if (mode === 'settle' && late) {
        lateFor -= dt;
        if (lateFor <= 0) late = null;
      }
      const from = restAt(front);
      const span = Math.hypot(end[0] - from[0], end[1] - from[1]);
      const per = L - front > 0.01 ? span / (L - front) : 1;
      if (span > 0.01) { ux = (end[0] - from[0]) / span; uy = (end[1] - from[1]) / span; }
      let off = 0;
      for (let i = 0; i < n; i++) {
        const over = arc[i] - front;
        const tx = over <= 0 ? rest[i][0] : from[0] + ux * over * per;
        const ty = over <= 0 ? rest[i][1] : from[1] + uy * over * per;
        // the late part rides the thread like the rest and only lags once it is its turn to form
        const slow = late && over <= 0 && mode !== 'drag' && arc[i] >= late[0] && arc[i] <= late[1];
        const k = 1 - Math.exp(-(slow ? RN_LAG : fine && over <= 0 && mode !== 'drag' ? RN_CRISP : RN_FOLLOW) * dt);
        pos[i][0] += (tx - pos[i][0]) * k; pos[i][1] += (ty - pos[i][1]) * k;
        off = Math.max(off, Math.abs(tx - pos[i][0]), Math.abs(ty - pos[i][1]));
      }
      if (mode === 'undo' && front === 0 && off < 1.5) next();
      if (mode === 'settle' && off < 0.05) {
        mode = 'rest';
        for (let i = 0; i < n; i++) { pos[i][0] = rest[i][0]; pos[i][1] = rest[i][1]; }
      }
      draw();
      frame = mode === 'rest' ? 0 : requestAnimationFrame(step);
    };
    const wake = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(step); } };

    const local = (e) => {
      const r = svg.current.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const onDown = (e) => {
      const p = local(e);
      grab = [p[0] - pos[n - 1][0], p[1] - pos[n - 1][1]];
      end = pos[n - 1].slice();
      mode = 'drag'; late = null;
      clearTimeout(opening); clearTimeout(nudging);
      try { grip.current.setPointerCapture(e.pointerId); } catch (err) {}
      grip.current.style.cursor = 'grabbing';
      dot.current.style.animation = 'none';   // found: no need to keep blinking
      e.preventDefault();
      wake();
    };
    const onMove = (e) => {
      if (mode !== 'drag') return;
      const p = local(e);
      end = [p[0] - grab[0], p[1] - grab[1]];
    };
    const onUp = () => {
      if (mode !== 'drag') return;
      grip.current.style.cursor = 'grab';
      const far = L - front > RN_NEXT;
      if (reduced) {
        if (far) load((form + 1) % RN_FORMS.length);
        pos = rest.map((p) => p.slice());
        front = L; end = rest[n - 1].slice(); mode = 'settle';
      } else if (far && fine) { flatFrom = pos.map((q) => q.slice()); flatT = 0; mode = 'flat'; }
      else if (far) mode = 'undo';
      else reel();
    };
    const g = grip.current;
    g.addEventListener('pointerdown', onDown);
    g.addEventListener('pointermove', onMove);
    g.addEventListener('pointerup', onUp);
    g.addEventListener('pointercancel', onUp);
    if (!reduced) {
      // The page opens with the thread pulled out along the baseline to the edge of the column.
      end = [Math.max(rest[n - 1][0] + 40, svg.current.parentElement.clientWidth - 5), (100 - RN_TOP) * RN_SCALE];
      front = findFront();
      const from = restAt(front);
      const ul = Math.hypot(end[0] - from[0], end[1] - from[1]) || 1;
      for (let i = 0; i < n; i++) {
        const over = arc[i] - front;
        if (over > 0) pos[i] = [from[0] + ((end[0] - from[0]) / ul) * over, from[1] + ((end[1] - from[1]) / ul) * over];
      }
      mode = 'open';
      opening = setTimeout(reel, RN_OPEN);
      nudging = setTimeout(() => { if (dot.current && mode !== 'drag' && dot.current.style.animation !== 'none') dot.current.style.animation = 'rnNudge .9s ease-in-out 1, rnBlink 1.3s ease-in-out infinite'; }, RN_OPEN + RN_NUDGE);
    }
    draw();
    return () => {
      clearTimeout(opening); clearTimeout(nudging);
      cancelAnimationFrame(frame);
      g.removeEventListener('pointerdown', onDown);
      g.removeEventListener('pointermove', onMove);
      g.removeEventListener('pointerup', onUp);
      g.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <svg
      ref={svg} role="img" aria-label={RN_FORMS[0].label}
      width={RN_W * RN_SCALE} height={(RN_H - RN_TOP) * RN_SCALE}
      style={{ display: 'block', flex: 'none', overflow: 'visible', position: 'relative', zIndex: 2, pointerEvents: 'none' }}
    >
      <path ref={line} fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="miter" />
      <circle ref={dot} r="4.5" fill={RN_DOT} style={{ animation: still ? 'none' : 'rnBlink 1.3s ease-in-out infinite' }} />
      <circle ref={grip} r="16" fill="transparent" style={{ pointerEvents: 'all', cursor: 'grab', touchAction: 'none' }} />
    </svg>
  );
}

window.RibbonName = RibbonName;
