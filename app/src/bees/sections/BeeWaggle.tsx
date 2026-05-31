import { useState, useRef, useCallback, useEffect } from 'react'

/* ── Constants ──────────────────────────────────────────────── */
const MAP_W = 400
const MAP_H = 300
const HIVE_X = 200
const HIVE_Y = 220
const SUN_R = 220  // radius from hive where sun sits (for display)

// Kohl & Rutschmann 2011 nonlinear distance-to-duration curve
// duration (s) = 1.34 * ln(dist_m / 150 + 1)
function distToDuration(distM: number): number {
  return 1.34 * Math.log(distM / 150 + 1)
}

// Inverse: metres from duration
function durationToDist(t: number): number {
  return 150 * (Math.exp(t / 1.34) - 1)
}

// Bee dance SVG dimensions
const DANCE_W = 280
const DANCE_H = 280
const DC_X = 140  // dance centre
const DC_Y = 140
const WAGGLE_LEN = 70
const ARC_R = 36

/* ── Dance animation ────────────────────────────────────────── */
interface DanceFrame {
  phase: 'waggle1' | 'arc-right' | 'waggle2' | 'arc-left'
  t: number   // 0-1 within phase
}

function getDancePathD(angleRad: number, waggleLen: number): { waggle1: string; arcRight: string; waggle2: string; arcLeft: string } {
  // Waggle run goes from bottom-centre to top-centre, rotated by angleRad
  // In SVG: y increases downward, so "up" = negative y
  const cos = Math.cos(angleRad)
  const sin = Math.sin(angleRad)

  // Unit vector along waggle direction (from start to end)
  const ux = sin
  const uy = -cos  // up in SVG coords

  // Start of waggle run (negative direction from centre)
  const x0 = DC_X - ux * waggleLen / 2
  const y0 = DC_Y - uy * waggleLen / 2
  // End of waggle run
  const x1 = DC_X + ux * waggleLen / 2
  const y1 = DC_Y + uy * waggleLen / 2

  // Right-arc return: from x1,y1 arc back to x0,y0 on the right side
  // Left-arc return: from x0,y0 arc back to x1,y1 on the left side
  const r = ARC_R
  const sweep1 = 1  // clockwise for right arc
  const sweep2 = 0  // counter-clockwise for left arc

  return {
    waggle1:  `M ${x0} ${y0} L ${x1} ${y1}`,
    arcRight: `M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep1} ${x0} ${y0}`,
    waggle2:  `M ${x0} ${y0} L ${x1} ${y1}`,
    arcLeft:  `M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep2} ${x0} ${y0}`,
  }
}

/* ── Bee dot along a path using getPointAtLength polyfill ───── */
function pointOnLine(x0: number, y0: number, x1: number, y1: number, t: number): { x: number; y: number } {
  return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t }
}

