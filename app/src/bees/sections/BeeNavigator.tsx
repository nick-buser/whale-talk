import { useState } from 'react'

/* ── Brain size comparison ──────────────────────────────────── */
interface BrainSpec {
  id: string
  species: string
  color: string
  neurons: number    // millions
  mass_mg: number    // brain mass mg
  navAbility: number // 0-1 subjective navigation performance
  label: string
}

const BRAINS: BrainSpec[] = [
  { id: 'bee',     species: 'Honeybee',      color: '#f4c430', neurons: 1,      mass_mg: 1,      navAbility: 0.82, label: '1 M neurons, 1 mg' },
  { id: 'ant',     species: 'Ant (Cataglyphis)',  color: '#8ae04a', neurons: 0.25,   mass_mg: 0.1,    navAbility: 0.72, label: '250K neurons, 0.1 mg' },
  { id: 'fly',     species: 'Fruit fly',     color: '#ffb472', neurons: 0.1,    mass_mg: 0.006,  navAbility: 0.35, label: '100K neurons, 0.006 mg' },
  { id: 'mouse',   species: 'Mouse',         color: '#b57bee', neurons: 71,     mass_mg: 420,    navAbility: 0.78, label: '71 M neurons, 420 mg' },
  { id: 'pigeon',  species: 'Pigeon',        color: '#4afdc6', neurons: 310,    mass_mg: 2200,   navAbility: 0.90, label: '310 M neurons, 2.2 g' },
  { id: 'human',   species: 'Human',         color: '#ff6b54', neurons: 86000,  mass_mg: 1400000, navAbility: 0.99, label: '86 B neurons, 1.4 kg' },
]

/* ── Navigation capabilities ─────────────────────────────────── */
interface NavCap {
  id: string
  name: string
  evidence: string
  year: string
  accent: string
  bullets: string[]
}

const NAV_CAPS: NavCap[] = [
  {
    id: 'path-int',
    name: 'Path integration',
    evidence: 'Wittlinger et al. 2006 (stilt & stumps experiment)',
    year: '2006',
    accent: '#f4c430',
    bullets: [
      'Cataglyphis ants run home in a straight line after tortuous outward path — up to 140 m.',
      'Step-count manipulation (stilts/stumps on legs) shifts home estimate by exactly predicted distance.',
      'Honeybees also path-integrate, supplemented by landmark learning.',
      'No GPS, no map — pure optic-flow + step-count integration.',
    ],
  },
  {
    id: 'place-cells',
    name: 'Allocentric spatial representation',
    evidence: 'Menzel et al. 2005 (radar tracking); Bhalla 2019 (review)',
    year: '2005',
    accent: '#e8941a',
    bullets: [
      'Radar-tracked bees displaced from known sites fly to correct goal via shortcuts never used before.',
      'Implies a global vector map, not just a chain of beacons.',
      'Mushroom body circuits proposed as substrate — analogous to hippocampal map neurons.',
      'Functional "place fields" confirmed in 2020s calcium imaging of bee brain.',
    ],
  },
  {
    id: 'spatial-wm',
    name: 'Spatial working memory',
    evidence: 'Zhang et al. 2005; Giurfa et al. 2001',
    year: '2001',
    accent: '#ffb472',
    bullets: [
      'Bees solve delayed-match-to-sample for colours and orientations — abstract WM not tied to spatial coordinates.',
      'Giurfa 2001: bees learn "same" and "different" — abstract categorical concepts.',
      'Working memory span: ~5 seconds. Comparable to many vertebrates.',
      'Bilateral mushroom body lobes host short-term memory trace.',
    ],
  },
  {
    id: 'numerical',
    name: 'Numerical ordinal sense',
    evidence: 'Howard et al. 2018, 2019 (RMIT group)',
    year: '2018',
    accent: '#8ae04a',
    bullets: [
      'Bees trained to "left of" or "right of" a quantity transferred to novel quantities — ordinal number sense.',
      'Howard et al. 2019: bees spontaneously placed "zero" as less than one when shown empty displays — a zero concept.',
      'Counting up to 4–5 items reliably in sequential paradigms.',
      'Not language-mediated: demonstrates abstract numerical cognition in a 1 mg brain.',
    ],
  },
  {
    id: 'vector-nav',
    name: 'Vector navigation & landmark integration',
    evidence: 'Collett & Collett 2002 (review); Chittka & Niven 2009',
    year: '2002',
    accent: '#4afdc6',
    bullets: [
      'Bees combine multiple landmark vectors, updating estimate when landmarks are perturbed.',
      'Configural memory: pattern of landmarks stored as a whole, not as individual features.',
      'Conflict experiments show priority weighting: compass > odometric > landmark.',
      'Novel shortcut flight after initial training routes — strong evidence for cognitive map.',
    ],
  },
]

/* ── Mushroom body stats ─────────────────────────────────────── */
const MB_STATS = [
  { label: 'Kenyon cells', val: '170,000', note: 'per mushroom body lobe' },
  { label: 'Input channels', val: '~800', note: 'olfactory projection neurons' },
  { label: 'Output neurons', val: '~400', note: 'per lobe' },
  { label: 'Calyx size', val: '14×', note: 'larger in foragers vs. nurse bees' },
  { label: '% of brain volume', val: '~17%', note: 'vs. 5% in most insects' },
]

/* ── Scatter: neurons vs. nav ability ──────────────────────────── */
const VB2 = '0 0 440 260'
const L2 = 70, R2 = 410, T2 = 20, B2 = 225

function sx2(v: number) {
  // log scale: 0.1M = 0, 86000M = 1
  return L2 + (Math.log10(v) - Math.log10(0.1)) / (Math.log10(86000) - Math.log10(0.1)) * (R2 - L2)
}
function sy2(v: number) { return B2 - v * (B2 - T2) }

