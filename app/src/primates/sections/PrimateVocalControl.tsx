import { useState } from 'react'

// ── Node data ─────────────────────────────────────────────────────────────────

interface VNode {
  id: string
  label: string
  x: number; y: number; r: number
  color: string
  humanOnly: boolean
  role: string
  sub: string
  body: string
  species: string
}

const NODES: VNode[] = [
  {
    id: 'acc', label: 'ACC',
    x: 100, y: 80, r: 26,
    color: '#ffb472',
    humanOnly: false,
    role: 'Volitional suppression of involuntary vocalizations',
    sub: 'Anterior cingulate cortex — all primates',
    species: 'All primates',
    body: 'The ACC exerts top-down inhibitory control over the PAG, allowing primates to suppress vocalizations in social contexts where silence is adaptive. Jürgens (2002) showed that ACC lesions impair voluntary suppression without eliminating conditioned or spontaneous vocalizations — the involuntary pathway through PAG remains intact. This is the primate elaboration of executive vocal control, present even in monkeys.',
  },
  {
    id: 'vlpfc', label: 'vlPFC',
    x: 280, y: 80, r: 26,
    color: '#ffb472',
    humanOnly: false,
    role: 'Call-planning neurons — fire before self-initiated vocalizations',
    sub: 'Ventrolateral prefrontal cortex — primates',
    species: 'Primates (Hage & Nieder 2013)',
    body: 'Single-unit recordings in marmosets (Hage & Nieder, Nature Neuroscience 2013) revealed a population of vlPFC neurons that fire ~200–300 ms before self-initiated vocalizations — anticipatory activity that distinguishes voluntary from conditioned calls. These neurons do not fire before reactive/involuntary calls, indicating a volitional premotor signal. This is the strongest evidence for prefrontal call-planning in non-human primates. However, these neurons still operate through PAG — there is no direct cortex→larynx pathway here.',
  },
  {
    id: 'lmc', label: 'LMC',
    x: 460, y: 80, r: 26,
    color: '#ff6b54',
    humanOnly: true,
    role: 'Direct corticobulbar projection to nucleus ambiguus — humans only',
    sub: 'Laryngeal motor cortex — humans (absent in Old World monkeys)',
    species: 'Humans',
    body: 'The LMC, located in the primary motor cortex face area, sends a direct corticobulbar projection to the nucleus ambiguus — the brainstem nucleus controlling laryngeal muscles. This direct pathway is absent in Old World monkeys (Kuypers 1958; Jürgens 2002). It is this connection that enables the fine voluntary articulatory control required for learned speech: the cortex can now precisely time and shape individual phonemes, bypassing the coarser affective PAG pathway. Without it, even extensive training cannot produce speech-like articulation.',
  },
  {
    id: 'pag', label: 'PAG',
    x: 280, y: 230, r: 28,
    color: '#ffb472',
    humanOnly: false,
    role: 'Obligate gateway for affective vocalization in all mammals',
    sub: 'Periaqueductal gray — all mammals',
    species: 'All mammals',
    body: 'The PAG is the indispensable relay for emotionally driven vocalization in all mammals. PAG stimulation in cats, monkeys, and humans produces species-typical calls; PAG lesions abolish all spontaneous vocalization. Every non-human primate vocal output — whether conditioned, communicative, or purely affective — is gated through PAG. The primate cortex (ACC, vlPFC) modulates PAG but cannot bypass it. Jürgens (2002) described PAG as the "obligate gateway" precisely because the primate cortex controls the switch but not the output channel directly.',
  },
  {
    id: 'namb', label: 'NAmb',
    x: 280, y: 370, r: 24,
    color: '#4afdc6',
    humanOnly: false,
    role: 'Final common pathway — laryngeal motor output',
    sub: 'Nucleus ambiguus — all vertebrates',
    species: 'All vertebrates',
    body: 'The nucleus ambiguus contains the motor neurons whose axons innervate the laryngeal muscles. It is the point where neural commands become sound. In non-human primates, input arrives exclusively via PAG (indirect/affective route). In humans, a second direct input from LMC arrives — this is the anatomical innovation that separates human vocal flexibility from all other primates. The presence of two converging input routes to NAmb means the human larynx can be controlled both affectively (PAG pathway, for laughing, crying) and precisely (LMC pathway, for speech).',
  },
]

// ── Edge paths ────────────────────────────────────────────────────────────────

const EDGES = [
  { id: 'acc-pag',    d: 'M 116,96  C 140,162 218,218 264,228',         color: '#ffb472', dash: undefined },
  { id: 'vlpfc-pag',  d: 'M 280,106 L 280,202',                          color: '#ffb472', dash: undefined },
  { id: 'lmc-namb',   d: 'M 452,104 C 510,230 390,370 304,370',          color: '#ff6b54', dash: undefined },
  { id: 'lmc-pag',    d: 'M 444,96  C 386,162 328,220 308,228',          color: '#ff6b54', dash: '5 4'    },
  { id: 'pag-namb',   d: 'M 280,258 L 280,346',                          color: '#ffb472', dash: undefined },
]

