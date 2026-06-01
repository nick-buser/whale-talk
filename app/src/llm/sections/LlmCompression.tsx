import { useState } from 'react'

/* Brain-alignment findings */
const BRAIN = [
  {
    id: 'schrimpf',
    work: 'Schrimpf et al. 2021 (PNAS)',
    finding: 'Transformer LMs predict human neural (fMRI/ECoG) and behavioral responses to sentences up to the noise ceiling — ~100% of explainable variance on some datasets, vs. 30–50% for prior models.',
    twist: 'Critically, next-word-prediction performance correlates with brain-predictivity (other GLUE tasks do not) — supporting a predictive-processing account of the language network.',
    bar: 1.0,
  },
  {
    id: 'goldstein',
    work: 'Goldstein et al. 2022 (Nat. Neurosci.)',
    finding: 'Human cortex shares three computational features with autoregressive models: continuous pre-onset next-word prediction, post-onset surprise, and contextual-embedding representation.',
    twist: 'The brain appears to be predicting upcoming words before they arrive — the same objective the LLM is trained on.',
    bar: 0.85,
  },
  {
    id: 'tuckute',
    work: 'Tuckute et al. 2024',
    finding: 'Model-selected sentences can drive and suppress the Fedorenko language network — closing the loop causally, not just correlationally.',
    twist: 'A model trained only on text can be used to choose stimuli that control a biological language network. Striking — but alignment still ≠ shared mechanism.',
    bar: 0.7,
  },
]

export function LlmCompression() {
  const [prob, setProb] = useState(0.5)
  const bits = -Math.log2(prob)

  return (
    <div className="llm-section">
      <p className="llm-eyebrow">Pillar VIII · Machine Language</p>
      <h1 className="llm-title">Compression &amp; the Brain</h1>
      <p className="llm-lede">
        The single most robust regularity across all the biological pillars was information-theoretic:
        Zipf's law, Menzerath's law, and Uniform Information Density — efficient coding under channel
        constraints. This is the one place the LLM–biology relationship might be <em>genuinely deep</em>{' '}
        rather than parasitic, because both classes of system are optimized under the same pressure.
      </p>

      {/* Prediction = compression */}
      <h2 className="llm-h2">Prediction <span className="llm-equiv">≡</span> Compression</h2>
      <p className="llm-sub">
        Delétang et al. 2023 prove the equivalence (Shannon source coding): minimizing log-loss <em>is</em>{' '}
        minimizing expected code length. A token of probability <em>p</em> costs −log₂<em>p</em> bits to
        encode. Drag to set the model's predicted probability for the next token.
      </p>
      <div className="llm-compress">
        <input
          type="range"
          min={0.01} max={1} step={0.01}
          value={prob}
          onChange={e => setProb(parseFloat(e.target.value))}
          className="llm-compress-slider"
          aria-label="predicted probability"
        />
        <div className="llm-compress-readout">
          <div className="llm-compress-stat">
            <span className="llm-compress-stat-val">{(prob * 100).toFixed(0)}%</span>
            <span className="llm-compress-stat-lbl">predicted probability</span>
          </div>
          <span className="llm-compress-eq">→</span>
          <div className="llm-compress-stat">
            <span className="llm-compress-stat-val">{bits.toFixed(2)}</span>
            <span className="llm-compress-stat-lbl">bits to encode</span>
          </div>
        </div>
        <div className="llm-compress-bar-track">
          <div className="llm-compress-bar" style={{ width: `${Math.min(bits / 6.64, 1) * 100}%` }} />
        </div>
        <p className="llm-compress-note">
          {prob > 0.8 && 'A confident, correct prediction costs almost nothing to store — the model has compressed this token well.'}
          {prob <= 0.8 && prob > 0.3 && 'A middling prediction costs a few bits. Better models assign higher probability to what actually comes next, so they compress better.'}
          {prob <= 0.3 && 'A surprised model spends many bits. A better language model is, provably and exactly, a better lossless compressor.'}
        </p>
      </div>

      {/* Distilled vs convergent */}
      <div className="llm-dvc">
        <div className="llm-dvc-card distilled">
          <span className="llm-dvc-head">The distilled reading</span>
          <p>LLMs reproduce Zipf, Menzerath, and UID <em>trivially</em> — they model text that already has
          them. Borrowed, not derived. This is true and accounts for most of the resemblance.</p>
        </div>
        <div className="llm-dvc-card convergent">
          <span className="llm-dvc-head">The convergent reading</span>
          <p>But both biological codes (efficient coding under channel limits) and LLM training (log-loss =
          expected code length) are <em>optimization under information-theoretic pressure</em>. The efficiency
          laws may be partly <strong>re-derived</strong> from the objective — genuine convergence.</p>
        </div>
      </div>
      <p className="llm-test-note">
        <strong>How to tell them apart:</strong> train on an efficiency-law-violating synthetic corpus and
        check whether the laws re-emerge. If they do, the objective — not the data — is producing them, and
        the grid cell legitimately moves from Distilled to Convergent.
      </p>

      {/* Brain alignment */}
      <h2 className="llm-h2">Brain Alignment</h2>
      <p className="llm-sub">
        Next-word-prediction models predict cortical language-network responses near the noise ceiling.
        Striking — and interpretively ambiguous.
      </p>
      <div className="llm-brain">
        {BRAIN.map(b => (
          <div key={b.id} className="llm-brain-item">
            <div className="llm-brain-bar-row">
              <span className="llm-brain-work">{b.work}</span>
              <div className="llm-brain-bar-track">
                <div className="llm-brain-bar" style={{ width: `${b.bar * 100}%` }} />
              </div>
            </div>
            <p className="llm-brain-finding">{b.finding}</p>
            <p className="llm-brain-twist">{b.twist}</p>
          </div>
        ))}
      </div>

      <div className="llm-callout">
        <div>
          <strong>Alignment ≠ shared mechanism.</strong> Both systems are optimized for prediction over the
          <em>same</em> linguistic input distribution, so representational convergence may reflect the shared
          <em>objective and data</em> rather than shared <em>computation</em>. This is the distillation-vs-convergence
          ambiguity restated at the neural level — and you cannot disentangle it without manipulations that
          hold the objective fixed while varying the mechanism, which is currently infeasible. The "compression
          is intelligence" slogan goes further still, and I flag it as speculative and contested.
        </div>
      </div>
    </div>
  )
}
