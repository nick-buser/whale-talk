import { useState } from 'react'

const ADJECTIVES = ['big', 'small', 'sleeping', 'hungry']
const NOUNS = ['whale', 'bird', 'bee', 'elephant']
const VERBS = ['saw', 'heard', 'followed', 'avoided']

const PRIMATE_CALLS = [
  {
    system: 'Vervet alarms',
    calls: ['krak (eagle)', 'bark (leopard)', 'chutter (snake)'],
    test: 'krak + bark = ?',
    result: 'Not observed. Calls are holistic — no combination produces "eagle AND leopard." Semantic content is fixed per call.',
    hasCompositionality: false,
  },
  {
    system: "Campbell's monkey",
    calls: ['krak (predator)', 'krak-oo (aerial predator)', 'boom (non-predator)'],
    test: 'boom + krak-oo = ?',
    result: 'pyow-hack sequence exists as an idiom but its meaning (leopard nearby) is not derivable from constituent meanings — it must be learned as a unit. Schlenker et al. 2016.',
    hasCompositionality: false,
  },
  {
    system: 'Titi monkey (Berthet et al. 2019)',
    calls: ['A-call (raptor context)', 'B-call (calm / cat context)', 'A→B sequence', 'B→A sequence'],
    test: 'A + B = raptor + ground? B + A = cat + ground?',
    result: 'Sequences encode predator × location conjunctively — closer to additivity than composition. The meaning of A→B ≠ f(meaning(A), meaning(B), structure); location information comes from ordering, not compositional syntax.',
    hasCompositionality: false,
  },
]