// ── Secondary content ─────────────────────────────────────────────────────────

const SECONDARY = [
  {
    id: 'arcuate',
    title: 'Arcuate Fasciculus: Temporal Expansion',
    color: '#7da6ff',
    body: 'Rilling et al. (2008, Nature Neuroscience) compared the arcuate fasciculus — the white matter tract connecting temporal (auditory) and frontal (premotor) cortices — across macaques, chimpanzees, and humans. The human arcuate has a massively expanded temporal component, projecting into superior and middle temporal gyri (STG/MTG). In macaques the tract barely reaches the temporal lobe; in chimpanzees it is intermediate. This expansion is thought to support the tight auditory-motor integration required for vocal imitation and speech — a substrate that non-human primates lack.',
    finding: 'Temporal expansion unique to humans',
  },
  {
    id: 'hage-nieder',
    title: 'vlPFC: Anticipatory Vocal Neurons',
    color: '#4afdc6',
    body: 'Hage & Nieder (2013) recorded single units in the ventrolateral prefrontal cortex of marmosets during spontaneous and conditioned vocalizations. A subset of neurons showed anticipatory firing 200–300 ms before self-initiated calls — a pre-vocal signal absent before reactive calls. This is the clearest neurophysiological evidence for a volitional component in non-human primate vocalization. The neurons project to PAG, not directly to laryngeal motor neurons, placing their control within the primate (not human) range.',
    finding: '200–300 ms anticipatory firing in vlPFC',
  },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function PrimateVocalControl() {
  const [selected, setSelected] = useState<string | null>('lmc')
  const [expanded, setExpanded] = useState<string | null>(null)

  const sel = NODES.find(n => n.id === selected)

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Primates · Vocal Control
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          The Neural Gap
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          A single missing projection separates primate vocal learning from human speech: the direct
          laryngeal motor cortex → nucleus ambiguus pathway. All primate vocal output — however
          volitional — passes through PAG. Click any node to explore its role and species range.
        </p>

        {/* Circuit diagram + panel */}
        <div className="bird-syntax-grid">
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '4px 4px 0', background: 'color-mix(in oklch, var(--surface-1) 40%, transparent)', overflow: 'hidden' }}>
            <svg viewBox="0 0 560 420" width="100%" style={{ display: 'block' }}
                 aria-label="Primate vocal control circuit diagram">
              <defs>
                <marker id="arrow-orange" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#ffb472" opacity={0.8} />
                </marker>
                <marker id="arrow-coral" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#ff6b54" opacity={0.9} />
                </marker>
              </defs>

              {/* Row labels */}
              <text x={12} y={85} fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono"
                    opacity={0.45} textAnchor="start">CORTEX</text>
              <text x={12} y={235} fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono"
                    opacity={0.45} textAnchor="start">BRAINSTEM</text>
              <text x={12} y={375} fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono"
                    opacity={0.45} textAnchor="start">MOTOR</text>

              {/* Horizontal dividers */}
              <line x1={60} y1={135} x2={530} y2={135} stroke="#b6c8df" strokeOpacity={0.08} strokeWidth={1} />
              <line x1={60} y1={290} x2={530} y2={290} stroke="#b6c8df" strokeOpacity={0.08} strokeWidth={1} />

              {/* Edges — drawn before nodes so nodes sit on top */}
              {EDGES.map(e => (
                <path key={e.id} d={e.d} fill="none"
                      stroke={e.color} strokeWidth={1.8}
                      strokeOpacity={0.7}
                      strokeDasharray={e.dash}
                      markerEnd={e.color === '#ff6b54' ? 'url(#arrow-coral)' : 'url(#arrow-orange)'}
                />
              ))}

              {/* "Human only" label for LMC edge */}
              <text x={498} y={192} fill="#ff6b54" fontSize={9} fontFamily="IBM Plex Mono"
                    opacity={0.7} textAnchor="middle">direct</text>
              <text x={498} y={203} fill="#ff6b54" fontSize={9} fontFamily="IBM Plex Mono"
                    opacity={0.7} textAnchor="middle">(human)</text>

              {/* Nodes — rendered last so they sit on top of edges */}
              {NODES.map(n => {
                const isSel = selected === n.id
                return (
                  <g key={n.id} style={{ cursor: 'pointer' }}
                     onClick={() => setSelected(isSel ? null : n.id)}
                     role="button" aria-label={n.label}>
                    {/* Human-only dashed ring */}
                    {n.humanOnly && (
                      <circle cx={n.x} cy={n.y} r={n.r + 8} fill="none"
                              stroke={n.color} strokeWidth={1} strokeOpacity={0.35}
                              strokeDasharray="4 3" />
                    )}
                    {/* Selection glow */}
                    {isSel && (
                      <circle cx={n.x} cy={n.y} r={n.r + 5} fill="none"
                              stroke={n.color} strokeWidth={1.5} strokeOpacity={0.4} />
                    )}
                    {/* Node circle */}
                    <circle cx={n.x} cy={n.y} r={n.r}
                      fill={`color-mix(in oklch, ${n.color} ${isSel ? 28 : 14}%, transparent)`}
                      stroke={n.color}
                      strokeWidth={isSel ? 2 : 1.5}
                      style={isSel ? { filter: `drop-shadow(0 0 8px ${n.color})` } : undefined}
                    />
                    {/* Label */}
                    <text x={n.x} y={n.y + 5} textAnchor="middle" fill={n.color}
                          fontSize={12} fontFamily="IBM Plex Mono" fontWeight={700}>
                      {n.label}
                    </text>
                    {/* Species sub-label */}
                    <text x={n.x} y={n.y + n.r + 14} textAnchor="middle" fill={n.color}
                          fontSize={9} fontFamily="IBM Plex Sans" opacity={0.6}>
                      {n.humanOnly ? 'human only' : n.species === 'All mammals' ? 'all mammals' : n.species === 'All vertebrates' ? 'all vertebrates' : 'primates'}
                    </text>
                  </g>
                )
              })}

              {/* Vocalization output arrow */}
              <line x1={280} y1={396} x2={280} y2={410} stroke="#4afdc6" strokeOpacity={0.4}
                    strokeWidth={1.5} markerEnd="url(#arrow-orange)" />
              <text x={280} y={420} textAnchor="middle" fill="#4afdc6" fontSize={9}
                    fontFamily="IBM Plex Mono" opacity={0.45}>voice</text>
            </svg>
          </div>

          {/* Node detail panel */}
          <aside className="bird-syntax-panel">
            {sel ? (
              <>
                <span className="bird-syntax-badge" style={{
                  color: sel.color,
                  borderColor: `color-mix(in oklch, ${sel.color} 40%, transparent)`,
                  background: `color-mix(in oklch, ${sel.color} 8%, transparent)`,
                }}>
                  {sel.humanOnly ? 'Human only' : sel.species}
                </span>
                <h3 className="bird-info-title" style={{ color: sel.color, marginTop: 14 }}>
                  {sel.label} — {sel.sub.split(' — ')[0]}
                </h3>
                <p className="bird-info-sub" style={{ marginBottom: 8 }}>{sel.role}</p>
                <p className="bird-info-body">{sel.body}</p>
              </>
            ) : (
              <>
                <p className="bird-info-sub" style={{ marginBottom: 10 }}>Dual-pathway model</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, margin: '0 0 12px' }}>
                  Orange = primate/mammal pathway through PAG. Coral = human-specific direct LMC→NAmb projection.
                  Dashed coral = weak/indirect cortical modulation in non-human primates.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-quiet)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  Click any node to read its function and species distribution.
                </p>
              </>
            )}
          </aside>
        </div>

        {/* Secondary items */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg)', margin: '52px 0 20px' }}>
          Two Supporting Findings
        </h3>

        <div className="primate-secondary-grid">
          {SECONDARY.map(item => (
            <div
              key={item.id}
              className={`primate-secondary-card${expanded === item.id ? ' open' : ''}`}
              style={{ '--item-color': item.color } as React.CSSProperties}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              role="button"
              aria-expanded={expanded === item.id}
            >
              <div className="primate-secondary-header">
                <span className="primate-secondary-title" style={{ color: item.color }}>{item.title}</span>
                <span className="primate-secondary-finding">{item.finding}</span>
              </div>
              {expanded === item.id && (
                <p className="primate-secondary-body">{item.body}</p>
              )}
            </div>
          ))}
        </div>

        {/* FOXP2 callout */}
        <div className="bird-intro-callout" style={{ marginTop: 40 }}>
          <p className="bird-intro-callout-label">FOXP2 — retraction note</p>
          <p>
            FOXP2 was once called "the language gene" after its disruption in the KE family caused
            severe speech and language disorder. A selective-sweep signal in humans was cited as
            evidence for recent selection. Atkinson et al. (2018, Cell) showed the sweep signal was
            an artifact of ancient population structure — not a language-specific selective event.
            FOXP2 is a conserved striatal motor-learning gene expressed in vocal learners across
            birds, bats, and humans. Important, but not a language gene.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '200ms', label: 'vlPFC anticipatory lead time before self-initiated vocalizations (Hage & Nieder 2013)' },
            { val: '1',     label: 'Missing projection separating primate vocal control from human speech: LMC → nucleus ambiguus' },
            { val: '2008',  label: 'Rilling et al. — human arcuate fasciculus temporal expansion identified in comparative DTI' },
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
