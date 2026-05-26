/* ACT — BRAIN
   Comparing brains of the producer/comprehender of these signals.
   - Sperm whale: largest brain that has ever existed on Earth (~7.8 kg)
   - Bottlenose dolphin: highest EQ among non-humans
   - Human: reference
   Plus: spindle (von Economo) neurons in cetaceans, unihemispheric sleep.

   Visual approach: three brain silhouettes drawn to scale.
   A toggle lets the user switch between *actual scale* (where sperm
   whale dominates) and *normalised* (same width, for shape comparison). */

const BRAINS = [
  {
    id: 'human',
    name: 'Human',  latin: 'Homo sapiens',
    mass: 1.35,            // kg
    neurons: 86,           // billions, whole brain
    cortexNeurons: 16,     // billions in cortex
    EQ: 7.4,
    cortexArea: 2275,      // cm² unfolded
    length: 165,           // mm, longest axis
    height: 130,
    color: '#eef3fa',
    facts: [
      'Roughly 2 % of body mass; 20 % of resting energy use.',
      'Layered six-layer neocortex with strong layer IV.',
      'Sleep consolidates memory in both hemispheres simultaneously.',
    ],
  },
  {
    id: 'dolphin',
    name: 'Bottlenose dolphin',  latin: 'Tursiops truncatus',
    mass: 1.6,
    neurons: 37,
    cortexNeurons: 5.8,
    EQ: 5.3,
    cortexArea: 3745,
    length: 190,
    height: 140,
    color: '#c6ffe6',
    facts: [
      'Larger absolute cortical surface than a human.',
      'Five-layer cortex without a thick layer IV — a different wiring.',
      'Sleeps one hemisphere at a time. Always half-awake, always half-listening.',
    ],
  },
  {
    id: 'sperm',
    name: 'Sperm whale',  latin: 'Physeter macrocephalus',
    mass: 7.8,
    neurons: 22,
    cortexNeurons: 10.5,
    EQ: 0.58,
    cortexArea: 7400,
    length: 580,
    height: 340,
    color: '#4afdc6',
    facts: [
      'Largest brain that has ever evolved — heavier than a dinosaur\'s.',
      'EQ is low because body mass is enormous — but absolute cortex is huge.',
      'Auditory areas dominate the cortex; dedicated to processing click echoes.',
      'Contains von Economo neurons in higher density than humans in some regions.',
    ],
  },
];

/* ── Stylized lateral brain SVG.
   width/height in mm; we render at the supplied scale.
   Slightly different silhouettes per species. */
