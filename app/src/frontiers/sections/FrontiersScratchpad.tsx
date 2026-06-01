import { useState } from 'react'

/* Formal power as a function of how many chain-of-thought steps the model is allowed.
   Merrill & Sabharwal 2024, "The Expressive Power of Transformers with Chain of Thought". */
const STEP_LADDER = [
  {
    id: 'none',
    budget: '0 steps',
    label: 'One forward pass',
    klass: 'TC⁰',
    note: 'No intermediate tokens. The model must answer in a single parallel sweep at constant depth. PARITY and unbounded Dyck nesting are out of reach — the formal ceiling from the previous tab.',
  },
  {
    id: 'log',
    budget: '~log n steps',
    label: 'A short scratchpad',
    klass: 'still ≈ TC⁰ / L',
    note: 'A logarithmic number of decoding steps adds little — roughly log-space. Helpful in practice, but not yet a class change.',
  },
  {
    id: 'linear',
    budget: '~n steps',
    label: 'Think once per symbol',
    klass: 'all regular languages',
    note: 'A linear number of steps is enough to recognize every regular language — PARITY included. The model writes its running state into the stream and reads it back. This is the escape hatch.',
  },
  {
    id: 'poly',
    budget: 'poly(n) steps',
    label: 'A long deliberation',
    klass: 'P',
    note: 'A polynomial number of steps reaches all of P — every problem with an efficient algorithm. With unbounded intermediate memory, decoder-only transformers are Turing-complete (Pérez et al. 2021).',
  },
]

interface Step {
  i: number
  bit: number
  before: number
  after: number
}

function buildSteps(bits: number[]): Step[] {
  let running = 0
  return bits.map((bit, i) => {
    const before = running
    running = running ^ bit
    return { i, bit, before, after: running }
  })
}

