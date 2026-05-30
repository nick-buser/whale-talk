import { useState } from 'react'

// ── Rank-frequency curve data (schematic, based on Yang 2013) ─────────────────

const N_RANKS = 25
const RANKS = Array.from({ length: N_RANKS }, (_, i) => i + 1)

function zipfF(r: number) { return 1 / r }
function nimF(r: number)  { return Math.max(0.006, Math.exp(-1.9 * (r - 1))) }

// Normalize to [0, 1]
const ZIPF_PTS = RANKS.map(r => ({ r, f: zipfF(r) / zipfF(1) }))
const NIM_PTS  = RANKS.map(r => ({ r, f: nimF(r)  / nimF(1)  }))

// SVG geometry
const VBW = 480, VBH = 280
const L = 56, R = 460, T = 16, B = 240
const PW = R - L, PH = B - T

function cx(r: number) { return L + (r - 1) / (N_RANKS - 1) * PW }
function cy(f: number) { return B - f * PH }

function makePath(pts: { r: number; f: number }[]) {
  return pts.map(({ r, f }, i) => `${i === 0 ? 'M' : 'L'}${cx(r).toFixed(1)},${cy(f).toFixed(1)}`).join(' ')
}

const ZIPF_PATH = makePath(ZIPF_PTS)
const NIM_PATH  = makePath(NIM_PTS)

const ZIPF_COLOR = '#ffb472'
const NIM_COLOR  = '#4afdc6'

// ── Curve metadata ────────────────────────────────────────────────────────────

interface CurveInfo {
  id: 'zipf' | 'nim'
  label: string
  color: string
  tag: string
  headline: string
  body: string
}

const CURVES: CurveInfo[] = [
  {
    id: 'zipf',
    label: 'Productive grammar (Zipf)',
    color: ZIPF_COLOR,
    tag: 'Expected if grammar is generative',
    headline: 'The Zipfian prediction',
    body: 'A learner using a productive combinatorial grammar should generate new phrase types at a rate proportional to vocabulary size. Frequency falls off as 1/rank — the classic Zipf distribution. Crucially, the distribution should have many hapax legomena (unique combinations) because a generative grammar continually produces novel forms. This is Yang\'s (2013) null hypothesis: if a system is productive, its type-frequency distribution must look Zipfian.',
  },
  {
    id: 'nim',
    label: 'Nim Chimpsky (actual)',
    color: NIM_COLOR,
    tag: 'What memorized phrases look like',
    headline: 'Nim\'s distribution',
    body: 'Nim Chimpsky\'s 19,000+ documented sign combinations are dominated by a handful of high-frequency formulaic phrases — "I me", "play me", "me play" — with a steep drop-off. The distribution is far too concentrated to be consistent with a productive grammar: there are not enough unique combinations relative to vocabulary size. Yang (2013) showed this fails the Zipfian productivity test at high significance. The pattern is exactly what you expect from a large inventory of memorized associations, not from a rule-generating system.',
  },
]

// ── How the test works ────────────────────────────────────────────────────────

const TEST_STEPS = [
  {
    n: '1',
    title: 'Predict the hapax rate',
    body: 'For a vocabulary of size N, a productive grammar used T times should generate approximately N × H_T / T unique combinations (hapax legomena), where H_T is the T-th harmonic number. The prediction is a specific number, not a qualitative intuition.',
  },
  {
    n: '2',
    title: 'Measure the actual rate',
    body: 'Count how many of the learner\'s actual combinations appear exactly once. For Nim: vocabulary ~125 signs, ~19,000 documented combinations. The predicted hapax count under Zipf is much higher than Nim\'s actual unique-type count.',
  },
  {
    n: '3',
    title: 'Compare distributions',
    body: 'If the actual type-frequency distribution does not match the Zipfian productive prediction — if it is too concentrated at high frequencies and lacks the long Zipfian tail — the system fails the test. Nim\'s data fails. Human child language data passes. This is the key result from Yang (2013, PNAS).',
  },
]

