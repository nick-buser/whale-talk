import { useState } from 'react'

// ── Node data ─────────────────────────────────────────────────────────────────

interface LNode {
  id: string
  label: string
  x: number; y: number; r: number
  color: string
  role: string
  sub: string
  body: string
  lesion: string
}

const NODES: LNode[] = [
  {
    id: 'hvc', label: 'HVC',
    x: 280, y: 65, r: 26,
    color: '#ddeeff',
    role: 'Timing & context signal to Area X',
    sub: 'Premotor clock — drives both motor and RL pathways',
    body: 'HVC projects simultaneously to RA (motor output) and to Area X via a distinct HVC(X) neuron population. These neurons fire in sparse bursts at specific song times, sending Area X a precise timing/context signal: "here is where we are in the sequence." Zhang et al. (2017) showed HVC cooling slows tempo AND increases sequence randomness — syntax and timing are co-localized in HVC.',
    lesion: 'Selective HVC(X) ablation (Sánchez-Valpuesta et al. 2019) cripples juvenile tutor imitation and degrades sequence consistency, while sparing adult crystallized song.',
  },
  {
    id: 'areax', label: 'Area X',
    x: 110, y: 210, r: 28,
    color: '#ffb472',
    role: 'The critic — integrates timing, efference copy, dopamine',
    sub: 'Song-specialized basal ganglia — critic in the actor-critic loop',
    body: 'Area X contains both striatal-like medium spiny neurons and pallidal-like neurons — a self-contained basal-ganglia microcircuit. It integrates three convergent signals: (1) timing/context from HVC, (2) an efference copy of LMAN\'s exploratory variation, (3) VTA dopamine carrying a reward-prediction-error signal. This lets Area X evaluate: "was today\'s LMAN variation better than expected?" FoxP2 is highly expressed in Area X; its level is activity-dependent — downregulated during active singing, which is required for plasticity (Heston & White 2015).',
    lesion: 'Area X lesions impair sequence learning in development; adults retain crystallized song but lose adult plasticity. Pharmacological dopamine-receptor blockade in Area X disrupts the correlation between song quality and subsequent motor change.',
  },
  {
    id: 'dlm', label: 'DLM',
    x: 178, y: 328, r: 22,
    color: '#ffb472',
    role: 'Thalamic relay — disinhibitory architecture',
    sub: 'Medial dorsolateral thalamus — AFP relay nucleus',
    body: 'DLM relays Area X output to LMAN via a disinhibitory (not excitatory) circuit: DLM neurons fire on release from Area X inhibition, inverting the signal. Luo, Ding & Perkel (2001) demonstrated DLM is part of a closed topographic loop essential for vocal learning, with the spatial map preserved through all three AFP relay stations. The disinhibitory architecture mirrors the mammalian basal-ganglia→thalamus relationship.',
    lesion: 'DLM lesions impair song learning in development. The topographic map from Area X through DLM to LMAN is disrupted, scrambling the spatial organization of the learning signal.',
  },
  {
    id: 'lman', label: 'LMAN',
    x: 280, y: 348, r: 26,
    color: '#ffb472',
    role: 'The actor — injects exploratory variability into RA',
    sub: 'Lateral magnocellular nucleus of the anterior nidopallium',
    body: 'LMAN is the AFP output nucleus and the "actor." During learning it injects exploratory noise into RA — small stochastic perturbations of motor output that probe motor space for better-sounding variants. LMAN sends an efference copy back to Area X, letting the critic evaluate which variations caused improvement. As learning progresses and HVC→RA synapses consolidate toward the tutor template, reliance on LMAN exploration decreases. In adult crystallized song LMAN maintains residual variability that enables seasonal re-learning in canaries.',
    lesion: 'LMAN lesions during development: abnormally stereotyped subsong, impaired learning. In adults: elimination of all residual variability, preventing seasonal plasticity.',
  },
  {
    id: 'ra', label: 'RA',
    x: 435, y: 258, r: 24,
    color: '#4afdc6',
    role: 'Motor pattern generator — HVC + LMAN convergence point',
    sub: 'Robust nucleus of the arcopallium — motor output hub',
    body: 'RA receives both deterministic HVC input (for production) and stochastic LMAN exploration (for learning). The balance shifts over development: early on LMAN dominates (high variability, subsong); as learning progresses HVC→RA synaptic weights strengthen toward the tutor template and LMAN\'s contribution decreases. Daliparthi et al. (2019) showed RA neurons transition from broad preparatory to precisely sequenced firing at song onset. Cooling RA does not change timing (Long & Fee 2008) — the motor pattern originates in HVC, and RA executes.',
    lesion: 'RA lesions eliminate song entirely. Cooling RA does not alter timing or sequence — unlike cooling HVC, which disrupts both.',
  },
  {
    id: 'vta', label: 'VTA / SNc',
    x: 448, y: 92, r: 26,
    color: '#ff6b54',
    role: 'Dopamine — reward-prediction-error signal',
    sub: 'Ventral tegmental area / substantia nigra pars compacta',
    body: 'VTA/SNc provide the dopaminergic input to Area X that carries a reward-prediction-error (RPE) signal: dopamine rises when the bird\'s own song sounds closer to the tutor template than expected. The auditory loop: song output → ears → auditory cortex → comparison with stored tutor template → dopamine release. Mackevicius & Fee (2018) describe this as the bird\'s own auditory evaluation driving a teaching signal through VTA to the critic. Serotonin from the raphe adds a second neuromodulatory channel to Area X.',
    lesion: 'Dopamine-receptor blockade in Area X (Sánchez-Valpuesta et al. 2019) disrupts the correlation between song quality improvement and subsequent motor adjustment.',
  },
]

