import { useState } from 'react'

const BUNDLE_FEATURES = [
  {
    id: 'compositionality',
    label: 'Compositional semantics',
    desc: 'Meaning of the whole = f(meanings of parts + structure). Frege\'s principle. No other system robustly satisfies this.',
    keystone: true,
  },
  {
    id: 'recursion',
    label: 'Hierarchical syntax',
    desc: 'Phrases embed inside phrases without a fixed bound. Real and present in human language, though its evolutionary primacy is contested.',
    keystone: false,
  },
  {
    id: 'duality',
    label: 'Duality of patterning',
    desc: 'Two independent combinatorial levels: meaningless phonemes → meaningful morphemes → sentences. Only robustly attested in human language.',
    keystone: false,
  },
  {
    id: 'displacement',
    label: 'Displacement',
    desc: 'Reference to objects, events, and states not present in the immediate context — past, future, hypothetical, counterfactual.',
    keystone: false,
  },
  {
    id: 'arbitrariness',
    label: 'Arbitrariness',
    desc: 'Sound–meaning mappings are conventional, not iconic. Sign languages show the same property. (Iconicity exists but is not required.)',
    keystone: false,
  },
  {
    id: 'cultural',
    label: 'Cultural transmission',
    desc: 'Language is learned, not innate in its lexical and grammatical details. Each generation re-acquires from ambient input during a critical period.',
    keystone: false,
  },
  {
    id: 'pragmatics',
    label: 'Gricean pragmatics',
    desc: 'Speakers and listeners coordinate on implicature, relevance, and common ground — meaning goes well beyond sentence-level truth conditions.',
    keystone: false,
  },
  {
    id: 'amodal',
    label: 'Amodal substrate',
    desc: 'The same frontotemporal network supports speech, sign, reading, and inner speech — language is substrate-neutral.',
    keystone: false,
  },
]

const STATS = [
  { value: '~7,000',  unit: 'languages',   label: 'documented human languages' },
  { value: '~170K',   unit: 'years',        label: 'minimum age of behavioral modernity' },
  { value: '~50 ms',  unit: 'phoneme rate', label: 'speech production speed' },
  { value: '~20 Hz',  unit: 'update rate',  label: 'pragmatic inference during listening' },
]

const PILLARS = [
  { label: 'Whales',    color: '#4afdc6', x: 0.50, y: 0.18 },
  { label: 'Birds',     color: '#ffb472', x: 0.78, y: 0.06 },
  { label: 'Primates',  color: '#b57bee', x: 0.18, y: 0.62 },
  { label: 'Parrots',   color: '#8ae04a', x: 0.58, y: 0.44 },
  { label: 'Bees',      color: '#f4c430', x: 0.08, y: 0.85 },
  { label: 'Elephants', color: '#d4854a', x: 0.14, y: 0.80 },
  { label: 'Human',     color: '#c9a84c', x: 0.96, y: 0.95 },
]

const VB = '0 0 560 400'
const L = 64, R = 530, T = 30, B = 365
function px(v: number) { return L + v * (R - L) }
function py(v: number) { return B - v * (B - T) }

