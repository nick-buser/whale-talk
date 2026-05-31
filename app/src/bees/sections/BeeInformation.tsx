import { useState } from 'react'

/* ── Bit budget ─────────────────────────────────────────────── */
interface BitItem {
  channel: string
  color: string
  bitsMin: number
  bitsMax: number
  mechanism: string
  bottleneck: string
}

const BIT_BUDGET: BitItem[] = [
  { channel: 'Direction',    color: '#f4c430', bitsMin: 2.8, bitsMax: 3.2, mechanism: 'Waggle-run angle ±3°', bottleneck: 'Comb orientation variability, solar ephemeris drift' },
  { channel: 'Distance',     color: '#e8941a', bitsMin: 1.8, bitsMax: 2.2, mechanism: 'Run duration (Kohl & Rutschmann)', bottleneck: 'Duration jitter ±0.12 s, wind speed variation' },
  { channel: 'Quality',      color: '#ffb472', bitsMin: 0.8, bitsMax: 1.2, mechanism: 'Circuit count & vigour', bottleneck: 'Motivational state of dancer, receiver threshold' },
  { channel: 'Flower type',  color: '#8ae04a', bitsMin: 0.0, bitsMax: 0.5, mechanism: 'Scent on dancer body', bottleneck: 'Chemical volatility, time since visit' },
]

const TOTAL_MIN = BIT_BUDGET.reduce((s, b) => s + b.bitsMin, 0)
const TOTAL_MAX = BIT_BUDGET.reduce((s, b) => s + b.bitsMax, 0)

/* ── Channel comparison ─────────────────────────────────────── */
interface ChannelComp {
  id: string
  system: string
  color: string
  bitsPerUnit: number
  unit: string
  domain: string
  openEnded: boolean
  notes: string
}

const CHANNELS: ChannelComp[] = [
  { id: 'bee',      system: 'Bee waggle dance',      color: '#f4c430', bitsPerUnit: 6.0,  unit: 'per dance bout', domain: 'Foraging location only',  openEnded: false, notes: '~3 bits direction + ~2 bits distance + ~1 bit quality. Fixed domain.' },
  { id: 'vervet',   system: 'Vervet alarm calls',    color: '#ff6b54', bitsPerUnit: 1.6,  unit: 'per call',       domain: 'Predator category',        openEnded: false, notes: '3 call types → ~1.6 bits. Context modifies meaning but vocabulary is closed.' },
  { id: 'gibbon',   system: 'Gibbon song',           color: '#ffb472', bitsPerUnit: 2.1,  unit: 'per bout',       domain: 'Identity + territory',     openEnded: false, notes: 'Estimated from individual recognition. Repertoire not fully quantified.' },
  { id: 'chimpanzee', system: 'Chimp gesture',       color: '#b57bee', bitsPerUnit: 4.7,  unit: 'per gesture',   domain: 'Social/object requests',   openEnded: false, notes: 'Graham & Hobaiter 2023: ~80 gesture types. Limited compositionality.' },
  { id: 'budgie',   system: 'Budgerigar warble',     color: '#8ae04a', bitsPerUnit: 5.2,  unit: 'per bout',       domain: 'Unknown / social',         openEnded: true,  notes: '42 syllable classes, 5th-order Markov. Bits estimated from repertoire entropy.' },
  { id: 'human-word', system: 'Human spoken word',  color: '#4afdc6', bitsPerUnit: 9.6,  unit: 'per word',       domain: 'Unlimited',                openEnded: true,  notes: 'Rough estimate: ~50,000-word vocabulary → log₂(50000) ≈ 15.6 bits per word, reduced by Zipf predictability.' },
]

