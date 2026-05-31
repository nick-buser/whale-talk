import { useState, useMemo } from 'react'
import {
  normalize,
  literalListener, pragmaticSpeaker, pragmaticListener,
  arousalLikelihood as computeArousalLikelihood,
  logLikelihood, fit,
} from '../../lib/rsa'
import {
  CAMPBELLS_STATE_LABELS, CAMPBELLS_SIGNAL_LABELS, CAMPBELLS_AROUSAL_LABELS,
  CAMPBELLS_OBSERVED, CAMPBELLS_PRIOR,
  CAMPBELLS_AROUSAL_STATE, CAMPBELLS_AROUSAL_SIGNAL,
  TITI_STATE_LABELS, TITI_SIGNAL_LABELS,
  TITI_OBSERVED, TITI_LIKELIHOOD, TITI_PRIOR,
} from '../../lib/rsa-data'

type System = 'campbells' | 'titi'

interface FitDisplay { alpha: number; logLik: number; S1: number[][] }

/* ── Color palettes ──────────────────────────────────────────── */
const C_STATE_COLORS = ['#ff6b54', '#b57bee', '#8ae04a', '#4afdc6']
const C_SIG_COLORS   = ['#d4854a', '#e8941a', '#f4c430', '#ffb472', '#c49a6c']
const T_STATE_COLORS = ['#ff6b54', '#b57bee', '#4afdc6']
const T_SIG_COLORS   = ['#e8941a', '#4afdc6', '#f4c430', '#b57bee']

/* ── StackedBar ─────────────────────────────────────────────── */
function StackedBar({ label, values, colors, dimLabel }: {
  label: string; values: number[]; colors: string[]; dimLabel: string
}) {
  const peak = Math.max(...values)
  const peakIdx = values.indexOf(peak)
  return (
    <div className="rsa-bar-row">
      <span className="rsa-bar-label" title={dimLabel}>{label}</span>
      <div className="rsa-bar-track">
        {values.map((v, i) => v > 0 && (
          <div key={i} className="rsa-bar-seg"
            style={{ width: `${v * 100}%`, background: colors[i] }}
            title={`${(v * 100).toFixed(1)}%`} />
        ))}
      </div>
      <span className="rsa-bar-peak" style={{ color: colors[peakIdx] }}>
        {(peak * 100).toFixed(0)}%
      </span>
    </div>
  )
}

/* ── MatrixPanel ─────────────────────────────────────────────── */
function MatrixPanel({ title, formula, rows, rowLabels, colLabels, colColors, note }: {
  title: string; formula: string; rows: number[][]
  rowLabels: readonly string[]; colLabels: readonly string[]
  colColors: string[]; note: string
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
            <span className="rsa-legend-dot" style={{ background: colColors[i] }} />{l}
          </span>
        ))}
      </div>
      {rows.map((row, i) => (
        <StackedBar key={i} label={rowLabels[i]} values={row} colors={colColors}
          dimLabel={colLabels.join(' / ')} />
      ))}
      <p className="rsa-matrix-note">{note}</p>
    </div>
  )
}

