import { useState, useMemo } from 'react'
import { literalListener, pragmaticSpeaker, pragmaticListener } from '../../lib/rsa'
import {
  CAMPBELLS_STATE_LABELS, CAMPBELLS_SIGNAL_LABELS,
  CAMPBELLS_OBSERVED, CAMPBELLS_LIKELIHOOD, CAMPBELLS_PRIOR,
  TITI_STATE_LABELS, TITI_SIGNAL_LABELS,
  TITI_OBSERVED, TITI_LIKELIHOOD, TITI_PRIOR,
} from '../../lib/rsa-data'

type System = 'campbells' | 'titi'

/* ── Color palettes per dimension ───────────────────────────── */
const C_STATE_COLORS = ['#ff6b54', '#b57bee', '#8ae04a', '#4afdc6']
const C_SIG_COLORS   = ['#d4854a', '#e8941a', '#f4c430', '#ffb472', '#c49a6c']
const T_STATE_COLORS = ['#ff6b54', '#b57bee', '#4afdc6']
const T_SIG_COLORS   = ['#e8941a', '#4afdc6', '#f4c430', '#b57bee']

/* ── Sub-components ─────────────────────────────────────────── */

function StackedBar({ label, values, colors, dimLabel }: {
  label: string
  values: number[]
  colors: string[]
  dimLabel: string
}) {
  const peak = Math.max(...values)
  const peakIdx = values.indexOf(peak)
  return (
    <div className="rsa-bar-row">
      <span className="rsa-bar-label" title={dimLabel}>{label}</span>
      <div className="rsa-bar-track">
        {values.map((v, i) => (
          v > 0 && (
            <div key={i} className="rsa-bar-seg"
              style={{ width: `${v * 100}%`, background: colors[i] }}
              title={`${(v * 100).toFixed(1)}%`}
            />
          )
        ))}
      </div>
      <span className="rsa-bar-peak" style={{ color: colors[peakIdx] }}>
        {(peak * 100).toFixed(0)}%
      </span>
    </div>
  )
}

function MatrixPanel({ title, formula, rows, rowLabels, colLabels, colColors, note }: {
  title: string
  formula: string
  rows: number[][]
  rowLabels: readonly string[]
  colLabels: readonly string[]
  colColors: string[]
  note: string
}) {
  return (
    <div className="rsa-matrix-panel">
      <div className="rsa-matrix-head">
        <span className="rsa-matrix-title">{title}</span>
        <span className="rsa-matrix-formula">{formula}</span>
      </div>
      <div className="rsa-matrix-legend">
        {colLabels.map((l, i) => (
          <span key={i} className="rsa-legend-item">
            <span className="rsa-legend-dot" style={{ background: colColors[i] }} />
            {l}
          </span>
        ))}
      </div>
      {rows.map((row, i) => (
        <StackedBar key={i} label={rowLabels[i]} values={row} colors={colColors} dimLabel={colLabels.join(' / ')} />
      ))}
      <p className="rsa-matrix-note">{note}</p>
    </div>
  )
}

/* ── Alpha hint ─────────────────────────────────────────────── */
function alphaHint(a: number): string {
  if (a < 0.3) return 'random — model ignores informativeness'
  if (a < 1.5) return 'mild — slight preference for informative signals'
  if (a < 4)   return 'pragmatic — clear but not deterministic sharpening'
  if (a < 8)   return 'strongly pragmatic — highly peaked choices'
  return 'near-optimal — approaching deterministic argmax'
}

