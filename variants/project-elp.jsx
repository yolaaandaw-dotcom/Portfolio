// Project-specific page for elp (Sequence-Programmed Hygromorphic Coatings).
// Modeled on FluidicPage: same chrome, custom diagrams.

const ELP_INK = '#0a0a0a';
const ELP_MUTED = 'rgba(10,10,10,0.55)';
const ELP_FAINT = 'rgba(10,10,10,0.32)';
const ELP_RULE = 'rgba(10,10,10,0.14)';
const ELP_BG_FAINT = '#fafafa';

// Three variants — used by several diagrams.
const VARIANTS = [
  {
    code: 'S',
    name: 'Hydrophilic',
    residue: 'Serine',
    repeat: '(VPGSG)₂₀',
    side: 'polar · −OH',
    hint: 'water-attracting',
    tendency: 'High water uptake. Strong swelling. Largest expected bend amplitude.',
  },
  {
    code: 'A',
    name: 'Balanced',
    residue: 'Alanine',
    repeat: '(VPGAG)₂₀',
    side: 'small nonpolar · −CH₃',
    hint: 'baseline',
    tendency: 'Moderate swelling. The reference behaviour against which the others are read.',
  },
  {
    code: 'V',
    name: 'Hydrophobic',
    residue: 'Valine',
    repeat: '(VPGVG)₂₀',
    side: 'branched nonpolar · −iPr',
    hint: 'water-excluding',
    tendency: 'Low swelling. Possible aggregation. Brittle or opaque coating.',
  },
];

function ElpPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const mono = 'Roboto, system-ui, sans-serif';
  const serif = 'Roboto, system-ui, sans-serif';

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
    let i = 0; let t;
    const tick = () => { i++; setRevealed(i); if (i < 14) t = setTimeout(tick, 70); };
    tick(); return () => clearTimeout(t);
  }, []);

  const Reveal = ({ i, children, style }) => (
    <div style={{
      opacity: revealed > i ? 1 : 0,
      transform: revealed > i ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity .5s ease, transform .5s ease',
      ...style,
    }}>{children}</div>
  );


  const SectionLabel = ({ children, style }) => (
    <div style={{
      fontFamily: mono, fontSize: 10, color: ELP_MUTED,
      textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 14, fontWeight: 400,
      ...style,
    }}>{children}</div>
  );

  const FigCaption = ({ n, children }) => (
    <div style={{
      fontFamily: mono, fontSize: 10.5, color: ELP_MUTED, marginTop: 10,
      letterSpacing: 0.4, fontWeight: 400, lineHeight: 1.5,
    }}>
      {children}
    </div>
  );

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', background: '#fff', color: ELP_INK,
      padding: '64px 72px', fontFamily: sans, fontWeight: 300,
    }}>

      {/* Top nav */}
      <Reveal i={0}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', fontFamily: mono, fontSize: 11,
          color: ELP_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap',
          paddingBottom: 14, borderBottom: `1px solid ${ELP_RULE}`,
        }}>
          <a href="../index.html" style={{ justifySelf: 'start', color: ELP_INK, textDecoration: 'none' }}>← Home</a>
          <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: ELP_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: ELP_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>
      </Reveal>

      {/* Breadcrumb */}

      {/* Title */}
      <Reveal i={2} style={{ marginTop: 64 }}>
        <h1 style={{
          fontFamily: sans, fontWeight: 300, fontSize: 86, lineHeight: 0.98,
          letterSpacing: -2.2, margin: 0, maxWidth: '14ch',
        }}>{project.title}</h1>
      </Reveal>

      <Reveal i={2} style={{ marginTop: 18 }}>
        <div style={{
          fontFamily: sans, fontWeight: 300,
          fontSize: 22, color: ELP_MUTED, letterSpacing: -0.2, maxWidth: '52ch',
        }}>
          One amino acid in the repeat unit sets how the coating curls in humidity.
        </div>
      </Reveal>

      <Reveal i={3} style={{ marginTop: 28 }}>
        <p style={{
          fontFamily: sans, fontWeight: 300, fontSize: 22, lineHeight: 1.4,
          margin: 0, maxWidth: '60ch', color: ELP_INK,
        }}>{project.blurb}</p>
      </Reveal>

      {/* Meta strip */}
      <Reveal i={4} style={{ marginTop: 48 }}>
        <dl style={{
          margin: 0,
          paddingTop: 20, paddingBottom: 28,
          borderTop: `1px solid ${ELP_RULE}`, borderBottom: `1px solid ${ELP_RULE}`,
        }}>
          {shownMeta.map(([k, v]) => (
            <div key={k}>
              <dt style={{
                fontFamily: mono, fontSize: 10, color: ELP_MUTED,
                textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 400,
              }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: sans, fontSize: 13, fontWeight: 300, color: ELP_INK, lineHeight: 1.45 }}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* The conceptual move */}
      <Reveal i={5} style={{ marginTop: 64 }}>
        <SectionLabel>Approach</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            ['Conventional responsive materials',
             'To change the behaviour you reformulate the chemistry and adjust the processing.'],
            ['Sequence-encoded materials',
             'To change the behaviour you edit the sequence. The vector, the bacteria, the induction and the coating method stay identical.'],
          ].map(([h, body], i) => (
            <div key={i} style={{
              border: `1px solid ${ELP_RULE}`, background: i === 1 ? '#fff' : ELP_BG_FAINT,
              padding: 28, position: 'relative',
            }}>
              <div style={{
                fontFamily: mono, fontSize: 10, color: ELP_MUTED,
                textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14,
              }}>{i === 0 ? 'prior' : 'proposed'}</div>
              <div style={{
                fontFamily: sans, fontWeight: 400, fontSize: 22, lineHeight: 1.25,
                letterSpacing: -0.4, color: ELP_INK, marginBottom: 14,
              }}>{h}</div>
              <div style={{
                fontFamily: sans, fontWeight: 300, fontSize: 14, lineHeight: 1.65,
                color: ELP_MUTED,
              }}>{body}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Hero — sequence → film mapping */}
      <Reveal i={6} style={{ marginTop: 80 }}>
        <SectionLabel>Sequence to film</SectionLabel>
        <SequenceToFilmFigure />
        <FigCaption n="1">
          Three ELP variants differ only at the guest residue X in the repeating (VPGXG)₂₀ motif.
          The pipeline is held constant. Predicted curling scales with side-chain hydrophilicity.
        </FigCaption>
      </Reveal>

      {/* VPGXG anatomy */}
      <Reveal i={7} style={{ marginTop: 80 }}>
        <SectionLabel>Repeat unit · (VPGXG)ₙ and the guest residue</SectionLabel>
        <PentapeptideAnatomy />
        <FigCaption n="2">
          Elastin-like polypeptides are repetitive, disordered and folding-tolerant, so expression
          rarely fails across variants. Position X is the only thing edited here.
        </FigCaption>
      </Reveal>

      {/* Hydrophilicity gradient — three side chains */}
      <Reveal i={7} style={{ marginTop: 64 }}>
        <SectionLabel>Hydrophilicity gradient · S → A → V</SectionLabel>
        <SideChainGradient />
        <FigCaption n="3">
          The guest residue is the only design variable. Serine&rsquo;s polar hydroxyl hydrogen-
          bonds with water; alanine&rsquo;s small methyl is the baseline; valine&rsquo;s branched
          aliphatic group excludes water and the polymer collapses.
        </FigCaption>
      </Reveal>

      {/* Variant table */}
      <Reveal i={8} style={{ marginTop: 80 }}>
        <SectionLabel>Sequence design · three variants along a single axis</SectionLabel>
        <VariantTable />
      </Reveal>

      {/* Body + Process */}
      <Reveal i={9} style={{ marginTop: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 48 }}>
          <div>
            <SectionLabel>Summary</SectionLabel>
            <p style={{
              fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7,
              margin: 0, color: ELP_INK, maxWidth: '44ch',
            }}>{project.body}</p>
            <p style={{
              fontFamily: sans, fontWeight: 300, fontSize: 14, lineHeight: 1.7,
              margin: '20px 0 0', color: ELP_MUTED, maxWidth: '44ch',
            }}>
              The biological pipeline is held identical across all three variants: pET-28a vector,
              BL21(DE3) host, IPTG induction at 18–25 °C, Ni-NTA purification, drop-cast onto
              plasma-activated PET. If the sequence is the only thing that changes, any difference in
              response can be traced back to it.
            </p>
          </div>
          <div>
            <SectionLabel>Process</SectionLabel>
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {project.process.map((step, i) => (
                <li key={i} style={{
                  display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14,
                  padding: '12px 0', borderTop: i === 0 ? 'none' : `1px solid ${ELP_RULE}`,
                }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: ELP_MUTED, fontWeight: 300 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 300, lineHeight: 1.6, color: ELP_INK }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      {/* Bilayer mechanism */}
      <Reveal i={10} style={{ marginTop: 96 }}>
        <SectionLabel>Mechanism · asymmetric swelling on a PET bilayer</SectionLabel>
        <BilayerMechanism />
        <FigCaption n="4">
          A one-sided ELP coating on 6 μm Mylar/PET forms an active/passive bilayer. When humidity
          rises the coating absorbs water and expands while the PET stays put, and the strip bends
          toward the passive side.
        </FigCaption>
      </Reveal>

      {/* Pipeline */}
      <Reveal i={11} style={{ marginTop: 80 }}>
        <SectionLabel>Pipeline · the six phases held constant across variants</SectionLabel>
        <PipelinePhases />
        <FigCaption n="5">
          Sequence design is the only step where the variants differ. Same vector (pET-28a), host
          (BL21(DE3)), induction (IPTG, 18–25 °C overnight), substrate (plasma-activated 6 μm Mylar)
          and drop-cast protocol (3–5 layers).
        </FigCaption>
      </Reveal>

      {/* Expected response */}
      <Reveal i={12} style={{ marginTop: 80 }}>
        <SectionLabel>Expected humidity response · predicted bending across variants</SectionLabel>
        <ExpectedResponse />
        <FigCaption n="6">
          Predicted bending angle as humidity ramps from ambient to saturated and back. Serine:
          largest and fastest. Alanine: moderate. Valine: shallow, with possible cracking on
          recovery. These curves are design-stage expectations to be checked in the humidity chamber.
        </FigCaption>
      </Reveal>

      {/* Metrics matrix */}
      <Reveal i={12} style={{ marginTop: 64 }}>
        <SectionLabel>Readouts</SectionLabel>
        <ReadoutGrid />
      </Reveal>

      {/* Future axes */}
      <Reveal i={13} style={{ marginTop: 96 }}>
        <SectionLabel>Future axes · sequence organisation, charged residues</SectionLabel>
        <FutureAxes />
        <FigCaption n="7">
          Two further axes are designed but not yet tested. Aim 1b asks whether the <em>order</em>
          of residues changes film behaviour. Aim 2 swaps in a charged guest residue (lysine), which
          shifts the trigger from humidity to pH and ionic strength.
        </FigCaption>
      </Reveal>

      {/* Reflection */}
      <Reveal i={13} style={{ marginTop: 80 }}>
        <SectionLabel>Reflection</SectionLabel>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
          paddingTop: 24, borderTop: `1px solid ${ELP_RULE}`,
        }}>
          {[
            ['Sequence as a design variable',
             'One edit, run through an identical pipeline, produces a measurably different macroscopic behaviour.'],
            ['Biological origin, inert in use',
             'The film absorbs water and bends. No living cells, no metabolic upkeep, no containment.'],
          ].map(([h, body], i) => (
            <div key={i}>
              <div style={{
                fontFamily: sans, fontWeight: 400, fontSize: 18,
                lineHeight: 1.35, color: ELP_INK, marginBottom: 12, letterSpacing: -0.3,
              }}>{h}</div>
              <div style={{
                fontFamily: sans, fontWeight: 300, fontSize: 13.5,
                lineHeight: 1.65, color: ELP_MUTED,
              }}>{body}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Bottom nav */}
      <nav style={{
        marginTop: 96, paddingTop: 24, borderTop: `1px solid ${ELP_RULE}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
      }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: ELP_INK, padding: '20px 0' }}>
          <div style={{
            fontFamily: mono, fontSize: 10, color: ELP_MUTED,
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, fontWeight: 400,
          }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: ELP_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{
            fontFamily: mono, fontSize: 10, color: ELP_MUTED,
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, fontWeight: 400,
          }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{
        marginTop: 40, paddingTop: 20, borderTop: `1px solid ${ELP_RULE}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: mono, fontSize: 10.5, color: ELP_MUTED,
        textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400,
      }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: ELP_INK, textDecoration: 'none' }}>
          linkedin.com/in/yao-wang-gsd
        </a>
        <span>Yao Wang · 王瑶</span>
      </footer>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// FIG 1 — sequence cards → bent strip mapping
// ───────────────────────────────────────────────────────────────
function SequenceToFilmFigure() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  // Per-variant curl path: PET strip rendered as a curving open arc
  const curl = (cx, cy, radius, sweepDeg) => {
    const startA = -90;
    const endA = startA + sweepDeg;
    const toRad = (d) => (d * Math.PI) / 180;
    const x0 = cx + Math.cos(toRad(startA)) * radius;
    const y0 = cy + Math.sin(toRad(startA)) * radius;
    const x1 = cx + Math.cos(toRad(endA)) * radius;
    const y1 = cy + Math.sin(toRad(endA)) * radius;
    const large = sweepDeg > 180 ? 1 : 0;
    return `M${x0},${y0} A${radius},${radius} 0 ${large} 1 ${x1},${y1}`;
  };
  const curls = [
    { sweep: 280, radius: 38 }, // S — large
    { sweep: 160, radius: 56 }, // A — moderate
    { sweep: 65,  radius: 100 }, // V — shallow
  ];

  return (
    <div style={{ border: `1px solid ${ELP_RULE}`, background: ELP_BG_FAINT, padding: 28 }}>
      <svg viewBox="0 0 1000 360" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* shared lane backdrop */}
        <line x1="320" y1="60"  x2="320" y2="300" stroke={ELP_INK} strokeOpacity="0.08" strokeWidth="0.6" />
        <line x1="620" y1="60"  x2="620" y2="300" stroke={ELP_INK} strokeOpacity="0.08" strokeWidth="0.6" />
        <text x="40"  y="40" fontFamily={mono} fontSize="10" fill={ELP_MUTED} letterSpacing="1">SEQUENCE</text>
        <text x="340" y="40" fontFamily={mono} fontSize="10" fill={ELP_MUTED} letterSpacing="1">PROTEIN</text>
        <text x="640" y="40" fontFamily={mono} fontSize="10" fill={ELP_MUTED} letterSpacing="1">FILM · HUMID</text>

        {VARIANTS.map((v, i) => {
          const y = 80 + i * 90;
          // sequence strip
          const letters = Array.from({ length: 20 }, (_, k) => v.code);
          return (
            <g key={v.code}>
              {/* row label */}
              <text x="40" y={y + 6} fontFamily={mono} fontSize="11" fill={ELP_INK}>
                {v.repeat}
              </text>
              <text x="40" y={y + 22} fontFamily={mono} fontSize="9" fill={ELP_MUTED}>
                X = {v.residue.toLowerCase()}
              </text>

              {/* sequence card — 20 boxes */}
              {letters.map((c, k) => (
                <g key={k} transform={`translate(${160 + k * 7}, ${y - 8})`}>
                  <rect width="6" height="18" fill={ELP_INK} fillOpacity={0.12 + i * 0.06} stroke={ELP_INK} strokeOpacity="0.5" strokeWidth="0.4" />
                  <text x="3" y="13" textAnchor="middle" fontFamily={mono} fontSize="7" fill={ELP_INK}>{c}</text>
                </g>
              ))}

              {/* arrow */}
              <line x1="305" y1={y} x2="335" y2={y} stroke={ELP_INK} strokeWidth="0.8" />
              <polyline points={`${330},${y - 4} ${335},${y} ${330},${y + 4}`} fill="none" stroke={ELP_INK} strokeWidth="0.8" />

              {/* protein blob: coiled disordered chain */}
              <g transform={`translate(360, ${y - 30})`}>
                <path d={
                  // squiggle scaled by variant — more compact = more hydrophobic
                  `M0,30 ` + Array.from({ length: 22 }, (_, k) => {
                    const px = 8 + k * 8.5;
                    const amp = 14 - i * 4;
                    const py = 30 + Math.sin(k * (0.9 + i * 0.3)) * amp;
                    return `L${px},${py}`;
                  }).join(' ')
                } fill="none" stroke={ELP_INK} strokeWidth="1.2" strokeOpacity="0.85" />
              </g>

              <line x1="600" y1={y} x2="635" y2={y} stroke={ELP_INK} strokeWidth="0.8" />
              <polyline points={`${630},${y - 4} ${635},${y} ${630},${y + 4}`} fill="none" stroke={ELP_INK} strokeWidth="0.8" />

              {/* curled film */}
              <g transform={`translate(${760}, ${y})`}>
                <path d={curl(0, 0, curls[i].radius, curls[i].sweep)}
                  fill="none" stroke={ELP_INK} strokeWidth="3.2" strokeLinecap="square" />
                {/* coating dashed inner edge */}
                <path d={curl(0, 0, curls[i].radius - 4, curls[i].sweep)}
                  fill="none" stroke={ELP_INK} strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="2 3" />
              </g>

              {/* expected behaviour label */}
              <text x="900" y={y - 8} fontFamily={mono} fontSize="9" fill={ELP_MUTED} letterSpacing="1">
                {v.hint.toUpperCase()}
              </text>
              <text x="900" y={y + 8} fontFamily={sans} fontSize="12" fill={ELP_INK}>
                {v.name.toLowerCase()}
              </text>
            </g>
          );
        })}

        {/* axis label across right column */}
        <line x1="900" y1="320" x2="970" y2="320" stroke={ELP_INK} strokeWidth="0.8" />
        <polyline points="966,316 970,320 966,324" fill="none" stroke={ELP_INK} strokeWidth="0.8" />
        <text x="900" y="338" fontFamily={mono} fontSize="9" fill={ELP_MUTED}>bend amplitude</text>
      </svg>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// FIG 2 — pentapeptide anatomy
// ───────────────────────────────────────────────────────────────
function PentapeptideAnatomy() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  const aa = [
    { l: 'V', name: 'Val',  fixed: true },
    { l: 'P', name: 'Pro',  fixed: true },
    { l: 'G', name: 'Gly',  fixed: true },
    { l: 'X', name: 'guest',fixed: false },
    { l: 'G', name: 'Gly',  fixed: true },
  ];

  return (
    <div style={{ border: `1px solid ${ELP_RULE}`, background: ELP_BG_FAINT, padding: 32 }}>
      <svg viewBox="0 0 900 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* backbone */}
        <line x1="80" y1="120" x2="820" y2="120" stroke={ELP_INK} strokeWidth="1.2" />
        {aa.map((r, i) => {
          const cx = 100 + i * 170;
          const isX = !r.fixed;
          return (
            <g key={i}>
              {/* bond to next */}
              {i < 4 && <line x1={cx + 28} y1="120" x2={cx + 142} y2="120" stroke={ELP_INK} strokeWidth="0.8" />}
              <circle cx={cx} cy="120" r="28" fill={isX ? '#fff' : ELP_BG_FAINT} stroke={ELP_INK} strokeWidth={isX ? 1.6 : 1} strokeDasharray={isX ? '4 3' : ''} />
              <text x={cx} y="126" textAnchor="middle" fontFamily={mono} fontWeight={500} fontSize="18" fill={ELP_INK}>
                {r.l}
              </text>
              <text x={cx} y="170" textAnchor="middle" fontFamily={mono} fontSize="10" fill={ELP_MUTED}>{r.name}</text>
              {isX && (
                <>
                  <text x={cx} y="80" textAnchor="middle" fontFamily={mono} fontSize="9" fill={ELP_INK} letterSpacing="1">
                    EDITABLE
                  </text>
                  <line x1={cx} y1="85" x2={cx} y2="92" stroke={ELP_INK} strokeWidth="0.6" />
                </>
              )}
            </g>
          );
        })}
        {/* repeat brace */}
        <line x1="60" y1="120" x2="60" y2="195" stroke={ELP_INK} strokeWidth="0.8" />
        <line x1="60" y1="195" x2="840" y2="195" stroke={ELP_INK} strokeWidth="0.8" />
        <line x1="840" y1="120" x2="840" y2="195" stroke={ELP_INK} strokeWidth="0.8" />
        <line x1="450" y1="195" x2="450" y2="208" stroke={ELP_INK} strokeWidth="0.8" />
        <text x="450" y="214" textAnchor="middle" fontFamily={mono} fontSize="11" fill={ELP_INK}>(VPGXG)ₙ &nbsp; · &nbsp; n = 20</text>
        {/* trailing dots for repeat continuation */}
        <text x="860" y="125" fontFamily={mono} fontSize="18" fill={ELP_MUTED}>…</text>
      </svg>

      <div style={{
        marginTop: 20, paddingTop: 18, borderTop: `1px solid ${ELP_RULE}`,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
      }}>
        {[
          ['Intrinsically disordered',
           'Folding is optional and expression rarely fails, so the pipeline tolerates all three variants.'],
          ['LCST behaviour is intrinsic',
           'Environmental responsiveness is built into the polymer itself. No engineered sensor, no molecular switch, no external trigger.'],
          ['Short sequence ↔ behaviour distance',
           'Transition behaviour shifts predictably with the guest residue, so one substitution gives a measurable material change.'],
        ].map(([h, body], i) => (
          <div key={i}>
            <div style={{
              fontFamily: mono, fontSize: 9.5, color: ELP_MUTED,
              textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8,
            }}>why elp · {String(i + 1).padStart(2, '0')}</div>
            <div style={{ fontFamily: sans, fontSize: 14, color: ELP_INK, fontWeight: 400, marginBottom: 6, letterSpacing: -0.2 }}>
              {h}
            </div>
            <div style={{ fontFamily: sans, fontSize: 12.5, color: ELP_MUTED, fontWeight: 300, lineHeight: 1.55 }}>
              {body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// FIG 3 — side-chain gradient
// ───────────────────────────────────────────────────────────────
function SideChainGradient() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';

  // tiny abstract "side chain" glyph per residue (not chemically literal)
  const Glyph = ({ kind }) => {
    if (kind === 'S') return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="40" r="6" fill={ELP_INK} />
        <line x1="50" y1="46" x2="50" y2="62" stroke={ELP_INK} strokeWidth="1.4" />
        <line x1="50" y1="62" x2="40" y2="74" stroke={ELP_INK} strokeWidth="1.4" />
        <text x="36" y="80" fontFamily={mono} fontSize="9" fill={ELP_INK}>OH</text>
        {/* water dots attracted */}
        {[[20,25],[80,30],[18,55],[82,58],[24,82],[78,82]].map(([x,y],i)=>(
          <g key={i}><circle cx={x} cy={y} r="2.4" fill="none" stroke={ELP_INK} strokeWidth="0.8" />
            <line x1={x} y1={y} x2={50} y2={50} stroke={ELP_INK} strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="1 2" /></g>
        ))}
      </svg>
    );
    if (kind === 'A') return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="40" r="6" fill={ELP_INK} />
        <line x1="50" y1="46" x2="50" y2="64" stroke={ELP_INK} strokeWidth="1.4" />
        <text x="44" y="80" fontFamily={mono} fontSize="9" fill={ELP_INK}>CH₃</text>
        {[[22,30],[78,32],[20,72],[80,72]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2" fill="none" stroke={ELP_INK} strokeOpacity="0.4" strokeWidth="0.7" />
        ))}
      </svg>
    );
    // V
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="40" r="6" fill={ELP_INK} />
        <line x1="50" y1="46" x2="50" y2="58" stroke={ELP_INK} strokeWidth="1.4" />
        <line x1="50" y1="58" x2="40" y2="70" stroke={ELP_INK} strokeWidth="1.4" />
        <line x1="50" y1="58" x2="60" y2="70" stroke={ELP_INK} strokeWidth="1.4" />
        <text x="34" y="82" fontFamily={mono} fontSize="8" fill={ELP_INK}>CH(CH₃)₂</text>
        {[[18,22],[82,22],[18,82],[82,82]].map(([x,y],i)=>(
          <g key={i}><circle cx={x} cy={y} r="2" fill="none" stroke={ELP_INK} strokeOpacity="0.25" strokeWidth="0.6" />
            <line x1={x + (x<50?5:-5)} y1={y + (y<50?5:-5)} x2={x + (x<50?14:-14)} y2={y + (y<50?14:-14)} stroke={ELP_INK} strokeOpacity="0.25" strokeWidth="0.5" /></g>
        ))}
      </svg>
    );
  };

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
    }}>
      {VARIANTS.map((v, i) => (
        <div key={v.code} style={{
          border: `1px solid ${ELP_RULE}`, background: ELP_BG_FAINT, padding: 24,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: ELP_MUTED, letterSpacing: 1, textTransform: 'uppercase' }}>
              X = {v.code}
            </div>
            <div style={{ fontFamily: mono, fontSize: 9, color: ELP_FAINT, letterSpacing: 1 }}>{v.hint.toUpperCase()}</div>
          </div>
          <div style={{ aspectRatio: '1.4 / 1', background: '#fff', border: `1px solid ${ELP_RULE}`, marginBottom: 14 }}>
            <Glyph kind={v.code} />
          </div>
          <div style={{ fontFamily: sans, fontSize: 18, fontWeight: 400, color: ELP_INK, letterSpacing: -0.3, marginBottom: 2 }}>
            {v.residue}
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, color: ELP_MUTED, letterSpacing: 0.6, marginBottom: 10 }}>
            {v.side}
          </div>
          <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 300, color: ELP_MUTED, lineHeight: 1.55, borderTop: `1px solid ${ELP_RULE}`, paddingTop: 10 }}>
            {v.code === 'S' && 'Hydrogen-bonds with water, so the polymer holds water and swells.'}
            {v.code === 'A' && 'Small nonpolar methyl group. A mildly hydrophobic baseline.'}
            {v.code === 'V' && 'Bulky branched aliphatic. Excludes water and drives collapse.'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// TBL 1 — variant table
// ───────────────────────────────────────────────────────────────
function VariantTable() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  const Cell = ({ children, head, style }) => (
    <div style={{
      padding: '16px 18px',
      fontFamily: head ? mono : sans,
      fontSize: head ? 10 : 13,
      color: head ? ELP_MUTED : ELP_INK,
      fontWeight: 300,
      textTransform: head ? 'uppercase' : 'none',
      letterSpacing: head ? 1.2 : 0,
      lineHeight: 1.5,
      borderBottom: `1px solid ${ELP_RULE}`,
      ...style,
    }}>{children}</div>
  );
  return (
    <div style={{
      border: `1px solid ${ELP_RULE}`, background: '#fff',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr 1.3fr 2.1fr' }}>
        <Cell head>variant</Cell>
        <Cell head>sequence</Cell>
        <Cell head>guest residue</Cell>
        <Cell head>expected tendency</Cell>
        {VARIANTS.map((v) => (
          <React.Fragment key={v.code}>
            <Cell><span style={{ fontFamily: mono, fontSize: 11, color: ELP_MUTED, marginRight: 8 }}>X={v.code}</span>{v.name}</Cell>
            <Cell><span style={{ fontFamily: mono, fontSize: 12 }}>6xHis-{v.repeat}</span></Cell>
            <Cell><div style={{ fontWeight: 400 }}>{v.residue}</div><div style={{ fontFamily: mono, fontSize: 10.5, color: ELP_MUTED, marginTop: 2 }}>{v.side}</div></Cell>
            <Cell style={{ color: ELP_MUTED, fontSize: 12.5 }}>{v.tendency}</Cell>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// FIG 4 — bilayer mechanism (3-state cross-section)
// ───────────────────────────────────────────────────────────────
function BilayerMechanism() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';

  const states = [
    { label: 'dry · ambient', sub: 'flat · coating relaxed', curl: 0 },
    { label: 'humid · absorbing', sub: 'ELP swells · PET fixed', curl: 30 },
    { label: 'saturated', sub: 'curvature peaks', curl: 75 },
  ];

  // Render a single bilayer strip with curl (deg)
  const Strip = ({ curl, w = 240, h = 140 }) => {
    // strip is a horizontal bilayer that bends downward; we draw as polygon strips
    const N = 30;
    const len = w * 0.86;
    const cx = w / 2, cy = h / 2 - 10;
    // arc: total angular sweep = curl
    const sweepRad = (curl * Math.PI) / 180;
    const radius = curl > 0 ? len / sweepRad : 1e6;
    const points = (sideOffset) => {
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const s = (t - 0.5) * len; // arc length from center
        if (curl > 0) {
          const a = s / radius - Math.PI / 2;
          const r = radius + sideOffset;
          pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r + radius]);
        } else {
          pts.push([cx - len / 2 + t * len, cy + sideOffset]);
        }
      }
      return pts;
    };
    const top = points(-6).concat(points(0).reverse());
    const bot = points(0).concat(points(8).reverse());
    return (
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* PET passive */}
        <polygon points={bot.map(([x,y]) => `${x},${y}`).join(' ')} fill="#fff" stroke={ELP_INK} strokeWidth="0.9" />
        {/* ELP coating */}
        <polygon points={top.map(([x,y]) => `${x},${y}`).join(' ')} fill={ELP_INK} fillOpacity="0.22" stroke={ELP_INK} strokeWidth="0.9" />
        {/* water dots above when humid */}
        {curl > 0 && Array.from({ length: 10 }, (_, i) => {
          const x = 20 + (i / 9) * (w - 40);
          const y = 14 + Math.sin(i * 1.3) * 4;
          return <circle key={i} cx={x} cy={y} r="1.6" fill="none" stroke={ELP_INK} strokeWidth="0.7" strokeOpacity={0.4 + (curl / 200)} />;
        })}
      </svg>
    );
  };

  return (
    <div style={{ border: `1px solid ${ELP_RULE}`, background: ELP_BG_FAINT, padding: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {states.map((s, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${ELP_RULE}`, padding: 18 }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: ELP_MUTED, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 6 }}>
              t · {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ fontFamily: sans, fontSize: 15, fontWeight: 400, color: ELP_INK, marginBottom: 2 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: ELP_MUTED, marginBottom: 12 }}>
              {s.sub}
            </div>
            <Strip curl={s.curl} />
          </div>
        ))}
      </div>
      {/* legend */}
      <div style={{
        marginTop: 18, display: 'flex', gap: 28, justifyContent: 'center', alignItems: 'center',
        fontFamily: mono, fontSize: 10, color: ELP_MUTED, letterSpacing: 0.5,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 8, background: ELP_INK, opacity: 0.22, border: `1px solid ${ELP_INK}` }}></span>
          ELP coating · active
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 8, background: '#fff', border: `1px solid ${ELP_INK}` }}></span>
          PET (Mylar) · passive · 6 μm
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, border: `0.8px solid ${ELP_INK}`, opacity: 0.5 }}></span>
          water vapour
        </span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// FIG 5 — pipeline phases
// ───────────────────────────────────────────────────────────────
function PipelinePhases() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  const stages = [
    { tag: '01', title: 'Design', sub: 'Benchling · (VPGXG)₂₀ + 6xHis · Twist Gene Fragments with Gibson flanks for pET-28a.' },
    { tag: '02', title: 'Clone', sub: 'Gibson Assembly into pET-28a · transform direct into BL21(DE3) · colony pick · validate by sequencing.' },
    { tag: '03', title: 'Express', sub: 'IPTG induction · 18–25 °C overnight · SDS-PAGE pre vs post induction across all three variants.' },
    { tag: '04', title: 'Purify', sub: 'Sonication on ice · clarified supernatant · Ni-NTA affinity (His-tag) · Nanodrop / BCA quantification.' },
    { tag: '05', title: 'Coat', sub: '6 μm Mylar PET · O₂ plasma · drop-cast 3–5 layers · each fully dry before the next.' },
    { tag: '06', title: 'Test', sub: 'Humidity chamber + time-lapse · max bending angle · response time · ≥3 wet/dry cycles · controls.' },
  ];
  return (
    <div style={{ border: `1px solid ${ELP_RULE}`, background: ELP_BG_FAINT, padding: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, alignItems: 'stretch' }}>
        {stages.map((s, i) => (
          <div key={s.tag} style={{
            border: `1px solid ${ELP_INK}`, background: '#fff', padding: '16px 14px',
            position: 'relative', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontFamily: mono, fontSize: 9, color: ELP_MUTED, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 8 }}>
              phase {s.tag}
            </div>
            <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: ELP_INK, marginBottom: 6, letterSpacing: -0.2 }}>
              {s.title}
            </div>
            <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 300, color: ELP_MUTED, lineHeight: 1.5 }}>
              {s.sub}
            </div>
            {i < stages.length - 1 && (
              <svg width="14" height="14" viewBox="0 0 14 14"
                style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', zIndex: 1, background: ELP_BG_FAINT }}>
                <line x1="0" y1="7" x2="11" y2="7" stroke={ELP_INK} strokeWidth="1" />
                <polyline points="8,3 12,7 8,11" fill="none" stroke={ELP_INK} strokeWidth="1" />
              </svg>
            )}
          </div>
        ))}
      </div>
      {/* identical-pipeline annotation */}
      <div style={{
        marginTop: 20, paddingTop: 16, borderTop: `1px dashed ${ELP_RULE}`,
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10,
        fontFamily: mono, fontSize: 9, color: ELP_FAINT, letterSpacing: 0.6, textAlign: 'center',
      }}>
        <div style={{ color: ELP_INK }}>↑ sequence diverges</div>
        <div>identical</div>
        <div>identical</div>
        <div>identical</div>
        <div>identical</div>
        <div>identical</div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// FIG 6 — expected response curves
// ───────────────────────────────────────────────────────────────
function ExpectedResponse() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  const W = 1000, H = 320;
  const padL = 72, padR = 28, padT = 24, padB = 56;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const N = 200;
  // synthetic expected curves — bending angle vs. time during a humidity step
  // ramp humid 0..0.5, hold 0.5..0.7, recover 0.7..1.0
  const profiles = [
    { v: VARIANTS[0], peak: 140, riseTau: 0.18, fallTau: 0.30 },
    { v: VARIANTS[1], peak: 70,  riseTau: 0.24, fallTau: 0.26 },
    { v: VARIANTS[2], peak: 22,  riseTau: 0.30, fallTau: 0.40, crack: true },
  ];
  const trace = (p) => {
    return Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1);
      let v;
      if (t < 0.5) v = p.peak * (1 - Math.exp(-(t) / p.riseTau));
      else if (t < 0.7) v = p.peak * (1 - Math.exp(-0.5 / p.riseTau));
      else v = p.peak * (1 - Math.exp(-0.5 / p.riseTau)) * Math.exp(-(t - 0.7) / p.fallTau);
      // valine: recovery hysteresis (cracking) — flatter return
      if (p.crack && t > 0.7) v = v + 2;
      return v + (Math.sin(i * 0.7) * 0.4 + Math.sin(i * 0.31) * 0.3);
    });
  };
  const x = (i) => padL + (i / (N - 1)) * innerW;
  const yMax = 160, yMin = 0;
  const y = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  return (
    <div style={{ border: `1px solid ${ELP_RULE}`, background: ELP_BG_FAINT, padding: 24 }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* humid hold band */}
        <rect x={padL + 0.5 * innerW} y={padT} width={0.2 * innerW} height={innerH} fill={ELP_INK} fillOpacity="0.05" />
        {/* axes */}
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={ELP_INK} strokeWidth="0.8" />
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={ELP_INK} strokeWidth="0.8" />
        {/* y ticks */}
        {[0, 40, 80, 120, 160].map((v) => (
          <g key={v}>
            <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke={ELP_INK} strokeOpacity="0.08" strokeWidth="0.5" strokeDasharray="2 4" />
            <text x={padL - 10} y={y(v) + 3} textAnchor="end" fontFamily={mono} fontSize="10" fill={ELP_MUTED}>{v}°</text>
          </g>
        ))}
        {/* x phase labels */}
        {[
          { x0: 0.0, x1: 0.5, label: 'ramp humid' },
          { x0: 0.5, x1: 0.7, label: 'hold · saturated' },
          { x0: 0.7, x1: 1.0, label: 'dry · recover' },
        ].map((p, i) => (
          <g key={i}>
            <line
              x1={padL + p.x0 * innerW} y1={H - padB + 8}
              x2={padL + p.x1 * innerW} y2={H - padB + 8}
              stroke={ELP_INK} strokeWidth="0.6" />
            <text
              x={padL + ((p.x0 + p.x1) / 2) * innerW}
              y={H - padB + 22}
              textAnchor="middle" fontFamily={mono} fontSize="10" fill={ELP_MUTED}>
              {p.label}
            </text>
          </g>
        ))}
        {/* traces */}
        {profiles.map((p, idx) => {
          const tr = trace(p);
          const path = tr.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
          const last = tr[tr.length - 1];
          return (
            <g key={idx}>
              <path d={path} fill="none" stroke={ELP_INK}
                strokeWidth={1.6 - idx * 0.3}
                strokeOpacity={1 - idx * 0.18}
                strokeDasharray={idx === 0 ? '0' : idx === 1 ? '6 3' : '2 3'} />
              {/* label at peak */}
              <text
                x={x(N * (0.5))}
                y={y(p.peak) - 8}
                fontFamily={mono} fontSize="10" fill={ELP_INK} fontWeight={idx === 0 ? 500 : 400}>
                {p.v.repeat}
              </text>
            </g>
          );
        })}
        {/* axis titles */}
        <text x={padL} y={padT - 8} fontFamily={mono} fontSize="10" fill={ELP_MUTED}>bending angle (°)</text>
        <text x={W - padR} y={H - padB - 8} textAnchor="end" fontFamily={mono} fontSize="10" fill={ELP_MUTED}>t  · humidity cycle</text>
      </svg>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// READOUT GRID — what counts as evidence
// ───────────────────────────────────────────────────────────────
function ReadoutGrid() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  const items = [
    ['Max bending angle', 'degrees · peak deformation at saturation'],
    ['Time to peak', 'seconds · how fast the coating absorbs and bends'],
    ['Recovery time', 'seconds · return to flat on drying'],
    ['Curl radius', 'mm · tightness of the resulting curl'],
    ['Swelling ratio', 'wet/dry coating thickness from microscopy'],
    ['Coating integrity', 'cracking, delamination, opacity over ≥3 wet/dry cycles'],
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 0,
      border: `1px solid ${ELP_RULE}`, background: '#fff',
    }}>
      {items.map(([h, body], i) => (
        <div key={i} style={{
          padding: '20px 22px',
          borderRight: (i + 1) % 3 === 0 ? 'none' : `1px solid ${ELP_RULE}`,
          borderBottom: i < 3 ? `1px solid ${ELP_RULE}` : 'none',
        }}>
          <div style={{
            fontFamily: mono, fontSize: 9.5, color: ELP_MUTED,
            letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10,
          }}>readout · {String(i + 1).padStart(2, '0')}</div>
          <div style={{ fontFamily: sans, fontSize: 16, color: ELP_INK, fontWeight: 400, marginBottom: 6, letterSpacing: -0.3 }}>
            {h}
          </div>
          <div style={{ fontFamily: sans, fontSize: 12.5, color: ELP_MUTED, fontWeight: 300, lineHeight: 1.55 }}>
            {body}
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// FIG 7 — future axes (Aim 1b + Aim 2)
// ───────────────────────────────────────────────────────────────
function FutureAxes() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';

  const seq = (letters) => (
    <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
      {letters.map((c, k) => (
        <div key={k} style={{
          width: 14, height: 22, background: c === ' ' ? 'transparent' : ELP_BG_FAINT,
          border: c === ' ' ? 'none' : `1px solid ${ELP_INK}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: mono, fontSize: 10, color: ELP_INK,
        }}>{c}</div>
      ))}
    </div>
  );

  const Row = ({ label, letters }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 16, marginBottom: 10 }}>
      <div style={{ fontFamily: mono, fontSize: 10.5, color: ELP_INK, textAlign: 'right' }}>{label}</div>
      <div>{seq(letters)}</div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
      {/* Aim 1b */}
      <div style={{ border: `1px solid ${ELP_RULE}`, background: ELP_BG_FAINT, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <span style={{ fontFamily: mono, fontSize: 10, color: ELP_MUTED, letterSpacing: 1, textTransform: 'uppercase' }}>Aim 1b · stretch</span>
        </div>
        <div style={{ fontFamily: sans, fontSize: 20, color: ELP_INK, fontWeight: 400, letterSpacing: -0.3, marginBottom: 16 }}>
          Sequence organisation as well as composition.
        </div>
        <Row label="(VPGSG)₂₀"            letters={'SSSSSSSSSSSSSSSSSSSS'.split('')} />
        <Row label="(VPGAG)₂₀"            letters={'AAAAAAAAAAAAAAAAAAAA'.split('')} />
        <Row label="(VPGVG)₂₀"            letters={'VVVVVVVVVVVVVVVVVVVV'.split('')} />
        <div style={{ height: 12 }} />
        <Row label="(VPGSG)₁₀–(VPGAG)₁₀"  letters={'SSSSSSSSSSAAAAAAAAAA'.split('')} />
        <Row label="(VPGSG)₁₀–(VPGVG)₁₀"  letters={'SSSSSSSSSSVVVVVVVVVV'.split('')} />
        <div style={{
          marginTop: 18, paddingTop: 14, borderTop: `1px solid ${ELP_RULE}`,
          fontFamily: sans, fontSize: 12.5, color: ELP_MUTED, fontWeight: 300, lineHeight: 1.55,
        }}>
          Diblock variants test whether <em>where</em> the residues sit along the chain changes film
          behaviour: phase separation, domain-specific swelling, asymmetric morphology.
        </div>
      </div>

      {/* Aim 2 */}
      <div style={{ border: `1px solid ${ELP_RULE}`, background: '#fff', padding: 24 }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: ELP_MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
          Aim 2 · development
        </div>
        <div style={{ fontFamily: sans, fontSize: 20, color: ELP_INK, fontWeight: 400, letterSpacing: -0.3, marginBottom: 16 }}>
          A different environmental axis.
        </div>
        <Row label="(VPGKG)₂₀" letters={'KKKKKKKKKKKKKKKKKKKK'.split('')} />
        <div style={{
          marginTop: 14, padding: '14px 14px',
          background: ELP_BG_FAINT, border: `1px dashed ${ELP_RULE}`,
          fontFamily: mono, fontSize: 11, color: ELP_INK, lineHeight: 1.5,
        }}>
          K · lysine · positively charged at physiological pH<br />
          → responsiveness shifts from <strong style={{ fontWeight: 500 }}>humidity</strong> to <strong style={{ fontWeight: 500 }}>pH</strong> and <strong style={{ fontWeight: 500 }}>ionic strength</strong>.
        </div>
        <div style={{
          marginTop: 16, fontFamily: sans, fontSize: 12.5, color: ELP_MUTED, fontWeight: 300, lineHeight: 1.55,
        }}>
          The same scaffold and pipeline with one residue substitution changes the trigger variable.
          Designed but not yet expressed.
        </div>
      </div>
    </div>
  );
}

window.ElpPage = ElpPage;
