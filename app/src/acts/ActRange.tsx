import { useRef, useState } from 'react'
import * as d3 from 'd3'
import { RANGES, RANGE_LANDMARKS, SPECIES_COLORS } from '../lib/data'
import { useSize } from '../lib/hooks'
import { Eyebrow } from '../components/Eyebrow'

function RangeChart({ marker, setMarker, selected, setSelected }: {
  marker: number
  setMarker: (km: number) => void
  selected: string
  setSelected: (id: string) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const size = useSize(wrapRef)
  const W = Math.max(820, size.w)
  const H = 540
  const m = { top: 70, right: 40, bottom: 110, left: 80 }

  const x = d3.scaleLog().domain([0.05, 25000]).range([m.left, W - m.right])
  const ROW = 44
  const rowY = (i: number) => m.top + 12 + i * (ROW + 6)

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const move = (ev: PointerEvent) => {
      const px = ev.clientX - rect.left
      const km = Math.max(0.05, Math.min(25000, x.invert(px)))
      setMarker(km)
    }
    move(e.nativeEvent as PointerEvent)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function audibility(species: typeof RANGES[0], km: number) {
    if (km <= species.peak) return 1
    if (km >= species.max)  return 0
    const t = (km - species.peak) / (species.max - species.peak)
    return Math.max(0, 1 - t * t)
  }

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} onPointerDown={onPointerDown}
           style={{ cursor: 'ew-resize', userSelect: 'none', display: 'block' }}>

        <defs>
          {RANGES.map((s) => {
            const x0 = x(0.05), x1 = x(s.max)
            return (
              <linearGradient id={`grad-${s.id}`} key={s.id}
                              x1={x0} x2={x1} y1="0" y2="0"
                              gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={SPECIES_COLORS[s.id]} stopOpacity="0.05"/>
                <stop offset={`${(x(s.peak * 0.4) - x0) / (x1 - x0) * 100}%`} stopColor={SPECIES_COLORS[s.id]} stopOpacity="0.85"/>
                <stop offset={`${(x(s.peak) - x0) / (x1 - x0) * 100}%`} stopColor={SPECIES_COLORS[s.id]} stopOpacity="0.95"/>
                <stop offset="100%" stopColor={SPECIES_COLORS[s.id]} stopOpacity="0"/>
              </linearGradient>
            )
          })}
        </defs>

        <g>
          <circle cx={x(0.05)} cy={H/2 + 8} r={6} fill="#4afdc6"
                  style={{ filter: 'drop-shadow(0 0 12px #4afdc6)' }}/>
          <text x={x(0.05)} y={H/2 - 12} fill="#4afdc6" fontSize="10"
                fontFamily="IBM Plex Mono" textAnchor="middle" letterSpacing="1">SOURCE</text>
        </g>

        {RANGE_LANDMARKS.map((L) => (
          <g key={L.km}>
            <line x1={x(L.km)} x2={x(L.km)} y1={m.top - 18} y2={H - m.bottom + 14}
                  stroke="rgba(238,243,250,0.08)" strokeDasharray="2 4"/>
          </g>
        ))}

        {RANGES.map((s, i) => {
          const isSel = selected === s.id
          const isMarkerInRange = marker <= s.max
          const aud = audibility(s, marker)
          return (
            <g key={s.id}
               onClick={(e) => { e.stopPropagation(); setSelected(s.id) }}
               style={{ cursor: 'pointer' }}>
              <rect x={x(0.05)} y={rowY(i)} width={x(s.max) - x(0.05)} height={ROW - 8}
                    fill={`url(#grad-${s.id})`}
                    opacity={isSel ? 1 : 0.85}
                    rx={2}/>
              <line x1={x(s.peak)} x2={x(s.peak)}
                    y1={rowY(i) - 2} y2={rowY(i) + ROW - 6}
                    stroke={SPECIES_COLORS[s.id]} strokeOpacity={0.9} strokeWidth={1.5}
                    strokeDasharray="2 2"/>
              <text x={x(0.05) - 12} y={rowY(i) + (ROW-8)/2 + 5}
                    fill={SPECIES_COLORS[s.id]} fontSize={isSel ? 16 : 14}
                    fontFamily="Newsreader" fontStyle="italic"
                    textAnchor="end"
                    style={{ filter: isSel ? `drop-shadow(0 0 10px ${SPECIES_COLORS[s.id]})` : 'none' }}>
                {s.name}
              </text>
              <text x={Math.min(W - m.right - 4, x(s.max) + 6)} y={rowY(i) + (ROW-8)/2 + 4}
                    fill={SPECIES_COLORS[s.id]} opacity={0.7}
                    fontSize="10" fontFamily="IBM Plex Mono">
                ≤ {s.max >= 1000 ? (s.max/1000).toFixed(1) + ' Mm' : s.max + ' km'}
              </text>
              {isMarkerInRange && (
                <circle cx={x(marker)} cy={rowY(i) + (ROW-8)/2}
                        r={aud > 0.4 ? 5 : 3.5}
                        fill={SPECIES_COLORS[s.id]}
                        opacity={Math.max(0.25, aud)}
                        style={{ filter: aud > 0.5 ? `drop-shadow(0 0 ${aud*14}px ${SPECIES_COLORS[s.id]})` : 'none' }}/>
              )}
            </g>
          )
        })}

        <line x1={m.left} x2={W - m.right} y1={H - m.bottom + 14} y2={H - m.bottom + 14}
              stroke="rgba(238,243,250,0.2)"/>
        {[0.1, 1, 10, 100, 1000, 10000].map(t => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={H - m.bottom + 14} y2={H - m.bottom + 20}
                  stroke="rgba(238,243,250,0.4)"/>
            <text x={x(t)} y={H - m.bottom + 36} fill="#b6c8df"
                  fontFamily="IBM Plex Mono" fontSize="11" textAnchor="middle">
              {t >= 1000 ? (t/1000) + ' Mm' : t + ' km'}
            </text>
          </g>
        ))}
        {RANGE_LANDMARKS.map(L => (
          <text key={L.km} x={x(L.km)} y={H - m.bottom + 56}
                fill="#5b82b8" textAnchor="middle"
                fontFamily="IBM Plex Sans" fontStyle="italic" fontSize="11">
            {L.label}
          </text>
        ))}
        <text x={(W + m.left) / 2} y={H - 18} fill="#5b82b8"
              fontFamily="IBM Plex Sans" fontSize="11" letterSpacing="2"
              textAnchor="middle">
          DISTANCE FROM SOURCE — LOG SCALE
        </text>

        <g>
          <line x1={x(marker)} x2={x(marker)} y1={m.top - 30} y2={H - m.bottom + 14}
                stroke="#c6ffe6" strokeWidth={1.2} strokeOpacity={0.9}
                style={{ filter: 'drop-shadow(0 0 8px #4afdc6)' }}/>
          <g transform={`translate(${x(marker)}, ${m.top - 38})`}>
            <rect x={-44} y={-12} width={88} height={22} rx={11}
                  fill="#03060f" stroke="#4afdc6" strokeWidth="1"/>
            <text y={3} fill="#c6ffe6" fontSize="11"
                  fontFamily="IBM Plex Mono" textAnchor="middle">
              {marker < 1 ? Math.round(marker * 1000) + ' m'
                : marker < 100 ? marker.toFixed(1) + ' km'
                : marker < 1000 ? Math.round(marker) + ' km'
                : (marker/1000).toFixed(1) + ' Mm'}
            </text>
          </g>
        </g>
      </svg>
    </div>
  )
}

