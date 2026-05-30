import { useState } from 'react'
import { Eyebrow } from '../components/Eyebrow'

/* ── Design-space data ──────────────────────────────────────
   Cetaceans highlighted in the brand lumen; this is the whale
   tab's bridge to the Birds and Primates tabs.                 */

interface SpeciesData {
  id: string
  label: string
  sx: number   // 0–1 syntax axis (right = richer)
  sy: number   // 0–1 semantics axis (up = richer)
  color: string
  tag: string
  headline: string
  body: string
}

const SPECIES: SpeciesData[] = [
  {
    id: 'whales',
    label: 'Cetaceans',
    sx: 0.52, sy: 0.15,
    color: '#4afdc6',
    tag: 'Combinatorial form · Uncharted meaning',
    headline: 'Structure without a decoder',
    body: 'Cetaceans are strong vocal production learners. Humpback song obeys Zipf\'s law (Arnon et al. 2025); eleven species show Menzerath\'s law (Youngblood et al. 2025); sperm-whale codas decompose into four quasi-independent features yielding ~150 types (Sharma et al. 2024). The structure is rich and quantifiable. But meaning is essentially undecoded — and because invasive recording is ethically impossible, the neural mechanism is inferred, not observed. Cetaceans sit on the syntax axis near birds, with semantics that remain a question mark.',
  },
  {
    id: 'birds',
    label: 'Songbirds',
    sx: 0.82, sy: 0.05,
    color: '#ffb472',
    tag: 'Rich syntax · No meaning',
    headline: 'Syntax without semantics',
    body: 'Oscine songbirds produce syllable sequences governed by probabilistic finite-state grammars — well beyond first-order Markov but almost certainly subregular. No syllable carries known meaning. Birdsong is the cleanest natural example of combinatorial signal structure decoupled entirely from semantic content.',
  },
  {
    id: 'primates',
    label: 'Primates',
    sx: 0.18, sy: 0.68,
    color: '#b57bee',
    tag: 'Functional reference · No compositionality',
    headline: 'Semantics without syntax',
    body: 'The mirror image of birdsong: primate calls and gestures carry functional reference and intentionality, but combinations are idiomatic rather than compositional, and fail formal productivity tests. Primates have the semantic ingredients without the syntactic machinery to make them productive.',
  },
  {
    id: 'humans',
    label: 'Humans',
    sx: 0.93, sy: 0.93,
    color: '#ff6b54',
    tag: 'Recursive syntax · Compositional meaning',
    headline: 'Syntax bound to semantics',
    body: 'Humans uniquely bind recursive hierarchical syntax to compositional semantics with unbounded vocal production learning. The direct laryngeal-motor-cortex → nucleus-ambiguus projection enables learned voluntary phonation; a massively expanded arcuate fasciculus links auditory and premotor regions. The human innovation is the coupling of the two systems, not either one alone.',
  },
]

const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  birds:    { dx: 12,  dy: 4,   anchor: 'start' },
  primates: { dx: 12,  dy: 4,   anchor: 'start' },
  whales:   { dx: -14, dy: 20,  anchor: 'end'   },
  humans:   { dx: 12,  dy: -10, anchor: 'start' },
}

const VB = '0 0 560 390'
const L = 64, R = 530, T = 28, B = 360
const PW = R - L, PH = B - T
function px(sx: number) { return L + sx * PW }
function py(sy: number) { return B - sy * PH }

