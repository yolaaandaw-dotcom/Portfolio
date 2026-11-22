// Plain list index: who, then what. The main work sits in two columns side by side,
// fabrication on the left and interactive on the right; the smaller work is one ledger below.
// Every row keeps its plate open; hovering only underlines the title.
// No rules between rows: space does the separating (a title sits close to its own picture and far
// from the one above), and the Also ledger is held together by three aligned columns.
const PL_INK = '#0a0a0a';
const PL_MUTED = 'rgba(10,10,10,0.68)';   // secondary text: dark enough to read without effort
const PL_RULE = 'rgba(10,10,10,0.14)';
const PL_COL = 720;
const PL_EASE = 'cubic-bezier(.16,1,.3,1)';
// section labels: one muted uppercase line, large enough to read as a heading
// section labels: one small muted uppercase line, as the page always had
const PL_LABEL = { fontSize: 10, color: PL_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 20 };
function SectionLabel({ children }) { return <div style={{ ...PL_LABEL }}>{children}</div>; }
const PL_REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Diagnostic Mazes row draws a new maze every load (variants/maze-plate.jsx). Set to false to take it off.
const PL_MAZE = false;
// The name is one continuous line with a loose end that can be pulled (variants/ribbon-name.jsx).
const PL_RIBBON_NAME = true;
// Fabrication and interactive side by side instead of one under the other. Set to false for the single column.
const PL_TWO_COL = true;
const PL_WIDE = 1120;                 // page width when the two columns sit side by side
const PL_STACK_BELOW = 860;           // narrower than this, the columns stack
// the interactive column, in order; Tape Collage sits here with its picture, Sticker Station is a line in Also
const INTERACTIVE_ORDER = ['yousan', 'climbit', 'handshake', 'tape-collage'];
// the fabrication column, in order; anything not named here follows in the order of data.jsx
const FAB_ORDER = ['tpu', 'fluidic', 'chair', 'clay', 'rockite'];
// covers are cut 1436 x 332 for the old 720px column; keep that shape at any column width so nothing is cropped off the sides
const PL_COVER = '1436 / 332';        // small cover: a strip
const PL_COVER_BIG = '16 / 9';        // large cover: one shape for every main project, so the two columns line up row by row
const PL_ROW_GAP = 44;                 // space under a pictured row, in place of a rule
const PL_ALSO_COLS = PL_TWO_COL ? '270px minmax(0,1fr) 240px' : '190px minmax(0,1fr) auto';
if (!document.getElementById('pl-cols-css')) {
  const st = document.createElement('style'); st.id = 'pl-cols-css';
  st.textContent = `.pl-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:56px;row-gap:0;align-items:start}`
    + `.pl-also{display:grid;grid-template-columns:${PL_ALSO_COLS};column-gap:28px;align-items:baseline;padding:8px 0}`
    + `@media (max-width:${PL_STACK_BELOW}px){.pl-cols{grid-template-columns:minmax(0,1fr)}`
    + `.pl-cols>.pl-l0{order:1}.pl-cols>.pl-l{order:2}.pl-cols>.pl-r0{order:3;margin-top:28px}.pl-cols>.pl-r{order:4}.pl-cols>.pl-empty{display:none}`
    + `.pl-also{grid-template-columns:minmax(0,1fr);row-gap:2px;padding:11px 0}}`;
  document.head.appendChild(st);
}

