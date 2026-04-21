// V1 — Field Notebook (Roboto Light · B/W + fluorescent yellow-green accent)

const FN_ACCENT = '#c6ff00'; // fluorescent yellow-green
const FN_INK = '#0a0a0a';
const FN_PAPER = '#ffffff';
const FN_RULE = 'rgba(10,10,10,0.14)';
const FN_MUTED = 'rgba(10,10,10,0.5)';

function FNChrome({ density = 'tight' }) {
  const Mark = ({ style }) => (
    <svg width="14" height="14" viewBox="0 0 18 18" style={{ position: 'absolute', ...style, color: FN_INK, opacity: 0.35 }}>
      <line x1="9" y1="0" x2="9" y2="18" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
  const edge = density === 'tight' ? 20 : 30;
  return (
    <>
      <Mark style={{ top: edge, left: edge }} />
      <Mark style={{ top: edge, right: edge }} />
      <Mark style={{ bottom: edge, left: edge }} />
      <Mark style={{ bottom: edge, right: edge }} />
    </>
  );
}

function FNRow({ p, idx, open, onToggle, density, sans, mono }) {
  const num = String(idx + 1).padStart(2, '0');
  const projectHref = `projects/${p.id}.html`;
  const padY = density === 'tight' ? 18 : 30;
  return (
    <article style={{
      borderTop: `1px solid ${FN_RULE}`,
      padding: `${padY}px 0`,
      position: 'relative',
      background: open ? `linear-gradient(to bottom, ${FN_ACCENT}14, transparent 120px)` : 'transparent',
      transition: 'background .35s ease',
    }}>
      <button onClick={onToggle} style={{
        all: 'unset', display: 'grid', width: '100%',
        gridTemplateColumns: '56px 1fr 1.2fr 220px',
        alignItems: 'baseline', gap: 24, cursor: 'pointer',
      }}>
        <span style={{ fontFamily: mono, fontSize: 12, color: FN_MUTED, fontVariantNumeric: 'tabular-nums', fontWeight: 300 }}>
          {num}
        </span>
        <h3 style={{
          fontFamily: sans, fontWeight: 300, fontSize: density === 'tight' ? 24 : 32,
          lineHeight: 1.1, letterSpacing: -0.4, color: FN_INK, margin: 0,
          position: 'relative', display: 'inline-block',
        }}>
          <span style={{
            position: 'relative',
            backgroundImage: open
              ? `linear-gradient(${FN_ACCENT}, ${FN_ACCENT})`
              : 'none',
            backgroundRepeat: 'no-repeat',
            backgroundSize: open ? '100% 42%' : '0% 42%',
            backgroundPosition: '0 78%',
            transition: 'background-size .4s ease',
            padding: '0 2px',
          }}>{p.title}</span>
          <span style={{ color: FN_MUTED, fontSize: '0.6em', marginLeft: 10, fontWeight: 300 }}>
            {p.year}
          </span>
        </h3>
        <span style={{ fontFamily: sans, fontWeight: 300, fontSize: density === 'tight' ? 14 : 16, color: FN_MUTED, lineHeight: 1.4 }}>
          {p.blurb}
        </span>
        <span style={{ fontFamily: mono, fontSize: 10.5, color: FN_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 400, lineHeight: 1.6 }}>
          {p.tags.join('  ·  ')}
        </span>
      </button>

      <div style={{
        display: 'grid', gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows .45s cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '56px 1.1fr 1.3fr 40px',
            gap: 20, paddingTop: 28, paddingBottom: 8,
          }}>
            <div />
            <div>
              <FNFigure caption={p.figure} mono={mono} />
            </div>
            <div style={{ fontFamily: sans, fontWeight: 300, fontSize: 15, lineHeight: 1.6, color: FN_INK, maxWidth: '52ch' }}>
              <p style={{ margin: '0 0 16px' }}>{p.body}</p>
              {p.process && (
                <ol style={{ margin: '16px 0 20px', paddingLeft: 0, listStyle: 'none' }}>
                  {p.process.map((step, i) => (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 10, padding: '3px 0', fontFamily: mono, fontSize: 12, color: FN_INK, fontWeight: 300 }}>
                      <span style={{ color: FN_MUTED }}>{String(i + 1).padStart(2, '0')}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
              <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 16, rowGap: 4, margin: '18px 0 0', fontFamily: mono, fontSize: 11, color: FN_MUTED, fontWeight: 400 }}>
                {p.meta.map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>{k}</dt>
                    <dd style={{ margin: 0, color: FN_INK, fontWeight: 300, fontFamily: sans, fontSize: 13 }}>{v}</dd>
                  </React.Fragment>
                ))}
              </dl>
              <a href={projectHref} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                marginTop: 28,
                fontFamily: mono, fontSize: 11, fontWeight: 400, letterSpacing: 1.2,
                textTransform: 'uppercase', color: FN_INK, textDecoration: 'none',
                padding: '9px 14px', border: `1px solid ${FN_INK}`, background: '#fff',
                transition: 'background .2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = FN_ACCENT; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
              >
                Open page <span aria-hidden style={{ fontSize: 13 }}>→</span>
              </a>
            </div>
            <div />
          </div>
        </div>
      </div>
    </article>
  );
}

