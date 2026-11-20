// Project-specific page for critical-matter: one project and two course experiments, shown as three numbered parts.
const CM_INK = '#0a0a0a';
const CM_MUTED = 'rgba(10,10,10,0.68)';
const CM_RULE = 'rgba(10,10,10,0.14)';
const CM_A = 'assets/critical-matter/';

// Each row of pictures is [file, caption, width / height]. Two pictures in a row get column widths in proportion
// to their shapes, so both come out the same height without cropping.
const CM_PARTS = [
  {
    kind: 'Project', when: 'October 2025', who: 'Made on my own',
    title: 'Crocheting Brain Patterns',
    text: 'An EEG headset reads the wearer\'s brainwaves while they crochet. A p5.js sketch turns the six frequency bands into a crochet pattern and redraws it on screen as they change.',
    rows: [
      [['cm01-crochet-setup.gif', 'Crocheting with the headset on.', 800 / 450]],
      [['cm02-piece-and-pattern.gif', 'A crocheted piece next to the pattern on screen.', 800 / 450],
       ['cm04-pattern-generator.gif', 'The pattern generator reading live EEG.', 1100 / 618]],
      [['cm03-stitch-rules.png', 'The three stitch symbols, and how rows stack.', 1801 / 1158],
       ['cm05-pattern-and-piece.png', 'A generated pattern and a crocheted piece.', 1601 / 1058]],
    ],
  },
  {
    kind: 'Experiment', when: 'November 2025', who: 'Group of five',
    title: 'Heat-shrinking thread',
    text: 'We stitched patterns into cloth with two heat-shrinking threads, FibeRobo and Chizimi, and heated the cloth. The thread shrinks and the cloth gathers along the stitch lines.',
    rows: [
      [['cm06-shrink-simulation.jpg', 'Stitch patterns shrinking in a cloth simulation.', 1920 / 790]],
      [['cm07-stitch-patterns.png', 'The stitch patterns.', 1972 / 1264],
       ['cm08-heated-sample.jpg', 'A stitched sample after heating.', 1350 / 1800]],
    ],
  },
  {
    kind: 'Experiment', when: 'December 2025', who: 'Group of five',
    title: 'Sewing machine driven by EEG',
    text: 'The headset reads how focused the wearer is. When they concentrate, the machine starts to stitch, and it stitches faster the more focused they are. A two-axis plotter moves the hoop under the needle.',
    rows: [
      [['cm09-embroidery-setup.jpg', 'The plotter, the embroidery machine, and the screen that shows the stitch path.', 1800 / 896]],
      [['cm10-stitching.gif', 'Stitching with the headset on.', 900 / 625],
       ['cm11-stitched-result.jpg', 'The stitched line in black over the drawn pattern in yellow.', 830 / 1100]],
    ],
  },
];

function CriticalMatterPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];
  const shownMeta = project.meta.filter(([k]) => k !== 'tools' && k !== 'status');
  const [narrow, setNarrow] = React.useState(window.innerWidth < 640);
  React.useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 640);
    window.addEventListener('resize', on); return () => window.removeEventListener('resize', on);
  }, []);

  const label = { fontSize: 10, color: CM_MUTED, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 400 };
  const Fig = ({ f }) => (
    <figure style={{ margin: 0, minWidth: 0 }}>
      <img src={CM_A + f[0]} alt={f[1]} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: String(f[2]), border: `1px solid ${CM_RULE}` }} />
      <figcaption style={{ fontSize: 11.5, color: CM_MUTED, marginTop: 9, lineHeight: 1.5 }}>{f[1]}</figcaption>
    </figure>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: CM_INK, fontFamily: sans, fontWeight: 300, padding: '80px 32px 120px', maxWidth: 940, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontSize: 11, color: CM_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14 }}>
        <a href="../index.html" style={{ justifySelf: 'start', color: CM_INK, textDecoration: 'none' }}>← Home</a>
        <span>{String(idx + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}</span>
        <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
          <a href={`${prev.id}.html`} style={{ color: CM_MUTED, textDecoration: 'none' }}>prev</a>
          <a href={`${next.id}.html`} style={{ color: CM_INK, textDecoration: 'none' }}>next →</a>
        </span>
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 300, letterSpacing: -0.7, lineHeight: 1.15, margin: '64px 0 0', maxWidth: '30ch' }}>{project.title}</h1>
      <p style={{ fontSize: 17, color: CM_MUTED, lineHeight: 1.5, margin: '18px 0 0', maxWidth: '56ch' }}>{project.subtitle}</p>

      {/* the three parts at a glance; each line jumps to its part */}
      <div style={{ marginTop: 44, borderTop: `1px solid ${CM_RULE}` }}>
        {CM_PARTS.map((p, i) => (
          <a key={p.title} href={`#part-${i + 1}`} style={{ display: 'grid', gridTemplateColumns: narrow ? '28px minmax(0,1fr)' : '28px minmax(0,1fr) auto', columnGap: 16, alignItems: 'baseline', padding: '11px 0', borderBottom: `1px solid ${CM_RULE}`, textDecoration: 'none', color: CM_INK }}>
            <span style={{ fontSize: 12, color: CM_MUTED }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: 16, fontWeight: 400, letterSpacing: -0.2 }}>{p.title}</span>
            <span style={{ ...label, gridColumn: narrow ? '2' : 'auto', marginTop: narrow ? 4 : 0 }}>{p.kind} · {p.who} · {p.when}</span>
          </a>
        ))}
      </div>

      <dl style={{ margin: '36px 0 0' }}>
        {shownMeta.map(([k, v]) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
            <dt style={{ ...label, letterSpacing: 1, lineHeight: 2 }}>{k}</dt>
            <dd style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{v}</dd>
          </div>
        ))}
      </dl>

      {CM_PARTS.map((p, i) => (
        <section key={p.title} id={`part-${i + 1}`} style={{ marginTop: 104, scrollMarginTop: 32 }}>
          <div style={label}>{String(i + 1).padStart(2, '0')} · {p.kind} · {p.who} · {p.when}</div>
          <h2 style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4, lineHeight: 1.2, margin: '12px 0 0' }}>{p.title}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, margin: '14px 0 0', maxWidth: '64ch' }}>{p.text}</p>
          {p.rows.map((row, r) => (
            <div key={r} style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0,1fr)' : row.map((f) => `minmax(0,${f[2]}fr)`).join(' '), columnGap: 20, rowGap: 28, alignItems: 'start', marginTop: r === 0 ? 30 : 28 }}>
              {row.map((f) => <Fig key={f[0]} f={f} />)}
            </div>
          ))}
        </section>
      ))}

      <nav style={{ marginTop: 96, paddingTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: CM_INK, padding: '20px 0' }}>
          <div style={{ ...label, letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: CM_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{ ...label, letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ marginTop: 40, paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: CM_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: CM_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang 王瑶</span>
      </footer>
    </div>
  );
}

window.CriticalMatterPage = CriticalMatterPage;