// ---- moving covers (data.jsx `cover`). Each one is a still picture until the pointer is on its row.
// fade: one picture gives way to the next. assemble: the same, with a small scale so parts seem to close.
// pair: two pictures side by side, the pointer slides the seam. matrix: a grid of frames lit one after another.
// On touch screens, where nothing hovers, fade and assemble play by themselves while the cover is on screen.
const PL_TOUCH = window.matchMedia && window.matchMedia('(hover: none)').matches;
function usePlInView(ref) {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.3 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  return seen;
}
const PL_LAYER = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
function plPlate(c, on) {
  return { position: 'relative', display: 'block', width: '100%', aspectRatio: PL_COVER_BIG, overflow: 'hidden',
    border: `1px solid ${PL_RULE}`, background: c.dark ? '#000' : '#fff',
    opacity: on ? 1 : 0.88, transition: PL_REDUCED ? 'none' : 'opacity .2s ease' };
}
function PlCover({ p, on }) {
  const c = p.cover;
  if (c.kind === 'pair') return <PlPair c={c} on={on} />;
  if (c.kind === 'matrix') return <PlMatrix c={c} on={on} />;
  return <PlFade c={c} on={on} />;
}
function PlFade({ c, on }) {
  const ref = React.useRef(null);
  const seen = usePlInView(ref);
  const [tick, setTick] = React.useState(false);
  React.useEffect(() => {
    if (!PL_TOUCH || PL_REDUCED || !seen) { setTick(false); return; }
    const t = setInterval(() => setTick((x) => !x), 2600); return () => clearInterval(t);
  }, [seen]);
  const act = on || tick;
  const T = (v) => (PL_REDUCED ? 'none' : v);
  const asm = c.kind === 'assemble';
  return (
    <span ref={ref} style={plPlate(c, on)}>
      <img src={c.a} alt="" style={{ ...PL_LAYER, ...(asm ? { opacity: act ? 0 : 1, transform: act ? 'scale(.97)' : 'none', transition: T(`transform 1s ${PL_EASE}, opacity .6s ease`) } : {}) }} />
      <img src={c.b} alt="" loading="lazy" style={{ ...PL_LAYER, opacity: act ? 1 : 0,
        ...(asm ? { transform: act ? 'none' : 'scale(1.03)', transition: T(`transform 1s ${PL_EASE}, opacity .8s ease`) } : { transition: T('opacity .7s ease') }) }} />
    </span>
  );
}
function PlPair({ c, on }) {
  const ref = React.useRef(null);
  const seen = usePlInView(ref);
  const win = c.win || 0.67;
  const [w, setW] = React.useState(0);
  const [x, setX] = React.useState(0.5);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => setW(el.clientWidth); fit();
    if (!('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, []);
  // touch: the seam swings slowly by itself while the cover is on screen
  React.useEffect(() => {
    if (!PL_TOUCH || PL_REDUCED || !seen) return;
    let raf; const t0 = performance.now();
    const step = (now) => { setX(0.5 + 0.5 * Math.sin((now - t0) / 1700)); raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [seen]);
  const move = (e) => { const r = ref.current.getBoundingClientRect(); setX(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))); };
  const seam = ((1 - win) + (2 * win - 1) * x) * 100;
  const side = { position: 'absolute', top: 0, bottom: 0, overflow: 'hidden', transition: PL_REDUCED || PL_TOUCH ? 'none' : `width .35s ${PL_EASE}` };
  const pic = { position: 'absolute', top: 0, height: '100%', width: w * win, objectFit: 'cover', objectPosition: '50% 45%', display: 'block' };
  return (
    <span ref={ref} onMouseMove={move} onMouseLeave={() => setX(0.5)} style={{ ...plPlate(c, on), cursor: 'ew-resize' }}>
      <span style={{ ...side, left: 0, width: `calc(${seam}% - 1px)` }}><img src={c.a} alt="" style={{ ...pic, left: 0 }} /></span>
      <span style={{ ...side, right: 0, width: `calc(${100 - seam}% - 1px)` }}><img src={c.b} alt="" style={{ ...pic, right: 0 }} /></span>
    </span>
  );
}
function PlMatrix({ c, on }) {
  const ref = React.useRef(null);
  const seen = usePlInView(ref);
  const n = c.cells.length;
  const [k, setK] = React.useState(n);
  const [hot, setHot] = React.useState(-1);
  const [over, setOver] = React.useState(false);
  React.useEffect(() => {
    if (PL_REDUCED || !seen || over) return;
    const t = setInterval(() => setK((v) => (v + 1) % (n + 18)), 260); return () => clearInterval(t);
  }, [seen, over]);
  return (
    <span ref={ref} onMouseEnter={() => setOver(true)} onMouseLeave={() => { setOver(false); setHot(-1); }} style={plPlate(c, on)}>
      {/* the picture under the grid shows only while the pointer is on the cover, through the dimmed frames */}
      {c.under && <img src={c.under} alt="" loading="lazy" style={{ ...PL_LAYER, opacity: over ? 0.55 : 0, transition: PL_REDUCED ? 'none' : 'opacity .6s ease' }} />}
      <span style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${c.cols},1fr)`, gridTemplateRows: `repeat(${c.rows},1fr)` }}>
        {c.cells.map((src, i) => (
          <span key={src} onMouseEnter={() => setHot(i)} style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={src} alt="" loading="lazy" style={{ ...PL_LAYER, objectFit: 'contain',
              opacity: over ? (hot === i ? 1 : 0.25) : (i > k ? 0.1 : 1), transition: PL_REDUCED ? 'none' : 'opacity .5s ease' }} />
          </span>
        ))}
      </span>
    </span>
  );
}

const PlainRow = React.memo(function PlainRow({ p, on, onEnter, onLeave, card, stack }) {
  const stacked = !!(card || stack);   // in the two columns: title and venue on one line, description full width under them
  const Tag = p.locked ? 'div' : 'a';
  const linkProps = p.locked ? {} : p.href ? { href: p.href, target: '_blank', rel: 'noopener' } : { href: `projects/${p.id}.html` };
  return (
    <Tag
      {...linkProps}
      className={card || undefined}
      onMouseEnter={() => onEnter(p.id)}
      onMouseLeave={onLeave}
      style={{
        // in the two columns a row is two shared tracks, text then picture, so pictures start level across the columns
        ...(card ? { display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 2' } : { display: 'block' }),
        padding: `0 0 ${PL_ROW_GAP}px`,
        textDecoration: 'none', color: PL_INK, cursor: p.locked ? 'default' : 'pointer',
        opacity: p.wip ? 0.5 : 1, transition: 'opacity .15s ease',
      }}
    >
      {/* in a column card: title and venue share the first line, the description runs the full width under them */}
      <span style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', columnGap: 24, rowGap: 2, alignItems: 'baseline', alignContent: 'start' }}>
        <span style={stacked ? { display: 'contents' } : { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 12, rowGap: 2 }}>
          <span style={{ gridColumn: 1, gridRow: 1, fontSize: 18, fontWeight: 400, letterSpacing: -0.3, textDecoration: on && !p.locked ? 'underline' : 'none', textUnderlineOffset: 3 }}>{p.title}</span>
          <span style={{ ...(stacked ? { gridColumn: '1 / -1', gridRow: 2 } : {}), fontSize: 14, fontWeight: 300, color: PL_MUTED, lineHeight: 1.5 }}>{p.short || p.blurb}</span>
          {p.locked && p.lockedNote && <span style={{ ...(stacked ? { gridColumn: '1 / -1', gridRow: 3 } : { flexBasis: '100%' }), fontSize: 12, fontWeight: 300, color: PL_MUTED, lineHeight: 1.5 }}>{p.lockedNote}</span>}
        </span>
        <span style={{ gridColumn: 2, gridRow: 1, fontSize: 11, color: PL_MUTED, letterSpacing: 0.6, whiteSpace: 'nowrap' }}>
          {(p.venue || p.year || '').split(/(WINNER)/).map((seg, i) => (
            seg === 'WINNER'
              ? <span key={i} style={{ color: PL_INK, fontWeight: 400, letterSpacing: 1 }}>WINNER</span>
              : seg
          ))}
        </span>
      </span>
      {p.thumb && (
        <span style={{ display: 'block', overflow: 'hidden', marginTop: 14, position: 'relative' }}>
          {p.cover ? <PlCover p={p} on={on} /> : (
          <img src={p.hero && p.heroThumb ? p.heroThumb : p.thumb} alt="" style={{
            display: 'block', width: '100%', height: 'auto', aspectRatio: p.hero && p.heroThumb ? PL_COVER_BIG : PL_COVER, objectFit: 'cover',
            border: `1px solid ${PL_RULE}`,
            opacity: on ? 1 : 0.88, transition: PL_REDUCED ? 'none' : 'opacity .2s ease',
          }} />)}
          {p.award && (
            <svg aria-label="winner" viewBox="0 0 24 24" width="22" height="22" style={{ position: 'absolute', top: 12, right: 12 }}>
              <path d="M6 3h12v5a6 6 0 0 1-12 0z M10.5 13.5h3V17h-3z M8 17h8v2.6H8z" fill="#ffc400" />
              <path d="M6 5H3v1.5a3.5 3.5 0 0 0 3.5 3.5 M18 5h3v1.5a3.5 3.5 0 0 1-3.5 3.5" fill="none" stroke="#ffc400" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </span>
      )}
      {PL_MAZE && p.id === 'latent-goal' && (
        <span style={{ display: 'block', marginTop: 14 }}>
          <window.MazePlate ink={PL_INK} muted={PL_MUTED} />
        </span>
      )}
    </Tag>
  );
});

// The smaller work, as one dense ledger: a title, one line, a short note on the right. No images.
const ALSO_ORDER = ['latent-goal', 'tape-collage', 'elp', 'biochar', 'sticker-station', 'rockite', 'critical-matter', 'icarus'];
// several small projects shown as one row: the titles link to their own pages, one line describes the set.
// Empty now: the Critical Matter course work is one entry with one page (id 'critical-matter').
const ALSO_GROUPS = [];
const AlsoGroupRow = React.memo(function AlsoGroupRow({ g, members, hover, onEnter, onLeave }) {
  return (
    <span className="pl-also" style={{ color: PL_INK }}>
      <span style={{ fontSize: 15, fontWeight: 400, letterSpacing: -0.2, lineHeight: 1.45 }}>
        {members.map((p, i) => (
          <React.Fragment key={p.id}>
            <a href={`projects/${p.id}.html`} onMouseEnter={() => onEnter(p.id)} onMouseLeave={onLeave}
               style={{ color: PL_INK, textDecoration: hover === p.id ? 'underline' : 'none', textUnderlineOffset: 3 }}>{p.title}</a>
            {i < members.length - 1 && ', '}
          </React.Fragment>
        ))}
      </span>
      <span style={{ fontSize: 13.5, fontWeight: 300, color: PL_MUTED, lineHeight: 1.5 }}>{g.short}</span>
      <span style={{ fontSize: 11, color: PL_MUTED, letterSpacing: 0.6 }}>{g.note}</span>
    </span>
  );
});
// rows that open the list with their picture; the rest are one line each. Without its maze, Diagnostic Mazes is a plain line too.
const ALSO_PICTURED = [...(PL_MAZE ? ['latent-goal'] : []), 'tape-collage'];
function alsoNote(p) { return p.note || (p.wip ? 'In progress' : p.href ? 'Live' : p.venue || p.year || ''); }
const AlsoRow = React.memo(function AlsoRow({ p, on, onEnter, onLeave }) {
  const href = p.href || `projects/${p.id}.html`;
  const ext = !!p.href;
  return (
    <a
      href={href}
      {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
      onMouseEnter={() => onEnter(p.id)}
      onMouseLeave={onLeave}
      className="pl-also"
      style={{ textDecoration: 'none', color: PL_INK }}
    >
      <span style={{ fontSize: 15, fontWeight: 400, letterSpacing: -0.2, lineHeight: 1.45, textDecoration: on ? 'underline' : 'none', textUnderlineOffset: 3 }}>{p.title}</span>
      <span style={{ fontSize: 13.5, fontWeight: 300, color: PL_MUTED, lineHeight: 1.5 }}>{p.short}</span>
      <span style={{ fontSize: 11, color: PL_MUTED, letterSpacing: 0.6 }}>{alsoNote(p)}</span>
    </a>
  );
});

function PlainList({ data }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const [hover, setHover] = React.useState(null);
  const small = (p) => p.minor || p.wip || p.href || p.also;
  const fabRank = (p) => { const i = FAB_ORDER.indexOf(p.id); return i < 0 ? 999 : i; };
  const live = data.projects.filter((p) => !small(p) && !p.proto && !p.hri && !(PL_TWO_COL && INTERACTIVE_ORDER.includes(p.id)))
    .map((p, i) => [p, i]).sort((a, b) => (fabRank(a[0]) - fabRank(b[0])) || (a[1] - b[1])).map(([p]) => p);
  const hri = data.projects.filter((p) => p.hri && !small(p));
  const proto = PL_TWO_COL
    ? INTERACTIVE_ORDER.map((id) => data.projects.find((p) => p.id === id)).filter((p) => p && !p.locked && !p.hide)
    : data.projects.filter((p) => p.proto && !small(p));
  const inCol = new Set(PL_TWO_COL ? proto.map((p) => p.id) : []);
  const isBig = (p) => !!(p.hero && p.heroThumb);
  let paired = 0;
  while (paired < Math.min(live.length, proto.length) && isBig(live[paired]) === isBig(proto[paired])) paired++;
  const wip = data.projects.filter((p) => p.wip);
  const minor = data.projects.filter((p) => p.minor);
  const rank = (p) => { const i = ALSO_ORDER.indexOf(p.id); return i < 0 ? 999 : i; };
  const grouped = new Set(ALSO_GROUPS.flatMap((g) => g.items));
  const also = [
    ...data.projects.filter((p) => small(p) && !p.locked && !p.hide && !grouped.has(p.id) && !inCol.has(p.id)),
    ...ALSO_GROUPS.map((g) => ({ ...g, group: true })),
  ].sort((a, b) => rank(a) - rank(b));

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
      <div style={{ maxWidth: PL_TWO_COL ? PL_WIDE : PL_COL, margin: '0 auto', position: 'relative' }}>
        <div style={{ maxWidth: PL_COL }}>
        {PL_RIBBON_NAME ? (
          <h1 style={{ fontSize: 17, fontWeight: 400, letterSpacing: -0.2, margin: 0 }}>
            <window.RibbonName ink={PL_INK} />
          </h1>
        ) : (
          <h1 style={{ fontSize: 17, fontWeight: 400, letterSpacing: -0.2, margin: 0 }}>
            {data.name}<span style={{ color: PL_MUTED, marginLeft: 10 }}>{data.kanji}</span>
          </h1>
        )}
        <p style={{ fontSize: 16, lineHeight: 1.6, color: PL_INK, margin: PL_RIBBON_NAME ? '30px 0 0' : '16px 0 0', maxWidth: '58ch' }}>{data.tagline}</p>
        {data.identity && (
          <p style={{ fontSize: 15, lineHeight: 1.6, color: PL_INK, margin: '10px 0 0' }}>
            {data.identity.split(/(?<=\.)\s+/).map((line) => <span key={line} style={{ display: 'block' }}>{line}</span>)}
          </p>
        )}
        <p style={{ fontSize: 15, lineHeight: 1.6, color: PL_MUTED, margin: '8px 0 0', maxWidth: '58ch' }}>
          Previously Industrial Design at RISD.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.65, margin: '10px 0 0', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <a href={`mailto:${data.email}`} style={{ color: PL_INK, textDecorationThickness: 1, textUnderlineOffset: 3 }}>{data.email}</a>
          <a href={`mailto:${data.emailAlt}`} style={{ color: PL_INK, textDecorationThickness: 1, textUnderlineOffset: 3 }}>{data.emailAlt}</a>
          <a href={data.linkedin} style={{ color: PL_INK, textDecorationThickness: 1, textUnderlineOffset: 3 }}>LinkedIn</a>
        </p>

        </div>

        {PL_TWO_COL ? (
          <div className="pl-cols" style={{ marginTop: 64 }}>
            <div className="pl-l0"><SectionLabel>Digital fabrication</SectionLabel></div>
            <div className="pl-r0"><SectionLabel>Interactive prototypes</SectionLabel></div>
            {/* rows are paired across the columns while both sides have the same cover size; after that each column runs on its own */}
            {Array.from({ length: paired }).map((_, i) => (
              <React.Fragment key={i}>
                <PlainRow p={live[i]} on={hover === live[i].id} onEnter={enter} onLeave={leave} card="pl-l" />
                <PlainRow p={proto[i]} on={hover === proto[i].id} onEnter={enter} onLeave={leave} card="pl-r" />
              </React.Fragment>
            ))}
            <div className="pl-l">{live.slice(paired).map((p) => <PlainRow key={p.id} p={p} on={hover === p.id} onEnter={enter} onLeave={leave} stack />)}</div>
            <div className="pl-r">{proto.slice(paired).map((p) => <PlainRow key={p.id} p={p} on={hover === p.id} onEnter={enter} onLeave={leave} stack />)}</div>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ marginTop: 64 }}>
              <SectionLabel>Digital fabrication</SectionLabel>
              {rows(live)}
            </div>
            {proto.length > 0 && (
              <div style={{ marginTop: 56 }}>
                <SectionLabel>Interactive prototypes</SectionLabel>
                {rows(proto)}
              </div>
            )}
          </React.Fragment>
        )}

        {hri.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <SectionLabel>Human-robot interaction</SectionLabel>
            {rows(hri)}
          </div>
        )}

        {also.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <SectionLabel>Also</SectionLabel>
            {also.map((p) => p.group
              ? <AlsoGroupRow key={p.id} g={p} members={p.items.map((id) => data.projects.find((x) => x.id === id)).filter(Boolean)} hover={hover} onEnter={enter} onLeave={leave} />
              : ALSO_PICTURED.includes(p.id)
                ? <PlainRow key={p.id} p={p} on={hover === p.id} onEnter={enter} onLeave={leave} />
                : <AlsoRow key={p.id} p={p} on={hover === p.id} onEnter={enter} onLeave={leave} />)}
          </div>
        )}

        {wip.length > 0 && false && (
          <div style={{ marginTop: 56 }}>
            <SectionLabel>In progress</SectionLabel>
            {rows(wip)}
          </div>
        )}

        {minor.length > 0 && false && (
          <div style={{ marginTop: 56 }}>
            <SectionLabel>Smaller projects</SectionLabel>
            {rows(minor)}
          </div>
        )}

      </div>
    </div>
  );
}

window.PlainList = PlainList;
