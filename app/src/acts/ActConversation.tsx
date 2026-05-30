import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { CODAS } from '../lib/data'
import { whaleAudio } from '../lib/audio'
import { Eyebrow } from '../components/Eyebrow'

/* ── Synthetic exchange data ─────────────────────────────
   Timing derived from Eastern Caribbean socialising recordings
   (Rendell & Whitehead 2003). Response gaps and coda types
   are realistic; exact sequence is illustrative.              */
interface ExchangeEvent { whale: string; t: number; coda: string }

const EXCHANGE: ExchangeEvent[] = [
  // Opening — W1 initiates, W2 responds
  { whale: 'W1', t:  0.0,  coda: '5R1'     },
  { whale: 'W2', t:  2.3,  coda: '4+1'     },
  { whale: 'W1', t:  4.8,  coda: '1+1+3'   },
  { whale: 'W2', t:  7.8,  coda: '5R1'     },
  // Rapid back-and-forth
  { whale: 'W1', t:  9.9,  coda: '5R1'     },
  { whale: 'W2', t: 11.6,  coda: '5R1'     },  // echo ←
  { whale: 'W1', t: 13.5,  coda: '2+1+1+1' },
  // W3 joins
  { whale: 'W3', t: 16.2,  coda: '5R1'     },
  { whale: 'W2', t: 18.2,  coda: '4+1'     },
  { whale: 'W1', t: 20.5,  coda: '1+1+3'   },
  { whale: 'W3', t: 23.0,  coda: '4+1'     },
  { whale: 'W2', t: 25.3,  coda: '1+1+3'   },
  // Exchange slows — longer gaps
  { whale: 'W1', t: 29.5,  coda: '5R1'     },
  { whale: 'W2', t: 32.5,  coda: '5R1'     },  // echo ←
  { whale: 'W3', t: 36.8,  coda: '4+1'     },
]

const TOTAL_DUR = 39  // seconds (last event + tail)
const WHALES    = ['W1', 'W2', 'W3'] as const
const W_COLOR: Record<string, string> = {
  W1: '#4afdc6', W2: '#c6ffe6', W3: '#ffb472',
}

function codaDur(name: string) {
  const c = CODAS.find(c => c.name === name)
  return c ? c.intervals.reduce((s, v) => s + v, 0) : 0.8
}

/* ── Derived stats ───────────────────────────────────── */
function calcStats() {
  const gaps: number[] = []
  for (let i = 1; i < EXCHANGE.length; i++) {
    const prev = EXCHANGE[i - 1], cur = EXCHANGE[i]
    if (prev.whale !== cur.whale)
      gaps.push(cur.t - (prev.t + codaDur(prev.coda)))
  }
  const echoes = EXCHANGE.filter((e, i) =>
    i > 0 && EXCHANGE[i-1].whale !== e.whale && EXCHANGE[i-1].coda === e.coda
  ).length
  const turns = Object.fromEntries(WHALES.map(w => [w, EXCHANGE.filter(e => e.whale === w).length]))
  const avgGap = gaps.reduce((s, v) => s + v, 0) / gaps.length
  const minGap = Math.min(...gaps)
  return { avgGap, minGap, echoes, turns }
}

const STATS = calcStats()

