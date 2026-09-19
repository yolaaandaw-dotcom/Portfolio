// Project-specific page for clay (Squishy Assembly).
const SQ_INK = '#0a0a0a';
const SQ_MUTED = 'rgba(10,10,10,0.55)';
const SQ_RULE = 'rgba(10,10,10,0.14)';

function SquishyPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const mono = 'Roboto, system-ui, sans-serif';
  const A = 'assets/squishy/';

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
    <div style={{ fontFamily: mono, fontSize: 10, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 14, fontWeight: 400 }}>{children}</div>
  );
  const Cap = ({ children }) => (
    <div style={{ fontFamily: mono, fontSize: 10.5, color: SQ_MUTED, marginTop: 10, letterSpacing: 0.4, fontWeight: 400, lineHeight: 1.5 }}>{children}</div>
  );
  const Plate = ({ src, alt, bg = '#fff', framed = false }) => (
    <figure style={{ margin: 0, border: framed ? `1px solid ${SQ_RULE}` : 'none', background: bg, padding: framed ? 12 : 0, width: framed ? 'auto' : 'min(90vw, 940px)', marginLeft: framed ? 0 : '50%', transform: framed ? 'none' : 'translateX(-50%)' }}>
      <img src={A + src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </figure>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fff', color: SQ_INK, padding: '80px 32px 120px', fontFamily: sans, fontWeight: 300, maxWidth: 940, margin: '0 auto' }}>

      <Reveal i={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontFamily: mono, fontSize: 11, color: SQ_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14, borderBottom: `1px solid ${SQ_RULE}` }}>
          <a href="../index.html" style={{ justifySelf: 'start', color: SQ_INK, textDecoration: 'none' }}>← Home</a>
          <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: SQ_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: SQ_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>
      </Reveal>


      <Reveal i={2} style={{ marginTop: 64 }}>
        <h1 style={{ fontFamily: sans, fontWeight: 300, fontSize: 30, lineHeight: 1.15, letterSpacing: -0.7, margin: 0, maxWidth: '30ch' }}>{project.title}</h1>
      </Reveal>
      <Reveal i={2} style={{ marginTop: 18 }}>
        <div style={{ fontFamily: sans, fontWeight: 300, fontSize: 17, color: SQ_MUTED, lineHeight: 1.5, maxWidth: '56ch' }}>{project.subtitle}</div>
      </Reveal>
      <Reveal i={3} style={{ marginTop: 28 }}>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.65, margin: 0, maxWidth: '64ch', color: SQ_INK }}>{project.blurb}</p>
      </Reveal>

      <Reveal i={4} style={{ marginTop: 48 }}>
        <dl style={{ margin: 0, paddingTop: 20, paddingBottom: 28, borderTop: `1px solid ${SQ_RULE}`, borderBottom: `1px solid ${SQ_RULE}` }}>
          {shownMeta.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
              <dt style={{ fontFamily: mono, fontSize: 10, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400, lineHeight: 2 }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: sans, fontSize: 13, fontWeight: 300, color: SQ_INK, lineHeight: 1.45 }}>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal i={5} style={{ marginTop: 72 }}>
        <Plate src="sq08-hero.jpg" alt="The robotic arm with its paper gripper facing a hand holding a clay brick, with a pile of shaped bricks between them" bg="#0a0a0a" framed />
        <Cap>The arm and the hand work from the same pile of clay bricks.</Cap>
      </Reveal>

      <Reveal i={6} style={{ marginTop: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 48 }}>
          <div>
            <SectionLabel>Summary</SectionLabel>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, margin: 0, color: SQ_INK, maxWidth: '44ch' }}>{project.body}</p>
          </div>
          <div>
            <SectionLabel>Process</SectionLabel>
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {project.process.map((step, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14, padding: '12px 0', borderTop: i === 0 ? 'none' : `1px solid ${SQ_RULE}` }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: SQ_MUTED, fontWeight: 300 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 300, lineHeight: 1.6, color: SQ_INK }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      <Reveal i={7} style={{ marginTop: 96 }}>
        <SectionLabel>Setup</SectionLabel>
        <Plate src="sq01-setup.jpg" alt="Desk setup: laptop, robotic arm, shaping zone and black building playground" />
        <Cap>Laptop, arm, shaping zone and black building playground on one desk.</Cap>
      </Reveal>

      <Reveal i={8} style={{ marginTop: 96 }}>
        <SectionLabel>Rules</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 28 }}>
          {[
            ['Human', 'places horizontally', 'Draws the wall shape, shapes a brick and sets it left or right of the last one.'],
            ['Robot', 'places vertically', 'Reads the human brick, shapes a matching one and stacks it upward.'],
            ['Both', 'stay adjacent', 'Each placement touches the previous one.'],
          ].map(([h, sub, desc]) => (
            <div key={h} style={{ borderTop: `1px solid ${SQ_INK}`, paddingTop: 14 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: SQ_MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{sub}</div>
              <div style={{ fontFamily: sans, fontSize: 19, fontWeight: 400, letterSpacing: -0.4, marginBottom: 10 }}>{h}</div>
              <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 300, lineHeight: 1.6, color: SQ_MUTED }}>{desc}</div>
            </div>
          ))}
        </div>
        <Plate src="sq02-background.jpg" alt="Background on enactive robotics and Peruvian stone walls, project description, the three placement rules and the shape rule loop" />
        <Cap>Peruvian stone walls as reference, the placement rules, and the shaping loop.</Cap>
      </Reveal>

      <Reveal i={9} style={{ marginTop: 96 }}>
        <SectionLabel>Workflow</SectionLabel>
        <Plate src="sq03-workflow.jpg" alt="Workflow from design rules through YOLOv5 model training, tool path design and execution to the completed wall" />
        <Cap>Design rules, model training, end effector and tool path, then the build.</Cap>
      </Reveal>

      <Reveal i={10} style={{ marginTop: 96 }}>
        <SectionLabel>Shape grammar</SectionLabel>
        <Plate src="sq04-shape-grammar.jpg" alt="Shape grammar: bricks on a 4×3 grid, joint types, four corner types and the resulting brick combinations" />
        <Cap>Each brick fits a 4 × 3 grid and is documented as a pair of corner types. That gives the set of matching bricks.</Cap>
      </Reveal>

      <Reveal i={11} style={{ marginTop: 96 }}>
        <SectionLabel>Shaping and gripping</SectionLabel>
        <Plate src="sq05-shaping-gripper.jpg" alt="Clay shaping by hand and by clamp offset, and the paper flexible gripper picking up a brick in three steps" />
        <Cap>A 30 × 30 × 10 mm blank becomes six bricks by shifting the clamp centre. A sheet of paper on the module lifts the brick without distorting it. 500 labelled images train the recognition model.</Cap>
      </Reveal>

      <Reveal i={12} style={{ marginTop: 96 }}>
        <SectionLabel>One exchange</SectionLabel>
        <Plate src="sq06-sequence.jpg" alt="System flowchart with the human track, robotic arm track and the grid state recorded after each placement" />
        <Cap>The human track, the arm track and the grid state after each placement, with a ±0.5 offset rule.</Cap>
      </Reveal>

      <Reveal i={13} style={{ marginTop: 96 }}>
        <div style={{ borderTop: `2px solid ${SQ_INK}`, paddingTop: 22, marginBottom: 28 }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1.4 }}>Tests</div>
        </div>
        <Plate src="sq07-tests.jpg" alt="Three test builds: planned shape, final result, brick analysis by author, and the attribution diagram" bg="#0a0a0a" />
        <Cap>Three builds. Planned shape, finished wall, user bricks against arm bricks, and the user's ten points split between shape, robot and human.</Cap>
      </Reveal>

      <nav style={{ marginTop: 96, paddingTop: 24, borderTop: `1px solid ${SQ_RULE}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: SQ_INK, padding: '20px 0' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: SQ_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${SQ_RULE}`, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 10.5, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: SQ_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang · 王瑶</span>
      </footer>
    </div>
  );
}

window.SquishyPage = SquishyPage;
