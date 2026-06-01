import { useState } from 'react'

interface BarkType {
  id: string
  context: string
  pitch: number    // 0=low 1=high
  tonality: number // 0=harsh 1=tonal
  freq: string
  emotion: string
  wolfHas: boolean
  note: string
}

const BARKS: BarkType[] = [
  { id: 'alarm',   context: 'Stranger / alarm',  pitch: 0.55, tonality: 0.3,  freq: '190–500 Hz', emotion: 'Alert → aggressive',   wolfHas: true,  note: 'The closest to the wolf bark — agonistic context. Also the most reliably classified by human listeners.' },
  { id: 'play',    context: 'Play',              pitch: 0.82, tonality: 0.72, freq: '380–780 Hz', emotion: 'Joyful / excited',       wolfHas: false, note: 'Higher, more tonal, more variable. Human listeners reliably rate play barks as pleasant and non-threatening.' },
  { id: 'greeting',context: 'Greeting owner',   pitch: 0.75, tonality: 0.68, freq: '300–680 Hz', emotion: 'Friendly / affiliative',  wolfHas: false, note: 'Rapid inter-bark intervals, high tonality. Wolves do not bark in greeting contexts.' },
  { id: 'alone',   context: 'Isolation / alone', pitch: 0.62, tonality: 0.52, freq: '250–520 Hz', emotion: 'Anxious / contact-seeking', wolfHas: false, note: 'Pongrácz (2017): "contact seeking calls of isolated specimens, apparently targeted at the human, and not at a canine audience." A domestication artifact.' },
  { id: 'walk',    context: 'Walk anticipation', pitch: 0.88, tonality: 0.78, freq: '450–900 Hz', emotion: 'Excited / anticipatory', wolfHas: false, note: 'Among the highest-pitched, most tonal bark types. Human listeners find these "positive" with high reliability.' },
]

/* Morton's motivation-structural rule */
const MORTON_REGIONS = [
  { x: 0, y: 0, w: 50, h: 50, label: 'Low + harsh', meaning: 'Aggressive', color: '#e06c75' },
  { x: 50, y: 0, w: 50, h: 50, label: 'High + harsh', meaning: 'Fearful / conflicted', color: '#fbbf24' },
  { x: 0, y: 50, w: 50, h: 50, label: 'Low + tonal', meaning: 'Submissive appeasing', color: '#9b7cd4' },
  { x: 50, y: 50, w: 50, h: 50, label: 'High + tonal', meaning: 'Playful / friendly', color: '#4ade80' },
]

