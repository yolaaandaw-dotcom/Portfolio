// Project-specific page for latent-goal (Diagnostic Environment Design).

const LG_INK = '#0a0a0a';
const LG_MUTED = 'rgba(10,10,10,0.55)';
const LG_FAINT = 'rgba(10,10,10,0.32)';
const LG_RULE = 'rgba(10,10,10,0.14)';
const LG_BG_FAINT = '#fafafa';

// 4-axis palette (kept muted to match the bw look)
const AXIS = {
  exp:  { name: 'Explore',     color: '#2c5d8f', dot: '#2c5d8f' },
  eff:  { name: 'Save effort', color: '#3f7a52', dot: '#3f7a52' },
  col:  { name: 'Collect',     color: '#a07628', dot: '#a07628' },
  risk: { name: 'Risk',        color: '#9a3a3a', dot: '#9a3a3a' },
};

function LatentGoalPage({ project, allProjects }) {
  const sans = 'Roboto, system-ui, sans-serif';
  const mono = 'Roboto, system-ui, sans-serif';

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
    const tick = () => { i++; setRevealed(i); if (i < 12) t = setTimeout(tick, 70); };
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
      fontFamily: mono, fontSize: 10, color: LG_MUTED,
      textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 14, fontWeight: 400,
      ...style,
    }}>{children}</div>
  );

  const FigCaption = ({ children }) => (
    <div style={{
      fontFamily: mono, fontSize: 10.5, color: LG_MUTED, marginTop: 10,
      letterSpacing: 0.4, fontWeight: 400, lineHeight: 1.5,
    }}>{children}</div>
  );

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', background: '#fff', color: LG_INK,
      padding: '80px 32px 120px', fontFamily: sans, fontWeight: 300,
      maxWidth: 940, margin: '0 auto',
    }}>

      <Reveal i={0}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', fontFamily: mono, fontSize: 11,
          color: LG_MUTED, letterSpacing: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap',
          paddingBottom: 14, borderBottom: `1px solid ${LG_RULE}`,
        }}>
          <a href="../index.html" style={{ justifySelf: 'start', color: LG_INK, textDecoration: 'none' }}>← Home</a>
          <span>{num} / {String(allProjects.length).padStart(2, '0')}</span>
          <span style={{ justifySelf: 'end', display: 'inline-flex', gap: 16 }}>
            <a href={`${prev.id}.html`} style={{ color: LG_MUTED, textDecoration: 'none' }}>prev</a>
            <a href={`${next.id}.html`} style={{ color: LG_INK, textDecoration: 'none' }}>next →</a>
          </span>
        </div>
      </Reveal>


      <Reveal i={2} style={{ marginTop: 64 }}>
        <h1 style={{
          fontFamily: sans, fontWeight: 300, fontSize: 30, lineHeight: 1.15,
          letterSpacing: -0.7, margin: 0, maxWidth: '24ch',
        }}>{project.title}</h1>
      </Reveal>

      <Reveal i={2} style={{ marginTop: 18 }}>
        <div style={{
          fontFamily: sans, fontWeight: 300, fontSize: 17, color: LG_MUTED,
          lineHeight: 1.5, maxWidth: '56ch',
        }}>{project.subtitle}</div>
      </Reveal>

      <Reveal i={3} style={{ marginTop: 28 }}>
        <p style={{
          fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.65,
          margin: 0, maxWidth: '64ch', color: LG_INK,
        }}>{project.blurb}</p>
      </Reveal>

      <Reveal i={4} style={{ marginTop: 48 }}>
        <dl style={{
          margin: 0, paddingTop: 20, paddingBottom: 28,
          borderTop: `1px solid ${LG_RULE}`, borderBottom: `1px solid ${LG_RULE}`,
        }}>
          {shownMeta.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '112px minmax(0,1fr)', columnGap: 20, padding: '6px 0' }}>
              <dt style={{
                fontFamily: mono, fontSize: 10, color: LG_MUTED,
                textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400, lineHeight: 2,
              }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: sans, fontSize: 13, fontWeight: 300, color: LG_INK, lineHeight: 1.45 }}>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal i={5} style={{ marginTop: 72 }}>
        <SectionLabel>The maze as the question</SectionLabel>
        <MazeFigure />
        <FigCaption>
          Each fork tests one tendency. The branch a player takes updates the system's estimate.
        </FigCaption>
      </Reveal>

      <Reveal i={6} style={{ marginTop: 96 }}>
        <SectionLabel>Summary</SectionLabel>
        <p style={{
          fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7,
          margin: 0, color: LG_INK, maxWidth: '64ch',
        }}>{project.body}</p>
      </Reveal>

      <Reveal i={7} style={{ marginTop: 96 }}>
        <SectionLabel>How it works</SectionLabel>
        <p style={{
          fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7,
          margin: '0 0 28px', color: LG_INK, maxWidth: '64ch',
        }}>
          The loop is the same every round. A formula reads each fork's signal straight from the
          maze layout, so the forks do not have to be labeled by hand. Eighteen hand-labeled forks
          were enough to cover 789 forks in the largest library, about 44× less labeling.
        </p>
        <LoopDiagram />
      </Reveal>

      <Reveal i={8} style={{ marginTop: 96 }}>
        <SectionLabel>What we found</SectionLabel>
        <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none', maxWidth: '64ch' }}>
          {[
            'Picking mazes this way estimated preferences more accurately than showing random mazes in 2 of the 3 libraries. The gain was a few percent: small, but consistent.',
            'The selection step is what produces the gain. A carefully curated library did no better than a random library of the same size, once both used the same selection step.',
            'Letting a language model (Claude Haiku) choose among three mazes it had proposed itself performed about the same as the formal method. The three proposals were too similar for the choice to matter, so proposal variety is the limit.',
          ].map((t, i) => (
            <li key={i} style={{
              display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14,
              padding: '14px 0', borderTop: i === 0 ? 'none' : `1px solid ${LG_RULE}`,
            }}>
              <span style={{ fontFamily: mono, fontSize: 12, color: LG_MUTED, fontWeight: 300 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: sans, fontSize: 15, fontWeight: 300, lineHeight: 1.65, color: LG_INK }}>{t}</span>
            </li>
          ))}
        </ol>
        <p style={{
          fontFamily: sans, fontWeight: 300, fontSize: 14, lineHeight: 1.7,
          margin: '28px 0 0', color: LG_MUTED, maxWidth: '64ch',
        }}>
          Limits: the evidence comes from 625 simulated players with known preferences. A six-person
          informal pilot confirmed only that the whole flow runs end to end. It is not a user study.
        </p>
      </Reveal>

      <Reveal i={9} style={{ marginTop: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start' }}>
          <div>
            <ResultsChart />
            <FigCaption>
              Gains were small but consistent in 2 of 3 maze libraries (46 and 263 mazes), measured
              against a random library of the same size. The 134-maze library showed no clear
              difference.
            </FigCaption>
          </div>
          <div>
            <PosteriorBackbone />
            <FigCaption>
              How the estimate of each tendency changes over 8 mazes. Illustrative.
            </FigCaption>
          </div>
        </div>
      </Reveal>

      <Reveal i={11} style={{ marginTop: 96 }}>
        <SectionLabel>Why it matters to my work</SectionLabel>
        <p style={{
          fontFamily: sans, fontWeight: 300, fontSize: 16, lineHeight: 1.7,
          margin: 0, color: LG_INK, maxWidth: '64ch',
        }}>
          I work on systems where the material or the machine answers back, and this loop has the
          same shape. The environment is what carries the exchange: the system learns about the
          person by building the thing they act in, and their choices change what it builds next.
          The result is small, but that structure is the part I want to keep working on.
        </p>
      </Reveal>

      <Reveal i={11} style={{ marginTop: 56 }}>
        <div style={{ paddingTop: 20, borderTop: `1px solid ${LG_RULE}` }}>
          <a href="assets/latent-goal/diagnostic-environment-design.pdf" style={{
            fontFamily: mono, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
            color: LG_INK, textDecoration: 'none', borderBottom: `1px solid ${LG_INK}`,
            paddingBottom: 2,
          }}>Read the paper (PDF)</a>
        </div>
      </Reveal>

      <nav style={{
        marginTop: 96, paddingTop: 24, borderTop: `1px solid ${LG_RULE}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
      }}>
        <a href={`${prev.id}.html`} style={{ textDecoration: 'none', color: LG_INK, padding: '20px 0' }}>
          <div style={{
            fontFamily: mono, fontSize: 10, color: LG_MUTED,
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, fontWeight: 400,
          }}>← Previous</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{prev.title}</div>
        </a>
        <a href={`${next.id}.html`} style={{ textDecoration: 'none', color: LG_INK, padding: '20px 0', textAlign: 'right' }}>
          <div style={{
            fontFamily: mono, fontSize: 10, color: LG_MUTED,
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, fontWeight: 400,
          }}>Next →</div>
          <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 300, letterSpacing: -0.4 }}>{next.title}</div>
        </a>
      </nav>

      <footer style={{
        marginTop: 40, paddingTop: 20, borderTop: `1px solid ${LG_RULE}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: mono, fontSize: 10.5, color: LG_MUTED,
        textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400,
      }}>
        <a href="https://www.linkedin.com/in/yao-wang-gsd/" style={{ color: LG_INK, textDecoration: 'none' }}>
          linkedin.com/in/yao-wang-gsd
        </a>
        <span>Yao Wang · 王瑶</span>
      </footer>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// LOOP DIAGRAM — four steps
// ───────────────────────────────────────────────────────────────
function LoopDiagram() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  const steps = [
    ['01', 'Estimate preferences', 'Four tendencies, held as a running estimate.'],
    ['02', 'Pick the most informative maze', 'From the library, the maze expected to teach the most.'],
    ['03', 'Player chooses at forks', 'Each branch taken is one piece of evidence.'],
    ['04', 'Update the estimate', 'The estimate sharpens and the loop repeats.'],
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {steps.map(([n, title, sub]) => (
          <div key={n} style={{ borderTop: `1px solid ${LG_INK}`, paddingTop: 14 }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: LG_MUTED, letterSpacing: 1, marginBottom: 10 }}>{n}</div>
            <div style={{ fontFamily: sans, fontSize: 16, fontWeight: 400, letterSpacing: -0.3, marginBottom: 10, lineHeight: 1.3 }}>{title}</div>
            <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 300, lineHeight: 1.6, color: LG_MUTED }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 20, paddingTop: 12, borderTop: `1px solid ${LG_RULE}`,
        fontFamily: mono, fontSize: 10, color: LG_MUTED, letterSpacing: 0.6,
      }}>
        Offline: generate and check the mazes. Online: pick the next one in about 5 ms.
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// MAZE FIGURE
// ───────────────────────────────────────────────────────────────
function MazeFigure() {
  const mono = 'Roboto, system-ui, sans-serif';
  // grid 12 cols × 8 rows, cell = 44
  const cell = 44;
  const cols = 14, rows = 9;
  const W = cols * cell, H = rows * cell;
  // walls — list of (col,row) wall cells; rest is open path
  const wallSet = new Set();
  const walls = [];
  for (let c = 0; c < cols; c++) {
    walls.push([c, 0]); walls.push([c, rows - 1]);
  }
  for (let r = 0; r < rows; r++) {
    walls.push([0, r]); walls.push([cols - 1, r]);
  }
  // interior walls forming branches
  const interior = [
    // horizontal divider segment
    [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
    [9, 5], [10, 5], [11, 5],
    [3, 6], [4, 6],
    [6, 1], [6, 2],
    [10, 2], [10, 3], [10, 4],
    [8, 6], [8, 7],
  ];
  interior.forEach(w => walls.push(w));
  walls.forEach(([c, r]) => wallSet.add(`${c},${r}`));

  // KDPs: position + axis + path forks
  const kdps = [
    { c: 2, r: 4, axis: 'exp',  label: 'A' },   // explore — corridor split
    { c: 5, r: 6, axis: 'col',  label: 'B' },   // collection — item room detour
    { c: 9, r: 3, axis: 'eff',  label: 'C' },   // efficiency — short vs long
    { c: 11, r: 6, axis: 'risk', label: 'D' },  // risk — risky shortcut
  ];
  // items
  const items = [{ c: 4, r: 7 }, { c: 6, r: 7 }];
  // risk zone
  const risk = [{ c: 12, r: 5 }, { c: 12, r: 6 }, { c: 12, r: 7 }];
  // start / exit
  const start = { c: 1, r: 4 };
  const exit  = { c: 12, r: 4 };

  // sample trajectory (illustrative): a risk-averse player who visits KDPs A,B,C
  // and takes the safe long-way-around to the exit rather than the risk shortcut to D.
  const traj = [
    [1,4],[2,4],                                  // KDP A (explore)
    [2,5],[2,6],[2,7],[3,7],[4,7],[5,7],          // detour south to pick up an item
    [5,6],                                        // KDP B (collection)
    [6,6],[7,6],[7,5],[7,4],[8,4],[9,4],
    [9,3],                                        // KDP C (efficiency)
    [9,2],[9,1],[10,1],[11,1],[11,2],[11,3],      // long way around the col-10 wall
    [11,4],[12,4],                                // exit
  ];
  const trajD = traj.map(([c,r], i) => `${i?'L':'M'}${c*cell+cell/2},${r*cell+cell/2}`).join(' ');

  return (
    <div style={{
      border: `1px solid ${LG_RULE}`, background: LG_BG_FAINT, padding: 28,
      display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32, alignItems: 'center',
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* background grid */}
        {Array.from({ length: cols }, (_, c) => (
          Array.from({ length: rows }, (_, r) => {
            const isWall = wallSet.has(`${c},${r}`);
            return (
              <rect key={`${c},${r}`} x={c*cell} y={r*cell} width={cell} height={cell}
                fill={isWall ? '#1f1f1f' : '#fff'}
                stroke={isWall ? '#1f1f1f' : '#eee'} strokeWidth="0.5" />
            );
          })
        ))}
        {/* risk zone overlay */}
        {risk.filter(({c,r}) => !wallSet.has(`${c},${r}`)).map(({c,r}, i) => (
          <g key={`risk-${i}`}>
            <rect x={c*cell} y={r*cell} width={cell} height={cell}
              fill={AXIS.risk.color} fillOpacity="0.10" />
            <line x1={c*cell} y1={r*cell} x2={(c+1)*cell} y2={(r+1)*cell}
              stroke={AXIS.risk.color} strokeOpacity="0.35" strokeWidth="0.7" />
          </g>
        ))}
        {/* items */}
        {items.map(({c,r}, i) => (
          <circle key={`it-${i}`} cx={c*cell+cell/2} cy={r*cell+cell/2} r="5"
            fill="none" stroke={AXIS.col.color} strokeWidth="1.5" />
        ))}
        {/* sample trajectory */}
        <path d={trajD} fill="none" stroke={LG_INK} strokeOpacity="0.55"
          strokeWidth="2" strokeDasharray="3 3" />
        {/* start / exit */}
        <circle cx={start.c*cell+cell/2} cy={start.r*cell+cell/2} r="6" fill={LG_INK} />
        <text x={start.c*cell+cell/2} y={start.r*cell-6} textAnchor="middle"
          fontFamily={mono} fontSize="10" fill={LG_MUTED}>start</text>
        <rect x={exit.c*cell+cell/2-6} y={exit.r*cell+cell/2-6} width="12" height="12"
          fill="none" stroke={LG_INK} strokeWidth="1.8" transform={`rotate(45 ${exit.c*cell+cell/2} ${exit.r*cell+cell/2})`} />
        <text x={exit.c*cell+cell/2} y={exit.r*cell-6} textAnchor="middle"
          fontFamily={mono} fontSize="10" fill={LG_MUTED}>exit</text>
        {/* KDPs */}
        {kdps.map(({c,r,axis,label}, i) => {
          const cx = c*cell+cell/2, cy = r*cell+cell/2;
          const col = AXIS[axis].color;
          return (
            <g key={`k-${i}`}>
              <circle cx={cx} cy={cy} r="13" fill="#fff" stroke={col} strokeWidth="2" />
              <circle cx={cx} cy={cy} r="6" fill={col} />
              <text x={cx} y={cy-18} textAnchor="middle" fontFamily={mono}
                fontSize="9.5" fill={LG_INK} letterSpacing="0.5">Fork {label}</text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div>
        <div style={{
          fontFamily: mono, fontSize: 10, color: LG_MUTED,
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16,
        }}>What each fork tests</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.entries(AXIS).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                border: `2px solid ${v.color}`, display: 'inline-block', position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', inset: 3, borderRadius: '50%', background: v.color,
                }} />
              </span>
              <span style={{ fontFamily: 'Roboto', fontSize: 13, fontWeight: 400, color: LG_INK, minWidth: 86 }}>{v.name}</span>
            </div>
          ))}
          <div style={{
            marginTop: 18, paddingTop: 16, borderTop: `1px solid ${LG_RULE}`,
            display: 'grid', gap: 10, fontSize: 12, fontFamily: 'Roboto', color: LG_MUTED, fontWeight: 300, lineHeight: 1.55,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: LG_INK }}>
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="4" fill={LG_INK} />
                </svg>
                start
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: LG_INK }}>
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                  <rect x="3" y="3" width="8" height="8" fill="none" stroke={LG_INK} strokeWidth="1.6"
                    transform="rotate(45 7 7)" />
                </svg>
                exit
              </span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="4" fill="none" stroke={AXIS.col.color} strokeWidth="1.4" />
              </svg>
              item
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                <rect x="0" y="0" width="14" height="14" fill={AXIS.risk.color} fillOpacity="0.10" />
                <line x1="0" y1="0" x2="14" y2="14" stroke={AXIS.risk.color} strokeOpacity="0.5" strokeWidth="0.7" />
              </svg>
              risk zone
            </div>
            <div style={{
              borderTop: `1px dashed ${LG_RULE}`, paddingTop: 8, marginTop: 4,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="32" height="6" viewBox="0 0 32 6" style={{ flexShrink: 0 }}>
                <line x1="0" y1="3" x2="32" y2="3" stroke={LG_INK} strokeOpacity="0.55"
                  strokeWidth="2" strokeDasharray="3 3" />
              </svg>
              sample trajectory (illustrative)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// PIPELINE DIAGRAM
// ───────────────────────────────────────────────────────────────
function PipelineDiagram() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  const serif = 'Roboto, system-ui, sans-serif';

  const Box = ({ tag, title, sub, w = 200 }) => (
    <div style={{
      width: w, padding: '18px 18px', border: `1px solid ${LG_INK}`, background: '#fff',
      position: 'relative',
    }}>
      <div style={{
        fontFamily: mono, fontSize: 9, color: LG_MUTED, letterSpacing: 1.2,
        textTransform: 'uppercase', marginBottom: 8,
      }}>{tag}</div>
      <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 400, color: LG_INK, marginBottom: 4 }}>{title}</div>
      <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 300, color: LG_MUTED, lineHeight: 1.5 }}>{sub}</div>
    </div>
  );

  const Arrow = ({ label, sub }) => (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', minWidth: 0,
    }}>
      <div style={{
        fontFamily: mono, fontSize: 10, color: LG_INK, letterSpacing: 0.6, marginBottom: 4,
      }}>{label}</div>
      <svg width="100%" height="14" viewBox="0 0 100 14" preserveAspectRatio="none" style={{ display: 'block' }}>
        <line x1="0" y1="7" x2="92" y2="7" stroke={LG_INK} strokeWidth="1" />
        <polyline points="86,3 92,7 86,11" fill="none" stroke={LG_INK} strokeWidth="1" />
      </svg>
      {sub && (
        <div style={{
          fontFamily: mono, fontSize: 9.5, color: LG_MUTED, letterSpacing: 0.4, marginTop: 4, textAlign: 'center',
        }}>{sub}</div>
      )}
    </div>
  );

  return (
    <div style={{
      border: `1px solid ${LG_RULE}`, background: LG_BG_FAINT, padding: 32,
    }}>
      {/* main horizontal pipeline */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
        <Box tag="offline" title="ψ-space"
          sub={<>Template grammar · ~10<sup>7</sup> configurations · 91% validator-pass</>} />
        <Arrow label="MAP-Elites" sub="legibility floor · QD curation" />
        <Box tag="archive" title="archive"
          sub="46 · 134 · 263 cells (v0 · v1.1 · v1.2) · O(|A|) lookup ~5 ms" />
        <Arrow label="argmax-EIG" sub="given posterior bₜ" />
        <Box tag="online" title="next maze E"
          sub={<>presented to user · KDP outcomes <i>a<sub>k</sub></i> ∈ {`{`}0,1{`}`}</>} />
      </div>

      {/* feedback loop */}
      <div style={{
        marginTop: 24, paddingTop: 24, borderTop: `1px dashed ${LG_RULE}`,
        display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center',
      }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: LG_MUTED, letterSpacing: 0.8 }}>
          posterior update · Eq. (1)
        </div>
        <svg width="220" height="14" viewBox="0 0 220 14">
          <line x1="218" y1="7" x2="6" y2="7" stroke={LG_INK} strokeWidth="1" strokeDasharray="3 3" />
          <polyline points="12,3 6,7 12,11" fill="none" stroke={LG_INK} strokeWidth="1" />
        </svg>
        <div style={{ fontFamily: sans, fontSize: 14, color: LG_INK }}>
          b<sub>t</sub> ← b<sub>t</sub> · P(a | θ, E)
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// POSTERIOR BACKBONE — line chart, posterior mean per axis over T
// ───────────────────────────────────────────────────────────────
function PosteriorBackbone() {
  const mono = 'Roboto, system-ui, sans-serif';
  const W = 880, H = 240;
  const padL = 74, padR = 150, padT = 24, padB = 52;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const T = 8;
  const xs = Array.from({ length: T + 1 }, (_, i) => i);
  // Synthetic but plausible posterior-mean trajectories (uniform mean 0.5 → tightening)
  const series = {
    exp:  [0.50, 0.55, 0.61, 0.66, 0.71, 0.75, 0.78, 0.80, 0.81],
    eff:  [0.50, 0.46, 0.40, 0.36, 0.32, 0.28, 0.26, 0.24, 0.23],
    col:  [0.50, 0.51, 0.55, 0.58, 0.61, 0.62, 0.63, 0.64, 0.65],
    risk: [0.50, 0.49, 0.46, 0.43, 0.42, 0.41, 0.40, 0.40, 0.39],
  };
  const x = (i) => padL + (i / T) * innerW;
  const y = (v) => padT + (1 - v) * innerH;

  return (
    <div style={{
      border: `1px solid ${LG_RULE}`, background: LG_BG_FAINT, padding: 24,
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* axes */}
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={LG_INK} strokeWidth="1.4" />
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={LG_INK} strokeWidth="1.4" />
        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((v, i) => (
          <g key={v}>
            <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)}
              stroke={LG_INK} strokeOpacity={v === 0.5 ? 0.18 : 0.07} strokeWidth="0.9"
              strokeDasharray={v === 0.5 ? '0' : '2 4'} />
            <text x={padL - 12} y={y(v) + 7} textAnchor="end"
              fontFamily={mono} fontSize="21" fill={LG_MUTED}>{v.toFixed(2)}</text>
          </g>
        ))}
        {/* x ticks */}
        {xs.map((i) => (
          <g key={i}>
            <line x1={x(i)} y1={H - padB} x2={x(i)} y2={H - padB + 8} stroke={LG_INK} strokeWidth="1.2" />
            <text x={x(i)} y={H - padB + 30} textAnchor="middle"
              fontFamily={mono} fontSize="21" fill={LG_MUTED}>t={i}</text>
          </g>
        ))}
        {/* uniform-prior reference line label */}
        <text x={padL + 10} y={y(0.5) - 10} textAnchor="start"
          fontFamily={mono} fontSize="19" fill={LG_MUTED}>uniform prior · 0.50</text>
        {/* series */}
        {Object.entries(series).map(([k, vs]) => {
          const d = vs.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
          const col = AXIS[k].color;
          return (
            <g key={k}>
              <path d={d} fill="none" stroke={col} strokeWidth="3" />
              {vs.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r="4.5" fill="#fff" stroke={col} strokeWidth="2.2" />
              ))}
              <text x={x(T) + 12} y={y(vs[vs.length - 1]) + 8}
                fontFamily={mono} fontSize="22" fill={col}>{AXIS[k].name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// RESULTS CHART — three archives, mean ± CI
// ───────────────────────────────────────────────────────────────
function ResultsChart() {
  const mono = 'Roboto, system-ui, sans-serif';
  const sans = 'Roboto, system-ui, sans-serif';
  const W = 880, H = 340;
  const padL = 96, padR = 40, padT = 28, padB = 96;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  // values from PDF Tab. II (top block) — mean, lo, hi (×10⁻³ ℓ₂ units)
  const data = [
    { k: '46 mazes',  sub: 'library 1', mean: 3.5, lo: 1.4, hi: 5.5, hit: true },
    { k: '134 mazes', sub: 'library 2', mean: 1.0, lo: -1.0, hi: 2.9, hit: false },
    { k: '263 mazes', sub: 'library 3', mean: 3.2, lo: 1.0, hi: 5.3, hit: true },
  ];
  const yMin = -2, yMax = 7;
  const x = (i) => padL + (i + 0.5) * (innerW / data.length);
  const barW = innerW / data.length * 0.40;
  const y = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  return (
    <div style={{
      border: `1px solid ${LG_RULE}`, background: LG_BG_FAINT, padding: 24,
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* grid */}
        {[-2, 0, 2, 4, 6].map((v) => (
          <g key={v}>
            <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)}
              stroke={LG_INK} strokeOpacity={v === 0 ? 0.4 : 0.08} strokeWidth={v === 0 ? 1.6 : 0.9}
              strokeDasharray={v === 0 ? '0' : '4 6'} />
            <text x={padL - 14} y={y(v) + 8} textAnchor="end"
              fontFamily={mono} fontSize="22" fill={LG_MUTED}>{v > 0 ? '+' : ''}{v.toFixed(0)}</text>
          </g>
        ))}
        {/* y-axis label */}
        <text x={26} y={padT + innerH / 2}
          fontFamily={mono} fontSize="21" fill={LG_MUTED}
          textAnchor="middle" transform={`rotate(-90, 26, ${padT + innerH / 2})`}>
          Accuracy gain (×10⁻³)
        </text>
        {/* axes */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke={LG_INK} strokeWidth="1.4" />

        {/* bars */}
        {data.map((d, i) => {
          const xi = x(i);
          const top = d.mean >= 0 ? y(d.mean) : y(0);
          const h = Math.abs(y(d.mean) - y(0));
          const isHit = d.hit;
          return (
            <g key={d.k}>
              {/* bar */}
              <rect x={xi - barW / 2} y={top} width={barW} height={h}
                fill={isHit ? LG_INK : '#fff'}
                stroke={LG_INK} strokeWidth="1.8" />
              {/* CI whisker */}
              <line x1={xi} y1={y(d.lo)} x2={xi} y2={y(d.hi)}
                stroke={LG_INK} strokeWidth="2.6" />
              <line x1={xi - 14} y1={y(d.lo)} x2={xi + 14} y2={y(d.lo)}
                stroke={LG_INK} strokeWidth="2.6" />
              <line x1={xi - 14} y1={y(d.hi)} x2={xi + 14} y2={y(d.hi)}
                stroke={LG_INK} strokeWidth="2.6" />
              {/* mean dot */}
              <circle cx={xi} cy={y(d.mean)} r="6"
                fill={isHit ? '#fff' : LG_INK} stroke={LG_INK} strokeWidth="1.8" />
              {/* mean label */}
              <text x={xi + barW / 2 + 12} y={y(d.mean) + 8}
                fontFamily={mono} fontSize="23" fill={LG_INK}>
                {d.mean > 0 ? '+' : ''}{d.mean.toFixed(1)}
              </text>
              {/* x-axis label */}
              <text x={xi} y={padT + innerH + 40} textAnchor="middle"
                fontFamily={sans} fontSize="27" fontWeight="400" fill={LG_INK}>{d.k}</text>
              <text x={xi} y={padT + innerH + 70} textAnchor="middle"
                fontFamily={mono} fontSize="21" fill={LG_MUTED}>{d.sub}</text>

            </g>
          );
        })}
      </svg>
      <div style={{
        marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LG_RULE}`,
        fontFamily: mono, fontSize: 10, color: LG_MUTED, letterSpacing: 0.4,
      }}>
        Filled bars: the gain held up across repeated runs. Whiskers show the spread.
      </div>
    </div>
  );
}

window.LatentGoalPage = LatentGoalPage;
