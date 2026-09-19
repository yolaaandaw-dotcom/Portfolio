// V3 — Spec Sheet
// Horizontal data ledger. Every project is one row of an instrument datasheet.
// Hairline rules, monospaced numerics, dense and decisive. Pure B/W.

const SS_INK = '#0a0a0a';
const SS_MUTED = 'rgba(10,10,10,0.5)';
const SS_RULE = 'rgba(10,10,10,0.16)';
const SS_FAINT = 'rgba(10,10,10,0.04)';

function SpecSheet({ data }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const COLS = '36px minmax(220px,1.7fr) 52px minmax(140px,1.4fr) minmax(140px,1.4fr) minmax(130px,1.2fr) minmax(96px,1fr) 44px';
  const TABLE_MIN = 1080;
  const mono = 'Roboto, system-ui, sans-serif';

  // Pull a "method" string out of meta tools
  const methodOf = (p) => {
    const tools = p.meta.find(([k]) => k === 'tools');
    return tools ? tools[1].split(' · ').slice(0, 2).join(' · ') : '—';
  };
  const outputOf = (p) => {
    const out = p.meta.find(([k]) => k === 'output');
    return out ? out[1] : '—';
  };
  const statusOf = (p) => {
    const s = p.meta.find(([k]) => k === 'status');
    return s ? s[1] : (p.indexStatus || 'Complete');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#fff', color: SS_INK,
      padding: '64px 56px 96px', fontFamily: sans, fontWeight: 300,
    }}>
      {/* Title block */}
      <header style={{
        display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end',
        gap: 32, paddingBottom: 18, borderBottom: `2px solid ${SS_INK}`,
      }}>
        <div>
          <h1 style={{
            fontFamily: sans, fontWeight: 600, fontSize: 56,
            letterSpacing: -1.4, lineHeight: 1, margin: 0,
          }}>
            Yao Wang
            <span style={{ color: SS_MUTED, fontSize: '0.42em', fontWeight: 600, marginLeft: 14 }}>王瑶</span>
          </h1>
          <div style={{
            fontFamily: sans, fontWeight: 100, fontSize: 16,
            color: SS_INK, marginTop: 12, maxWidth: '64ch',
          }}>
            {data.tagline}
          </div>
        </div>
        <div style={{
          fontFamily: mono, fontSize: 11, color: SS_MUTED,
          textAlign: 'right', lineHeight: 1.7, letterSpacing: 0.4,
        }}>
          <div>MDes Mediums · Harvard GSD</div>
          <div>prev. RISD · ID</div>
          <div style={{ marginTop: 6, color: SS_INK }}>
            <a href="mailto:yolanda_wang@gsd.harvard.edu" style={{ color: SS_INK, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              yolanda_wang@gsd.harvard.edu
            </a>
          </div>
        </div>
      </header>

      {/* Table */}
      <div style={{ marginTop: 36, overflowX: 'auto' }}>
        <div style={{ minWidth: TABLE_MIN }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: COLS,
          columnGap: 16,
          fontFamily: mono, fontSize: 10, color: SS_MUTED,
          textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 400,
          padding: '10px 0', borderBottom: `1px solid ${SS_INK}`,
        }}>
          <span>№</span>
          <span>Project</span>
          <span>Year</span>
          <span>Domain</span>
          <span>Method</span>
          <span>Output</span>
          <span>Status</span>
          <span style={{ textAlign: 'right' }}>Doc</span>
        </div>

        {data.projects.map((p, i) => {
          const num = String(i + 1).padStart(2, '0');
          return (
            <a
              key={p.id}
              href={`projects/${p.id}.html`}
              style={{
                display: 'grid',
                gridTemplateColumns: COLS,
                columnGap: 16, padding: '14px 0',
                borderBottom: `1px solid ${SS_RULE}`,
                alignItems: 'baseline', textDecoration: 'none', color: SS_INK,
                background: i % 2 === 1 ? SS_FAINT : 'transparent',
                opacity: p.wip ? 0.42 : 1,
                transition: 'background .15s ease, opacity .15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#0a0a0a08'; e.currentTarget.style.opacity = 1; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 1 ? SS_FAINT : 'transparent'; e.currentTarget.style.opacity = p.wip ? 0.42 : 1; }}
            >
              <span style={{ fontFamily: mono, fontSize: 11, color: SS_MUTED, fontVariantNumeric: 'tabular-nums' }}>
                {num}
              </span>
              <span>
                <div style={{
                  fontFamily: sans, fontWeight: 400, fontSize: 16,
                  letterSpacing: -0.2, lineHeight: 1.25,
                }}>
                  {p.title}
                </div>
                <div style={{
                  fontFamily: sans, fontSize: 12, color: SS_MUTED,
                  fontWeight: 300, lineHeight: 1.4, marginTop: 3,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {p.blurb}
                </div>
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, color: SS_INK, fontVariantNumeric: 'tabular-nums' }}>
                {p.year}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, color: SS_INK, lineHeight: 1.5 }}>
                {p.tags.join(' · ')}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, color: SS_INK, lineHeight: 1.5 }}>
                {methodOf(p)}
              </span>
              <span style={{ fontFamily: sans, fontSize: 12, color: SS_INK, fontWeight: 300, lineHeight: 1.5 }}>
                {outputOf(p)}
              </span>
              <span style={{ fontFamily: mono, fontSize: 10.5, color: SS_INK, lineHeight: 1.5, letterSpacing: 0.3 }}>
                {statusOf(p)}
              </span>
              <span style={{
                textAlign: 'right', fontFamily: mono, fontSize: 11,
                color: SS_INK, letterSpacing: 0.6,
              }}>
                ↗
              </span>
            </a>
          );
        })}
        <div style={{ borderBottom: `2px solid ${SS_INK}` }} />
        </div>
      </div>

      {/* Sign-off */}
      <footer style={{
        marginTop: 48, paddingTop: 18, borderTop: `1px solid ${SS_RULE}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: mono, fontSize: 10.5, color: SS_MUTED,
        textTransform: 'uppercase', letterSpacing: 1.2,
      }}>
        <span>{data.projects.length} entries</span>
        <span>Yao Wang · Harvard GSD · 2026</span>
      </footer>
    </div>
  );
}

window.SpecSheet = SpecSheet;
