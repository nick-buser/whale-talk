import { useState, useEffect, useRef, useCallback } from 'react'
import { ANATOMY } from '../lib/data'
import { useSize } from '../lib/hooks'
import { whaleAudio } from '../lib/audio'
import { Eyebrow } from '../components/Eyebrow'
import { Chip } from '../components/Chip'

const REGION_COLORS: Record<string, string> = {
  spermaceti: '#7da6ff',
  junk:       '#4afdc6',
  frontalsac: '#ffb472',
  rightsac:   '#b6c8df',
  mds:        '#c6ffe6',
  blowhole:   '#5b82b8',
  blowholes:  '#5b82b8',
  trachea:    '#b6c8df',
  larynx:     '#c6ffe6',
  cords:      '#4afdc6',
  sac:        '#ffb472',
  lung:       '#7da6ff',
}

interface WaypointPos { x: number; y: number; idx: number }

function ClickPulse({ pathPoints, running, onDone, color = '#4afdc6' }: {
  pathPoints: Array<{ x: number; y: number; label: string }>
  running: boolean
  onDone?: () => void
  color?: string
}) {
  const [pos, setPos] = useState<WaypointPos>({ x: pathPoints[0].x, y: pathPoints[0].y, idx: 0 })
  const [active, setActive] = useState(false)
  const [traveled, setTraveled] = useState<number[]>([])

  useEffect(() => {
    if (!running) {
      setActive(false)
      setTraveled([])
      setPos({ x: pathPoints[0].x, y: pathPoints[0].y, idx: 0 })
      return
    }
    setActive(true)
    setTraveled([0])
    let i = 0
    const step = () => {
      if (i >= pathPoints.length - 1) { setActive(false); onDone && onDone(); return }
      const a = pathPoints[i], b = pathPoints[i+1]
      const startT = performance.now()
      const dur = 380
      const animate = (now: number) => {
        const tt = Math.min(1, (now - startT) / dur)
        const e = 1 - Math.pow(1 - tt, 3)
        setPos({ x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, idx: i })
        if (tt < 1) requestAnimationFrame(animate)
        else { i++; setTraveled(prev => [...prev, i]); setTimeout(step, 60) }
      }
      requestAnimationFrame(animate)
    }
    step()
  }, [running])

  if (!active && traveled.length === 0) return null

  const trailPts = pathPoints.slice(0, pos.idx + 1).concat([{ x: pos.x, y: pos.y, label: '' }])
  const trailD = trailPts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ')
  const cur = pathPoints[pos.idx]
  const lbl = cur && cur.label

  return (
    <g>
      <path d={trailD} fill="none" stroke={color} strokeWidth={2}
            strokeOpacity={0.55} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}/>
      <circle cx={pos.x} cy={pos.y} r={9} fill="none" stroke={color} strokeOpacity={0.4}/>
      <circle cx={pos.x} cy={pos.y} r={5} fill={color}
              style={{ filter: `drop-shadow(0 0 14px ${color})` }}/>
      {lbl && (
        <g transform={`translate(${pos.x}, ${pos.y - 24})`}>
          <rect x={-86} y={-12} width={172} height={20} rx={10}
                fill="#03060f" stroke={color} strokeOpacity="0.5"/>
          <text y={3} fill={color} fontSize="11"
                fontFamily="IBM Plex Mono" textAnchor="middle">
            {lbl}
          </text>
        </g>
      )}
    </g>
  )
}

