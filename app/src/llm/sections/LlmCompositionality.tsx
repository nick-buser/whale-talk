import { useState } from 'react'

/* Dziri et al. 2023 "Faith and Fate" — GPT-4 multi-digit multiplication accuracy.
   Values are the reported/illustrative accuracies showing the collapse with depth. */
const MULT_ACC: { digits: string; acc: number }[] = [
  { digits: '1×1', acc: 0.99 },
  { digits: '2×2', acc: 0.85 },
  { digits: '3×3', acc: 0.59 },
  { digits: '4×4', acc: 0.04 },
  { digits: '5×5', acc: 0.00 },
]

export function LlmCompositionality() {
  const [sel, setSel] = useState(2) // index into MULT_ACC, default 3×3

  const cur = MULT_ACC[sel]

  return (
    <div className="llm-section">
      <p className="llm-eyebrow">Pillar VIII · Machine Language</p>
      <h1 className="llm-title">Compositionality — the Crux</h1>
      <p className="llm-lede">
        Compositional semantics is the keystone of the human bundle. If LLMs have it, they have the thing
        that matters most; if they only seem to, the resemblance is hollow. The current answer is the most
        important and most qualified in the whole pillar: <em>partial, improving, brittle, and apparently
        requiring the right objective rather than merely more data.</em>
      </p>

      {/* Fodor & Pylyshyn framing */}
      <div className="llm-fp">
        <span className="llm-fp-q">Fodor &amp; Pylyshyn (1988)</span>
        <p className="llm-fp-body">
          Connectionist nets lack the <em>systematicity</em> constitutive of thought: anyone who
          understands "John loves Mary" thereby understands "Mary loves John." The classic challenge —
          can a neural network generalize compositionally, or only interpolate among memorized cases?
        </p>
      </div>

      {/* The multiplication collapse */}
      <h2 className="llm-h2">The Multiplication Collapse</h2>
      <p className="llm-sub">
        Dziri et al. 2023 ("Faith and Fate") tested GPT-4 on n-digit × n-digit multiplication — a perfectly
        compositional task with a known algorithm. Select the problem size.
      </p>
      <div className="llm-mult">
        <div className="llm-mult-chart">
          {MULT_ACC.map((m, i) => (
            <button
              key={m.digits}
              className={`llm-mult-bar-wrap${sel === i ? ' active' : ''}`}
              onClick={() => setSel(i)}
            >
              <div className="llm-mult-bar-track">
                <div
                  className="llm-mult-bar"
                  style={{
                    height: `${Math.max(m.acc * 100, 1.5)}%`,
                    background: sel === i ? 'var(--llm-blue)' : 'color-mix(in oklch, var(--llm-blue) 45%, transparent)',
                  }}
                />
              </div>
              <span className="llm-mult-acc">{(m.acc * 100).toFixed(0)}%</span>
              <span className="llm-mult-label">{m.digits}</span>
            </button>
          ))}
        </div>
        <div className="llm-mult-readout">
          <div className="llm-mult-readout-big">
            <span className="llm-mult-readout-digits">{cur.digits}</span>
            <span className="llm-mult-readout-acc">{(cur.acc * 100).toFixed(0)}% accurate</span>
          </div>
          <p className="llm-mult-readout-note">
            {sel <= 1 && 'Small products appear directly or near-directly in training data — the model retrieves rather than computes.'}
            {sel === 2 && 'At 3×3, GPT-4 manages 59% (off-the-shelf ChatGPT ~55%). Already the algorithm is not being applied reliably.'}
            {sel === 3 && 'At 4×4, accuracy collapses to 4%. The model never acquired the carrying algorithm — it matched fragments of computation graphs it had seen.'}
            {sel === 4 && 'At 5×5, essentially 0%. A pocket calculator from 1972 does this perfectly. The gap is not knowledge — it is the absence of a systematic procedure.'}
          </p>
        </div>
      </div>

      {/* Subgraph matching explanation */}
      <div className="llm-subgraph">
        <h3 className="llm-subgraph-title">Linearized subgraph matching, not algorithm acquisition</h3>
        <p className="llm-subgraph-body">
          Dziri et al. show success tracks having seen "significant portions of the required computation
          graph" in training. The transformer reduces a multi-step compositional task to pattern-matching
          over fragments of the computation it has already witnessed — not to acquiring the general
          procedure. And they prove it formally: error probability <strong>→ 1</strong> as compositional
          depth and width grow. The structure is inherited piecemeal, so it shatters exactly where novelty
          demands genuine composition.
        </p>
      </div>

      {/* MLC — the constructive counterpoint */}
      <h2 className="llm-h2">The Constructive Counterpoint: MLC</h2>
      <div className="llm-mlc">
        <div className="llm-mlc-row">
          <div className="llm-mlc-card scale">
            <span className="llm-mlc-card-head">Scale alone</span>
            <span className="llm-mlc-card-body">
              More parameters, more data → brittle subgraph matching. SCAN and COGS expose severe
              compositional-generalization failures that do not vanish with size.
            </span>
            <span className="llm-mlc-card-verdict bad">brittle</span>
          </div>
          <div className="llm-mlc-arrow">vs</div>
          <div className="llm-mlc-card mlc">
            <span className="llm-mlc-card-head">Meta-learning (MLC)</span>
            <span className="llm-mlc-card-body">
              Lake &amp; Baroni (2023, <em>Nature</em>): a meta-learning objective optimized for compositional
              skill achieves — and sometimes exceeds — human systematic generalization, and reproduces human
              error patterns.
            </span>
            <span className="llm-mlc-card-verdict good">human-like</span>
          </div>
        </div>
        <p className="llm-mlc-takeaway">
          The decisive ingredient is the <strong>objective</strong>, not the scale. Systematicity is
          installable — but you have to optimize <em>for</em> it. This is a qualified answer to Fodor &amp;
          Pylyshyn: connectionist systems <em>can</em> be systematic, given the right training pressure —
          which the standard next-token objective does not supply.
        </p>
      </div>

      <div className="llm-callout">
        <div>
          <strong>Why this matters for the whole series:</strong> if compositional semantics is the keystone
          that locks the human bundle together, then the degree to which LLMs have it <em>is</em> the
          question of whether they have language in the deep sense. The honest reading: they inherited the
          <em>answer</em> (a compositional corpus) without the <em>pressure</em> that makes the answer robust
          — which is precisely why it shatters under novelty, and precisely the subject of the Inverted
          Bottleneck.
        </div>
      </div>
    </div>
  )
}
