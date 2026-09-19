// Plain list index. One narrow column: who, then what.
// Every row keeps its plate open; hovering only underlines the title.
const PL_INK = '#0a0a0a';
const PL_MUTED = 'rgba(10,10,10,0.55)';
const PL_RULE = 'rgba(10,10,10,0.14)';
const PL_COL = 720;
const PL_EASE = 'cubic-bezier(.16,1,.3,1)';
const PL_REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PlainRow = React.memo(function PlainRow({ p, on, onEnter, onLeave }) {
  const Tag = p.locked ? 'div' : 'a';
  const linkProps = p.locked ? {} : { href: `projects/${p.id}.html` };
  return (
    <Tag
      {...linkProps}
      onMouseEnter={() => onEnter(p.id)}
      onMouseLeave={onLeave}
      style={{
        display: 'block', padding: '14px 0', borderTop: `1px solid ${PL_RULE}`,
        textDecoration: 'none', color: PL_INK, cursor: p.locked ? 'default' : 'pointer',
        opacity: p.wip ? 0.5 : 1, transition: 'opacity .15s ease',
      }}
    >
      <span style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', columnGap: 24, alignItems: 'baseline' }}>
        <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 12, rowGap: 2 }}>
          <span style={{ fontSize: 17, fontWeight: 400, letterSpacing: -0.3, textDecoration: on && !p.locked ? 'underline' : 'none', textUnderlineOffset: 3 }}>{p.title}</span>
          <span style={{ fontSize: 14, fontWeight: 300, color: PL_MUTED, lineHeight: 1.5 }}>{p.short || p.blurb}</span>
        </span>
        <span style={{ fontSize: 11, color: PL_MUTED, letterSpacing: 0.6, whiteSpace: 'nowrap' }}>
          {(p.venue || p.year || '').split(/(WINNER)/).map((seg, i) => (
            seg === 'WINNER'
              ? <span key={i} style={{ color: PL_INK, fontWeight: 400, letterSpacing: 1 }}>WINNER</span>
              : seg
          ))}
        </span>
      </span>
      {p.thumb && (
        <span style={{ display: 'block', overflow: 'hidden', marginTop: 14 }}>
          <img src={p.thumb} alt="" style={{
            display: 'block', width: '100%', height: 168, objectFit: 'cover',
            border: `1px solid ${PL_RULE}`,
            opacity: on ? 1 : 0.88, transition: PL_REDUCED ? 'none' : 'opacity .2s ease',
          }} />
        </span>
      )}
    </Tag>
  );
});

function PlainList({ data }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const [hover, setHover] = React.useState(null);
  const live = data.projects.filter((p) => !p.wip && !p.minor && !p.proto);
  const proto = data.projects.filter((p) => p.proto && !p.wip && !p.minor);
  const wip = data.projects.filter((p) => p.wip);
  const minor = data.projects.filter((p) => p.minor);

  const enter = React.useCallback((id) => setHover(id), []);
  const leave = React.useCallback(() => setHover(null), []);
  const [logoKey, setLogoKey] = React.useState(0);

  const rows = (list) => list.map((p) => (
    <PlainRow key={p.id} p={p} on={hover === p.id} onEnter={enter} onLeave={leave} />
  ));

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: PL_INK, fontFamily: sans, fontWeight: 300, padding: '80px 32px 120px' }}>
      {false && (
        <div onMouseEnter={() => setLogoKey((k) => k + 1)} style={{ marginBottom: 56 }}>
          <window.PrintLogo playKey={logoKey} height={34} text="Yao" track="rgba(10,10,10,0.1)" />
        </div>
      )}
      <div style={{ maxWidth: PL_COL, margin: '0 auto', position: 'relative' }}>
        <h1 style={{ fontSize: 17, fontWeight: 400, letterSpacing: -0.2, margin: 0 }}>
          {data.name}<span style={{ color: PL_MUTED, marginLeft: 10 }}>{data.kanji}</span>
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: PL_INK, margin: '16px 0 0', maxWidth: '58ch' }}>{data.tagline}</p>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: PL_MUTED, margin: '10px 0 0', maxWidth: '58ch' }}>
          Harvard GSD, MDes Mediums. Previously Industrial Design at RISD.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.65, margin: '10px 0 0', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <a href={`mailto:${data.email}`} style={{ color: PL_INK, textDecorationThickness: 1, textUnderlineOffset: 3 }}>{data.email}</a>
          <a href={`mailto:${data.emailAlt}`} style={{ color: PL_INK, textDecorationThickness: 1, textUnderlineOffset: 3 }}>{data.emailAlt}</a>
          <a href={data.linkedin} style={{ color: PL_INK, textDecorationThickness: 1, textUnderlineOffset: 3 }}>LinkedIn</a>
        </p>

        <div style={{ marginTop: 64 }}>
          <div style={{ fontSize: 10, color: PL_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>Digital fabrication</div>
          {rows(live)}
          <div style={{ borderTop: `1px solid ${PL_RULE}` }} />
        </div>

        {proto.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div style={{ fontSize: 10, color: PL_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>Interactive prototypes</div>
            {rows(proto)}
            <div style={{ borderTop: `1px solid ${PL_RULE}` }} />
          </div>
        )}

        {wip.length > 0 && false && (
          <div style={{ marginTop: 56 }}>
            <div style={{ fontSize: 10, color: PL_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>In progress</div>
            {rows(wip)}
            <div style={{ borderTop: `1px solid ${PL_RULE}` }} />
          </div>
        )}

        {minor.length > 0 && false && (
          <div style={{ marginTop: 56 }}>
            <div style={{ fontSize: 10, color: PL_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>Smaller projects</div>
            {rows(minor)}
            <div style={{ borderTop: `1px solid ${PL_RULE}` }} />
          </div>
        )}

      </div>
    </div>
  );
}

window.PlainList = PlainList;
