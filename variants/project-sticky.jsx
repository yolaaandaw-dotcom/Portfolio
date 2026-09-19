// Project-specific page for chair (Sticky Node).
const ST_INK = '#0a0a0a';
const ST_MUTED = 'rgba(10,10,10,0.55)';
const ST_RULE = 'rgba(10,10,10,0.14)';

function StickyPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const mono = 'Roboto, system-ui, sans-serif';
  const A = 'assets/sticky/';

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
    <div style={{ fontFamily: mono, fontSize: 10, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 14, fontWeight: 400 }}>{children}</div>
  );
  const Cap = ({ children }) => (
    <div style={{ fontFamily: mono, fontSize: 10.5, color: ST_MUTED, marginTop: 10, letterSpacing: 0.4, fontWeight: 400, lineHeight: 1.5 }}>{children}</div>
  );
  const Plate = ({ src, alt, bg = '#fff', framed = false }) => (
    <figure style={{ margin: 0, border: framed ? `1px solid ${ST_RULE}` : 'none', background: bg, padding: framed ? 12 : 0, width: framed ? 'auto' : 'min(90vw, 940px)', marginLeft: framed ? 0 : '50%', transform: framed ? 'none' : 'translateX(-50%)' }}>
      <img src={A + src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </figure>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fff', color: ST_INK, padding: '80px 32px 120px', fontFamily: sans, fontWeight: 300, maxWidth: 940, margin: '0 auto' }}>

      <Reveal i={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontFamily: mono, fontSize: 11, color: ST_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14, borderBottom: `1px solid ${ST_RULE}` }}>
          <a href="../index.html" style={{ justifySelf: 'start', color: ST_INK, textDecoration: 'none' }}>← Home</a>
          <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: ST_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: ST_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>
      </Reveal>


      <Reveal i={2} style={{ marginTop: 64 }}>
        <h1 style={{ fontFamily: sans, fontWeight: 300, fontSize: 30, lineHeight: 1.15, letterSpacing: -0.7, margin: 0, maxWidth: '30ch' }}>{project.title}</h1>
      </Reveal>
      <Reveal i={2} style={{ marginTop: 18 }}>
        <div style={{ fontFamily: sans, fontWeight: 300, fontSize: 17, color: ST_MUTED, lineHeight: 1.5, maxWidth: '56ch' }}>{project.subtitle}</div>
      </Reveal>
      <Reveal i={3} style={{ marginTop: 28 }}>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.65, margin: 0, maxWidth: '64ch', color: ST_INK }}>{project.blurb}</p>
      </Reveal>

      <Reveal i={4} style={{ marginTop: 48 }}>
        <dl style={{ margin: 0, paddingTop: 20, paddingBottom: 28, borderTop: `1px solid ${ST_RULE}`, borderBottom: `1px solid ${ST_RULE}` }}>
          {shownMeta.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
              <dt style={{ fontFamily: mono, fontSize: 10, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400, lineHeight: 2 }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: sans, fontSize: 13, fontWeight: 300, color: ST_INK, lineHeight: 1.45 }}>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal i={5} style={{ marginTop: 72 }}>
        <Plate src="st01-cover-crop-w.jpg" alt="A printed terracotta connector on a table" framed />
        <Cap>A fired connector, printed to the geometry of one branch end.</Cap>
      </Reveal>

      <Reveal i={6} style={{ marginTop: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 48 }}>
          <div>
            <SectionLabel>Summary</SectionLabel>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, margin: 0, color: ST_INK, maxWidth: '44ch' }}>{project.body}</p>
          </div>
          <div>
            <SectionLabel>Process</SectionLabel>
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {project.process.map((step, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14, padding: '12px 0', borderTop: i === 0 ? 'none' : `1px solid ${ST_RULE}` }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: ST_MUTED, fontWeight: 300 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 300, lineHeight: 1.6, color: ST_INK }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      <Reveal i={7} style={{ marginTop: 96 }}>
        <SectionLabel>Material</SectionLabel>
        <Plate src="st02-material-w.jpg" alt="Discarded yard trimmings on the street, the branches they came from, and scanned twig geometry" />
        <Cap>Yard trimmings left on the street. Each twig is scanned and reduced to a centreline with its forks.</Cap>
      </Reveal>

      <Reveal i={8} style={{ marginTop: 96 }}>
        <SectionLabel>Toolpath and print tests</SectionLabel>
        <Plate src="st03-toolpath-tests.jpg" alt="Grasshopper toolpath definition and three print tests with settings, slices, printing process and fit after firing" />
        <Cap>The Grasshopper definition tweens between two twig ends to build the connector surface. Three tests at 3.5 mm/s through a 0.4 mm nozzle: the first two came out too small after firing, the third at 168% scaling fits.</Cap>
      </Reveal>

      <Reveal i={9} style={{ marginTop: 96 }}>
        <SectionLabel>Components</SectionLabel>
        <Plate src="st04-stools.jpg" alt="Two stools broken down into twigs and joints, with the recycling and reconfiguration diagram" />
        <Cap>Stool 1 uses 6 twigs and 6 joints at 602 × 388 mm; stool 2 uses 5 twigs and 5 joints at 570 × 578 mm. The twigs return to the pile and recombine into the next stool.</Cap>
      </Reveal>

      <Reveal i={10} style={{ marginTop: 96 }}>
        <SectionLabel>Assembly</SectionLabel>
        <Plate src="st05-assembly-w.jpg" alt="Assembly sequence of a twig stool, the twig set, and connectors being slid over the branch ends" />
        <Cap>The stool goes up twig by twig. Each connector slides over the end it was printed for.</Cap>
      </Reveal>

      <Reveal i={11} style={{ marginTop: 96 }}>
        <div style={{ paddingTop: 0, marginBottom: 28 }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1.4 }}>Result</div>
        </div>
        <Plate src="st06-result.jpg" alt="The finished twig stool standing, with close-ups of the ceramic connectors at the joints" />
        <Cap>The finished stool stands on the connectors alone. No glue, no fasteners.</Cap>
      </Reveal>

      <nav style={{ marginTop: 96, paddingTop: 24, borderTop: `1px solid ${ST_RULE}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: ST_INK, padding: '20px 0' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: ST_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${ST_RULE}`, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 10.5, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: ST_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang · 王瑶</span>
      </footer>
    </div>
  );
}

window.StickyPage = StickyPage;
