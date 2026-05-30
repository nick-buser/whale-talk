import { useState, useCallback } from 'react'
import { CODAS } from '../lib/data'
import { whaleAudio } from '../lib/audio'
import { Eyebrow } from '../components/Eyebrow'

/* ── Illustrative coda-type frequencies per clan ────────────
   Based on Rendell & Whitehead (2003) Eastern Caribbean field data.
   Values are approximate relative frequencies (0–1, sum ≈ 1).       */
const CLANS = [
  {
    id: 'EC1', label: 'Clan EC1', color: '#4afdc6',
    desc: 'Favours short rhythmic partitions. 5R1 — five evenly-spaced clicks — accounts for ~40 % of utterances.',
    freqs: { '5R1': 0.40, '1+1+3': 0.27, '4+1': 0.18, '2+1+1+1': 0.12, '1+3': 0.02, '3+3': 0.00, '5R2': 0.01, '7R': 0.00 },
  },
  {
    id: 'EC2', label: 'Clan EC2', color: '#c6ffe6',
    desc: 'Favours longer, faster patterns. 1+3 — one click, pause, three rapid clicks — is the clan signature.',
    freqs: { '5R1': 0.05, '1+1+3': 0.01, '4+1': 0.00, '2+1+1+1': 0.00, '1+3': 0.36, '3+3': 0.28, '5R2': 0.21, '7R': 0.09 },
  },
] as const

const CODA_ORDER = ['5R1', '1+1+3', '4+1', '2+1+1+1', '1+3', '3+3', '5R2', '7R'] as const

/* ── Butterfly (back-to-back) frequency chart ───────────── */
function ButterflyChart({ playing, onPlay }: {
  playing: string | null
  onPlay: (name: string) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  const W = 560, ROW = 38, TOP = 36
  const H = TOP + CODA_ORDER.length * ROW + 12
  const CX = W / 2
  const LABEL_HALF = 44    // half-width of coda name column
  const BAR_MAX = CX - LABEL_HALF - 16  // max bar length each side

  const shared = (name: string) => {
    const f1 = CLANS[0].freqs[name as keyof typeof CLANS[0]['freqs']] ?? 0
    const f2 = CLANS[1].freqs[name as keyof typeof CLANS[1]['freqs']] ?? 0
    return f1 > 0.01 && f2 > 0.01
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* clan headers */}
      <text x={CX - LABEL_HALF - 8} y={20} textAnchor="end"
            fill="#4afdc6" fontFamily="IBM Plex Mono" fontSize="11" letterSpacing="0.05em">
        EC1 ←
      </text>
      <text x={CX + LABEL_HALF + 8} y={20} textAnchor="start"
            fill="#c6ffe6" fontFamily="IBM Plex Mono" fontSize="11" letterSpacing="0.05em">
        → EC2
      </text>

      {/* centre axis */}
      <line x1={CX} x2={CX} y1={TOP - 8} y2={H - 4} stroke="var(--line)" strokeWidth={1} />

      {CODA_ORDER.map((name, i) => {
        const f1 = CLANS[0].freqs[name as keyof typeof CLANS[0]['freqs']] ?? 0
        const f2 = CLANS[1].freqs[name as keyof typeof CLANS[1]['freqs']] ?? 0
        const y  = TOP + i * ROW + ROW / 2
        const isPlaying = playing === name
        const isHovered = hovered === name
        const isShared  = shared(name)

        return (
          <g key={name}
             style={{ cursor: 'pointer' }}
             onClick={() => onPlay(name)}
             onMouseEnter={() => setHovered(name)}
             onMouseLeave={() => setHovered(null)}>

            {/* row highlight */}
            <rect x={0} y={y - ROW / 2 + 2} width={W} height={ROW - 4} rx={3}
                  fill={isPlaying ? 'rgba(74,253,198,0.09)' : isHovered ? 'rgba(238,243,250,0.04)' : 'transparent'}
                  style={{ transition: 'fill 100ms' }} />

            {/* EC1 bar — extends left */}
            {f1 > 0 && (
              <rect x={CX - LABEL_HALF - f1 * BAR_MAX} y={y - 8}
                    width={f1 * BAR_MAX} height={16} rx={2}
                    fill="#4afdc6" fillOpacity={isPlaying || isHovered ? 1 : 0.72}
                    style={{ transition: 'fill-opacity 120ms' }} />
            )}

            {/* EC2 bar — extends right */}
            {f2 > 0 && (
              <rect x={CX + LABEL_HALF} y={y - 8}
                    width={f2 * BAR_MAX} height={16} rx={2}
                    fill="#c6ffe6" fillOpacity={isPlaying || isHovered ? 1 : 0.72}
                    style={{ transition: 'fill-opacity 120ms' }} />
            )}

            {/* coda name */}
            <text x={CX} y={y + 5} textAnchor="middle"
                  fontFamily="IBM Plex Mono" fontSize="12"
                  fontWeight={isPlaying ? '600' : '400'}
                  fill={isPlaying ? '#c6ffe6' : isShared ? '#eef3fa' : 'var(--foam)'}>
              {name}
            </text>

            {/* pct labels */}
            {f1 >= 0.02 && (
              <text x={CX - LABEL_HALF - f1 * BAR_MAX - 4} y={y + 5}
                    textAnchor="end" fill="#4afdc6" fillOpacity={0.9}
                    fontFamily="IBM Plex Mono" fontSize="9">
                {Math.round(f1 * 100)}%
              </text>
            )}
            {f2 >= 0.02 && (
              <text x={CX + LABEL_HALF + f2 * BAR_MAX + 4} y={y + 5}
                    textAnchor="start" fill="#c6ffe6" fillOpacity={0.9}
                    fontFamily="IBM Plex Mono" fontSize="9">
                {Math.round(f2 * 100)}%
              </text>
            )}

            {/* shared indicator */}
            {isShared && (
              <circle cx={CX} cy={y - 12} r={2.5} fill="var(--shoal)" />
            )}
          </g>
        )
      })}

      {/* shared legend dot */}
      <circle cx={16} cy={H - 8} r={2.5} fill="var(--shoal)" />
      <text x={24} y={H - 4} fill="var(--shoal)" fontFamily="IBM Plex Mono" fontSize="9">
        used by both clans
      </text>
    </svg>
  )
}

