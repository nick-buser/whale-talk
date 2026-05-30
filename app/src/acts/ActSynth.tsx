import { useState, useMemo, useCallback } from 'react'
import { CODAS, CODA_MODIFIERS } from '../lib/data'
import { whaleAudio } from '../lib/audio'
import { Eyebrow } from '../components/Eyebrow'
import { applyMods } from '../lib/coda-dsl'

/* ── Live coda timeline ──────────────────────────────────── */
function Timeline({ intervals, baseClicks, ictus, tick }: {
  intervals: number[]
  baseClicks: number   // clicks before any ornament
  ictus: number        // 1-based, 0 = none
  tick: number         // -1 = idle, 0..N = active click
}) {
  const times: number[] = [0]
  for (const iv of intervals) times.push(times[times.length - 1] + iv)
  const span = times[times.length - 1] || 0.01

  const W = 480, H = 108
  const PL = 20, PR = 20, PT = 26, DOT_Y = H / 2 - 14
  const x = (t: number) => PL + (t / span) * (W - PL - PR)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* baseline */}
      <line x1={PL} x2={W - PR} y1={H / 2} y2={H / 2} stroke="rgba(238,243,250,0.08)" />

      {/* interval duration labels */}
      {intervals.map((iv, i) => (
        <text key={i}
          x={(x(times[i]) + x(times[i + 1])) / 2} y={H - 4}
          fill="#5b82b8" fontFamily="IBM Plex Mono" fontSize="9" textAnchor="middle">
          {Math.round(iv * 1000)}
        </text>
      ))}
      <text x={W - PR} y={H - 4} fill="#5b82b8" fontFamily="IBM Plex Mono" fontSize="8" textAnchor="end">ms</text>

      {/* clicks */}
      {times.map((t, i) => {
        const isOrn  = i >= baseClicks
        const isIct  = !isOrn && ictus > 0 && i === ictus - 1
        const isHit  = i === tick
        const r      = isIct ? 8 : isOrn ? 4 : 6
        const dotFill = isHit ? '#c6ffe6' : isOrn ? 'rgba(74,253,198,0.25)' : '#4afdc6'
        const linCol  = isHit ? '#c6ffe6' : isOrn ? 'rgba(74,253,198,0.35)' : 'rgba(74,253,198,0.55)'

        return (
          <g key={i}>
            <line x1={x(t)} x2={x(t)} y1={PT} y2={H / 2 + 6}
              stroke={linCol} strokeWidth={isIct ? 2.5 : 1.5}
              strokeDasharray={isOrn ? '3 3' : undefined}
              style={{ filter: isHit ? 'drop-shadow(0 0 8px #4afdc6)' : undefined }} />
            <circle cx={x(t)} cy={DOT_Y} r={r}
              fill={dotFill}
              stroke={isIct ? 'rgba(255,255,255,0.8)' : 'none'} strokeWidth={1.5}
              style={{ filter: isHit ? 'drop-shadow(0 0 10px #00ffc4)' : isIct ? 'drop-shadow(0 0 5px rgba(255,255,255,0.4))' : undefined }} />
            <text x={x(t)} y={PT - 5}
              fill={isHit ? '#c6ffe6' : '#5b82b8'}
              fontFamily="IBM Plex Mono" fontSize="8" textAnchor="middle">
              {i + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── Labelled range slider ───────────────────────────────── */
function Slider({ label, min, max, step, value, onChange, fmt, hint }: {
  label: string; min: number; max: number; step: number; value: number
  onChange: (v: number) => void; fmt: (v: number) => string; hint: string
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lumen)', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--foam)', fontWeight: 500 }}>
          {fmt(value)}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--lumen)', cursor: 'pointer' }} />
      <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--shoal)', lineHeight: 1.4 }}>{hint}</p>
    </div>
  )
}

