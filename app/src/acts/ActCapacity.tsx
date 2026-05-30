import { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import { Eyebrow } from '../components/Eyebrow'

/* ── Fixed dimension values ──────────────────────────── */
const BASE_CODAS = 21   // catalogued CETI types
const ORNAMENT   = 2    // binary: on / off

/* ── Reference systems for comparison ───────────────── */
const REFERENCES = [
  { label: 'English phonemes',         n: 44,     note: '~44 distinct sounds in spoken English' },
  { label: 'Piano keys',               n: 88,     note: '88 distinct pitches on a concert piano' },
  { label: 'Whale coda space',         n: 0,      note: 'Combinatorial estimate — varies with resolution', whale: true },
  { label: 'Chinese characters (基本)', n: 3_500,  note: 'Commonly used characters for basic literacy' },
  { label: 'English words (active)',   n: 20_000, note: 'Typical educated adult active vocabulary' },
  { label: 'English words (OED)',      n: 170_000, note: 'Oxford English Dictionary headwords' },
]

const LOG_MIN = Math.log10(30)
const LOG_MAX = Math.log10(200_000)
export const logFrac = (n: number) => (Math.log10(Math.max(n, 31)) - LOG_MIN) / (LOG_MAX - LOG_MIN)

/* ── Animated counter hook ───────────────────────────── */
function useAnimatedValue(target: number) {
  const [displayed, setDisplayed] = useState(target)
  const curRef  = useRef(target)
  const rafRef  = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    const animate = () => {
      const diff = target - curRef.current
      if (Math.abs(diff) < 0.5) { curRef.current = target; setDisplayed(target); return }
      curRef.current += diff * 0.14
      setDisplayed(Math.round(curRef.current))
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target])

  return displayed
}

/* ── Slider control ──────────────────────────────────── */
function DimSlider({ label, sub, min, max, value, onChange }: {
  label: string; sub: string; min: number; max: number; value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lumen)', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--foam)', fontWeight: 500 }}>
          {value}
        </span>
      </div>
      <input type="range" min={min} max={max} step={1} value={value}
             onChange={e => onChange(parseInt(e.target.value, 10))}
             style={{ width: '100%', accentColor: 'var(--lumen)', cursor: 'pointer' }} />
      <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--shoal)', lineHeight: 1.4 }}>{sub}</p>
    </div>
  )
}

/* ── Comparison bar chart ────────────────────────────── */
function CompareChart({ whaleN }: { whaleN: number }) {
  const refs = REFERENCES.map(r => ({ ...r, n: r.whale ? whaleN : r.n }))
    .sort((a, b) => a.n - b.n)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {refs.map(r => {
        const frac = logFrac(r.n)
        return (
          <div key={r.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, alignItems: 'baseline' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: r.whale ? 'var(--lumen)' : 'var(--foam)',
                fontWeight: r.whale ? '600' : '400',
              }}>
                {r.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--shoal)' }}>
                {r.n.toLocaleString()}
              </span>
            </div>
            <div style={{ height: 10, background: 'var(--abyss-ink)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${frac * 100}%`, height: '100%', borderRadius: 3,
                background: r.whale
                  ? 'var(--lumen)'
                  : 'color-mix(in oklch, var(--foam) 40%, transparent)',
                boxShadow: r.whale ? '0 0 8px var(--lumen)' : 'none',
                transition: 'width 400ms var(--ease-glide)',
              }} />
            </div>
          </div>
        )
      })}
      <p style={{ margin: '6px 0 0', fontSize: 10, color: 'var(--shoal)', fontFamily: 'var(--font-mono)' }}>
        log₁₀ scale · drag sliders to move the whale bar
      </p>
    </div>
  )
}