// Get point along arc (SVG arc approximated as two bezier segments would be complex;
// instead parameterize the arc by angle)
function pointOnArc(
  x1: number, y1: number,
  x0: number, y0: number,
  r: number, sweep: number,
  t: number
): { x: number; y: number } {
  // Compute centre of arc from endpoints and radius
  const dx = x0 - x1, dy = y0 - y1
  const d = Math.sqrt(dx * dx + dy * dy)
  const h = Math.sqrt(Math.max(0, r * r - d * d / 4))
  const mx = (x1 + x0) / 2
  const my = (y1 + y0) / 2
  const sign = sweep === 1 ? 1 : -1
  const cx = mx + sign * h * dy / d
  const cy = my - sign * h * dx / d
  // Angles from centre
  const a0 = Math.atan2(y1 - cy, x1 - cx)
  const a1 = Math.atan2(y0 - cy, x0 - cx)
  let da = a1 - a0
  if (sweep === 1 && da < 0) da += 2 * Math.PI
  if (sweep === 0 && da > 0) da -= 2 * Math.PI
  const a = a0 + da * t
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/* ── Info rows ─────────────────────────────────────────────── */
const ENCODING_ROWS = [
  { channel: 'Direction', mechanism: 'Waggle-run angle vs. gravity', encodes: 'Solar azimuth of food source', precision: '±3°' },
  { channel: 'Distance',  mechanism: 'Waggle-run duration (Kohl & Rutschmann)', encodes: 'Flight distance to food', precision: '±20 m at 1 km' },
  { channel: 'Quality',   mechanism: 'Dance vigour — circuits & buzz frequency', encodes: 'Profitability (energy gain)', precision: 'Relative ordinal' },
  { channel: 'Modality',  mechanism: 'Substrate vibration + airflow', encodes: 'Dance presence to dark-hive receivers', precision: 'Binary' },
]

const DIAL_KEY = [
  { color: '#f4c430', label: 'Food source (draggable)' },
  { color: '#ff6b54', label: 'Hive' },
  { color: 'color-mix(in oklch, #f4c430 40%, transparent)', label: 'Sun direction' },
]

export function BeeWaggle() {
  // Sun azimuth in degrees from north (clockwise), default noon = 180° (south)
  const [sunDeg, setSunDeg] = useState(180)
  // Food position on the map (draggable)
  const [foodPos, setFoodPos] = useState({ x: 280, y: 100 })
  const [dragging, setDragging] = useState(false)
  const mapRef = useRef<SVGSVGElement>(null)
  const animRef = useRef<number | null>(null)
  const [frame, setFrame] = useState<DanceFrame>({ phase: 'waggle1', t: 0 })
  const [running, setRunning] = useState(true)

  // Compute dance angle and duration from food position + sun
  const dx = foodPos.x - HIVE_X
  const dy = foodPos.y - HIVE_Y
  const distPx = Math.sqrt(dx * dx + dy * dy)
  const SCALE = 10  // 1 px = 10 m
  const distM = Math.max(50, distPx * SCALE)

  // Food azimuth relative to up-on-screen (north), clockwise
  const foodAzimuthDeg = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360

  // Dance angle = food azimuth minus sun azimuth (transposed to gravity)
  const danceAngleDeg = (foodAzimuthDeg - sunDeg + 360) % 360
  const danceAngleRad = danceAngleDeg * Math.PI / 180

  const duration = distToDuration(distM)
  const waggleLen = Math.min(90, Math.max(30, 30 + (duration / 3.5) * 60))

  const paths = getDancePathD(danceAngleRad, waggleLen)

  // Animation loop
  const PHASE_DURATIONS = { 'waggle1': duration * 500, 'arc-right': 400, 'waggle2': duration * 500, 'arc-left': 400 }
  const PHASES: DanceFrame['phase'][] = ['waggle1', 'arc-right', 'waggle2', 'arc-left']

  useEffect(() => {
    if (!running) return
    let startTime: number | null = null
    let phaseIdx = 0
    let phaseStart = 0

    function tick(now: number) {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const phaseDur = PHASE_DURATIONS[PHASES[phaseIdx]]
      const phaseElapsed = elapsed - phaseStart
      if (phaseElapsed >= phaseDur) {
        phaseIdx = (phaseIdx + 1) % 4
        phaseStart = elapsed
        setFrame({ phase: PHASES[phaseIdx], t: 0 })
      } else {
        setFrame({ phase: PHASES[phaseIdx], t: phaseElapsed / phaseDur })
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, duration, danceAngleRad])

  // Compute bee dot position from frame
  const ux = Math.sin(danceAngleRad)
  const uy = -Math.cos(danceAngleRad)
  const wx0 = DC_X - ux * waggleLen / 2
  const wy0 = DC_Y - uy * waggleLen / 2
  const wx1 = DC_X + ux * waggleLen / 2
  const wy1 = DC_Y + uy * waggleLen / 2

  let beeDot = { x: wx0, y: wy0 }
  if (frame.phase === 'waggle1') {
    beeDot = pointOnLine(wx0, wy0, wx1, wy1, frame.t)
  } else if (frame.phase === 'arc-right') {
    beeDot = pointOnArc(wx1, wy1, wx0, wy0, ARC_R, 1, frame.t)
  } else if (frame.phase === 'waggle2') {
    beeDot = pointOnLine(wx0, wy0, wx1, wy1, frame.t)
  } else {
    beeDot = pointOnArc(wx1, wy1, wx0, wy0, ARC_R, 0, frame.t)
  }

  // Map interaction
  const onMapMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const scaleX = MAP_W / rect.width
    const scaleY = MAP_H / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    const fdx = mx - foodPos.x, fdy = my - foodPos.y
    if (Math.sqrt(fdx * fdx + fdy * fdy) < 20) setDragging(true)
  }, [foodPos])

  const onMapMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging || !mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const scaleX = MAP_W / rect.width
    const scaleY = MAP_H / rect.height
    const mx = Math.max(20, Math.min(MAP_W - 20, (e.clientX - rect.left) * scaleX))
    const my = Math.max(20, Math.min(MAP_H - 20, (e.clientY - rect.top) * scaleY))
    setFoodPos({ x: mx, y: my })
  }, [dragging])

  const onMapMouseUp = useCallback(() => setDragging(false), [])

  // Sun position on map (on a circle around hive)
  const sunRad = (sunDeg - 90) * Math.PI / 180
  const sunX = HIVE_X + Math.cos(sunRad) * 160
  const sunY = HIVE_Y + Math.sin(sunRad) * 160

  return (
    <div className="bee-waggle">
      <p className="bee-intro-eyebrow">Waggle Dance</p>
      <h1 className="bee-intro-title">The Dance Language</h1>
      <p className="bee-intro-lede">
        Drag the flower to any location. The dance updates in real time — waggle-run angle
        encodes the solar azimuth of the food, run duration encodes distance via the
        Kohl & Rutschmann nonlinear curve.
      </p>

      <div className="bee-waggle-sim">
        {/* Map panel */}
        <div className="bee-waggle-map-panel">
          <h2 className="bee-section-h2">Foraging Map</h2>
          <p className="bee-intro-sub">Drag the flower ⬡. Adjust sun azimuth below.</p>
          <svg
            ref={mapRef}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="bee-map-svg"
            onMouseDown={onMapMouseDown}
            onMouseMove={onMapMouseMove}
            onMouseUp={onMapMouseUp}
            onMouseLeave={onMapMouseUp}
          >
            {/* Background */}
            <rect width={MAP_W} height={MAP_H} fill="var(--bee-cell)" rx="6" />
            {/* Distance rings */}
            {[50, 100, 150].map(r => (
              <circle key={r} cx={HIVE_X} cy={HIVE_Y} r={r} fill="none"
                stroke="var(--bee-wall)" strokeWidth="1" strokeDasharray="4 3" />
            ))}
            {[50, 100, 150].map((r, i) => (
              <text key={r} x={HIVE_X + r + 4} y={HIVE_Y + 4}
                fontSize="9" fill="var(--bee-deep)" fontFamily="var(--font-mono)">
                {[500, 1000, 1500][i]}m
              </text>
            ))}
            {/* Sun direction line */}
            <line x1={HIVE_X} y1={HIVE_Y} x2={sunX} y2={sunY}
              stroke="color-mix(in oklch, #f4c430 40%, transparent)"
              strokeWidth="1" strokeDasharray="6 4" />
            {/* Sun icon */}
            <circle cx={sunX} cy={sunY} r={14} fill="color-mix(in oklch, #f4c430 20%, transparent)"
              stroke="color-mix(in oklch, #f4c430 50%, transparent)" strokeWidth="1.5" />
            <text x={sunX} y={sunY + 5} textAnchor="middle" fontSize="14">☀</text>
            {/* Food-to-hive line */}
            <line x1={HIVE_X} y1={HIVE_Y} x2={foodPos.x} y2={foodPos.y}
              stroke="color-mix(in oklch, #f4c430 35%, transparent)"
              strokeWidth="1.5" strokeDasharray="5 3" />
            {/* Hive */}
            <circle cx={HIVE_X} cy={HIVE_Y} r={12} fill="#ff6b54" opacity={0.9} />
            <text x={HIVE_X} y={HIVE_Y + 5} textAnchor="middle" fontSize="12">⬡</text>
            {/* Food source (draggable) */}
            <circle cx={foodPos.x} cy={foodPos.y} r={14}
              fill={dragging ? 'color-mix(in oklch, #f4c430 30%, transparent)' : 'color-mix(in oklch, #f4c430 18%, transparent)'}
              stroke="var(--bee)" strokeWidth="2" style={{ cursor: 'grab' }} />
            <text x={foodPos.x} y={foodPos.y + 5} textAnchor="middle" fontSize="14">🌸</text>
          </svg>

          {/* Sun azimuth slider */}
          <div className="bee-waggle-slider-row">
            <label className="bee-waggle-slider-label">
              <span>☀ Sun azimuth</span>
              <span className="bee-waggle-slider-val">{sunDeg}°</span>
            </label>
            <input
              type="range" min={0} max={359} value={sunDeg}
              onChange={e => setSunDeg(Number(e.target.value))}
              className="bee-waggle-slider"
            />
            <div className="bee-waggle-slider-ticks">
              {['N', 'E', 'S', 'W'].map((d, i) => (
                <span key={d} style={{ left: `${i * 33.33}%` }}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Dance panel */}
        <div className="bee-waggle-dance-panel">
          <h2 className="bee-section-h2">Live Dance</h2>
          <p className="bee-intro-sub">Figure-eight on the vertical comb face.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg viewBox={`0 0 ${DANCE_W} ${DANCE_H}`} className="bee-dance-svg">
              <rect width={DANCE_W} height={DANCE_H} fill="var(--bee-cell)" rx="6" />
              {/* Gravity arrow (up = "toward sun") */}
              <line x1={DC_X} y1={30} x2={DC_X} y2={10}
                stroke="color-mix(in oklch, #f4c430 50%, transparent)" strokeWidth="1.5" markerEnd="url(#arr-sun)" />
              <text x={DC_X + 8} y={25} fontSize="9" fill="var(--bee-deep)" fontFamily="var(--font-sans)">↑ sun</text>
              <defs>
                <marker id="arr-sun" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="color-mix(in oklch, #f4c430 50%, transparent)" />
                </marker>
              </defs>
              {/* Dance angle arc indicator */}
              {danceAngleDeg !== 0 && (
                <path
                  d={`M ${DC_X} ${DC_Y - 28} A 28 28 0 ${danceAngleDeg > 180 ? 1 : 0} 1 ${
                    DC_X + 28 * Math.sin(danceAngleRad)} ${DC_Y - 28 * Math.cos(danceAngleRad)}`}
                  fill="none"
                  stroke="color-mix(in oklch, #f4c430 40%, transparent)"
                  strokeWidth="1.5"
                />
              )}
              <text x={DC_X + 28 * Math.sin(danceAngleRad) + (danceAngleDeg < 180 ? 6 : -6)}
                y={DC_Y - 28 * Math.cos(danceAngleRad)}
                textAnchor={danceAngleDeg < 180 ? 'start' : 'end'}
                fontSize="9" fill="var(--bee-deep)" fontFamily="var(--font-mono)"
              >
                {Math.round(danceAngleDeg)}°
              </text>

              {/* Dance paths */}
              {/* Completed loops (faint) */}
              <path d={paths.waggle1}  fill="none" stroke="color-mix(in oklch, #f4c430 20%, transparent)" strokeWidth="2.5" strokeLinecap="round" />
              <path d={paths.arcRight} fill="none" stroke="color-mix(in oklch, #f4c430 12%, transparent)" strokeWidth="1.5" strokeLinecap="round" />
              <path d={paths.waggle2}  fill="none" stroke="color-mix(in oklch, #f4c430 20%, transparent)" strokeWidth="2.5" strokeLinecap="round" />
              <path d={paths.arcLeft}  fill="none" stroke="color-mix(in oklch, #f4c430 12%, transparent)" strokeWidth="1.5" strokeLinecap="round" />

              {/* Active phase */}
              {frame.phase === 'waggle1' && (
                <path d={paths.waggle1} fill="none" stroke="var(--bee)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={waggleLen} strokeDashoffset={waggleLen * (1 - frame.t)} />
              )}
              {frame.phase === 'arc-right' && (
                <path d={paths.arcRight} fill="none" stroke="var(--bee-amber)" strokeWidth="2" strokeLinecap="round"
                  opacity={0.7} />
              )}
              {frame.phase === 'waggle2' && (
                <path d={paths.waggle2} fill="none" stroke="var(--bee)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={waggleLen} strokeDashoffset={waggleLen * (1 - frame.t)} />
              )}
              {frame.phase === 'arc-left' && (
                <path d={paths.arcLeft} fill="none" stroke="var(--bee-amber)" strokeWidth="2" strokeLinecap="round"
                  opacity={0.7} />
              )}

              {/* Bee dot */}
              <circle cx={beeDot.x} cy={beeDot.y} r={5} fill="var(--bee)" opacity={0.95} />
              <circle cx={beeDot.x} cy={beeDot.y} r={9} fill="color-mix(in oklch, #f4c430 25%, transparent)" />

              {/* Waggle highlight during waggle phases */}
              {(frame.phase === 'waggle1' || frame.phase === 'waggle2') && (
                <text x={beeDot.x + 10} y={beeDot.y - 8} fontSize="9" fill="var(--bee)" fontFamily="var(--font-mono)">waggle</text>
              )}
            </svg>
          </div>
          <button
            className="bee-waggle-play"
            onClick={() => setRunning(r => !r)}
          >
            {running ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      {/* Encoding table */}
      <div>
        <h2 className="bee-section-h2">Channel Encoding</h2>
        <div className="bee-waggle-encoding">
          <div className="bee-waggle-enc-head">
            <span>Channel</span><span>Mechanism</span><span>Encodes</span><span>Precision</span>
          </div>
          {ENCODING_ROWS.map(r => (
            <div key={r.channel} className="bee-waggle-enc-row">
              <span className="bee-waggle-enc-ch">{r.channel}</span>
              <span>{r.mechanism}</span>
              <span>{r.encodes}</span>
              <span className="bee-waggle-enc-prec">{r.precision}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="bee-waggle-metrics">
        <div className="bee-waggle-metric">
          <span className="bee-waggle-metric-val">{Math.round(distM)} m</span>
          <span className="bee-waggle-metric-label">Encoded distance</span>
        </div>
        <div className="bee-waggle-metric">
          <span className="bee-waggle-metric-val">{duration.toFixed(2)} s</span>
          <span className="bee-waggle-metric-label">Waggle run duration</span>
        </div>
        <div className="bee-waggle-metric">
          <span className="bee-waggle-metric-val">{Math.round(danceAngleDeg)}°</span>
          <span className="bee-waggle-metric-label">Dance angle (vs. gravity)</span>
        </div>
        <div className="bee-waggle-metric">
          <span className="bee-waggle-metric-val">{Math.round(foodAzimuthDeg)}°</span>
          <span className="bee-waggle-metric-label">Food azimuth (vs. sun)</span>
        </div>
      </div>

      {/* Key */}
      <div className="bee-waggle-key">
        {DIAL_KEY.map(k => (
          <span key={k.label} className="bee-waggle-key-item">
            <span className="bee-waggle-key-dot" style={{ background: k.color }} />
            <span>{k.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
