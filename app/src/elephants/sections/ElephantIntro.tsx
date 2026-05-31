import { useState } from 'react'

/* ── Scatter: design space ──────────────────────────────────── */
type Species = 'elephants' | 'humans' | 'dolphins' | 'songbirds' | 'parrots' | 'bees' | 'primates'

interface ScatterPoint {
  id: Species
  label: string
  sx: number   // syntactic complexity
  sy: number   // reference / semantics
  color: string
  r: number
  offset: { dx: number; dy: number; anchor: string }
}

const VB = '0 0 560 400'
const L = 64, R = 530, T = 30, B = 365

function sx(v: number) { return L + v * (R - L) }
function sy(v: number) { return B - v * (B - T) }

const POINTS: ScatterPoint[] = [
  { id: 'elephants', label: 'Elephants', sx: 0.14, sy: 0.80, color: '#d4854a', r: 10, offset: { dx: 14, dy: 4,   anchor: 'start' } },
  { id: 'humans',    label: 'Humans',    sx: 0.96, sy: 0.95, color: '#ff6b54', r: 11, offset: { dx: -14, dy: -14, anchor: 'end' } },
  { id: 'dolphins',  label: 'Cetaceans', sx: 0.50, sy: 0.18, color: '#4afdc6', r: 8,  offset: { dx: 12, dy: -12, anchor: 'start' } },
  { id: 'songbirds', label: 'Songbirds', sx: 0.78, sy: 0.06, color: '#ffb472', r: 8,  offset: { dx: -12, dy: -12, anchor: 'end' } },
  { id: 'parrots',   label: 'Parrots',   sx: 0.58, sy: 0.44, color: '#8ae04a', r: 8,  offset: { dx: 14, dy: -10, anchor: 'start' } },
  { id: 'bees',      label: 'Bees',      sx: 0.08, sy: 0.85, color: '#f4c430', r: 8,  offset: { dx: -12, dy: 14, anchor: 'end' } },
  { id: 'primates',  label: 'Primates',  sx: 0.18, sy: 0.62, color: '#b57bee', r: 8,  offset: { dx: 14, dy: 4,   anchor: 'start' } },
]

/* ── Stats ──────────────────────────────────────────────────── */
const STATS = [
  { value: '4.6 kg',  unit: 'brain mass',  label: 'largest terrestrial brain' },
  { value: '257 B',   unit: 'neurons',      label: 'total — but 97.5% cerebellar' },
  { value: '~100',    unit: 'individuals',  label: 'recognized by females' },
  { value: '~2,000',  unit: 'OR genes',     label: 'largest olfactory repertoire' },
]

/* ── Convergence table ──────────────────────────────────────── */
interface ConvRow {
  trait: string
  elephants: string
  cetaceans: string
  primates: string
  shared: boolean
}

const CONVERGENCE: ConvRow[] = [
  { trait: 'Large brain',             elephants: '4.6 kg, 5.6B cortical neurons', cetaceans: 'Up to 9 kg (sperm whale)',     primates: '1.4 kg (human)', shared: true },
  { trait: 'Long lifespan',           elephants: '60–70 years',                   cetaceans: '60–100 years (killer whale)',  primates: '~50 years (chimp)', shared: true },
  { trait: 'Fission–fusion society',  elephants: 'Matrilineal herds, 5–50+',      cetaceans: 'Pods, clans up to hundreds',  primates: 'Community fission', shared: true },
  { trait: 'Matriarch as repository', elephants: 'McComb et al. 2001',            cetaceans: 'KW post-rep. matriarchs',     primates: 'Limited evidence', shared: true },
  { trait: 'Vocal production learning', elephants: 'Koshik, Mlaika, Calimero',   cetaceans: 'Open-ended (beluga, orca)',    primates: 'Absent/minimal', shared: false },
  { trait: 'Individual vocal recog.',  elephants: '~100 individuals, ~2 km',      cetaceans: 'Signature whistle ID',        primates: 'Limited', shared: true },
  { trait: 'Candidate vocal labels',  elephants: 'Pardo et al. 2024 (contested)', cetaceans: 'Dolphin name-copying',        primates: 'Absent', shared: false },
  { trait: 'Von Economo neurons',     elephants: 'Frontoinsular, ACC',            cetaceans: 'ACC, frontopolar, insula',    primates: 'ACC, insula, SII', shared: true },
  { trait: 'Low-frequency channel',   elephants: 'Infrasound 14–35 Hz, ~2 km',   cetaceans: 'Baleen <20 Hz, 1000s km',     primates: 'No', shared: false },
]

