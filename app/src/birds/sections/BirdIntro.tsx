import { useState } from 'react'

// ── Data ────────────────────────────────────────────────────────────────────

interface SpeciesData {
  id: string
  label: string
  sx: number  // 0–1 on syntax axis (right = richer)
  sy: number  // 0–1 on semantics axis (up = richer)
  color: string
  tag: string
  headline: string
  body: string
}

const SPECIES: SpeciesData[] = [
  {
    id: 'birds',
    label: 'Songbirds',
    sx: 0.82, sy: 0.05,
    color: '#ffb472',
    tag: 'Rich syntax · No meaning',
    headline: 'Syntax without semantics',
    body: 'Oscine songbirds produce syllable sequences governed by probabilistic finite-state grammars — well beyond first-order Markov but almost certainly subregular. HVC provides a synfire-chain clock; the anterior forebrain pathway (Area X → DLM → LMAN) implements a reinforcement-learning loop during juvenile learning. No syllable carries known meaning. Domestication (Bengalese finch vs. wild white-rumped munia) reveals that relaxed selection for species-recognition generates syntactic complexity without adding semantics.',
  },
  {
    id: 'primates',
    label: 'Primates',
    sx: 0.18, sy: 0.68,
    color: '#4afdc6',
    tag: 'Functional reference · No compositionality',
    headline: 'Semantics without syntax',
    body: 'Monkey alarm calls are functionally referential — predator-class-specific and eliciting adaptive responses — but best modeled as arousal gradients plus receiver pragmatic inference, not encoded semantics. The flagship "putty-nosed pyow-hack" sequence is idiomatic, not compositional (Arnold & Zuberbühler 2011). Great-ape gesture provides intentionality and an ~80-item lexicon. In language-training, apes acquire lexical reference but Yang\'s Zipfian productivity test shows their combinations are memorized phrases, not grammar.',
  },
  {
    id: 'whales',
    label: 'Cetaceans',
    sx: 0.52, sy: 0.15,
    color: '#7da6ff',
    tag: 'Combinatorial form · Uncharted meaning',
    headline: 'Structure without a decoder',
    body: 'Cetaceans are strong vocal production learners like songbirds: humpback song revolutions propagate across ocean basins; dolphins maintain individually learned signature whistles; orca clans share matrilineal dialects. Sperm-whale codas decompose into four quasi-independent features (rhythm, tempo, rubato, ornamentation) producing ~156 distinct types. Humpback song obeys Zipf\'s law (Arnon et al. 2025, Science). Eleven cetacean species show Menzerath\'s law (Youngblood 2025, Science Advances). But meaning is essentially undecoded — and invasive recording is ethically impossible, so the neural mechanism is inferred but unobserved.',
  },
  {
    id: 'humans',
    label: 'Humans',
    sx: 0.93, sy: 0.93,
    color: '#ff6b54',
    tag: 'Recursive syntax · Compositional meaning',
    headline: 'Syntax bound to semantics',
    body: 'Humans uniquely bind recursive hierarchical syntax to compositional semantics with unbounded vocal production learning. The direct laryngeal motor cortex → nucleus ambiguus projection — absent in most primates — enables learned voluntary phonation. The massively expanded arcuate fasciculus links auditory and premotor regions. FOXP2 was once called the "language gene," but Atkinson et al. (2018, Cell) showed the selective-sweep signal was an artifact; it is a conserved striatal motor-learning gene with lineage-specific regulation in vocal learners.',
  },
]

const TABLE_ROWS = [
  { dim: 'Vocal production learning',
    vals: ['Yes — oscines', 'No (mostly)', 'Yes — cetaceans', 'Yes'] },
  { dim: 'Combinatorial syntax',
    vals: ['Rich, rule-governed', 'Weak, idiomatic', 'Moderate, undecoded', 'Recursive'] },
  { dim: 'Semantic reference',
    vals: ['None', 'Functional (contested)', 'None decoded', 'Rich, compositional'] },
  { dim: 'Cultural transmission',
    vals: ['Yes — dialects', 'Limited', 'Yes — vocal clans', 'Yes'] },
  { dim: 'Neural circuit',
    vals: ['Named, dissectable', 'Accessible — primate brain', 'Unknown', 'Partially known'] },
  { dim: 'Formal class',
    vals: ['Subregular–Regular', '≤ Regular', 'Unknown', 'Context-free+'] },
]

const SPECIES_ORDER = ['birds', 'primates', 'whales', 'humans']

// ── Plot geometry ────────────────────────────────────────────────────────────

const VB = '0 0 560 390'
const L = 64, R = 530, T = 28, B = 360   // plot boundary
const PW = R - L, PH = B - T

function px(sx: number) { return L + sx * PW }
function py(sy: number) { return B - sy * PH }

// Label offsets: hand-tuned to avoid overlap
const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  birds:    { dx: 12,  dy: 4,   anchor: 'start' },
  primates: { dx: 12,  dy: 4,   anchor: 'start' },
  whales:   { dx: -12, dy: 18,  anchor: 'end'   },
  humans:   { dx: 12,  dy: -10, anchor: 'start' },
}

// ── Scatter plot ─────────────────────────────────────────────────────────────

