// Project-specific page for handshake (Oscillations of Connection).
const OS_INK = '#0a0a0a';
const OS_MUTED = 'rgba(10,10,10,0.68)';
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
  // Boards run edge to edge: the full width of the window, no frame, no padding.
  const Plate = ({ src, alt, bg = '#fff' }) => (
    <figure style={{ margin: 0, background: bg, width: '100vw', marginLeft: '50%', transform: 'translateX(-50%)' }}>
      <img src={A + src} alt={alt} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto' }} />
    </figure>
  );

  // The boards carry their own titles, text and labels, so the page adds none: a thin bar, then the
  // boards edge to edge with nothing between them. Bar and footer sit on the boards' own left margin.
  const SIDE = '3.3vw';
  const BOARDS = [
    ['os01-cover-hd.jpg', 'Two gloved hands reaching toward each other and a field of printed ceramic bricks'],
    ['os02-concept-hd.jpg', 'Handshake profiles by grip and angle, a twelve-position handshake chart, and measured hand geometry in plan and section'],
    ['os03-glove-hd.jpg', 'Exploded glove assembly and parts diagram with pressure, GSR and tilt sensors wired to an Arduino'],
    ['os04-gcode-hd.jpg', 'Shape generation from handshake duration and height generation from pressure, GSR and tilt data'],
    ['os05-assembly-hd.jpg', 'Glove parts before assembly, the assembly sequence, and three handshakes wearing the gloves'],
    ['os06-sessions-hd.jpg', 'Six recorded handshakes between four participants with their sensor traces and resulting brick geometry'],
    ['os07-print-tests-hd.jpg', 'Three print tests at different nozzle heights and spacings, and the fired bricks'],
    ['os08-layers-hd.jpg', 'Close-up of a printed brick with layer distances of 18, 16, 15 and 12 mm marked'],
  ];
  const bar = { fontFamily: mono, fontSize: 11, color: OS_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap' };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: OS_INK, fontFamily: sans, fontWeight: 300 }}>
      <div style={{ ...bar, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: `22px ${SIDE}` }}>
        <a href="../index.html" style={{ justifySelf: 'start', color: OS_INK, textDecoration: 'none' }}>← Home</a>
        <h1 style={{ font: 'inherit', letterSpacing: 'inherit', margin: 0, color: OS_INK }}>{project.title}</h1>
        <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
          <a href={`${prev.id}.html`} style={{ color: OS_MUTED, textDecoration: 'none' }}>prev</a>
          <a href={`${next.id}.html`} style={{ color: OS_INK, textDecoration: 'none' }}>next →</a>
        </span>
      </div>

      {BOARDS.map(([src, alt], i) => (
        <img key={src} src={A + src} alt={alt} loading={i < 2 ? 'eager' : 'lazy'} style={{ display: 'block', width: '100%', height: 'auto' }} />
      ))}

      <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: `56px ${SIDE} 0` }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: OS_INK }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: OS_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: OS_INK, textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: OS_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ display: 'flex', justifyContent: 'space-between', padding: `48px ${SIDE} 56px`, fontFamily: mono, fontSize: 10.5, color: OS_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: OS_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang 王瑶</span>
      </footer>
    </div>
  );
}

window.OscillationsPage = OscillationsPage;
