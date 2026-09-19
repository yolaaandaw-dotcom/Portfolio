// Project-specific page for fluidic (Withheld-Air), built from the ACADIA 2026 paper.
const WA_INK = '#0a0a0a';
const WA_MUTED = 'rgba(10,10,10,0.55)';
const WA_RULE = 'rgba(10,10,10,0.14)';

function FluidicPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const mono = 'Roboto, system-ui, sans-serif';
  const A = 'assets/withheld-air/';

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
    const tick = () => { i++; setRevealed(i); if (i < 13) t = setTimeout(tick, 70); };
    tick(); return () => clearTimeout(t);
  }, []);

  const Reveal = ({ i, children, style }) => (
    <div style={{ opacity: revealed > i ? 1 : 0, transform: revealed > i ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity .5s ease, transform .5s ease', ...style }}>{children}</div>
  );
  const SectionLabel = ({ children, style }) => (
    <div style={{ fontFamily: mono, fontSize: 10, color: WA_MUTED, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 14, fontWeight: 400, ...style }}>{children}</div>
  );
  const Cap = ({ children }) => (
    <div style={{ fontFamily: mono, fontSize: 10.5, color: WA_MUTED, marginTop: 10, letterSpacing: 0.4, fontWeight: 400, lineHeight: 1.5 }}>{children}</div>
  );
  const Plate = ({ src, alt, pad = 0, bg = 'transparent' }) => (
    <figure style={{ margin: 0, background: bg, padding: pad }}>
      <img src={A + src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </figure>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fff', color: WA_INK, padding: '80px 32px 120px', fontFamily: sans, fontWeight: 300, maxWidth: 940, margin: '0 auto' }}>

      <Reveal i={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontFamily: mono, fontSize: 11, color: WA_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14, borderBottom: `1px solid ${WA_RULE}` }}>
          <a href="../index.html" style={{ justifySelf: 'start', color: WA_INK, textDecoration: 'none' }}>← Home</a>
          <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: WA_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: WA_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>
      </Reveal>


      <Reveal i={2} style={{ marginTop: 64 }}>
        <h1 style={{ fontFamily: sans, fontWeight: 300, fontSize: 30, lineHeight: 1.15, letterSpacing: -0.7, margin: 0, maxWidth: '30ch' }}>{project.title}</h1>
      </Reveal>
      <Reveal i={2} style={{ marginTop: 18 }}>
        <div style={{ fontFamily: sans, fontWeight: 300, fontSize: 17, color: WA_MUTED, letterSpacing: -0.3, maxWidth: '56ch' }}>{project.subtitle}</div>
      </Reveal>
      <Reveal i={3} style={{ marginTop: 28 }}>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.65, margin: 0, maxWidth: '64ch', color: WA_INK }}>{project.blurb}</p>
      </Reveal>

      <Reveal i={4} style={{ marginTop: 48 }}>
        <dl style={{ margin: 0, paddingTop: 20, paddingBottom: 28, borderTop: `1px solid ${WA_RULE}`, borderBottom: `1px solid ${WA_RULE}` }}>
          {shownMeta.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
              <dt style={{ fontFamily: mono, fontSize: 10, color: WA_MUTED, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400, lineHeight: 2 }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: sans, fontSize: 13, fontWeight: 300, color: WA_INK, lineHeight: 1.45 }}>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal i={5} style={{ marginTop: 72 }}>
        <Plate src="wa01-cover-w.jpg" alt="One participant seen through an aperture in the inflated boundary" />
        <Cap>The translucent pneumatic boundary in its inflated state.</Cap>
      </Reveal>

      <Reveal i={6} style={{ marginTop: 80 }}>
        <SectionLabel>Summary</SectionLabel>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, margin: 0, color: WA_INK, maxWidth: '66ch' }}>{project.body}</p>
      </Reveal>

      <Reveal i={7} style={{ marginTop: 96 }}>
        <SectionLabel>Installation structure</SectionLabel>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: WA_INK, maxWidth: '72ch', margin: '0 0 28px' }}>
          Two participants sit face to face across a heat-welded PE film boundary. One wears a Muse 2
          headset, the other remains unsensed. The asymmetry is deliberate. The unsensed participant read
          the closing wall as a report on the other person, and began asking about their state rather than
          continuing the conversation. The prototype is a partial wall, an 8 × 4 field sized for a dyad.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <Plate src="wa02-participants-w.jpg" alt="Two participants seated across the boundary during a pilot session" />
            <Cap>Two participants seated across the boundary during a pilot session.</Cap>
          </div>
          <div>
            <Plate src="wa10-layout.png" alt="Spatial layout of the partial wall" />
            <Cap>Spatial layout of the partial wall, an 8 × 4 field sized for a dyad.</Cap>
          </div>
        </div>
      </Reveal>

      <Reveal i={8} style={{ marginTop: 96 }}>
        <SectionLabel>The Y-cell field</SectionLabel>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              ['Hexagonal cell', 'Expands outward under pressure.'],
              ['Slit', 'Closes too literally, like a shutter.'],
              ['Y-cell', 'Produces a directional opening that seals progressively, so the field reads as withdrawing rather than simply growing.'],
            ].map(([h, body], i) => (
              <div key={h} style={{ borderTop: `1px solid ${i === 2 ? WA_INK : WA_RULE}`, paddingTop: 14 }}>
                <div style={{ fontFamily: sans, fontSize: 18, fontWeight: 400, letterSpacing: -0.3, marginBottom: 10 }}>{h}</div>
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 300, lineHeight: 1.6, color: WA_MUTED }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
        <Plate src="wa03-ycell-geometry.png" alt="Y-cell geometry: seed unit and 8×4 tessellation" />
        <Cap>Y-cell geometry: seed unit and 8 × 4 tessellation.</Cap>
      </Reveal>

      <Reveal i={8} style={{ marginTop: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <Plate src="wa04-auxetic-states-w.jpg" alt="The auxetic Y-cell geometry in open and contracted states" />
            <Cap>The auxetic Y-cell geometry shown in open and contracted states. As the chambers fill,
              neighboring arms press together and the voids between them close through field-level
              contraction.</Cap>
          </div>
          <div>
            <Plate src="wa06-fabrication.png" alt="Fabrication setup: layered PE film welded on a Zund digital cutter" />
            <Cap>Fabrication uses layered PE film welded on a Zund digital cutter. Seam paths are generated
              from the parametric Y-cell model and output as toolpaths; a soldering iron with a flat tip is
              mounted on the gantry and traces these paths directly onto the layered film.</Cap>
          </div>
        </div>
      </Reveal>

      <Reveal i={9} style={{ marginTop: 56 }}>
        <Plate src="wa05-chamber-states.png" alt="Chamber units in different FAA states" />
        <Cap>Chamber units in different FAA states.</Cap>
      </Reveal>

      <Reveal i={10} style={{ marginTop: 96 }}>
        <SectionLabel>Signal and feedback</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          <div>
            <Plate src="wa07-eeg-faa.png" alt="Frontal EEG channels AF7 and AF8 and the FAA computation" />
            <Cap>EEG data streamed from the Muse 2 to a host computer, where a Python script filtered the
              frontal channels AF7 and AF8 and computed FAA = ln(α<sub>R</sub>) − ln(α<sub>L</sub>).</Cap>
          </div>
          <div>
            <Plate src="wa09-pipeline.png" alt="System pipeline from EEG acquisition through signal processing to pneumatic actuation" />
            <Cap>A one-minute meditation set each participant's resting asymmetry; any sample below that
              baseline switched on a Wi-Fi smart plug powering a fan.</Cap>
          </div>
        </div>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: WA_INK, maxWidth: '72ch', marginTop: 28, marginBottom: 0 }}>
          The interpretation of FAA is methodologically unstable, and during live conversation a negative
          deviation can equally reflect eye movement, facial muscle activity, speech, or poor electrode
          contact. We treat FAA not as evidence of an emotional state but as a provisional signal whose
          architectural interpretation is itself the experiment. There is no magnitude threshold and no
          minimum duration. Crossings are frequent during live speech, while filling and passive leakage
          are slow, so chamber pressure follows accumulated time below baseline rather than any single
          crossing.
        </p>
      </Reveal>

      <Reveal i={11} style={{ marginTop: 96 }}>
        <SectionLabel>Pilot sessions</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
          {[
            ['4 dyads', 'One participant sensed, one unsensed'],
            ['120–309 s', 'Session length, after a one-minute baseline'],
            ['32–49%', 'Share of each session holding the trigger'],
            ['−2.11 … +0.29', 'Baseline range across sessions'],
          ].map(([v, l]) => (
            <div key={v} style={{ borderTop: `1px solid ${WA_INK}`, paddingTop: 14 }}>
              <div style={{ fontFamily: sans, fontSize: 26, fontWeight: 300, letterSpacing: -0.8, marginBottom: 8 }}>{v}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: WA_MUTED, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.5 }}>{l}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: WA_INK, maxWidth: '72ch', margin: '0 0 28px' }}>
          Pilot sessions are read as documentation of spatial behavior, not as evidence of an emotional
          state. Four dyads took part. All participants gave informed consent and were told that one of
          the two was being sensed.
        </p>
        <Plate src="wa08-sessions-w.jpg" alt="Four pilot sessions: band power, FAA against baseline with the trigger shaded, and fan state" />
        <Cap>Four sessions. For each: frontal alpha and beta band power, FAA against that session's
          baseline with the trigger condition shaded, and the resulting fan state. Baselines differ by
          session and are not comparable across participants.</Cap>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: WA_INK, maxWidth: '72ch', marginTop: 28, marginBottom: 0 }}>
          In one representative two-minute session, selected because its crossing pattern is typical of the
          set, a one-minute meditation set an FAA baseline of −0.7892. Over the following conversation the
          signal crossed below this baseline seventy-one times, holding the trigger condition for
          fifty-nine seconds in total, just under half the session. The session ended at −1.059, still
          below baseline. The trigger remains binary; the boundary it produces is not. The fan switches at
          the crossing rate, the chambers fill and leak at their own. What the wall registers is not the
          signal but the time spent below baseline.
        </p>
      </Reveal>

      <nav style={{ marginTop: 96, paddingTop: 24, borderTop: `1px solid ${WA_RULE}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: WA_INK, padding: '20px 0' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: WA_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: WA_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: WA_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${WA_RULE}`, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 10.5, color: WA_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: WA_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang · 王瑶</span>
      </footer>
    </div>
  );
}

window.FluidicPage = FluidicPage;
