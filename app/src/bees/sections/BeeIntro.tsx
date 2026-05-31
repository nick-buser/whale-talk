import { useState } from 'react'

/* ── Scatter: communication design space ───────────────────── */
type Species = 'bees' | 'humans' | 'chimps' | 'cetaceans' | 'songbirds' | 'parrots'

interface ScatterPoint {
  id: Species
  label: string
  sx: number   // 0–1 syntactic complexity
  sy: number   // 0–1 displaced reference
  color: string
  r: number
  offset: { dx: number; dy: number; anchor: string }
}

const VB = '0 0 560 400'
const L = 64, R = 530, T = 30, B = 365

function sx(v: number) { return L + v * (R - L) }
function sy(v: number) { return B - v * (B - T) }

const POINTS: ScatterPoint[] = [
  { id: 'bees',      label: 'Honeybees',  sx: 0.08, sy: 0.85, color: '#f4c430', r: 9,  offset: { dx: 14, dy: 4,   anchor: 'start' } },
  { id: 'humans',    label: 'Humans',     sx: 0.96, sy: 0.95, color: '#ff6b54', r: 11, offset: { dx: -14, dy: -14, anchor: 'end' } },
  { id: 'chimps',    label: 'Primates',   sx: 0.18, sy: 0.62, color: '#b57bee', r: 8,  offset: { dx: 14, dy: 4,   anchor: 'start' } },
  { id: 'cetaceans', label: 'Cetaceans',  sx: 0.50, sy: 0.18, color: '#4afdc6', r: 8,  offset: { dx: 12, dy: -12, anchor: 'start' } },
  { id: 'songbirds', label: 'Songbirds',  sx: 0.78, sy: 0.06, color: '#ffb472', r: 8,  offset: { dx: -12, dy: -12, anchor: 'end' } },
  { id: 'parrots',   label: 'Parrots',    sx: 0.58, sy: 0.44, color: '#8ae04a', r: 8,  offset: { dx: 14, dy: -10, anchor: 'start' } },
]

/* ── Hockett features table ────────────────────────────────── */
type FeatureStatus = 'yes' | 'partial' | 'no' | 'unknown'

interface HockettFeature {
  id: string
  name: string
  desc: string
  bees: FeatureStatus
  humans: FeatureStatus
  chimps: FeatureStatus
  songbirds: FeatureStatus
}

const HOCKETT: HockettFeature[] = [
  { id: 'vocal',       name: 'Vocal-auditory channel', desc: 'Primary channel is sound',                                       bees: 'no',      humans: 'yes',     chimps: 'partial', songbirds: 'yes' },
  { id: 'broadcast',   name: 'Broadcast transmission', desc: 'Signal available to any receiver in range',                      bees: 'no',      humans: 'yes',     chimps: 'yes',     songbirds: 'yes' },
  { id: 'rapid',       name: 'Rapid fading',           desc: 'Signal does not persist after production',                       bees: 'yes',     humans: 'yes',     chimps: 'yes',     songbirds: 'yes' },
  { id: 'interch',     name: 'Interchangeability',     desc: 'Senders can also be receivers',                                  bees: 'yes',     humans: 'yes',     chimps: 'yes',     songbirds: 'yes' },
  { id: 'total',       name: 'Total feedback',         desc: 'Sender monitors own signal',                                     bees: 'yes',     humans: 'yes',     chimps: 'yes',     songbirds: 'yes' },
  { id: 'special',     name: 'Specialization',         desc: 'Signal serves communicative function, not incidental byproduct', bees: 'yes',     humans: 'yes',     chimps: 'partial', songbirds: 'yes' },
  { id: 'semantic',    name: 'Semanticity',            desc: 'Signal elements have stable referential meaning',                bees: 'yes',     humans: 'yes',     chimps: 'partial', songbirds: 'no'  },
  { id: 'arbitrary',   name: 'Arbitrariness',          desc: 'No necessary resemblance between signal and referent',          bees: 'partial', humans: 'yes',     chimps: 'partial', songbirds: 'yes' },
  { id: 'discrete',    name: 'Discreteness',           desc: 'Message elements are distinct, not continuously graded',        bees: 'partial', humans: 'yes',     chimps: 'no',      songbirds: 'partial' },
  { id: 'displaced',   name: 'Displacement',           desc: 'Can refer to events absent in time or space',                   bees: 'yes',     humans: 'yes',     chimps: 'no',      songbirds: 'no'  },
  { id: 'productive',  name: 'Productivity',           desc: 'New messages can be constructed and understood',                bees: 'yes',     humans: 'yes',     chimps: 'no',      songbirds: 'no'  },
  { id: 'tradition',   name: 'Cultural transmission',  desc: 'Signal system is learned, not purely innate',                   bees: 'no',      humans: 'yes',     chimps: 'partial', songbirds: 'yes' },
  { id: 'duality',     name: 'Duality of patterning',  desc: 'Two levels: meaningless units combine to form meaningful units', bees: 'no',     humans: 'yes',     chimps: 'no',      songbirds: 'partial' },
  { id: 'prevaricate', name: 'Prevarication',          desc: 'Can produce false or meaningless signals',                      bees: 'partial', humans: 'yes',     chimps: 'unknown', songbirds: 'no'  },
  { id: 'reflexive',   name: 'Reflexiveness',          desc: 'Can communicate about the communication system itself',         bees: 'no',      humans: 'yes',     chimps: 'no',      songbirds: 'no'  },
  { id: 'learnability', name: 'Learnability',          desc: 'System can be learned by other species',                        bees: 'no',      humans: 'yes',     chimps: 'partial', songbirds: 'yes' },
]

