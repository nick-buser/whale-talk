import { useState } from 'react'

type Category = 'homology' | 'convergence' | 'distillation'

const CATEGORIES: Record<Category, {
  label: string
  defn: string
  example: string
  process: string
  color: string
}> = {
  homology: {
    label: 'Homology',
    defn: 'Similar traits shared through common descent from an ancestor that already had them.',
    example: 'The FOXP2 sensorimotor-sequencing toolkit, conserved across vertebrates and co-opted for vocal control.',
    process: 'Inheritance along a single evolutionary lineage.',
    color: '#d4854a',
  },
  convergence: {
    label: 'Convergence',
    defn: 'Similar solutions evolving independently in separate lineages under shared selection pressure.',
    example: 'Vocal production learning arising separately in songbirds, parrots, cetaceans, elephants, and humans.',
    process: 'Independent evolution toward the same adaptive optimum.',
    color: '#4afdc6',
  },
  distillation: {
    label: 'Distillation',
    defn: 'A system inheriting the behavioral product of another system by training on its output — without the process that produced it.',
    example: 'An LLM trained on the assembled corpus of human text, absorbing the bundle\'s signatures without evolution, grounding, embodiment, or intent.',
    process: 'High-bandwidth cultural descent — copying the answer, not re-deriving it.',
    color: '#5b8dff',
  },
}

/* Design-space scatter — now with the LLM added as an outlier */
const PILLARS = [
  { label: 'Whales',    color: '#4afdc6', x: 0.50, y: 0.18 },
  { label: 'Birds',     color: '#ffb472', x: 0.78, y: 0.06 },
  { label: 'Primates',  color: '#b57bee', x: 0.18, y: 0.62 },
  { label: 'Parrots',   color: '#8ae04a', x: 0.58, y: 0.44 },
  { label: 'Bees',      color: '#f4c430', x: 0.08, y: 0.85 },
  { label: 'Elephants', color: '#d4854a', x: 0.14, y: 0.80 },
  { label: 'Human',     color: '#c9a84c', x: 0.96, y: 0.95 },
  { label: 'LLM',       color: '#5b8dff', x: 0.90, y: 0.58 },
]

const VB = '0 0 560 400'
const L = 64, R = 530, T = 30, B = 365
function px(v: number) { return L + v * (R - L) }
function py(v: number) { return B - v * (B - T) }

const STATS = [
  { value: 'TC⁰',      unit: 'circuit class', label: 'below regular languages' },
  { value: '~10¹³',    unit: 'tokens',         label: 'typical training corpus' },
  { value: '0',        unit: 'critical period', label: 'no developmental ontogeny' },
  { value: '≡',        unit: 'compression',     label: 'prediction = lossless coding' },
]