// ── Edge paths (pre-computed) ─────────────────────────────────────────────────

const EDGES = [
  // AFP pathway
  { id: 'hvc-ax',    d: 'M 261,82 C 220,115 150,170 131,193',       color: '#ffb472', dash: undefined  },
  { id: 'ax-dlm',    d: 'M 124,236 L 166,308',                       color: '#ffb472', dash: undefined  },
  { id: 'dlm-lman',  d: 'M 200,333 L 256,344',                       color: '#ffb472', dash: undefined  },
  { id: 'lman-ra',   d: 'M 304,335 L 414,271',                       color: '#ffb472', dash: undefined  },
  // Efference copy — dashed loop back from LMAN to Area X
  { id: 'lman-ax',   d: 'M 261,366 C 170,392 108,318 110,238',       color: '#ffb472', dash: '6 4'      },
  // Dopamine — VTA to Area X
  { id: 'vta-ax',    d: 'M 423,101 C 350,52 210,82 137,200',         color: '#ff6b54', dash: undefined  },
  // Motor pathway — HVC to RA (faint, background reference)
  { id: 'hvc-ra',    d: 'M 297,87 C 380,140 442,190 420,240',        color: '#4afdc6', dash: '4 6'      },
]

// Arrowhead label positions (midpoints for edge labels)
const EDGE_LABELS = [
  { id: 'hvc-ax',   label: 'timing / context', x: 185, y: 130, color: '#ffb472' },
  { id: 'lman-ax',  label: 'efference copy',   x: 165, y: 392, color: '#ffb472' },
  { id: 'vta-ax',   label: 'dopamine (RPE)',    x: 268, y: 54,  color: '#ff6b54' },
  { id: 'hvc-ra',   label: 'motor (direct)',    x: 390, y: 148, color: '#4afdc6' },
]

// ── Sensitive period phases ───────────────────────────────────────────────────

const PHASES = [
  {
    id: 'memo', label: 'Memorization', days: '~0–20 d',
    color: '#7da6ff',
    body: 'The juvenile hears the tutor song and stores an auditory memory — the "template." HVC and auditory regions are active, but the AFP loop is not yet shaping motor output. Deafening before this phase prevents normal learning; deafening after it does not, showing the template is already stored.',
  },
  {
    id: 'sm', label: 'Sensorimotor', days: '~20–65 d',
    color: '#ffb472',
    body: 'The AFP loop runs at full power: LMAN injects exploratory variability into RA, Area X evaluates via the VTA reward signal, and successful variations are progressively consolidated into HVC→RA synapses. Song moves from plastic "subsong" toward a recognizable copy of the tutor template. FoxP2 expression in Area X is dynamically regulated, dipping when the bird sings and recovering when it doesn\'t.',
  },
  {
    id: 'crystal', label: 'Crystallization', days: '~65–90 d',
    color: '#4afdc6',
    body: 'Song stabilizes into a fixed "crystallized" adult form. HVC→RA drive dominates; LMAN\'s contribution shrinks. The AFP is no longer needed for maintenance, though it retains a residual role in adult plasticity. In canaries, seasonal song destabilization (spring) reactivates the AFP loop for partial re-learning each year.',
  },
]

// ── AFP loop SVG ──────────────────────────────────────────────────────────────

