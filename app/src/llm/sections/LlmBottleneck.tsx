import { useState } from 'react'

type Mode = 'human' | 'llm'

/* A toy distribution rendered as bars, evolving across generations.
   Human (with bottleneck): structure sharpens into a few systematic, reusable forms.
   LLM (recursive self-training, no expressivity pressure): tails vanish, collapses to the mode. */
function humanGen(g: number): number[] {
  // Starts holistic/uniform-ish, becomes compositional: a few peaks reused systematically
  const base = [5, 5, 5, 5, 5, 5, 5, 5]
  if (g === 0) return base
  // structure emerges: regular reusable peaks grow, idiosyncratic forms fade but diversity of *combinations* preserved
  const peaks = [0, 2, 4, 6]
  return base.map((v, i) => {
    const isPeak = peaks.includes(i)
    return isPeak ? v + g * 2.2 : Math.max(v - g * 0.4, 2)
  })
}
function llmGen(g: number): number[] {
  // model collapse: tails vanish, mass concentrates on a single mode
  const base = [2, 4, 7, 10, 8, 5, 3, 2]
  if (g === 0) return base
  const peakIdx = 3
  return base.map((v, i) => {
    if (i === peakIdx) return v + g * 3
    return Math.max(v - g * 1.6, 0)
  })
}

const MAX_GEN = 4