export function HumanCompositionality() {
  const [det, setDet] = useState('the')
  const [adj, setAdj] = useState('big')
  const [noun1, setNoun1] = useState('whale')
  const [verb, setVerb] = useState('saw')
  const [adj2, setAdj2] = useState('small')
  const [noun2, setNoun2] = useState('bird')
  const [activeCall, setActiveCall] = useState(0)

  const sentence = `${det} ${adj} ${noun1} ${verb} the ${adj2} ${noun2}`

  function getSentenceMeaning() {
    const subj = `${det === 'the' ? 'a specific' : 'some'} ${adj} ${noun1}`
    const obj = `a ${adj2} ${noun2}`
    return `There exists an event of ${verb}-ing in which ${subj} is the agent and ${obj} is the theme.`
  }

  return (
    <div className="human-section">
      <p className="human-eyebrow">Human Language</p>
      <h1 className="human-title">Compositional Semantics</h1>
      <p className="human-lede">
        Frege's principle: the meaning of a complex expression is determined by the meanings
        of its parts and the way they are combined. This is the keystone feature — what
        no other communication system in this series robustly exhibits.
      </p>

      {/* Interactive sentence builder */}
      <div className="comp-builder">
        <h2 className="human-h2">Build a Sentence</h2>
        <p className="human-sub">
          Every combination you create is immediately interpretable — even sentences no one
          has ever uttered before. That is compositionality.
        </p>
        <div className="comp-controls">
          <label className="comp-ctl">
            <span className="comp-ctl-label">Determiner</span>
            <select value={det} onChange={e => setDet(e.target.value)} className="comp-select">
              {['the', 'a', 'every', 'some', 'no'].map(d => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label className="comp-ctl">
            <span className="comp-ctl-label">Adjective</span>
            <select value={adj} onChange={e => setAdj(e.target.value)} className="comp-select">
              {ADJECTIVES.map(a => <option key={a}>{a}</option>)}
            </select>
          </label>
          <label className="comp-ctl">
            <span className="comp-ctl-label">Noun</span>
            <select value={noun1} onChange={e => setNoun1(e.target.value)} className="comp-select">
              {NOUNS.map(n => <option key={n}>{n}</option>)}
            </select>
          </label>
          <label className="comp-ctl">
            <span className="comp-ctl-label">Verb</span>
            <select value={verb} onChange={e => setVerb(e.target.value)} className="comp-select">
              {VERBS.map(v => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="comp-ctl">
            <span className="comp-ctl-label">Adjective</span>
            <select value={adj2} onChange={e => setAdj2(e.target.value)} className="comp-select">
              {ADJECTIVES.map(a => <option key={a}>{a}</option>)}
            </select>
          </label>
          <label className="comp-ctl">
            <span className="comp-ctl-label">Noun</span>
            <select value={noun2} onChange={e => setNoun2(e.target.value)} className="comp-select">
              {NOUNS.map(n => <option key={n}>{n}</option>)}
            </select>
          </label>
        </div>

        <div className="comp-result">
          <div className="comp-sentence">"{sentence}"</div>
          <div className="comp-tree">
            <div className="comp-tree-node root">S</div>
            <div className="comp-tree-row">
              <div className="comp-tree-node np">NP</div>
              <div className="comp-tree-node vp">VP</div>
            </div>
            <div className="comp-tree-row">
              <div className="comp-tree-node leaf">{det}</div>
              <div className="comp-tree-node leaf">{adj}</div>
              <div className="comp-tree-node leaf">{noun1}</div>
              <div className="comp-tree-node leaf">{verb}</div>
              <div className="comp-tree-node np">NP</div>
            </div>
            <div className="comp-tree-row">
              <div className="comp-tree-node leaf comp-gap" />
              <div className="comp-tree-node leaf comp-gap" />
              <div className="comp-tree-node leaf comp-gap" />
              <div className="comp-tree-node leaf comp-gap" />
              <div className="comp-tree-node leaf">the</div>
              <div className="comp-tree-node leaf">{adj2}</div>
              <div className="comp-tree-node leaf">{noun2}</div>
            </div>
          </div>
          <div className="comp-meaning">
            <span className="comp-meaning-label">Logical form (approx.):</span>
            <span className="comp-meaning-text">{getSentenceMeaning()}</span>
          </div>
        </div>
      </div>

      {/* Why animals fail */}
      <h2 className="human-h2">Why Animal Systems Fall Short</h2>
      <div className="comp-call-tabs">
        {PRIMATE_CALLS.map((c, i) => (
          <button
            key={c.system}
            className={`comp-call-tab${activeCall === i ? ' active' : ''}`}
            onClick={() => setActiveCall(i)}
          >
            {c.system}
          </button>
        ))}
      </div>
      <div className="comp-call-detail">
        <div className="comp-call-header">
          <span className="comp-call-name">{PRIMATE_CALLS[activeCall].system}</span>
          <span className={`comp-call-verdict ${PRIMATE_CALLS[activeCall].hasCompositionality ? 'yes' : 'no'}`}>
            {PRIMATE_CALLS[activeCall].hasCompositionality ? 'Compositional' : 'Not compositional'}
          </span>
        </div>
        <div className="comp-call-inventory">
          <span className="comp-detail-label">Call inventory:</span>
          <div className="comp-call-tags">
            {PRIMATE_CALLS[activeCall].calls.map(c => (
              <span key={c} className="comp-call-tag">{c}</span>
            ))}
          </div>
        </div>
        <div className="comp-call-test">
          <span className="comp-detail-label">Compositionality test:</span>
          <code className="comp-test-eq">{PRIMATE_CALLS[activeCall].test}</code>
        </div>
        <p className="comp-call-result">{PRIMATE_CALLS[activeCall].result}</p>
      </div>

      <div className="human-callout">
        <div>
          <strong>What compositionality is NOT:</strong> Sequence structure (like titi A→B)
          or affix-like modification (like krak-oo) are evidence of some combinatorial
          structure — but composition requires that meaning is a <em>function</em> of
          sub-meanings plus syntactic structure, recursively. A fixed two-call idiom with
          a learned holistic meaning is not compositional; it is a large vocabulary item.
          The 10,000 sentences you understand today that you have never heard before require
          compositionality. Primate systems lack this generativity.
        </div>
      </div>
    </div>
  )
}