export function BeeNavigator() {
  const [activeCap, setActiveCap] = useState<string>('path-int')
  const [hoverBrain, setHoverBrain] = useState<string | null>(null)

  const cap = NAV_CAPS.find(c => c.id === activeCap)!

  return (
    <div className="bee-nav">
      <p className="bee-intro-eyebrow">Navigation</p>
      <h1 className="bee-intro-title">Million-Neuron Navigator</h1>
      <p className="bee-intro-lede">
        One million neurons — 0.0002% of a human brain — support path integration, allocentric
        spatial maps, working memory, abstract numerical sense, and vector navigation. The
        mushroom body calyx is 14× larger in experienced foragers than nurse bees, showing
        that navigation ability is experience-dependent even in insects.
      </p>

      {/* Brain size scatter */}
      <div>
        <h2 className="bee-section-h2">Neurons vs. Navigation Ability</h2>
        <p className="bee-intro-sub">
          Log-scale x-axis. Bees achieve near-mouse-level navigation with 70× fewer neurons.
          Hover a point.
        </p>
        <svg viewBox={VB2} className="bee-nav-scatter" aria-label="Neurons vs navigation ability">
          <rect width="440" height="260" fill="var(--bee-cell)" rx="4" />
          {/* Axis labels */}
          <text x={(L2 + R2) / 2} y={B2 + 22} textAnchor="middle"
            fontSize="9" fill="var(--bee-deep)" fontFamily="var(--font-sans)">NEURON COUNT (log scale) →</text>
          <text x={L2 - 52} y={(T2 + B2) / 2} textAnchor="middle"
            fontSize="9" fill="var(--bee-deep)" fontFamily="var(--font-sans)"
            transform={`rotate(-90 ${L2 - 52} ${(T2 + B2) / 2})`}>NAVIGATION ABILITY →</text>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(v => (
            <line key={v} x1={L2} y1={sy2(v)} x2={R2} y2={sy2(v)}
              stroke="var(--bee-wall)" strokeWidth="1" strokeDasharray="3 3" />
          ))}
          {/* Points */}
          {BRAINS.map(b => {
            const cx = sx2(b.neurons)
            const cy = sy2(b.navAbility)
            const isHover = hoverBrain === b.id
            return (
              <g key={b.id}
                onMouseEnter={() => setHoverBrain(b.id)}
                onMouseLeave={() => setHoverBrain(null)}
                style={{ cursor: 'default' }}
              >
                <circle cx={cx} cy={cy} r={isHover ? 9 : 7}
                  fill={isHover ? b.color : 'transparent'}
                  stroke={b.color} strokeWidth="2" />
                <text
                  x={cx + (b.id === 'human' ? -10 : 10)}
                  y={cy + (b.id === 'fly' ? -10 : b.id === 'ant' ? 16 : 4)}
                  textAnchor={b.id === 'human' ? 'end' : 'start'}
                  fontSize={isHover ? '11' : '10'}
                  fill={isHover ? b.color : `color-mix(in oklch, ${b.color} 65%, var(--fg-muted))`}
                  fontFamily="var(--font-sans)"
                  fontWeight={isHover ? '600' : '400'}
                >
                  {b.species}
                </text>
              </g>
            )
          })}
          {/* Hover label */}
          {hoverBrain && (() => {
            const b = BRAINS.find(x => x.id === hoverBrain)!
            return (
              <text x={L2 + 4} y={T2 + 14}
                fontSize="10" fill={b.color} fontFamily="var(--font-mono)">{b.label}</text>
            )
          })()}
        </svg>
      </div>

      {/* Navigation capabilities */}
      <div>
        <h2 className="bee-section-h2">Navigation Capabilities</h2>
        <div className="bee-nav-tabs">
          {NAV_CAPS.map(c => (
            <button
              key={c.id}
              className={`bee-nav-tab${activeCap === c.id ? ' active' : ''}`}
              style={{ '--nav-color': c.accent } as React.CSSProperties}
              onClick={() => setActiveCap(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="bee-nav-cap-panel" style={{ borderColor: cap.accent }}>
          <div className="bee-nav-cap-head">
            <span className="bee-nav-cap-name" style={{ color: cap.accent }}>{cap.name}</span>
            <span className="bee-nav-cap-ref">{cap.evidence}</span>
          </div>
          <ul className="bee-nav-cap-list">
            {cap.bullets.map((b, i) => (
              <li key={i} className="bee-nav-cap-item">{b}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mushroom body stats */}
      <div>
        <h2 className="bee-section-h2">Mushroom Body — The Navigation Engine</h2>
        <p className="bee-intro-sub">
          The mushroom bodies are the insect analogue of the mammalian hippocampus — multi-modal
          integration, associative learning, and spatial memory all converge here.
        </p>
        <div className="bee-nav-mb-stats">
          {MB_STATS.map(s => (
            <div key={s.label} className="bee-nav-mb-stat">
              <span className="bee-nav-mb-val">{s.val}</span>
              <span className="bee-nav-mb-label">{s.label}</span>
              <span className="bee-nav-mb-note">{s.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bee vs robotics callout */}
      <div className="bee-intro-callout">
        <span className="bee-intro-callout-icon">⬡</span>
        <div>
          <strong>Against the robotics baseline:</strong> A honeybee navigating a 10 km round
          trip, integrating path vectors, correcting for wind, and returning to a sub-meter
          goal uses 1 mg of brain tissue. A comparable autonomous aerial vehicle requires
          kilograms of silicon and still fails in novel environments. The gap is in adaptive
          transfer, not raw computation — bees solve the binding problem (integrating modalities
          from smell to vision to vibration) in a neural architecture that took ~80 million
          years to optimize.
        </div>
      </div>
    </div>
  )
}