/* ── WeightMatrix editor ─────────────────────────────────────── */
function WeightMatrix({ title, rowLabels, colLabels, weights, onChange, normalizeBy }: {
  title: string; rowLabels: readonly string[]; colLabels: readonly string[]
  weights: number[][]; onChange: (row: number, col: number, val: number) => void
  normalizeBy: 'rows' | 'columns'
}) {
  const effectiveProbs = useMemo((): number[][] => {
    if (normalizeBy === 'rows') return weights.map(normalize)
    const nCols = weights[0]?.length ?? 0
    const colSums = Array.from({ length: nCols }, (_, j) =>
      weights.reduce((s, row) => s + (row[j] ?? 0), 0))
    return weights.map(row =>
      row.map((v, j) => colSums[j] === 0 ? 1 / weights.length : v / colSums[j]))
  }, [weights, normalizeBy])
  const nCols = colLabels.length
  return (
    <div className="rsa-weight-matrix">
      <span className="rsa-weight-title">{title}</span>
      <div className="rsa-weight-grid" style={{ gridTemplateColumns: `80px repeat(${nCols}, 1fr)` }}>
        <span />
        {colLabels.map(l => <span key={l} className="rsa-weight-col-hdr">{l}</span>)}
        {weights.map((row, r) => (
          <>
            <span key={`lbl-${r}`} className="rsa-weight-row-lbl">{rowLabels[r]}</span>
            {row.map((val, c) => (
              <div key={`${r}-${c}`} className="rsa-weight-cell">
                <input type="range" min="0" max="1" step="0.01" value={val}
                  onChange={e => onChange(r, c, parseFloat(e.target.value))} />
                <span className="rsa-weight-pct">{(effectiveProbs[r][c] * 100).toFixed(0)}%</span>
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  )
}

/* ── LikelihoodHeatmap ───────────────────────────────────────── */
function LikelihoodHeatmap({ likelihood, rowLabels, colLabels, colColors }: {
  likelihood: number[][]; rowLabels: readonly string[]
  colLabels: readonly string[]; colColors: string[]
}) {
  const nCols = colLabels.length
  return (
    <div className="rsa-heatmap" style={{ gridTemplateColumns: `80px repeat(${nCols}, 1fr)` }}>
      <span />
      {colLabels.map((l, i) => (
        <span key={i} className="rsa-heat-col-hdr" style={{ color: colColors[i] }}>{l}</span>
      ))}
      {likelihood.map((row, u) => (
        <>
          <span key={`lbl-${u}`} className="rsa-heat-row-lbl">{rowLabels[u]}</span>
          {row.map((v, s) => (
            <div key={`${u}-${s}`} className="rsa-heat-cell"
              style={{ background: `color-mix(in oklch, ${colColors[s]} ${Math.round(v * 85)}%, var(--surface))` }}
              title={`P(${rowLabels[u]} | ${colLabels[s]}) = ${(v * 100).toFixed(1)}%`}>
              {(v * 100).toFixed(0)}%
            </div>
          ))}
        </>
      ))}
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────────── */
function alphaHint(a: number): string {
  if (a < 0.3) return 'random — ignores informativeness'
  if (a < 1.5) return 'mild — slight preference for informative signals'
  if (a < 4)   return 'pragmatic — clear but not deterministic'
  if (a < 8)   return 'strongly pragmatic — highly peaked choices'
  return 'near-optimal — approaching deterministic argmax'
}

const ALPHA_GRID = Array.from({ length: 101 }, (_, i) => i * 0.1)  // 0.0 … 10.0

/* ── Main export ─────────────────────────────────────────────── */
export function PrimateRSA() {
  const [system, setSystem] = useState<System>('campbells')
  const [alpha, setAlpha] = useState(2)
  const [showArousal, setShowArousal] = useState(false)
  const [fitResult, setFitResult] = useState<FitDisplay | null>(null)

  const [asWeights, setAsWeights] = useState<number[][]>(
    () => CAMPBELLS_AROUSAL_STATE.map(r => [...r]),
  )
  const [sigWeights, setSigWeights] = useState<number[][]>(
    () => CAMPBELLS_AROUSAL_SIGNAL.map(r => [...r]),
  )

  const isC = system === 'campbells'
  const stateLabels  = isC ? CAMPBELLS_STATE_LABELS  : TITI_STATE_LABELS
  const signalLabels = isC ? CAMPBELLS_SIGNAL_LABELS : TITI_SIGNAL_LABELS
  const prior        = isC ? CAMPBELLS_PRIOR         : TITI_PRIOR
  const observed     = isC ? CAMPBELLS_OBSERVED      : TITI_OBSERVED
  const stateColors  = isC ? C_STATE_COLORS          : T_STATE_COLORS
  const sigColors    = isC ? C_SIG_COLORS            : T_SIG_COLORS

  const derivedLikelihood = useMemo((): number[][] =>
    isC ? computeArousalLikelihood(asWeights, sigWeights) : TITI_LIKELIHOOD
  , [isC, asWeights, sigWeights])

  // Arousal-only speaker: P(signal|state) straight from likelihood (no RSA)
  const arousalOnlyS0 = useMemo((): number[][] =>
    stateLabels.map((_, s) => signalLabels.map((_, u) => derivedLikelihood[u][s]))
  , [derivedLikelihood, stateLabels, signalLabels])

  const ll_arousal = useMemo(
    () => logLikelihood(observed, arousalOnlyS0),
    [observed, arousalOnlyS0],
  )

  const { L0, S1, L1 } = useMemo(() => {
    const costs = new Array(signalLabels.length).fill(0)
    const L0 = literalListener(derivedLikelihood, prior)
    const S1 = pragmaticSpeaker(L0, alpha, costs)
    const L1 = pragmaticListener(S1, prior)
    return { L0, S1, L1 }
  }, [derivedLikelihood, prior, alpha, signalLabels.length])

  function updAs(r: number, c: number, v: number) {
    setAsWeights(prev => prev.map((row, ri) => ri === r ? row.map((x, ci) => ci === c ? v : x) : row))
    setFitResult(null)  // stale after arousal edit
  }
  function updSig(r: number, c: number, v: number) {
    setSigWeights(prev => prev.map((row, ri) => ri === r ? row.map((x, ci) => ci === c ? v : x) : row))
    setFitResult(null)
  }
  function resetArousal() {
    setAsWeights(CAMPBELLS_AROUSAL_STATE.map(r => [...r]))
    setSigWeights(CAMPBELLS_AROUSAL_SIGNAL.map(r => [...r]))
    setFitResult(null)
  }
  function switchSystem(s: System) {
    setSystem(s)
    setFitResult(null)
  }

  function runGridSearch() {
    const costsGrid = [new Array(signalLabels.length).fill(0)]
    const result = fit(observed, derivedLikelihood, prior, ALPHA_GRID, costsGrid)
    setAlpha(result.alpha)   // snap slider to best-fit α
    setFitResult({ alpha: result.alpha, logLik: result.logLik, S1: result.S1 })
  }

  const displayS1 = fitResult ? fitResult.S1 : S1
  const displayAlpha = fitResult ? fitResult.alpha : alpha

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
          A <em>pragmatic speaker</em> (S₁) chooses signals that maximize L₀ informativeness,
          weighted by rationality α. A <em>pragmatic listener</em> (L₁) inverts S₁.
          Drag α to explore sharpening live — or press <strong>Fit α to data</strong> below
          to grid-search the best-fitting rationality parameter against the field corpus.
        </p>

        {/* System tabs */}
        <div className="rsa-system-tabs" style={{ marginBottom: 32 }}>
          <button className={`rsa-system-tab${isC ? ' active' : ''}`} onClick={() => switchSystem('campbells')}>
            Campbell's monkey
            <span className="rsa-system-sub">5 calls · 4 states · arousal model</span>
          </button>
          <button className={`rsa-system-tab${!isC ? ' active' : ''}`} onClick={() => switchSystem('titi')}>
            Titi monkey
            <span className="rsa-system-sub">4 signals · 3 states · direct lexicon</span>
          </button>
        </div>

        {/* Alpha slider */}
        <div className="rsa-alpha-row">
          <span className="rsa-alpha-label">Rationality α</span>
          <input type="range" min="0" max="10" step="0.1" value={alpha}
            className="rsa-alpha-slider"
            onChange={e => { setAlpha(parseFloat(e.target.value)); setFitResult(null) }} />
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
            <span className="rsa-formula-eq">∝ exp(α · log L₀ − cost)</span>
          </div>
          <div className="rsa-formula-arrow">→</div>
          <div className="rsa-formula-step">
            <span className="rsa-formula-name">L₁(state | signal)</span>
            <span className="rsa-formula-eq">∝ S₁(signal | state) · prior(state)</span>
          </div>
        </div>

        {/* Arousal editor (Campbell's only) */}
        {isC && (
          <div className="rsa-arousal-wrap">
            <button className="rsa-arousal-toggle" onClick={() => setShowArousal(v => !v)}>
              <span className="rsa-arousal-caret">{showArousal ? '▾' : '▸'}</span>
              Arousal model — edit P(arousal|state) and P(signal|arousal)
              <span className="rsa-arousal-badge">{showArousal ? 'click to collapse' : 'click to expand'}</span>
            </button>

            {showArousal && (
              <div className="rsa-arousal-body">
                <p className="rsa-arousal-desc">
                  The likelihood P(signal|state) is derived by marginalizing over latent arousal:
                  P(signal|state) = Σ_a P(signal|arousal=a) · P(arousal=a|state).
                  Edit the slider weights — normalization is automatic; the derived likelihood and
                  all RSA panels update live.
                </p>
                <div className="rsa-arousal-editors">
                  <WeightMatrix title="P(arousal | state)  — rows normalized"
                    rowLabels={CAMPBELLS_STATE_LABELS} colLabels={CAMPBELLS_AROUSAL_LABELS}
                    weights={asWeights} onChange={updAs} normalizeBy="rows" />
                  <div className="rsa-arousal-op">
                    <span>×</span>
                    <span className="rsa-arousal-op-sub">marginalise</span>
                  </div>
                  <WeightMatrix title="P(signal | arousal)  — columns normalized"
                    rowLabels={CAMPBELLS_SIGNAL_LABELS} colLabels={CAMPBELLS_AROUSAL_LABELS}
                    weights={sigWeights} onChange={updSig} normalizeBy="columns" />
                </div>
                <div className="rsa-arousal-result">
                  <div className="rsa-arousal-result-head">
                    <span className="rsa-arousal-result-label">→ Derived P(signal | state)</span>
                    <button className="rsa-reset-btn" onClick={resetArousal}>Reset defaults</button>
                  </div>
                  <LikelihoodHeatmap likelihood={derivedLikelihood}
                    rowLabels={CAMPBELLS_SIGNAL_LABELS} colLabels={CAMPBELLS_STATE_LABELS}
                    colColors={C_STATE_COLORS} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Three matrices */}
        <div className="rsa-matrices">
          <MatrixPanel title="L₀ · Literal Listener" formula="P(state | signal)"
            rows={L0} rowLabels={signalLabels} colLabels={stateLabels} colColors={stateColors}
            note="Bayesian inversion of the likelihood. No pragmatic reasoning — signals map to states proportionally to prior × likelihood." />
          <MatrixPanel title="S₁ · Pragmatic Speaker" formula="P(signal | state)"
            rows={S1} rowLabels={stateLabels} colLabels={signalLabels} colColors={sigColors}
            note="Speaker maximizes L₀ informativeness. At high α, each state selects the signal that best discriminates it from alternatives." />
          <MatrixPanel title="L₁ · Pragmatic Listener" formula="P(state | signal)"
            rows={L1} rowLabels={signalLabels} colLabels={stateLabels} colColors={stateColors}
            note="Inverts a pragmatic speaker. Sharper than L₀ — signals carry extra information because S₁ chose them informatively." />
        </div>

        {/* Fitting + comparison section */}
        <div className="rsa-compare">
          <div className="rsa-fit-header">
            <h3 className="rsa-compare-title">
              {fitResult ? `Model comparison — best-fit α = ${fitResult.alpha.toFixed(1)}` : 'Observed vs. S₁'}
            </h3>
            <button className="rsa-fit-btn" onClick={runGridSearch}>
              {fitResult ? '↺ Re-fit' : '▶ Fit α to data'}
            </button>
          </div>

          <p className="rsa-compare-sub">
            {fitResult
              ? `Grid search α ∈ [0, 10] step 0.1 against ${isC ? 'Zuberbühler 2001' : 'Berthet 2019'} corpus. Alpha slider snapped to best-fit. Three models compared below.`
              : `${isC ? 'Zuberbühler 2001' : 'Berthet 2019'} production frequencies vs. S₁ at α = ${alpha.toFixed(1)}. Press "Fit α to data" to run grid search.`
            }
          </p>

          {/* Fit scores */}
          {fitResult && (
            <div className="rsa-fit-scores">
              <div className="rsa-fit-score">
                <span className="rsa-fit-score-label">Arousal-only logLik</span>
                <span className="rsa-fit-score-val">{ll_arousal.toFixed(3)}</span>
              </div>
              <div className="rsa-fit-score rsa-fit-score--active">
                <span className="rsa-fit-score-label">RSA best-fit logLik</span>
                <span className="rsa-fit-score-val">{fitResult.logLik.toFixed(3)}</span>
              </div>
              <div className="rsa-fit-score">
                <span className="rsa-fit-score-label">Δ logLik (RSA gain)</span>
                <span className="rsa-fit-score-val"
                  style={{ color: fitResult.logLik > ll_arousal ? 'var(--krill)' : 'var(--fg-quiet)' }}>
                  {fitResult.logLik > ll_arousal ? '+' : ''}{(fitResult.logLik - ll_arousal).toFixed(3)}
                </span>
              </div>
              <div className="rsa-fit-score">
                <span className="rsa-fit-score-label">Best-fit α</span>
                <span className="rsa-fit-score-val">{fitResult.alpha.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Signal legend */}
          <div className="rsa-compare-legend">
            {signalLabels.map((l, i) => (
              <span key={i} className="rsa-legend-item">
                <span className="rsa-legend-dot" style={{ background: sigColors[i] }} />{l}
              </span>
            ))}
          </div>

          {/* Per-state bars — 2 rows before fit, 3 rows after */}
          {stateLabels.map((sl, s) => (
            <div key={s} className="rsa-compare-block">
              <span className="rsa-compare-state-label" style={{ color: stateColors[s] }}>{sl}</span>
              <div className="rsa-compare-rows">
                <StackedBar label="Observed"
                  values={observed[s]} colors={sigColors} dimLabel={signalLabels.join(' / ')} />
                {fitResult && (
                  <StackedBar label="Arousal"
                    values={arousalOnlyS0[s]} colors={sigColors} dimLabel={signalLabels.join(' / ')} />
                )}
                <StackedBar
                  label={fitResult ? `RSA α=${displayAlpha.toFixed(1)}` : `S₁ α=${alpha.toFixed(1)}`}
                  values={displayS1[s]} colors={sigColors} dimLabel={signalLabels.join(' / ')} />
              </div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="rsa-callout">
          {fitResult
            ? <>
                <strong>Reading the fit:</strong> Δ logLik measures how much better the RSA
                model explains observed production beyond the arousal-only baseline. A positive gain means
                the data prefer a speaker reasoning about informativeness. For Campbell's, the best-fit
                α typically falls in the 2–5 range — matching Schlenker et al.'s observation
                that call semantics sharpen pragmatically relative to the raw arousal gradient.
              </>
            : <>
                <strong>Why the arousal layer matters:</strong> A plain RSA lexicon for Campbell's
                would require a binary truth table. The arousal-gradient likelihood derives P(signal|state)
                from a two-step marginalization over latent arousal — matching the graded nature of primate
                call usage while staying parameter-sparse. Press "Fit α to data" to see whether the
                data require pragmatic sharpening on top of the arousal baseline.
              </>
          }
        </div>
      </div>
    </div>
  )
}
