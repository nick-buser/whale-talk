import { useState, useRef, useEffect } from 'react'
import { whaleAudio } from '../../lib/audio'

// ── Circuit geometry ──────────────────────────────────────────────────────────

const VB_W = 560
const VB_H = 550

type NodeId = 'hvc' | 'ra' | 'nxiits' | 'syrinx' | 'areax' | 'dlm' | 'lman'
type Pathway = 'both' | 'motor' | 'afp'

interface SongNode { id: NodeId; x: number; y: number; label: string; pathway: Pathway }
interface SongEdge { from: NodeId; to: NodeId; pathway: 'motor' | 'afp'; curve?: boolean }

const NODES: SongNode[] = [
  { id: 'hvc',    x: 265, y: 72,  label: 'HVC',    pathway: 'both'  },
  { id: 'areax',  x: 130, y: 200, label: 'Area X', pathway: 'afp'   },
  { id: 'dlm',    x: 130, y: 320, label: 'DLM',    pathway: 'afp'   },
  { id: 'lman',   x: 130, y: 440, label: 'LMAN',   pathway: 'afp'   },
  { id: 'ra',     x: 390, y: 200, label: 'RA',      pathway: 'motor' },
  { id: 'nxiits', x: 390, y: 340, label: 'nXIIts', pathway: 'motor' },
  { id: 'syrinx', x: 390, y: 460, label: 'Syrinx', pathway: 'motor' },
]

const EDGES: SongEdge[] = [
  { from: 'hvc',    to: 'ra',     pathway: 'motor' },
  { from: 'ra',     to: 'nxiits', pathway: 'motor' },
  { from: 'nxiits', to: 'syrinx', pathway: 'motor' },
  { from: 'hvc',    to: 'areax',  pathway: 'afp'   },
  { from: 'areax',  to: 'dlm',    pathway: 'afp'   },
  { from: 'dlm',    to: 'lman',   pathway: 'afp'   },
  { from: 'lman',   to: 'ra',     pathway: 'afp', curve: true },
]

// Motor path waypoints for pulse animation
const MOTOR_PATH: Array<{ x: number; y: number; id: NodeId }> = [
  { x: 265, y: 72,  id: 'hvc'    },
  { x: 390, y: 200, id: 'ra'     },
  { x: 390, y: 340, id: 'nxiits' },
  { x: 390, y: 460, id: 'syrinx' },
]

// ── Node info ─────────────────────────────────────────────────────────────────

interface Info { title: string; sub: string; body: string; lesion: string }

