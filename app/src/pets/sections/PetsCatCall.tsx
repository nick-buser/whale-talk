import { useState } from 'react'

export function PetsCatCall() {
  const [purr, setPurr] = useState<'solicitation' | 'normal'>('solicitation')
  const [blinkState, setBlinkState] = useState<'open' | 'slow' | 'response'>('open')

  /* Synthetic waveform data — represents the key acoustic difference */
  const BASE_PURR = [0.3,0.38,0.35,0.32,0.36,0.4,0.34,0.37,0.33,0.38,0.35,0.31,0.37,0.4,0.34,0.36]
  const CRY_PEAK =  [0.4,0.55,0.72,0.85,0.91,0.88,0.79,0.65,0.52,0.41,0.38,0.37,0.36,0.38,0.34,0.33]
  const waveData = purr === 'solicitation'
    ? BASE_PURR.map((v, i) => Math.max(v, CRY_PEAK[i]))
    : BASE_PURR

  const W = 280, H = 80, PAD = 8
  const pts = waveData.map((v, i) => {
    const x = PAD + (i / (waveData.length - 1)) * (W - PAD * 2)
    const y = H - PAD - v * (H - PAD * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <div className="pet-section">
      <p className="pet-eyebrow">Dogs &amp; Cats · Pillar IX</p>
      <h1 className="pet-title">The Cat Channel</h1>
      <p className="pet-lede">
        Adult cats rarely meow at other cats. The meow, the solicitation purr, and the slow blink are all
        aimed at us — repurposed from kitten-to-mother signals for a human caregiver who never stops being
        a parent. The channel is real, experimentally demonstrated, and consistently underestimated because
        cats are harder to test than dogs.
      </p>

      {/* The solicitation purr */}
      <h2 className="pet-h2">The cry within the purr</h2>
      <p className="pet-sub">
        McComb et al. (2009): cats embed a high-frequency voiced component within the low rumble of the
        purr when soliciting food. Toggle between purr types — the cry peak is what humans find "urgent."
      </p>
      <div className="pet-purr-ui">
        <div className="pet-purr-toggle">
          <button className={`pet-purr-btn${purr === 'normal' ? ' active' : ''}`} onClick={() => setPurr('normal')}>
            Contentment purr
          </button>
          <button className={`pet-purr-btn${purr === 'solicitation' ? ' active' : ''}`} onClick={() => setPurr('solicitation')}>
            Solicitation purr
          </button>
        </div>
        <div className="pet-purr-wave">
          <svg viewBox={`0 0 ${W} ${H}`} className="pet-purr-svg" role="img" aria-label="Purr waveform">
            <polyline points={pts} className={`pet-purr-line ${purr}`} fill="none" />
            {purr === 'solicitation' && (
              <>
                <line x1={PAD + 0.2 * (W - PAD*2)} y1={PAD} x2={PAD + 0.55 * (W - PAD*2)} y2={PAD} className="pet-purr-cry-marker" />
                <text x={PAD + 0.375 * (W - PAD*2)} y={PAD + 10} className="pet-purr-cry-label" textAnchor="middle">cry peak ~380 Hz</text>
              </>
            )}
          </svg>
          <div className="pet-purr-labels">
            <span>low freq purr</span>
            <span style={{ marginLeft: 'auto' }}>{purr === 'solicitation' ? 'embedded cry' : 'no cry component'}</span>
          </div>
        </div>
        <div className="pet-purr-stats">
          <div className="pet-purr-stat">
            <span className="pet-purr-stat-val">380 Hz</span>
            <span className="pet-purr-stat-lbl">mean cry peak</span>
          </div>
          <div className="pet-purr-stat">
            <span className="pet-purr-stat-val">220–520 Hz</span>
            <span className="pet-purr-stat-lbl">cry range</span>
          </div>
          <div className="pet-purr-stat">
            <span className="pet-purr-stat-val">urgent</span>
            <span className="pet-purr-stat-lbl">human rating of solicitation</span>
          </div>
          <div className="pet-purr-stat">
            <span className="pet-purr-stat-val">t29=18</span>
            <span className="pet-purr-stat-lbl">owner rating (p&lt;0.0005)</span>
          </div>
        </div>
      </div>
      <p className="pet-caption">
        The same effect held for non-owners (t19=8.22, p&lt;0.0005). Synthesizing the purr to remove the
        cry abolished the urgency rating. This is not a learned manipulation per cat — it is a signal that
        evolved to exploit a conserved mammalian sensitivity to infant distress calls. The cat is exploiting
        a caregiving instinct it did not install.
      </p>

      {/* The meow */}
      <h2 className="pet-h2">The domesticated meow</h2>
      <div className="pet-meow-compare">
        <div className="pet-meow-col">
          <span className="pet-meow-species wild">Wild ancestor (<em>F. s. lybica</em>)</span>
          <ul className="pet-meow-list">
            <li>Longer duration</li>
            <li>Lower pitch</li>
            <li>Harsher acoustic quality</li>
            <li>Rare between adults; mostly kitten–mother</li>
          </ul>
        </div>
        <div className="pet-meow-col">
          <span className="pet-meow-species domestic">Domestic cat</span>
          <ul className="pet-meow-list">
            <li>Shorter duration</li>
            <li>Higher mean pitch</li>
            <li>More tonal, "pleasant"</li>
            <li>Directed almost entirely at humans</li>
          </ul>
          <span className="pet-meow-cite">Nicastro 2004 — 535 recorded meows, cross-cultural listener study</span>
        </div>
      </div>

      {/* Slow blink */}
      <h2 className="pet-h2">The slow blink</h2>
      <p className="pet-sub">
        Humphrey et al. (2020): cats slow-blink back at humans who slow-blink, and approach an unfamiliar
        experimenter more after a slow blink. Try the sequence.
      </p>
      <div className="pet-blink">
        <div className="pet-blink-demo">
          <svg viewBox="0 0 80 60" className="pet-blink-svg" role="img" aria-label="Cat eye slow blink">
            {blinkState === 'open' && (
              <>
                <ellipse cx="40" cy="30" rx="22" ry="16" className="pet-blink-eye open" />
                <ellipse cx="40" cy="30" rx="6" ry="13" className="pet-blink-pupil" />
              </>
            )}
            {blinkState === 'slow' && (
              <>
                <path d="M18 30 Q40 46 62 30" className="pet-blink-lid" />
                <path d="M18 30 Q40 14 62 30" className="pet-blink-eye-arc" />
              </>
            )}
            {blinkState === 'response' && (
              <>
                <ellipse cx="40" cy="30" rx="22" ry="16" className="pet-blink-eye open" style={{ fill: 'color-mix(in oklch, var(--pet-cat) 20%, transparent)' }} />
                <ellipse cx="40" cy="30" rx="5" ry="11" className="pet-blink-pupil" />
              </>
            )}
          </svg>
          <span className="pet-blink-state-label">
            {blinkState === 'open' ? 'Direct gaze' : blinkState === 'slow' ? 'Slow blink ↓' : 'After blink — relaxed'}
          </span>
        </div>
        <div className="pet-blink-steps">
          <button className={`pet-blink-step${blinkState === 'open' ? ' active' : ''}`} onClick={() => setBlinkState('open')}>
            1. Open gaze
          </button>
          <button className={`pet-blink-step${blinkState === 'slow' ? ' active' : ''}`} onClick={() => setBlinkState('slow')}>
            2. Human slow-blinks
          </button>
          <button className={`pet-blink-step${blinkState === 'response' ? ' active' : ''}`} onClick={() => setBlinkState('response')}>
            3. Cat slow-blinks back
          </button>
        </div>
        <p className="pet-blink-note">
          Humphrey et al. also found cats approached the experimenter more when she slow-blinked vs. maintained a neutral expression. The slow blink appears to function as an affiliative signal that reduces threat and opens interaction — a "positive emotional state" marker.
        </p>
      </div>

      {/* Attachment */}
      <h2 className="pet-h2">Attachment: not aloof</h2>
      <div className="pet-attachment">
        <div className="pet-attach-bar">
          <div className="pet-attach-segment secure" style={{ width: '65.8%' }}>
            <span>65.8% secure</span>
          </div>
          <div className="pet-attach-segment insecure" style={{ width: '34.2%' }}>
            <span>34.2% insecure</span>
          </div>
        </div>
        <p className="pet-attach-note">
          Vitale, Behnke &amp; Udell (2019, <em>Current Biology</em>): 38 adult cats in a Strange
          Situation procedure. The secure-base rate nearly mirrors human infant attachment (~65%). "The
          majority of cats are securely attached to their owner and use them as a source of security in a
          novel environment." The popular conception of the aloof cat conflates "less demonstrative" with
          "less bonded."
        </p>
        <div className="pet-attach-compare">
          <div className="pet-attach-comp-row">
            <span>Human infants</span><span className="pet-attach-comp-pct">~65% secure</span>
          </div>
          <div className="pet-attach-comp-row">
            <span>Domestic cats</span><span className="pet-attach-comp-pct">65.8% secure</span>
          </div>
          <div className="pet-attach-comp-row">
            <span>Cat kittens</span><span className="pet-attach-comp-pct">~65% secure</span>
          </div>
        </div>
      </div>

      <div className="pet-callout">
        <strong>The research asymmetry.</strong> The dog literature dwarfs the cat literature by a factor
        of roughly 10–20x. Apparent cat "deficits" in human-cue following, label learning, and behavioral
        responsiveness are partly measurement artifacts: cats are more stress-reactive in novel
        environments, have lower food motivation as experimental currency, and are harder to keep still.
        "Less able" very frequently means "less studied." The attachment and recognition findings — name
        discrimination, owner-voice recognition, cross-modal face-voice matching — suggest the cat channel
        is real and substantially understudied.
      </div>
    </div>
  )
}