export function HumanIntro() {
  const [active, setActive] = useState<string>('Human')
  const [expanded, setExpanded] = useState<string | null>(null)

  const pt = PILLARS.find(p => p.label === active)!

  return (
    <div className="human-intro">
      <p className="human-eyebrow">Human Language</p>
      <h1 className="human-title">The Assembled Whole</h1>
      <p className="human-lede">
        Every animal communication system in this series has something remarkable. None has
        everything. Human language is not defined by any single ingredient — not recursion,
        not vocal learning, not reference alone — but by a <em>bundle</em> of co-evolved
        features that, taken together, produce a qualitatively different kind of system.
        Compositional semantics is the keystone. The rest are the arch.
      </p>

      <div className="human-stats">
        {STATS.map(s => (
          <div key={s.label} className="human-stat">
            <span className="human-stat-val">{s.value}</span>
            <span className="human-stat-unit">{s.unit}</span>
            <span className="human-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="human-intro-grid">
        {/* Design space scatter */}
        <div>
          <h2 className="human-h2">Design Space</h2>
          <p className="human-sub">
            Syntax vs. reference across all seven pillars. Human sits alone in the upper-right.
            Click a dot.
          </p>
          <svg viewBox={VB} className="human-scatter-svg" aria-label="Communication design space">
            <line x1={L} y1={T - 10} x2={L} y2={B + 10} stroke="var(--human-gold)" strokeWidth="1" opacity="0.4" />
            <line x1={L - 10} y1={B} x2={R + 10} y2={B} stroke="var(--human-gold)" strokeWidth="1" opacity="0.4" />
            <text x={(L + R) / 2} y={B + 36} textAnchor="middle" fill="var(--human-warm)" fontSize="11" fontFamily="var(--font-sans)" letterSpacing="0.08em">SYNTACTIC COMPLEXITY →</text>
            <text x={L - 44} y={(T + B) / 2} textAnchor="middle" fill="var(--human-warm)" fontSize="11" fontFamily="var(--font-sans)" letterSpacing="0.08em" transform={`rotate(-90 ${L - 44} ${(T + B) / 2})`}>REFERENCE / SEMANTICS →</text>
            {[0.25, 0.5, 0.75].map(v => (
              <g key={v}>
                <line x1={px(v)} y1={T} x2={px(v)} y2={B} stroke="var(--human-gold)" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
                <line x1={L} y1={py(v)} x2={R} y2={py(v)} stroke="var(--human-gold)" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
              </g>
            ))}
            {PILLARS.map(p => (
              <g key={p.label} onClick={() => setActive(p.label)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={px(p.x)} cy={py(p.y)}
                  r={active === p.label ? 13 : 8}
                  fill={active === p.label ? p.color : 'transparent'}
                  stroke={p.color} strokeWidth={active === p.label ? 0 : 2}
                  opacity={active === p.label ? 1 : 0.75}
                />
                <text
                  x={px(p.x) + (p.label === 'Human' ? -14 : 12)}
                  y={py(p.y) + (p.label === 'Human' ? -14 : 4)}
                  textAnchor={p.label === 'Human' ? 'end' : 'start'}
                  fill={active === p.label ? p.color : `color-mix(in oklch, ${p.color} 65%, var(--fg-muted))`}
                  fontSize={active === p.label ? '12' : '11'}
                  fontFamily="var(--font-sans)"
                  fontWeight={active === p.label ? '600' : '400'}
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="human-scatter-callout" style={{ borderColor: pt.color }}>
            <span className="human-scatter-name" style={{ color: pt.color }}>{pt.label}</span>
            <span className="human-scatter-desc">
              {pt.label === 'Human'     && 'The only known system combining hierarchical syntax, full compositionality, displacement, arbitrariness, and Gricean pragmatics — in an amodal, culturally transmitted substrate.'}
              {pt.label === 'Whales'    && 'Rich syntax-like structure (humpback song), open-ended vocal learning, no demonstrated compositionality. Strong syntax, reference unclear.'}
              {pt.label === 'Birds'     && 'Complex hierarchical song, vocal learning, no semantic reference beyond context. Syntax-heavy, reference-light.'}
              {pt.label === 'Primates'  && 'Functional reference (vervet alarms), intentional gesture, RSA-compatible pragmatics. But no productive syntax, no compositionality.'}
              {pt.label === 'Parrots'   && 'Referential labels (Alex), vocal learning, intermediate syntax. A bridge across both axes.'}
              {pt.label === 'Bees'      && 'Maximum spatial displacement (waggle dance), zero combinatorial syntax. Unique displacement, no composition.'}
              {pt.label === 'Elephants' && 'Strong individual recognition, candidate arbitrary names, rich multimodal context — but no syntax.'}
            </span>
          </div>
        </div>

        {/* Bundle features */}
        <div>
          <h2 className="human-h2">The Bundle</h2>
          <p className="human-sub">
            Eight co-evolved features. No other system has all of them. Click to expand.
          </p>
          <div className="human-bundle-list">
            {BUNDLE_FEATURES.map(f => (
              <div
                key={f.id}
                className={`human-bundle-item${f.keystone ? ' keystone' : ''}${expanded === f.id ? ' open' : ''}`}
                onClick={() => setExpanded(expanded === f.id ? null : f.id)}
              >
                <div className="human-bundle-header">
                  <span className="human-bundle-label">{f.label}</span>
                  {f.keystone && <span className="human-bundle-tag">keystone</span>}
                  <span className="human-bundle-caret">{expanded === f.id ? '▲' : '▼'}</span>
                </div>
                {expanded === f.id && (
                  <p className="human-bundle-desc">{f.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="human-callout">
        <div>
          <strong>The bundle thesis (Evans & Levinson 2009; Hauser, Chomsky & Fitch 2002, contested):</strong>{' '}
          Debate about which features are uniquely human and which are shared distracts from
          the more important question: which <em>combination</em> is unique? Each individual
          feature has at least a partial analogue elsewhere. The co-occurrence of all eight
          in a single, culturally transmitted, amodal system appears to be unique to
          <em>Homo sapiens</em>.
        </div>
      </div>
    </div>
  )
}
