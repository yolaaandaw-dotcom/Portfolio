// Project-specific page for handshake (Oscillations of Connection).
const OS_INK = '#0a0a0a';
const OS_MUTED = 'rgba(10,10,10,0.55)';
const OS_RULE = 'rgba(10,10,10,0.14)';

function OscillationsPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const mono = 'Roboto, system-ui, sans-serif';
  const A = 'assets/oscillations/';

  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];
  const num = String(idx + 1).padStart(2, '0');
  const shownMeta = [
    ...project.meta.filter(([k]) => k !== 'tools' && k !== 'status'),
    ...(project.tags && project.tags.length ? [['keywords', project.tags.join(', ')]] : []),
  ];

  const [revealed, setRevealed] = React.useState(0);
  React.useEffect(() => {
    let i = 0, t;
    const tick = () => { i++; setRevealed(i); if (i < 14) t = setTimeout(tick, 70); };
    tick(); return () => clearTimeout(t);
  }, []);

  const Reveal = ({ i, children, style }) => (
    <div style={{ opacity: revealed > i ? 1 : 0, transform: revealed > i ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity .5s ease, transform .5s ease', ...style }}>{children}</div>
  );
  const SectionLabel = ({ children }) => (
    <div style={{ fontFamily: mono, fontSize: 10, color: OS_MUTED, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 14, fontWeight: 400 }}>{children}</div>
  );
  const Cap = ({ children }) => (
    <div style={{ fontFamily: mono, fontSize: 10.5, color: OS_MUTED, marginTop: 10, letterSpacing: 0.4, fontWeight: 400, lineHeight: 1.5 }}>{children}</div>
  );
  const Plate = ({ src, alt, bg = '#fff', framed = false }) => (
    <figure style={{ margin: 0, border: framed ? `1px solid ${OS_RULE}` : 'none', background: bg, padding: framed ? 12 : 0, width: framed ? 'auto' : 'min(90vw, 940px)', marginLeft: framed ? 0 : '50%', transform: framed ? 'none' : 'translateX(-50%)' }}>
      <img src={A + src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </figure>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fff', color: OS_INK, padding: '80px 32px 120px', fontFamily: sans, fontWeight: 300, maxWidth: 940, margin: '0 auto' }}>

      <Reveal i={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontFamily: mono, fontSize: 11, color: OS_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14, borderBottom: `1px solid ${OS_RULE}` }}>
          <a href="../index.html" style={{ justifySelf: 'start', color: OS_INK, textDecoration: 'none' }}>← Home</a>
          <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: OS_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: OS_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>
      </Reveal>


      <Reveal i={2} style={{ marginTop: 64 }}>
        <h1 style={{ fontFamily: sans, fontWeight: 300, fontSize: 30, lineHeight: 1.15, letterSpacing: -0.7, margin: 0, maxWidth: '30ch' }}>{project.title}</h1>
      </Reveal>
      <Reveal i={2} style={{ marginTop: 18 }}>
        <div style={{ fontFamily: sans, fontWeight: 300, fontSize: 17, color: OS_MUTED, lineHeight: 1.5, maxWidth: '56ch' }}>{project.subtitle}</div>
      </Reveal>
      <Reveal i={3} style={{ marginTop: 28 }}>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.65, margin: 0, maxWidth: '64ch', color: OS_INK }}>{project.blurb}</p>
      </Reveal>

      <Reveal i={4} style={{ marginTop: 48 }}>
        <dl style={{ margin: 0, paddingTop: 20, paddingBottom: 28, borderTop: `1px solid ${OS_RULE}`, borderBottom: `1px solid ${OS_RULE}` }}>
          {shownMeta.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
              <dt style={{ fontFamily: mono, fontSize: 10, color: OS_MUTED, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400, lineHeight: 2 }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: sans, fontSize: 13, fontWeight: 300, color: OS_INK, lineHeight: 1.45 }}>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal i={5} style={{ marginTop: 72 }}>
        <Plate src="os01-cover.jpg" alt="Two gloved hands reaching toward each other and a field of printed ceramic bricks" bg="#0a0a0a" framed />
        <Cap>The sensing gloves and the bricks printed from what they recorded.</Cap>
      </Reveal>

      <Reveal i={6} style={{ marginTop: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 48 }}>
          <div>
            <SectionLabel>Summary</SectionLabel>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, margin: 0, color: OS_INK, maxWidth: '44ch' }}>{project.body}</p>
          </div>
          <div>
            <SectionLabel>Process</SectionLabel>
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {project.process.map((step, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14, padding: '12px 0', borderTop: i === 0 ? 'none' : `1px solid ${OS_RULE}` }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: OS_MUTED, fontWeight: 300 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 300, lineHeight: 1.6, color: OS_INK }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      <Reveal i={7} style={{ marginTop: 96 }}>
        <SectionLabel>Reference</SectionLabel>
        <Plate src="os02-concept.jpg" alt="Handshake profiles by grip and angle, a twelve-position handshake chart, and measured hand geometry in plan and section" />
        <Cap>Grip, duration and hand angle sorted into twelve positions between calm and intense, balanced and competing. Hand geometry measured in plan and section to size the glove.</Cap>
      </Reveal>

      <Reveal i={8} style={{ marginTop: 96 }}>
        <SectionLabel>Glove</SectionLabel>
        <Plate src="os03-glove.jpg" alt="Exploded glove assembly and parts diagram with pressure, GSR and tilt sensors wired to an Arduino" />
        <Cap>Wrist module, two palm modules, a thumb cap and interchangeable rings in three sizes. Four pressure sensors, two GSR sensors and one tilt sensor per hand run to an Arduino.</Cap>
      </Reveal>

      <Reveal i={9} style={{ marginTop: 96 }}>
        <SectionLabel>Toolpath</SectionLabel>
        <Plate src="os04-gcode.jpg" alt="Shape generation from handshake duration and height generation from pressure, GSR and tilt data" />
        <Cap>Duration sets the radius of each spiral, and three spirals merge into the flat outline. Pressure, skin response and tilt angle are mapped to layer height through Y = X²A²B.</Cap>
      </Reveal>

      <Reveal i={10} style={{ marginTop: 96 }}>
        <SectionLabel>Sessions</SectionLabel>
        <Plate src="os05-assembly.jpg" alt="Glove parts before assembly, the assembly sequence, and three handshakes wearing the gloves" bg="#0a0a0a" />
        <Cap>Parts, assembly on the hand, and the handshake itself with both gloves reading at once.</Cap>
      </Reveal>

      <Reveal i={11} style={{ marginTop: 56 }}>
        <Plate src="os06-sessions-w.jpg" alt="Six recorded handshakes between four participants with their sensor traces and resulting brick geometry" />
        <Cap>Six handshakes across four participants. For each: the sensor traces, the per-hand readings, and the top and side view of the brick they produce.</Cap>
      </Reveal>

      <Reveal i={12} style={{ marginTop: 96 }}>
        <SectionLabel>Printing</SectionLabel>
        <Plate src="os07-print-tests-w.jpg" alt="Three print tests at different nozzle heights and spacings, and the fired bricks" bg="#0a0a0a" />
        <Cap>The first test ran the nozzle too low, the second had the wrong horizontal spacing, the third holds its coil.</Cap>
      </Reveal>

      <Reveal i={13} style={{ marginTop: 56 }}>
        <Plate src="os08-layers-w.jpg" alt="Close-up of a printed brick with layer distances of 18, 16, 15 and 12 mm marked" bg="#0a0a0a" />
        <Cap>Layer spacing between 12 and 18 mm across one brick, set by the data at that point in the handshake.</Cap>
      </Reveal>

      <nav style={{ marginTop: 96, paddingTop: 24, borderTop: `1px solid ${OS_RULE}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: OS_INK, padding: '20px 0' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: OS_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: OS_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: OS_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${OS_RULE}`, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 10.5, color: OS_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: OS_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang · 王瑶</span>
      </footer>
    </div>
  );
}

window.OscillationsPage = OscillationsPage;