/* ── Main component ─────────────────────────────────────────── */
export function PrimateRSA() {
  const [system, setSystem] = useState<System>('campbells')
  const [alpha, setAlpha] = useState(2)

  const isC = system === 'campbells'
  const stateLabels  = isC ? CAMPBELLS_STATE_LABELS  : TITI_STATE_LABELS
  const signalLabels = isC ? CAMPBELLS_SIGNAL_LABELS : TITI_SIGNAL_LABELS
  const likelihood   = isC ? CAMPBELLS_LIKELIHOOD    : TITI_LIKELIHOOD
  const prior        = isC ? CAMPBELLS_PRIOR         : TITI_PRIOR
  const observed     = isC ? CAMPBELLS_OBSERVED      : TITI_OBSERVED
  const stateColors  = isC ? C_STATE_COLORS          : T_STATE_COLORS
  const sigColors    = isC ? C_SIG_COLORS            : T_SIG_COLORS

  const { L0, S1, L1 } = useMemo(() => {
    const costs = new Array(signalLabels.length).fill(0)
    const L0 = literalListener(likelihood, prior)
    const S1 = pragmaticSpeaker(L0, alpha, costs)
    const L1 = pragmaticListener(S1, prior)
    return { L0, S1, L1 }
  }, [likelihood, prior, alpha, signalLabels.length])

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Primates · Bayesian Pragmatics
        </p>
        <h2 className="rsa-page-title">RSA: L₀ → S₁ → L₁</h2>
        <p className="lede" style={{ marginBottom: 40 }}>
          The Rational Speech Acts model treats communication as nested Bayesian inference.
          A <em>literal listener</em> (L₀) inverts the arousal-gradient likelihood.
          A <em>pragmatic speaker</em> (S₁) chooses signals that maximize
          L₀ informativeness, weighted by rationality α. A <em>pragmatic listener</em> (L₁)
          inverts S₁. Each layer sharpens state inference — drag the α slider to see it live.
        </p>

        {/* System tabs */}
        <div className="rsa-system-tabs" style={{ marginBottom: 32 }}>
          <button
            className={`rsa-system-tab${isC ? ' active' : ''}`}
            onClick={() => setSystem('campbells')}
          >
            Campbell's monkey
            <span className="rsa-system-sub">5 calls · 4 states · arousal model</span>
          </button>
          <button
            className={`rsa-system-tab${!isC ? ' active' : ''}`}
            onClick={() => setSystem('titi')}
          >
            Titi monkey
            <span className="rsa-system-sub">4 signals · 3 states · direct lexicon</span>
          </button>
        </div>

        {/* Alpha slider */}
        <div className="rsa-alpha-row">
          <span className="rsa-alpha-label">Rationality α</span>
          <input
            type="range" min="0" max="10" step="0.1" value={alpha}
            className="rsa-alpha-slider"
            onChange={e => setAlpha(parseFloat(e.target.value))}
          />
          <span className="rsa-alpha-val">{alpha.toFixed(1)}</span>
          <span className="rsa-alpha-hint">{alphaHint(alpha)}</span>
        </div>

        {/* Formula strip */}
        <div className="rsa-formula-strip">
          <div className="rsa-formula-step">
            <span className="rsa-formula-name">L₀(state | signal)</span>
            <span className="rsa-formula-eq">∝ likelihood(signal, state) · prior(state)</span>
          </div>
          <div className="rsa-formula-arrow">→</div>
          <div className="rsa-formula-step rsa-formula-step--active">
            <span className="rsa-formula-name">S₁(signal | state)</span>
            <span className="rsa-formula-eq">∝ exp(α · log L₀(state | signal) − cost)</span>
          </div>
          <div className="rsa-formula-arrow">→</div>
          <div className="rsa-formula-step">
            <span className="rsa-formula-name">L₁(state | signal)</span>
            <span className="rsa-formula-eq">∝ S₁(signal | state) · prior(state)</span>
          </div>
        </div>

        {/* Three matrices */}
        <div className="rsa-matrices">
          <MatrixPanel
            title="L₀ · Literal Listener"
            formula="P(state | signal)"
            rows={L0}
            rowLabels={signalLabels}
            colLabels={stateLabels}
            colColors={stateColors}
            note="Direct Bayesian inversion of the arousal-gradient likelihood. No pragmatic reasoning — each signal maps to states proportionally to prior × likelihood."
          />
          <MatrixPanel
            title="S₁ · Pragmatic Speaker"
            formula="P(signal | state)"
            rows={S1}
            rowLabels={stateLabels}
            colLabels={signalLabels}
            colColors={sigColors}
            note="Speaker maximizes L₀ informativeness. At high α, each state selects the signal that best discriminates it from all alternatives."
          />
          <MatrixPanel
            title="L₁ · Pragmatic Listener"
            formula="P(state | signal)"
            rows={L1}
            rowLabels={signalLabels}
            colLabels={stateLabels}
            colColors={stateColors}
            note="Listener inverts a pragmatic speaker. Sharper than L₀ — signals now carry the extra information that S₁ chose them informatively."
          />
        </div>

        {/* Observed vs S₁ */}
        <div className="rsa-compare">
          <h3 className="rsa-compare-title">Observed production vs. S₁ prediction</h3>
          <p className="rsa-compare-sub">
            Field-recorded call frequencies (Zuberbühler 2001; Berthet 2019) vs. the current
            S₁ at α = {alpha.toFixed(1)}. The fitting section (coming next) will grid-search α
            to minimize the gap.
          </p>
          <div className="rsa-compare-legend">
            {signalLabels.map((l, i) => (
              <span key={i} className="rsa-legend-item">
                <span className="rsa-legend-dot" style={{ background: sigColors[i] }} />
                {l}
              </span>
            ))}
          </div>
          {stateLabels.map((sl, s) => (
            <div key={s} className="rsa-compare-block">
              <span className="rsa-compare-state-label" style={{ color: stateColors[s] }}>{sl}</span>
              <div className="rsa-compare-rows">
                <StackedBar label="Observed" values={observed[s]} colors={sigColors} dimLabel={signalLabels.join(' / ')} />
                <StackedBar label="S₁ model" values={S1[s]}      colors={sigColors} dimLabel={signalLabels.join(' / ')} />
              </div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="rsa-callout">
          <strong>Why the arousal layer matters:</strong> A plain RSA lexicon for Campbell's
          would require a binary truth table (does call X apply to state Y?). The arousal-gradient
          likelihood instead derives P(signal | state) from a two-step marginalization over latent
          arousal — matching the gradient nature of primate call usage while keeping the model
          parameter-sparse. Fitting α against observed frequencies shows how much pragmatic
          sharpening the data require on top of the arousal baseline.
        </div>
      </div>
    </div>
  )
}