function AnatomyDiagram({ which, hovered, setHovered }: {
  which: string
  hovered: string | null
  setHovered: (id: string | null) => void
}) {
  const cfg = ANATOMY[which]
  const [vbX, vbY, vbW, vbH] = cfg.viewBox
  const [pulseRunning, setPulseRunning] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const size = useSize(wrapRef)
  const W = Math.max(720, size.w)
  const H = (vbH / vbW) * W
  const svgRef = useRef<SVGSVGElement>(null)

  function fireClick() {
    setPulseRunning(false)
    setTimeout(() => setPulseRunning(true), 50)
    void whaleAudio.resume()
    if (which === 'sperm') {
      whaleAudio.playCoda([0.18, 0.18, 0.18, 0.18])
    } else {
      const now = whaleAudio.now() + 0.05
      whaleAudio.moan(now, { f0: 120, f1: 280, dur: 1.2, vibrato: 4, harmonics: [1, 0.4, 0.18] })
    }
  }

  // Compute label positions using a temp SVG path
  const labelPositions = cfg.parts.map(part => {
    const reg = cfg.regions[part.id]
    if (!reg) return null
    try {
      const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      tmp.setAttribute('d', reg.d)
      const tlen = tmp.getTotalLength ? tmp.getTotalLength() : 0
      const pa = tmp.getPointAtLength ? tmp.getPointAtLength(tlen * 0.25) : null
      const pb = tmp.getPointAtLength ? tmp.getPointAtLength(tlen * 0.5) : null
      const pc = tmp.getPointAtLength ? tmp.getPointAtLength(tlen * 0.75) : null
      if (!pa || !pb || !pc) return null
      const cx = (pa.x + pb.x + pc.x) / 3
      const cy = (pa.y + pb.y + pc.y) / 3
      const labelAbove = cy < 200
      const lx = cx
      const ly = labelAbove ? Math.max(20, cy - 60) : Math.min(410, cy + 60)
      return { cx, cy, lx, ly, labelAbove, id: part.id }
    } catch {
      return null
    }
  })

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <svg ref={svgRef} width={W} height={H} viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
           style={{ display: 'block', maxHeight: 480 }}>
        <defs>
          <radialGradient id="ana-body-grad" cx="0.4" cy="0.4">
            <stop offset="0%" stopColor="#0a1730"/>
            <stop offset="100%" stopColor="#03060f"/>
          </radialGradient>
          <filter id="ana-soft">
            <feGaussianBlur stdDeviation="0.6"/>
          </filter>
        </defs>

        <path d={cfg.outline} fill="url(#ana-body-grad)"
              stroke="rgba(238,243,250,0.4)" strokeWidth={1.2}/>
        <path d={cfg.mouth} fill="none" stroke="rgba(238,243,250,0.35)" strokeWidth={1.1}/>
        <circle cx={cfg.eye.x} cy={cfg.eye.y} r={3.2} fill="#eef3fa"/>
        <circle cx={cfg.eye.x} cy={cfg.eye.y} r={1.2} fill="#03060f"/>

        {cfg.parts.map(part => {
          const reg = cfg.regions[part.id]
          if (!reg) return null
          const isHov = hovered === part.id
          const c = REGION_COLORS[part.id] || '#4afdc6'
          return (
            <g key={part.id}
               onMouseEnter={() => setHovered(part.id)}
               onMouseLeave={() => setHovered(null)}
               onClick={() => setHovered(part.id)}
               style={{ cursor: 'pointer' }}>
              <path d={reg.d} fill={c} fillOpacity={isHov ? 0.4 : 0.16}
                    stroke={c} strokeOpacity={isHov ? 1 : 0.55}
                    strokeWidth={isHov ? 1.6 : 1}
                    style={{ filter: isHov ? `drop-shadow(0 0 12px ${c})` : 'none',
                             transition: 'all 220ms var(--ease-glide)' }}/>
            </g>
          )
        })}

        {labelPositions.map((lp, i) => {
          if (!lp) return null
          const part = cfg.parts[i]
          const isHov = hovered === part.id
          const c = REGION_COLORS[part.id] || '#4afdc6'
          return (
            <g key={part.id + '-lbl'} style={{ pointerEvents: 'none' }}>
              <line x1={lp.cx} y1={lp.cy} x2={lp.lx} y2={lp.ly}
                    stroke={c} strokeOpacity={isHov ? 0.95 : 0.35} strokeWidth={1}/>
              <circle cx={lp.cx} cy={lp.cy} r={2.6} fill={c}/>
              <text x={lp.lx} y={lp.ly + (lp.labelAbove ? -8 : 14)} fill={isHov ? c : '#b6c8df'}
                    fontSize={isHov ? 12 : 11}
                    fontFamily="IBM Plex Sans" textAnchor="middle"
                    letterSpacing="0.04em"
                    style={{ transition: 'all 200ms var(--ease-glide)' }}>
                {part.name}
              </text>
            </g>
          )
        })}

        <ClickPulse pathPoints={cfg.clickPath} running={pulseRunning}
                    onDone={() => setPulseRunning(false)}
                    color={which === 'sperm' ? '#4afdc6' : '#7da6ff'}/>
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px 0' }}>
        <button className="btn btn-primary" onClick={fireClick} disabled={pulseRunning}>
          {pulseRunning ? '◉ Sounding…'
            : which === 'sperm' ? '► Fire a click' : '► Begin a song unit'}
        </button>
        <span className="mono" style={{ color: 'var(--shoal)', fontSize: 11 }}>
          hover or tap a region to read
        </span>
      </div>
    </div>
  )
}

