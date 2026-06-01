import { useState } from 'react'

/* Underlying competence is smooth in scale. The "emergence" is what a nonlinear
   metric does to it — Schaeffer, Miranda & Koyejo 2023, "Are Emergent Abilities of
   Large Language Models a Mirage?" */
const N = 49
const PAD_L = 46
const PAD_R = 16
const PAD_T = 14
const PAD_B = 34
const W = 470
const H = 270
const PLOT_W = W - PAD_L - PAD_R
const PLOT_H = H - PAD_T - PAD_B

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))
// per-token accuracy: smoothly climbs from ~0.30 to ~0.998 across the scale range
const pToken = (s: number) => 0.30 + 0.698 * sigmoid(9 * (s - 0.46))

function xAt(s: number) { return PAD_L + s * PLOT_W }
function yAt(v: number) { return PAD_T + (1 - v) * PLOT_H }

function curve(fn: (s: number) => number) {
  const pts: string[] = []
  for (let i = 0; i < N; i++) {
    const s = i / (N - 1)
    pts.push(`${xAt(s).toFixed(1)},${yAt(fn(s)).toFixed(1)}`)
  }
  return pts.join(' ')
}

export function FrontiersEmergence() {
  const [metric, setMetric] = useState<'exact' | 'token'>('exact')
  const [len, setLen] = useState(24)
  const [inspect, setInspect] = useState(0.62)

  const pExact = (s: number) => Math.pow(pToken(s), len)

  const tokenLine = curve(pToken)
  const exactLine = curve(pExact)
  const exactArea = `${PAD_L},${yAt(0)} ${exactLine} ${xAt(1)},${yAt(0)}`

  const insTok = pToken(inspect)
  const insExact = Math.pow(insTok, len)

  return (
    <div className="fr-section">
      <p className="fr-eyebrow">Coda · Open Frontiers</p>
      <h1 className="fr-title">Emergence or Mirage?</h1>
      <p className="fr-lede">
        Abilities that switch on suddenly at scale are the headline evidence for a phase transition — a
        qualitative leap that scaling “unlocks.” But the model underneath improves <em>smoothly</em>. The
        cliff lives in the ruler, not the model. Switch the metric on one fixed competence curve and watch
        emergence appear and disappear.
      </p>

      <h2 className="fr-h2">Same model, two rulers</h2>
      <p className="fr-sub">
        Per-token accuracy (the model’s actual competence) climbs smoothly. Exact-match — every token in a{' '}
        {len}-step answer correct — is that same curve raised to the {len}th power. Toggle the metric.
      </p>

      <div className="fr-emg-toggle">
        <button className={`fr-mode${metric === 'exact' ? ' active' : ''}`} onClick={() => setMetric('exact')}>
          <span className="fr-mode-name">Exact match</span>
          <span className="fr-mode-sub">all-or-nothing · looks emergent</span>
        </button>
        <button className={`fr-mode${metric === 'token' ? ' active' : ''}`} onClick={() => setMetric('token')}>
          <span className="fr-mode-name">Per-token accuracy</span>
          <span className="fr-mode-sub">smooth · no cliff</span>
        </button>
      </div>

      <div className="fr-emg-chart">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Capability vs scale under two metrics">
          {/* gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map(g => (
            <g key={g}>
              <line x1={PAD_L} y1={yAt(g)} x2={W - PAD_R} y2={yAt(g)} className="fr-emg-grid" />
              <text x={PAD_L - 8} y={yAt(g) + 3} className="fr-emg-ytick">{g.toFixed(2)}</text>
            </g>
          ))}
          {/* axes labels */}
          <text x={PAD_L + PLOT_W / 2} y={H - 6} className="fr-emg-axis-label">model scale (log params) →</text>

          {/* exact-match area + line */}
          {metric === 'exact' && <polygon points={exactArea} className="fr-emg-area" />}
          <polyline points={exactLine} className={`fr-emg-line exact${metric === 'exact' ? ' bold' : ' ghost'}`} />
          {/* per-token line */}
          <polyline points={tokenLine} className={`fr-emg-line token${metric === 'token' ? ' bold' : ' ghost'}`} />

          {/* inspect marker */}
          <line x1={xAt(inspect)} y1={PAD_T} x2={xAt(inspect)} y2={yAt(0)} className="fr-emg-inspect" />
          <circle cx={xAt(inspect)} cy={yAt(insTok)} r="4.5" className="fr-emg-pt token" />
          <circle cx={xAt(inspect)} cy={yAt(insExact)} r="4.5" className="fr-emg-pt exact" />
        </svg>

        <div className="fr-emg-readout">
          <div className="fr-emg-read token">
            <span className="fr-emg-read-val">{(insTok * 100).toFixed(0)}%</span>
            <span className="fr-emg-read-lbl">per-token accuracy</span>
          </div>
          <div className="fr-emg-read exact">
            <span className="fr-emg-read-val">{(insExact * 100 < 1 ? (insExact * 100).toFixed(2) : (insExact * 100).toFixed(0))}%</span>
            <span className="fr-emg-read-lbl">{len}-token exact match</span>
          </div>
        </div>
      </div>

      <div className="fr-emg-sliders">
        <label className="fr-emg-slider-row">
          <span className="fr-emg-slider-lbl">inspect scale</span>
          <input type="range" min={0} max={1} step={0.01} value={inspect}
            onChange={e => setInspect(parseFloat(e.target.value))} className="fr-emg-slider" />
        </label>
        <label className="fr-emg-slider-row">
          <span className="fr-emg-slider-lbl">answer length · {len} tokens</span>
          <input type="range" min={1} max={48} step={1} value={len}
            onChange={e => setLen(parseInt(e.target.value))} className="fr-emg-slider" />
        </label>
      </div>

      <p className="fr-caption-note">
        Push <strong>answer length</strong> up and the exact-match curve sharpens into a cliff — pure
        artifact of raising a smooth number to a higher power. Pull it to 1 and the “emergence” melts into
        the same gentle slope as per-token accuracy. Nothing about the model changed. Only the ruler did.
      </p>

      {/* The honest both-sides */}
      <h2 className="fr-h2">But not all of it is a mirage</h2>
      <div className="fr-two">
        <div className="fr-card buys">
          <span className="fr-card-tag">The deflationary case is strong</span>
          <p>
            Schaeffer et al. show that on a controlled metric, most reported emergent abilities become smooth
            and predictable. Choose a discontinuous, all-or-nothing score and you manufacture cliffs from
            steady progress. Many headline “phase transitions” are this and nothing more.
          </p>
        </div>
        <div className="fr-card stops">
          <span className="fr-card-tag">The case is not closed</span>
          <p>
            It does not follow that <em>no</em> capability is genuinely discontinuous. Some skills — certain
            algorithmic or in-context behaviors — show breaks even under smooth metrics, and “predictable in
            hindsight” is not “predictable in advance.” The mirage argument dissolves the easy cases, not the
            interesting ones.
          </p>
        </div>
      </div>

      <div className="fr-callout">
        <strong>Why it matters for the comparison.</strong> The Machine Language tab leaned on “emergence”
        as if scale crossed a qualitative threshold into language-like competence. Much of that is a metric
        illusion — capability grows smoothly, and the bundle does not switch on at a magic parameter count.
        The genuine discontinuities, where they exist, are the ones worth arguing about.
      </div>
    </div>
  )
}