export function ActRange() {
  const [marker, setMarker] = useState(30)
  const [selected, setSelected] = useState('blue')
  const sel = RANGES.find(r => r.id === selected)!
  const audible = RANGES.filter(r => marker <= r.max)

  return (
    <section id="range" className="act" data-screen-label="03 Range">
      <div className="col-xwide">
        <Eyebrow num={2}>Carrying distance</Eyebrow>
        <h2>How far does a&nbsp;voice&nbsp;<em>travel</em>?</h2>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          Pitch decides where you live in the ocean; it also decides how far you can&nbsp;reach.
          Higher tones die in metres. Lower tones cross continents.
        </p>

        <div className="panel panel--lumen" style={{ padding: 20, marginTop: 32 }}>
          <span className="corner mono">FIG. 02 · effective communication range · drag the marker</span>
          <RangeChart marker={marker} setMarker={setMarker} selected={selected} setSelected={setSelected} />
        </div>

        <div className="split-12-1" style={{ marginTop: 40, gap: 48 }}>
          <div>
            <p>
              Seawater absorbs high-frequency sound exponentially: every doubling of frequency roughly halves the range
              for a given source level. A beluga&apos;s chirp at 50&nbsp;kilohertz fades inside a kilometre. A blue whale&apos;s 20&nbsp;hertz moan,
              launched into the right depth layer, can be picked up on the other side of an ocean.
            </p>
            <p>
              The right depth layer is the <a className="inline" href="#spectrum">SOFAR&nbsp;channel</a> — a sound duct around 700–1200&nbsp;m where the speed of sound
              hits a minimum. Energy launched there is refracted back into itself instead of being lost to the surface or floor.
              Fin and blue whales, evolved for it, ride that duct as if it were a telephone line.
            </p>
            <p>
              Move the marker overhead. The dots that brighten are the species whose calls can still find you at that distance.
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ color: SPECIES_COLORS[selected], marginBottom: 14 }}>
              <span className="rule" style={{ background: SPECIES_COLORS[selected] }}></span>
              <span>Selected · {sel.name}</span>
            </div>
            <p style={{ fontSize: 15, color: 'var(--mist)', maxWidth: '34ch' }}>{sel.note}</p>
            <div className="specimen" style={{ marginTop: 18 }}>
              <span className="latin">at the marker</span>
              <span className="name">{audible.length} of 6 audible</span>
              <div className="coord-row" style={{ flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                {audible.map(a => (
                  <span key={a.id} style={{ color: SPECIES_COLORS[a.id] }}>
                    {a.name} <span className="v" style={{ marginLeft: 8, fontSize: 10, color: 'var(--shoal)' }}>
                      {marker <= a.peak ? '◉ clear' : '◌ fringe'}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
