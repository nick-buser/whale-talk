import { useState, useCallback } from 'react'
import { whaleAudio } from '../lib/audio'
import { Eyebrow } from '../components/Eyebrow'

/* ── Mysticete larynx parts (Elemans et al. 2024, Nature) ───
   Schematic — sized for clarity, not anatomical accuracy.      */

interface Part {
  id: string
  name: string
  color: string
  desc: string
}

const PARTS: Part[] = [
  {
    id: 'ufold',
    name: 'U-fold',
    color: '#4afdc6',
    desc: 'A large U-shaped fold of tissue — an evolutionary novelty found in no other mammal. Air driven up from the lungs sets the U-fold vibrating against the arytenoid cushion, generating low-frequency sound. This is the baleen whale\'s voice: a structure repurposed from the mammalian larynx for underwater phonation.',
  },
  {
    id: 'cushion',
    name: 'Arytenoid cushion',
    color: '#ffb472',
    desc: 'The arytenoid cartilages have fused and enlarged into a big, fat-filled rigid cushion. The vibrating U-fold beats against this cushion the way human vocal folds beat against each other. Its large mass is part of why the system is locked to low frequencies — heavy tissue vibrates slowly.',
  },
  {
    id: 'sac',
    name: 'Laryngeal sac',
    color: '#7da6ff',
    desc: 'A large inflatable sac that captures the air pushed past the U-fold and recycles it back to the lungs. This is what lets a baleen whale vocalise for long stretches underwater without losing breath — the same air is reused rather than vented into the sea.',
  },
  {
    id: 'lungs',
    name: 'Lungs',
    color: '#c6ffe6',
    desc: 'The air source. Powerful expiratory muscles drive air from the lungs up the trachea and across the U-fold. The whole system runs as a closed loop: lungs → U-fold → sac → lungs, so vocalising does not cost the animal its oxygen.',
  },
]

/* ── Frequency spectrum (log scale) ─────────────────────────── */
const SVB_W = 560, SVB_H = 230
const SL = 50, SR = 540, ST = 30, SB = 180
const SPW = SR - SL
const F_MIN = 10, F_MAX = 1000          // 10 Hz → 1 kHz, two decades

function fx(f: number) {
  return SL + ((Math.log10(f) - Math.log10(F_MIN)) / (Math.log10(F_MAX) - Math.log10(F_MIN))) * SPW
}

const CEILING_HZ = 300

function SpectrumChart() {
  const ticks = [10, 30, 100, 300, 1000]
  const shipLo = 10, shipHi = 200
  const callLo = 15, callHi = 300
  const overlapLo = Math.max(shipLo, callLo), overlapHi = Math.min(shipHi, callHi)

  return (
    <svg viewBox={`0 0 ${SVB_W} ${SVB_H}`} width="100%" style={{ display: 'block' }}
         aria-label="Baleen whale call band vs. shipping noise band, log frequency">
      {/* grid ticks */}
      {ticks.map(t => (
        <g key={t}>
          <line x1={fx(t)} y1={ST} x2={fx(t)} y2={SB} stroke="#b6c8df" strokeOpacity={0.1} strokeWidth={1} />
          <text x={fx(t)} y={SB + 16} textAnchor="middle" fill="#5b82b8" fontSize={10} fontFamily="IBM Plex Mono">
            {t >= 1000 ? '1k' : t}
          </text>
        </g>
      ))}
      <text x={(SL + SR) / 2} y={SB + 36} textAnchor="middle" fill="#5b82b8" fontSize={10}
            fontFamily="IBM Plex Sans" letterSpacing="0.08em">FREQUENCY (Hz) · log scale</text>

      {/* Shipping noise band */}
      <rect x={fx(shipLo)} y={ST + 8} width={fx(shipHi) - fx(shipLo)} height={34} rx={3}
            fill="#ff6b54" fillOpacity={0.18} stroke="#ff6b54" strokeOpacity={0.5} />
      <text x={fx(shipLo) + 8} y={ST + 29} fill="#ff6b54" fontSize={11} fontFamily="IBM Plex Sans" fontWeight={600}>
        Shipping noise
      </text>

      {/* Baleen call band */}
      <rect x={fx(callLo)} y={ST + 54} width={fx(callHi) - fx(callLo)} height={34} rx={3}
            fill="#4afdc6" fillOpacity={0.18} stroke="#4afdc6" strokeOpacity={0.55} />
      <text x={fx(callLo) + 8} y={ST + 75} fill="#4afdc6" fontSize={11} fontFamily="IBM Plex Sans" fontWeight={600}>
        Baleen whale calls
      </text>

      {/* Overlap hatch */}
      <rect x={fx(overlapLo)} y={ST + 8} width={fx(overlapHi) - fx(overlapLo)} height={80}
            fill="#ff6b54" fillOpacity={0.14} />
      <text x={(fx(overlapLo) + fx(overlapHi)) / 2} y={ST + 108} textAnchor="middle"
            fill="#ff6b54" fontSize={10} fontFamily="IBM Plex Mono" opacity={0.9}>
        overlap — inescapable
      </text>

      {/* Physiological ceiling marker */}
      <line x1={fx(CEILING_HZ)} y1={ST} x2={fx(CEILING_HZ)} y2={SB} stroke="#c6ffe6"
            strokeWidth={1.5} strokeDasharray="4 4" strokeOpacity={0.8} />
      <text x={fx(CEILING_HZ) + 6} y={ST + 128} fill="#c6ffe6" fontSize={10} fontFamily="IBM Plex Mono">
        ~{CEILING_HZ} Hz ceiling
      </text>
      <text x={fx(CEILING_HZ) + 6} y={ST + 142} fill="#5b82b8" fontSize={9} fontFamily="IBM Plex Mono">
        can't sing higher
      </text>

      {/* baseline */}
      <line x1={SL} y1={SB} x2={SR} y2={SB} stroke="#b6c8df" strokeOpacity={0.3} strokeWidth={1.2} />
    </svg>
  )
}

