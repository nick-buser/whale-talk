import { useState } from 'react'

// ── Campbell's monkey call system ─────────────────────────────────────────────

interface CampbellCall {
  id: string
  root: string
  rootColor: string
  rootMeaning: string
  rootContext: string
  derived: string | null
  derivedMeaning: string | null
  derivedContext: string | null
}

const CAMPBELL: CampbellCall[] = [
  {
    id: 'krak',
    root: 'krak',
    rootColor: '#ffb472',
    rootMeaning: 'Eagle alarm',
    rootContext: 'Crowned eagle or aerial predator detected; triggers sky-scan and descent into cover',
    derived: 'krak-oo',
    derivedMeaning: 'General disturbance',
    derivedContext: 'Non-eagle disturbances — also produced by females and in non-predator contexts; reduced urgency',
  },
  {
    id: 'hok',
    root: 'hok',
    rootColor: '#4afdc6',
    rootMeaning: 'Leopard alarm',
    rootContext: 'Leopard or terrestrial predator detected; triggers alarm and arboreal escape',
    derived: 'hok-oo',
    derivedMeaning: 'Other-species disturbance',
    derivedContext: 'Neighboring monkey groups or non-predator threats; broadened context, reduced urgency',
  },
  {
    id: 'boom',
    root: 'boom',
    rootColor: '#7da6ff',
    rootMeaning: 'Preamble',
    rootContext: 'Precedes sequences as a context-setter; signals "pay attention" before krak or krak-oo series',
    derived: null,
    derivedMeaning: null,
    derivedContext: null,
  },
]

// ── Pyow-hack comparison ──────────────────────────────────────────────────────

const PYOW_COLOR = '#4afdc6'
const HACK_COLOR = '#ffb472'

// ── Secondary items ───────────────────────────────────────────────────────────

interface SecondaryItem {
  id: string
  title: string
  color: string
  body: string
  finding: string
}

