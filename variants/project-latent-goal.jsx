// Project page for latent-goal (Diagnostic Mazes). Every number here is from the course paper
// (projects/assets/latent-goal/diagnostic-environment-design.pdf). The simulation is variants/maze-sim.jsx.

const LG_INK = '#0a0a0a';
const LG_MUTED = 'rgba(10,10,10,0.68)';
const LG_RULE = 'rgba(10,10,10,0.14)';

const LG_METHOD = [
  'Preferences are a point on a grid: four axes with five levels each, 625 states. The estimate is a probability over these states and starts uniform.',
  'A fork is a choice between two branches. It carries a four-number contrast vector φ, and the probability of taking the marked branch is σ(θ·φ).',
  'φ is computed from the layout. Cell features (side room, item, risk zone, step cost) are summed along each branch, and φ is the normalised difference. Four scale factors were calibrated once against 18 hand-annotated forks: median cosine agreement with the annotations is 0.923, against 0.702 without calibration. The largest archive has 789 forks, so about 44 times fewer forks are annotated by hand.',
  'The next maze is the one with the highest expected information gain under the current estimate. The gain is computed exactly, over the 8 outcomes of three forks and all 625 states. Archives of 46, 134 and 263 mazes were generated offline from templates. Choosing from 263 takes about 5 ms.',
];

// Table II of the paper, top block: reduction in estimate error against a randomly generated maze, ×10⁻³.
const LG_RESULT = [
  ['46 mazes', '3.5', '1.4 to 5.5'],
  ['134 mazes', '1.0', '−1.0 to 2.9'],
  ['263 mazes', '3.2', '1.0 to 5.3'],
];

function LatentGoalPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];
  const shownMeta = [
    ...project.meta.filter(([k]) => k !== 'tools' && k !== 'status'),
    ...(project.tags && project.tags.length ? [['keywords', project.tags.join(', ')]] : []),
  ];

  const Label = ({ children, style }) => (
    <div style={{ fontSize: 10, color: LG_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14, ...style }}>{children}</div>
  );
  const text = { fontSize: 16, lineHeight: 1.7, margin: 0, maxWidth: '64ch' };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: LG_INK, fontFamily: sans, fontWeight: 300, padding: '80px 32px 120px', maxWidth: 940, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontSize: 11, color: LG_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', paddingBottom: 14, borderBottom: `1px solid ${LG_RULE}` }}>
        <a href="../index.html" style={{ justifySelf: 'start', color: LG_INK, textDecoration: 'none' }}>← Home</a>
        <span>{String(idx + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}</span>
        <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
          <a href={`${prev.id}.html`} style={{ color: LG_MUTED, textDecoration: 'none' }}>prev</a>
          <a href={`${next.id}.html`} style={{ color: LG_INK, textDecoration: 'none' }}>next →</a>
        </span>
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 300, letterSpacing: -0.7, lineHeight: 1.15, margin: '64px 0 0', maxWidth: '30ch' }}>{project.title}</h1>
      <p style={{ fontSize: 17, fontWeight: 300, color: LG_MUTED, lineHeight: 1.5, margin: '18px 0 0', maxWidth: '56ch' }}>{project.subtitle}</p>
      <p style={{ ...text, fontSize: 16, lineHeight: 1.65, margin: '28px 0 0' }}>{project.blurb}</p>

      <dl style={{ margin: '48px 0 0', paddingTop: 20, paddingBottom: 8, borderBottom: `1px solid ${LG_RULE}`, borderTop: `1px solid ${LG_RULE}` }}>
        {shownMeta.map(([k, v]) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
            <dt style={{ fontSize: 10, color: LG_MUTED, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 2 }}>{k}</dt>
            <dd style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{v}</dd>
          </div>
        ))}
      </dl>

      <div style={{ marginTop: 56 }}>
        <Label>Walk the mazes</Label>
        <window.MazeSim />
      </div>

      <div style={{ marginTop: 72 }}>
        <Label>Method</Label>
        <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
          {LG_METHOD.map((step, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr)', columnGap: 16, padding: '12px 0', borderTop: `1px solid ${LG_RULE}` }}>
              <span style={{ fontSize: 12, color: LG_MUTED }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 15, lineHeight: 1.6, maxWidth: '68ch' }}>{step}</span>
            </li>
          ))}
        </ol>
        <div style={{ borderTop: `1px solid ${LG_RULE}` }} />
      </div>

      <div style={{ marginTop: 72 }}>
        <Label>Result</Label>
        <p style={text}>
          Tested in simulation on 625 players, one for each grid state, with 2, 5 or 8 mazes per player and 8 random
          seeds: 15,000 paired comparisons per archive. The measure is the distance between the final estimate and the
          player's true preferences. The baseline shows a randomly generated maze each round.
        </p>
        <div style={{ margin: '28px 0 0', maxWidth: 520, fontVariantNumeric: 'tabular-nums' }}>
          {[['Archive', 'Error reduction, ×10⁻³', '95% interval'], ...LG_RESULT].map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', columnGap: 16, padding: '9px 0', borderTop: `1px solid ${LG_RULE}`,
              fontSize: i ? 14 : 10, color: i ? LG_INK : LG_MUTED, textTransform: i ? 'none' : 'uppercase', letterSpacing: i ? 0 : 1,
            }}>
              {row.map((cell, j) => <span key={j}>{cell}</span>)}
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${LG_RULE}` }} />
        </div>
        <p style={{ ...text, margin: '28px 0 0' }}>
          The reduction is clear on two of the three archives and cannot be told from zero on the third. It is small:
          per-player error stays between 0.62 and 0.68 at every budget.
        </p>
        <p style={{ ...text, margin: '16px 0 0' }}>
          A 2 × 2 comparison on the 263-maze archive separates the two steps. Ranking mazes by expected gain accounts
          for the reduction (3.12 × 10⁻³ against drawing from the same archive at random). The quality-diversity
          curation used to build the archive adds nothing measurable (−0.61 × 10⁻³, interval −2.80 to 1.56).
        </p>
        <p style={{ ...text, margin: '16px 0 0' }}>
          A language model (claude-haiku-4-5) proposing three mazes per round and taking its first was statistically
          equivalent to ranking the same three by expected gain.
        </p>
        <p style={{ ...text, margin: '16px 0 0', color: LG_MUTED }}>
          Limits. Everything above is simulation. Six people ran the full procedure once, which confirmed that it runs
          end to end. It is not a user study. That run also showed two faults in the hand-made mazes: forks with items
          cost extra steps, and the risky shortcuts were taken even by risk-averse participants.
        </p>
      </div>

      <div style={{ marginTop: 72 }}>
        <Label>Why it matters</Label>
        <p style={text}>
          The player is never asked anything. They walk through a space, and where they go is the input. That makes
          the layout part of the interface: what a fork can tell the system depends on how long each branch is, what
          lies along it and what it risks. My part was working that out from the geometry, so that a new layout can be
          read without someone labelling it by hand. We tested this on screen, with grid mazes and simulated players.
          The same question applies to physical things a person moves through or handles: what does this arrangement
          let their ordinary actions say? The pilot showed how easily it goes wrong. Forks meant to test collecting
          also cost extra steps, and a shortcut meant to test risk was taken by cautious players too.
        </p>
      </div>

      <div style={{ marginTop: 56, paddingTop: 20, borderTop: `1px solid ${LG_RULE}` }}>
        <a href="assets/latent-goal/diagnostic-environment-design.pdf" style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: LG_INK, textDecoration: 'none', borderBottom: `1px solid ${LG_INK}`, paddingBottom: 2 }}>Read the paper (PDF)</a>
      </div>

      <nav style={{ marginTop: 96, paddingTop: 24, borderTop: `1px solid ${LG_RULE}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: LG_INK, padding: '20px 0' }}>
          <div style={{ fontSize: 10, color: LG_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>← Previous</div>
          <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: LG_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: LG_MUTED, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Next →</div>
          <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${LG_RULE}`, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: LG_MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: LG_INK, textDecoration: 'none' }}>linkedin.com/in/yao-wang-gsd</a>
        <span>Yao Wang · 王瑶</span>
      </footer>
    </div>
  );
}

window.LatentGoalPage = LatentGoalPage;