// ── Schlenker's framework ─────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    id: 'informativity',
    label: 'Informativity Principle',
    color: '#ffb472',
    body: 'Schlenker (2016) proposes that primate calls obey an Informativity Principle: signals should be at least as informative as alternatives. This formalizes why a general disturbance call (krak-oo) is used when there is no specific eagle threat — the specific eagle alarm would be misleading (too informative). The framework treats primate calls as having semantics governed by pragmatic constraints analogous to human scalar implicature.',
  },
  {
    id: 'urgency',
    label: 'Urgency Principle',
    color: '#4afdc6',
    body: 'The Urgency Principle governs call choice when multiple predators or threat levels are relevant: more urgent signals are produced when threats are more immediate. Together with Informativity, this gives Schlenker\'s "formal monkey linguistics" — a framework where calls have truth conditions and occur at the pragmatic optimum. The debate: is this a description of a semantic system, or does it re-describe conditioning/arousal in formal language without evidence of actual encoding?',
  },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function PrimateCompositionality() {
  const [curve, setCurve] = useState<'zipf' | 'nim'>('nim')

  const info = CURVES.find(c => c.id === curve)!

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Primates · Compositionality
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          The Productivity Test
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Yang (2013) showed that Nim Chimpsky's sign combinations fail a mathematical criterion
          derived from Zipf's law: a productive grammar generates too many unique forms to be
          mimicked by memorized phrases. Click a curve to read what the distributions mean.
        </p>

        {/* Chart + panel */}
        <div className="bird-intro-grid">
          <div className="bird-intro-plot-wrap">
            <svg viewBox={`0 0 ${VBW} ${VBH}`} width="100%" style={{ display: 'block' }}
                 aria-label="Rank-frequency comparison: productive grammar vs. Nim Chimpsky">

              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map(f => (
                <line key={f} x1={L} y1={cy(f)} x2={R} y2={cy(f)}
                      stroke="#b6c8df" strokeOpacity={0.12} strokeWidth={1} />
              ))}
              {[5, 10, 15, 20, 25].map(r => (
                <line key={r} x1={cx(r)} y1={T} x2={cx(r)} y2={B}
                      stroke="#b6c8df" strokeOpacity={0.12} strokeWidth={1} />
              ))}

              {/* Axes */}
              <line x1={L} y1={B} x2={R} y2={B} stroke="#b6c8df" strokeOpacity={0.35} strokeWidth={1.5} />
              <line x1={L} y1={T} x2={L} y2={B} stroke="#b6c8df" strokeOpacity={0.35} strokeWidth={1.5} />

              {/* Axis labels */}
              <text x={(L + R) / 2} y={B + 28} textAnchor="middle" fill="#b6c8df" fontSize={11}
                    fontFamily="IBM Plex Sans" opacity={0.65} letterSpacing="0.06em">
                RANK (by frequency) →
              </text>
              <text x={L - 30} y={(T + B) / 2} textAnchor="middle" fill="#b6c8df" fontSize={11}
                    fontFamily="IBM Plex Sans" opacity={0.65} letterSpacing="0.06em"
                    transform={`rotate(-90, ${L - 30}, ${(T + B) / 2})`}>
                RELATIVE FREQUENCY →
              </text>

              {/* X tick labels */}
              {[1, 5, 10, 15, 20, 25].map(r => (
                <text key={r} x={cx(r)} y={B + 14} textAnchor="middle"
                      fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>
                  {r}
                </text>
              ))}

              {/* Y tick labels */}
              {[0, 0.5, 1].map(f => (
                <text key={f} x={L - 6} y={cy(f) + 3} textAnchor="end"
                      fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>
                  {f === 1 ? '1.0' : f === 0.5 ? '0.5' : '0'}
                </text>
              ))}

              {/* Zipf curve */}
              <path d={ZIPF_PATH} fill="none" stroke={ZIPF_COLOR}
                    strokeWidth={curve === 'zipf' ? 2.5 : 1.5}
                    strokeOpacity={curve === 'zipf' ? 1 : 0.4}
                    style={curve === 'zipf' ? { filter: `drop-shadow(0 0 6px ${ZIPF_COLOR})` } : undefined}
              />

              {/* Nim curve */}
              <path d={NIM_PATH} fill="none" stroke={NIM_COLOR}
                    strokeWidth={curve === 'nim' ? 2.5 : 1.5}
                    strokeOpacity={curve === 'nim' ? 1 : 0.4}
                    style={curve === 'nim' ? { filter: `drop-shadow(0 0 6px ${NIM_COLOR})` } : undefined}
              />

              {/* Schematic label */}
              <text x={R - 4} y={T + 4} textAnchor="end" fill="#b6c8df"
                    fontSize={9} fontFamily="IBM Plex Mono" opacity={0.35}>
                schematic
              </text>

              {/* Legend — clickable */}
              {CURVES.map((c, i) => (
                <g key={c.id} style={{ cursor: 'pointer' }}
                   onClick={() => setCurve(c.id)}
                   role="button" aria-label={c.label}>
                  <rect x={L + 8} y={T + 8 + i * 22} width={16} height={3} rx={1.5}
                        fill={c.color} opacity={curve === c.id ? 1 : 0.45} />
                  <text x={L + 30} y={T + 13 + i * 22} fill={c.color}
                        fontSize={10} fontFamily="IBM Plex Sans"
                        opacity={curve === c.id ? 1 : 0.45}>
                    {c.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <aside className="bird-syntax-panel">
            <span className="bird-syntax-badge" style={{
              color: info.color,
              borderColor: `color-mix(in oklch, ${info.color} 40%, transparent)`,
              background: `color-mix(in oklch, ${info.color} 8%, transparent)`,
            }}>
              {info.tag}
            </span>
            <h3 className="bird-info-title" style={{ color: info.color, marginTop: 14 }}>
              {info.headline}
            </h3>
            <p className="bird-info-body">{info.body}</p>
          </aside>
        </div>

        {/* How the test works */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg)', margin: '56px 0 20px' }}>
          How the Test Works
        </h3>

        <div className="primate-comp-steps">
          {TEST_STEPS.map(step => (
            <div key={step.n} className="primate-comp-step">
              <span className="primate-comp-step-n">{step.n}</span>
              <div>
                <p className="primate-comp-step-title">{step.title}</p>
                <p className="primate-comp-step-body">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Schlenker framework */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg)', margin: '52px 0 8px' }}>
          The Semantics Alternative: Formal Monkey Linguistics
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.65, margin: '0 0 20px', maxWidth: 560 }}>
          Schlenker (2016) argues that even without syntax, primate calls can be assigned
          truth-conditional semantics governed by pragmatic principles — a framework he calls
          "formal monkey linguistics."
        </p>

        <div className="primate-secondary-grid">
          {PRINCIPLES.map(p => (
            <div key={p.id} className="primate-secondary-card open" style={{ '--item-color': p.color } as React.CSSProperties}>
              <div className="primate-secondary-header">
                <span className="primate-secondary-title" style={{ color: p.color }}>{p.label}</span>
              </div>
              <p className="primate-secondary-body">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Titi callout */}
        <div className="bird-intro-callout" style={{ marginTop: 40 }}>
          <p className="bird-intro-callout-label">Berthet et al. 2026 — titi monkey</p>
          <p>
            A comprehensive review of titi monkey vocalizations found that apparent semantic
            specificity is better explained by arousal gradients combined with receiver pragmatic
            inference — rather than encoded discrete categories. The most "word-like" primate
            calls deflate to conditioned arousal + interpretation when tested rigorously.
            The bar for demonstrating encoding rather than arousal keeps rising.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '2013', label: 'Yang — Zipfian productivity test applied to Nim\'s 19,000+ combinations in PNAS' },
            { val: '0',    label: 'Non-human primate species whose combinations pass the Yang productivity criterion' },
            { val: '2016', label: 'Schlenker — "formal monkey linguistics" framework with Informativity and Urgency principles' },
          ].map(s => (
            <div key={s.label} className="stat-cell">
              <span className="stat-val" style={{ color: 'var(--krill)', fontFamily: 'var(--font-display)' }}>
                {s.val}
              </span>
              <span className="stat-label" style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