/* ── Timeline SVG ────────────────────────────────────── */
function Timeline({ playheadT, activeIdx, onClickEvent }: {
  playheadT: number    // current time in seconds, -1 = idle
  activeIdx: number    // currently highlighted event index, -1 = none
  onClickEvent: (i: number) => void
}) {
  const [hovered, setHovered] = useState(-1)
  const W = 620, PL = 38, PR = 12, PT = 20, PB = 22, TRACK = 52
  const H = PT + WHALES.length * TRACK + PB

  const tx = (t: number) => PL + (t / TOTAL_DUR) * (W - PL - PR)
  const ty = (whale: string) => PT + WHALES.indexOf(whale as typeof WHALES[number]) * TRACK + TRACK / 2

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* tracks */}
      {WHALES.map((w, wi) => {
        const y0 = PT + wi * TRACK
        return (
          <g key={w}>
            <rect x={0} y={y0 + 2} width={W} height={TRACK - 4} rx={3}
                  fill={`color-mix(in oklch, ${W_COLOR[w]} 4%, transparent)`} />
            <text x={PL - 6} y={y0 + TRACK / 2 + 5}
                  textAnchor="end" fill={W_COLOR[w]}
                  fontFamily="IBM Plex Mono" fontSize="11" fontWeight="600">
              {w}
            </text>
            <line x1={PL} x2={W - PR} y1={y0 + TRACK / 2} y2={y0 + TRACK / 2}
                  stroke={`color-mix(in oklch, ${W_COLOR[w]} 18%, transparent)`} strokeWidth={1} />
          </g>
        )
      })}

      {/* time axis */}
      {[0, 10, 20, 30, 39].map(t => (
        <g key={t}>
          <line x1={tx(t)} x2={tx(t)} y1={H - PB + 2} y2={H - PB + 6}
                stroke="var(--shoal)" strokeWidth={1} />
          <text x={tx(t)} y={H - 2} textAnchor="middle"
                fill="var(--shoal)" fontFamily="IBM Plex Mono" fontSize="8">
            {t}s
          </text>
        </g>
      ))}

      {/* response-gap leader lines */}
      {EXCHANGE.map((ev, i) => {
        if (i === 0) return null
        const prev = EXCHANGE[i - 1]
        if (prev.whale === ev.whale) return null
        const x1 = tx(prev.t + codaDur(prev.coda)), x2 = tx(ev.t)
        const y1 = ty(prev.whale), y2 = ty(ev.whale)
        const gap = ev.t - (prev.t + codaDur(prev.coda))
        if (gap < 0.1) return null
        return (
          <g key={`gap-${i}`} opacity={0.35}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="var(--shoal)" strokeWidth={0.7} strokeDasharray="2 3" />
            <text x={(x1+x2)/2 - 2} y={(y1+y2)/2 - 3}
                  fill="var(--shoal)" fontFamily="IBM Plex Mono" fontSize="7" textAnchor="middle">
              {(gap * 1000).toFixed(0)}ms
            </text>
          </g>
        )
      })}

      {/* coda events */}
      {EXCHANGE.map((ev, i) => {
        const dur   = codaDur(ev.coda)
        const x     = tx(ev.t)
        const bw    = Math.max(tx(ev.t + dur) - tx(ev.t), 4)
        const cy    = ty(ev.whale)
        const color = W_COLOR[ev.whale]
        const isActive  = i === activeIdx
        const isHovered = i === hovered
        const isEcho    = i > 0 && EXCHANGE[i-1].whale !== ev.whale && EXCHANGE[i-1].coda === ev.coda

        return (
          <g key={i}
             style={{ cursor: 'pointer' }}
             onClick={() => onClickEvent(i)}
             onMouseEnter={() => setHovered(i)}
             onMouseLeave={() => setHovered(-1)}>
            {isEcho && (
              <text x={x + bw / 2} y={cy - 18}
                    textAnchor="middle" fill="var(--shoal)"
                    fontFamily="IBM Plex Mono" fontSize="7" letterSpacing="0.04em">
                echo
              </text>
            )}
            <rect x={x} y={cy - 14} width={bw} height={28} rx={2}
                  fill={color}
                  fillOpacity={isActive ? 1 : isHovered ? 0.85 : 0.68}
                  style={{
                    filter: isActive ? `drop-shadow(0 0 8px ${color})` : 'none',
                    transition: 'fill-opacity 80ms, filter 80ms',
                  }} />
            {bw > 30 && (
              <text x={x + bw / 2} y={cy + 4} textAnchor="middle"
                    fill="rgba(3,6,15,0.9)" fontFamily="IBM Plex Mono" fontSize="8">
                {ev.coda}
              </text>
            )}
          </g>
        )
      })}

      {/* playhead */}
      {playheadT >= 0 && playheadT <= TOTAL_DUR && (
        <line x1={tx(playheadT)} x2={tx(playheadT)} y1={PT - 4} y2={H - PB}
              stroke="rgba(255,255,255,0.85)" strokeWidth={1.5}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }} />
      )}
    </svg>
  )
}

