// Shared data — projects, bio, meta. Real copy based on the briefing.

const PORTFOLIO_DATA = {
  name: 'Yao Wang',
  kanji: '王瑶',
  tagline:
    'Design research at the intersection of computational fabrication, soft & active materials, and human–machine co-making.',
  affiliation: 'MDes · Harvard GSD',
  prev: 'RISD · Industrial Design',
  linkedin: 'https://www.linkedin.com/in/yao-wang-gsd/',
  date: 'Spring 2026',
  session: '26-04',
  projects: [
    {
      id: 'tpu',
      title: 'Conductive TPU Sensor',
      year: '2025',
      blurb: 'Fabric-embedded resistive / capacitive motion sensor; treating path geometry as a primary sensing variable.',
      tags: ['materials', 'sensing', 'wearables'],
      figure: 'Conductive TPU trace under 40% strain; resistance deviation plotted against cycle count.',
      body:
        'A soft sensor printed in conductive TPU onto knit substrates. Rather than tuning resistance through material doping, the circuit is designed by routing — serpentines, spirals, and bifurcations each map to a distinct force-displacement signature. Characterized over 2,000 strain cycles on an Instron rig.',
      meta: [
        ['role', 'Lead researcher'],
        ['context', 'Harvard GSD · MDes thesis probe'],
        ['tools', 'Bambu X1C · Cura · Arduino · Python'],
        ['output', 'Functional prototype + data notebook'],
      ],
      process: [
        'Survey of four commercial conductive TPU blends; select grade by printable resistance band.',
        'Design seven path geometries parameterized by tortuosity and branching index.',
        'Print at 0.2 mm layer height directly onto prewashed knit cotton.',
        'Cycle each specimen on Instron — log voltage drop at 10 Hz.',
        'Cluster response curves; identify two geometries suitable for wrist flexion.',
      ],
    },
    {
      id: 'fluidic',
      title: 'Monolithic Fluidic Computer',
      year: '2025',
      blurb: 'Pneumatic logic gates on a single PE membrane, formed by selective thermal welding. NOR as first primitive.',
      tags: ['fluidics', 'computation', 'fabrication'],
      figure: 'NOR gate pressure response; inputs A, B vs. output Y over 12 s.',
      body:
        'A soft computer built without discrete components — every channel, valve, and gate is welded from one continuous polyethylene membrane. The NOR primitive uses two normally-open gates sharing a common vent; logical completeness follows. Fabrication time per gate is under 90 seconds.',
      meta: [
        ['role', 'Fabrication lead'],
        ['context', 'Self-initiated · GSD lab'],
        ['tools', 'CO₂ laser welder · pressure regulator · Fusion 360'],
        ['output', 'Working NOR, AND, half-adder'],
      ],
      process: [
        'Characterize PE film weld strength vs. dwell time on a DOE grid.',
        'Design NOR geometry; verify in 2D flow solver.',
        'Weld prototype; truth-table sweep at 8, 12, 16 kPa.',
        'Cascade two NORs into half-adder; confirm carry bit.',
      ],
    },
    {
      id: 'elp',
      title: 'ELP Hygromorphic Actuator',
      year: '2024',
      blurb: 'Sequence-programmed bilayer films using elastin-like polypeptides; self-folding on humidity gradient. ACADIA track.',
      tags: ['biomaterials', 'actuation', 'acadia'],
      figure: 'Curvature κ(t) vs. relative humidity for three ELP sequence variants.',
      body:
        'A bilayer of ELP and a passive substrate, programmed by the amino-acid sequence rather than by geometry. Small changes in hydrophobic block length shift the transition temperature, which shifts where and when the film folds. The paper appeared in the ACADIA 2024 research track.',
      meta: [
        ['role', 'Co-author (materials + fabrication)'],
        ['context', 'ACADIA 2024'],
        ['tools', 'E. coli expression · spin coater · humidity chamber'],
        ['output', 'Peer-reviewed paper + artifact'],
      ],
      process: [
        'Clone three ELP sequences differing in VPGVG repeat length.',
        'Express, purify, and cast bilayer films at controlled RH.',
        'Image curvature response under 30→90% RH ramp.',
        'Fit simple Timoshenko model; compare to observed κ.',
      ],
    },
    {
      id: 'clay',
      title: 'Clay Brick Wall — Bidirectional HRI',
      year: '2024',
      blurb: 'YOLOv5 co-creation loop between a human mason and a 6-axis arm. Neither leads; both revise.',
      tags: ['hri', 'robotics', 'fabrication'],
      figure: 'Session timeline: human placements (dark) vs. robot placements (light).',
      body:
        'A wall is built brick by brick between a human and a robot arm. The robot reads the wall with YOLOv5 every placement, proposes a next move, and the human can accept, override, or reshape the brick in hand. The wall itself becomes the shared protocol.',
      meta: [
        ['role', 'Interaction design + ML'],
        ['context', 'GSD robotics studio'],
        ['tools', 'UR10 · YOLOv5 · ROS · clay'],
        ['output', 'Wall · paper draft'],
      ],
      process: [
        'Capture dataset of 1,200 brick placements under studio lighting.',
        'Fine-tune YOLOv5 on brick edges + finger occlusion.',
        'Build turn-taking state machine with override grace window.',
        'Run three two-hour sessions with different masons.',
      ],
    },
    {
      id: 'handshake',
      title: 'Handshake → Ceramic Tile',
      year: '2023',
      blurb: 'Arduino glove converts a handshake into toolpath; pressure + duration + wobble become a glazed ceramic tile.',
      tags: ['wearables', 'ceramics', 'data-physical'],
      figure: 'Three handshakes · three tiles. Axes: grip strength, duration, dominant frequency.',
      body:
        'Each handshake is one encounter; each tile is its record. The glove samples pressure at twelve points and fuses with IMU data; a mapping layer translates the signal into a parametric toolpath for a ceramic 3D-printer. No two tiles ever repeat.',
      meta: [
        ['role', 'Sole author'],
        ['context', 'RISD senior studio'],
        ['tools', 'Arduino Nano · FSR · Grasshopper · Potterbot'],
        ['output', '24 tiles · glove · documentation'],
      ],
      process: [
        'Design sensor glove; calibrate FSRs against known loads.',
        'Collect 30 handshakes across contexts (polite, reunion, negotiation).',
        'Author mapping in Grasshopper; print on Potterbot.',
        'Bisque, glaze, fire; photograph against grid.',
      ],
    },
    {
      id: 'chair',
      title: 'Branch-and-Connector Chair',
      year: '2023',
      blurb: 'Digital fabrication with found branches; connectors CNC-milled to each branch\'s measured geometry.',
      tags: ['fabrication', 'natural materials', 'furniture'],
      figure: 'Point cloud of branch-end → cylindrical connector envelope, per joint.',
      body:
        'Every branch is different — every connector is custom. Each forked limb is scanned, its end approximated as a cylinder with offset, and a matching wood connector is milled. The chair assembles in minutes without adhesive.',
      meta: [
        ['role', 'Sole author'],
        ['context', 'RISD · advanced ID'],
        ['tools', 'Structure Sensor · Grasshopper · 3-axis CNC'],
        ['output', 'Chair · connector library'],
      ],
      process: [
        'Harvest six branches after a windstorm; scan each end.',
        'Fit cylinder + offset; generate connector geometry.',
        'Batch-mill connectors from maple offcuts.',
        'Assemble chair; load test to 120 kg.',
      ],
    },
  ],
};

window.PORTFOLIO_DATA = PORTFOLIO_DATA;
