import { useState } from 'react'

type Pole = 'bender' | 'harnad' | 'mollo' | 'piantadosi'

interface Position {
  id: Pole
  thinker: string
  work: string
  pole: 'skeptical' | 'grounding' | 'bridge' | 'anti-skeptical'
  claim: string
  body: string
  animalMirror: string
  color: string
}

const POSITIONS: Position[] = [
  {
    id: 'bender',
    thinker: 'Bender & Koller (2020)',
    work: '"Climbing towards NLU"; "Stochastic Parrots" (2021)',
    pole: 'skeptical',
    claim: 'A system trained only on form has a priori no way to learn meaning.',
    body: 'The argument is a priori, not empirical. The octopus thought experiment: an octopus eavesdrops only on the form of two islanders\' telegraph traffic. It can learn to continue conversations plausibly, but when one islander faces a real emergency — needing to build a weapon from coconuts — the octopus, having never connected form to a referential world, cannot help. Communicative intent and grounding in a referential world are constitutive of meaning; form-only learners are necessarily parasitic, "haphazardly stitching together sequences of linguistic forms … without any reference to meaning."',
    animalMirror: 'This is the artificial restatement of the deflationary reading of animal signals — the claim that a vervet alarm "means" nothing in itself, that meaning is supplied entirely by receiver inference and evolutionary calibration.',
    color: '#ff6b54',
  },
  {
    id: 'harnad',
    thinker: 'Harnad (1990)',
    work: '"The Symbol Grounding Problem", Physica D',
    pole: 'grounding',
    claim: 'How could symbol-internal manipulation ever acquire intrinsic, rather than parasitic, meaning?',
    body: 'The classic statement of the problem. Manipulating symbols by their shapes (syntax) can never, on its own, give those symbols meaning — like trying to learn Chinese from a Chinese-only dictionary, an endless circle of symbol-to-symbol definitions never touching the world. Meaning requires grounding the symbols in something non-symbolic: sensorimotor experience of the things the symbols are about. The problem that every form-only system must answer.',
    animalMirror: 'The bee waggle dance "grounds" its symbols directly — the dance vector is causally connected to a real bearing and distance the bee flew. That is grounding the LLM does not have for "Paris" or "north."',
    color: '#ffb472',
  },
  {
    id: 'mollo',
    thinker: 'Mollo & Millière (2023)',
    work: '"The Vector Grounding Problem", arXiv:2304.01481',
    pole: 'bridge',
    claim: 'Referential grounding can be conferred by a history of selection — and RLHF may supply exactly that.',
    body: 'Updates Harnad for sub-symbolic systems computing over vectors. Distinguishes five notions of grounding (referential, sensorimotor, relational, communicative, epistemic) and argues only referential grounding is the one that matters. Their move is teleosemantic: internal states acquire the function of carrying world-information through a history of selection — and RLHF is precisely such a selection process, shaping the model to produce world-tracking outputs. A striking implication: multimodality and embodiment are neither necessary nor sufficient for grounding, since grounding is a matter of selection-conferred function, not sensory channel count.',
    animalMirror: 'Teleosemantics is exactly how a deflationist rescues animal reference: the vervet eagle-call "refers" because it was selected to covary with eagles. If that grounds the call, RLHF might ground the model the same way.',
    color: '#5b8dff',
  },
  {
    id: 'piantadosi',
    thinker: 'Piantadosi & Hill (2022)',
    work: '"Meaning without reference in LLMs", arXiv:2208.02957',
    pole: 'anti-skeptical',
    claim: 'Meaning consists in relationships between internal representational states — not world-reference.',
    body: 'Adopts conceptual-role / inferential-role semantics: the meaning of a concept is its web of inferential relations to other concepts, not its link to an external referent. On this view LLMs "likely capture important aspects of meaning" and "work in a way that approximates a compelling account of human cognition in which meaning arises from conceptual role." If you know how "democracy" relates to "vote," "citizen," "power," and a thousand other concepts, you know much of its meaning — and that structure is recoverable from distribution alone.',
    animalMirror: 'The mirror question: do bees refer, or do they merely carry information a receiver exploits? Inferential-role semantics sidesteps reference entirely — meaning is structure, and structure survives in the corpus.',
    color: '#8ae04a',
  },
]

