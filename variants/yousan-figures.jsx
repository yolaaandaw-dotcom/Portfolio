// Aiaigasa figures drawn in the page: the 3D renders are images, every label and line is live type.
// Loaded only by projects/yousan.html. Each figure is laid out on the page's 876px column and scales down with it.
(function () {
  const INK = '#0a0a0a';
  const MUTED = 'rgba(10,10,10,0.68)';
  const RED = '#e02a26';
  const COLW = 876;
  const C2 = 300, C3 = 600;                      // second and third column, shared by all three figures
  const A = 'assets/yousan/';

  const T = {
    label: { fontSize: 10, fontWeight: 400, letterSpacing: 1.2, textTransform: 'uppercase', color: MUTED, lineHeight: '14px' },
    name: { fontSize: 17, fontWeight: 300, letterSpacing: -0.2, color: INK, lineHeight: '22px' },
    call: { fontSize: 12.5, fontWeight: 400, color: INK, lineHeight: '16px' },
    text: { fontSize: 13, fontWeight: 300, color: INK, lineHeight: '20px' },
    note: { fontSize: 12.5, fontWeight: 300, color: MUTED, lineHeight: '18px' },
  };

  // absolutely placed text; `right` aligns its right edge to x, `mid` centres it vertically on y
  function Tx({ x, y, w, t = 'text', right, mid, nowrap = true, children }) {
    const s = { position: 'absolute', top: y, ...T[t], whiteSpace: nowrap ? 'nowrap' : 'normal' };
    if (right) { s.right = COLW - x; s.textAlign = 'right'; } else { s.left = x; }
    if (w) s.width = w;
    if (mid) s.transform = 'translateY(-50%)';
    return <div style={s}>{children}</div>;
  }

  function Frame({ h, id, lines, children }) {
    const ref = React.useRef(null);
    const [k, setK] = React.useState(1);
    React.useLayoutEffect(() => {
      const fit = () => setK(Math.max(0.62, Math.min(1.3, ref.current.clientWidth / COLW)));   // grows with a wider page column, up to 1.3x
      fit();
      const ro = new ResizeObserver(fit); ro.observe(ref.current);
      return () => ro.disconnect();
    }, []);
    return (
      <div ref={ref} style={{ position: 'relative', width: '100%', height: h * k, overflowX: 'auto', overflowY: 'hidden' }}>
        <div style={{ width: COLW * k, height: 1 }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: COLW, height: h, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: 'Roboto, system-ui, sans-serif' }}>
          {children}
          <svg width={COLW} height={h} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
            <defs>
              <marker id={id} markerWidth="7" markerHeight="6" refX="6.5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0 0 L7 3 L0 6 Z" fill={INK} />
              </marker>
            </defs>
            {lines(id)}
          </svg>
        </div>
      </div>
    );
  }
  const Lead = ({ d, id }) => <path d={d} fill="none" stroke={INK} strokeWidth="1" markerEnd={`url(#${id})`} />;
  const Rule = ({ x, y, w }) => <div style={{ position: 'absolute', left: x, top: y, width: w, height: 1, background: INK }} />;
  const Img = ({ src, x, y, w, h }) => <img src={A + src} alt="" style={{ position: 'absolute', left: x, top: y, width: w, height: h, display: 'block' }} />;

  // handle render: 176.2 x 297.8, ring edges and lens measured from the model
  const HW = 176.2, HH = 297.8, RX = 131.1, RU = 91.1, RL = 149.2, LENS = [71, 222];

  function GripStates() {
    const IY = 66;
    const cols = [
      { x: 0, label: 'Idle', name: 'Ordinary use', img: 'r-grip-idle.png', up: null, lo: 'person A',
        text: 'One hand on one ring. Nothing is recorded or played.' },
      { x: C2, label: 'Present', name: 'Two people co-hold', img: 'r-grip-both.png', up: 'person B', lo: 'person A',
        text: 'Two people hold one ring each. The umbrella records the rain sound and a camera view of one side.' },
      { x: C3, label: 'Absent', name: 'One person, both hands', img: 'r-grip-both.png', up: 'person A', lo: 'person A',
        text: 'One person holds both rings. The rain sound plays and the trace is projected inside the canopy, once. Then it is erased.' },
    ];
    return (
      <Frame h={IY + HH + 96} id="ys-a1" lines={(id) => cols.map((c) => (
        <g key={c.x}>
          <Lead id={id} d={`M${c.x + RX + 30} ${IY + RU} H${c.x + RX + 3}`} />
          <Lead id={id} d={`M${c.x + RX + 30} ${IY + RL} H${c.x + RX + 3}`} />
        </g>
      ))}>
        {cols.map((c) => (
          <React.Fragment key={c.x}>
            <Tx x={c.x} y={0} t="label">{c.label}</Tx>
            <Tx x={c.x} y={18} t="name">{c.name}</Tx>
            <Img src={c.img} x={c.x} y={IY} w={HW} h={HH} />
            <Tx x={c.x + RX + 37} y={IY + RU} mid t={c.up ? 'call' : 'note'}>{c.up || 'not touched'}</Tx>
            <Tx x={c.x + RX + 37} y={IY + RL} mid t="call">{c.lo}</Tx>
            <Tx x={c.x} y={IY + HH + 22} w={252} nowrap={false}>{c.text}</Tx>
          </React.Fragment>
        ))}
      </Frame>
    );
  }

  function Exploded() {
    const W = 265.75, H = 442, IX = 146, IY = 0;
    const p = (fx, fy) => [IX + fx * W, IY + fy * H];
    const LX = IX - 18, RXl = IX + W + 22;          // right edge of the left labels, left edge of the right labels
    const [sx, sy] = p(0.50, 0.168), [ux, uy] = p(0.275, 0.205), [lx, ly] = p(0.275, 0.372);
    const ry = (uy + ly) / 2;
    const [gx, gy] = p(0.835, 0.30), [bx, by] = p(0.815, 0.488), [nx, ny] = p(0.497, 0.757);
    const [cx, cy] = p(0.05, 0.605), [ex, ey] = p(0.26, 0.815);
    const rows = [
      ['Controller', 'ESP32-S3 Sense'], ['Image', 'Onboard camera'], ['Sound', 'Onboard microphone'],
      ['Touch', 'Two copper tape rings'], ['Projector, speaker', 'Kodak Luma 75'], ['Projection', '205° fisheye lens'],
      ['Enclosure', '3D-printed PLA'], ['Frame', 'Store-bought umbrella'], ['Link', 'USB to a nearby PC'],
    ];
    return (
      <Frame h={H} id="ys-a2" lines={(id) => (
        <g>
          <Lead id={id} d={`M${LX + 6} ${sy - 30} L${sx - 3} ${sy - 3}`} />
          <Lead id={id} d={`M${LX + 6} ${ry - 5} L${ux - 3} ${uy + 2}`} />
          <Lead id={id} d={`M${LX + 6} ${ry + 5} L${lx - 3} ${ly - 2}`} />
          <Lead id={id} d={`M${LX + 6} ${cy - 22} L${cx - 2} ${cy - 4}`} />
          <Lead id={id} d={`M${LX + 6} ${ey + 34} L${ex - 3} ${ey + 5}`} />
          <Lead id={id} d={`M${RXl - 6} ${gy} H${gx + 3}`} />
          <Lead id={id} d={`M${RXl - 6} ${by} H${bx + 3}`} />
          <Lead id={id} d={`M${RXl - 6} ${ny} H${nx + 3}`} />
        </g>
      )}>
        <Img src="r-exploded.png" x={IX} y={IY} w={W} h={H} />
        <Tx x={LX} y={sy - 30} mid right t="call">Sensor mount</Tx>
        <Tx x={LX} y={ry} mid right t="call">Copper tape rings</Tx>
        <Tx x={LX} y={cy - 22} mid right t="call">Side cover</Tx>
        <Tx x={LX} y={ey + 34} mid right t="call">Projector enclosure</Tx>
        <Tx x={RXl} y={gy} mid t="call">Printed grip</Tx>
        <Tx x={RXl} y={by} mid t="call">Flared base</Tx>
        <Tx x={RXl} y={ny} mid t="call">Projector lens</Tx>
        <Tx x={C3} y={0} t="label">Parts</Tx>
        {rows.map(([k, v], i) => (
          <React.Fragment key={k}>
            <Tx x={C3} y={30 + i * 30} t="note">{k}</Tx>
            <Tx x={C3 + 122} y={30 + i * 30} w={154} nowrap={false} t="text">{v}</Tx>
          </React.Fragment>
        ))}
      </Frame>
    );
  }

  function DataFlow() {
    const BW = 216, RY = 30;                        // width of the board list, y of the two top rules
    const tY = RY + 14, row = (i) => tY + i * 22;
    const SY = 348, cells = [C2, 450, C3, 750], CW = 126;
    const states = [
      ['Empty', 'until both rings are held for 1 s'],
      ['Recording', 'until fewer than two rings are held for 1 s'],
      ['Loaded', 'until both rings are held for 1 s'],
      ['Replay', 'until the clip ends or the handle is released'],
    ];
    const oy = LENS[1];
    return (
      <Frame h={SY + 118} id="ys-a3" lines={(id) => (
        <g>
          <path d={`M${RX} ${RU} H238 V${row(1) + 2} H${C2 - 14}`} fill="none" stroke={RED} strokeWidth="1.4" />
          <path d={`M${RX} ${RL} H252 V${row(1) + 10} H${C2 - 14}`} fill="none" stroke={RED} strokeWidth="1.4" />
          {[[RX, RU], [RX, RL], [C2 - 14, row(1) + 2], [C2 - 14, row(1) + 10]].map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="2.8" fill={RED} />)}
          <Lead id={id} d={`M${C2 + BW + 10} ${RY + 0.5} H${C3 - 8}`} />
          <Lead id={id} d={`M${C3 + 0.5} ${row(3) + 24} V${oy} H${LENS[0] + 13}`} />
          {cells.slice(0, 3).map((x) => <Lead key={x} id={id} d={`M${x + CW + 3} ${SY + 0.5} H${x + 150 - 3}`} />)}
        </g>
      )}>
        <Img src="r-grip-neutral.png" x={0} y={0} w={HW} h={HH} />
        <Tx x={C2} y={0} t="label">Board</Tx>
        <Rule x={C2} y={RY} w={BW} />
        <Tx x={C2} y={tY - 4} t="call">ESP32-S3 Sense</Tx>
        <Tx x={C2} y={row(1) - 4}>touch, two rings</Tx>
        <Tx x={C2} y={row(2) - 4}>camera frames</Tx>
        <Tx x={C2} y={row(3) - 4}>microphone audio</Tx>
        <Tx x={C2 + BW + 10} y={RY - 20} w={C3 - 18 - C2 - BW} t="label"><span style={{ display: 'block', textAlign: 'center' }}>USB</span></Tx>
        <Tx x={C3} y={0} t="label">Computer</Tx>
        <Rule x={C3} y={RY} w={COLW - C3} />
        <Tx x={C3} y={tY - 4} t="call">Nearby PC</Tx>
        <Tx x={C3} y={row(1) - 4}>state logic</Tx>
        <Tx x={C3} y={row(2) - 4}>blur, thermal palette, fades</Tx>
        <Tx x={C3} y={row(3) - 4}>audio playback</Tx>
        <Tx x={C2} y={oy - 24}>color field and rain sound</Tx>
        <Tx x={C2} y={oy + 8} t="note">to the Kodak Luma 75, projector and speaker</Tx>
        <Tx x={0} y={SY - 7} t="label">State logic</Tx>
        {states.map(([n, c], i) => (
          <React.Fragment key={n}>
            <Rule x={cells[i]} y={SY} w={CW} />
            <Tx x={cells[i]} y={SY + 12} t="call">{n}</Tx>
            <Tx x={cells[i]} y={SY + 34} w={CW} nowrap={false} t="note">{c}</Tx>
          </React.Fragment>
        ))}
        <Tx x={C2} y={SY + 98}>After Replay the trace is erased and the umbrella is Empty again.</Tx>
      </Frame>
    );
  }


  // section through the umbrella: schematic canopy and figures around the modelled handle
  function Section() {
    // The umbrella is rendered from the model. The two people are outlines traced from her own photographs.
    const SW = 420, SH = SW * 1416 / 1674, IY = 62, X2 = COLW - SW;
    const CUT = [[0.0968, 0.2716], [0.1177, 0.2518], [0.1387, 0.233], [0.1597, 0.215], [0.1806, 0.198], [0.2016, 0.1819], [0.2226, 0.1668], [0.2435, 0.1526], [0.2645, 0.1393], [0.2855, 0.127], [0.3065, 0.1157], [0.3274, 0.1054], [0.3484, 0.096], [0.3694, 0.0876], [0.3903, 0.0803], [0.4113, 0.074], [0.4323, 0.0687], [0.4532, 0.0645], [0.4742, 0.0613], [0.4952, 0.0594], [0.5161, 0.0587], [0.5371, 0.0594], [0.5581, 0.0613], [0.579, 0.0645], [0.6, 0.0687], [0.621, 0.074], [0.6419, 0.0803], [0.6629, 0.0876], [0.6839, 0.096], [0.7048, 0.1054], [0.7258, 0.1157], [0.7468, 0.127], [0.7677, 0.1393], [0.7887, 0.1526], [0.8097, 0.1668], [0.8306, 0.1819], [0.8516, 0.198], [0.8726, 0.215], [0.8935, 0.233], [0.9145, 0.2518], [0.9355, 0.2716]];
    const cut = (x0) => 'M' + CUT.map(([fx, fy]) => `${(x0 + fx * SW).toFixed(1)} ${(IY + fy * SH).toFixed(1)}`).join(' L');
    const AX = 0.767, BX = 0.2367, FX = 0.2742;
    const below = IY + SH + 8, callY = IY + 0.30 * SH;
    const scenes = [
      { x: 0, label: 'Present', name: 'Holding together', img: 'r-sec-both.png',
        text: 'Two people hold the handle together. The umbrella records the rain on the canopy and a camera view of the side where one of them stands.' },
      { x: X2, label: 'Absent', name: 'Holding alone', img: 'r-sec-alone.png',
        text: 'Later, the person who remains holds it with both hands. The rain is heard again and a blurred field of color appears on the half of the canopy that is now empty.' },
    ];
    const under = (x, w, t, s) => <Tx x={x - w / 2} y={below} w={w} t={t}><span style={{ display: 'block', textAlign: 'center' }}>{s}</span></Tx>;
    return (
      <Frame h={below + 110} id="ys-a4" lines={(id) => (
        <g>
          {scenes.map((s) => <path key={s.x} d={cut(s.x)} fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />)}
          <Lead id={id} d={`M${X2 + FX * SW} ${callY - 4} V${IY + 0.205 * SH}`} />
        </g>
      )}>
        {scenes.map((s) => (
          <React.Fragment key={s.x}>
            <Tx x={s.x} y={0} t="label">{s.label}</Tx>
            <Tx x={s.x} y={18} t="name">{s.name}</Tx>
            <Img src={s.img} x={s.x} y={IY} w={SW} h={SH} />
            <Tx x={s.x} y={below + 34} w={400} nowrap={false}>{s.text}</Tx>
          </React.Fragment>
        ))}
        {under(BX * SW, 80, 'call', 'person B')}
        {under(AX * SW, 80, 'call', 'person A')}
        {under(X2 + BX * SW, 140, 'note', 'where person B stood')}
        {under(X2 + AX * SW, 80, 'call', 'person A')}
        <Tx x={X2 + FX * SW - 100} y={callY} w={200} t="call"><span style={{ display: 'block', textAlign: 'center' }}>Color field on the empty half</span></Tx>
      </Frame>
    );
  }

  const LIVE = [['ys09-section', Section], ['ys06-grip-states', GripStates], ['ys07-handle-exploded', Exploded], ['ys08-data-flow', DataFlow]];

  // ProjectPage draws every figure as an image. Swap the three diagrams for their live versions, without a frame.
  window.YousanPage = function YousanPage(props) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      LIVE.forEach(([key, Fig]) => {
        const img = ref.current.querySelector(`img[src*="${key}"]`);
        if (!img || img.dataset.live) return;
        img.dataset.live = '1';
        const host = document.createElement('div');
        host.setAttribute('role', 'img');
        host.setAttribute('aria-label', img.alt);
        img.style.display = 'none';
        img.after(host);
        ReactDOM.createRoot(host).render(<Fig />);
      });
    }, []);
    return <div ref={ref}><ProjectPage {...props} /></div>;
  };
})();