function AfpSVG({ selected, onSelect }: {
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <svg viewBox="0 0 560 410" width="100%" style={{ display: 'block' }}
         aria-label="AFP actor-critic reinforcement-learning loop">
      <defs>
        {(['afp', 'efference', 'dopamine', 'motor'] as const).map(t => (
          <marker key={t} id={`arr-${t}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z"
              fill={t === 'dopamine' ? '#ff6b54' : t === 'motor' ? '#4afdc6' : '#ffb472'}
              opacity={t === 'motor' ? 0.4 : 0.8}
            />
          </marker>
        ))}
      </defs>

      {/* Tutor template annotation */}
      <rect x={14} y={22} width={104} height={34} rx={6}
        fill="none" stroke="#b6c8df" strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.45} />
      <text x={66} y={37} textAnchor="middle" fill="#b6c8df" fontSize={10}
            fontFamily="IBM Plex Sans" opacity={0.55} fontWeight={600}>Tutor template</text>
      <text x={66} y={49} textAnchor="middle" fill="#b6c8df" fontSize={9}
            fontFamily="IBM Plex Mono" opacity={0.38}>(auditory memory)</text>
      {/* Tutor → VTA (auditory feedback loop) */}
      <path d="M 118,39 C 220,24 340,42 422,78"
        fill="none" stroke="#ff6b54" strokeWidth={1} strokeDasharray="3 4" strokeOpacity={0.4}
        markerEnd="url(#arr-dopamine)" />
      <text x={262} y={22} textAnchor="middle" fill="#ff6b54" fontSize={8}
            fontFamily="IBM Plex Sans" opacity={0.38}>auditory feedback</text>

      {/* Edges */}
      {EDGES.map(e => {
        const markerId = e.id === 'vta-ax' ? 'dopamine'
                       : e.id === 'hvc-ra' ? 'motor'
                       : e.id === 'lman-ax' ? 'efference'
                       : 'afp'
        return (
          <path key={e.id} d={e.d}
            fill="none"
            stroke={e.color}
            strokeWidth={1.5}
            strokeOpacity={e.id === 'hvc-ra' ? 0.3 : 0.6}
            strokeDasharray={e.dash}
            markerEnd={`url(#arr-${markerId})`}
          />
        )
      })}

      {/* Edge labels */}
      {EDGE_LABELS.map(l => (
        <text key={l.id} x={l.x} y={l.y} textAnchor="middle"
              fill={l.color} fontSize={9} fontFamily="IBM Plex Sans"
              opacity={0.6} style={{ pointerEvents: 'none' }}>
          {l.label}
        </text>
      ))}

      {/* Nodes — rendered in order so they paint over edges */}
      {NODES.map(n => {
        const isSel = selected === n.id
        return (
          <g key={n.id} style={{ cursor: 'pointer' }}
             onClick={() => onSelect(isSel ? null : n.id)}
             role="button" aria-label={n.label}>
            {isSel && <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none"
              stroke={n.color} strokeWidth={1.5} strokeOpacity={0.3} />}
            <circle cx={n.x} cy={n.y} r={n.r}
              fill={`color-mix(in oklch, ${n.color} ${isSel ? 28 : 12}%, transparent)`}
              stroke={n.color} strokeWidth={isSel ? 2 : 1.5}
              style={isSel ? { filter: `drop-shadow(0 0 8px ${n.color})` } : undefined}
            />
            <text x={n.x} y={n.y + 5} textAnchor="middle"
              fill={n.color} fontSize={n.label.length > 5 ? 10 : 13}
              fontFamily="IBM Plex Sans" fontWeight={700}
              style={{ pointerEvents: 'none', userSelect: 'none' }}>
              {n.label}
            </text>
          </g>
        )
      })}

      {/* Syrinx output label */}
      <text x={480} y={262} fill="#4afdc6" fontSize={11} fontFamily="IBM Plex Sans"
            opacity={0.5} style={{ pointerEvents: 'none' }}>→ Syrinx</text>

      {/* Legend */}
      <g transform="translate(14, 360)" style={{ pointerEvents: 'none' }}>
        {[
          { color: '#ffb472', label: 'AFP / RL loop', dash: undefined },
          { color: '#ffb472', label: 'Efference copy', dash: '5 3' },
          { color: '#ff6b54', label: 'Dopamine (RPE)', dash: undefined },
          { color: '#4afdc6', label: 'Motor pathway', dash: '4 5' },
        ].map((l, i) => (
          <g key={l.label} transform={`translate(${i * 130}, 0)`}>
            <line x1={0} y1={6} x2={22} y2={6} stroke={l.color} strokeWidth={1.5}
                  strokeDasharray={l.dash} strokeOpacity={0.75} />
            <text x={26} y={10} fill={l.color} fontSize={9} fontFamily="IBM Plex Sans" opacity={0.65}>
              {l.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function BirdLearning() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  const node = selectedNode ? NODES.find(n => n.id === selectedNode) : null
  const phase = selectedPhase ? PHASES.find(p => p.id === selectedPhase) : null

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Birds · Vocal Learning
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          The AFP Actor-Critic Loop
        </h2>
        <p className="lede" style={{ marginBottom: 40 }}>
          Songbirds learn by running a reinforcement-learning loop through specialized basal ganglia.
          LMAN explores, Area X evaluates using a dopamine reward signal, and successful variations
          are consolidated into HVC→RA synapses. Click any nucleus for its role.
        </p>

        {/* AFP diagram + info panel */}
        <div className="bird-syntax-grid">
          <div style={{ background: 'color-mix(in oklch, var(--surface-1) 40%, transparent)', border: '1px solid var(--line)', borderRadius: 12, padding: '4px 4px 0' }}>
            <AfpSVG selected={selectedNode} onSelect={setSelectedNode} />
          </div>

          <aside className="bird-syntax-panel">
            {node ? (
              <>
                <p className="bird-info-sub">{node.role}</p>
                <h3 className="bird-info-title" style={{ color: node.color }}>{node.label}</h3>
                <p className="bird-info-sub" style={{ marginBottom: 8 }}>{node.sub}</p>
                <p className="bird-info-body">{node.body}</p>
                {node.lesion && (
                  <div className="bird-info-lesion">
                    <span className="bird-info-lesion-label">Lesion / manipulation</span>
                    <p className="bird-info-lesion-text">{node.lesion}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="bird-info-sub" style={{ marginBottom: 10 }}>AFP Actor-Critic</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
                  The anterior forebrain pathway (HVC → Area X → DLM → LMAN → RA) implements
                  actor-critic reinforcement learning: LMAN explores motor space, Area X evaluates
                  against the tutor template via dopamine from VTA, and successful variations are
                  consolidated into the motor pathway.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-quiet)', marginTop: 12, fontStyle: 'italic' }}>
                  Click any nucleus to read its role.
                </p>
              </>
            )}
          </aside>
        </div>

        {/* Sensitive period timeline */}
        <div style={{ marginTop: 56 }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: 'var(--tr-label)', textTransform: 'uppercase', color: 'var(--fg-quiet)', marginBottom: 16 }}>
            Sensitive period — zebra finch (~65 days post-hatch)
          </p>
          <div style={{ display: 'flex', gap: 4 }}>
            {PHASES.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPhase(selectedPhase === p.id ? null : p.id)}
                style={{
                  flex: p.id === 'sm' ? 2 : 1,
                  padding: '12px 8px',
                  background: selectedPhase === p.id
                    ? `color-mix(in oklch, ${p.color} 18%, transparent)`
                    : 'color-mix(in oklch, var(--surface-1) 50%, transparent)',
                  border: `1px solid ${selectedPhase === p.id ? p.color : 'var(--line)'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: p.color, marginBottom: 2 }}>
                  {p.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-quiet)' }}>
                  {p.days}
                </div>
              </button>
            ))}
          </div>

          {phase && (
            <div style={{ marginTop: 12, padding: '16px 20px', background: `color-mix(in oklch, ${phase.color} 7%, transparent)`, border: `1px solid color-mix(in oklch, ${phase.color} 35%, transparent)`, borderRadius: 8 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, margin: 0 }}>
                {phase.body}
              </p>
            </div>
          )}
        </div>

        {/* FoxP2 callout */}
        <div className="bird-intro-callout" style={{ marginTop: 48 }}>
          <p className="bird-intro-callout-label">FoxP2 — the molecular bridge</p>
          <p>
            FoxP2 is highly expressed in Area X medium spiny neurons during the learning window.
            Knockdown before learning produces incomplete, abnormally variable imitation mirroring
            human FOXP2 developmental verbal dyspraxia (KE family). Crucially, both knockdown
            <em> and</em> overexpression impair learning — the precise FoxP2 level matters.
            Activity-dependent downregulation during singing is required for plasticity.
            Despite early framing as a "language gene," Atkinson et al. (2018) showed the
            human-specific selective-sweep signal was an artifact: FOXP2 is a conserved
            striatal motor-learning gene across mammals, with vocal-learner-specific regulatory
            specialization built on top.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '~65 d', label: 'Juvenile sensitive period in zebra finch — memorization through crystallization' },
            { val: '6',     label: 'Vocal-learning clades evolved independently: 3 bird groups + cetaceans, pinnipeds, bats, elephants, humans' },
            { val: 'O(1)',  label: 'AFP memory requirement — actor-critic RL with finite states, no recursion' },
          ].map(s => (
            <div key={s.label} className="stat-cell">
              <span className="stat-val" style={{ color: 'var(--krill)', fontFamily: 'var(--font-display)' }}>
                {s.val}
              </span>
              <span className="stat-label" style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