function BrainSvg({ b, scale = 1, highlighted, color, showAuditory = true }) {
  const W = b.length * scale + 36;
  const H = b.height * scale + 36;
  const cx = W / 2, cy = H / 2;
  // Build a brain-like outline. Different proportions per species.
  // Use ellipse + cerebellum bump + brainstem stub + cortical wrinkle paths.
  const a = b.length * scale / 2;   // semi-major
  const c = b.height * scale / 2;   // semi-minor

  // Cerebellum sits at posterior-bottom (right side, lower)
  const cbX = cx + a * 0.78;
  const cbY = cy + c * 0.38;
  // Brainstem stub
  const bsX = cx + a * 0.55;
  const bsY = cy + c * 0.95;
  // Frontal lobe bulge — left side
  const flX = cx - a * 0.95;

  // Generate sulci (wrinkles) as smooth bezier curves inside the ellipse
  const sulci = [];
  const speciesSeed = b.id === 'human' ? 1 : b.id === 'dolphin' ? 2 : 3;
  const sulciCount = b.id === 'sperm' ? 9 : b.id === 'dolphin' ? 7 : 6;
  for (let i = 0; i < sulciCount; i++) {
    // Distribute along angle around the ellipse
    const angle = -Math.PI / 2 + (i / sulciCount) * Math.PI * 1.2 + speciesSeed * 0.3;
    const r1 = 0.55 + (i % 3) * 0.05;
    const r2 = 0.78 + ((i+1) % 3) * 0.04;
    const x1 = cx + Math.cos(angle) * a * r1;
    const y1 = cy + Math.sin(angle) * c * r1;
    const x2 = cx + Math.cos(angle + 0.6) * a * r2;
    const y2 = cy + Math.sin(angle + 0.6) * c * r2;
    sulci.push({ x1, y1, x2, y2 });
  }

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
         style={{ display:'block', overflow:'visible' }}>
      <defs>
        <radialGradient id={`br-grad-${b.id}`} cx="0.4" cy="0.35">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.04"/>
        </radialGradient>
        {showAuditory && (
          <radialGradient id={`br-aud-${b.id}`} cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="#ffb472" stopOpacity={b.id === 'sperm' ? 0.55 : b.id === 'dolphin' ? 0.4 : 0.25}/>
            <stop offset="100%" stopColor="#ffb472" stopOpacity="0"/>
          </radialGradient>
        )}
      </defs>

      {/* Main cerebrum ellipse */}
      <ellipse cx={cx} cy={cy} rx={a} ry={c}
               fill={`url(#br-grad-${b.id})`}
               stroke={color} strokeOpacity={highlighted ? 0.95 : 0.55}
               strokeWidth={highlighted ? 1.6 : 1.1}
               style={{ filter: highlighted ? `drop-shadow(0 0 14px ${color})` : 'none',
                        transition: 'all 250ms var(--ease-glide)' }}/>

      {/* Auditory cortex emphasis blob (rough position — temporal lobe area) */}
      {showAuditory && (
        <ellipse cx={cx - a * 0.05} cy={cy + c * 0.25}
                 rx={a * (b.id === 'sperm' ? 0.5 : b.id === 'dolphin' ? 0.4 : 0.25)}
                 ry={c * (b.id === 'sperm' ? 0.4 : b.id === 'dolphin' ? 0.32 : 0.2)}
                 fill={`url(#br-aud-${b.id})`}/>
      )}

      {/* Cerebellum — small lobed bump */}
      <ellipse cx={cbX} cy={cbY} rx={a * 0.22} ry={c * 0.28}
               fill={`url(#br-grad-${b.id})`}
               stroke={color} strokeOpacity={highlighted ? 0.95 : 0.5}
               strokeWidth={highlighted ? 1.5 : 1}/>
      {/* fine sulci on cerebellum */}
      {[0.4, 0.6, 0.8].map(f => (
        <line key={f} x1={cbX - a*0.18} x2={cbX + a*0.18}
              y1={cbY - c*0.2 + c*0.4*f} y2={cbY - c*0.2 + c*0.4*f}
              stroke={color} strokeOpacity={0.35} strokeWidth={0.6}/>
      ))}

      {/* Brainstem stub */}
      <path d={`M ${cx + a*0.42} ${cy + c*0.85}
                 Q ${cx + a*0.5} ${cy + c*1.1}
                   ${cx + a*0.55} ${cy + c*1.25}`}
            fill="none" stroke={color} strokeOpacity={0.55} strokeWidth={1.2}/>

      {/* Sulci on cerebrum */}
      {sulci.map((s, i) => (
        <path key={i}
              d={`M ${s.x1} ${s.y1} Q ${(s.x1+s.x2)/2} ${(s.y1+s.y2)/2 - 6} ${s.x2} ${s.y2}`}
              fill="none" stroke={color}
              strokeOpacity={0.35}
              strokeWidth={0.7 + (i % 2) * 0.4}/>
      ))}

      {/* Scale indicator */}
      <g transform={`translate(${cx - a}, ${H - 14})`}>
        <line x1={0} x2={a*2} y1={0} y2={0} stroke="#5b82b8" strokeWidth={0.8}/>
        <line x1={0} x2={0} y1={-3} y2={3} stroke="#5b82b8" strokeWidth={0.8}/>
        <line x1={a*2} x2={a*2} y1={-3} y2={3} stroke="#5b82b8" strokeWidth={0.8}/>
        <text x={a} y={12} textAnchor="middle" fill="#5b82b8"
              fontFamily="IBM Plex Mono" fontSize="10">
          {b.length} mm
        </text>
      </g>
    </svg>
  );
}

