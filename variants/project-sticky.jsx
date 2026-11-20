// Project-specific page for chair (Sticky Node).
const ST_INK = '#0a0a0a';
const ST_MUTED = 'rgba(10,10,10,0.68)';
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

  // The boards carry their own titles, text and labels, so the page adds none: a thin bar, then the
  // boards edge to edge with nothing between them. Bar and footer sit on the boards' own left margin.
  const SIDE = '3.3vw';
  const BOARDS = [
    ['st01-cover-hd.jpg', 'A printed terracotta connector on a table'],
    ['st02-material-hd.jpg', 'Discarded yard trimmings on the street, the branches they came from, and scanned twig geometry'],
    ['st03-toolpath-tests-hd.jpg', 'Grasshopper toolpath definition and three print tests with settings, slices, printing process and fit after firing'],
    ['st04-stools-hd.jpg', 'Two stools broken down into twigs and joints, with the recycling and reconfiguration diagram'],
    ['st05-assembly-hd.jpg', 'Assembly sequence of a twig stool, the twig set, and connectors being slid over the branch ends'],
    ['st06-result-hd.jpg', 'The finished twig stool standing, with close-ups of the ceramic connectors at the joints'],
  ];
  const bar = { fontFamily: mono, fontSize: 11, color: ST_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap' };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: ST_INK, fontFamily: sans, fontWeight: 300 }}>
      <div style={{ ...bar, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: `22px ${SIDE}` }}>
        <a href="../index.html" style={{ justifySelf: 'start', color: ST_INK, textDecoration: 'none' }}>← Home</a>
        <h1 style={{ font: 'inherit', letterSpacing: 'inherit', margin: 0, color: ST_INK }}>{project.title}</h1>
        <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
          <a href={`${prev.id}.html`} style={{ color: ST_MUTED, textDecoration: 'none' }}>prev</a>
          <a href={`${next.id}.html`} style={{ color: ST_INK, textDecoration: 'none' }}>next →</a>
        </span>
      </div>

      {BOARDS.map(([src, alt], i) => (
        <img key={src} src={A + src} alt={alt} loading={i < 2 ? 'eager' : 'lazy'} style={{ display: 'block', width: '100%', height: 'auto' }} />
      ))}

      <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: `56px ${SIDE} 0` }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: ST_INK }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: ST_INK, textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ display: 'flex', justifyContent: 'space-between', padding: `48px ${SIDE} 56px`, fontFamily: mono, fontSize: 10.5, color: ST_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: ST_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang 王瑶</span>
      </footer>
    </div>
  );
}

window.StickyPage = StickyPage;