export function LlmBottleneck() {
  const [mode, setMode] = useState<Mode>('human')
  const [gen, setGen] = useState(0)

  const dist = mode === 'human' ? humanGen(gen) : llmGen(gen)
  const maxV = Math.max(...dist, 1)
  const alive = dist.filter(v => v > 0.5).length

  return (
    <div className="llm-section">
      <p className="llm-eyebrow">Pillar VIII · Machine Language</p>
      <h1 className="llm-title">The Inverted Bottleneck</h1>
      <p className="llm-lede">
        Here is the most rigorous form of the third-category payload. Human compositionality is not a gift
        of raw intelligence — it is <em>language's adaptation to a transmission bottleneck</em>. LLMs ingest
        the product of that bottleneck without ever undergoing the process. They inherited the answer
        without the pressure that makes the answer robust.
      </p>

      {/* Kirby's ILM */}
      <div className="llm-kirby">
        <h2 className="llm-h2">Kirby's Iterated Learning</h2>
        <p className="llm-kirby-body">
          Kirby, Cornish &amp; Smith (2008) showed that when each generation learns language from only a{' '}
          <em>subset</em> of the previous generation's output, two pressures collide: <strong>compressibility</strong>{' '}
          (the language must be learnable from partial data) and <strong>expressivity</strong> (it must still
          communicate everything). The resolution to that tension <em>is</em> compositional structure —
          reusable parts that generalize beyond what was observed. "Compositionality is language's adaptation
          to stimulus poverty."
        </p>
        <div className="llm-kirby-eq">
          <span className="llm-kirby-term">transmission bottleneck</span>
          <span className="llm-kirby-op">+</span>
          <span className="llm-kirby-term">compressibility</span>
          <span className="llm-kirby-op">+</span>
          <span className="llm-kirby-term">expressivity</span>
          <span className="llm-kirby-op">→</span>
          <span className="llm-kirby-term result">compositional structure</span>
        </div>
      </div>

      {/* Interactive: two iterated-learning chains */}
      <h2 className="llm-h2">Iterated Learning, Two Ways</h2>
      <p className="llm-sub">
        Both are chains where each generation trains on the previous one's output. Only one builds
        structure. Step through the generations.
      </p>
      <div className="llm-il-tabs">
        <button
          className={`llm-il-tab${mode === 'human' ? ' active' : ''}`}
          onClick={() => { setMode('human'); setGen(0) }}
        >
          Human · with bottleneck
        </button>
        <button
          className={`llm-il-tab${mode === 'llm' ? ' active' : ''}`}
          onClick={() => { setMode('llm'); setGen(0) }}
        >
          LLM · recursive self-training
        </button>
      </div>

      <div className="llm-il-panel">
        <div className="llm-il-chart">
          {dist.map((v, i) => (
            <div key={i} className="llm-il-bar-col">
              <div
                className={`llm-il-bar ${mode}`}
                style={{ height: `${(v / maxV) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="llm-il-meta">
          <div className="llm-il-genrow">
            <span className="llm-il-genlabel">Generation {gen}</span>
            <span className="llm-il-alive">{alive} / 8 forms surviving</span>
          </div>
          <input
            type="range"
            min={0} max={MAX_GEN} step={1}
            value={gen}
            onChange={e => setGen(parseInt(e.target.value))}
            className="llm-il-slider"
            aria-label="generation"
          />
          <p className="llm-il-desc">
            {mode === 'human' && gen === 0 && 'Generation 0: an unstructured, holistic system — every meaning has its own idiosyncratic signal.'}
            {mode === 'human' && gen > 0 && gen < MAX_GEN && 'The bottleneck forces reuse: systematic, recombinable forms grow while idiosyncratic ones fade. Structure is being built — diversity of expressible meanings is preserved through composition.'}
            {mode === 'human' && gen === MAX_GEN && 'A compositional grammar: a few reusable parts that recombine to express unboundedly many meanings. The bottleneck made the language MORE expressive, not less.'}
            {mode === 'llm' && gen === 0 && 'Generation 0: the rich, heavy-tailed distribution of real human text — rare forms and all.'}
            {mode === 'llm' && gen > 0 && gen < MAX_GEN && 'Trained on its own output with no expressivity pressure and no bottleneck, the high-capacity learner concentrates mass on the mode. The tails — the rare, diverse forms — are vanishing.'}
            {mode === 'llm' && gen === MAX_GEN && 'Model collapse (Shumailov et al. 2024): distributional tails have disappeared. Recursive self-training is the photographic negative of Kirby — it degrades diversity instead of building structure.'}
          </p>
        </div>
      </div>

      {/* The disanalogy */}
      <div className="llm-disanalogy">
        <div className="llm-disanalogy-card">
          <span className="llm-disanalogy-head">Why LLMs lack the bottleneck</span>
          <p>
            Galke, Ram &amp; Raviv (2022) argue neural <strong>overparameterization</strong> "significantly
            reduces compressibility pressure, effectively eliminating the potential benefits of compositional
            structure." A model with capacity to spare has no need to compress — so it memorizes the
            already-compositional corpus rather than re-deriving compositionality. Neural iterated-learning
            agents only produce compositionality when a bottleneck is <em>artificially engineered</em> (Ren et
            al. 2020; Lian et al. 2021).
          </p>
        </div>
        <div className="llm-disanalogy-pull">
          LLMs are high-capacity memorizers of an already-compositional corpus — not bottlenecked learners
          that re-derive compositionality. This is <em>why</em> their compositionality is brittle: they
          inherited the answer without the pressure that makes it robust.
        </div>
      </div>

      {/* Necessary vs sufficient */}
      <h2 className="llm-h2">Necessary vs. Sufficient</h2>
      <div className="llm-ns">
        <div className="llm-ns-step">
          <span className="llm-ns-num">1</span>
          <p>The <strong>bee pillar</strong> already showed the homologous biological substrate is not
          necessary for displaced reference — an insect with ~1M neurons does it.</p>
        </div>
        <div className="llm-ns-step">
          <span className="llm-ns-num">2</span>
          <p>LLMs push further: perhaps the <em>entire evolutionary and developmental process</em> is not
          necessary for the behavioral <strong>product</strong>.</p>
        </div>
        <div className="llm-ns-step warn">
          <span className="llm-ns-num">!</span>
          <p>But "not necessary for the <em>product</em>" is emphatically <strong>not</strong> "not necessary
          for the underlying <em>capacity</em>." The gap between those two is exactly where the understanding
          question lives — unresolved, and likely irresolvable on current framings.</p>
        </div>
      </div>

      <div className="llm-callout llm-callout--final">
        <div>
          <strong>The closing verdict.</strong> LLMs may occupy their own novel point in the design space of
          communication systems — as distinct from human language as the bee dance is, and as the songbird is
          — born of cultural distillation at scale rather than biological evolution. Treating them as
          approximations-to-human may be the category error the whole series warns against. They are the first
          system to dissociate the bundle's behavioral product from its biological process: product without
          process, answer without pressure, the assembled whole's <em>signatures</em> without the assembly.
        </div>
      </div>
    </div>
  )
}
