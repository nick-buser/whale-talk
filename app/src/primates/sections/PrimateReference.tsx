import { useState } from 'react'

// ── Call data ─────────────────────────────────────────────────────────────────

interface CallData {
  id: string
  call: string
  color: string
  predator: string
  escape: string
  headline: string
  body: string
  notDemonstrated: string
}

const CALLS: CallData[] = [
  {
    id: 'eagle',
    call: 'Eagle alarm',
    color: '#ffb472',
    predator: 'Aerial predators',
    escape: 'Look up · run into bushes',
    headline: 'Aerial threat protocol',
    body: 'A short, high-pitched bark. On playback — without any eagle present — vervets move into dense vegetation below the forest canopy. This is the adaptive response to a raptor: eagles are dangerous above the canopy line, bushes below it are safe. The behavior is categorically specific: leopard or snake alarms on playback produce a different response entirely. Seyfarth, Cheney, and Marler (1980) ran these experiments in Amboseli, Kenya, establishing the first systematic evidence of functionally referential alarm calls in a wild primate.',
    notDemonstrated: 'Vervets do not comment on predators after they leave, cannot report past encounters, and do not predicate properties of the eagle. The call is a signal in the moment of threat — not a statement about the world.',
  },
  {
    id: 'leopard',
    call: 'Leopard alarm',
    color: '#4afdc6',
    predator: 'Terrestrial predators',
    escape: 'Run up into trees',
    headline: 'Ground threat protocol',
    body: 'A series of loud, low barks. The adaptive response — running up into trees — is the exact opposite of the eagle response. Leopards cannot easily follow vervets into the upper canopy; eagles are best avoided by staying below it. This behavioral inversion was methodologically key: it rules out a single "alarm" signal with nonspecific arousal, and demonstrates that the calls carry categorically distinct threat information.',
    notDemonstrated: 'The "reference" here does not require the vervet to hold a concept of leopard-as-entity. An arousal model — different calls produce different motor primes via conditioning — accounts for the same behavioral data without positing encoded semantic content.',
  },
  {
    id: 'snake',
    call: 'Snake alarm',
    color: '#7da6ff',
    predator: 'Snakes',
    escape: 'Stand bipedally · scan ground',
    headline: 'Ground search protocol',
    body: 'Triggers bipedal standing and downward scanning of ground vegetation — a search behavior rather than flight. This is functionally distinct from both other alarm calls: it involves active ground-level investigation rather than directional escape. The three-way call-to-behavior mapping, demonstrated via controlled playback, was the empirical core of the 1980 Science paper and remains the most-cited example of primate functional reference.',
    notDemonstrated: 'No evidence that vervets use these calls outside the immediate threat context — no "there was a snake earlier" report, no teaching of naive individuals through verbal instruction, no use in non-threatening contexts to describe snakes.',
  },
]

// ── What functional reference is and isn't ────────────────────────────────────

interface Limit {
  id: string
  label: string
  body: string
}