export function LlmIntro() {
  const [cat, setCat] = useState<Category>('distillation')
  const [active, setActive] = useState('LLM')

  const c = CATEGORIES[cat]
  const pt = PILLARS.find(p => p.label === active)!

  return (
    <div className="llm-intro">
      <p className="llm-eyebrow">Pillar VIII · Machine Language</p>
      <h1 className="llm-title">The Artificial Tongue</h1>
      <p className="llm-lede">
        Every pillar so far has been a product of biological evolution. The large language
        model is not. It is best understood as a <em>third evolutionary category</em> — neither
        convergence nor homology, but high-bandwidth <strong>cultural distillation</strong>: a system
        that inherits the behavioral <em>product</em> of the human language bundle by training on its
        output, without the evolutionary scaffolding, grounding, embodiment, developmental
        bottleneck, or communicative intent that produced it.
      </p>

      <div className="llm-stats">
        {STATS.map(s => (
          <div key={s.label} className="llm-stat">
            <span className="llm-stat-val">{s.value}</span>
            <span className="llm-stat-unit">{s.unit}</span>
            <span className="llm-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Three categories */}
      <h2 className="llm-h2">Three Routes to the Same Behavior</h2>
      <p className="llm-sub">
        The series has relied on two categories to explain shared traits. LLMs force a third.
        Select one.
      </p>
      <div className="llm-cat-tabs">
        {(Object.keys(CATEGORIES) as Category[]).map(k => (
          <button
            key={k}
            className={`llm-cat-tab${cat === k ? ' active' : ''}`}
            style={cat === k ? { borderColor: CATEGORIES[k].color, color: CATEGORIES[k].color } : {}}
            onClick={() => setCat(k)}
          >
            {CATEGORIES[k].label}
          </button>
        ))}
      </div>
      <div className="llm-cat-detail" style={{ borderColor: c.color }}>
        <div className="llm-cat-row">
          <span className="llm-cat-key">Definition</span>
          <span className="llm-cat-val">{c.defn}</span>
        </div>
        <div className="llm-cat-row">
          <span className="llm-cat-key">Process</span>
          <span className="llm-cat-val">{c.process}</span>
        </div>
        <div className="llm-cat-row">
          <span className="llm-cat-key">Example</span>
          <span className="llm-cat-val">{c.example}</span>
        </div>
      </div>

      {/* Product vs process schematic */}
      <div className="llm-pvp">
        <div className="llm-pvp-col">
          <div className="llm-pvp-head">Biological language</div>
          <div className="llm-pvp-chain">
            <span className="llm-pvp-node">evolution</span>
            <span className="llm-pvp-arr">→</span>
            <span className="llm-pvp-node">grounding + embodiment</span>
            <span className="llm-pvp-arr">→</span>
            <span className="llm-pvp-node">developmental bottleneck</span>
            <span className="llm-pvp-arr">→</span>
            <span className="llm-pvp-node llm-pvp-product">the bundle</span>
          </div>
          <div className="llm-pvp-cap">process <em>and</em> product</div>
        </div>
        <div className="llm-pvp-col">
          <div className="llm-pvp-head">Large language model</div>
          <div className="llm-pvp-chain">
            <span className="llm-pvp-node llm-pvp-skip">evolution</span>
            <span className="llm-pvp-arr">⤬</span>
            <span className="llm-pvp-node llm-pvp-skip">grounding</span>
            <span className="llm-pvp-arr">⤬</span>
            <span className="llm-pvp-node llm-pvp-skip">bottleneck</span>
            <span className="llm-pvp-arr">→</span>
            <span className="llm-pvp-node llm-pvp-product">the bundle's <em>signatures</em></span>
          </div>
          <div className="llm-pvp-cap">product <em>without</em> process</div>
        </div>
      </div>

      {/* Design space */}
      <h2 className="llm-h2">Where Does It Sit?</h2>
      <p className="llm-sub">
        Syntax vs. reference across all pillars, plus the LLM. It clusters near human on syntactic
        surface, but its reference is ungrounded — it floats away from the biological cloud. Click a dot.
      </p>
      <div className="llm-scatter-wrap">
        <svg viewBox={VB} className="llm-scatter-svg" aria-label="Communication design space with LLM">
          <line x1={L} y1={T - 10} x2={L} y2={B + 10} stroke="var(--llm-blue)" strokeWidth="1" opacity="0.35" />
          <line x1={L - 10} y1={B} x2={R + 10} y2={B} stroke="var(--llm-blue)" strokeWidth="1" opacity="0.35" />
          <text x={(L + R) / 2} y={B + 36} textAnchor="middle" fill="var(--llm-steel)" fontSize="11" fontFamily="var(--font-sans)" letterSpacing="0.08em">SYNTACTIC SURFACE →</text>
          <text x={L - 44} y={(T + B) / 2} textAnchor="middle" fill="var(--llm-steel)" fontSize="11" fontFamily="var(--font-sans)" letterSpacing="0.08em" transform={`rotate(-90 ${L - 44} ${(T + B) / 2})`}>GROUNDED REFERENCE →</text>
          {[0.25, 0.5, 0.75].map(v => (
            <g key={v}>
              <line x1={px(v)} y1={T} x2={px(v)} y2={B} stroke="var(--llm-blue)" strokeWidth="1" strokeDasharray="4 4" opacity="0.18" />
              <line x1={L} y1={py(v)} x2={R} y2={py(v)} stroke="var(--llm-blue)" strokeWidth="1" strokeDasharray="4 4" opacity="0.18" />
            </g>
          ))}
          {PILLARS.map(p => {
            const isLlm = p.label === 'LLM'
            return (
              <g key={p.label} onClick={() => setActive(p.label)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={px(p.x)} cy={py(p.y)}
                  r={active === p.label ? 13 : 8}
                  fill={active === p.label ? p.color : 'transparent'}
                  stroke={p.color}
                  strokeWidth={active === p.label ? 0 : 2}
                  strokeDasharray={isLlm ? '3 3' : undefined}
                  opacity={active === p.label ? 1 : 0.75}
                />
                <text
                  x={px(p.x) + (p.x > 0.8 ? -14 : 12)}
                  y={py(p.y) + (p.label === 'Human' ? -14 : 4)}
                  textAnchor={p.x > 0.8 ? 'end' : 'start'}
                  fill={active === p.label ? p.color : `color-mix(in oklch, ${p.color} 65%, var(--fg-muted))`}
                  fontSize={active === p.label ? '12' : '11'}
                  fontFamily="var(--font-sans)"
                  fontWeight={active === p.label ? '600' : '400'}
                >
                  {p.label}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="llm-scatter-callout" style={{ borderColor: pt.color }}>
          <span className="llm-scatter-name" style={{ color: pt.color }}>{pt.label}</span>
          <span className="llm-scatter-desc">
            {pt.label === 'LLM'       && 'High syntactic surface — fluent, well-formed text — but reference is distilled from corpus, not grounded in a world. The dashed marker flags its categorical difference: it is not a biological point at all.'}
            {pt.label === 'Human'     && 'The only biological system combining grounded reference with full compositional, recursive syntax. The bundle the LLM is trained to imitate.'}
            {pt.label === 'Whales'    && 'Rich syntax-like structure, open-ended vocal learning, no demonstrated grounded compositional reference.'}
            {pt.label === 'Birds'     && 'Complex hierarchical song, no semantic reference beyond context. The n-gram models that capture birdsong are the primitive language model.'}
            {pt.label === 'Primates'  && 'Functional reference and intentional gesture, but no productive syntax. Communicative intent is real here — and absent in the LLM.'}
            {pt.label === 'Parrots'   && 'Referential labels and vocal learning. Alex grounded "wanna go back" in a real desire — an LLM grounds nothing.'}
            {pt.label === 'Bees'      && 'Maximum grounded displaced reference (a real vector to a real food source), zero syntax. The coherence the navigation transformer lacks.'}
            {pt.label === 'Elephants' && 'Individual recognition, candidate names, rich multimodal context. Grounded in a lived social world.'}
          </span>
        </div>
      </div>

      <div className="llm-callout">
        <div>
          <strong>The third-category payload:</strong> the animal pillars dissociated the bundle's
          <em>components</em> across species — syntax-without-semantics in birds, reference-without-syntax
          in bees. LLMs dissociate along an entirely new axis: the bundle's <em>behavioral product</em> from
          its <em>biological and developmental process</em>. They are the first system in the series to make
          that cut — which is exactly why their resemblances are so striking and so brittle at once.
        </div>
      </div>
    </div>
  )
}
