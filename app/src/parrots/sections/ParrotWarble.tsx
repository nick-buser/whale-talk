import { useState } from 'react'

// ── Markov order visualisation data ──────────────────────────────────────────

// Simulated transition probability matrices for order-1 vs order-5 Markov
// on 6 element categories (A–F), illustrating how higher order = more structure.
// Not empirical — illustrative of the concept.

const ELEMENTS = ['A', 'B', 'C', 'D', 'E', 'F'] as const
type Element = typeof ELEMENTS[number]

// Order-1: relatively flat transitions from each state
const ORDER1: Record<Element, Record<Element, number>> = {
  A: { A:0.05, B:0.30, C:0.25, D:0.20, E:0.12, F:0.08 },
  B: { A:0.20, B:0.05, C:0.30, D:0.18, E:0.15, F:0.12 },
  C: { A:0.12, B:0.25, C:0.04, D:0.35, E:0.14, F:0.10 },
  D: { A:0.18, B:0.10, C:0.22, D:0.06, E:0.28, F:0.16 },
  E: { A:0.22, B:0.18, C:0.08, D:0.20, E:0.05, F:0.27 },
  F: { A:0.28, B:0.14, C:0.16, D:0.12, E:0.24, F:0.06 },
}

// Order-5: strongly peaked — knowing previous 5 elements predicts next much more
const ORDER5: Record<Element, Record<Element, number>> = {
  A: { A:0.02, B:0.72, C:0.10, D:0.08, E:0.05, F:0.03 },
  B: { A:0.06, B:0.02, C:0.78, D:0.06, E:0.05, F:0.03 },
  C: { A:0.04, B:0.08, C:0.03, D:0.76, E:0.05, F:0.04 },
  D: { A:0.05, B:0.04, C:0.07, D:0.03, E:0.73, F:0.08 },
  E: { A:0.07, B:0.05, C:0.04, D:0.06, E:0.02, F:0.76 },
  F: { A:0.74, B:0.06, C:0.05, D:0.05, E:0.07, F:0.03 },
}

const EL_COLOR: Record<Element, string> = {
  A: '#8ae04a', B: '#ffb472', C: '#7da6ff',
  D: '#4afdc6', E: '#ff6b54', F: '#b57bee',
}

// ── Chomsky hierarchy rows ────────────────────────────────────────────────────

interface HierarchyRow {
  level: string
  class: string
  automaton: string
  example: string
  animalsEntry: string
  isBlank?: boolean
  color?: string
}

const HIERARCHY: HierarchyRow[] = [
  {
    level: 'Type 0',
    class: 'Recursively enumerable',
    automaton: 'Turing machine',
    example: 'Arithmetic, chess',
    animalsEntry: '—',
  },
  {
    level: 'Type 1',
    class: 'Context-sensitive',
    automaton: 'Linear-bounded automaton',
    example: 'Cross-serial dependencies',
    animalsEntry: 'Human language (arguably)',
  },
  {
    level: 'Type 2',
    class: 'Context-free',
    automaton: 'Pushdown automaton',
    example: 'Center-embedding',
    animalsEntry: 'Tested: primates fail (Fitch & Hauser 2004)',
  },
  {
    level: 'Type 3',
    class: 'Regular (finite-state)',
    automaton: 'Finite-state automaton',
    example: 'Syllable sequences',
    animalsEntry: 'Bengalese finch ✓ (Berwick et al. 2011)',
    color: '#ffb472',
  },
  {
    level: 'Subregular',
    class: 'SL / SP / TSL',
    automaton: 'Memory-bounded FSA',
    example: 'Phonological patterns',
    animalsEntry: 'Songbirds (Heinz & Idsardi 2013)',
    color: '#ffb472',
  },
  {
    level: 'Parrot warble',
    class: '≥ 5th-order Markov',
    automaton: '?',
    example: 'Budgerigar warble (42 classes)',
    animalsEntry: '? — never classified',
    isBlank: true,
    color: '#8ae04a',
  },
]

// ── Key results data ──────────────────────────────────────────────────────────

interface WarbleResult {
  id: string
  year: string
  authors: string
  finding: string
  implication: string
  color: string
}