/* ── Noise sources ──────────────────────────────────────────── */
const NOISE = [
  {
    id: 'comb', label: 'Comb vibration noise',
    desc: 'Multiple dancers on comb simultaneously. Substrate vibrations interfere; receivers must discriminate by dancer proximity and local signal amplitude.',
    severity: 0.65,
  },
  {
    id: 'solar', label: 'Solar ephemeris drift',
    desc: 'Sun moves ~15°/hour. Dances performed at different times encode different angles for the same site. Bees compensate via internal clock, but with residual error.',
    severity: 0.45,
  },
  {
    id: 'wind', label: 'Wind speed variation',
    desc: 'Headwinds increase metabolic cost → inflated run duration → recruits fly past the site. Tailwind causes underestimate. Effect ≈ ±150 m at 1 km.',
    severity: 0.55,
  },
  {
    id: 'individual', label: 'Individual variation',
    desc: 'Individual bees differ in dance calibration. A forager\'s own curve is consistent, but across-individual variation adds noise for any specific receiver.',
    severity: 0.35,
  },
  {
    id: 'follower', label: 'Follower attention',
    desc: 'Receivers must follow multiple waggle runs to average out noise. Minimum ~3 runs for accurate decoding; optimal ≈ 10 runs for ±20 m precision at 1 km.',
    severity: 0.40,
  },
]

/* ── Bar chart helpers ──────────────────────────────────────── */
const BAR_W = 400
const BAR_H = 220
const PAD_L = 130, PAD_R = 20, PAD_T = 20, PAD_B = 30
const PLOT_W = BAR_W - PAD_L - PAD_R
const PLOT_H = BAR_H - PAD_T - PAD_B
const MAX_BITS = 12