function FNFigure({ caption, mono }) {
  return (
    <figure style={{ margin: 0 }}>
      <div style={{
        aspectRatio: '4 / 3', width: '100%', position: 'relative',
        border: `1px solid ${FN_RULE}`, background: '#fafafa', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="fnhatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke={FN_INK} strokeOpacity="0.06" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fnhatch)" />
          <rect x="0" y="0" width="4" height="4" fill={FN_ACCENT} />
        </svg>
        <div style={{
          position: 'absolute', inset: 10, border: `1px dashed ${FN_RULE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: mono, fontSize: 10, fontWeight: 400,
          color: FN_MUTED, letterSpacing: 0.8, textTransform: 'uppercase',
        }}>
          fig. plate
        </div>
      </div>
      <figcaption style={{
        fontFamily: mono, fontSize: 10.5, color: FN_MUTED, marginTop: 8,
        letterSpacing: 0.4, fontWeight: 400,
      }}>
        fig. — {caption}
      </figcaption>
    </figure>
  );
}

function FieldNotebook({ data, density = 'tight', pair = 'sans-mono' }) {
  const [open, setOpen] = React.useState(null);
  const [revealed, setRevealed] = React.useState(0);

  React.useEffect(() => {
    let t; let i = 0;
    const tick = () => { i++; setRevealed(i); if (i < data.projects.length + 3) t = setTimeout(tick, 80); };
    tick();
    return () => clearTimeout(t);
  }, [data.projects.length]);

  // All Roboto — sans (light) dominant, mono for meta.
  const pairs = {
    'sans-mono':  { sans: 'Roboto, system-ui, sans-serif',            mono: '"Roboto Mono", ui-monospace, monospace' },
    'serif-mono': { sans: '"Roboto Serif", Roboto, serif',            mono: '"Roboto Mono", ui-monospace, monospace' },
    'serif-sans': { sans: '"Roboto Serif", Roboto, serif',            mono: 'Roboto, system-ui, sans-serif' },
  };
  const { sans, mono } = pairs[pair] || pairs['sans-mono'];

  const padX = density === 'tight' ? 72 : 112;
  const padY = density === 'tight' ? 64 : 96;

  const Reveal = ({ i, children, style }) => (
    <div style={{
      opacity: revealed > i ? 1 : 0,
      transform: revealed > i ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity .5s ease, transform .5s ease',
      ...style,
    }}>{children}</div>
  );

  // Easter egg — typing "wang" toggles large kanji overlay in accent color
  const [egg, setEgg] = React.useState(false);
  React.useEffect(() => {
    let buf = '';
    const k = (e) => {
      if (e.target && e.target.closest && e.target.closest('input,textarea,[contenteditable]')) return;
      buf = (buf + (e.key || '').toLowerCase()).slice(-4);
      if (buf === 'wang') setEgg((v) => !v);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  return (
    <div style={{
      position: 'relative', minHeight: '100%', background: FN_PAPER, color: FN_INK,
      padding: `${padY}px ${padX}px`, fontFamily: sans, fontWeight: 300,
    }}>
      <FNChrome density={density} />

      {egg && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: sans, fontSize: 'min(52vw, 900px)', color: FN_ACCENT,
            opacity: 0.5, mixBlendMode: 'multiply',
            fontWeight: 300, lineHeight: 1,
          }}>王瑶</div>
        </div>
      )}

      {/* Masthead */}
      <header style={{ position: 'relative', marginBottom: density === 'tight' ? 72 : 112 }}>
        <Reveal i={1}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 40 }}>
            <h1 style={{
              fontFamily: sans, fontWeight: 600, fontSize: density === 'tight' ? 76 : 104,
              lineHeight: 0.98, letterSpacing: -2.2, margin: 0, color: FN_INK,
            }}>
              Yao Wang
              <span style={{ color: FN_MUTED, fontSize: '0.42em', marginLeft: 18, letterSpacing: -0.5, fontWeight: 600 }}>
                王瑶
              </span>
            </h1>
            <div style={{ fontFamily: mono, fontSize: 11.5, color: FN_MUTED, textAlign: 'right', lineHeight: 1.7, fontWeight: 400 }}>
              <div>MDes Mediums· Harvard GSD</div>
              <div>prev. RISD · ID</div>
            </div>
          </div>
        </Reveal>

        <Reveal i={2} style={{ marginTop: 28 }}>
          <p style={{
            fontFamily: sans, fontWeight: 100, fontSize: density === 'tight' ? 20 : 24,
            lineHeight: 1.4, maxWidth: '52ch', color: FN_INK, margin: 0,
          }}>
            {data.tagline}
          </p>
        </Reveal>
      </header>

      {/* Index header */}
      <Reveal i={3}>
        <div style={{
          display: 'grid', gridTemplateColumns: '56px 1fr 1.2fr 220px',
          gap: 24, fontFamily: mono, fontSize: 10, color: FN_MUTED,
          textTransform: 'uppercase', letterSpacing: 1.2, paddingBottom: 12, fontWeight: 400,
        }}>
          <span>No.</span>
          <span>Project</span>
          <span>Abstract</span>
          <span>Tags</span>
        </div>
      </Reveal>

      <section>
        {data.projects.map((p, i) => (
          <Reveal key={p.id} i={4 + i}>
            <FNRow
              p={p} idx={i}
              open={open === p.id} onToggle={() => setOpen(open === p.id ? null : p.id)}
              density={density} sans={sans} mono={mono}
            />
          </Reveal>
        ))}
        <div style={{ borderTop: `1px solid ${FN_RULE}` }} />
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: density === 'tight' ? 96 : 140,
        display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40,
        fontFamily: mono, fontSize: 11.5, color: FN_MUTED, fontWeight: 400,
        borderTop: `1px solid ${FN_RULE}`, paddingTop: 24,
      }}>
        <div>
          <div style={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: 10, marginBottom: 8 }}>Contact</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <a href="mailto:yolanda_wang@gsd.harvard.edu" style={{ fontFamily: sans, fontSize: 14, fontWeight: 300, color: FN_INK, textDecoration: 'none', backgroundImage: `linear-gradient(${FN_ACCENT}, ${FN_ACCENT})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 18%', backgroundPosition: '0 92%', padding: '0 2px', width: 'fit-content' }}>
              yolanda_wang@gsd.harvard.edu
            </a>
            <a href={data.linkedin} style={{ fontFamily: sans, fontSize: 14, fontWeight: 300, color: FN_INK, textDecoration: 'none', backgroundImage: `linear-gradient(${FN_ACCENT}, ${FN_ACCENT})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 18%', backgroundPosition: '0 92%', padding: '0 2px', width: 'fit-content' }}>
              linkedin.com/in/yao-wang-gsd
            </a>
          </div>
        </div>
        <div>
          <div style={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: 10, marginBottom: 8 }}>Present</div>
          <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 300, color: FN_INK }}>Harvard Graduate School of Design</div>
          <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 300 }}>Cambridge, Massachusetts</div>
        </div>
      </footer>
    </div>
  );
}

window.FieldNotebook = FieldNotebook;