/* ── Larynx mechanism schematic ─────────────────────────────── */
function LarynxDiagram({ hovered, setHovered }: {
  hovered: string | null
  setHovered: (id: string | null) => void
}) {
  const isHov = (id: string) => hovered === id
  const col = (id: string) => PARTS.find(p => p.id === id)!.color

  return (
    <svg viewBox="0 0 360 320" width="100%" style={{ display: 'block', maxHeight: 380 }}
         aria-label="Schematic of the baleen whale larynx">
      <defs>
        <marker id="lx-flow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#c6ffe6" opacity={0.7} />
        </marker>
        <marker id="lx-flow-back" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#7da6ff" opacity={0.7} />
        </marker>
      </defs>

      {/* Laryngeal sac */}
      <g onMouseEnter={() => setHovered('sac')} onMouseLeave={() => setHovered(null)}
         onClick={() => setHovered('sac')} style={{ cursor: 'pointer' }}>
        <ellipse cx={250} cy={150} rx={70} ry={84}
                 fill={col('sac')} fillOpacity={isHov('sac') ? 0.32 : 0.12}
                 stroke={col('sac')} strokeWidth={isHov('sac') ? 1.8 : 1.1}
                 style={{ filter: isHov('sac') ? `drop-shadow(0 0 12px ${col('sac')})` : 'none', transition: 'all 200ms' }} />
        <text x={250} y={150} textAnchor="middle" fill={col('sac')} fontSize={11} fontFamily="IBM Plex Sans">
          laryngeal sac
        </text>
      </g>

      {/* Lungs */}
      <g onMouseEnter={() => setHovered('lungs')} onMouseLeave={() => setHovered(null)}
         onClick={() => setHovered('lungs')} style={{ cursor: 'pointer' }}>
        <path d="M 40,270 Q 60,230 90,250 Q 110,265 95,295 Q 65,305 45,295 Z"
              fill={col('lungs')} fillOpacity={isHov('lungs') ? 0.32 : 0.12}
              stroke={col('lungs')} strokeWidth={isHov('lungs') ? 1.8 : 1.1}
              style={{ filter: isHov('lungs') ? `drop-shadow(0 0 12px ${col('lungs')})` : 'none', transition: 'all 200ms' }} />
        <text x={68} y={278} textAnchor="middle" fill={col('lungs')} fontSize={10} fontFamily="IBM Plex Sans">lungs</text>
      </g>

      {/* Trachea */}
      <path d="M 90,250 Q 110,180 120,120" fill="none" stroke="#b6c8df" strokeOpacity={0.4} strokeWidth={10} strokeLinecap="round" />

      {/* Arytenoid cushion */}
      <g onMouseEnter={() => setHovered('cushion')} onMouseLeave={() => setHovered(null)}
         onClick={() => setHovered('cushion')} style={{ cursor: 'pointer' }}>
        <ellipse cx={148} cy={86} rx={34} ry={26}
                 fill={col('cushion')} fillOpacity={isHov('cushion') ? 0.34 : 0.14}
                 stroke={col('cushion')} strokeWidth={isHov('cushion') ? 1.8 : 1.1}
                 style={{ filter: isHov('cushion') ? `drop-shadow(0 0 12px ${col('cushion')})` : 'none', transition: 'all 200ms' }} />
        <text x={148} y={89} textAnchor="middle" fill={col('cushion')} fontSize={10} fontFamily="IBM Plex Sans">cushion</text>
      </g>

      {/* U-fold */}
      <g onMouseEnter={() => setHovered('ufold')} onMouseLeave={() => setHovered(null)}
         onClick={() => setHovered('ufold')} style={{ cursor: 'pointer' }}>
        <path d="M 108,120 C 104,86 120,70 130,70 L 130,86 C 124,86 120,100 124,120 Z"
              fill={col('ufold')} fillOpacity={isHov('ufold') ? 0.42 : 0.2}
              stroke={col('ufold')} strokeWidth={isHov('ufold') ? 2 : 1.3}
              style={{ filter: isHov('ufold') ? `drop-shadow(0 0 12px ${col('ufold')})` : 'none', transition: 'all 200ms' }} />
        <text x={88} y={92} textAnchor="middle" fill={col('ufold')} fontSize={11} fontFamily="IBM Plex Sans" fontWeight={600}>U-fold</text>
      </g>

      {/* Airflow up (drive) */}
      <path d="M 112,240 Q 118,180 118,128" fill="none" stroke="#c6ffe6" strokeOpacity={0.55}
            strokeWidth={1.6} strokeDasharray="2 4" markerEnd="url(#lx-flow)" />
      {/* Air recycled to sac */}
      <path d="M 150,96 Q 210,110 210,140" fill="none" stroke="#7da6ff" strokeOpacity={0.5}
            strokeWidth={1.6} strokeDasharray="2 4" markerEnd="url(#lx-flow-back)" />
      {/* Sac back to lungs */}
      <path d="M 232,228 Q 170,300 100,288" fill="none" stroke="#7da6ff" strokeOpacity={0.4}
            strokeWidth={1.4} strokeDasharray="2 4" markerEnd="url(#lx-flow-back)" />

      <text x={300} y={300} textAnchor="end" fill="#5b82b8" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.6}>
        closed-loop air recycling
      </text>
    </svg>
  )
}

