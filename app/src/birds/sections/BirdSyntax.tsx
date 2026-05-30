import { useState, useCallback, useEffect } from 'react'
import { whaleAudio } from '../../lib/audio'

// ── Grammar types ─────────────────────────────────────────────────────────────

interface GNode { id: string; label: string; x: number; y: number; isStart: boolean; isEnd: boolean }
interface GEdge { id: string; from: string; to: string; prob: number }

// ── Initial grammar (Bengalese finch–inspired, 5 syllable types) ──────────────

const INIT_NODES: GNode[] = [
  { id: 'a', label: 'A', x: 100, y: 200, isStart: true,  isEnd: false },
  { id: 'b', label: 'B', x: 260, y: 90,  isStart: false, isEnd: false },
  { id: 'c', label: 'C', x: 260, y: 310, isStart: false, isEnd: false },
  { id: 'd', label: 'D', x: 420, y: 200, isStart: false, isEnd: false },
  { id: 'e', label: 'E', x: 555, y: 200, isStart: false, isEnd: true  },
]

const INIT_EDGES: GEdge[] = [
  { id: 'ab', from: 'a', to: 'b', prob: 0.60 },
  { id: 'ac', from: 'a', to: 'c', prob: 0.40 },
  { id: 'bb', from: 'b', to: 'b', prob: 0.30 },
  { id: 'bd', from: 'b', to: 'd', prob: 0.70 },
  { id: 'cd', from: 'c', to: 'd', prob: 1.00 },
  { id: 'da', from: 'd', to: 'a', prob: 0.40 },
  { id: 'de', from: 'd', to: 'e', prob: 0.60 },
]

// ── Visual constants ──────────────────────────────────────────────────────────

const R = 24          // node radius
const VB = '0 0 660 410'

const NODE_COLOR: Record<string, string> = {
  a: '#4afdc6', b: '#ffb472', c: '#7da6ff', d: '#c6ffe6', e: '#ff6b54',
}

const SYLLABLE_FREQ: Record<string, number> = {
  a: 340, b: 500, c: 640, d: 430, e: 780,
}

// ── Geometry helpers ──────────────────────────────────────────────────────────

function nodeById(nodes: GNode[], id: string): GNode {
  return nodes.find(n => n.id === id)!
}

function straight(from: GNode, to: GNode): { d: string; lx: number; ly: number } {
  const dx = to.x - from.x, dy = to.y - from.y
  const len = Math.sqrt(dx * dx + dy * dy)
  const nx = dx / len, ny = dy / len
  const x1 = from.x + (R + 2) * nx
  const y1 = from.y + (R + 2) * ny
  const x2 = to.x - (R + 9) * nx
  const y2 = to.y - (R + 9) * ny
  return {
    d: `M ${x1},${y1} L ${x2},${y2}`,
    lx: (x1 + x2) / 2 + ny * -14,
    ly: (y1 + y2) / 2 + nx * -14,
  }
}

function selfLoop(node: GNode): { d: string; lx: number; ly: number } {
  const { x, y } = node
  return {
    d: `M ${x - 16},${y - 20} A 24,24 0 1,1 ${x + 16},${y - 20}`,
    lx: x,
    ly: y - 58,
  }
}

function backCurve(from: GNode, to: GNode): { d: string; lx: number; ly: number } {
  const mx = (from.x + to.x) / 2
  return {
    d: `M ${from.x - (R + 2)},${from.y + 8} C ${mx},${from.y + 130} ${mx},${to.y + 130} ${to.x + (R + 9)},${to.y + 8}`,
    lx: mx,
    ly: from.y + 120,
  }
}

function isBack(from: GNode, to: GNode): boolean {
  return from.x > to.x + 50
}

// ── Random walk ───────────────────────────────────────────────────────────────

function generateSequence(nodes: GNode[], edges: GEdge[], maxLen = 18): string[] {
  const start = nodes.find(n => n.isStart)!
  let cur = start
  const seq: string[] = [cur.label]
  let iters = 0
  while (!cur.isEnd && seq.length < maxLen && iters++ < 60) {
    const out = edges.filter(e => e.from === cur.id)
    if (out.length === 0) break
    const r = Math.random()
    let cum = 0
    let next = cur
    for (const e of out) {
      cum += e.prob
      if (r < cum) { next = nodeById(nodes, e.to); break }
    }
    cur = next
    seq.push(cur.label)
    if (seq.length >= maxLen) break
  }
  return seq
}

// ── Probability editor ────────────────────────────────────────────────────────