export function ElephantIntro() {
  const [active, setActive] = useState<Species>('elephants')
  const [showAll, setShowAll] = useState(false)

  const pt = POINTS.find(p => p.id === active)!
  const rows = showAll ? CONVERGENCE : CONVERGENCE.filter(r => r.shared)

  return (
    <div className="elephant-intro">
      <p className="elephant-eyebrow">Elephants</p>
      <h1 className="elephant-title">The Sixth Pillar</h1>
      <p className="elephant-lede">
        Elephants are the deepest behavioral convergence with cetaceans in the series: two
        large-brained, long-lived, matrilineal, fission–fusion mammals who independently evolved
        individual vocal recognition, candidate arbitrary labels, von Economo neurons, and an
        elder-as-knowledge-repository social structure — from a last common ancestor ~100 Mya
        that had none of these traits. Pure homoplasy, no homology.
      </p>

      {/* Stats */}
      <div className="elephant-stats">
        {STATS.map(s => (
          <div key={s.label} className="elephant-stat">
            <span className="elephant-stat-val">{s.value}</span>
            <span className="elephant-stat-unit">{s.unit}</span>
            <span className="elephant-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Scatter + convergence table */}
      <div className="elephant-intro-grid">
        <div>
          <h2 className="elephant-h2">Communication Design Space</h2>
          <p className="elephant-sub">
            Elephants cluster near bees and primates: strong reference, weak syntax.
            Click a species.
          </p>
          <svg viewBox={VB} className="elephant-scatter-svg" aria-label="Communication design space">
            <line x1={L} y1={T - 10} x2={L} y2={B + 10} stroke="var(--elephant-clay)" strokeWidth="1" />
            <line x1={L - 10} y1={B} x2={R + 10} y2={B} stroke="var(--elephant-clay)" strokeWidth="1" />
            <text x={(L + R) / 2} y={B + 36} textAnchor="middle" fill="var(--elephant-deep)" fontSize="12" fontFamily="var(--font-sans)" letterSpacing="0.08em">SYNTACTIC COMPLEXITY →</text>
            <text x={L - 44} y={(T + B) / 2} textAnchor="middle" fill="var(--elephant-deep)" fontSize="12" fontFamily="var(--font-sans)" letterSpacing="0.08em" transform={`rotate(-90 ${L - 44} ${(T + B) / 2})`}>REFERENCE / SEMANTICS →</text>
            {[0.25, 0.5, 0.75].map(v => (
              <g key={v}>
                <line x1={sx(v)} y1={T} x2={sx(v)} y2={B} stroke="var(--elephant-clay)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={L} y1={sy(v)} x2={R} y2={sy(v)} stroke="var(--elephant-clay)" strokeWidth="1" strokeDasharray="4 4" />
              </g>
            ))}
            {POINTS.map(p => (
              <g key={p.id} onClick={() => setActive(p.id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={sx(p.sx)} cy={sy(p.sy)}
                  r={active === p.id ? p.r + 3 : p.r}
                  fill={active === p.id ? p.color : 'transparent'}
                  stroke={p.color} strokeWidth={active === p.id ? 0 : 2}
                  opacity={active === p.id ? 1 : 0.7}
                />
                <text
                  x={sx(p.sx) + p.offset.dx} y={sy(p.sy) + p.offset.dy}
                  textAnchor={p.offset.anchor as 'start' | 'end' | 'middle'}
                  fill={active === p.id ? p.color : `color-mix(in oklch, ${p.color} 60%, var(--fg-muted))`}
                  fontSize={active === p.id ? '12' : '11'}
                  fontFamily="var(--font-sans)"
                  fontWeight={active === p.id ? '600' : '400'}
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="elephant-scatter-callout" style={{ borderColor: pt.color }}>
            <span className="elephant-scatter-name" style={{ color: pt.color }}>{pt.label}</span>
            <span className="elephant-scatter-desc">
              {pt.id === 'elephants' && 'Strong individual recognition, candidate arbitrary names, rich multimodal context — but no demonstrated combinatorial syntax. Syntax-light, semantics-heavy.'}
              {pt.id === 'humans'    && 'Full displacement and syntax. The only system combining productivity, cultural transmission, and recursion.'}
              {pt.id === 'dolphins'  && 'Signature whistles, individual recognition, complex learned song. Strong on social reference; syntax less clear than humpback.'}
              {pt.id === 'songbirds' && 'High syntactic structure; references are mainly immediate-context. The syntax-heavy, reference-light pole.'}
              {pt.id === 'parrots'   && 'Referential labels (Alex), intermediate syntax. A bridge between poles.'}
              {pt.id === 'bees'      && 'Maximum displacement with minimal syntax — the waggle dance encodes polar coordinates innately.'}
              {pt.id === 'primates'  && 'Functional reference (vervet alarms), gestural intentionality. Limited syntax.'}
            </span>
          </div>
        </div>

        {/* Cetacean convergence */}
        <div>
          <h2 className="elephant-h2">The Cetacean Convergence</h2>
          <p className="elephant-sub">
            Shared traits across ~100 My divergence — click to toggle all vs. shared-only rows.
          </p>
          <div className="elephant-conv-table">
            <div className="elephant-conv-head">
              <span>Trait</span><span>Elephants</span><span>Cetaceans</span>
            </div>
            {rows.map(r => (
              <div key={r.trait} className={`elephant-conv-row${r.shared ? '' : ' non-shared'}`}>
                <span className="elephant-conv-trait">{r.trait}</span>
                <span className="elephant-conv-cell">{r.elephants}</span>
                <span className="elephant-conv-cell">{r.cetaceans}</span>
              </div>
            ))}
          </div>
          <button className="elephant-toggle-btn" onClick={() => setShowAll(v => !v)}>
            {showAll ? '▲ Show shared only' : '▼ Show all traits'}
          </button>
        </div>
      </div>

      <div className="elephant-callout">
        <span className="elephant-callout-icon">🐘</span>
        <div>
          <strong>The homoplasy verdict:</strong> Every complex communicative and social trait
          elephants share with cetaceans arose independently. Their last common ancestor (~100 Mya)
          was a small, probably nocturnal, early eutherian with none of these features. The
          convergence is driven by a shared life-history syndrome: large body, long life, slow
          reproduction, matrilineal kin bonds, and the payoff of accumulated social knowledge.
        </div>
      </div>
    </div>
  )
}
