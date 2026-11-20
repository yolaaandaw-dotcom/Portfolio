// Project-specific page for clay (Squishy Assembly).
const SQ_INK = '#0a0a0a';
const SQ_MUTED = 'rgba(10,10,10,0.68)';
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

  // The boards carry their own titles, text and labels, so the page adds none: a thin bar, then the
  // boards edge to edge with nothing between them. Bar and footer sit on the boards' own left margin.
  const SIDE = '3.3vw';
  const BOARDS = [
    ['sq01-setup-hd.jpg', 'Desk setup: laptop, robotic arm, shaping zone and black building playground'],
    ['sq02-background-hd.jpg', 'Background on enactive robotics and Peruvian stone walls, project description, the three placement rules and the shape rule loop'],
    ['sq03-workflow-hd.jpg', 'Workflow from design rules through YOLOv5 model training, tool path design and execution to the completed wall'],
    ['sq04-shape-grammar-hd.jpg', 'Shape grammar: bricks on a 4×3 grid, joint types, four corner types and the resulting brick combinations'],
    ['sq05-shaping-gripper-hd.jpg', 'Clay shaping by hand and by clamp offset, and the paper flexible gripper picking up a brick in three steps'],
    ['sq06-sequence-hd.jpg', 'System flowchart with the human track, robotic arm track and the grid state recorded after each placement'],
    ['sq07-tests-hd.jpg', 'Three test builds: planned shape, final result, brick analysis by author, and the attribution diagram'],
    ['sq08-hero-hd.jpg', 'The robotic arm with its paper gripper facing a hand holding a clay brick, with a pile of shaped bricks between them'],
  ];
  const bar = { fontFamily: mono, fontSize: 11, color: SQ_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap' };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: SQ_INK, fontFamily: sans, fontWeight: 300 }}>
      <div style={{ ...bar, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: `22px ${SIDE}` }}>
        <a href="../index.html" style={{ justifySelf: 'start', color: SQ_INK, textDecoration: 'none' }}>← Home</a>
        <h1 style={{ font: 'inherit', letterSpacing: 'inherit', margin: 0, color: SQ_INK }}>{project.title}</h1>
        <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
          <a href={`${prev.id}.html`} style={{ color: SQ_MUTED, textDecoration: 'none' }}>prev</a>
          <a href={`${next.id}.html`} style={{ color: SQ_INK, textDecoration: 'none' }}>next →</a>
        </span>
      </div>

      {BOARDS.map(([src, alt], i) => (
        <img key={src} src={A + src} alt={alt} loading={i < 2 ? 'eager' : 'lazy'} style={{ display: 'block', width: '100%', height: 'auto' }} />
      ))}

      <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: `56px ${SIDE} 0` }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: SQ_INK }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: SQ_INK, textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ display: 'flex', justifyContent: 'space-between', padding: `48px ${SIDE} 56px`, fontFamily: mono, fontSize: 10.5, color: SQ_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: SQ_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang 王瑶</span>
      </footer>
    </div>
  );
}

window.SquishyPage = SquishyPage;