/* ── ActSynth ────────────────────────────────────────────── */
export function ActSynth() {
  const [codaIdx, setCodaIdx] = useState(0)
  const [tempo,   setTempo]   = useState(1)
  const [rubato,  setRubato]  = useState(0)
  const [orn,     setOrn]     = useState(false)
  const [ictus,   setIctus]   = useState(0)
  const [tick,    setTick]    = useState(-1)
  const [playing, setPlaying] = useState(false)

  const coda       = CODAS[codaIdx]
  const baseClicks = coda.intervals.length + 1
  const effIctus   = Math.min(ictus, baseClicks)

  const modIntervals = useMemo(
    () => applyMods(coda.intervals, tempo, rubato, orn),
    [coda, tempo, rubato, orn]
  )

  const totalClicks  = modIntervals.length + 1
  const totalMs      = Math.round(modIntervals.reduce((s, v) => s + v, 0) * 1000)

  const play = useCallback(() => {
    void whaleAudio.resume()
    setPlaying(true)
    setTick(-1)
    whaleAudio.playCoda(modIntervals, {
      onClick: (i) => {
        setTick(i)
        if (effIctus > 0 && i === effIctus - 1)
          whaleAudio.click(whaleAudio.now() + 0.001, { gain: 1.25 })
        if (i === totalClicks - 1)
          setTimeout(() => { setPlaying(false); setTick(-1) }, 300)
      },
    })
  }, [modIntervals, effIctus, totalClicks])

  const reset = useCallback(() => {
    setTempo(1); setRubato(0); setOrn(false); setIctus(0)
  }, [])

  const selectCoda = useCallback((i: number) => {
    setCodaIdx(i); setTempo(1); setRubato(0); setOrn(false); setIctus(0)
  }, [])

  const activeIds = new Set([
    tempo !== 1    && 'tempo',
    rubato !== 0   && 'rubato',
    orn            && 'ornament',
    effIctus > 0   && 'ictus',
  ].filter(Boolean) as string[])

  return (
    <section id="synth" className="act" data-screen-label="05 Synth">
      <div className="col-wide">
        <Eyebrow num={4}>CETI phonetics · four orthogonal axes</Eyebrow>
        <h2>One coda, <span className="hl">four degrees</span> of freedom</h2>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          Project CETI showed that sperm-whale codas vary along exactly four independent dimensions —
          the same combinatorial structure that underlies human vowel space. Adjust the dials. Hear the coda morph.
        </p>

        <div className="split-12-1" style={{ marginTop: 32, gap: 44, alignItems: 'start' }}>

          {/* ── LEFT: interactive synth ── */}
          <div>
            {/* coda picker */}
            <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-mono)', fontSize: 11,
                        color: 'var(--shoal)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Base coda
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
              {CODAS.map((c, i) => (
                <button key={c.name} onClick={() => selectCoda(i)} style={{
                  padding: '5px 11px', borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  background: i === codaIdx ? 'color-mix(in oklch, var(--lumen) 12%, transparent)' : 'transparent',
                  border:     i === codaIdx ? '1px solid var(--lumen)' : '1px solid var(--line)',
                  color:      i === codaIdx ? 'var(--lumen)' : 'var(--foam)',
                  transition: 'all 140ms var(--ease-glide)',
                }}>
                  {c.name}
                </button>
              ))}
            </div>

            {/* live timeline */}
            <div className="panel panel--lumen" style={{ padding: '18px 20px 10px', marginBottom: 22 }}>
              <span className="corner mono">{coda.name} · {totalClicks} clicks · {totalMs} ms</span>
              <Timeline intervals={modIntervals} baseClicks={baseClicks} ictus={effIctus} tick={tick} />
            </div>

            {/* four controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Slider label="TEMPO" min={0.5} max={2.0} step={0.05} value={tempo} onChange={setTempo}
                fmt={v => `×${v.toFixed(2)}`}
                hint="Scales all inter-click intervals uniformly — a discrete fast/slow gear shift." />

              <Slider label="RUBATO" min={-1} max={1} step={0.05} value={rubato} onChange={setRubato}
                fmt={v => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))}
                hint="A smooth linear ramp: positive = accelerando (speeds up across the coda); negative = decelerando." />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lumen)', letterSpacing: '0.06em' }}>
                    ORNAMENT
                  </span>
                  <button onClick={() => setOrn(o => !o)} style={{
                    padding: '3px 14px', borderRadius: 4, cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    background: orn ? 'color-mix(in oklch, var(--lumen) 12%, transparent)' : 'transparent',
                    border:     orn ? '1px solid var(--lumen)' : '1px solid var(--line)',
                    color:      orn ? 'var(--lumen)' : 'var(--foam)',
                    transition: 'all 140ms var(--ease-glide)',
                  }}>
                    {orn ? '✓ on' : 'off'}
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--shoal)', lineHeight: 1.4 }}>
                  Appends a short grace click. Appears as a dashed line and smaller dot at the end of the timeline.
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lumen)', letterSpacing: '0.06em' }}>
                    ICTUS
                  </span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[0, ...Array.from({ length: baseClicks }, (_, i) => i + 1)].map(n => (
                      <button key={n} onClick={() => setIctus(n)} style={{
                        width: 26, height: 26, borderRadius: 4, cursor: 'pointer', padding: 0,
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        background: effIctus === n ? 'color-mix(in oklch, var(--lumen) 12%, transparent)' : 'transparent',
                        border:     effIctus === n ? '1px solid var(--lumen)' : '1px solid var(--line)',
                        color:      effIctus === n ? 'var(--lumen)' : 'var(--shoal)',
                        transition: 'all 140ms var(--ease-glide)',
                      }}>
                        {n === 0 ? '—' : n}
                      </button>
                    ))}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--shoal)', lineHeight: 1.4 }}>
                  Adds a louder accent to one click. Shown as a larger, ringed dot on the timeline.
                </p>
              </div>
            </div>

            {/* play + reset */}
            <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
              <button className="btn btn-primary" onClick={play} disabled={playing}>
                {playing ? '◉ Playing…' : '► Play'}
              </button>
              <button className="btn btn-ghost" onClick={reset}>Reset</button>
            </div>
          </div>

          {/* ── RIGHT: dimension explainers ── */}
          <div>
            <h3 style={{ marginTop: 0, fontSize: 20 }}>Why four dimensions?</h3>
            <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65 }}>
              CETI researchers showed that these four axes are <em>orthogonal</em> — each independently
              adds information, like F1 and F2 formants in the human vowel chart. A small base vocabulary
              becomes a large combinatorial space.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
              {CODA_MODIFIERS.map(m => {
                const on = activeIds.has(m.id)
                return (
                  <div key={m.id} style={{
                    borderLeft: `3px solid ${on ? 'var(--lumen)' : 'var(--line)'}`,
                    paddingLeft: 14,
                    transition: 'border-color 200ms var(--ease-glide)',
                  }}>
                    <strong style={{
                      display: 'block', marginBottom: 4,
                      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.05em',
                      color: on ? 'var(--lumen)' : 'var(--foam)',
                      transition: 'color 200ms var(--ease-glide)',
                    }}>
                      {m.name.toUpperCase()}
                    </strong>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--mist)', lineHeight: 1.5 }}>{m.desc}</p>
                  </div>
                )
              })}
            </div>

            <div className="panel" style={{ marginTop: 28, padding: 20 }}>
              <div className="bignum">
                ~6,300<span className="unit">codas</span>
              </div>
              <p className="small" style={{ marginTop: 8 }}>
                Rough combinatorial bound: 21 base types × 6 tempo bands × 5 rubato levels × 2 ornament
                × 5 ictus positions ≈ 6,300 perceptually distinct signals.
                The full CETI repertoire hasn&apos;t been catalogued — the ceiling is unknown.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
