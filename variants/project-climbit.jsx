// Project-specific page for climbit, in the same layout as the Withheld-Air page.
const CB_INK = '#0a0a0a';
const CB_MUTED = 'rgba(10,10,10,0.68)';

function ClimbitPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const A = 'assets/climbit/';

  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];
  const num = String(idx + 1).padStart(2, '0');
  const shownMeta = [
    ...project.meta.filter(([k]) => k !== 'tools' && k !== 'status'),
    ...(project.tags && project.tags.length ? [['keywords', project.tags.join(', ')]] : []),
  ];

  const [revealed, setRevealed] = React.useState(0);
  React.useEffect(() => {
    let i = 0, t;
    const tick = () => { i++; setRevealed(i); if (i < 10) t = setTimeout(tick, 70); };
    tick(); return () => clearTimeout(t);
  }, []);

  const Reveal = ({ i, children, style }) => (
    <div style={{ opacity: revealed > i ? 1 : 0, transform: revealed > i ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity .5s ease, transform .5s ease', ...style }}>{children}</div>
  );
  const SectionLabel = ({ children }) => (
    <div style={{ fontFamily: sans, fontSize: 10, color: CB_MUTED, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 14, fontWeight: 400 }}>{children}</div>
  );
  const Cap = ({ children }) => (
    <div style={{ fontFamily: sans, fontSize: 10.5, color: CB_MUTED, marginTop: 10, letterSpacing: 0.4, fontWeight: 400, lineHeight: 1.5 }}>{children}</div>
  );
  const P = ({ children, style }) => (
    <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: CB_INK, maxWidth: '72ch', margin: 0, ...style }}>{children}</p>
  );
  const media = { display: 'block', width: '100%', height: 'auto' };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fff', color: CB_INK, padding: '80px 32px 120px', fontFamily: sans, fontWeight: 300, maxWidth: 1120, margin: '0 auto' }}>

      <Reveal i={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontSize: 11, color: CB_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14 }}>
          <a href="../index.html" style={{ justifySelf: 'start', color: CB_INK, textDecoration: 'none' }}>← Home</a>
          <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: CB_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: CB_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>
      </Reveal>

      <Reveal i={2} style={{ marginTop: 64 }}>
        <h1 style={{ fontWeight: 300, fontSize: 30, lineHeight: 1.15, letterSpacing: -0.7, margin: 0 }}>{project.title}</h1>
      </Reveal>
      <Reveal i={2} style={{ marginTop: 18 }}>
        <div style={{ fontWeight: 300, fontSize: 17, color: CB_MUTED, letterSpacing: -0.3, maxWidth: '56ch' }}>{project.subtitle}</div>
      </Reveal>
      <Reveal i={3} style={{ marginTop: 36 }}>
        <img src={A + 'cb20-cover-wide.jpg'} alt="The white build held up in one hand against an orange wall" style={{ ...media, aspectRatio: '16 / 9', objectFit: 'cover' }} />
        <Cap>The white build, with red, yellow and blue holds.</Cap>
      </Reveal>

      <Reveal i={3} style={{ marginTop: 28 }}>
        <P style={{ maxWidth: '64ch' }}>{project.blurb}</P>
      </Reveal>

      <Reveal i={4} style={{ marginTop: 48 }}>
        <dl style={{ margin: 0, paddingTop: 20, paddingBottom: 28 }}>
          {shownMeta.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
              <dt style={{ fontSize: 10, color: CB_MUTED, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400, lineHeight: 2 }}>{k}</dt>
              <dd style={{ margin: 0, fontSize: 13, fontWeight: 300, lineHeight: 1.45 }}>
                {k === 'link' ? <a href={'https://' + v} target="_blank" rel="noopener" style={{ color: CB_INK, textUnderlineOffset: 3 }}>{v}</a> : v}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal i={6} style={{ marginTop: 96 }}>
        <SectionLabel>The object</SectionLabel>
        <P>
          Grip trainers are squeezed in place. They give no route, no feedback and no reason to keep going.
          Climbit puts the holds in the hand instead. The body is a dodecahedron, so a hold meets the fingers
          in any orientation. The body is printed in PLA and the holds in TPU. Pressure sensors sit between
          the holds and read where the hand grips and how hard. A vibration motor at the centre answers.
        </P>
        <div style={{ marginTop: 40 }}>
          <img src={A + 'cb21-render-wide.jpg'} alt="Climbit rendered transparent, showing the body and the holds on its faces" loading="lazy" style={{ ...media, aspectRatio: '16 / 9', objectFit: 'cover' }} />
          <Cap>The body and holds, rendered transparent.</Cap>
        </div>
        {/* a 16:9 picture and an 8:9 clip: twice the width, the same height */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start', marginTop: 40 }}>
          <div>
            <img src={A + 'cb22-hands-wide.jpg'} alt="The white build turned in two hands" loading="lazy" style={{ ...media, aspectRatio: '16 / 9', objectFit: 'cover' }} />
            <Cap>The white build turned in two hands.</Cap>
          </div>
          <div>
            <video autoPlay muted loop playsInline poster={A + 'cb23-gym.jpg'} src={A + 'cb23-gym.mp4'} aria-label="The black build turned and gripped in one hand in a climbing gym" style={{ ...media, aspectRatio: '8 / 9', objectFit: 'cover', background: '#0a0a0a' }} />
            <Cap>The black build in a climbing gym.</Cap>
          </div>
        </div>
      </Reveal>

      <Reveal i={7} style={{ marginTop: 96 }}>
        <SectionLabel>The climb</SectionLabel>
        <P>
          A microcontroller sends the sensor readings to a first-person climb built in Unity. Each grip moves
          the climber up the wall. The system logs the timing, pressure and rhythm of the grips, and the
          Claude API turns those patterns into events and short missions on the route. A long pause or a
          change in rhythm becomes something that happens on the wall.
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, margin: '40px 0' }}>
          {[
            'The rock was colder than I expected when I first touched it.',
            'Halfway up, I realized the route was steeper than it looked from below.',
            'Danger warning. Powerful enemies ahead.',
          ].map((line) => (
            <div key={line} style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.45, letterSpacing: -0.3 }}>{line}</div>
          ))}
        </div>
        <img src={A + 'cb02-game-w.jpg'} alt="Hackathon board: the device, the climb on screen, and the player status panel" loading="lazy" style={{ ...media, aspectRatio: '1800 / 1013', objectFit: 'cover' }} />
        <Cap>Lines written during play, and the board from the hackathon.</Cap>
      </Reveal>

      <Reveal i={8} style={{ marginTop: 96 }}>
        <SectionLabel>Team</SectionLabel>
        <img src={A + 'cb14-team.jpg'} alt="The five team members holding Climbit" loading="lazy" style={{ ...media, aspectRatio: '16 / 9', objectFit: 'cover' }} />
        <Cap>The team with the black build.</Cap>
        <P style={{ marginTop: 28 }}>
          Climbit was built at MIT HARD MODE and won the Bambu Labs Prize. Anthropic then selected the
          prototype and sponsored the team to attend Code with Claude in San Francisco.
        </P>
      </Reveal>

      <nav style={{ marginTop: 96, paddingTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: CB_INK, padding: '20px 0' }}>
          <div style={{ fontSize: 10, color: CB_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: CB_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: CB_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ marginTop: 40, paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: CB_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: CB_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang 王瑶</span>
      </footer>
    </div>
  );
}

window.ClimbitPage = ClimbitPage;