function ComparePlot({ selected, onSelect }: {
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <svg viewBox={VB} width="100%" style={{ display: 'block' }} aria-label="Syntax–semantics design space">
      {/* Grid */}
      {[0.25, 0.5, 0.75].map(v => (
        <g key={v}>
          <line x1={px(v)} y1={T} x2={px(v)} y2={B} stroke="#b6c8df" strokeOpacity={0.12} strokeWidth={1} />
          <line x1={L} y1={py(v)} x2={R} y2={py(v)} stroke="#b6c8df" strokeOpacity={0.12} strokeWidth={1} />
        </g>
      ))}

      {/* Axes */}
      <line x1={L} y1={B} x2={R} y2={B} stroke="#b6c8df" strokeOpacity={0.35} strokeWidth={1.5} />
      <line x1={L} y1={T} x2={L} y2={B} stroke="#b6c8df" strokeOpacity={0.35} strokeWidth={1.5} />

      {/* Axis labels */}
      <text x={(L + R) / 2} y={B + 28} textAnchor="middle" fill="#b6c8df" fontSize={11}
            fontFamily="IBM Plex Sans" opacity={0.65} letterSpacing="0.06em">
        COMBINATORIAL SYNTAX →
      </text>
      <text x={L - 28} y={(T + B) / 2} textAnchor="middle" fill="#b6c8df" fontSize={11}
            fontFamily="IBM Plex Sans" opacity={0.65} letterSpacing="0.06em"
            transform={`rotate(-90, ${L - 28}, ${(T + B) / 2})`}>
        SEMANTIC REFERENCE →
      </text>

      {/* Axis tick labels */}
      <text x={L} y={B + 16} textAnchor="middle" fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>None</text>
      <text x={R} y={B + 16} textAnchor="middle" fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>Rich</text>
      <text x={L - 10} y={B} textAnchor="end" fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>None</text>
      <text x={L - 10} y={T + 4} textAnchor="end" fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>Rich</text>

      {/* Species points */}
      {SPECIES.map(s => {
        const cx = px(s.sx), cy = py(s.sy)
        const isSel = selected === s.id
        const off = LABEL_OFFSET[s.id]
        return (
          <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(isSel ? null : s.id)}
             role="button" aria-label={s.label}>
            {/* Glow ring when selected */}
            {isSel && <circle cx={cx} cy={cy} r={20} fill="none" stroke={s.color} strokeWidth={1.5} strokeOpacity={0.35} />}
            <circle cx={cx} cy={cy} r={12}
              fill={`color-mix(in oklch, ${s.color} ${isSel ? 30 : 16}%, transparent)`}
              stroke={s.color}
              strokeWidth={isSel ? 2 : 1.5}
              style={isSel ? { filter: `drop-shadow(0 0 8px ${s.color})` } : undefined}
            />
            <text x={cx + off.dx} y={cy + off.dy} fill={s.color} fontSize={12}
                  fontFamily="IBM Plex Sans" fontWeight={600} textAnchor={off.anchor}
                  opacity={isSel ? 1 : 0.75}>
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

export function BirdIntro() {
  const [selected, setSelected] = useState<string | null>(null)

  const sel = selected ? SPECIES.find(s => s.id === selected) : null

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Birds · Introduction
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Three Natural Experiments
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Songbirds, primates, and cetaceans each solve communication differently —
          sitting at three corners of a space defined by combinatorial syntax and semantic reference.
          Click a species to explore its profile.
        </p>

        {/* Plot + panel */}
        <div className="bird-intro-grid">
          <div className="bird-intro-plot-wrap">
            <ComparePlot selected={selected} onSelect={setSelected} />
          </div>

          <aside className="bird-syntax-panel">
            {sel ? (
              <>
                <span className="bird-syntax-badge" style={{ color: sel.color, borderColor: `color-mix(in oklch, ${sel.color} 40%, transparent)`, background: `color-mix(in oklch, ${sel.color} 8%, transparent)` }}>
                  {sel.tag}
                </span>
                <h3 className="bird-info-title" style={{ color: sel.color, marginTop: 14 }}>
                  {sel.headline}
                </h3>
                <p className="bird-info-body">{sel.body}</p>
              </>
            ) : (
              <>
                <p className="bird-info-sub" style={{ marginBottom: 10 }}>Design space</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
                  Each species represents a natural experiment: what happens when evolution produces
                  combinatorial signal structure <em>without</em> meaning (birdsong), meaning signals
                  <em> without</em> productive combinatorics (primate calls), or rich structure with
                  uncharted meaning (cetacean codas)?
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-quiet)', lineHeight: 1.6, marginTop: 14, fontStyle: 'italic' }}>
                  Click a point to read its profile.
                </p>
              </>
            )}
          </aside>
        </div>

        {/* Comparison table */}
        <div style={{ marginTop: 56, overflowX: 'auto' }}>
          <table className="bird-intro-table">
            <thead>
              <tr>
                <th></th>
                {SPECIES_ORDER.map(id => {
                  const s = SPECIES.find(sp => sp.id === id)!
                  return (
                    <th key={id} style={{ color: s.color }}>
                      {s.label}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(row => (
                <tr key={row.dim}>
                  <td className="bird-intro-table-dim">{row.dim}</td>
                  {SPECIES_ORDER.map((_, i) => (
                    <td key={i}>{row.vals[i]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deflationary callout */}
        <div className="bird-intro-callout">
          <p className="bird-intro-callout-label">Central lesson</p>
          <p>
            Combinatorial capacity is not language, and apparent meaning may be arousal-plus-inference
            rather than encoded semantics. Demonstrating both compositionality <em>and</em> productive
            syntax — in the same signal system — is the bar no nonhuman species has cleared.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '3', label: 'Corners of the design space — without humans filling all three' },
            { val: '~90 Mya', label: 'Mammal–mammal split: no vocal-learning ancestor shared by primates and cetaceans' },
            { val: '~318 Mya', label: 'Amniote split: no vocal-learning ancestor shared by mammals and birds' },
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
