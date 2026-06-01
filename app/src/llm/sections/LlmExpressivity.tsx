import { useState } from 'react'

/* Formal-class ladder — lower index = weaker */
const LADDER = [
  {
    id: 'tc0',
    name: 'TC⁰',
    sub: 'constant-depth threshold circuits',
    system: 'Transformer (fixed, log-precision)',
    note: 'A fixed transformer cannot robustly recognize PARITY or arbitrary-depth Dyck nesting at unbounded length. This is the formal upper bound (Merrill & Sabharwal 2023; Hahn 2020).',
    color: '#5b8dff',
  },
  {
    id: 'regular',
    name: 'Regular / Finite-state',
    sub: 'Type 3 · finite automata, HMMs',
    system: 'n-grams · birdsong',
    note: 'n-gram models are literally Markov chains — the same formal class used to model zebra-finch and Bengalese-finch song. The cleanest cross-pillar identity in the whole series.',
    color: '#ffb472',
  },
  {
    id: 'cf',
    name: 'Context-free',
    sub: 'Type 2 · push-down automata',
    system: 'memory-augmented nets',
    note: 'Only stack/tape-augmented networks generalize to context-free patterns (Delétang et al. 2022). The base transformer does not reach here.',
    color: '#b57bee',
  },
  {
    id: 'mcs',
    name: 'Mildly context-sensitive',
    sub: 'TAG / CCG / LIG — the human keystone',
    system: 'Human language',
    note: 'Human language sits here — far above the transformer\'s formal ceiling. Swiss German cross-serial dependencies (Shieber 1985) put it strictly above context-free.',
    color: '#c9a84c',
  },
]

/* Delétang et al. 2022 — Neural Networks and the Chomsky Hierarchy */
const DELETANG = [
  { task: 'Regular (e.g. PARITY)',     transformer: 'fail', lstm: 'solve', memory: 'solve' },
  { task: 'Counter (e.g. Dyck-1)',     transformer: 'fail', lstm: 'solve', memory: 'solve' },
  { task: 'Context-free (e.g. Dyck-2)', transformer: 'fail', lstm: 'fail',  memory: 'solve' },
  { task: 'Context-sensitive',          transformer: 'fail', lstm: 'fail',  memory: 'partial' },
]

