import { useState } from 'react'

/* Where each species in the series falls on two axes:
   X = social complexity of ancestor (1=solitary, 5=highly cooperative)
   Y = human-directed signal elaboration (1=none, 5=strong)  */
interface Species {
  id: string
  label: string
  x: number
  y: number
  color: string
  note: string
  category: 'wild' | 'domestic'
}

const SPECIES: Species[] = [
  { id: 'whale',    label: 'Whales',    x: 72, y: 18,  color: '#56b6ff', note: 'Highly social, complex conspecific communication. No human-directed channel — wild encounters are broadcast, not interactive.', category: 'wild' },
  { id: 'birds',    label: 'Birds',     x: 38, y: 12,  color: '#ffb472', note: 'Rich vocal production learning; conspecific songs. Human-directed: minimal (some corvid/parrot exceptions).', category: 'wild' },
  { id: 'primates', label: 'Primates',  x: 66, y: 22,  color: '#c8a46e', note: 'Social cognition for conspecifics. Lab apes show human-cue sensitivity but limited in the wild.', category: 'wild' },
  { id: 'parrots',  label: 'Parrots',   x: 48, y: 28,  color: '#a0c878', note: 'Flock-social; contact calls, vocal learning. Pet parrots can use human speech referentially (Alex), but this is not wild communication.', category: 'wild' },
  { id: 'bees',     label: 'Bees',      x: 82, y: 8,   color: '#fde68a', note: 'Superorganism-level social complexity. All communication is conspecific — no mechanism for cross-species output.', category: 'wild' },
  { id: 'elephants',label: 'Elephants', x: 68, y: 14,  color: '#d4a97a', note: 'Matrilineal fission-fusion societies. Human-directed: captive elephants show some responsiveness, but wild communication is conspecific.', category: 'wild' },
  { id: 'dogs',     label: 'Dogs',      x: 78, y: 88,  color: '#e2924c', note: 'Cooperative wolf ancestry + ~30,000 years of selection for human interaction. The strongest human-directed channel in the animal kingdom outside of humans.', category: 'domestic' },
  { id: 'cats',     label: 'Cats',      x: 26, y: 64,  color: '#9b7cd4', note: 'Solitary wildcat ancestry + ~10,000 years of commensal self-domestication. A thinner but real human-directed channel, mostly repurposed from kitten-to-mother signals.', category: 'domestic' },
  { id: 'human',    label: 'Human',     x: 94, y: 94,  color: '#c9a84c', note: 'The reference point: maximum social complexity, maximum communicative elaboration.', category: 'wild' },
]

const CATEGORIES = [
  {
    id: 'homology',
    name: 'Homology',
    blurb: 'Shared trait by common descent. Not applicable here — dogs, cats, and humans share ancestry far too distant for communicative homology to explain the resemblance.',
    color: '#56b6ff',
  },
  {
    id: 'convergence',
    name: 'Wild convergence',
    blurb: 'Independent evolution under shared adaptive pressure in the wild. Not what happened — wolves and wildcats were not under pressure to communicate with humans before domestication.',
    color: '#4ade80',
  },
  {
    id: 'distillation',
    name: 'Cultural distillation',
    blurb: 'Absorbing the behavioral output of another system (the LLM mechanism). Not this either — dogs and cats are not reading about human communication, they are embedded in it for a lifetime.',
    color: '#5b8dff',
  },
  {
    id: 'coevolution',
    name: 'Co-evolved interspecific signaling',
    blurb: 'Domestication created a new niche: living inside human social worlds. Under artificial and relaxed selection, signals that recruited human attention and care became adaptive. Layered on top: a lifetime of ontogenetic tuning — each individual animal learning the specific human it lives with. A fourth category.',
    color: '#e2924c',
  },
]