/* ── ActCapacity ─────────────────────────────────────── */
export function ActCapacity() {
  const [tempo,  setTempo]  = useState(5)
  const [rubato, setRubato] = useState(5)
  const [ictus,  setIctus]  = useState(5)

  const total   = BASE_CODAS * tempo * rubato * ORNAMENT * ictus
  const animated = useAnimatedValue(total)

  const reset = useCallback(() => { setTempo(5); setRubato(5); setIctus(5) }, [])

  // Determine where the whale bar sits relative to references
  const aboveCount = REFERENCES.filter(r => !r.whale && r.n < total).length
  const posLabel = aboveCount <= 1 ? 'near the bottom of the scale'
    : aboveCount <= 2 ? 'above English phonemes and piano keys'
    : aboveCount <= 3 ? 'on par with a basic writing system'
    : 'in the range of an active human vocabulary'

  return (
    <section id="capacity" className="act" data-screen-label="08 Capacity">
      <div className="col-wide">
        <Eyebrow num={7}>Information capacity · how big is the space?</Eyebrow>
        <h2>Small vocabulary,<br /><span className="hl">vast combinatorial space</span></h2>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          Four continuous dimensions, each discretized into a handful of perceptible bands.
          How many distinct signals does that yield? Adjust the resolution sliders to see how
          the estimate climbs — and where it lands on the scale of human communication systems.
        </p>

        <div className="split-12-1" style={{ marginTop: 36, gap: 48, alignItems: 'start' }}>

          {/* LEFT — formula + sliders + counter */}
          <div>
            {/* formula */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, flexWrap: 'wrap', marginBottom: 32,
              fontFamily: 'var(--font-mono)', fontSize: 14,
            }}>
              {[
                { val: BASE_CODAS, dim: 'base codas',    fixed: true  },
                { val: tempo,      dim: 'tempo bands',   fixed: false },
                { val: rubato,     dim: 'rubato levels', fixed: false },
                { val: ORNAMENT,   dim: 'ornament',      fixed: true  },
                { val: ictus,      dim: 'ictus pos.',    fixed: false },
              ].map((item, i, arr) => (
                <Fragment key={item.dim}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      padding: '6px 14px', borderRadius: 4, minWidth: 40,
                      border: item.fixed ? '1px solid var(--line)' : '1px solid var(--lumen)',
                      background: item.fixed
                        ? 'transparent'
                        : 'color-mix(in oklch, var(--lumen) 10%, transparent)',
                      color: item.fixed ? 'var(--foam)' : 'var(--lumen)',
                      fontWeight: '600', fontSize: 18,
                      transition: 'all 150ms',
                    }}>
                      {item.val}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--shoal)', marginTop: 4, letterSpacing: '0.04em' }}>
                      {item.dim}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ color: 'var(--shoal)', fontSize: 18, paddingBottom: 16 }}>×</span>
                  )}
                </Fragment>
              ))}
              <span style={{ color: 'var(--shoal)', fontSize: 18, paddingBottom: 16 }}>=</span>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  padding: '6px 20px', borderRadius: 4,
                  border: '1px solid var(--lumen)',
                  background: 'color-mix(in oklch, var(--lumen) 14%, transparent)',
                  color: 'var(--lumen)', fontWeight: '700', fontSize: 18,
                  boxShadow: '0 0 12px color-mix(in oklch, var(--lumen) 20%, transparent)',
                }}>
                  {animated.toLocaleString()}
                </div>
                <div style={{ fontSize: 9, color: 'var(--shoal)', marginTop: 4, letterSpacing: '0.04em' }}>
                  distinct signals
                </div>
              </div>
            </div>

            {/* sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <DimSlider label="TEMPO RESOLUTION" min={2} max={10} value={tempo} onChange={setTempo}
                sub="Number of perceptually distinct tempo bands (fast→slow)." />
              <DimSlider label="RUBATO RESOLUTION" min={2} max={10} value={rubato} onChange={setRubato}
                sub="Number of perceptually distinct rubato levels (accelerando→decelerando)." />
              <DimSlider label="ICTUS POSITIONS" min={2} max={8} value={ictus} onChange={setIctus}
                sub="Max click positions that can carry an accent (0=none + positions 1…N)." />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button className="btn btn-ghost" onClick={reset} style={{ fontSize: 12 }}>
                Reset to defaults
              </button>
            </div>

            {/* context line */}
            <p style={{
              marginTop: 20, padding: '10px 14px',
              background: 'color-mix(in oklch, var(--lumen) 6%, transparent)',
              border: '1px solid color-mix(in oklch, var(--lumen) 20%, transparent)',
              borderRadius: 4, fontSize: 13, color: 'var(--foam)', lineHeight: 1.5,
            }}>
              At these settings, the whale coda space is{' '}
              <strong style={{ color: 'var(--lumen)' }}>{posLabel}</strong>.
            </p>
          </div>

          {/* RIGHT — comparison chart + explanation */}
          <div>
            <h3 style={{ marginTop: 0, fontSize: 20 }}>Where does it rank?</h3>
            <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65, marginBottom: 20 }}>
              Each bar is log-scaled — the difference between 44 and 170,000 spans more than three orders
              of magnitude. Drag the sliders to move the whale bar.
            </p>

            <CompareChart whaleN={total} />

            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                {
                  label: 'The resolution problem',
                  desc: 'These numbers depend on how finely whales can discriminate each dimension. CETI is collecting acoustic data to measure this — the sliders represent our current uncertainty.',
                },
                {
                  label: 'Meaning vs. signal',
                  desc: 'A large signal space doesn\'t prove language — Morse code has 36 symbols but carries human language. The question is whether distinct signals map to distinct meanings, which requires much more data.',
                },
                {
                  label: 'The combinatorial argument',
                  desc: 'What\'s remarkable is that four continuous dimensions, each modest on its own, combine multiplicatively. This is how phonemes work: ~44 English sounds combine into ~170,000 words.',
                },
              ].map(item => (
                <div key={item.label} style={{ borderLeft: '3px solid var(--line)', paddingLeft: 14 }}>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lumen)', letterSpacing: '0.05em' }}>
                    {item.label.toUpperCase()}
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--mist)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