/* ── ActConversation ─────────────────────────────────── */
export function ActConversation() {
  const [playheadT, setPlayheadT]   = useState(-1)
  const [activeIdx, setActiveIdx]   = useState(-1)
  const [isPlaying, setIsPlaying]   = useState(false)
  const [speed,     setSpeed]       = useState(2)

  const stopRef  = useRef(false)
  const rafRef   = useRef(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    stopRef.current = true
    cancelAnimationFrame(rafRef.current)
  }, [])

  const startPlayback = useCallback((spd: number) => {
    clearTimers()
    void whaleAudio.resume()
    const audioBase = whaleAudio.now() + 0.15

    // Schedule all codas in web-audio time (immune to tab throttling)
    EXCHANGE.forEach(ev => {
      const coda = CODAS.find(c => c.name === ev.coda)!
      whaleAudio.playCoda(coda.intervals, { start: audioBase + ev.t / spd })
    })

    // Visual highlights via setTimeout (may drift if tab hidden — acceptable)
    EXCHANGE.forEach((ev, i) => {
      const dur = codaDur(ev.coda)
      const startMs = (ev.t / spd + 0.15) * 1000
      const endMs   = startMs + (dur / spd) * 1000 + 250
      timersRef.current.push(setTimeout(() => setActiveIdx(i), startMs))
      timersRef.current.push(setTimeout(() => setActiveIdx(p => p === i ? -1 : p), endMs))
    })

    // Playhead via RAF
    const perfStart = performance.now()
    setIsPlaying(true)
    setPlayheadT(0)
    stopRef.current = false

    const tick = () => {
      const t = (performance.now() - perfStart) / 1000 * spd
      setPlayheadT(t)
      if (!stopRef.current && t < TOTAL_DUR + 0.5) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setPlayheadT(-1)
        setIsPlaying(false)
        setActiveIdx(-1)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [clearTimers])

  const stop = useCallback(() => {
    clearTimers()
    setIsPlaying(false)
    setPlayheadT(-1)
    setActiveIdx(-1)
  }, [clearTimers])

  // Play a single coda on click
  const clickEvent = useCallback((i: number) => {
    if (isPlaying) return
    const ev = EXCHANGE[i]
    const coda = CODAS.find(c => c.name === ev.coda)!
    void whaleAudio.resume()
    setActiveIdx(i)
    whaleAudio.playCoda(coda.intervals, {
      onClick: (_i, total) => {
        if (_i === total - 1) setTimeout(() => setActiveIdx(-1), 250)
      }
    })
  }, [isPlaying])

  useEffect(() => () => { clearTimers() }, [clearTimers])

  const turnPct = useMemo(() => {
    const total = EXCHANGE.length
    return Object.fromEntries(
      WHALES.map(w => [w, Math.round(EXCHANGE.filter(e => e.whale === w).length / total * 100)])
    )
  }, [])

  return (
    <section id="conversation" className="act" data-screen-label="07 Dialogue">
      <div className="col-wide">
        <Eyebrow num={6}>Turn-taking · structured dialogue</Eyebrow>
        <h2>This looks like a <span className="hl">conversation</span></h2>
        <p className="lede" style={{ maxWidth: '54ch' }}>
          When sperm whales socialise at the surface, they exchange codas in structured sequences — one
          produces a coda, another responds. Response times are remarkably consistent: not random noise,
          but something closer to dialogue timing.
        </p>

        <div className="split-12-1" style={{ marginTop: 32, gap: 44, alignItems: 'start' }}>

          {/* LEFT — timeline */}
          <div>
            <div className="panel panel--lumen" style={{ padding: '18px 20px 12px', marginBottom: 16 }}>
              <span className="corner mono">FIG. 04 · coda exchange · three whales · {TOTAL_DUR}s (illustrative)</span>
              <Timeline playheadT={playheadT} activeIdx={activeIdx} onClickEvent={clickEvent} />
            </div>

            {/* controls */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {isPlaying ? (
                <button className="btn btn-ghost" onClick={stop}>◼ Stop</button>
              ) : (
                <button className="btn btn-primary" onClick={() => startPlayback(speed)}>
                  ► Play exchange
                </button>
              )}
              <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
                {[1, 2].map(s => (
                  <button key={s} onClick={() => setSpeed(s)} style={{
                    padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    background: speed === s ? 'color-mix(in oklch, var(--lumen) 12%, transparent)' : 'transparent',
                    border: speed === s ? '1px solid var(--lumen)' : '1px solid var(--line)',
                    color: speed === s ? 'var(--lumen)' : 'var(--shoal)',
                    transition: 'all 140ms',
                  }}>
                    {s}×
                  </button>
                ))}
              </div>
              <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--shoal)', fontFamily: 'var(--font-mono)' }}>
                {isPlaying ? `${speed}× speed` : 'or click any coda to hear it'}
              </span>
            </div>

            {/* whale legend */}
            <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
              {WHALES.map(w => (
                <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: W_COLOR[w], display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--foam)' }}>
                    {w} — {turnPct[w]}% of turns
                  </span>
                </div>
              ))}
            </div>

            <div className="stat-grid" style={{ marginTop: 22 }}>
              <div className="panel">
                <div className="bignum">{Math.round(STATS.avgGap * 1000)}<span className="unit">ms</span></div>
                <p className="small" style={{ marginTop: 6 }}>average response latency — the gap between one whale finishing and the next beginning</p>
              </div>
              <div className="panel">
                <div className="bignum">{Math.round(STATS.minGap * 1000)}<span className="unit">ms</span></div>
                <p className="small" style={{ marginTop: 6 }}>fastest response in this exchange</p>
              </div>
              <div className="panel">
                <div className="bignum">{STATS.echoes}<span className="unit">echoes</span></div>
                <p className="small" style={{ marginTop: 6 }}>times a whale responded with the same coda type — possible acknowledgement</p>
              </div>
            </div>
          </div>

          {/* RIGHT — explanation */}
          <div>
            <h3 style={{ marginTop: 0, fontSize: 20 }}>What does "structured" mean?</h3>
            <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65 }}>
              In human conversation, turn-taking gaps average 200&ndash;300 ms. Sperm whale response
              latencies cluster around 1&ndash;2 seconds — much slower, but the <em>consistency</em> is
              the signal. A random process would produce gaps with high variance. These don&apos;t.
            </p>
            <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65, marginTop: 12 }}>
              Notice also that the exchange <em>slows down</em> toward the end — gaps widen from ~1s
              to ~3s as the interaction winds down. That gradient has structure too.
            </p>

            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Turn-taking', desc: 'One whale produces a coda, waits, another responds. Simultaneous production is rare — they seem to listen.' },
                { label: 'Coda echoing', desc: 'Responding with the same coda type may function as acknowledgement or reinforcement — analogous to backchannelling in human speech.' },
                { label: 'Engagement gradient', desc: 'Response latency tracks engagement: short gaps during active exchange, long gaps as interest wanes. A well-known marker of conversational dynamics in primates.' },
              ].map(item => (
                <div key={item.label} style={{ borderLeft: '3px solid var(--line)', paddingLeft: 14 }}>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lumen)', letterSpacing: '0.05em' }}>
                    {item.label.toUpperCase()}
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--mist)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="panel" style={{ marginTop: 24, padding: 20 }}>
              <div className="bignum">9,000<span className="unit">exchanges</span></div>
              <p className="small" style={{ marginTop: 8 }}>
                Size of the CETI corpus — the largest sperm whale coda dataset ever assembled.
                Statistical methods that distinguish Markov chains from context-free grammars are
                now being applied, but the sample size is still at the limit of what the analysis requires.
              </p>
            </div>

            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--shoal)', lineHeight: 1.5 }}>
              Data: illustrative sequence; timing and coda types consistent with
              Eastern Caribbean field observations (Rendell &amp; Whitehead 2003).
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
