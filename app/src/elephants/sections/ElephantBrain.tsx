import { useState } from 'react'

/* ── Neuron distribution donut data ─────────────────────────── */
interface BrainRegion {
  id: string
  label: string
  neurons: number  // billions
  color: string
  note: string
}

const REGIONS: BrainRegion[] = [
  { id: 'cerebellum', label: 'Cerebellum',      neurons: 251.0, color: '#d4854a', note: '97.5% of all neurons — likely subserves trunk sensorimotor control, not cognition' },
  { id: 'cortex',     label: 'Cerebral cortex', neurons:   5.6, color: '#e8941a', note: '~1/3 of human cortical count (16.3B) despite 2× human cortical mass' },
  { id: 'other',      label: 'Other regions',   neurons:   0.4, color: '#c49a6c', note: 'Brainstem, basal ganglia, hippocampus (~36.6M), etc.' },
]

const TOTAL = REGIONS.reduce((s, r) => s + r.neurons, 0)

/* ── Donut SVG ──────────────────────────────────────────────── */
const CX = 100, CY = 100, R = 70, INNER = 40

function polarToXY(angleDeg: number, r: number) {
  const a = (angleDeg - 90) * Math.PI / 180
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

function describeArc(startDeg: number, endDeg: number, r: number, inner: number): string {
  const start = polarToXY(startDeg, r)
  const end = polarToXY(endDeg, r)
  const startI = polarToXY(startDeg, inner)
  const endI = polarToXY(endDeg, inner)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} L ${endI.x} ${endI.y} A ${inner} ${inner} 0 ${large} 0 ${startI.x} ${startI.y} Z`
}

/* ── Cross-species cortical neurons ─────────────────────────── */
interface SpecBrain {
  species: string
  corticalB: number
  color: string
  note: string
}

const SPECIES_BRAINS: SpecBrain[] = [
  { species: 'Human',       corticalB: 16.3,  color: '#ff6b54', note: 'Highest cortical neuron count per brain mass' },
  { species: 'Elephant',    corticalB:  5.6,  color: '#d4854a', note: '1/3 of human, despite 2× cortical mass' },
  { species: 'Chimp',       corticalB:  6.2,  color: '#b57bee', note: 'Comparable to elephant despite much smaller brain' },
  { species: 'Gorilla',     corticalB:  9.1,  color: '#8ae04a', note: 'Higher than elephant or chimp' },
  { species: 'Bottlenose',  corticalB:  5.8,  color: '#4afdc6', note: 'Similar to elephant; huge brain relative to body' },
  { species: 'Mouse',       corticalB:  0.014,color: '#ffb472', note: 'Small absolute count, but high neuron density' },
]

const MAX_CORTICAL = 16.3

/* ── Von Economo neurons ────────────────────────────────────── */
const VEN_ROWS = [
  { clade: 'Elephants',        location: 'Frontoinsular, anterior cingulate (ACC)', species: 'Both Loxodonta and Elephas', accent: '#d4854a' },
  { clade: 'Great apes',       location: 'ACC, anterior insula, SII',              species: 'Chimpanzee, gorilla, orangutan, human', accent: '#b57bee' },
  { clade: 'Cetaceans',        location: 'ACC, frontopolar cortex, insula',        species: 'Humpback, orca, fin whale, sperm whale, dolphin', accent: '#4afdc6' },
  { clade: 'Manatees',         location: 'Frontoinsular',                          species: 'Trichechus — another afrotherian!', accent: '#8ae04a' },
]

/* ── Trunk motor stats ──────────────────────────────────────── */
const TRUNK_STATS = [
  { label: 'Muscle fascicles', val: '~90,000', note: 'In the trunk (Longren et al. 2023)' },
  { label: 'Facial motor neurons', val: '54–63K', note: 'Asian 54K / African 63K (Kaufmann et al. 2022) — largest terrestrial mammal' },
  { label: 'Trigeminal neurons', val: '640–740K', note: 'Asian 640K / African 740K; organized in barrelette-like modules' },
  { label: 'Motor foveae', val: '2 types', note: 'African: two-finger pinch; Asian: wrap grasp — with giant distal neurons' },
]

export function ElephantBrain() {
  const [activeRegion, setActiveRegion] = useState<string>('cerebellum')

  const reg = REGIONS.find(r => r.id === activeRegion)!

  // Build donut segments
  let cumAngle = 0
  const segments = REGIONS.map(r => {
    const span = (r.neurons / TOTAL) * 360
    const seg = { ...r, startAngle: cumAngle, endAngle: cumAngle + span }
    cumAngle += span
    return seg
  })

  return (
    <div className="elephant-brain">
      <p className="elephant-eyebrow">Brain & Neurons</p>
      <h1 className="elephant-title">The Neuron-Count Paradox</h1>
      <p className="elephant-lede">
        The elephant brain is the largest on land (4.6 kg, 257 billion neurons — 3× human) but
        97.5% of those neurons are cerebellar. Only ~5.6 billion are cortical — one-third of
        the human count. Communicative and cognitive sophistication is decoupled from both
        total neuron count and cortical mass.
      </p>

      {/* Donut + cross-species bar */}
      <div className="elephant-brain-grid">
        <div>
          <h2 className="elephant-h2">Neuron Distribution</h2>
          <p className="elephant-sub">Click a segment to see interpretation.</p>
          <div className="elephant-brain-donut-wrap">
            <svg viewBox="0 0 200 200" className="elephant-brain-donut">
              {segments.map(s => (
                <path key={s.id}
                  d={describeArc(s.startAngle, s.endAngle, R, INNER)}
                  fill={activeRegion === s.id ? s.color : `color-mix(in oklch, ${s.color} 45%, transparent)`}
                  stroke="var(--elephant-earth)" strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'fill 0.15s' }}
                  onClick={() => setActiveRegion(s.id)}
                />
              ))}
              {/* Centre text */}
              <text x={CX} y={CY - 6} textAnchor="middle" fontSize="11" fontWeight="700"
                fill="var(--elephant)" fontFamily="var(--font-display)">257 B</text>
              <text x={CX} y={CY + 8} textAnchor="middle" fontSize="8"
                fill="var(--elephant-deep)" fontFamily="var(--font-sans)">total neurons</text>
            </svg>
            <div className="elephant-brain-donut-legend">
              {REGIONS.map(r => (
                <button key={r.id}
                  className={`elephant-brain-legend-item${activeRegion === r.id ? ' active' : ''}`}
                  onClick={() => setActiveRegion(r.id)}
                >
                  <span className="elephant-brain-legend-dot" style={{ background: r.color }} />
                  <span className="elephant-brain-legend-label">{r.label}</span>
                  <span className="elephant-brain-legend-val">{r.neurons}B</span>
                </button>
              ))}
            </div>
          </div>
          <div className="elephant-brain-region-note" style={{ borderColor: reg.color }}>
            <span style={{ color: reg.color }}>{reg.label}</span>
            <p>{reg.note}</p>
          </div>
        </div>

        <div>
          <h2 className="elephant-h2">Cortical Neurons Across Species</h2>
          <p className="elephant-sub">The paradox: elephant has chimp-level cortical neurons despite 3× larger brain.</p>
          <div className="elephant-brain-bars">
            {SPECIES_BRAINS.map(s => {
              const w = (s.corticalB / MAX_CORTICAL) * 100
              const isEl = s.species === 'Elephant'
              return (
                <div key={s.species} className="elephant-brain-bar-row">
                  <span className="elephant-brain-bar-species"
                    style={{ color: isEl ? s.color : 'var(--fg-muted)' }}>{s.species}</span>
                  <div className="elephant-brain-bar-track">
                    <div className="elephant-brain-bar-fill"
                      style={{ width: `${w}%`, background: isEl ? s.color : `color-mix(in oklch, ${s.color} 50%, transparent)` }} />
                  </div>
                  <span className="elephant-brain-bar-val"
                    style={{ color: isEl ? s.color : 'var(--fg-quiet)' }}>
                    {s.corticalB >= 1 ? `${s.corticalB}B` : `${Math.round(s.corticalB * 1000)}M`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Von Economo neurons */}
      <div>
        <h2 className="elephant-h2">Von Economo (Spindle) Neurons</h2>
        <p className="elephant-sub">
          Large, fast-signaling bipolar neurons in social-brain areas. Convergent across three
          mammalian clades — strong evidence for a large-brain, socially-complex niche
          hypothesis.
        </p>
        <div className="elephant-brain-ven">
          {VEN_ROWS.map(r => (
            <div key={r.clade} className="elephant-brain-ven-row" style={{ borderColor: r.accent }}>
              <span className="elephant-brain-ven-clade" style={{ color: r.accent }}>{r.clade}</span>
              <div className="elephant-brain-ven-info">
                <span>{r.location}</span>
                <span className="elephant-brain-ven-species">{r.species}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trunk motor */}
      <div>
        <h2 className="elephant-h2">Trunk — Motor Representation</h2>
        <p className="elephant-sub">
          The trunk contains more muscle fascicles than any other single organ and is
          innervated by the largest facial nucleus of any terrestrial mammal.
        </p>
        <div className="elephant-brain-trunk-stats">
          {TRUNK_STATS.map(s => (
            <div key={s.label} className="elephant-stat">
              <span className="elephant-stat-val">{s.val}</span>
              <span className="elephant-stat-unit">{s.label}</span>
              <span className="elephant-stat-label">{s.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="elephant-callout">
        <span className="elephant-callout-icon">🧠</span>
        <div>
          <strong>The cortical-neuron paradox:</strong> Elephants have twice the cortical mass
          of humans but one-third the cortical neurons. Bob Jacobs's work shows their cortical
          pyramidal neurons are very large with extensive dendritic branching — an alternative
          connectivity strategy: fewer, larger, more richly connected neurons rather than more
          densely packed small ones. This decouples neuron count from cognitive capacity
          and is a central caution for the entire series.
        </div>
      </div>
    </div>
  )
}