export function PetsIntro() {
  const [hover, setHover] = useState<string | null>(null)
  const [cat, setCat] = useState('coevolution')

  const hov = hover ? SPECIES.find(s => s.id === hover) : null
  const activeCat = CATEGORIES.find(c => c.id === cat)!

  return (
    <div className="pet-section">
      <p className="pet-eyebrow">Pillar IX · Dogs &amp; Cats</p>
      <h1 className="pet-title">Talking to the Apes</h1>
      <p className="pet-lede">
        Every other species in this series communicates <em>with its own kind</em>. Dogs and cats are
        different. Their most striking, elaborate, and — in several cases — experimentally-demonstrated
        communication is aimed at <em>us</em>. That is not convergence, not homology, not cultural
        distillation. It is something the rest of the series has not seen.
      </p>

      {/* Scatter: social complexity vs human-directed elaboration */}
      <h2 className="pet-h2">The series, replotted</h2>
      <p className="pet-sub">
        Social complexity of ancestry (x-axis) against strength of human-directed channel (y-axis). Hover a
        species. Notice which two are outliers.
      </p>
      <div className="pet-scatter-wrap">
        <svg viewBox="0 0 360 280" className="pet-scatter" role="img" aria-label="Species comparison scatter">
          {/* axes */}
          <line x1="28" y1="254" x2="348" y2="254" className="pet-scatter-axis" />
          <line x1="28" y1="254" x2="28" y2="14" className="pet-scatter-axis" />
          <text x="188" y="272" className="pet-scatter-lbl">ancestor social complexity →</text>
          <text x="14" y="134" className="pet-scatter-lbl" transform="rotate(-90,14,134)">human-directed channel →</text>

          {/* gridlines */}
          {[0.25,0.5,0.75].map(f => (
            <g key={f}>
              <line x1="28" y1={254 - f*240} x2="348" y2={254 - f*240} className="pet-scatter-grid" />
              <line x1={28 + f*320} y1="254" x2={28 + f*320} y2="14" className="pet-scatter-grid" />
            </g>
          ))}

          {/* domestic band */}
          <rect x="28" y="14" width="320" height="90" className="pet-scatter-band" />
          <text x="340" y="30" className="pet-scatter-band-lbl" textAnchor="end">human-directed zone</text>

          {/* points */}
          {SPECIES.map(s => {
            const cx = 28 + (s.x / 100) * 320
            const cy = 254 - (s.y / 100) * 240
            const active = hover === s.id
            return (
              <g key={s.id} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
                <circle cx={cx} cy={cy} r={active ? 10 : 7}
                  fill={s.color}
                  opacity={hover && !active ? 0.35 : 1}
                  className="pet-scatter-dot"
                  style={{ filter: active ? `drop-shadow(0 0 8px ${s.color})` : undefined }}
                />
                <text x={cx + (s.id === 'human' ? 11 : s.id === 'cats' ? -10 : 11)} y={cy + 4}
                  className="pet-scatter-name"
                  textAnchor={s.id === 'cats' ? 'end' : 'start'}
                  style={{ fill: active ? s.color : undefined, fontWeight: active ? '600' : undefined }}
                >
                  {s.label}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="pet-scatter-info">
          {hov ? (
            <div className="pet-hover-card" style={{ borderColor: hov.color }}>
              <span className="pet-hover-name" style={{ color: hov.color }}>{hov.label}</span>
              <span className={`pet-hover-tag ${hov.category}`}>{hov.category === 'domestic' ? 'domesticated' : 'wild'}</span>
              <p>{hov.note}</p>
            </div>
          ) : (
            <div className="pet-hover-card muted">
              <span className="pet-hover-prompt">← hover a species</span>
              <p>Dogs and cats occupy a region no wild species reaches: high human-directed elaboration regardless of ancestral social complexity.</p>
            </div>
          )}
        </div>
      </div>

      {/* The fourth category */}
      <h2 className="pet-h2">A fourth category</h2>
      <p className="pet-sub">The series has used three explanatory frames. None fits here. Click each.</p>
      <div className="pet-cat-tabs">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`pet-cat-tab${cat === c.id ? ' active' : ''}`}
            style={cat === c.id ? { borderColor: c.color, color: c.color } : undefined}
            onClick={() => setCat(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="pet-cat-detail" style={{ borderColor: activeCat.color }}>
        <span className="pet-cat-detail-name" style={{ color: activeCat.color }}>{activeCat.name}</span>
        <p>{activeCat.blurb}</p>
      </div>

      {/* Starting points */}
      <h2 className="pet-h2">Two very different starting points</h2>
      <div className="pet-two">
        <div className="pet-origin dog">
          <span className="pet-origin-label">Dogs</span>
          <span className="pet-origin-from">from cooperative wolves</span>
          <ul className="pet-origin-list">
            <li>~15,000–40,000 years of domestication</li>
            <li>Rich conspecific multimodal repertoire inherited</li>
            <li>Strong pre-existing social cognition (group living)</li>
            <li>Heavily modified by directed selection (150+ breeds)</li>
            <li>Vocal use changed more than vocal structure</li>
          </ul>
        </div>
        <div className="pet-origin cat">
          <span className="pet-origin-label">Cats</span>
          <span className="pet-origin-from">from solitary wildcats</span>
          <ul className="pet-origin-list">
            <li>~10,000 years, largely self-domestication</li>
            <li>Sparse conspecific signaling system to start</li>
            <li>Commensal niche (granaries → mice → humans)</li>
            <li>Minimally morphologically modified; "semi-domesticated"</li>
            <li>Repurposed kitten-to-mother signals for human caregivers</li>
          </ul>
        </div>
      </div>

      <div className="pet-callout">
        <strong>Neither vocal production learner.</strong> Both dogs and cats are described as non-learners
        of vocal production — they do not imitate new sounds the way songbirds, parrots, cetaceans, or
        humans do. What changed under domestication was <em>usage</em>, <em>acoustic tuning</em> via
        receiver selection, and <em>listener comprehension</em> on the human side. A striking asymmetry:
        two of the most communicative animals on the planet achieve it without the hardware that defines
        the other vocal pillars.
      </div>
    </div>
  )
}