function ActBrain() {
  const [actualScale, setActualScale] = useState(true);
  const [selected, setSelected] = useState('sperm');
  const sel = BRAINS.find(b => b.id === selected);

  // Compute scale: largest brain fits container width comfortably
  const maxLen = Math.max(...BRAINS.map(b => b.length));
  const containerW = 900;
  // In actual-scale mode, share the same px/mm for all three.
  const sharedScale = (containerW * 0.62) / maxLen;     // big brain gets ~62% of container
  // In normalized mode, each is sized so its length axis = 200 px.
  const normScale = (b) => 280 / b.length;

  return (
    <section id="brain" className="act" data-screen-label="10 Brain">
      <div className="col-xwide">
        <Eyebrow num={9}>The producer</Eyebrow>
        <h2>The largest brains that&nbsp;<span className="hl">have ever existed</span> live in the water.</h2>
        <p className="lede" style={{ maxWidth:'46ch' }}>
          Whatever is being said, it&apos;s being said by neural tissue we can barely fit our heads around.
          A sperm whale carries more brain than any animal that has ever lived — including the dinosaurs.
        </p>

        <div style={{ display:'flex', gap:8, alignItems:'center', marginTop: 28, marginBottom: 16 }}>
          <span className="mono small" style={{ color:'var(--shoal)' }}>VIEW</span>
          <Chip active={actualScale}  onClick={() => setActualScale(true)}>Actual scale</Chip>
          <Chip active={!actualScale} onClick={() => setActualScale(false)}>Equal size · shape only</Chip>
        </div>

        <div className="panel panel--lumen" style={{ padding: 28 }}>
          <span className="corner mono">FIG. 06 · cetacean encephala · lateral</span>
          <div style={{
            display:'flex', alignItems:'flex-end', justifyContent:'space-evenly',
            flexWrap:'wrap', gap: 24, padding: '32px 12px',
            minHeight: 360,
          }}>
            {BRAINS.map(b => {
              const scale = actualScale ? sharedScale : normScale(b);
              return (
                <div key={b.id}
                  onClick={() => setSelected(b.id)}
                  style={{
                    cursor:'pointer',
                    display:'flex', flexDirection:'column', alignItems:'center',
                    gap: 12,
                    opacity: selected === b.id ? 1 : 0.75,
                    transition: 'opacity 200ms',
                  }}>
                  <BrainSvg b={b} scale={scale} highlighted={selected === b.id} color={b.color}/>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily:'Newsreader', fontSize: selected === b.id ? 22 : 18,
                      color: b.color, fontStyle:'italic',
                      transition: 'all 200ms',
                      textShadow: selected === b.id ? `0 0 12px ${b.color}` : 'none',
                    }}>{b.name}</div>
                    <div style={{
                      fontFamily:'IBM Plex Mono', fontSize: 11,
                      color:'var(--shoal)', marginTop: 4, letterSpacing: '0.04em',
                    }}>{b.mass.toFixed(2)} kg · EQ {b.EQ}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="small" style={{ textAlign: 'center', color:'var(--mist)', marginTop: 8 }}>
            <span style={{ color: '#ffb472' }}>◌</span> orange wash marks auditory cortex emphasis (schematic).
          </div>
        </div>

        <div className="split-12-1" style={{ marginTop: 56, gap: 48 }}>
          <div>
            <div className="eyebrow" style={{ color: sel.color, marginBottom: 12 }}>
              <span className="rule" style={{ background: sel.color }}></span>
              <span>Selected · {sel.name}</span>
            </div>
            <p style={{ fontStyle:'italic', color:'var(--mist)', margin:'0 0 16' }}>{sel.latin}</p>
            <ul style={{ listStyle:'none', padding: 0, margin: 0 }}>
              {sel.facts.map((f, i) => (
                <li key={i} style={{
                  fontSize: 15, color:'var(--foam)',
                  borderTop: '1px solid var(--line)',
                  padding: '12px 0',
                  display: 'flex', gap: 12,
                }}>
                  <span style={{ color: sel.color, fontFamily:'var(--font-mono)', fontSize: 11, marginTop: 4 }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="specimen">
              <span className="latin">at a glance</span>
              <span className="name">{sel.name}</span>
              <div className="coord-row" style={{ flexDirection:'column', gap: 8, alignItems:'flex-start', marginTop: 8 }}>
                <span>MASS <span className="v">{sel.mass.toFixed(2)} kg</span></span>
                <span>LENGTH <span className="v">{sel.length} mm</span></span>
                <span>NEURONS <span className="v">{sel.neurons} bn (whole brain)</span></span>
                <span>CORTEX <span className="v">{sel.cortexNeurons} bn · {sel.cortexArea.toLocaleString()} cm²</span></span>
                <span>EQ <span className="v">{sel.EQ}</span></span>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <p className="small" style={{ color:'var(--shoal)' }}>
                <strong style={{ color:'var(--foam)' }}>EQ</strong> · encephalisation quotient. Brain mass relative to that predicted from body mass.
                Big-bodied whales score low even with huge brains.
              </p>
            </div>
          </div>
        </div>

        <div className="split-2" style={{ marginTop: 96 }}>
          <div>
            <h3 style={{ fontSize: 26 }}>Spindle neurons · the social circuit</h3>
            <p>
              Long projection neurons in the anterior cingulate cortex, first described in humans as <em>von Economo</em>
              cells, were thought to be a primate specialisation linked to rapid social judgement, empathy, and self-awareness.
              In 2006 they were found in humpback, fin, sperm, and beluga brains —
              in some regions, at <strong>higher</strong> density than in humans.
            </p>
            <p>
              Cetaceans split from the lineage that became us ~95 million years ago. These cells appear to have evolved twice.
              The simplest explanation: large-bodied, long-lived, social mammals need a particular kind of fast circuit. The deep ocean independently grew one.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 26 }}>Unihemispheric sleep · always half-listening</h3>
            <p>
              A whale that fully slept would drown. Cetaceans evolved <em>unihemispheric slow-wave sleep</em>: the two hemispheres
              take turns. One side&apos;s EEG goes to deep delta waves while the other stays alert. The opposite eye stays open.
            </p>
            <p>
              The consequence for communication is profound: a sperm whale or dolphin is, throughout its life, <em>continuously listening</em>.
              Every coda exchanged, every fragment of distant song, lands in a brain that has never fully gone offline.
              We listen in episodes. They listen the way we breathe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.ActBrain = ActBrain;
