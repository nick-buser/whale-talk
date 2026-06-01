import { useState } from 'react'

type WagDir = 'right' | 'left' | null

export function PetsGaze() {
  const [wagDir, setWagDir] = useState<WagDir>(null)
  const [oxyStep, setOxyStep] = useState(0)

  const OXY_STEPS = [
    { actor: 'Dog', action: 'Initiates or sustains eye contact with owner', detail: 'Long mutual gaze (not a threat stare) — the same channel humans use for bonding.' },
    { actor: 'Owner', action: 'Urinary oxytocin rises', detail: 'Nagasawa et al. 2015: a 5-minute gaze interaction raised owner urinary oxytocin levels significantly.' },
    { actor: 'Owner', action: 'Increases affiliative behavior toward dog', detail: 'The oxytocin rise predicts increased touching, talking to, and looking at the dog.' },
    { actor: 'Dog', action: 'Urinary oxytocin rises in response', detail: 'The dog\'s oxytocin then rises — a positive feedback loop. Intranasal oxytocin increases gaze duration in female dogs.' },
    { actor: 'Loop', action: 'Reinforces the bond bilaterally', detail: 'The same loop operates between mothers and infants. Its presence in the human–dog relationship (and absence with wolves) is the key claim.' },
  ]

  return (
    <div className="pet-section">
      <p className="pet-eyebrow">Dogs &amp; Cats · Pillar IX</p>
      <h1 className="pet-title">Gaze &amp; Faces</h1>
      <p className="pet-lede">
        Dogs have a facial muscle wolves lack. They wag left or right depending on how they feel about what
        they see — and other dogs read the difference. Looking at your dog raises oxytocin in both of you.
        The anatomy of the cross-species bond is, in part, a story about muscles, hormones, and the
        direction of a tail.
      </p>

      {/* Puppy-dog eyes */}
      <h2 className="pet-h2">The inner brow raise</h2>
      <p className="pet-sub">
        Kaminski et al. 2019: dogs have the <em>levator anguli oculi medialis</em> (LAOM), a muscle that
        raises the inner eyebrow — the AU101 movement. In wolves it was "a scant, irregular cluster of
        fibres." The movement makes the eye look larger and sadder, resembling the infant facial expression
        that triggers human nurturing responses.
      </p>
      <div className="pet-face-compare">
        <div className="pet-face-card">
          <svg viewBox="0 0 120 100" className="pet-face-svg" role="img" aria-label="Wolf face schematic">
            {/* face outline */}
            <ellipse cx="60" cy="52" rx="44" ry="42" className="pet-face-outline wolf" />
            {/* eyes — flat, no inner raise */}
            <ellipse cx="40" cy="44" rx="12" ry="7" className="pet-face-eye" />
            <ellipse cx="80" cy="44" rx="12" ry="7" className="pet-face-eye" />
            <circle cx="40" cy="44" r="4" className="pet-face-pupil" />
            <circle cx="80" cy="44" r="4" className="pet-face-pupil" />
            {/* flat brow lines */}
            <path d="M29 34 Q40 33 51 34" className="pet-face-brow flat" />
            <path d="M69 34 Q80 33 91 34" className="pet-face-brow flat" />
            {/* nose */}
            <ellipse cx="60" cy="62" rx="7" ry="4" className="pet-face-nose" />
            <text x="60" y="90" className="pet-face-label" textAnchor="middle">Wolf — LAOM absent</text>
          </svg>
        </div>
        <div className="pet-face-card">
          <svg viewBox="0 0 120 100" className="pet-face-svg" role="img" aria-label="Dog face schematic">
            <ellipse cx="60" cy="52" rx="44" ry="42" className="pet-face-outline dog" />
            {/* eyes — raised inner corner */}
            <ellipse cx="40" cy="46" rx="12" ry="8" className="pet-face-eye" />
            <ellipse cx="80" cy="46" rx="12" ry="8" className="pet-face-eye" />
            <circle cx="40" cy="46" r="4.5" className="pet-face-pupil" />
            <circle cx="80" cy="46" r="4.5" className="pet-face-pupil" />
            {/* raised inner brow */}
            <path d="M29 33 Q36 26 51 34" className="pet-face-brow raised" />
            <path d="M69 34 Q84 26 91 33" className="pet-face-brow raised" />
            {/* LAOM highlight */}
            <circle cx="36" cy="30" r="4" className="pet-face-laom" />
            <circle cx="84" cy="30" r="4" className="pet-face-laom" />
            <text x="60" y="90" className="pet-face-label dog" textAnchor="middle">Dog — LAOM present</text>
          </svg>
          <div className="pet-face-laom-note">● LAOM muscle</div>
        </div>
      </div>
      <div className="pet-callout">
        <strong>Contested anatomy.</strong> Caeiro and colleagues found a well-developed LAOM in coyotes —
        suggesting the muscle is a basal canid trait <em>lost in gray wolves</em> rather than gained by
        dogs. The behavioral difference (dogs use the inner-brow raise far more than wolves) is robust
        regardless. "A striking difference for species separated only 33,000 years ago" — Kaminski et al.
        What changed may be usage, not structure.
      </div>

      {/* Tail-wagging lateralization */}
      <h2 className="pet-h2">Which way is the tail wagging?</h2>
      <p className="pet-sub">
        Quaranta, Siniscalchi &amp; Vallortigara (2007): dogs wag with a right-side bias toward stimuli
        they approach (owner, familiar dog) and a left-side bias toward stimuli they withdraw from (dominant
        stranger, cat). Siniscalchi et al. (2013): receivers notice — left-biased wagging raises cardiac
        activity and anxiety in watching dogs. Click a direction to see what it signals.
      </p>
      <div className="pet-wag">
        <div className="pet-wag-dog">
          <svg viewBox="0 0 140 80" className="pet-wag-svg" aria-hidden="true">
            {/* body */}
            <ellipse cx="62" cy="48" rx="34" ry="20" className="pet-wag-body" />
            {/* head */}
            <circle cx="92" cy="38" r="18" className="pet-wag-head" />
            {/* ear */}
            <ellipse cx="86" cy="24" rx="7" ry="10" className="pet-wag-ear" />
            {/* tail */}
            <path
              d={wagDir === 'right'
                ? 'M28 44 Q12 28 6 18'
                : wagDir === 'left'
                ? 'M28 44 Q12 60 6 68'
                : 'M28 44 Q12 44 6 44'}
              className={`pet-wag-tail${wagDir ? ` ${wagDir}` : ''}`}
              strokeLinecap="round"
            />
            {/* eye */}
            <circle cx="99" cy="34" r="3.5" className="pet-wag-eye" />
          </svg>
        </div>
        <div className="pet-wag-btns">
          <button className={`pet-wag-btn right${wagDir === 'right' ? ' active' : ''}`} onClick={() => setWagDir(wagDir === 'right' ? null : 'right')}>
            Wags right →
          </button>
          <button className={`pet-wag-btn left${wagDir === 'left' ? ' active' : ''}`} onClick={() => setWagDir(wagDir === 'left' ? null : 'left')}>
            ← Wags left
          </button>
        </div>
        {wagDir && (
          <div className={`pet-wag-result ${wagDir}`}>
            {wagDir === 'right' ? (
              <>
                <span className="pet-wag-result-label approach">Approach signal</span>
                <p>Right-biased wag — left hemisphere dominant. Associated with positive approach stimuli: owner, familiar dog, an attractive cat. Watching dogs show <em>relaxed</em> cardiac responses.</p>
              </>
            ) : (
              <>
                <span className="pet-wag-result-label withdraw">Withdrawal signal</span>
                <p>Left-biased wag — right hemisphere dominant. Associated with withdrawal stimuli: a dominant unfamiliar dog. Watching dogs show <em>elevated</em> cardiac activity and anxiety (Siniscalchi 2013).</p>
              </>
            )}
            <p className="pet-wag-caveat">Caveat: Artelle et al. (2011) found dogs approached a robotic dog <em>less</em> when it wagged right, questioning the directionality. This finding has nuances worth tracking.</p>
          </div>
        )}
      </div>

      {/* Oxytocin loop */}
      <h2 className="pet-h2">The oxytocin gaze loop</h2>
      <p className="pet-sub">
        Step through the Nagasawa et al. (2015, <em>Science</em>) finding. This loop was absent in
        hand-raised wolves — the paper's key comparative claim.
      </p>
      <div className="pet-oxy">
        <div className="pet-oxy-steps">
          {OXY_STEPS.map((s, i) => (
            <button
              key={i}
              className={`pet-oxy-step${oxyStep === i ? ' active' : ''}${oxyStep > i ? ' done' : ''}`}
              onClick={() => setOxyStep(i)}
            >
              <span className="pet-oxy-step-num">{i + 1}</span>
              <span className="pet-oxy-step-actor">{s.actor}</span>
              <span className="pet-oxy-step-action">{s.action}</span>
            </button>
          ))}
        </div>
        <div className="pet-oxy-detail">
          <span className="pet-oxy-detail-actor">{OXY_STEPS[oxyStep].actor}</span>
          <p>{OXY_STEPS[oxyStep].detail}</p>
        </div>
      </div>
      <div className="pet-callout">
        <strong>Statistical caveat.</strong> The wolf comparison used a small sample of hand-raised wolves.
        Fiset &amp; Plourde (2015) estimated ~44 wolves would be needed for adequate statistical power. The
        loop's existence in dogs is well-supported; whether it is a domestication-specific adaptation or an
        ontogenetic consequence of hand-raising is an open question. Both explanations are consistent with
        the data.
      </div>
    </div>
  )
}