export function FrontiersScratchpad() {
  const [bits, setBits] = useState<number[]>([1, 0, 1, 1, 0, 1])
  const [scratchpad, setScratchpad] = useState(false)
  const [revealed, setRevealed] = useState(0)
  const [activeLadder, setActiveLadder] = useState('linear')

  const steps = buildSteps(bits)
  const finalParity = steps.length ? steps[steps.length - 1].after : 0
  const ladder = STEP_LADDER.find(l => l.id === activeLadder)!

  function toggleBit(i: number) {
    setBits(prev => prev.map((b, j) => (j === i ? (b ? 0 : 1) : b)))
    setRevealed(0)
  }
  function addBit() { if (bits.length < 10) { setBits(prev => [...prev, 0]); setRevealed(0) } }
  function removeBit() { if (bits.length > 1) { setBits(prev => prev.slice(0, -1)); setRevealed(0) } }
  function enableScratchpad() { setScratchpad(true); setRevealed(0) }
  function step() { setRevealed(r => Math.min(r + 1, steps.length)) }
  function runAll() { setRevealed(steps.length) }
  function reset() { setRevealed(0) }

  return (
    <div className="fr-section">
      <p className="fr-eyebrow">Coda · Open Frontiers</p>
      <h1 className="fr-title">The Scratchpad Escape</h1>
      <p className="fr-lede">
        The previous tab left you with a paradox: a fixed transformer cannot compute PARITY, yet it models
        human language superbly. The resolution is almost cheeky. Let the model <em>think out loud</em> —
        write intermediate work into its own context — and the formal ceiling lifts. The weakness was never
        the architecture. It was the demand to answer in a single breath.
      </p>

      {/* The interactive PARITY machine */}
      <h2 className="fr-h2">Watch the ceiling lift</h2>
      <p className="fr-sub">
        Same task as before: is the number of 1s odd or even? Toggle the bits, then choose how the model is
        allowed to answer.
      </p>

      <div className="fr-pad">
        <div className="fr-pad-bits">
          {bits.map((b, i) => (
            <button
              key={i}
              className={`fr-bit${b ? ' on' : ''}${scratchpad && i < revealed ? ' done' : ''}`}
              onClick={() => toggleBit(i)}
              aria-label={`bit ${i}, value ${b}`}
            >
              {b}
            </button>
          ))}
          <div className="fr-pad-len">
            <button className="fr-len-btn" onClick={removeBit} aria-label="remove bit">−</button>
            <button className="fr-len-btn" onClick={addBit} aria-label="add bit">+</button>
          </div>
        </div>

        <div className="fr-pad-modes">
          <button
            className={`fr-mode${!scratchpad ? ' active' : ''}`}
            onClick={() => { setScratchpad(false); setRevealed(0) }}
          >
            <span className="fr-mode-name">One shot</span>
            <span className="fr-mode-sub">no scratchpad · TC⁰</span>
          </button>
          <button
            className={`fr-mode${scratchpad ? ' active' : ''}`}
            onClick={enableScratchpad}
          >
            <span className="fr-mode-name">Think out loud</span>
            <span className="fr-mode-sub">chain-of-thought · regular</span>
          </button>
        </div>

        {!scratchpad ? (
          <div className="fr-pad-oneshot">
            <div className="fr-oneshot-attempt">
              <span className="fr-oneshot-q">PARITY = ?</span>
              <span className="fr-oneshot-guess">memorized · fails to generalize ↗</span>
            </div>
            <p className="fr-pad-explain">
              In a single pass the model must aggregate every position in parallel at constant depth. No such
              circuit tracks an unbounded running parity, so it can only <em>memorize</em> answers for lengths
              seen in training — and stumble at length {bits.length + 1}. The true answer is{' '}
              <strong>{finalParity ? 'ODD' : 'EVEN'}</strong>, but the architecture has no reliable way to
              reach it for arbitrary length. <em>Switch to “think out loud.”</em>
            </p>
          </div>
        ) : (
          <div className="fr-pad-cot">
            <div className="fr-cot-controls">
              <button className="fr-cot-btn" onClick={step} disabled={revealed >= steps.length}>Step ▸</button>
              <button className="fr-cot-btn" onClick={runAll} disabled={revealed >= steps.length}>Run all ▸▸</button>
              <button className="fr-cot-btn ghost" onClick={reset} disabled={revealed === 0}>Reset</button>
              <span className="fr-cot-progress">{revealed} / {steps.length} tokens written</span>
            </div>

            <div className="fr-cot-tape">
              {steps.map((s, idx) => {
                const shown = idx < revealed
                return (
                  <div key={idx} className={`fr-cot-step${shown ? ' shown' : ''}`}>
                    <span className="fr-cot-step-i">t{idx + 1}</span>
                    <span className="fr-cot-step-expr">
                      {shown ? (
                        <>parity({s.before}) ⊕ bit({s.bit}) = <strong>{s.after}</strong></>
                      ) : (
                        <span className="fr-cot-pending">·····</span>
                      )}
                    </span>
                    <span className={`fr-cot-step-state${shown ? (s.after ? ' odd' : ' even') : ''}`}>
                      {shown ? (s.after ? 'odd' : 'even') : ''}
                    </span>
                  </div>
                )
              })}
            </div>

            {revealed >= steps.length && (
              <div className={`fr-cot-final ${finalParity ? 'odd' : 'even'}`}>
                <span className="fr-cot-final-label">PARITY</span>
                <span className="fr-cot-final-val">{finalParity ? 'ODD (1)' : 'EVEN (0)'}</span>
                <span className="fr-cot-final-note">— exact, for any length</span>
              </div>
            )}

            <p className="fr-pad-explain">
              Each written token is a single, shallow, <em>local</em> operation — one XOR — well within a
              transformer’s reach. By carrying the running state forward in its own context, the model never
              needs unbounded <em>depth</em>; it needs unbounded <em>length</em>, which it has. The
              constant-depth wall is gone the moment intermediate state becomes text.
            </p>
          </div>
        )}
      </div>

      {/* Formal ladder of step budgets */}
      <h2 className="fr-h2">How much power does thinking buy?</h2>
      <p className="fr-sub">
        Expressivity scales with the length of the scratchpad. Click a budget.
      </p>
      <div className="fr-budget-row">
        {STEP_LADDER.map(l => (
          <button
            key={l.id}
            className={`fr-budget${activeLadder === l.id ? ' active' : ''}`}
            onClick={() => setActiveLadder(l.id)}
          >
            <span className="fr-budget-amt">{l.budget}</span>
            <span className="fr-budget-label">{l.label}</span>
            <span className="fr-budget-klass">{l.klass}</span>
          </button>
        ))}
      </div>
      <div className="fr-budget-note">
        <span className="fr-budget-note-klass">{ladder.budget} → {ladder.klass}</span>
        {ladder.note}
      </div>

      <div className="fr-callout">
        <strong>What this does and does not rescue.</strong> Chain-of-thought genuinely changes the formal
        class — the TC⁰ ceiling describes the single-pass model, not the model that reasons. But it buys
        <em> serial computation</em>, not grounding or systematic generalization for free: longer scratchpads
        also accumulate error, and the gains depend on the model actually using the steps faithfully rather
        than rationalizing an answer it already guessed. The irony from the last tab is real — and narrower
        than its slogan.
      </div>
    </div>
  )
}
