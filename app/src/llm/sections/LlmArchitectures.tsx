import { useState } from 'react'

interface Arch {
  id: string
  name: string
  year: string
  adds: string
  formal: string
  body: string
  analogy: string
  analogyVerdict: 'identity' | 'rich' | 'resisted'
  refs: string
}

const ARCHS: Arch[] = [
  {
    id: 'ngram',
    name: 'n-gram models',
    year: '~1950s–2000s',
    adds: 'Markov conditional probability',
    formal: 'Regular / finite-state',
    body: 'An n-gram model predicts the next token from the previous n−1 — literally a Markov chain of order n−1. No hidden state beyond the window; pure surface co-occurrence statistics.',
    analogy: 'This IS the songbird pillar\'s model. Zebra-finch and Bengalese-finch song are captured by Markov and hidden-Markov chains — the exact same formal object as the primitive language model. The tool that models birdsong is the first language model.',
    analogyVerdict: 'identity',
    refs: 'Shannon 1948; Jurafsky & Martin',
  },
  {
    id: 'rnn',
    name: 'RNN / LSTM',
    year: '1997–2015',
    adds: 'Recurrent hidden state',
    formal: 'Bounded in practice (Turing-complete only in the infinite-precision limit)',
    body: 'Recurrent nets carry a hidden state across time, in principle tracking unbounded dependencies. Siegelmann & Sontag (1994) proved Turing-completeness in the idealized limit; real LSTMs are bounded but can learn counter languages and some context-sensitive patterns (Dyck-1 with as little as one hidden unit).',
    analogy: 'A step up from finite-state toward the hierarchical structure that birdsong lacks and human language requires — but still no grounding, no compositional semantics. The recurrence is a mechanism, not a meaning.',
    analogyVerdict: 'rich',
    refs: 'Hochreiter & Schmidhuber 1997; Siegelmann & Sontag 1994; Suzgun et al.',
  },
  {
    id: 'transformer',
    name: 'Base transformer',
    year: '2017',
    adds: 'Parallel global self-attention',
    formal: 'TC⁰ (below regular)',
    body: 'Self-attention (Vaswani et al. 2017) replaced recurrence with parallel global attention — trading sequential expressivity for scalability. This is the architecture that scaled. Self-supervised next-token prediction plus in-context learning (which arises mechanistically from induction heads) is the engine.',
    analogy: 'Formally below birdsong, yet it captures human-language statistics extraordinarily well. The central irony of the whole pillar (see The TC⁰ Irony).',
    analogyVerdict: 'rich',
    refs: 'Vaswani et al. 2017; Olsson et al. 2022 (induction heads)',
  },
  {
    id: 'scale',
    name: 'Scaling & "emergence"',
    year: '2020–2022',
    adds: 'Power-law capability gains',
    formal: '— (same architecture, more of it)',
    body: 'Kaplan et al. (2020) established power-law scaling; Chinchilla (Hoffmann et al. 2022) corrected the compute-optimal trade-off. Wei et al. (2022) reported sharp "emergent abilities." But Schaeffer et al. (2023) show over 90% of claimed emergent abilities appear only under harsh discontinuous metrics (exact-match) and vanish under smooth ones (token edit distance) — the sharpness is often an artifact of measurement.',
    analogy: 'A direct methodological parallel to the biological debate: does complex communication "emerge" discontinuously from simpler substrates, or is the discontinuity read in by the observer\'s coding scheme? The same hazard in comparative cognition.',
    analogyVerdict: 'rich',
    refs: 'Kaplan 2020; Hoffmann 2022; Wei 2022; Schaeffer 2023',
  },
  {
    id: 'rlhf',
    name: 'RLHF / alignment',
    year: '2017–2022',
    adds: 'A cooperative-speaker layer',
    formal: '— (fine-tuning of behavior)',
    body: 'RLHF (Christiano 2017; Ouyang 2022), DPO (Rafailov 2023), and Constitutional AI (Bai 2022) fine-tune the base model toward "helpful, harmless, honest" behavior. The richest comparative analogy in the piece: the base model supplies form; RLHF installs a Gricean/cooperative pragmatic layer — a simulation of a speaker obeying the Cooperative Principle and the maxims of Quantity, Quality, Relation, Manner.',
    analogy: 'This connects to the Human pillar\'s pragmatics (Grice, Relevance Theory, RSA). But evidence it yields genuine pragmatic competence is mixed: testing Llama3-8B-Instruct against an RSA model, Jian & Siddharth (2024) found "not sufficient evidence to claim it behaves like a pragmatic speaker." RLHF engineers the behavioral signature of cooperative intent without establishing any intent exists.',
    analogyVerdict: 'rich',
    refs: 'Ouyang 2022; Bai 2022; Jian & Siddharth 2024',
  },
  {
    id: 'moe',
    name: 'Mixture of experts',
    year: '2017–2024',
    adds: 'Conditional computation',
    formal: '— (sparsity, not expressivity)',
    body: 'Sparse MoE (Shazeer 2017; Switch Transformer; Mixtral; DeepSeek-MoE) routes each token to a few expert feed-forward networks, decoupling parameter count from per-token compute. An efficiency mechanism, tying to the compression throughline.',
    analogy: 'The tempting move — MoE "experts" as analogs of the brain\'s specialized language network (Fedorenko) — must be RESISTED. Empirically, experts route by token and syntactic surface features, not interpretable semantic domains. They are not domain-specialized modules. I mark this analogy largely false.',
    analogyVerdict: 'resisted',
    refs: 'Shazeer 2017; Fedus 2021',
  },
  {
    id: 'cot',
    name: 'Reasoning / chain-of-thought',
    year: '2022–2025',
    adds: 'Externalized intermediate state',
    formal: 'Augmented: linear steps → regular; polynomial → P',
    body: 'CoT (Wei 2022) and inference-time-compute models (o1/o3, DeepSeek-R1, extended thinking) scale test-time computation via RL on reasoning traces — the closest LLMs approach recursive, metalinguistic structure. Mechanistically, externalizing intermediate state into the token stream genuinely augments power: a TC⁰-per-step model gains regular-language recognition with linear decoding steps, P with polynomial.',
    analogy: 'But the faithfulness literature undercuts a literal reading: CoT can be post-hoc rationalization (Turpin 2023 — biasing the answer changes behavior while the trace never mentions the bias). Chen et al. (2025) find reasoning models verbalize a used hint as little as 25% (Claude 3.7) or 39% (R1) of the time. The unresolved question is exactly the Human pillar\'s recursion debate: genuine recursive computation, or learned imitation of the surface form of reasoning?',
    analogyVerdict: 'rich',
    refs: 'Wei 2022; Turpin 2023; Chen et al. 2025',
  },
  {
    id: 'world',
    name: 'World models',
    year: '2023–2024',
    adds: 'Induced latent structure (contested)',
    formal: '— (representational question)',
    body: 'The affirmative case: Othello-GPT carries a causally-manipulable board representation (Li 2023; Nanda 2023 made it a linear "my/their" parity). The negative case: Vafa et al. (2024) show transformers with near-perfect next-token accuracy on NYC taxi routes harbor incoherent maps — impossible street orientations, flyovers — that collapse from ~100% to 67% route-planning when just 1% of streets close.',
    analogy: 'The sharp form of the grounding question: the bee dance encodes genuine, coherent displaced spatial reference — a real vector to a real food source. The navigation transformer encodes a statistically adequate but globally incoherent surrogate ("bags of heuristics"). Real-but-fragile, and contested.',
    analogyVerdict: 'rich',
    refs: 'Li 2023; Nanda 2023; Vafa 2024',
  },
]