export function ActAnatomy() {
  const [which, setWhich] = useState<'sperm' | 'humpback'>('sperm')
  const [hovered, setHovered] = useState<string | null>(null)
  const cfg = ANATOMY[which]
  const part = cfg.parts.find(p => p.id === hovered) || cfg.parts[2]

  return (
    <section id="anatomy" className="act" data-screen-label="04 Anatomy">
      <div className="col-xwide">
        <Eyebrow num={3}>The instrument</Eyebrow>
        <h2>Whales sing&nbsp;<em>through their heads.</em></h2>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          Toothed whales make sound in the nose. Baleen whales make it in the throat without losing breath.
          Both are evolutionary inventions for the same problem: pushing energy into water.
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 24, marginBottom: 16 }}>
          <Chip active={which === 'sperm'} onClick={() => { setWhich('sperm'); setHovered(null) }}>
            <span className="dot" style={{ background: '#4afdc6' }}></span>Sperm whale · phonic lips
          </Chip>
          <Chip active={which === 'humpback'} onClick={() => { setWhich('humpback'); setHovered(null) }}>
            <span className="dot" style={{ background: '#7da6ff' }}></span>Humpback · laryngeal sac
          </Chip>
        </div>

        <div className="split-12-1" style={{ gap: 40 }}>
          <div className="panel panel--lumen" style={{ padding: 12 }}>
            <span className="corner mono">FIG. 03 · cross section · {cfg.label.toLowerCase()}</span>
            <AnatomyDiagram which={which} hovered={hovered} setHovered={setHovered}/>
          </div>
          <div>
            <h3 style={{ fontSize: 24, marginTop: 0 }}>{cfg.label}</h3>
            <p style={{ fontStyle: 'italic', color: 'var(--mist)', fontSize: 14, margin: 0 }}>{cfg.latin}</p>
            <p style={{ marginTop: 16, fontSize: 15 }}>{cfg.intro}</p>

            <div style={{ marginTop: 24, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <div className="eyebrow" style={{ color: 'var(--lumen)', marginBottom: 8 }}>
                <span className="rule"></span>
                <span>{hovered ? 'Selected' : 'Default · phonic structure'}</span>
              </div>
              <strong style={{ color: 'var(--foam)', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em' }}>
                {part.name.toUpperCase()}
              </strong>
              <p style={{ marginTop: 10, fontSize: 14, color: 'var(--mist)' }}>{part.desc}</p>
            </div>

            <p className="small" style={{ marginTop: 24, color: 'var(--shoal)' }}>
              Diagram is schematic — internal regions are sized for clarity, not anatomical accuracy.
            </p>
          </div>
        </div>

        <div className="split-2" style={{ marginTop: 80 }}>
          <div>
            <h3 style={{ fontSize: 24 }}>Why such different machines?</h3>
            <p>
              Toothed whales evolved sound for <em>echolocation</em> — a short, sharp, broadband pulse that returns useful echoes from prey.
              The whole click apparatus is essentially a directional sonar gun. Sperm whales, the largest of them, scaled the gun up until it took up
              a third of the body.
            </p>
            <p>
              Baleen whales never developed echolocation. Their vocalisations are long tonal calls used for distance communication,
              not for sensing. A throat-based mechanism with air recycling is cheap to run for hours and pumps a lot of energy into low frequencies.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 24 }}>The bent-horn click</h3>
            <p>
              When a sperm whale clicks, you don&apos;t hear one pulse — you hear a structured echo. The click is generated at the front of the spermaceti,
              <em> bounces back</em> off the frontal air sac, <em>passes forward</em> through the spermaceti, then radiates from the junk.
            </p>
            <p>
              The interval between the &ldquo;p<sub>0</sub>&rdquo; surface pulse and the &ldquo;p<sub>1</sub>&rdquo; through-and-out pulse is proportional to the length of the spermaceti
              — and therefore to the size of the whale. Researchers can <em>measure</em> a sperm whale&apos;s length from a single click. The whale is, in a real sense, an instrument that announces its own dimensions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
