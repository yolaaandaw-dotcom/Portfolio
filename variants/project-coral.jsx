// Project-specific page for rockite (Coral Chair). Every picture is its own image and every word is live text:
// the two finished objects, the mold and the text about it, the four casting steps, then the idealized
// part set against the 3D scan, view by view. No rules; images in one row share one size.
const CC_INK = '#0a0a0a';
const CC_MUTED = 'rgba(10,10,10,0.68)';

function CoralPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const A = 'assets/coral-chair/';

  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];
  const num = String(idx + 1).padStart(2, '0');
  const shownMeta = project.meta.filter(([k]) => k !== 'tools' && k !== 'status');

  const small = { fontSize: 10, color: CC_MUTED, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 400 };
  const Label = ({ children }) => <div style={{ ...small, marginBottom: 14 }}>{children}</div>;
  const Cap = ({ children }) => <div style={{ fontSize: 12, color: CC_MUTED, marginTop: 10, lineHeight: 1.5 }}>{children}</div>;
  const Img = ({ src, alt, ratio, fit = 'cover' }) => (
    <img src={A + src} alt={alt} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: ratio, objectFit: fit, background: '#fff' }} />
  );
  const VIEWS = ['perspective', 'front', 'side', 'top'];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: CC_INK, fontFamily: sans, fontWeight: 300, padding: '80px 32px 120px', maxWidth: 1120, margin: '0 auto' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontSize: 11, color: CC_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14 }}>
        <a href="../index.html" style={{ justifySelf: 'start', color: CC_INK, textDecoration: 'none' }}>← Home</a>
        <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
        <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
          <a href={`${prev.id}.html`} style={{ color: CC_MUTED, textDecoration: 'none' }}>prev</a>
          <a href={`${next.id}.html`} style={{ color: CC_INK, textDecoration: 'none' }}>next →</a>
        </span>
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 300, letterSpacing: -0.7, lineHeight: 1.15, margin: '64px 0 0' }}>{project.title}</h1>
      <p style={{ fontSize: 17, fontWeight: 300, color: CC_MUTED, lineHeight: 1.5, margin: '18px 0 0' }}>{project.subtitle}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 36 }}>
        <div>
          <Img src="cc-mold.jpg" alt="The 3D printed mold: a pentagonal lattice seat on five legs" ratio="3 / 4" />
          <Cap>3D printed mold</Cap>
        </div>
        <div>
          <Img src="cc-final.jpg" alt="The final part cast in Rockite, with the white PLA tips of the legs showing" ratio="3 / 4" />
          <Cap>Final part</Cap>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 56, alignItems: 'center', marginTop: 96 }}>
        <div>
          <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0, maxWidth: '52ch' }}>{project.blurb}</p>
          <dl style={{ margin: '36px 0 0' }}>
            {shownMeta.map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
                <dt style={{ ...small, letterSpacing: 1, lineHeight: 2 }}>{k}</dt>
                <dd style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <Img src="cc-mold-diagram.jpg" alt="The PVA mold and the PLA core as line drawings, and the two together as a render" ratio="2000 / 1117" fit="contain" />
          <Cap>The PVA mold outside, the PLA core inside.</Cap>
        </div>
      </div>

      <div style={{ marginTop: 96 }}>
        <Label>Fabrication process</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            ['cc-step1-casting.jpg', 'Casting', 'Rockite being poured into the printed mold'],
            ['cc-step2-setting.jpg', 'Rockite solidification', 'The mold filled with set Rockite'],
            ['cc-step3-dissolving.jpg', 'PVA dissolving', 'The part upside down in warm water as the PVA dissolves'],
            ['cc-step4-demolding.jpg', 'Demolding', 'The part out of the mold, upside down'],
          ].map(([src, cap, alt]) => (
            <div key={src}>
              <Img src={src} alt={alt} ratio="975 / 1411" />
              <Cap>{cap}</Cap>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 96 }}>
        <Label>Idealized part and 3D scan data</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[['Idealized part', 'Rhino + nTop'], ['3D scan data', 'Mesh'], ['3D scan data', 'Scaniverse']].map(([g, s]) => (
            <div key={s}>
              <div style={{ fontSize: 16, fontWeight: 400, letterSpacing: -0.2 }}>{g}</div>
              <div style={{ fontSize: 13, color: CC_MUTED, marginTop: 4 }}>{s}</div>
            </div>
          ))}
          {VIEWS.map((v) => (
            <React.Fragment key={v}>
              <Img src={`cc-ideal-${v}.jpg`} alt={`Idealized part, ${v} view`} ratio="1 / 1" fit="contain" />
              <Img src={`cc-mesh-${v}.jpg`} alt={`Scanned mesh, ${v} view`} ratio="1 / 1" fit="contain" />
              <Img src={`cc-scan-${v}.jpg`} alt={`3D scan, ${v} view`} ratio="1 / 1" />
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 48 }}>
          <div>
            <Img src="cc-ideal-render.jpg" alt="Render of the idealized lattice and legs" ratio="4 / 3" fit="contain" />
            <Cap>The idealized part.</Cap>
          </div>
          <div>
            <Img src="cc-scan-mesh.jpg" alt="Wireframe mesh of the scanned cast" ratio="4 / 3" fit="contain" />
            <Cap>The scanned cast.</Cap>
          </div>
        </div>
      </div>

      <nav style={{ marginTop: 96, paddingTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: CC_INK, padding: '20px 0' }}>
          <div style={{ ...small, letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: CC_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{ ...small, letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ marginTop: 40, paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: CC_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: CC_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang 王瑶</span>
      </footer>
    </div>
  );
}

window.CoralPage = CoralPage;
