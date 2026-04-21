// Shared project-page component. Loaded by each projects/<id>.html.
// Same visual system as the index: white bg, Roboto Light, accent #c6ff00.

const PP_ACCENT = '#c6ff00';
const PP_INK = '#0a0a0a';
const PP_MUTED = 'rgba(10,10,10,0.5)';
const PP_RULE = 'rgba(10,10,10,0.14)';

function ProjectPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const mono = '"Roboto Mono", ui-monospace, monospace';

  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];
  const num = String(idx + 1).padStart(2, '0');

  const [revealed, setRevealed] = React.useState(0);
  React.useEffect(() => {
    let i = 0; let t;
    const tick = () => { i++; setRevealed(i); if (i < 8) t = setTimeout(tick, 80); };
    tick(); return () => clearTimeout(t);
  }, []);

  const Reveal = ({ i, children, style }) => (
    <div style={{
      opacity: revealed > i ? 1 : 0,
      transform: revealed > i ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity .5s ease, transform .5s ease',
      ...style,
    }}>{children}</div>
  );

  const Mark = ({ style }) => (
    <svg width="14" height="14" viewBox="0 0 18 18" style={{ position: 'absolute', ...style, color: PP_INK, opacity: 0.35 }}>
      <line x1="9" y1="0" x2="9" y2="18" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );

  // bigger placeholder figure
  const Figure = ({ caption, tall }) => (
    <figure style={{ margin: 0 }}>
      <div style={{
        aspectRatio: tall ? '3 / 4' : '16 / 10', width: '100%', position: 'relative',
        border: `1px solid ${PP_RULE}`, background: '#fafafa', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id={`h-${tall ? 't' : 'w'}-${caption.length}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke={PP_INK} strokeOpacity="0.06" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#h-${tall ? 't' : 'w'}-${caption.length})`} />
          <rect x="0" y="0" width="5" height="5" fill={PP_ACCENT} />
        </svg>
        <div style={{
          position: 'absolute', inset: 12, border: `1px dashed ${PP_RULE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: mono, fontSize: 11, fontWeight: 400,
          color: PP_MUTED, letterSpacing: 0.8, textTransform: 'uppercase',
        }}>
          fig. plate
        </div>
      </div>
      <figcaption style={{
        fontFamily: mono, fontSize: 10.5, color: PP_MUTED, marginTop: 8,
        letterSpacing: 0.4, fontWeight: 400,
      }}>
        fig. — {caption}
      </figcaption>
    </figure>
  );

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', background: '#fff', color: PP_INK,
      padding: '64px 72px', fontFamily: sans, fontWeight: 300,
    }}>
      <Mark style={{ top: 20, left: 20 }} />
      <Mark style={{ top: 20, right: 20 }} />
      <Mark style={{ bottom: 20, left: 20 }} />
      <Mark style={{ bottom: 20, right: 20 }} />

      {/* Top nav bar */}
      <Reveal i={0}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', fontFamily: mono, fontSize: 11,
          color: PP_MUTED, letterSpacing: 0.8, textTransform: 'uppercase',
          paddingBottom: 14, borderBottom: `1px solid ${PP_RULE}`,
        }}>
          <a href="../index.html" style={{
            justifySelf: 'start', color: PP_INK, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            ← Index
          </a>
          <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: PP_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: PP_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>
      </Reveal>

      {/* Breadcrumb meta */}
      <Reveal i={1} style={{ marginTop: 48 }}>
        <div style={{
          fontFamily: mono, fontSize: 10.5, color: PP_MUTED,
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 20,
        }}>
          {num} · {project.year} · {project.tags.join(' · ')}
        </div>
      </Reveal>

      {/* Title + blurb */}
      <Reveal i={2}>
        <h1 style={{
          fontFamily: sans, fontWeight: 300, fontSize: 64, lineHeight: 1.02,
          letterSpacing: -1.6, margin: 0, maxWidth: '18ch',
        }}>
          {project.title}
        </h1>
      </Reveal>

      <Reveal i={3} style={{ marginTop: 20 }}>
        <p style={{
          fontFamily: sans, fontWeight: 300, fontSize: 22, lineHeight: 1.4,
          margin: 0, maxWidth: '58ch', color: PP_INK,
        }}>
          {project.blurb}
        </p>
      </Reveal>

      {/* Meta strip */}
      <Reveal i={4} style={{ marginTop: 48 }}>
        <dl style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32, margin: 0,
          paddingTop: 20, paddingBottom: 28,
          borderTop: `1px solid ${PP_RULE}`,
          borderBottom: `1px solid ${PP_RULE}`,
        }}>
          {project.meta.map(([k, v]) => (
            <div key={k}>
              <dt style={{
                fontFamily: mono, fontSize: 10, color: PP_MUTED,
                textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 400,
              }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: sans, fontSize: 14, fontWeight: 300, color: PP_INK, lineHeight: 1.4 }}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Hero figure */}
      <Reveal i={5} style={{ marginTop: 48 }}>
        <Figure caption={project.figure} />
      </Reveal>

      {/* Body — 2 col */}
      <Reveal i={6} style={{ marginTop: 64 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 48,
        }}>
          <div>
            <div style={{
              fontFamily: mono, fontSize: 10, color: PP_MUTED,
              textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, fontWeight: 400,
            }}>
              Summary
            </div>
            <p style={{
              fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.65,
              margin: 0, color: PP_INK, maxWidth: '42ch',
            }}>
              {project.body}
            </p>
          </div>

          {project.process && (
            <div>
              <div style={{
                fontFamily: mono, fontSize: 10, color: PP_MUTED,
                textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, fontWeight: 400,
              }}>
                Process
              </div>
              <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                {project.process.map((step, i) => (
                  <li key={i} style={{
                    display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14,
                    padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${PP_RULE}`,
                  }}>
                    <span style={{
                      fontFamily: mono, fontSize: 12, color: PP_MUTED, fontWeight: 300,
                    }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{
                      fontFamily: sans, fontSize: 14, fontWeight: 300, lineHeight: 1.55, color: PP_INK,
                    }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </Reveal>

      {/* Secondary figures */}
      <Reveal i={7} style={{ marginTop: 72 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <Figure caption={`${project.title} — detail`} tall />
          <Figure caption={`${project.title} — context`} tall />
        </div>
      </Reveal>

      {/* Bottom nav */}
      <nav style={{
        marginTop: 96, paddingTop: 24, borderTop: `1px solid ${PP_RULE}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
      }}>
        <a href={`${prev.id}.html`} style={{
          textDecoration: 'none', color: PP_INK,
          padding: '20px 0',
        }}>
          <div style={{
            fontFamily: mono, fontSize: 10, color: PP_MUTED,
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, fontWeight: 400,
          }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>
            {prev.title}
          </div>
        </a>
        <a href={`${next.id}.html`} style={{
          textDecoration: 'none', color: PP_INK,
          padding: '20px 0', textAlign: 'right',
        }}>
          <div style={{
            fontFamily: mono, fontSize: 10, color: PP_MUTED,
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, fontWeight: 400,
          }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>
            {next.title}
          </div>
        </a>
      </nav>

      {/* Footer */}
      <footer style={{
        marginTop: 40, paddingTop: 20, borderTop: `1px solid ${PP_RULE}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: mono, fontSize: 10.5, color: PP_MUTED,
        textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400,
      }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: PP_INK, textDecoration: 'none' }}>
          linkedin.com/in/yao-wang-gsd
        </a>
        <span>Yao Wang · 王瑶 · 2026</span>
      </footer>
    </div>
  );
}

window.ProjectPage = ProjectPage;