const STATUS_LABEL: Record<FeatureStatus, string> = { yes: 'Yes', partial: 'Partial', no: 'No', unknown: '?' }
const STATUS_CLASS: Record<FeatureStatus, string> = { yes: 'bee-hockett-yes', partial: 'bee-hockett-partial', no: 'bee-hockett-no', unknown: 'bee-hockett-unk' }

/* ── Stats callout ─────────────────────────────────────────── */
const STATS = [
  { value: '6',     unit: 'bits',    label: 'per waggle dance' },
  { value: '1M',    unit: 'neurons', label: 'navigator brain' },
  { value: '10 km', unit: 'range',   label: 'foraging radius' },
  { value: '3',     unit: 'known',   label: 'Hockett features shared with humans only' },
]

export function BeeIntro() {
  const [active, setActive] = useState<Species>('bees')
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const pt = POINTS.find(p => p.id === active)!

  return (
    <div className="bee-intro">
      <p className="bee-intro-eyebrow">Bees</p>
      <h1 className="bee-intro-title">The Great Inversion</h1>
      <p className="bee-intro-lede">
        Honeybees communicate precisely about locations never experienced by the receiver —
        encoding polar coordinates of a foraging site in a body-movement performance —
        without vocal learning, symbolic training, or a cortex. That achievement is the
        inversion that forces a rethink of every primate-centric theory of how displacement
        in language arose.
      </p>

      {/* Stats row */}
      <div className="bee-intro-stats">
        {STATS.map(s => (
          <div key={s.label} className="bee-intro-stat">
            <span className="bee-intro-stat-val">{s.value}</span>
            <span className="bee-intro-stat-unit">{s.unit}</span>
            <span className="bee-intro-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Scatter plot */}
      <div className="bee-intro-grid">
        <div className="bee-intro-scatter">
          <h2 className="bee-section-h2">Communication Design Space</h2>
          <p className="bee-intro-sub">
            Bees sit in a unique corner: high displacement, minimal syntax. Click a species.
          </p>
          <svg viewBox={VB} className="bee-scatter-svg" aria-label="Communication design space scatter">
            {/* Axes */}
            <line x1={L} y1={T - 10} x2={L} y2={B + 10} stroke="var(--bee-wall)" strokeWidth="1" />
            <line x1={L - 10} y1={B} x2={R + 10} y2={B} stroke="var(--bee-wall)" strokeWidth="1" />
            {/* Axis labels */}
            <text x={(L + R) / 2} y={B + 36} textAnchor="middle" fill="var(--bee-deep)" fontSize="12" fontFamily="var(--font-sans)" letterSpacing="0.08em">SYNTACTIC COMPLEXITY →</text>
            <text x={L - 44} y={(T + B) / 2} textAnchor="middle" fill="var(--bee-deep)" fontSize="12" fontFamily="var(--font-sans)" letterSpacing="0.08em" transform={`rotate(-90 ${L - 44} ${(T + B) / 2})`}>DISPLACEMENT →</text>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map(v => (
              <g key={v}>
                <line x1={sx(v)} y1={T} x2={sx(v)} y2={B} stroke="var(--bee-wall)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={L} y1={sy(v)} x2={R} y2={sy(v)} stroke="var(--bee-wall)" strokeWidth="1" strokeDasharray="4 4" />
              </g>
            ))}
            {/* Points */}
            {POINTS.map(p => (
              <g key={p.id} onClick={() => setActive(p.id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={sx(p.sx)} cy={sy(p.sy)} r={active === p.id ? p.r + 3 : p.r}
                  fill={active === p.id ? p.color : 'transparent'}
                  stroke={p.color}
                  strokeWidth={active === p.id ? 0 : 2}
                  opacity={active === p.id ? 1 : 0.7}
                />
                <text
                  x={sx(p.sx) + p.offset.dx}
                  y={sy(p.sy) + p.offset.dy}
                  textAnchor={p.offset.anchor as 'start' | 'end' | 'middle'}
                  fill={active === p.id ? p.color : 'color-mix(in oklch, ' + p.color + ' 60%, var(--fg-muted))'}
                  fontSize={active === p.id ? '12' : '11'}
                  fontFamily="var(--font-sans)"
                  fontWeight={active === p.id ? '600' : '400'}
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
          {/* Active species callout */}
          <div className="bee-scatter-callout" style={{ borderColor: pt.color }}>
            <span className="bee-scatter-callout-name" style={{ color: pt.color }}>{pt.label}</span>
            <span className="bee-scatter-callout-desc">
              {pt.id === 'bees'      && 'High displacement via waggle dance (polar coordinates), low open syntax. Displacement is innate, not learned.'}
              {pt.id === 'humans'    && 'Maximal displacement and syntax. The only system with full productivity plus cultural transmission.'}
              {pt.id === 'chimps'    && 'Moderate displacement in some gesture studies; no productive syntax. Intentional but bounded.'}
              {pt.id === 'cetaceans' && 'Complex learned syntax in humpback song; little evidence for displaced reference about external objects.'}
              {pt.id === 'songbirds' && 'High syntactic structure in song; references are mostly immediate-context alarm or mate signals.'}
              {pt.id === 'parrots'   && 'Referential object labels (Alex), some displacement in contact calls; intermediate on both axes.'}
            </span>
          </div>
        </div>

        {/* Hockett table */}
        <div className="bee-intro-hockett">
          <h2 className="bee-section-h2">Hockett's Design Features</h2>
          <p className="bee-intro-sub">Click a row for details. Bees share displacement and productivity only with humans.</p>
          <div className="bee-hockett-table">
            <div className="bee-hockett-head">
              <span>Feature</span>
              <span>Bees</span>
              <span>Humans</span>
              <span>Primates</span>
              <span>Songbirds</span>
            </div>
            {HOCKETT.map(f => (
              <div
                key={f.id}
                className={`bee-hockett-row${activeFeature === f.id ? ' active' : ''}`}
                onClick={() => setActiveFeature(activeFeature === f.id ? null : f.id)}
              >
                <span className="bee-hockett-name">{f.name}</span>
                <span className={`bee-hockett-cell ${STATUS_CLASS[f.bees]}`}>{STATUS_LABEL[f.bees]}</span>
                <span className={`bee-hockett-cell ${STATUS_CLASS[f.humans]}`}>{STATUS_LABEL[f.humans]}</span>
                <span className={`bee-hockett-cell ${STATUS_CLASS[f.chimps]}`}>{STATUS_LABEL[f.chimps]}</span>
                <span className={`bee-hockett-cell ${STATUS_CLASS[f.songbirds]}`}>{STATUS_LABEL[f.songbirds]}</span>
                {activeFeature === f.id && (
                  <p className="bee-hockett-desc">{f.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inversion callout */}
      <div className="bee-intro-callout">
        <span className="bee-intro-callout-icon">⬡</span>
        <div>
          <strong>The inversion:</strong> Bees reach displacement — Hockett's hardest design feature — not through
          learned referential labels, not through cortical planning, and not through social transmission of the system.
          They arrive there via a fixed, species-typical motor program whose geometry encodes a coordinate.
          That's a fundamentally different route to the same functional destination.
        </div>
      </div>
    </div>
  )
}
