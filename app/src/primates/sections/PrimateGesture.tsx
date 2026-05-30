import { useState } from 'react'

// ── Gesture data (representative sample, Hobaiter & Byrne 2014) ───────────────

interface GestureData {
  id: string
  label: string
  category: string
  meaning: string
  body: string
  intentional: boolean
}

const CAT_META: Record<string, { label: string; color: string }> = {
  groom:      { label: 'Grooming',   color: '#4afdc6' },
  play:       { label: 'Play',       color: '#ffb472' },
  food:       { label: 'Food/Object',color: '#7da6ff' },
  social:     { label: 'Social',     color: '#ff6b54' },
  locomotion: { label: 'Locomotion', color: '#b57bee' },
  aggression: { label: 'Aggression', color: '#e06b9d' },
}

const GESTURES: GestureData[] = [
  // Grooming
  { id: 'groom-offer', label: 'Groom offer', category: 'groom', meaning: 'Groom me',
    body: 'The signaler presents a body part — often the back or neck — toward the recipient. If the recipient does not respond, the signaler repeats or repositions: classic attention-checking behavior.', intentional: true },
  { id: 'loud-scratch', label: 'Loud scratch', category: 'groom', meaning: 'Groom this area',
    body: 'An exaggerated, audible scratch of a specific body part directs the recipient\'s attention to the location where grooming is wanted. The sound amplifies the visual signal.', intentional: true },
  { id: 'roll-over', label: 'Roll over', category: 'groom', meaning: 'Groom my belly',
    body: 'The signaler rolls onto their back to expose the belly, a vulnerable surface that cannot be self-groomed. The recipient can either respond or not — if not, the behavior is repeated.', intentional: true },
  { id: 'reach-back', label: 'Reach behind', category: 'groom', meaning: 'Groom my back',
    body: 'An arm extended back over the shoulder toward the back directs the grooming partner to the intended area. Often repeated with gaze-checking toward the recipient.', intentional: true },

  // Play
  { id: 'dangle', label: 'Dangle', category: 'play', meaning: 'Play with me',
    body: 'The signaler hangs from a support and swings — a distinctive play-solicitation posture. It is performed toward a specific individual and the swinging continues until a response occurs or the signaler gives up.', intentional: true },
  { id: 'object-shake', label: 'Object shake', category: 'play', meaning: 'Play / attention',
    body: 'Vigorously shaking an object (branch, stone) directed toward another individual. The exaggerated motion functions as an attention-getter and a play invitation simultaneously.', intentional: true },
  { id: 'slap-ground', label: 'Ground slap', category: 'play', meaning: 'Play with me',
    body: 'A loud open-handed slap on the ground surface, directed toward a specific individual. The acoustic component ensures the signal reaches recipients not watching the signaler.', intentional: true },
  { id: 'hit-with-object', label: 'Hit with object', category: 'play', meaning: 'Play chase / attention',
    body: 'Using an object to lightly hit the recipient — distinct from aggression by context, gesture exaggeration, and the "play face" that often accompanies it.', intentional: true },

  // Food / Object
  { id: 'reach-toward', label: 'Reach toward', category: 'food', meaning: 'Give me that',
    body: 'An arm extended toward a food item or object the signaler wants. Performed at a specific individual; repeated if no sharing occurs. One of the clearest cases of referential pointing in non-human primates.', intentional: true },
  { id: 'grab-at', label: 'Grab at', category: 'food', meaning: 'I want that',
    body: 'A grasping motion in the direction of desired food without actually taking it — a conventional signal that has lost its original motor function and become a gesture.', intentional: true },
  { id: 'leaf-clip', label: 'Leaf clip', category: 'food', meaning: 'Context-dependent',
    body: 'In some populations, repeatedly tearing a leaf into fragments produces a distinctive sound. Its meaning varies by community — in some groups it functions as a mating signal ("secret language" hypothesis, Hobaiter et al. 2014), in others as a general attention-getter. A candidate for cultural variation in gesture meaning.', intentional: true },

  // Social
  { id: 'arm-raise', label: 'Arm raise', category: 'social', meaning: 'Attend to me',
    body: 'One or both arms raised toward the recipient. A general solicitation signal used in multiple contexts. The gesture is repeated if the recipient does not attend, demonstrating goal-seeking persistence.', intentional: true },
  { id: 'hand-on', label: 'Hand on', category: 'social', meaning: 'Stop / wait',
    body: 'Placing a hand on the recipient\'s body to arrest movement. The goal is achieved when the recipient stops; the gesture is not repeated if the goal is met — a clear intentionality criterion.', intentional: true },
  { id: 'embrace', label: 'Embrace', category: 'social', meaning: 'Reassurance / affiliation',
    body: 'Arms wrapped around the recipient, often in response to distress. The social function is clear; the gesture is used contingently on the emotional state of the recipient, showing sensitivity to audience.', intentional: true },
  { id: 'present', label: 'Present', category: 'social', meaning: 'Approach / groom',
    body: 'Crouching and presenting the rear toward another individual — a submission/affiliation gesture that invites approach. Used in appeasement and greeting contexts.', intentional: true },
  { id: 'tap', label: 'Tap', category: 'social', meaning: 'Stop / attention',
    body: 'A brief touch or tap on the recipient. One of the most versatile gestures — used to interrupt, redirect, or initiate contact. Meaning is highly context-dependent.', intentional: true },

  // Locomotion
  { id: 'seize', label: 'Seize', category: 'locomotion', meaning: 'Follow me',
    body: 'Briefly grabbing and then releasing the recipient while moving in a direction. The grab-and-release is the signal; actual dragging would be coercion rather than communication.', intentional: true },
  { id: 'stretch', label: 'Stretch toward', category: 'locomotion', meaning: 'Climb on me',
    body: 'Extending the body toward the recipient with arms open, typically used by mothers signaling infants to climb on for transport. The posture opens a "carrying platform" and is maintained until the infant climbs on.', intentional: true },
  { id: 'beckon', label: 'Beckon', category: 'locomotion', meaning: 'Come here',
    body: 'A sweeping arm motion toward the body. Cross-species comprehension studies show this is one of the gestures that naive humans interpret correctly at above-chance rates.', intentional: true },
  { id: 'push', label: 'Push away', category: 'locomotion', meaning: 'Move away',
    body: 'Pushing the recipient gently in a direction. Distinct from aggression — the push is gentle and directed at movement rather than harm, with a clear goal state (recipient moves away).', intentional: true },

  // Aggression
  { id: 'stomp', label: 'Stomp', category: 'aggression', meaning: 'Stop that',
    body: 'Loud stamping directed toward another individual during mild conflict. Often precedes escalation; the goal is the recipient changing behavior. Meets attention-checking criteria weakly.', intentional: false },
  { id: 'slap-object', label: 'Slap object', category: 'aggression', meaning: 'Attention / threat',
    body: 'Slapping a nearby object loudly. The acoustic output draws attention and signals arousal. Unlike play-ground-slap, the context and body posture mark this as agonistic.', intentional: false },
  { id: 'chest-beat', label: 'Chest beat', category: 'aggression', meaning: 'Dominance display',
    body: 'The iconic chimpanzee/gorilla chest beat. Often accompanied by bipedal swaggering and branch dragging; functions as an aversive broadcast rather than a directed communicative signal. Meets intentionality criteria partially at best.', intentional: false },
  { id: 'hair-erect', label: 'Hair erect', category: 'aggression', meaning: 'Arousal / threat',
    body: 'Piloerection (raising of hair) that increases apparent body size. This is largely autonomic rather than intentional — it is listed here as a boundary case between signal and cue.', intentional: false },
]