const GROUNDING_NOTIONS = [
  { name: 'Referential', desc: 'Do internal states track real things in the world?', matters: true },
  { name: 'Sensorimotor', desc: 'Are symbols tied to perception and action?', matters: false },
  { name: 'Relational', desc: 'Do states relate to one another systematically?', matters: false },
  { name: 'Communicative', desc: 'Are states used to coordinate with others?', matters: false },
  { name: 'Epistemic', desc: 'Does the system know what its states are about?', matters: false },
]

export function LlmGrounding() {
  const [active, setActive] = useState<Pole>('bender')
  const pos = POSITIONS.find(p => p.id === active)!

  return (
    <div className="llm-section">
      <p className="llm-eyebrow">Pillar VIII · Machine Language</p>
      <h1 className="llm-title">Form vs Meaning</h1>
      <p className="llm-lede">
        Across the biological pillars, the most contested recurring question was semantic: does a
        signal carry <em>genuine reference</em>, or only a form whose meaning is supplied by receiver
        inference? The LLM question is the mirror image — can a system have semantics-like capacities
        from <em>form and distribution alone?</em> The same dialectic, recast in silicon.
      </p>

      {/* The two mirror dissociations */}
      <div className="llm-mirror-row">
        <div className="llm-mirror-card">
          <span className="llm-mirror-tag">Birdsong</span>
          <span className="llm-mirror-txt">syntax <em>without</em> semantics</span>
        </div>
        <div className="llm-mirror-card">
          <span className="llm-mirror-tag">Bee dance</span>
          <span className="llm-mirror-txt">reference <em>without</em> syntax</span>
        </div>
        <div className="llm-mirror-card llm-mirror-card--llm">
          <span className="llm-mirror-tag">LLM</span>
          <span className="llm-mirror-txt">semantics-like capacity <em>without</em> grounding?</span>
        </div>
      </div>

      {/* Position selector */}
      <h2 className="llm-h2">Four Positions</h2>
      <div className="llm-pole-strip">
        {POSITIONS.map(p => (
          <button
            key={p.id}
            className={`llm-pole-tab${active === p.id ? ' active' : ''}`}
            style={active === p.id ? { borderColor: p.color, color: p.color } : {}}
            onClick={() => setActive(p.id)}
          >
            <span className="llm-pole-pole">{p.pole}</span>
            <span className="llm-pole-thinker">{p.thinker}</span>
          </button>
        ))}
      </div>

      <div className="llm-pole-detail" style={{ borderColor: pos.color }}>
        <div className="llm-pole-head">
          <span className="llm-pole-name" style={{ color: pos.color }}>{pos.thinker}</span>
          <span className="llm-pole-work">{pos.work}</span>
        </div>
        <p className="llm-pole-claim">"{pos.claim}"</p>
        <p className="llm-pole-body">{pos.body}</p>
        <div className="llm-pole-mirror">
          <span className="llm-pole-mirror-label">Animal mirror</span>
          <span>{pos.animalMirror}</span>
        </div>
      </div>

      {/* Five notions of grounding */}
      <h2 className="llm-h2">Five Notions of Grounding</h2>
      <p className="llm-sub">
        Mollo &amp; Millière argue only one of these is the grounding that matters — and that it can be
        conferred by selection (RLHF), not sensory channels.
      </p>
      <div className="llm-notions">
        {GROUNDING_NOTIONS.map(n => (
          <div key={n.name} className={`llm-notion${n.matters ? ' matters' : ''}`}>
            <span className="llm-notion-name">{n.name}{n.matters && <span className="llm-notion-star"> ★</span>}</span>
            <span className="llm-notion-desc">{n.desc}</span>
          </div>
        ))}
      </div>

      <div className="llm-callout">
        <div>
          <strong>The unsettled center of gravity:</strong> the debate is genuinely live, but since 2022
          the empirical weight has shifted toward "LLMs capture inferential-role structure but lack robust
          referential grounding." They have the web of relations (Piantadosi/Hill) without the anchor to
          the world (Bender/Koller) — unless selection-as-grounding (Mollo/Millière) does more work than
          skeptics allow. This is the exact "signal + receiver inference vs. genuine reference" question
          asked of vervet calls, the waggle dance, and signature whistles — now asked of a machine.
        </div>
      </div>
    </div>
  )
}