export function BeeInformation() {
  const [activeChannel, setActiveChannel] = useState<string>('bee')
  const [activeBudget, setActiveBudget] = useState<string | null>(null)

  const ch = CHANNELS.find(c => c.id === activeChannel)!

  return (
    <div className="bee-info">
      <p className="bee-intro-eyebrow">Information Theory</p>
      <h1 className="bee-intro-title">The Shannon Channel</h1>
      <p className="bee-intro-lede">
        The waggle dance carries approximately 6 bits per bout — 3 bits direction, 2 bits
        distance, 1 bit quality. Quantifying this reveals both the remarkable precision of a
        fixed neural program and the hard ceiling imposed by a closed, one-domain channel.
      </p>

      {/* Bit budget */}
      <div>
        <h2 className="bee-section-h2">Bee Waggle Bit Budget</h2>
        <p className="bee-intro-sub">Click a channel to see the mechanism and bottleneck.</p>
        <div className="bee-info-budget">
          {BIT_BUDGET.map(b => {
            const barW = (b.bitsMax / 4) * 100
            return (
              <div
                key={b.channel}
                className={`bee-info-budget-row${activeBudget === b.channel ? ' active' : ''}`}
                onClick={() => setActiveBudget(activeBudget === b.channel ? null : b.channel)}
                style={{ '--budget-color': b.color } as React.CSSProperties}
              >
                <span className="bee-info-budget-ch">{b.channel}</span>
                <div className="bee-info-budget-bar-track">
                  <div
                    className="bee-info-budget-bar-fill"
                    style={{ width: `${barW}%`, background: b.color }}
                  />
                </div>
                <span className="bee-info-budget-bits">
                  {b.bitsMin === 0 ? `0–${b.bitsMax.toFixed(1)}` : `~${((b.bitsMin + b.bitsMax) / 2).toFixed(1)}`} bits
                </span>
                {activeBudget === b.channel && (
                  <div className="bee-info-budget-detail">
                    <div><span className="bee-info-budget-detail-label">Mechanism</span><span>{b.mechanism}</span></div>
                    <div><span className="bee-info-budget-detail-label">Bottleneck</span><span>{b.bottleneck}</span></div>
                  </div>
                )}
              </div>
            )
          })}
          <div className="bee-info-budget-total">
            <span>Total</span>
            <span>{TOTAL_MIN.toFixed(1)}–{TOTAL_MAX.toFixed(1)} bits per dance</span>
          </div>
        </div>
      </div>

      {/* Channel comparison bar chart */}
      <div>
        <h2 className="bee-section-h2">Bits per Signal Unit — Cross-Species</h2>
        <p className="bee-intro-sub">Select a system for details. Note: bits/unit does not equal expressive power — domain matters.</p>
        <svg viewBox={`0 0 ${BAR_W} ${BAR_H}`} className="bee-info-chart" aria-label="Bits per signal unit comparison">
          {/* Background */}
          <rect width={BAR_W} height={BAR_H} fill="var(--bee-cell)" rx="4" />
          {/* Grid lines */}
          {[3, 6, 9, 12].map(v => {
            const x = PAD_L + (v / MAX_BITS) * PLOT_W
            return (
              <g key={v}>
                <line x1={x} y1={PAD_T} x2={x} y2={PAD_T + PLOT_H}
                  stroke="var(--bee-wall)" strokeWidth="1" strokeDasharray="3 3" />
                <text x={x} y={PAD_T + PLOT_H + 16} textAnchor="middle"
                  fontSize="9" fill="var(--bee-deep)" fontFamily="var(--font-mono)">{v}</text>
              </g>
            )
          })}
          <text x={PAD_L + PLOT_W / 2} y={BAR_H - 2} textAnchor="middle"
            fontSize="9" fill="var(--bee-deep)" fontFamily="var(--font-sans)">bits / unit</text>
          {/* Bars */}
          {CHANNELS.map((c, i) => {
            const barH = (PLOT_H / CHANNELS.length) - 6
            const y = PAD_T + i * (PLOT_H / CHANNELS.length) + 3
            const w = (c.bitsPerUnit / MAX_BITS) * PLOT_W
            const isActive = activeChannel === c.id
            return (
              <g key={c.id} onClick={() => setActiveChannel(c.id)} style={{ cursor: 'pointer' }}>
                <rect x={PAD_L} y={y} width={w} height={barH}
                  fill={isActive ? c.color : `color-mix(in oklch, ${c.color} 40%, transparent)`}
                  rx="3" />
                <text x={PAD_L - 6} y={y + barH / 2 + 4}
                  textAnchor="end" fontSize="10"
                  fill={isActive ? c.color : 'var(--fg-muted)'}
                  fontFamily="var(--font-sans)"
                  fontWeight={isActive ? '600' : '400'}
                >
                  {c.system}
                </text>
                <text x={PAD_L + w + 5} y={y + barH / 2 + 4}
                  fontSize="10" fill={isActive ? c.color : 'var(--fg-quiet)'}
                  fontFamily="var(--font-mono)"
                >
                  {c.bitsPerUnit}
                </text>
              </g>
            )
          })}
        </svg>
        {/* Detail panel */}
        <div className="bee-info-ch-panel" style={{ borderColor: ch.color }}>
          <div className="bee-info-ch-head">
            <span className="bee-info-ch-name" style={{ color: ch.color }}>{ch.system}</span>
            <span className={`bee-disp-badge${ch.openEnded ? ' yes' : ' no'}`}>
              {ch.openEnded ? 'Open-ended' : 'Closed vocabulary'}
            </span>
          </div>
          <div className="bee-info-ch-meta">
            <span><strong>{ch.bitsPerUnit}</strong> bits {ch.unit}</span>
            <span>Domain: {ch.domain}</span>
          </div>
          <p className="bee-disp-panel-notes">{ch.notes}</p>
        </div>
      </div>

      {/* Noise sources */}
      <div>
        <h2 className="bee-section-h2">Noise Sources in the Waggle Channel</h2>
        <div className="bee-info-noise">
          {NOISE.map(n => (
            <div key={n.id} className="bee-info-noise-row">
              <div className="bee-info-noise-left">
                <span className="bee-info-noise-label">{n.label}</span>
                <p className="bee-info-noise-desc">{n.desc}</p>
              </div>
              <div className="bee-info-noise-meter-wrap">
                <div className="bee-info-noise-meter-track">
                  <div
                    className="bee-info-noise-meter-fill"
                    style={{ width: `${n.severity * 100}%` }}
                  />
                </div>
                <span className="bee-info-noise-sev">
                  {n.severity < 0.4 ? 'Low' : n.severity < 0.6 ? 'Moderate' : 'High'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