const CATEGORIES = Object.keys(CAT_META)

// ── Main export ───────────────────────────────────────────────────────────────

export function PrimateGesture() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedGesture, setSelectedGesture] = useState<string | null>(null)

  const sel = selectedGesture ? GESTURES.find(g => g.id === selectedGesture) : null
  const selCat = sel ? CAT_META[sel.category] : null

  function isVisible(g: GestureData) {
    return activeCategory === null || g.category === activeCategory
  }

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Primates · Gesture
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Ape Gesture Lexicon
        </h2>
        <p className="lede" style={{ marginBottom: 40 }}>
          Hobaiter & Byrne (2014) documented ~80 gesture types in wild chimpanzees with
          consistent meanings across individuals — a functional lexicon that meets full
          intentionality criteria. Filter by category and click any gesture to read its
          behavioral evidence.
        </p>

        {/* Graham & Hobaiter highlight */}
        <div className="primate-gesture-highlight">
          <div className="primate-gesture-highlight-stat">
            <span className="primate-gesture-highlight-val">5,656</span>
            <span className="primate-gesture-highlight-label">participants</span>
          </div>
          <div className="primate-gesture-highlight-text">
            <p className="primate-gesture-highlight-title">
              Humans interpret ape gestures above chance — without prior exposure
            </p>
            <p className="primate-gesture-highlight-body">
              Graham & Hobaiter (2023, PLOS Biology) showed that naive human participants,
              presented with 10-second clips of chimpanzees gesturing, correctly identified
              the communicative goal at above-chance rates. No training or priming required.
              This suggests the meanings are not arbitrary — they are transparent in a way
              that crosses the human–chimpanzee divide, 6 million years of divergence.
            </p>
          </div>
        </div>

        {/* Category filters */}
        <div className="primate-gesture-filters" style={{ margin: '32px 0 16px' }}>
          <button
            className={`primate-gesture-filter${activeCategory === null ? ' active' : ''}`}
            style={{ '--filt-color': 'var(--fg-quiet)' } as React.CSSProperties}
            onClick={() => setActiveCategory(null)}
          >
            All ({GESTURES.length})
          </button>
          {CATEGORIES.map(cat => {
            const m = CAT_META[cat]
            const count = GESTURES.filter(g => g.category === cat).length
            return (
              <button
                key={cat}
                className={`primate-gesture-filter${activeCategory === cat ? ' active' : ''}`}
                style={{ '--filt-color': m.color } as React.CSSProperties}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              >
                {m.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Gesture grid + detail panel */}
        <div className="primate-gesture-layout">
          <div className="primate-gesture-grid">
            {GESTURES.map(g => {
              const cat = CAT_META[g.category]
              const visible = isVisible(g)
              const isSelected = selectedGesture === g.id
              return (
                <div
                  key={g.id}
                  className={`primate-gesture-card${isSelected ? ' selected' : ''}${!visible ? ' dimmed' : ''}`}
                  style={{ '--card-color': cat.color } as React.CSSProperties}
                  onClick={() => visible && setSelectedGesture(isSelected ? null : g.id)}
                  role="button"
                  aria-pressed={isSelected}
                  aria-disabled={!visible}
                >
                  <div className="primate-gesture-card-top">
                    <span className="primate-gesture-card-label">{g.label}</span>
                    <span
                      className={`primate-gesture-intent-dot${g.intentional ? ' yes' : ' no'}`}
                      title={g.intentional ? 'Full intentionality criteria met' : 'Partial / not met'}
                    />
                  </div>
                  <span className="primate-gesture-card-meaning">{g.meaning}</span>
                  <span className="primate-gesture-card-cat" style={{ color: cat.color }}>
                    {cat.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Detail panel */}
          <aside className="bird-syntax-panel">
            {sel && selCat ? (
              <>
                <span className="bird-syntax-badge" style={{
                  color: selCat.color,
                  borderColor: `color-mix(in oklch, ${selCat.color} 40%, transparent)`,
                  background: `color-mix(in oklch, ${selCat.color} 8%, transparent)`,
                }}>
                  {selCat.label}
                </span>
                <h3 className="bird-info-title" style={{ color: selCat.color, marginTop: 14 }}>
                  {sel.label}
                </h3>
                <p className="bird-info-sub" style={{ marginBottom: 8 }}>
                  Meaning: {sel.meaning}
                </p>
                <p className="bird-info-body">{sel.body}</p>
                <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: sel.intentional ? `color-mix(in oklch, var(--lumen) 8%, transparent)` : `color-mix(in oklch, var(--fg-quiet) 8%, transparent)`, border: `1px solid ${sel.intentional ? `color-mix(in oklch, var(--lumen) 30%, transparent)` : `var(--line)`}` }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sel.intentional ? 'var(--lumen)' : 'var(--fg-quiet)', margin: '0 0 4px' }}>
                    Intentionality criteria
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-muted)', margin: 0, lineHeight: 1.5 }}>
                    {sel.intentional
                      ? 'Directed, attention-checked, goal-seeking, stops when goal met.'
                      : 'Partial or not met — may be cue rather than signal.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="bird-info-sub" style={{ marginBottom: 10 }}>Gesture lexicon</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, margin: '0 0 14px' }}>
                  ~80 gesture types documented in wild chimpanzees. Filled dots = full
                  intentionality criteria met (directed, attention-checked, goal-seeking,
                  stops when goal met). Open dots = partial or absent.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="primate-gesture-intent-dot yes" />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-muted)' }}>Full intentionality</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="primate-gesture-intent-dot no" />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-muted)' }}>Partial / not met</span>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-quiet)', lineHeight: 1.6, marginTop: 16, fontStyle: 'italic' }}>
                  Click any gesture to read its behavioral evidence.
                </p>
              </>
            )}
          </aside>
        </div>

        {/* Combinatorics limitation */}
        <div className="bird-intro-callout" style={{ marginTop: 48 }}>
          <p className="bird-intro-callout-label">The syntax ceiling</p>
          <p>
            Gesture combinations are non-additive. "I want food" and "follow me" do not compose
            to "I want you to follow me to food." Combinations are idiomatic — their meanings
            are not derived from the meanings of their parts. Great-ape gesture provides the
            strongest evidence of primate referential intentionality, and the clearest example
            of how intentionality without syntax falls short of language.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '~80', label: 'Gesture types with consistent meanings documented in wild chimpanzees (Hobaiter & Byrne 2014)' },
            { val: '5,656', label: 'Human participants who interpreted ape gestures above chance (Graham & Hobaiter 2023)' },
            { val: '6 Mya', label: 'Human–chimpanzee divergence — the gap crossed by cross-species gesture comprehension' },
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
