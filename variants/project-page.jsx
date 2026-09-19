// Shared project-page component. Loaded by each projects/<id>.html.
const PP_INK = '#0a0a0a';
const PP_MUTED = 'rgba(10,10,10,0.55)';
const PP_RULE = 'rgba(10,10,10,0.14)';

function ProjectPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];
  const shownMeta = [
    ...project.meta.filter(([k]) => k !== 'tools' && k !== 'status'),
    ...(project.tags && project.tags.length ? [['keywords', project.tags.join(', ')]] : []),
  ];

  const Label = ({ children, style }) => (
    <div style={{ fontSize: 10, color: PP_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14, ...style }}>{children}</div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: PP_INK, fontFamily: sans, fontWeight: 300, padding: '80px 32px 120px', maxWidth: 940, margin: '0 auto' }}>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontSize: 11, color: PP_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14, borderBottom: `1px solid ${PP_RULE}` }}>
          <a href="../index.html" style={{ justifySelf: 'start', color: PP_INK, textDecoration: 'none' }}>← Home</a>
          <span>{String(idx + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: PP_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: PP_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 300, letterSpacing: -0.7, lineHeight: 1.15, margin: '64px 0 0', maxWidth: '30ch' }}>{project.title}</h1>
        {project.subtitle && (
          <p style={{ fontSize: 17, fontWeight: 300, color: PP_MUTED, lineHeight: 1.5, margin: '18px 0 0', maxWidth: '56ch' }}>{project.subtitle}</p>
        )}
        <p style={{ fontSize: 16, lineHeight: 1.65, margin: '28px 0 0', maxWidth: '64ch' }}>{project.blurb}</p>

        <dl style={{ margin: '48px 0 0', paddingTop: 20, paddingBottom: 8, borderBottom: `1px solid ${PP_RULE}`, borderTop: `1px solid ${PP_RULE}` }}>
          {shownMeta.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
              <dt style={{ fontSize: 10, color: PP_MUTED, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 2 }}>{k}</dt>
              <dd style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
                {k === 'link'
                  ? <a href={`https://${v}`} style={{ color: PP_INK, textDecorationThickness: 1, textUnderlineOffset: 3 }}>{v}</a>
                  : v}
              </dd>
            </div>
          ))}
        </dl>

        {project.figures && project.figures.map(([src, cap]) => (
          <figure key={src} style={{ margin: '56px 0 0' }}>
            <img src={src} alt={cap} style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${PP_RULE}` }} />
            <figcaption style={{ fontSize: 10.5, color: PP_MUTED, marginTop: 10, letterSpacing: 0.4, lineHeight: 1.5 }}>{cap}</figcaption>
          </figure>
        ))}

        <div style={{ marginTop: 56 }}>
          <Label>Summary</Label>
          <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0, maxWidth: '64ch' }}>{project.body}</p>
        </div>

        {project.process && (
          <div style={{ marginTop: 56 }}>
            <Label>Process</Label>
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {project.process.map((step, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr)', columnGap: 16, padding: '12px 0', borderTop: `1px solid ${PP_RULE}` }}>
                  <span style={{ fontSize: 12, color: PP_MUTED }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.6 }}>{step}</span>
                </li>
              ))}
            </ol>
            <div style={{ borderTop: `1px solid ${PP_RULE}` }} />
          </div>
        )}

        <nav style={{ marginTop: 96, paddingTop: 24, borderTop: `1px solid ${PP_RULE}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: PP_INK, padding: '20px 0' }}>
            <div style={{ fontSize: 10, color: PP_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
            <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
          </a>
          <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: PP_INK, padding: '20px 0', textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: PP_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
            <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
          </a>
        </nav>

        <footer style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${PP_RULE}`, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: PP_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
          <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: PP_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
          <span>Yao Wang · 王瑶</span>
        </footer>
      </div>
    </div>
  );
}

window.ProjectPage = ProjectPage;