export function ActLarynx() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const part = PARTS.find(p => p.id === hovered) || PARTS[0]

  const playMoan = useCallback(() => {
    void whaleAudio.resume()
    setPlaying(true)
    const now = whaleAudio.now() + 0.05
    // Low tonal call, sitting under the ~300 Hz ceiling
    whaleAudio.moan(now, { f0: 40, f1: 90, dur: 2.4, vibrato: 2, harmonics: [1, 0.5, 0.22, 0.1], gain: 0.4 })
    setTimeout(() => setPlaying(false), 2600)
  }, [])

  return (
    <section id="larynx" className="act" data-screen-label="08 Voice box">
      <div className="col-wide">
        <Eyebrow num={7}>How baleen whales make sound · Elemans et&nbsp;al. 2024</Eyebrow>
        <h2>A voice box built for the deep — <span className="hl">and trapped by it</span>.</h2>
        <p className="lede" style={{ maxWidth: '56ch' }}>
          For decades nobody knew exactly how baleen whales produce sound. In 2024, Coen Elemans and
          colleagues showed they evolved an entirely novel laryngeal structure — and that the same
          mechanism imposes a hard physical ceiling that traps their voices inside the band of ocean
          shipping noise.
        </p>

        {/* Mechanism */}
        <div className="split-12-1" style={{ marginTop: 32, gap: 40, alignItems: 'start' }}>
          <div className="panel panel--lumen" style={{ padding: 16 }}>
            <span className="corner mono">FIG. 04 · mysticete larynx (schematic)</span>
            <LarynxDiagram hovered={hovered} setHovered={setHovered} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px 0' }}>
              <button className="btn btn-primary" onClick={playMoan} disabled={playing}>
                {playing ? '◉ Sounding…' : '► Hear a low call'}
              </button>
              <span className="mono" style={{ color: 'var(--shoal)', fontSize: 11 }}>hover or tap a part</span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 24, marginTop: 0 }}>A repurposed larynx</h3>
            <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65 }}>
              Toothed whales make sound in the nose. Baleen whales, it turns out, make it in a
              radically modified larynx: a U-shaped tissue fold beats against an enlarged cartilage
              cushion while a sac recycles the air — letting them sing for long stretches without
              losing breath.
            </p>

            <div style={{ marginTop: 20, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <div className="eyebrow" style={{ color: part.color, marginBottom: 8 }}>
                <span className="rule"></span>
                <span>{hovered ? 'Selected' : 'Default'}</span>
              </div>
              <strong style={{ color: part.color, fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em' }}>
                {part.name.toUpperCase()}
              </strong>
              <p style={{ marginTop: 10, fontSize: 14, color: 'var(--mist)', lineHeight: 1.6 }}>{part.desc}</p>
            </div>
          </div>
        </div>

        {/* Frequency ceiling */}
        <div className="split-2" style={{ marginTop: 64, gap: 44, alignItems: 'start' }}>
          <div>
            <h3 style={{ fontSize: 24, marginTop: 0 }}>The ceiling is the trap</h3>
            <p>
              The mechanism only works at low frequencies — heavy tissue vibrates slowly — capping
              baleen whale calls at roughly <strong style={{ color: 'var(--lumen)' }}>300&nbsp;Hz</strong>.
              It also only works in the upper water column: above about 100&nbsp;m of depth, because the
              air-recycling loop depends on lung pressure.
            </p>
            <p>
              That puts their entire vocal range squarely inside the band dominated by commercial
              shipping noise. They cannot sing higher to climb out of it, and they cannot dive below it.
              The same evolutionary novelty that gave them a voice fixes that voice in the one frequency
              band humans have filled with engine noise.
            </p>
            <div className="stat-grid" style={{ marginTop: 24, gridTemplateColumns: '1fr 1fr' }}>
              <div className="panel">
                <div className="bignum" style={{ color: 'var(--lumen)' }}>~300<span className="unit">Hz ceiling</span></div>
                <p className="small" style={{ marginTop: 6 }}>Physiological upper limit on call frequency.</p>
              </div>
              <div className="panel">
                <div className="bignum" style={{ color: 'var(--lumen)' }}>~100<span className="unit">m depth limit</span></div>
                <p className="small" style={{ marginTop: 6 }}>Above which the air-recycling mechanism works.</p>
              </div>
            </div>
          </div>

          <div className="panel panel--lumen" style={{ padding: '20px 24px 16px' }}>
            <span className="corner mono">FIG. 05 · frequency overlap (illustrative)</span>
            <SpectrumChart />
          </div>
        </div>

        {/* Synthesis */}
        <div className="panel" style={{ marginTop: 56, padding: '28px 32px', borderLeft: '3px solid var(--coral, #ff6b54)' }}>
          <h3 style={{ marginTop: 0, fontSize: 20 }}>An evolutionary trap</h3>
          <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65, maxWidth: '64ch' }}>
            Convergence gave whales and birds and humans the capacity for learned vocal communication.
            But anatomy is destiny: the very structure that lets a baleen whale sing also locks its
            song into a narrow, low, shallow band — the band our ships have made loudest. Understanding
            the mechanism is not just anatomy; it sets a hard limit on which conservation interventions
            could ever help.
          </p>
        </div>

        <p className="small" style={{ marginTop: 32, color: 'var(--shoal)' }}>
          Larynx schematic and frequency figure are illustrative, based on Elemans et&nbsp;al. (2024, Nature).
          Frequency bands are approximate.
        </p>
      </div>
    </section>
  )
}