export function PetsBark() {
  const [active, setActive] = useState('alarm')
  const bark = BARKS.find(b => b.id === active)!

  return (
    <div className="pet-section">
      <p className="pet-eyebrow">Dogs &amp; Cats · Pillar IX</p>
      <h1 className="pet-title">The Elaborated Bark</h1>
      <p className="pet-lede">
        Wolves bark rarely — mostly in brief agonistic exchanges. Dogs bark <em>constantly</em>, across
        contexts ranging from strangers to play to being left alone. The bark has been elaborated and
        diversified under domestication into a rich, emotionally-legible, human-directed channel. And
        human listeners — even those who have never owned a dog — can classify it above chance.
      </p>

      {/* Context selector + acoustic visualizer */}
      <h2 className="pet-h2">Bark types, decoded</h2>
      <p className="pet-sub">
        Select a bark context. See where it falls on the acoustic plane (pitch × tonality), and what human
        listeners reliably infer from it.
      </p>

      <div className="pet-bark-ui">
        {/* context buttons */}
        <div className="pet-bark-contexts">
          {BARKS.map(b => (
            <button
              key={b.id}
              className={`pet-bark-ctx${active === b.id ? ' active' : ''}`}
              onClick={() => setActive(b.id)}
            >
              <span className="pet-bark-ctx-label">{b.context}</span>
              {!b.wolfHas && <span className="pet-bark-ctx-new">dog-only</span>}
            </button>
          ))}
        </div>

        {/* Morton space */}
        <div className="pet-morton">
          <svg viewBox="0 0 200 200" className="pet-morton-svg" role="img" aria-label="Acoustic emotion space">
            {MORTON_REGIONS.map(r => (
              <g key={r.label}>
                <rect x={r.x * 2} y={(100 - r.y - r.h) * 2} width={r.w * 2} height={r.h * 2}
                  fill={r.color} opacity="0.18" />
                <text x={(r.x + r.w / 2) * 2} y={(100 - r.y - r.h / 2) * 2 + 4}
                  className="pet-morton-region-lbl">{r.meaning}</text>
              </g>
            ))}
            {/* axes */}
            <line x1="100" y1="0" x2="100" y2="200" className="pet-morton-axis" />
            <line x1="0" y1="100" x2="200" y2="100" className="pet-morton-axis" />
            <text x="100" y="197" className="pet-morton-axis-lbl" textAnchor="middle">← low pitch · high pitch →</text>
            <text x="4" y="100" className="pet-morton-axis-lbl" transform="rotate(-90,4,100)" textAnchor="middle">← tonal · harsh →</text>
            {/* active point */}
            <circle
              cx={bark.pitch * 200}
              cy={(1 - bark.tonality) * 200}
              r="10"
              fill="#e2924c"
              className="pet-morton-pt"
              style={{ filter: 'drop-shadow(0 0 8px #e2924c)' }}
            />
          </svg>
          <div className="pet-morton-readout">
            <div className="pet-morton-row">
              <span>pitch</span>
              <div className="pet-morton-bar-wrap">
                <div className="pet-morton-bar" style={{ width: `${bark.pitch * 100}%` }} />
              </div>
              <span>{bark.pitch > 0.6 ? 'high' : bark.pitch > 0.4 ? 'mid' : 'low'}</span>
            </div>
            <div className="pet-morton-row">
              <span>tonality</span>
              <div className="pet-morton-bar-wrap">
                <div className="pet-morton-bar tonal" style={{ width: `${bark.tonality * 100}%` }} />
              </div>
              <span>{bark.tonality > 0.6 ? 'tonal' : bark.tonality > 0.4 ? 'mixed' : 'harsh'}</span>
            </div>
            <div className="pet-morton-freq">{bark.freq}</div>
          </div>
        </div>

        {/* detail panel */}
        <div className="pet-bark-detail">
          <div className="pet-bark-emotion">
            <span className="pet-bark-emotion-lbl">human listeners infer</span>
            <span className="pet-bark-emotion-val">{bark.emotion}</span>
          </div>
          <div className={`pet-bark-wolf ${bark.wolfHas ? 'present' : 'absent'}`}>
            {bark.wolfHas ? '● Present in wolves' : '○ Dog-only context'}
          </div>
          <p className="pet-bark-note">{bark.note}</p>
        </div>
      </div>

      {/* Morton's rule */}
      <h2 className="pet-h2">Morton's motivation-structural rules</h2>
      <p className="pet-sub">
        A cross-species generalization: low, harsh vocalizations signal aggression; high, tonal ones signal
        submission or friendliness. Dogs conform to it, and so do wolves, ravens, and chickens. This is not
        a domestication novelty — it is the inherited canvas on which domestication painted new detail.
      </p>
      <div className="pet-morton-legend">
        {MORTON_REGIONS.map(r => (
          <div key={r.label} className="pet-morton-leg-item">
            <span className="pet-morton-leg-swatch" style={{ background: r.color }} />
            <span className="pet-morton-leg-label">{r.label}</span>
            <span className="pet-morton-leg-meaning">{r.meaning}</span>
          </div>
        ))}
      </div>

      {/* Wolf vs dog bark comparison */}
      <h2 className="pet-h2">The domestication shift</h2>
      <div className="pet-two">
        <div className="pet-card wolf">
          <span className="pet-card-tag">Wolf</span>
          <p><strong>1 main context:</strong> agonistic/alarm. Short bursts. Low frequency in conspecific interaction. Rarely used to sustain contact.</p>
          <p className="pet-card-cite">Cohen &amp; Fox 1976; Feddersen-Petersen 2000</p>
        </div>
        <div className="pet-card dog">
          <span className="pet-card-tag">Dog</span>
          <p><strong>5+ contexts</strong> with distinct acoustic signatures, reliably classified by humans. The isolation/contact-seeking bark is a domestication novelty: targeted at the human caregiver, not a canine audience.</p>
          <p className="pet-card-cite">Pongrácz et al. 2005, 2006; Pongrácz 2017</p>
        </div>
      </div>

      <div className="pet-callout">
        <strong>Paedomorphism and ritualization.</strong> The proliferation of bark contexts is best
        understood as <em>ritualization</em> — signals that were rare or context-specific in the ancestor
        becoming frequent, stereotyped, and semantically elaborated. Barking itself is often framed as a
        paedomorphic retention: wolf pups bark; adult wolves mostly do not. Domestic dogs behave
        more like wolf pups in this and other respects, consistent with selection against fear/aggression
        toward humans having preserved juvenile behavioral traits into adulthood.
      </div>
    </div>
  )
}