const SECONDARY: SecondaryItem[] = [
  {
    id: 'gelada',
    title: 'Gelada: Menzerath\'s Law',
    color: '#ff6b54',
    body: 'In gelada baboons, longer vocal sequences contain shorter individual units — the same negative correlation between sequence length and element duration found in human language. This is a significant structural regularity, but it does not require grammar: Menzerath\'s law emerges from information-theoretic pressures on any sequential communication system and has been documented in non-linguistic domains. Having the law does not imply having the rule system.',
    finding: 'Structural regularity without grammar',
  },
  {
    id: 'tamarin',
    title: 'Cotton-top tamarin: AⁿBⁿ failure',
    color: '#b57bee',
    body: 'Fitch & Hauser (2004, Science) tested whether cotton-top tamarins could learn center-embedded (context-free) grammar strings — AⁿBⁿ — versus strings from a regular (finite-state) grammar. Tamarins learned to discriminate the regular grammar above chance but failed on AⁿBⁿ, unlike adult humans who acquired both. This is consistent with context-free rule representation being unavailable to non-human primates — placing their natural call systems at most in the regular tier.',
    finding: 'Regular grammar yes · Context-free no',
  },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function PrimateCombinatorics() {
  const [selectedCall, setSelectedCall] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const sel = selectedCall ? CAMPBELL.find(c => c.id === selectedCall) : null

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Primates · Combinatorics
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Call Combinatorics
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Four case studies show what primate call combination looks like — and what it falls short of.
          The closest approach to rule-governed vocal syntax is Campbell's monkey, which has one productive
          suffix. The most cited sequence is idiomatic.
        </p>

        {/* Campbell's monkey diagram */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg)', margin: '0 0 6px' }}>
          Campbell's Monkey: The "-oo" Suffix
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.65, margin: '0 0 20px', maxWidth: 560 }}>
          A single suffix applied across two call roots reduces urgency and broadens context. This
          is the closest documented case to primate vocal morphology. Click a row to read its contexts.
        </p>

        <div className="primate-campbell">
          {/* Header */}
          <div className="primate-campbell-header">
            <span>Root call</span>
            <span style={{ textAlign: 'center' }}>+oo suffix</span>
            <span>Derived form</span>
          </div>

          {CAMPBELL.map(c => (
            <div
              key={c.id}
              className={`primate-campbell-row${selectedCall === c.id ? ' active' : ''}`}
              style={{ '--call-color': c.rootColor } as React.CSSProperties}
              onClick={() => setSelectedCall(selectedCall === c.id ? null : c.id)}
              role="button"
              aria-pressed={selectedCall === c.id}
            >
              {/* Root */}
              <div className="primate-campbell-cell primate-campbell-root-cell">
                <span className="primate-campbell-badge" style={{ color: c.rootColor, borderColor: `color-mix(in oklch, ${c.rootColor} 40%, transparent)`, background: `color-mix(in oklch, ${c.rootColor} 10%, transparent)` }}>
                  {c.root}
                </span>
                <span className="primate-campbell-meaning">{c.rootMeaning}</span>
              </div>

              {/* Arrow + suffix */}
              <div className="primate-campbell-suffix-col">
                {c.derived ? (
                  <span className="primate-campbell-arrow-label">→ <em>+oo</em></span>
                ) : (
                  <span className="primate-campbell-no-suffix">—</span>
                )}
              </div>

              {/* Derived */}
              <div className="primate-campbell-cell">
                {c.derived ? (
                  <>
                    <span className="primate-campbell-badge" style={{ color: 'var(--fg-quiet)', borderColor: 'var(--line)' }}>
                      {c.derived}
                    </span>
                    <span className="primate-campbell-meaning">{c.derivedMeaning}</span>
                  </>
                ) : (
                  <span className="primate-campbell-no-form">No -oo form</span>
                )}
              </div>
            </div>
          ))}

          {/* Selected detail */}
          {sel && (
            <div className="primate-campbell-panel" style={{ borderLeftColor: sel.rootColor }}>
              <div className="primate-campbell-contexts">
                <div>
                  <span className="primate-campbell-ctx-label">{sel.root}</span>
                  <p className="primate-campbell-ctx-body">{sel.rootContext}</p>
                </div>
                {sel.derived && (
                  <div>
                    <span className="primate-campbell-ctx-label">{sel.derived}</span>
                    <p className="primate-campbell-ctx-body">{sel.derivedContext}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pyow-hack comparison */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg)', margin: '52px 0 6px' }}>
          Putty-nosed Monkey: The Pyow-Hack Idiom
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.65, margin: '0 0 20px', maxWidth: 560 }}>
          The flagship primate proto-syntax result, tested directly in 2011. The sequence looks
          compositional. It isn't.
        </p>

        <div className="primate-pyow-grid">
          {/* Call chips */}
          <div className="primate-pyow-chips">
            <span className="primate-pyow-chip" style={{ color: PYOW_COLOR, borderColor: `color-mix(in oklch, ${PYOW_COLOR} 40%, transparent)`, background: `color-mix(in oklch, ${PYOW_COLOR} 10%, transparent)` }}>
              pyow
            </span>
            <span className="primate-pyow-plus">+</span>
            <span className="primate-pyow-chip" style={{ color: HACK_COLOR, borderColor: `color-mix(in oklch, ${HACK_COLOR} 40%, transparent)`, background: `color-mix(in oklch, ${HACK_COLOR} 10%, transparent)` }}>
              hack
            </span>
          </div>

          {/* Two-panel comparison */}
          <div className="primate-pyow-compare">
            <div className="primate-pyow-panel primate-pyow-pred">
              <span className="primate-pyow-panel-label">Compositional prediction</span>
              <p className="primate-pyow-panel-result">"Leopard + eagle threat"</p>
              <p className="primate-pyow-panel-body">
                pyow = leopard alarm · hack = eagle alarm. If the combination were compositional,
                it should signal a combined dual-predator threat — the most dangerous possible scenario.
                Zuberbühler's 2006 interpretation proposed this reading.
              </p>
            </div>

            <div className="primate-pyow-divider">≠</div>

            <div className="primate-pyow-panel primate-pyow-actual">
              <span className="primate-pyow-panel-label">Actual meaning (Arnold & Zuberbühler 2011)</span>
              <p className="primate-pyow-panel-result">"Let's move"</p>
              <p className="primate-pyow-panel-body">
                Playback of pyow-hack in non-predator contexts triggered group travel — not predator-specific
                escape. The sequence is an idiom: its meaning cannot be derived from the meanings of its parts.
                This is the null result for compositionality.
              </p>
            </div>
          </div>
        </div>

        {/* Gelada + tamarin secondary items */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg)', margin: '52px 0 20px' }}>
          Two More Cases
        </h3>

        <div className="primate-secondary-grid">
          {SECONDARY.map(item => (
            <div
              key={item.id}
              className={`primate-secondary-card${expanded === item.id ? ' open' : ''}`}
              style={{ '--item-color': item.color } as React.CSSProperties}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              role="button"
              aria-expanded={expanded === item.id}
            >
              <div className="primate-secondary-header">
                <span className="primate-secondary-title" style={{ color: item.color }}>{item.title}</span>
                <span className="primate-secondary-finding">{item.finding}</span>
              </div>
              {expanded === item.id && (
                <p className="primate-secondary-body">{item.body}</p>
              )}
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="bird-intro-callout" style={{ marginTop: 40 }}>
          <p className="bird-intro-callout-label">The combinatorics ceiling</p>
          <p>
            Across every documented primate vocal system, the same ceiling appears: call types
            combine, but the combinations are either idiomatic (fixed meaning independent of parts),
            statistically regular (Menzerath's law), or constrained to finite-state transitions.
            No primate system shows evidence of center-embedding, hierarchical structure, or the
            Zipfian hapax distribution that signals productive grammar.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '1',    label: 'Productive suffix documented across primate vocal systems — the "-oo" in Campbell\'s monkey' },
            { val: '2011', label: 'Arnold & Zuberbühler — pyow-hack proved idiomatic, not compositional, via playback test' },
            { val: '2004', label: 'Fitch & Hauser — cotton-top tamarins fail AⁿBⁿ (context-free), pass ABⁿ (regular)' },
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
