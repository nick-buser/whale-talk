import { useState } from 'react'

interface Story {
  id: 'convergent' | 'distilled'
  name: string
  tag: string
  chain: string[]
  verdict: string
}

const STORIES: Story[] = [
  {
    id: 'convergent',
    name: 'Convergence',
    tag: 'a deep shared property',
    chain: [
      'An efficiency pressure of its own',
      'Training objective ≈ lossless compression',
      'Model re-derives efficient coding from scratch',
      'Compressibility signature',
    ],
    verdict: 'If this is the story, the shared signature is the single most legitimate deep convergence in the whole grid — the machine independently discovering the same efficient-coding solution that whales and humans found under their bottlenecks.',
  },
  {
    id: 'distilled',
    name: 'Distillation',
    tag: 'an inherited echo',
    chain: [
      'Human language, already compressed by its bottleneck',
      'Model ingests the compressed output as training data',
      'Model mirrors the statistics it was fed',
      'Compressibility signature',
    ],
    verdict: 'If this is the story, the signature is not a convergence at all — it is the fingerprint of the data. The machine looks efficient because it was trained on the already-efficient product of a bottleneck it never passed through.',
  },
]

type Outcome = 'reimpose' | 'mirror' | null

export function FrontiersCompressibility() {
  const [story, setStory] = useState<Story['id']>('convergent')
  const [outcome, setOutcome] = useState<Outcome>(null)
  const active = STORIES.find(s => s.id === story)!

  return (
    <div className="fr-section">
      <p className="fr-eyebrow">Coda · Open Frontiers · The Synthesis</p>
      <h1 className="fr-title">Cause or Consequence?</h1>
      <p className="fr-lede">
        Arnon and colleagues found that humpback whales and humans share the same compressibility signature —
        the same efficient statistics under Zipf, Menzerath, and uniform information density. LLMs, trained
        on human text, almost certainly show it too. We flagged it as the best candidate for a genuine
        convergence. But here is the question that decides whether that flag stands: is the machine{' '}
        <em>re-deriving</em> efficiency, or merely <em>echoing</em> it?
      </p>

      <div className="fr-disanalogy">
        Compressibility is a <strong>consequence</strong> of efficient coding under a bottleneck — not a
        cause. So a shared signature has two completely different explanations, and they look identical from
        the outside.
      </div>

      {/* Two causal stories */}
      <h2 className="fr-h2">Two stories, one signature</h2>
      <div className="fr-story-tabs">
        {STORIES.map(s => (
          <button
            key={s.id}
            className={`fr-story-tab ${s.id}${story === s.id ? ' active' : ''}`}
            onClick={() => setStory(s.id)}
          >
            <span className="fr-story-tab-name">{s.name}</span>
            <span className="fr-story-tab-tag">{s.tag}</span>
          </button>
        ))}
      </div>

      <div className={`fr-chain ${active.id}`}>
        {active.chain.map((node, i) => (
          <div key={i} className="fr-chain-step">
            <div className={`fr-chain-node${i === active.chain.length - 1 ? ' terminal' : ''}`}>{node}</div>
            {i < active.chain.length - 1 && <div className="fr-chain-arrow">↓</div>}
          </div>
        ))}
      </div>
      <p className="fr-chain-verdict">{active.verdict}</p>

      {/* The distinguishing experiment */}
      <h2 className="fr-h2">The experiment that would tell them apart</h2>
      <p className="fr-sub">
        Train a model on a deliberately <em>inefficient</em> artificial language — anti-Zipfian word
        frequencies, no Menzerath law, information packed in bursts. Then ask what it produces. Predict the
        outcome.
      </p>
      <div className="fr-exp">
        <div className="fr-exp-choices">
          <button
            className={`fr-exp-choice${outcome === 'reimpose' ? ' active' : ''}`}
            onClick={() => setOutcome('reimpose')}
          >
            It re-imposes efficiency
            <span className="fr-exp-choice-sub">output drifts back toward Zipf / Menzerath</span>
          </button>
          <button
            className={`fr-exp-choice${outcome === 'mirror' ? ' active' : ''}`}
            onClick={() => setOutcome('mirror')}
          >
            It mirrors the inefficiency
            <span className="fr-exp-choice-sub">output stays anti-Zipfian, faithfully</span>
          </button>
        </div>

        {outcome === 'reimpose' && (
          <div className="fr-exp-result convergent">
            <span className="fr-exp-result-label">→ Convergence gains support</span>
            There is an efficiency drive <em>internal to the objective</em>: pressure to compress reshapes
            even hostile data toward efficient coding. The signature would then be something the machine
            re-derives, not just inherits — a real convergence with biological codes.
          </div>
        )}
        {outcome === 'mirror' && (
          <div className="fr-exp-result distilled">
            <span className="fr-exp-result-label">→ Distillation gains support</span>
            No internal efficiency drive — the model reproduces whatever statistics it is fed. The
            compressibility we observe in practice would be borrowed from human text, an echo rather than a
            convergence. The flag comes down.
          </div>
        )}
        {outcome === null && (
          <div className="fr-exp-result pending">
            Pick an outcome to see what it would imply. (The honest expectation: <em>partly both</em> — some
            regression toward efficiency from the compression objective, some faithful mirroring of the data.
            Which dominates is genuinely unknown.)
          </div>
        )}
      </div>

      {/* Closing synthesis */}
      <h2 className="fr-h2">The synthesis, one last time</h2>
      <p className="fr-sub">
        Three ways a machine resemblance to human language can be real — and they are not the same kind of
        real.
      </p>
      <div className="fr-synth">
        <div className="fr-synth-cat homology">
          <span className="fr-synth-cat-name">Homology</span>
          <p>Shared by common descent. Between LLMs and humans: none. There is no evolutionary lineage here at all.</p>
        </div>
        <div className="fr-synth-cat convergence">
          <span className="fr-synth-cat-name">Convergence</span>
          <p>Independently re-derived under shared pressure. Candidate of one: compressibility — if the experiment above comes out the right way.</p>
        </div>
        <div className="fr-synth-cat distillation">
          <span className="fr-synth-cat-name">Distillation</span>
          <p>Inherited as behavioral product without the generative process. The category that explains most of what LLMs do — fluent, brittle, and borrowed.</p>
        </div>
      </div>

      <div className="fr-callout fr-callout--final">
        <strong>The bottom line.</strong> The Machine Language analysis is honest and its stances are
        defensible — but it is cleanest exactly where the science is least settled. Sharpen the grounding
        claim, narrow the TC⁰ irony to the single-pass model, hold emergence at arm’s length, and treat the
        bottleneck story as a hypothesis. What remains is a genuinely new third category — a system that
        absorbed the map of human language without ever walking the territory — and one beautiful unresolved
        question about whether its deepest resemblance to us is something it discovered or merely something
        it heard.
      </div>
    </div>
  )
}