const LIMITS: Limit[] = [
  {
    id: 'arousal',
    label: 'Arousal gradient hypothesis',
    body: 'Schlenker and others formalize primate semantics via an Informativity Principle (calls should be informative relative to context) and scalar implicature analogous to human pragmatics. Critics argue the same data fits a simpler arousal model: different calls produce different motor primes via conditioning, without any encoded semantic content — more like traffic lights than words. The debate is unresolved and methodologically deep: distinguishing encoding from conditioning requires the signal to appear in new contexts.',
  },
  {
    id: 'displacement',
    label: 'No displaced reference',
    body: 'Functional reference in these systems is locked to the present moment. Unlike human language (or even bee waggle dances for past food locations), vervet alarm calls cannot report about absent or past threats. A vervet that survived a leopard attack cannot describe the event to others using vocal signals. This constraint is fundamental: without displaced reference, a system cannot generate narrative, share knowledge about the non-present world, or coordinate on future action.',
  },
  {
    id: 'predication',
    label: 'No predication',
    body: 'There is no evidence of a call meaning "the eagle is attacking the nest" vs. "an eagle flew past" — the call picks out a category but cannot predicate properties of the referent. Predication — assigning attributes to entities — is the minimal compositional operation in human language. Its apparent absence in primate vocalizations is a significant gap between functional reference and even rudimentary propositions.',
  },
  {
    id: 'campbell',
    label: 'Campbell\'s monkey: the best case',
    body: 'The closest thing to primate vocal morphology: Campbell\'s monkeys (Cercopithecus campbelli) combine krak/hok calls with a "-oo" suffix that reduces urgency and broadens context. This is rule-governed modification — the same suffix applies productively across call types. Ouattara et al. (2009) showed males combine these to form sequences analogous to compound meaning. Yet the system has only two call roots, one suffix, and the combinations are at the boundary of idiom — not a generative grammar.',
  },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function PrimateReference() {
  const [selected, setSelected] = useState<string | null>('eagle')
  const [expanded, setExpanded] = useState<string | null>(null)

  const sel = CALLS.find(c => c.id === selected)

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Primates · Functional Reference
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          The Vervet Experiment
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Seyfarth, Cheney & Marler (1980) showed that vervet monkeys produce three distinct alarm
          calls mapped to three predator categories — each triggering a categorically different,
          predator-appropriate escape behavior, even on playback with no predator present. Click a
          call to follow its response chain.
        </p>

        {/* Flow diagram */}
        <div className="primate-flow-header">
          <span>Call</span>
          <span />
          <span>Predator category</span>
          <span />
          <span>Escape behavior</span>
        </div>

        <div className="primate-flow-diagram">
          {CALLS.map(c => (
            <div
              key={c.id}
              className={`primate-flow-row${selected === c.id ? ' active' : ''}`}
              style={{ '--call-color': c.color } as React.CSSProperties}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              role="button"
              aria-pressed={selected === c.id}
            >
              <div className="primate-flow-node primate-flow-call-node">
                <span className="primate-flow-dot" style={{ background: c.color }} />
                <span className="primate-flow-node-text">{c.call}</span>
              </div>
              <span className="primate-flow-arrow" aria-hidden="true">→</span>
              <div className="primate-flow-node primate-flow-pred-node">
                <span className="primate-flow-node-text">{c.predator}</span>
              </div>
              <span className="primate-flow-arrow" aria-hidden="true">→</span>
              <div className="primate-flow-node primate-flow-esc-node">
                <span className="primate-flow-node-text">{c.escape}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected call detail */}
        {sel && (
          <div className="primate-flow-panel" style={{ borderLeftColor: sel.color }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: sel.color, margin: '0 0 12px' }}>
              {sel.headline}
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, margin: '0 0 16px' }}>
              {sel.body}
            </p>
            <div className="primate-flow-not">
              <span className="primate-flow-not-label">What this doesn't demonstrate</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
                {sel.notDemonstrated}
              </p>
            </div>
          </div>
        )}

        {/* What functional reference is and isn't */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 20px' }}>
          What Functional Reference Is and Isn't
        </h3>

        <div className="primate-limits">
          {LIMITS.map(lim => (
            <div
              key={lim.id}
              className={`primate-limit-card${expanded === lim.id ? ' open' : ''}`}
              onClick={() => setExpanded(expanded === lim.id ? null : lim.id)}
              role="button"
              aria-expanded={expanded === lim.id}
            >
              <div className="primate-limit-header">
                <span className="primate-limit-label">{lim.label}</span>
                <span className="primate-limit-caret">{expanded === lim.id ? '−' : '+'}</span>
              </div>
              {expanded === lim.id && (
                <p className="primate-limit-body">{lim.body}</p>
              )}
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="bird-intro-callout" style={{ marginTop: 40 }}>
          <p className="bird-intro-callout-label">The methodological challenge</p>
          <p>
            Distinguishing encoded semantics from conditioned arousal requires showing that the
            signal appears in new contexts, combines productively with other signals, or is
            understood by naïve receivers unfamiliar with the referent. Playback experiments
            demonstrate stimulus-response specificity. They do not, on their own, demonstrate
            encoding.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '1980', label: 'Seyfarth, Cheney & Marler — vervet alarm calls documented in Science' },
            { val: '3×3',  label: 'Call types × predator categories × escape behaviors — the three-way specificity' },
            { val: '2011', label: 'Arnold & Zuberbühler — putty-nosed pyow-hack proved idiomatic, not compositional' },
          ].map(s => (
            <div key={s.label} className="stat-cell">
              <span className="stat-val" style={{ color: 'var(--krill)', fontFamily: 'var(--font-display)' }}>
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
