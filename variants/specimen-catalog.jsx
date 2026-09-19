// V4 — Specimen Catalog
// Grid of index cards. Each project = one specimen card with classification
// line, swatch slot, ID stamp. Pure B/W, generous whitespace.

const SC_INK = '#0a0a0a';
const SC_MUTED = 'rgba(10,10,10,0.5)';
const SC_RULE = 'rgba(10,10,10,0.18)';
const SC_PAPER = '#fafafa';

function SpecimenCard({ p, idx, sans, mono }) {
  const num = String(idx + 1).padStart(3, '0');
  const href = `projects/${p.id}.html`;
  const cls = (p.tags[0] || 'work').toUpperCase();

  // Hatch density driven by tag
  const hatchSpacing = 4 + (p.title.length % 4);

  return (
    <a href={href} style={{
      display: 'block', textDecoration: 'none', color: SC_INK,
      background: '#fff', border: `1px solid ${SC_INK}`,
      padding: '14px 16px 18px',
      position: 'relative',
      transition: 'transform .25s ease, box-shadow .25s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '4px 4px 0 0 #0a0a0a';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* ID stamp */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: mono, fontSize: 9.5, color: SC_MUTED,
        textTransform: 'uppercase', letterSpacing: 1.4,
      }}>
        <span>YW · {num}</span>
        <span>{p.year}</span>
      </div>

      {/* Classification */}
      <div style={{
        fontFamily: mono, fontSize: 9, color: SC_INK,
        letterSpacing: 1.6, marginTop: 4, marginBottom: 12,
        paddingBottom: 8, borderBottom: `1px solid ${SC_RULE}`,
      }}>
        CLASS · {cls}
      </div>

      {/* Specimen slot */}
      <div style={{
        aspectRatio: '4 / 3', width: '100%', position: 'relative',
        background: SC_PAPER, border: `1px solid ${SC_RULE}`, marginBottom: 14,
        overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id={`sc-${p.id}`} width={hatchSpacing} height={hatchSpacing}
              patternUnits="userSpaceOnUse" patternTransform={`rotate(${(idx * 23) % 90})`}>
              <line x1="0" y1="0" x2="0" y2={hatchSpacing} stroke={SC_INK} strokeOpacity="0.12" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#sc-${p.id})`} />
        </svg>
        <div style={{
          position: 'absolute', left: 8, top: 8,
          fontFamily: mono, fontSize: 8, color: SC_MUTED,
          textTransform: 'uppercase', letterSpacing: 1.2,
        }}>
          spec.
        </div>
        <div style={{
          position: 'absolute', right: 8, bottom: 8,
          fontFamily: mono, fontSize: 8, color: SC_MUTED,
          textTransform: 'uppercase', letterSpacing: 1.2,
        }}>
          fig.{num}
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: sans, fontWeight: 400, fontSize: 17,
        letterSpacing: -0.3, lineHeight: 1.2, margin: '0 0 6px',
      }}>
        {p.title}
      </h3>
      <p style={{
        fontFamily: sans, fontWeight: 300, fontSize: 12.5, lineHeight: 1.45,
        color: SC_MUTED, margin: 0,
      }}>
        {p.blurb}
      </p>

      {/* Tag chips */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12,
      }}>
        {p.tags.map((t) => (
          <span key={t} style={{
            fontFamily: mono, fontSize: 8.5, letterSpacing: 0.8,
            textTransform: 'uppercase', color: SC_INK,
            border: `1px solid ${SC_RULE}`, padding: '2px 5px',
          }}>{t}</span>
        ))}
      </div>
    </a>
  );
}

function SpecimenCatalog({ data }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const mono = 'Roboto, system-ui, sans-serif';

  return (
    <div style={{
      minHeight: '100vh', background: '#fff', color: SC_INK,
      padding: '72px 56px 96px', fontFamily: sans, fontWeight: 300,
    }}>
      {/* Header strip */}
      <header style={{
        display: 'grid', gridTemplateColumns: '1fr auto',
        alignItems: 'end', gap: 32, paddingBottom: 18,
        borderBottom: `2px solid ${SC_INK}`,
      }}>
        <div>
          <div style={{
            fontFamily: mono, fontSize: 10.5, color: SC_MUTED,
            textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8,
          }}>
            Specimen Catalog · {data.projects.length} entries · {data.session}
          </div>
          <h1 style={{
            fontFamily: sans, fontWeight: 600, fontSize: 64,
            letterSpacing: -1.6, lineHeight: 1, margin: 0,
          }}>
            Yao Wang
            <span style={{ color: SC_MUTED, fontSize: '0.42em', fontWeight: 600, marginLeft: 14 }}>王瑶</span>
          </h1>
        </div>
        <div style={{
          fontFamily: mono, fontSize: 11, color: SC_MUTED,
          textAlign: 'right', lineHeight: 1.7, letterSpacing: 0.4,
        }}>
          <div>MDes Mediums · Harvard GSD</div>
          <div>prev. RISD · ID</div>
        </div>
      </header>

      <p style={{
        fontFamily: sans, fontWeight: 100, fontSize: 18,
        color: SC_INK, lineHeight: 1.45, marginTop: 28, marginBottom: 0,
        maxWidth: '60ch',
      }}>
        {data.tagline}
      </p>

      {/* Card grid */}
      <section style={{
        marginTop: 56,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 18,
      }}>
        {data.projects.map((p, i) => (
          <SpecimenCard key={p.id} p={p} idx={i} sans={sans} mono={mono} />
        ))}
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 64, paddingTop: 20, borderTop: `1px solid ${SC_RULE}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
        fontFamily: mono, fontSize: 11, color: SC_MUTED, letterSpacing: 0.4,
      }}>
        <div>
          <div style={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: 10, marginBottom: 6 }}>
            Correspondence
          </div>
          <a href="mailto:yolanda_wang@gsd.harvard.edu" style={{ color: SC_INK, fontFamily: sans, fontSize: 14, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            yolanda_wang@gsd.harvard.edu
          </a>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: 10, marginBottom: 6 }}>
            Cataloged
          </div>
          <div style={{ fontFamily: sans, fontSize: 14, color: SC_INK }}>
            Cambridge, MA · Spring 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

window.SpecimenCatalog = SpecimenCatalog;