function ProbEditor({ nodeId, edges, setEdges }: {
  nodeId: string
  edges: GEdge[]
  setEdges: React.Dispatch<React.SetStateAction<GEdge[]>>
}) {
  const outgoing = edges.filter(e => e.from === nodeId)
  if (outgoing.length === 0) {
    return <p style={{ color: 'var(--fg-quiet)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>End state — no outgoing transitions.</p>
  }

  function adjust(edgeId: string, newVal: number) {
    setEdges(prev => {
      const others = prev.filter(e => e.from === nodeId && e.id !== edgeId)
      const oldOther = others.reduce((s, e) => s + e.prob, 0)
      const remaining = Math.max(0, 1 - newVal)
      return prev.map(e => {
        if (e.id === edgeId) return { ...e, prob: newVal }
        if (e.from === nodeId) {
          const scaled = oldOther > 0.0001
            ? (e.prob / oldOther) * remaining
            : remaining / Math.max(others.length, 1)
          return { ...e, prob: Math.max(0, scaled) }
        }
        return e
      })
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {outgoing.map(e => (
        <div key={e.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-muted)' }}>
            <span>→ {e.to === e.from ? `${e.to.toUpperCase()} (self)` : e.to.toUpperCase()}</span>
            <span style={{ color: 'var(--foam)', fontVariantNumeric: 'tabular-nums' }}>{e.prob.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={e.prob}
            onChange={ev => adjust(e.id, Number(ev.target.value))}
            style={{ width: '100%', accentColor: NODE_COLOR[nodeId] }}
          />
        </div>
      ))}
    </div>
  )
}

// ── Sequence display ──────────────────────────────────────────────────────────

function SeqDisplay({ seq }: { seq: string[] }) {
  if (seq.length === 0) return (
    <p style={{ color: 'var(--fg-quiet)', fontFamily: 'var(--font-sans)', fontSize: 12, fontStyle: 'italic' }}>
      Press Generate to produce a sequence.
    </p>
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      {seq.map((s, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-block',
            width: 28, height: 28,
            borderRadius: '50%',
            background: `color-mix(in oklch, ${NODE_COLOR[s.toLowerCase()]} 20%, transparent)`,
            border: `1px solid ${NODE_COLOR[s.toLowerCase()]}`,
            color: NODE_COLOR[s.toLowerCase()],
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: '28px',
            textAlign: 'center',
          }}>{s}</span>
          {i < seq.length - 1 && (
            <span style={{ color: 'var(--fg-quiet)', fontSize: 10 }}>›</span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── Main SVG ──────────────────────────────────────────────────────────────────

function FSASVG({ nodes, edges, selected, onSelect, cfMode }: {
  nodes: GNode[]
  edges: GEdge[]
  selected: string | null
  onSelect: (id: string | null) => void
  cfMode: boolean
}) {
  return (
    <svg viewBox={VB} width="100%" style={{ display: 'block', maxHeight: 380 }} aria-label="Finite-state automaton">
      <defs>
        <marker id="arr-fsa" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#b6c8df" opacity="0.7" />
        </marker>
        <marker id="arr-cf" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#ff6b54" opacity="0.8" />
        </marker>
      </defs>

      {/* Start arrow */}
      <line x1="40" y1="200" x2={nodes[0].x - R - 8} y2="200" stroke="#b6c8df" strokeOpacity="0.4" strokeWidth="1.5" markerEnd="url(#arr-fsa)" />
      <text x="26" y="195" fill="#b6c8df" fontSize="9" fontFamily="IBM Plex Sans" opacity="0.5" textAnchor="middle">START</text>

      {/* Regular edges */}
      {edges.map(e => {
        const from = nodeById(nodes, e.from)
        const to   = nodeById(nodes, e.to)
        const isSelf = e.from === e.to
        const isBackEdge = !isSelf && isBack(from, to)
        const geo = isSelf ? selfLoop(from) : isBackEdge ? backCurve(from, to) : straight(from, to)
        return (
          <g key={e.id}>
            <path
              d={geo.d}
              fill="none"
              stroke="#b6c8df"
              strokeWidth={1.5}
              strokeOpacity={0.55}
              markerEnd="url(#arr-fsa)"
            />
            <text x={geo.lx} y={geo.ly} fill="#b6c8df" fontSize="11" fontFamily="IBM Plex Mono"
                  textAnchor="middle" opacity="0.85">
              {e.prob.toFixed(2)}
            </text>
          </g>
        )
      })}

      {/* Context-free crossing edge overlay */}
      {cfMode && (() => {
        const b = nodeById(nodes, 'b'), c = nodeById(nodes, 'c')
        const mx = b.x - 60
        return (
          <g>
            <path
              d={`M ${b.x - R - 2},${b.y + 8} C ${mx},${b.y + 70} ${mx},${c.y - 70} ${c.x - R - 2},${c.y - 8}`}
              fill="none"
              stroke="#ff6b54"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              strokeOpacity={0.75}
              markerEnd="url(#arr-cf)"
            />
            <text x={mx - 14} y={(b.y + c.y) / 2} fill="#ff6b54" fontSize="9" fontFamily="IBM Plex Sans"
                  textAnchor="middle" opacity="0.85">center</text>
            <text x={mx - 14} y={(b.y + c.y) / 2 + 11} fill="#ff6b54" fontSize="9" fontFamily="IBM Plex Sans"
                  textAnchor="middle" opacity="0.85">embed</text>
          </g>
        )
      })()}

      {/* Nodes */}
      {nodes.map(n => {
        const col = NODE_COLOR[n.id]
        const isSel = selected === n.id
        return (
          <g key={n.id} transform={`translate(${n.x},${n.y})`} style={{ cursor: 'pointer' }}
             onClick={() => onSelect(isSel ? null : n.id)} role="button" aria-label={`Syllable ${n.label}`}>
            {/* End state double ring */}
            {n.isEnd && <circle r={R + 5} fill="none" stroke={col} strokeWidth={1} strokeOpacity={0.4} />}
            <circle r={R}
              fill={isSel ? `color-mix(in oklch, ${col} 28%, transparent)` : `color-mix(in oklch, ${col} 12%, transparent)`}
              stroke={col}
              strokeWidth={isSel ? 2 : 1.5}
              style={isSel ? { filter: `drop-shadow(0 0 8px ${col})` } : undefined}
            />
            <text y={5} fill={col} fontSize={13} fontFamily="IBM Plex Sans" fontWeight={700}
                  textAnchor="middle" letterSpacing="0.04em">{n.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function BirdSyntax() {
  const [nodes]    = useState<GNode[]>(INIT_NODES)
  const [edges, setEdges] = useState<GEdge[]>(INIT_EDGES)
  const [selected, setSelected] = useState<string | null>(null)
  const [sequence, setSequence] = useState<string[]>([])
  const [playing,  setPlaying]  = useState(false)
  const [cfMode,   setCfMode]   = useState(false)

  // Normalise probabilities after edit (floating-point drift)
  const normalised = edges.map(e => {
    const sumOut = edges.filter(x => x.from === e.from).reduce((s, x) => s + x.prob, 0)
    return { ...e, prob: sumOut > 0 ? e.prob / sumOut : e.prob }
  })

  function handleGenerate() {
    setSequence(generateSequence(nodes, normalised))
  }

  const handlePlay = useCallback(async () => {
    if (playing || sequence.length === 0) return
    setPlaying(true)
    await whaleAudio.resume()
    const STEP = 0.20 // s per syllable
    const startAt = whaleAudio.now() + 0.08
    sequence.forEach((s, i) => {
      const f = SYLLABLE_FREQ[s.toLowerCase()] ?? 400
      whaleAudio.moan(startAt + i * STEP, {
        f0: f, f1: f * 1.04, dur: 0.13, vibrato: 0, harmonics: [1, 0.3, 0.08],
      })
    })
    setTimeout(() => setPlaying(false), (sequence.length * STEP + 0.3) * 1000)
  }, [playing, sequence])

  useEffect(() => () => { /* no RAF cleanup needed */ }, [])

  const selectedNode = selected ? nodes.find(n => n.id === selected) : null

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Birds · Syntax
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Finite-State Song Grammar
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          A Bengalese finch produces syllable sequences by random-walking this automaton. Each state is a syllable type;
          each edge carries a transition probability. Click a node to edit its outgoing probabilities.
        </p>

        <div className="bird-syntax-grid">
          <div>
            <FSASVG nodes={nodes} edges={normalised} selected={selected} onSelect={setSelected} cfMode={cfMode} />

            {/* Sequence area */}
            <div className="bird-syntax-seq-wrap">
              <div style={{ flex: 1 }}><SeqDisplay seq={sequence} /></div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="bird-play-btn" onClick={handleGenerate}>Generate</button>
                <button
                  className={`bird-play-btn${playing ? ' active' : ''}`}
                  onClick={handlePlay}
                  disabled={playing || sequence.length === 0}
                >
                  {playing ? 'Playing…' : '▶ Play'}
                </button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <aside className="bird-syntax-panel">
            {/* Chomsky badge */}
            <div className="bird-syntax-badge-row">
              <span className={`bird-syntax-badge${cfMode ? ' cf' : ''}`}>
                {cfMode ? 'Context-Free (PDA)' : 'Regular (FSA)'}
              </span>
            </div>

            {/* CF toggle */}
            <label className="bird-syntax-toggle">
              <input type="checkbox" checked={cfMode} onChange={e => setCfMode(e.target.checked)} />
              <span>Add crossing dependency</span>
            </label>
            {cfMode && (
              <p className="bird-syntax-cf-note">
                The dashed arc adds a dependency where the count of one syllable
                type must match another — a constraint no finite-state automaton can enforce.
                The grammar now requires a pushdown automaton (stack memory).
              </p>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '20px 0' }} />

            {/* Node editor */}
            {selectedNode ? (
              <div>
                <p className="bird-info-sub">Editing transitions from</p>
                <h3 className="bird-info-title" style={{ color: NODE_COLOR[selectedNode.id] }}>
                  Syllable {selectedNode.label}
                  {selectedNode.isStart ? ' · start' : ''}
                  {selectedNode.isEnd ? ' · end' : ''}
                </h3>
                <ProbEditor nodeId={selected!} edges={edges} setEdges={setEdges} />
              </div>
            ) : (
              <p style={{ color: 'var(--fg-quiet)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>
                Click a node to adjust its outgoing transition probabilities.
              </p>
            )}
          </aside>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '5',   label: 'Syllable types in this grammar' },
            { val: '7',   label: 'Transition edges' },
            { val: 'O(1)', label: 'Memory required — no stack' },
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
