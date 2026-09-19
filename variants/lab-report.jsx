// V2 — Lab Report
// Scientific paper / journal feel. Single column, justified body,
// numbered sections, footnote-style meta. Pure B/W.

const LR_INK = '#0a0a0a';
const LR_MUTED = 'rgba(10,10,10,0.55)';
const LR_RULE = 'rgba(10,10,10,0.18)';

function LabReport({ data }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const serif = 'Roboto, system-ui, sans-serif';
  const mono = 'Roboto, system-ui, sans-serif';

  const [revealed, setRevealed] = React.useState(0);
  React.useEffect(() => {
    let i = 0; let t;
    const tick = () => { i++; setRevealed(i); if (i < data.projects.length + 6) t = setTimeout(tick, 60); };
    tick(); return () => clearTimeout(t);
  }, [data.projects.length]);
  const Reveal = ({ i, children, style }) => (
    <div style={{
      opacity: revealed > i ? 1 : 0,
      transform: revealed > i ? 'translateY(0)' : 'translateY(4px)',
      transition: 'opacity .45s ease, transform .45s ease',
      ...style,
    }}>{children}</div>
  );

  return (
    <div style={{
      maxWidth: 760, margin: '0 auto',
      padding: '88px 32px 120px',
      fontFamily: serif, fontWeight: 300, color: LR_INK,
      background: '#fff',
    }}>
      {/* Journal-style masthead */}
      <Reveal i={0}>
        <div style={{
          fontFamily: mono, fontSize: 10.5, color: LR_MUTED,
          textTransform: 'uppercase', letterSpacing: 1.4,
          display: 'flex', justifyContent: 'space-between',
          paddingBottom: 10, borderBottom: `1px solid ${LR_INK}`,
        }}>
          <span>Wang, Y. — Selected Works</span>
          <span>Vol. 26 · Spring 2026</span>
        </div>
      </Reveal>

      {/* Title */}
      <Reveal i={1} style={{ marginTop: 56 }}>
        <h1 style={{
          fontFamily: serif, fontWeight: 400, fontSize: 44,
          lineHeight: 1.15, letterSpacing: -0.4, margin: 0, maxWidth: '20ch',
        }}>
          Notes from a practice in computational fabrication, soft &amp; active materials, and human–machine co-making.
        </h1>
      </Reveal>

      <Reveal i={2} style={{ marginTop: 32 }}>
        <div style={{
          fontFamily: serif, fontSize: 14, lineHeight: 1.6,
          color: LR_INK, fontStyle: 'italic',
        }}>
          Yao Wang <span style={{ fontStyle: 'normal' }}>· 王瑶</span>
        </div>
        <div style={{
          fontFamily: mono, fontSize: 11, color: LR_MUTED,
          letterSpacing: 0.6, marginTop: 4,
        }}>
          Harvard Graduate School of Design — MDes Mediums.{' '}
          Previously RISD, Industrial Design.
        </div>
      </Reveal>

      {/* Abstract */}
      <Reveal i={3} style={{ marginTop: 56 }}>
        <div style={{
          fontFamily: mono, fontSize: 10, color: LR_MUTED,
          textTransform: 'uppercase', letterSpacing: 1.4,
          marginBottom: 10,
        }}>
          Abstract
        </div>
        <p style={{
          fontFamily: serif, fontSize: 17, lineHeight: 1.65,
          margin: 0, textAlign: 'justify', hyphens: 'auto',
        }}>
          Across {data.projects.length} projects spanning textile sensing,
          biofabrication, responsive architecture, robotic construction, and
          tangible interaction, the works treat geometry, sequence, and
          interaction protocol as primary design variables. Each project is
          presented as a brief: motivation, method, current state.
        </p>
      </Reveal>

      {/* Sections */}
      {data.projects.map((p, i) => {
        const num = String(i + 1).padStart(2, '0');
        const href = `projects/${p.id}.html`;
        return (
          <Reveal key={p.id} i={4 + i} style={{ marginTop: i === 0 ? 64 : 48 }}>
            <article style={{ borderTop: `1px solid ${LR_RULE}`, paddingTop: 24 }}>
              <div style={{
                fontFamily: mono, fontSize: 10, color: LR_MUTED,
                textTransform: 'uppercase', letterSpacing: 1.4,
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <span>{num}</span>
                <span>{p.year}</span>
              </div>
              <h2 style={{
                fontFamily: serif, fontWeight: 500, fontSize: 24,
                lineHeight: 1.2, letterSpacing: -0.2, margin: '0 0 6px',
              }}>
                {p.title}
              </h2>
              <div style={{
                fontFamily: mono, fontSize: 10.5, color: LR_MUTED,
                textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14,
              }}>
                {p.tags.join(' · ')}
              </div>
              <p style={{
                fontFamily: serif, fontSize: 16, lineHeight: 1.7,
                margin: 0, textAlign: 'justify', hyphens: 'auto', color: LR_INK,
              }}>
                {p.body}
              </p>

              {/* footnote-style meta */}
              <dl style={{
                marginTop: 20, paddingTop: 12,
                borderTop: `1px dashed ${LR_RULE}`,
                display: 'grid', gridTemplateColumns: 'auto 1fr',
                columnGap: 14, rowGap: 4,
                fontFamily: mono, fontSize: 11, color: LR_MUTED, fontWeight: 400,
              }}>
                {p.meta.map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>{k}</dt>
                    <dd style={{ margin: 0, color: LR_INK, fontFamily: serif, fontSize: 13, fontWeight: 300 }}>{v}</dd>
                  </React.Fragment>
                ))}
              </dl>

              <a href={href} style={{
                display: 'inline-block', marginTop: 18,
                fontFamily: mono, fontSize: 11, fontWeight: 400, letterSpacing: 0.8,
                color: LR_INK, textDecoration: 'underline',
                textUnderlineOffset: 3, textDecorationThickness: '1px',
              }}>
                See full record →
              </a>
            </article>
          </Reveal>
        );
      })}

      {/* Colophon-as-footer */}
      <Reveal i={4 + data.projects.length + 1} style={{ marginTop: 64 }}>
        <footer style={{
          paddingTop: 24, borderTop: `1px solid ${LR_INK}`,
          fontFamily: mono, fontSize: 10.5, color: LR_MUTED,
          letterSpacing: 0.6, lineHeight: 1.7,
        }}>
          <div>Correspondence: <a href="mailto:yolanda_wang@gsd.harvard.edu" style={{ color: LR_INK }}>yolanda_wang@gsd.harvard.edu</a></div>
          <div>{data.linkedin.replace('https://www.', '')}</div>
          <div style={{ marginTop: 8 }}>Set in Roboto · {data.session}</div>
        </footer>
      </Reveal>
    </div>
  );
}

window.LabReport = LabReport;