export function LlmExpressivity() {
  const [bits, setBits] = useState<number[]>([1, 0, 1, 1, 0])
  const [activeRung, setActiveRung] = useState('tc0')

  const parity = bits.reduce((a, b) => a + b, 0) % 2
  const rung = LADDER.find(r => r.id === activeRung)!

  function toggleBit(i: number) {
    setBits(prev => prev.map((b, j) => (j === i ? (b ? 0 : 1) : b)))
  }
  function addBit() { if (bits.length < 12) setBits(prev => [...prev, 0]) }
  function removeBit() { if (bits.length > 1) setBits(prev => prev.slice(0, -1)) }

  return (
    <div className="llm-section">
      <p className="llm-eyebrow">Pillar VIII · Machine Language</p>
      <h1 className="llm-title">The TC⁰ Irony</h1>
      <p className="llm-lede">
        Here is the deepest irony in the entire comparison. The transformer is formally{' '}
        <em>weaker</em> than birdsong — it sits in the circuit class TC⁰, below the regular languages —
        yet it models <em>mildly context-sensitive</em> human language better than any system ever built.
        How can something below finite-state capture something above context-free?
      </p>

      {/* The ladder */}
      <h2 className="llm-h2">The Formal Ladder</h2>
      <p className="llm-sub">
        Weakest at the bottom. Note the inversion: the transformer sits <em>below</em> the systems it
        out-models. Click a rung.
      </p>
      <div className="llm-ladder">
        {[...LADDER].reverse().map((r, idx, arr) => (
          <div key={r.id}>
            <button
              className={`llm-rung${activeRung === r.id ? ' active' : ''}`}
              style={{
                borderColor: r.color,
                ...(activeRung === r.id ? { background: `color-mix(in oklch, ${r.color} 14%, var(--bg-raised))` } : {}),
              }}
              onClick={() => setActiveRung(r.id)}
            >
              <span className="llm-rung-name" style={{ color: r.color }}>{r.name}</span>
              <span className="llm-rung-sub">{r.sub}</span>
              <span className="llm-rung-system">{r.system}</span>
            </button>
            {idx < arr.length - 1 && <div className="llm-rung-gap">⊃</div>}
          </div>
        ))}
      </div>
      <div className="llm-rung-note" style={{ borderColor: rung.color }}>
        <span className="llm-rung-note-label" style={{ color: rung.color }}>{rung.name} — {rung.system}</span>
        {rung.note}
      </div>

      {/* PARITY demo */}
      <h2 className="llm-h2">Why PARITY Defeats a Fixed Transformer</h2>
      <p className="llm-sub">
        PARITY just asks: is the number of 1s odd or even? A two-state machine solves it trivially for
        any length. A fixed transformer cannot — there is no constant-depth threshold circuit that
        tracks an unbounded running parity. Toggle the bits.
      </p>
      <div className="llm-parity">
        <div className="llm-parity-bits">
          {bits.map((b, i) => (
            <button
              key={i}
              className={`llm-bit${b ? ' on' : ''}`}
              onClick={() => toggleBit(i)}
              aria-label={`bit ${i}, value ${b}`}
            >
              {b}
            </button>
          ))}
          <div className="llm-parity-len-ctrls">
            <button className="llm-len-btn" onClick={removeBit} aria-label="remove bit">−</button>
            <button className="llm-len-btn" onClick={addBit} aria-label="add bit">+</button>
          </div>
        </div>
        <div className="llm-parity-out">
          <div className="llm-parity-count">
            count of 1s = <strong>{bits.reduce((a, b) => a + b, 0)}</strong>
          </div>
          <div className={`llm-parity-result ${parity ? 'odd' : 'even'}`}>
            PARITY = {parity ? 'ODD (1)' : 'EVEN (0)'}
          </div>
        </div>
        <div className="llm-parity-lesson">
          <span className="llm-parity-lesson-label">The lesson</span>
          A finite automaton flips a single state bit on every 1 — it never grows. A transformer must
          aggregate all positions in parallel at constant depth, and no such circuit exists for unbounded
          length. So it can memorize PARITY for lengths seen in training, then <em>fail to generalize</em>{' '}
          to length {bits.length + 1}. Next-token competence over a finite window ≠ formal recognition of
          the unbounded language.
        </div>
      </div>

      {/* The resolution */}
      <div className="llm-resolve">
        <h3 className="llm-resolve-title">So how does it model human language at all?</h3>
        <p className="llm-resolve-body">
          With enough parameters and data, a TC⁰ circuit can <em>approximate the conditional next-token
          distribution</em> of a mildly-context-sensitive source to arbitrary fidelity <em>within the
          training horizon</em> — while failing the length-generalization and exact-recognition tests that
          define the formal class. It captures the statistics without recognizing the language. And{' '}
          chain-of-thought changes the picture: by externalizing intermediate state into the token stream,
          a linear number of decoding steps lets the model recognize all regular languages, and polynomial
          steps reach <strong>P</strong> — genuine added power, explored in the Architectures section.
        </p>
      </div>

      {/* Delétang empirical table */}
      <h2 className="llm-h2">Empirical: Neural Nets vs. the Chomsky Hierarchy</h2>
      <p className="llm-sub">
        Delétang et al. 2022 — ~20,000 models, 15+ tasks. What each architecture can actually
        length-generalize on.
      </p>
      <div className="llm-deletang">
        <div className="llm-deletang-head">
          <span>Task class</span>
          <span>Transformer</span>
          <span>LSTM</span>
          <span>Memory-aug.</span>
        </div>
        {DELETANG.map(row => (
          <div key={row.task} className="llm-deletang-row">
            <span className="llm-deletang-task">{row.task}</span>
            {([row.transformer, row.lstm, row.memory] as const).map((v, i) => (
              <span key={i} className={`llm-deletang-cell ${v}`}>
                {v === 'solve' ? '✓ solves' : v === 'partial' ? '~ partial' : '✗ fails'}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="llm-caption-note">
        Striking detail: the transformer fails to length-generalize even on <em>regular</em> tasks the
        humble LSTM solves. The architecture that won is not the one highest on the hierarchy.
      </p>

      <div className="llm-callout">
        <div>
          <strong>Caveat — formal results carry assumptions.</strong> The TC⁰ bounds depend on precision
          and attention assumptions (log-precision, hard/average-hard attention, uniformity). Real models
          use finite precision and chain-of-thought, which change the picture, and the Chomsky hierarchy
          "does not precisely capture how difficult a language is for a transformer to learn" (Strobl et
          al. 2024). The irony is real, but it is an irony about <em>idealized</em> expressivity, not a
          claim that scale buys nothing.
        </div>
      </div>
    </div>
  )
}