const NODE_INFO: Record<NodeId, Info> = {
  hvc: {
    title: 'HVC',
    sub: 'Premotor timing clock',
    body: 'HVC neurons fire sparse, precisely-timed bursts (~6 ms) that lock to individual syllables in the motif. Each HVC projection neuron fires exactly once per rendition. Cooling HVC slows both tempo and syllable transition probabilities — making it both the timing source and the syntax gate.',
    lesion: 'Adult HVC lesion → immediate loss of crystallized song, replaced by subsong-like babbling.',
  },
  ra: {
    title: 'RA',
    sub: 'Robust Nucleus of the Arcopallium',
    body: 'RA receives sparse timing commands from HVC and stochastic variability from LMAN, then translates them into precise syrinx and respiratory muscle activation sequences. Cooling RA changes tempo without disrupting syllable order — the inverse of cooling HVC, dissociating timing from syntax.',
    lesion: 'RA lesion → loss of song production; auditory memory of the tutor song remains intact.',
  },
  nxiits: {
    title: 'nXIIts',
    sub: 'Tracheosyringeal hypoglossal nucleus',
    body: 'Contains motor neurons of cranial nerve XII (hypoglossal) that directly innervate the intrinsic syrinx muscles. It is the final brainstem relay before the vocal organ, and controls both the tension and geometry of each sound source with millisecond precision.',
    lesion: 'Unilateral lesion eliminates the ipsilateral half of the song; bilateral lesion → near-complete silence.',
  },
  syrinx: {
    title: 'Syrinx',
    sub: 'Avian vocal organ',
    body: 'The syrinx sits at the bronchial junction — unlike the mammalian larynx — and has two independent sound sources (left and right membranes). Songbirds can drive each independently, enabling two-voice singing and acoustic complexity impossible with a single-source system.',
    lesion: 'Denervation collapses song; surgical removal of one side eliminates one voice but the other side adapts.',
  },
  areax: {
    title: 'Area X',
    sub: 'Basal ganglia homologue (AFP)',
    body: 'Area X is the striatal analogue in the avian basal ganglia. It is the site of reinforcement learning for song — dopaminergic reward signals from the VTA arrive here and bias which vocal variants are retained. FoxP2 is highly expressed in Area X; knockdown impairs vocal imitation.',
    lesion: 'Juvenile lesion → song never matures beyond subsong. Adult lesion → mild degradation; motor program persists in RA.',
  },
  dlm: {
    title: 'DLM',
    sub: 'Medial dorsolateral thalamus (AFP)',
    body: 'DLM is the thalamic relay of the AFP, receiving pallidal-like inhibitory input from Area X and releasing a disinhibited signal to LMAN. This push-pull architecture mirrors the mammalian basal ganglia–thalamus–cortex loop and gates variability from the AFP into the motor pathway.',
    lesion: 'DLM lesion has effects similar to LMAN lesion — song crystallizes early and motor variability collapses.',
  },
  lman: {
    title: 'LMAN',
    sub: 'Variability injector (AFP)',
    body: 'LMAN injects stochastic variability into RA during sensorimotor practice, driving the exploration that reinforcement learning requires. In adult birds LMAN output is suppressed and RA activity becomes stereotyped. LMAN is broadly analogous to a premotor cortex that biases motor output.',
    lesion: 'Juvenile lesion → premature crystallization into a simplified, fixed song. Adult lesion → song becomes more stereotyped (less variable day-to-day).',
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function nodeById(id: NodeId): SongNode {
  return NODES.find(n => n.id === id)!
}

function nodeColor(p: Pathway, selected: boolean): { fill: string; stroke: string; text: string } {
  if (p === 'motor') return {
    fill: selected ? 'color-mix(in oklch, #4afdc6 22%, transparent)' : 'color-mix(in oklch, #4afdc6 10%, transparent)',
    stroke: '#4afdc6',
    text: '#4afdc6',
  }
  if (p === 'afp') return {
    fill: selected ? 'color-mix(in oklch, #ffb472 22%, transparent)' : 'color-mix(in oklch, #ffb472 10%, transparent)',
    stroke: '#ffb472',
    text: '#ffb472',
  }
  // 'both' (HVC)
  return {
    fill: selected ? 'color-mix(in oklch, #eef3fa 18%, transparent)' : 'color-mix(in oklch, #eef3fa 8%, transparent)',
    stroke: '#eef3fa',
    text: '#eef3fa',
  }
}

function edgeColor(p: 'motor' | 'afp'): string {
  return p === 'motor' ? '#4afdc6' : '#ffb472'
}

// Straight line from edge of ellipse to edge of ellipse
function straightEdge(from: SongNode, to: SongNode): string {
  const dx = to.x - from.x, dy = to.y - from.y
  const len = Math.sqrt(dx * dx + dy * dy)
  const nx = dx / len, ny = dy / len
  const rx = 46, ry = 22
  // Approximate ellipse edge by scaling to smaller of rx/ry
  const t = Math.min(rx / Math.abs(dx || 0.001), ry / Math.abs(dy || 0.001))
  const scale = Math.sqrt(rx * rx * nx * nx + ry * ry * ny * ny)
  const srcX = from.x + (rx * rx * nx / scale)
  const srcY = from.y + (ry * ry * ny / scale)
  const dstX = to.x - (rx * rx * nx / scale)
  const dstY = to.y - (ry * ry * ny / scale)
  void t
  return `M ${srcX},${srcY} L ${dstX},${dstY}`
}

// Cubic bezier for the LMAN → RA convergence arrow
function curvedEdge(from: SongNode, to: SongNode): string {
  // Swing out through the bottom-centre then curve up
  return `M ${from.x + 46},${from.y} C 300,490 430,360 ${to.x},${to.y + 22}`
}

// Pulse interpolation
function pulsePos(t: number): { x: number; y: number } | null {
  if (t === null || t < 0) return null
  const seg = Math.min(Math.floor(t), MOTOR_PATH.length - 2)
  const frac = t - seg
  const eased = 1 - Math.pow(1 - Math.min(frac, 1), 3)
  const a = MOTOR_PATH[seg], b = MOTOR_PATH[seg + 1]
  return { x: a.x + (b.x - a.x) * eased, y: a.y + (b.y - a.y) * eased }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SongCircuitSVG({ selected, onSelect, pulseT }: {
  selected: NodeId | null
  onSelect: (id: NodeId | null) => void
  pulseT: number | null
}) {
  const pos = pulseT !== null ? pulsePos(pulseT) : null
  const trailLen = pulseT !== null ? Math.min(Math.floor(pulseT) + 1, MOTOR_PATH.length) : 0
  const trailPts = pulseT !== null
    ? MOTOR_PATH.slice(0, trailLen).concat(pos ? [{ ...pos, id: 'hvc' as NodeId }] : [])
    : []

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      style={{ display: 'block', maxHeight: 520 }}
      aria-label="Avian song system circuit diagram"
    >
      <defs>
        <marker id="arrow-motor" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#4afdc6" opacity="0.7" />
        </marker>
        <marker id="arrow-afp" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#ffb472" opacity="0.7" />
        </marker>
      </defs>

      {/* Pathway labels */}
      <text x="130" y="36" fill="#ffb472" fontSize="10" fontFamily="IBM Plex Sans"
            letterSpacing="0.16em" textAnchor="middle" opacity="0.7">AFP LOOP</text>
      <text x="390" y="36" fill="#4afdc6" fontSize="10" fontFamily="IBM Plex Sans"
            letterSpacing="0.16em" textAnchor="middle" opacity="0.7">MOTOR PATH</text>

      {/* Edges */}
      {EDGES.map((e, i) => {
        const from = nodeById(e.from), to = nodeById(e.to)
        const d = e.curve ? curvedEdge(from, to) : straightEdge(from, to)
        const color = edgeColor(e.pathway)
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeOpacity={0.55}
            strokeDasharray={e.pathway === 'afp' ? '5 4' : undefined}
            markerEnd={e.pathway === 'motor' ? 'url(#arrow-motor)' : 'url(#arrow-afp)'}
          />
        )
      })}

      {/* Motor pulse trail */}
      {trailPts.length > 1 && (
        <polyline
          points={trailPts.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#4afdc6"
          strokeWidth={2.5}
          strokeOpacity={0.45}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px #4afdc6)' }}
        />
      )}

      {/* Nodes */}
      {NODES.map(n => {
        const isSel = selected === n.id
        const { fill, stroke, text } = nodeColor(n.pathway, isSel)
        return (
          <g
            key={n.id}
            transform={`translate(${n.x},${n.y})`}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(isSel ? null : n.id)}
            role="button"
            aria-label={n.label}
          >
            <ellipse
              rx={46} ry={22}
              fill={fill}
              stroke={stroke}
              strokeWidth={isSel ? 2 : 1.5}
              style={isSel ? { filter: `drop-shadow(0 0 10px ${stroke})` } : undefined}
            />
            <text
              y={5}
              fill={text}
              fontSize={11}
              fontFamily="IBM Plex Sans"
              fontWeight={600}
              letterSpacing="0.06em"
              textAnchor="middle"
            >
              {n.label}
            </text>
          </g>
        )
      })}

      {/* Pulse dot */}
      {pos && (
        <g>
          <circle cx={pos.x} cy={pos.y} r={10} fill="none" stroke="#4afdc6" strokeOpacity={0.35} />
          <circle
            cx={pos.x} cy={pos.y} r={5.5}
            fill="#4afdc6"
            style={{ filter: 'drop-shadow(0 0 12px #4afdc6)' }}
          />
        </g>
      )}
    </svg>
  )
}

function InfoPanel({ selected }: { selected: NodeId | null }) {
  if (!selected) {
    return (
      <div className="bird-info-panel bird-info-panel--empty">
        <p className="bird-info-hint">Click any nucleus to learn more</p>
        <div className="bird-info-legend">
          <span className="bird-info-legend-dot" style={{ background: '#eef3fa' }} />
          <span style={{ color: '#eef3fa' }}>HVC — feeds both pathways</span>
          <span className="bird-info-legend-dot" style={{ background: '#4afdc6' }} />
          <span style={{ color: '#4afdc6' }}>Motor pathway (solid)</span>
          <span className="bird-info-legend-dot" style={{ background: '#ffb472' }} />
          <span style={{ color: '#ffb472' }}>AFP loop (dashed)</span>
        </div>
      </div>
    )
  }
  const info = NODE_INFO[selected]
  return (
    <div className="bird-info-panel">
      <p className="bird-info-sub">{info.sub}</p>
      <h3 className="bird-info-title">{info.title}</h3>
      <p className="bird-info-body">{info.body}</p>
      <div className="bird-info-lesion">
        <span className="bird-info-lesion-label">Lesion</span>
        <p className="bird-info-lesion-text">{info.lesion}</p>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function BirdAnatomy() {
  const [selected, setSelected] = useState<NodeId | null>(null)
  const [playing, setPlaying] = useState(false)
  const [pulseT, setPulseT] = useState<number | null>(null)
  const stopRef = useRef(false)
  const lastWaypointRef = useRef(-1)

  function handlePlay() {
    if (playing) return
    setPlaying(true)
    stopRef.current = false
    lastWaypointRef.current = -1
    const SEG_DUR = 520 // ms per segment
    const totalDur = SEG_DUR * (MOTOR_PATH.length - 1)
    const startTime = performance.now()

    function tick(now: number) {
      if (stopRef.current) { setPulseT(null); return }
      const t = Math.min((now - startTime) / SEG_DUR, MOTOR_PATH.length - 1)
      setPulseT(t)
      const wpIdx = Math.floor(t)
      if (wpIdx > lastWaypointRef.current) {
        lastWaypointRef.current = wpIdx
        void whaleAudio.resume()
        whaleAudio.click(whaleAudio.now() + 0.01, { gain: 0.7 })
      }
      if ((now - startTime) < totalDur) {
        requestAnimationFrame(tick)
      } else {
        // final waypoint
        if (lastWaypointRef.current < MOTOR_PATH.length - 1) {
          void whaleAudio.resume()
          whaleAudio.click(whaleAudio.now() + 0.01, { gain: 0.7 })
        }
        setTimeout(() => { setPulseT(null); setPlaying(false) }, 300)
      }
    }
    requestAnimationFrame(tick)
  }

  // Clean up on unmount
  useEffect(() => () => { stopRef.current = true }, [])

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Birds · Song System
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          The Neural Circuit for Song
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Two pathways share a single premotor clock. The <span style={{ color: '#4afdc6' }}>motor path</span> drives
          the syrinx with millisecond precision; the <span style={{ color: '#ffb472' }}>AFP loop</span> shapes the
          motor path during learning and then falls quiet.
        </p>

        <div className="bird-anatomy-grid">
          <div className="bird-anatomy-svg-wrap">
            <SongCircuitSVG selected={selected} onSelect={setSelected} pulseT={pulseT} />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                className={`bird-play-btn${playing ? ' active' : ''}`}
                onClick={handlePlay}
                disabled={playing}
              >
                {playing ? 'Playing motor pulse…' : '▶  Play motor pulse'}
              </button>
            </div>
          </div>

          <InfoPanel selected={selected} />
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '~6 ms',   label: 'HVC burst duration per syllable' },
            { val: '7',       label: 'Song-system nuclei (core circuit)' },
            { val: '2',       label: 'Pathways — motor + AFP' },
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
