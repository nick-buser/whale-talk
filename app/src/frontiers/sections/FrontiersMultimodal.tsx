import { useState } from 'react'

interface Concept {
  id: string
  label: string
  color: string
  target: [number, number]
  imgStart: [number, number]
  txtStart: [number, number]
}

const CONCEPTS: Concept[] = [
  { id: 'dog',   label: 'dog',   color: '#2dd4bf', target: [180, 62],  imgStart: [44, 250],  txtStart: [300, 44] },
  { id: 'ocean', label: 'ocean', color: '#56b6ff', target: [92, 112],  imgStart: [322, 196], txtStart: [62, 34] },
  { id: 'fire',  label: 'fire',  color: '#fb923c', target: [118, 226], imgStart: [288, 74],  txtStart: [160, 268] },
  { id: 'leaf',  label: 'leaf',  color: '#4ade80', target: [244, 226], imgStart: [52, 128],  txtStart: [330, 258] },
  { id: 'moon',  label: 'moon',  color: '#a78bfa', target: [268, 112], imgStart: [150, 42],  txtStart: [40, 178] },
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function pos(start: [number, number], target: [number, number], offset: number, t: number): [number, number] {
  return [lerp(start[0], target[0] + offset, t), lerp(start[1], target[1], t)]
}

export function FrontiersMultimodal() {
  const [t, setT] = useState(0)
  const [selected, setSelected] = useState<string | null>('dog')

  const aligned = Math.round(t * 100)

  return (
    <div className="fr-section">
      <p className="fr-eyebrow">Coda · Open Frontiers</p>
      <h1 className="fr-title">Crossing Modalities</h1>
      <p className="fr-lede">
        The grounding objection always assumed text alone. But the most-used models are not text alone. A
        contrastive image–text objective pulls a symbol and its percept into <em>one shared space</em> — the
        word “dog” and a thousand dog photos drawn toward the same region. Scrub the training and watch a
        toy CLIP find structure it was never handed.
      </p>

      <h2 className="fr-h2">A toy CLIP, aligning from noise</h2>
      <p className="fr-sub">
        Filled dots are image embeddings, ringed labels are text embeddings. Drag training forward. Click a
        concept to see the contrastive pull (its pair) and the push (everything else).
      </p>

      <div className="fr-clip">
        <svg viewBox="0 0 360 300" className="fr-clip-svg" role="img" aria-label="Image–text embedding alignment">
          {/* faint shared-space frame */}
          <rect x="6" y="6" width="348" height="288" rx="10" className="fr-clip-frame" />

          {/* contrastive lines for selected concept */}
          {selected && (() => {
            const c = CONCEPTS.find(x => x.id === selected)!
            const ip = pos(c.imgStart, c.target, -9, t)
            const tp = pos(c.txtStart, c.target, 9, t)
            return (
              <g>
                {/* push lines to other clusters */}
                {CONCEPTS.filter(o => o.id !== c.id).map(o => {
                  const op = pos(o.imgStart, o.target, -9, t)
                  return (
                    <line key={o.id} x1={ip[0]} y1={ip[1]} x2={op[0]} y2={op[1]}
                      className="fr-clip-push" />
                  )
                })}
                {/* pull line: image <-> text positive pair */}
                <line x1={ip[0]} y1={ip[1]} x2={tp[0]} y2={tp[1]} className="fr-clip-pull"
                  style={{ stroke: c.color }} />
              </g>
            )
          })()}

          {/* points */}
          {CONCEPTS.map(c => {
            const ip = pos(c.imgStart, c.target, -9, t)
            const tp = pos(c.txtStart, c.target, 9, t)
            const dim = selected && selected !== c.id
            return (
              <g key={c.id} className={dim ? 'fr-clip-dim' : ''} onClick={() => setSelected(c.id)} style={{ cursor: 'pointer' }}>
                <circle cx={ip[0]} cy={ip[1]} r="7" fill={c.color} className="fr-clip-img" />
                <g transform={`translate(${tp[0]}, ${tp[1]})`}>
                  <rect x="-17" y="-9" width="34" height="18" rx="9" className="fr-clip-txt" style={{ stroke: c.color }} />
                  <text x="0" y="4" className="fr-clip-txt-label" style={{ fill: c.color }}>{c.label}</text>
                </g>
              </g>
            )
          })}
        </svg>

        <div className="fr-clip-controls">
          <div className="fr-clip-slider-wrap">
            <span className="fr-clip-slider-label">training</span>
            <input
              type="range" min={0} max={1} step={0.01} value={t}
              onChange={e => setT(parseFloat(e.target.value))}
              className="fr-clip-slider"
              aria-label="training progress"
            />
            <span className="fr-clip-aligned">{aligned}% aligned</span>
          </div>
          <div className="fr-clip-legend">
            {CONCEPTS.map(c => (
              <button
                key={c.id}
                className={`fr-clip-chip${selected === c.id ? ' active' : ''}`}
                onClick={() => setSelected(selected === c.id ? null : c.id)}
                style={selected === c.id ? { borderColor: c.color, color: c.color } : undefined}
              >
                <span className="fr-clip-chip-dot" style={{ background: c.color }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="fr-caption-note">
        The objective is just <strong>InfoNCE</strong>: pull each true image–text pair together, push every
        mismatched pair apart. From random initialization, that single pressure carves the space into
        concept regions where a word and its picture sit side by side. No labels, no symbols defined in
        terms of other symbols — a symbol defined against perception.
      </p>

      {/* What it does and doesn't buy */}
      <h2 className="fr-h2">Does this solve grounding?</h2>
      <div className="fr-two">
        <div className="fr-card buys">
          <span className="fr-card-tag">What it buys</span>
          <p>
            A real crossing of Harnad’s symbol-grounding gap: tokens are now anchored to perceptual
            structure, not only to other tokens. On the five-notion spectrum, the vision-language model
            moves <em>referential</em> and <em>sensorimotor</em> from “lacks it” to “partial.” This is not
            nothing — it is the difference between a dictionary and a picture book.
          </p>
        </div>
        <div className="fr-card stops">
          <span className="fr-card-tag">Where it stops</span>
          <p>
            It is <em>correlational</em>, not <em>causal</em>, grounding. The model learns that the word and
            the pixels co-occur — not that the word is <em>about</em> the thing in the way a speaker who can
            be wrong, point, and be corrected is about it. Mollo &amp; Millière’s referential notion needs a
            causal-historical link the contrastive objective does not supply.
          </p>
        </div>
      </div>

      <div className="fr-callout">
        <strong>Why this belongs in the open questions.</strong> Multimodality genuinely weakens the
        text-only grounding objection — and the previous tab did not touch it. But “closer to grounding” is
        not “grounded.” Correlation in a frozen dataset still falls short of reference built through
        action and accountability. The gap narrowed. It did not close.
      </div>
    </div>
  )
}