function ComparePlot({ selected, onSelect }: {
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <svg viewBox={VB} width="100%" style={{ display: 'block' }} aria-label="Syntax–semantics design space">
      {[0.25, 0.5, 0.75].map(v => (
        <g key={v}>
          <line x1={px(v)} y1={T} x2={px(v)} y2={B} stroke="#b6c8df" strokeOpacity={0.1} strokeWidth={1} />
          <line x1={L} y1={py(v)} x2={R} y2={py(v)} stroke="#b6c8df" strokeOpacity={0.1} strokeWidth={1} />
        </g>
      ))}
      <line x1={L} y1={B} x2={R} y2={B} stroke="#b6c8df" strokeOpacity={0.35} strokeWidth={1.5} />
      <line x1={L} y1={T} x2={L} y2={B} stroke="#b6c8df" strokeOpacity={0.35} strokeWidth={1.5} />

      <text x={(L + R) / 2} y={B + 28} textAnchor="middle" fill="#5b82b8" fontSize={11}
            fontFamily="IBM Plex Sans" letterSpacing="0.06em">COMBINATORIAL SYNTAX →</text>
      <text x={L - 28} y={(T + B) / 2} textAnchor="middle" fill="#5b82b8" fontSize={11}
            fontFamily="IBM Plex Sans" letterSpacing="0.06em"
            transform={`rotate(-90, ${L - 28}, ${(T + B) / 2})`}>SEMANTIC REFERENCE →</text>

      <text x={L} y={B + 16} textAnchor="middle" fill="#5b82b8" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.6}>None</text>
      <text x={R} y={B + 16} textAnchor="middle" fill="#5b82b8" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.6}>Rich</text>
      <text x={L - 10} y={B} textAnchor="end" fill="#5b82b8" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.6}>None</text>
      <text x={L - 10} y={T + 4} textAnchor="end" fill="#5b82b8" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.6}>Rich</text>

      {SPECIES.map(s => {
        const cx = px(s.sx), cy = py(s.sy)
        const isSel = selected === s.id
        const off = LABEL_OFFSET[s.id]
        return (
          <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(isSel ? null : s.id)}
             role="button" aria-label={s.label}>
            {isSel && <circle cx={cx} cy={cy} r={20} fill="none" stroke={s.color} strokeWidth={1.5} strokeOpacity={0.35} />}
            <circle cx={cx} cy={cy} r={12}
              fill={`color-mix(in oklch, ${s.color} ${isSel ? 32 : 18}%, transparent)`}
              stroke={s.color}
              strokeWidth={isSel ? 2 : 1.5}
              style={isSel ? { filter: `drop-shadow(0 0 8px ${s.color})` } : undefined}
            />
            <text x={cx + off.dx} y={cy + off.dy} fill={s.color} fontSize={12}
                  fontFamily="IBM Plex Sans" fontWeight={600} textAnchor={off.anchor}
                  opacity={isSel ? 1 : 0.8}>
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── Convergence cladogram (schematic) ──────────────────────── */
const LEARNERS = [
  { id: 'songbirds',   label: 'Songbirds',   clade: 'aves',     star: true },
  { id: 'parrots',     label: 'Parrots',     clade: 'aves',     star: true },
  { id: 'hummingbirds',label: 'Hummingbirds',clade: 'aves',     star: true },
  { id: 'bats',        label: 'Bats',        clade: 'mammalia', star: true },
  { id: 'cetaceans',   label: 'Cetaceans',   clade: 'mammalia', star: true },
  { id: 'pinnipeds',   label: 'Pinnipeds',   clade: 'mammalia', star: true },
  { id: 'elephants',   label: 'Elephants',   clade: 'mammalia', star: true },
  { id: 'humans',      label: 'Humans',      clade: 'mammalia', star: true },
]

function Cladogram() {
  const rowH = 26
  const topPad = 44
  const H = topPad + LEARNERS.length * rowH + 20
  const W = 360
  const tipX = 200
  const avesNode = { x: 96, y: topPad + 1.5 * rowH }
  const mamNode  = { x: 96, y: topPad + 5.5 * rowH }
  const root     = { x: 40, y: (avesNode.y + mamNode.y) / 2 }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} aria-label="Independent origins of vocal learning">
      <text x={20} y={20} fill="#5b82b8" fontSize={10} fontFamily="IBM Plex Mono" letterSpacing="0.08em">
        ★ = vocal learning evolved independently
      </text>

      {/* root → clade nodes */}
      <path d={`M ${root.x},${root.y} L ${root.x},${avesNode.y} L ${avesNode.x},${avesNode.y}`}
            fill="none" stroke="#5b82b8" strokeWidth={1.2} strokeOpacity={0.6} />
      <path d={`M ${root.x},${root.y} L ${root.x},${mamNode.y} L ${mamNode.x},${mamNode.y}`}
            fill="none" stroke="#5b82b8" strokeWidth={1.2} strokeOpacity={0.6} />

      {/* root label */}
      <circle cx={root.x} cy={root.y} r={3} fill="#5b82b8" />
      <text x={root.x - 6} y={root.y - 8} textAnchor="end" fill="#5b82b8" fontSize={9}
            fontFamily="IBM Plex Mono" opacity={0.7}>amniote ancestor</text>
      <text x={root.x - 6} y={root.y + 4} textAnchor="end" fill="#5b82b8" fontSize={9}
            fontFamily="IBM Plex Mono" opacity={0.5}>(not a learner)</text>

      {LEARNERS.map((sp, i) => {
        const y = topPad + i * rowH + rowH / 2
        const node = sp.clade === 'aves' ? avesNode : mamNode
        const isCet = sp.id === 'cetaceans'
        const col = isCet ? '#4afdc6' : '#b6c8df'
        return (
          <g key={sp.id}>
            <path d={`M ${node.x},${node.y} L ${node.x},${y} L ${tipX},${y}`}
                  fill="none" stroke={isCet ? '#4afdc6' : '#5b82b8'}
                  strokeWidth={isCet ? 1.6 : 1} strokeOpacity={isCet ? 0.8 : 0.45} />
            {sp.star && (
              <text x={tipX + 6} y={y + 4} fill={isCet ? '#4afdc6' : '#ffb472'} fontSize={12}>★</text>
            )}
            <text x={tipX + 22} y={y + 4} fill={col} fontSize={12}
                  fontFamily="IBM Plex Sans" fontWeight={isCet ? 600 : 400}>
              {sp.label}
            </text>
          </g>
        )
      })}

      {/* clade node dots + labels */}
      <circle cx={avesNode.x} cy={avesNode.y} r={3} fill="#5b82b8" />
      <text x={avesNode.x} y={avesNode.y - 8} textAnchor="middle" fill="#5b82b8" fontSize={9}
            fontFamily="IBM Plex Mono" opacity={0.7}>Aves</text>
      <circle cx={mamNode.x} cy={mamNode.y} r={3} fill="#5b82b8" />
      <text x={mamNode.x} y={mamNode.y + 14} textAnchor="middle" fill="#5b82b8" fontSize={9}
            fontFamily="IBM Plex Mono" opacity={0.7}>Mammalia</text>
    </svg>
  )
}

export function ActDesignSpace() {
  const [selected, setSelected] = useState<string | null>('whales')
  const sel = selected ? SPECIES.find(s => s.id === selected) : null

  return (
    <section id="designspace" className="act" data-screen-label="09 Design space">
      <div className="col-wide">
        <Eyebrow num={8}>Where cetaceans sit · the comparative picture</Eyebrow>
        <h2>Four solutions, <span className="hl">one design space</span>.</h2>
        <p className="lede" style={{ maxWidth: '56ch' }}>
          Plot animal communication on two axes — combinatorial syntax and semantic reference — and
          the major vocal-learning lineages fall in different corners. Cetaceans cluster near birds
          on structure, with meaning still uncharted. Click a point to compare. The Birds and Primates
          tabs explore two of these corners in depth.
        </p>

        <div className="split-2" style={{ marginTop: 32, gap: 44, alignItems: 'start' }}>
          {/* LEFT — scatter */}
          <div className="panel panel--lumen" style={{ padding: '20px 24px 12px' }}>
            <span className="corner mono">FIG. 06 · syntax × semantics</span>
            <ComparePlot selected={selected} onSelect={setSelected} />
          </div>

          {/* RIGHT — detail */}
          <div>
            {sel ? (
              <>
                <div className="chip" style={{ color: sel.color, borderColor: `color-mix(in oklch, ${sel.color} 45%, transparent)` }}>
                  <span className="dot" style={{ background: sel.color }} />
                  {sel.tag}
                </div>
                <h3 style={{ fontSize: 24, margin: '16px 0 12px', color: sel.color }}>{sel.headline}</h3>
                <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65 }}>{sel.body}</p>
              </>
            ) : (
              <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65 }}>
                Click any point to read its profile. Cetaceans, birds, primates, and humans each
                occupy a distinct region of the space.
              </p>
            )}
          </div>
        </div>

        {/* Convergence vs homology */}
        <div className="split-12-1" style={{ marginTop: 72, gap: 44, alignItems: 'start' }}>
          <div>
            <h3 style={{ fontSize: 24, marginTop: 0 }}>Convergence, not homology</h3>
            <p>
              The deep lesson of the design space is that these capacities are <em>convergent</em>.
              Vocal production learning did not descend from one ancestral innovation — it evolved
              independently in songbirds, parrots, hummingbirds, bats, cetaceans, pinnipeds, elephants,
              and the human lineage. The common ancestor of birds and mammals, some 318 million years
              ago, was not a vocal learner.
            </p>
            <p>
              That makes every comparison a natural experiment in convergent evolution. When cetacean
              codas obey the same statistical laws as human language and birdsong, it is not a shared
              inheritance — it is independent discovery of the same structural solution, hinting that
              the constraints on any learned communication system may be universal.
            </p>
          </div>

          <div className="panel panel--lumen" style={{ padding: '16px 20px' }}>
            <span className="corner mono">independent origins</span>
            <Cladogram />
          </div>
        </div>

        <div className="panel" style={{ marginTop: 56, padding: '28px 32px', borderLeft: '3px solid var(--lumen)' }}>
          <h3 style={{ marginTop: 0, fontSize: 20 }}>The bar no nonhuman has cleared</h3>
          <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65, maxWidth: '64ch' }}>
            Combinatorial capacity is not language, and apparent meaning may be arousal-plus-inference
            rather than encoded semantics. Demonstrating both compositionality <em>and</em> productive
            syntax in the same signal system is the threshold that defines the upper-right corner — and
            so far only one lineage occupies it. Whether cetaceans belong elsewhere on the map is, for
            now, the open question this whole field is built around.
          </p>
        </div>

        <p className="small" style={{ marginTop: 32, color: 'var(--shoal)' }}>
          Positions are illustrative and qualitative. Cladogram is schematic; divergence date after
          standard amniote estimates.
        </p>
      </div>
    </section>
  )
}