const VERDICT_LABEL: Record<Arch['analogyVerdict'], string> = {
  identity: 'cross-pillar identity',
  rich: 'rich analogy',
  resisted: 'analogy resisted',
}

export function LlmArchitectures() {
  const [active, setActive] = useState('ngram')
  const a = ARCHS.find(x => x.id === active)!

  return (
    <div className="llm-section">
      <p className="llm-eyebrow">Pillar VIII · Machine Language</p>
      <h1 className="llm-title">Architecture Tour</h1>
      <p className="llm-lede">
        The lineage from n-grams to reasoning models is a tour through the comparative questions of the
        whole series — sometimes a clean identity with an animal pillar, sometimes a rich analogy,
        sometimes an analogy that must be actively resisted. Walk it in order.
      </p>

      {/* Timeline rail */}
      <div className="llm-arch-rail">
        {ARCHS.map((x, i) => (
          <button
            key={x.id}
            className={`llm-arch-stop${active === x.id ? ' active' : ''}`}
            onClick={() => setActive(x.id)}
          >
            <span className="llm-arch-dot" />
            <span className="llm-arch-stop-name">{x.name}</span>
            <span className="llm-arch-stop-year">{x.year}</span>
            {i < ARCHS.length - 1 && <span className="llm-arch-connector" />}
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="llm-arch-detail">
        <div className="llm-arch-detail-head">
          <h2 className="llm-arch-detail-name">{a.name}</h2>
          <span className="llm-arch-detail-year">{a.year}</span>
        </div>
        <div className="llm-arch-chips">
          <span className="llm-arch-chip">
            <span className="llm-arch-chip-k">adds</span>
            <span className="llm-arch-chip-v">{a.adds}</span>
          </span>
          <span className="llm-arch-chip">
            <span className="llm-arch-chip-k">formal class</span>
            <span className="llm-arch-chip-v">{a.formal}</span>
          </span>
        </div>
        <p className="llm-arch-body">{a.body}</p>
        <div className={`llm-arch-analogy verdict-${a.analogyVerdict}`}>
          <span className="llm-arch-analogy-label">{VERDICT_LABEL[a.analogyVerdict]}</span>
          <span className="llm-arch-analogy-text">{a.analogy}</span>
        </div>
        <div className="llm-arch-refs">{a.refs}</div>
      </div>

      <div className="llm-callout">
        <div>
          <strong>Reading the lineage:</strong> the architecture that won — the transformer — is formally
          below the systems it out-models, gains its real power from <em>scale</em> and <em>externalized
          computation</em> rather than higher expressivity, and acquires its cooperative "voice" from a
          fine-tuning layer bolted on after the fact. Every capability that looks most language-like
          (pragmatics, reasoning, world-models) is the most contested, the most engineered, or the least
          faithful as a window onto internal process.
        </div>
      </div>
    </div>
  )
}