/* ── ActDialect ─────────────────────────────────────────── */
export function ActDialect() {
  const [playing, setPlaying] = useState<string | null>(null)

  const playCoda = useCallback((name: string) => {
    const coda = CODAS.find(c => c.name === name)
    if (!coda) return
    void whaleAudio.resume()
    setPlaying(name)
    whaleAudio.playCoda(coda.intervals, {
      onClick: (i, total) => {
        if (i === total - 1) setTimeout(() => setPlaying(null), 300)
      },
    })
  }, [])

  const playContrast = useCallback(() => {
    const ec1Top = CODAS.find(c => c.name === '5R1')!
    const ec2Top = CODAS.find(c => c.name === '1+3')!
    void whaleAudio.resume()
    setPlaying('5R1')
    const dur1 = ec1Top.intervals.reduce((s, v) => s + v, 0) + 0.5
    whaleAudio.playCoda(ec1Top.intervals, {
      onClick: (i, total) => {
        if (i === total - 1) setTimeout(() => setPlaying('1+3'), 300)
      },
    })
    setTimeout(() => {
      whaleAudio.playCoda(ec2Top.intervals, {
        onClick: (i, total) => {
          if (i === total - 1) setTimeout(() => setPlaying(null), 300)
        },
      })
    }, dur1 * 1000)
  }, [])

  // Derived stats
  const THRESH = 0.02
  const ec1Only  = CODA_ORDER.filter(n => (CLANS[0].freqs[n as keyof typeof CLANS[0]['freqs']] ?? 0) >= THRESH && (CLANS[1].freqs[n as keyof typeof CLANS[1]['freqs']] ?? 0) < THRESH)
  const ec2Only  = CODA_ORDER.filter(n => (CLANS[1].freqs[n as keyof typeof CLANS[1]['freqs']] ?? 0) >= THRESH && (CLANS[0].freqs[n as keyof typeof CLANS[0]['freqs']] ?? 0) < THRESH)
  const sharedN  = CODA_ORDER.filter(n => (CLANS[0].freqs[n as keyof typeof CLANS[0]['freqs']] ?? 0) >= THRESH && (CLANS[1].freqs[n as keyof typeof CLANS[1]['freqs']] ?? 0) >= THRESH)

  return (
    <section id="dialect" className="act" data-screen-label="06 Dialect">
      <div className="col-wide">
        <Eyebrow num={5}>Clan dialects · same ocean, different voice</Eyebrow>
        <h2>They overlap geographically.<br /><span className="hl">Not vocally.</span></h2>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          Two sperm whale clans, EC1 and EC2, share the Eastern Caribbean — the same feeding grounds,
          the same depth. But their coda repertoires are almost entirely disjoint.
          Each bar is the fraction of that clan's utterances that match a coda type. Click any row to hear it.
        </p>

        <div className="split-12-1" style={{ marginTop: 32, gap: 44, alignItems: 'start' }}>

          {/* LEFT — butterfly chart */}
          <div>
            <div className="panel panel--lumen" style={{ padding: '20px 24px 16px' }}>
              <span className="corner mono">FIG. 03 · coda repertoire frequency (illustrative)</span>
              <ButterflyChart playing={playing} onPlay={playCoda} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={playContrast} disabled={playing !== null}>
                {playing ? '◉ Playing…' : '► Hear the contrast  (EC1 → EC2)'}
              </button>
            </div>

            <div className="stat-grid" style={{ marginTop: 24 }}>
              <div className="panel">
                <div className="bignum" style={{ color: '#4afdc6' }}>
                  {ec1Only.length}<span className="unit">EC1 only</span>
                </div>
                <p className="small" style={{ marginTop: 6 }}>
                  {ec1Only.join(', ')}
                </p>
              </div>
              <div className="panel">
                <div className="bignum" style={{ color: 'var(--shoal)' }}>
                  {sharedN.length}<span className="unit">shared</span>
                </div>
                <p className="small" style={{ marginTop: 6 }}>
                  {sharedN.length ? sharedN.join(', ') : 'none'} — used by both but at very different rates
                </p>
              </div>
              <div className="panel">
                <div className="bignum" style={{ color: '#c6ffe6' }}>
                  {ec2Only.length}<span className="unit">EC2 only</span>
                </div>
                <p className="small" style={{ marginTop: 6 }}>
                  {ec2Only.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — explanation */}
          <div>
            <h3 style={{ marginTop: 0, fontSize: 20 }}>What is a dialect?</h3>
            <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65 }}>
              In linguistics, a dialect is a variety of a language specific to a community — same underlying
              grammar, different surface realisation. Sperm whale clans exhibit something analogous:
              the same acoustic building blocks (clicks, intervals) recombined into distinct repertoires
              that are stable across decades and thousands of kilometres.
            </p>

            {CLANS.map(cl => (
              <div key={cl.id} style={{
                marginTop: 20, padding: 16,
                borderLeft: `3px solid ${cl.color}`,
                background: `color-mix(in oklch, ${cl.color} 5%, transparent)`,
                borderRadius: '0 4px 4px 0',
              }}>
                <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: cl.color, letterSpacing: '0.05em' }}>
                  {cl.label}
                </strong>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--mist)', lineHeight: 1.5 }}>
                  {cl.desc}
                </p>
              </div>
            ))}

            <div className="panel" style={{ marginTop: 24, padding: 20 }}>
              <div className="bignum">~{Math.round((1 - sharedN.length / CODA_ORDER.length) * 100)}<span className="unit">% distinct</span></div>
              <p className="small" style={{ marginTop: 8 }}>
                Fraction of catalogued coda types that are exclusive to one clan.
                Cultural transmission — not genetics — is thought to maintain this separation:
                calves learn their clan&apos;s repertoire from their mothers.
              </p>
            </div>

            <p style={{ marginTop: 20, fontSize: 13, color: 'var(--shoal)', lineHeight: 1.5 }}>
              Data: illustrative, based on Eastern Caribbean field recordings
              (Rendell &amp; Whitehead, 2003; CETI 2024 catalogue).
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