const RESULTS: WarbleResult[] = [
  {
    id: 'farabaugh',
    year: '1992',
    authors: 'Farabaugh, Brown & Dooling',
    finding: '42 distinct syllable classes in budgerigar warble; classes are shared within social groups and diverge between groups, forming dialects.',
    implication: 'Warble has a sizeable vocabulary of repeatable acoustic units — comparable to oscine syllable repertoires.',
    color: '#8ae04a',
  },
  {
    id: 'tu',
    year: '2011',
    authors: 'Tu, Osmanski & Dooling',
    finding: '8 perceptual/acoustic element categories; the best-fit transition model is a 5th-order Markov chain — the probability of each element depends on the previous five.',
    implication: 'A 5th-order dependency window suggests a motor-planning span of ~5 elements. It is above what 1st–2nd order can capture, consistent with what psychoacoustics call the "magic number" window (4–7 elements).',
    color: '#ffb472',
  },
  {
    id: 'madabhushi',
    year: '2023',
    authors: 'Madabhushi et al.',
    finding: 'Colony-specific higher-order repetitive motifs in warble; when two colonies are merged, their warble syntax converges over weeks — a sequence-level analogue of contact-call convergence.',
    implication: 'Warble syntax is culturally transmitted and plastic — not just a fixed individual motor pattern.',
    color: '#7da6ff',
  },
  {
    id: 'dahlin',
    year: '2026',
    authors: 'Dahlin et al.',
    finding: 'Yellow-naped Amazon duets decode into 36 call types organised by more than 20 "syntactic rules" — structured turn-taking with rule-governed sequencing.',
    implication: 'Rule-governed sequence structure extends to duet communication across at least one wild parrot species.',
    color: '#4afdc6',
  },
  {
    id: 'vander',
    year: '2025',
    authors: 'van der Aa, Koliander, Fitch & Hoeschele',
    finding: 'Budgerigar warble shows isochronous (music-like, beat-regular) rhythmic patterning.',
    implication: 'Rhythmic structure is a further organisational layer on top of Markov sequence structure.',
    color: '#b57bee',
  },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function ParrotWarble() {
  const [markovOrder, setMarkovOrder] = useState<1 | 5>(1)
  const [fromEl, setFromEl] = useState<Element>('A')
  const [selectedResult, setSelectedResult] = useState<string>('tu')

  const matrix = markovOrder === 1 ? ORDER1 : ORDER5
  const probs = matrix[fromEl]
  const maxP = Math.max(...Object.values(probs))

  const selResult = RESULTS.find(r => r.id === selectedResult)!

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--parrot)', marginBottom: 8 }}>
          Parrots · Warble
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          The Formal Gap
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Budgerigar warble is at least 5th-order Markovian with 42 syllable classes and
          rule-governed sequencing. Yet no study has placed it in the Chomsky hierarchy — the
          most conspicuous gap in formal analysis of non-human vocal sequences.
        </p>

        {/* Markov order demo */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '0 0 16px' }}>
          What "5th-order Markov" means
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 24 }}>
          In a 1st-order Markov process, the next element depends only on the current one.
          In a 5th-order process, the next element depends on the previous five.
          Compare the transition probability distributions below: at order 1, transitions are
          relatively flat; at order 5, one transition strongly dominates — the sequence has
          much tighter structure.
        </p>

        <div className="parrot-warble-demo">
          <div className="parrot-warble-controls">
            <div className="parrot-warble-order-tabs">
              {([1, 5] as const).map(o => (
                <button
                  key={o}
                  className={`parrot-warble-order-tab${markovOrder === o ? ' active' : ''}`}
                  onClick={() => setMarkovOrder(o)}
                >
                  Order {o}
                </button>
              ))}
            </div>
            <div className="parrot-warble-el-row">
              <span className="parrot-warble-el-label">Current element:</span>
              {ELEMENTS.map(el => (
                <button
                  key={el}
                  className={`parrot-warble-el-btn${fromEl === el ? ' active' : ''}`}
                  style={{ '--el-color': EL_COLOR[el] } as React.CSSProperties}
                  onClick={() => setFromEl(el)}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>

          <div className="parrot-warble-bars">
            {ELEMENTS.map(el => {
              const p = probs[el]
              const pct = Math.round(p * 100)
              const w = `${(p / maxP) * 100}%`
              return (
                <div key={el} className="parrot-warble-bar-row">
                  <span className="parrot-warble-bar-label" style={{ color: EL_COLOR[el] }}>{el}</span>
                  <div className="parrot-warble-bar-track">
                    <div
                      className="parrot-warble-bar-fill"
                      style={{ width: w, background: EL_COLOR[el] }}
                    />
                  </div>
                  <span className="parrot-warble-bar-pct">{pct}%</span>
                </div>
              )
            })}
          </div>
          <p className="parrot-warble-demo-caption">
            {markovOrder === 1
              ? 'Order 1: transitions from element ' + fromEl + ' are broadly distributed across all successors.'
              : 'Order 5: one transition from element ' + fromEl + ' dominates strongly — the sequence has tight predictive structure.'}
          </p>
        </div>

        {/* Chomsky hierarchy */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 16px' }}>
          Position in the Chomsky Hierarchy
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 24 }}>
          Bengalese finch song is characterised as regular / subregular (Berwick et al. 2011;
          Heinz & Idsardi 2013). Primate call sequences fail the context-free test (Fitch &
          Hauser 2004). Parrot warble has never been assigned a class — the cell is blank.
        </p>

        <div className="parrot-hier-table">
          <div className="parrot-hier-header">
            <span>Level</span>
            <span>Class</span>
            <span>Automaton</span>
            <span>Animal vocal example</span>
          </div>
          {HIERARCHY.map(row => (
            <div
              key={row.level}
              className={`parrot-hier-row${row.isBlank ? ' blank' : ''}`}
              style={row.color ? { '--hier-color': row.color } as React.CSSProperties : undefined}
            >
              <span className="parrot-hier-level">{row.level}</span>
              <span className="parrot-hier-class">{row.class}</span>
              <span className="parrot-hier-auto">{row.automaton}</span>
              <span className={`parrot-hier-animal${row.isBlank ? ' parrot-hier-wanted' : ''}`}>
                {row.animalsEntry}
              </span>
            </div>
          ))}
        </div>

        <div className="bird-intro-callout" style={{ marginTop: 24 }}>
          <p className="bird-intro-callout-label">The frontier</p>
          <p>
            Applying the Berwick / Okanoya / Heinz toolkit to parrot warble — and comparing the
            resulting class to the finite-state characterisation of Bengalese finch — would be
            genuinely novel. The prior expectation (from the 5th-order Markov fit and the
            rule-governed transition structure) is that warble stays within the regular range but
            with longer dependencies than oscine song. If it proved to require context-free power,
            that would be a major finding.
          </p>
        </div>

        {/* Key results timeline */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 16px' }}>
          Key Empirical Results
        </h3>

        <div className="parrot-warble-results">
          <div className="parrot-warble-result-tabs">
            {RESULTS.map(r => (
              <button
                key={r.id}
                className={`parrot-warble-result-tab${selectedResult === r.id ? ' active' : ''}`}
                style={{ '--res-color': r.color } as React.CSSProperties}
                onClick={() => setSelectedResult(r.id)}
              >
                <span className="parrot-warble-result-year">{r.year}</span>
                <span className="parrot-warble-result-auth">{r.authors}</span>
              </button>
            ))}
          </div>
          <div className="parrot-warble-result-panel" style={{ borderLeftColor: selResult.color }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: selResult.color, margin: '0 0 10px' }}>
              {selResult.authors} ({selResult.year})
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg)', lineHeight: 1.7, margin: '0 0 14px' }}>
              <strong>Finding:</strong> {selResult.finding}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
              <strong>Implication:</strong> {selResult.implication}
            </p>
          </div>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '42',  label: 'Syllable classes in budgerigar warble — a large repertoire for a single small bird (Farabaugh 1992)' },
            { val: '5th', label: 'Markov order of best-fit model — the transition depends on the previous five elements (Tu 2011)' },
            { val: '0',   label: 'Published studies assigning parrot vocal sequences a formal-language class in the Chomsky hierarchy' },
          ].map(s => (
            <div key={s.label} className="stat-cell">
              <span className="stat-val" style={{ color: 'var(--parrot)', fontFamily: 'var(--font-display)' }}>
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
