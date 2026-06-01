import { useState } from 'react'

type Rating = 'yes' | 'partial' | 'no'

interface Notion {
  id: string
  name: string
  gloss: string
}

/* The five notions, pulled apart so "grounding" stops being one slippery word. */
const NOTIONS: Notion[] = [
  { id: 'referential', name: 'Referential', gloss: 'A causal–informational link between a word and what it picks out in the world.' },
  { id: 'sensorimotor', name: 'Sensorimotor', gloss: 'Meaning anchored in perception and action — seeing red, grasping a cup.' },
  { id: 'social', name: 'Communicative', gloss: 'Use inside a community of speakers, with intentions others recognize.' },
  { id: 'epistemic', name: 'Epistemic', gloss: 'Knowing that one\'s words track truth, and being answerable for them.' },
  { id: 'inferential', name: 'Inferential-role', gloss: 'Meaning from a word\'s place in a web of inferences and relations to other words.' },
]

interface Regime {
  id: string
  name: string
  tag: string
  x: number // 0..100 position on the grounding axis
  ratings: Record<string, Rating>
  verdict: string
}

const REGIMES: Regime[] = [
  {
    id: 'text',
    name: 'Text-only LM',
    tag: 'form alone',
    x: 14,
    ratings: { referential: 'no', sensorimotor: 'no', social: 'partial', epistemic: 'no', inferential: 'yes' },
    verdict: 'Rich inferential-role meaning — it has internalized an enormous web of relations between words. What it lacks is the one link to the world. On the view that reference is what semantics needs, that single gap is decisive.',
  },
  {
    id: 'rlhf',
    name: 'RLHF assistant',
    tag: 'form + human feedback',
    x: 32,
    ratings: { referential: 'no', sensorimotor: 'no', social: 'partial', epistemic: 'partial', inferential: 'yes' },
    verdict: 'Feedback installs a Gricean, answerable-sounding layer — a gesture at the epistemic and social notions. But the rater stands between model and world; the model still never checks its words against anything but more text.',
  },
  {
    id: 'multimodal',
    name: 'Vision-language model',
    tag: 'text + perception',
    x: 56,
    ratings: { referential: 'partial', sensorimotor: 'partial', social: 'partial', epistemic: 'no', inferential: 'yes' },
    verdict: 'The first real crossing. Contrastive image–text training ties symbols to perceptual structure — correlational, not yet causal, reference. The closest machine analog to Harnad\'s symbol grounding. Explored in the next section.',
  },
  {
    id: 'embodied',
    name: 'Embodied agent',
    tag: 'perception + action',
    x: 76,
    ratings: { referential: 'partial', sensorimotor: 'yes', social: 'partial', epistemic: 'partial', inferential: 'yes' },
    verdict: 'Acting in a world closes part of the loop: words now have consequences the agent can be wrong about. Still narrow and task-bound compared to a human life, but referentially it is doing something the text model cannot.',
  },
  {
    id: 'human',
    name: 'Human',
    tag: 'the full bundle',
    x: 94,
    ratings: { referential: 'yes', sensorimotor: 'yes', social: 'yes', epistemic: 'yes', inferential: 'yes' },
    verdict: 'All five at once, mutually reinforcing — the assembled whole the rest of the series has been circling. The benchmark, not because it is magic, but because it is the only system that has every notion at the same time.',
  },
]

const RATING_MARK: Record<Rating, string> = { yes: '●', partial: '◐', no: '○' }
const RATING_WORD: Record<Rating, string> = { yes: 'has it', partial: 'partial', no: 'lacks it' }

export function FrontiersGrounding() {
  const [active, setActive] = useState('text')
  const regime = REGIMES.find(r => r.id === active)!

  return (
    <div className="fr-section">
      <p className="fr-eyebrow">Coda · Open Frontiers</p>
      <h1 className="fr-title">The Grounding Spectrum</h1>
      <p className="fr-lede">
        The last tab presented four positions on machine meaning even-handedly. That was too polite. The way
        to get sharp is to refuse the word “grounding” as a single thing — pull it into <em>five</em> notions,
        and the disagreement dissolves into a clear picture of who has what.
      </p>

      {/* The axis */}
      <h2 className="fr-h2">Place each regime on the axis</h2>
      <p className="fr-sub">From form alone toward the full bundle. Click a marker.</p>
      <div className="fr-axis">
        <div className="fr-axis-line" />
        <span className="fr-axis-end left">form alone</span>
        <span className="fr-axis-end right">fully grounded</span>
        {REGIMES.map(r => (
          <button
            key={r.id}
            className={`fr-axis-marker${active === r.id ? ' active' : ''}`}
            style={{ left: `${r.x}%` }}
            onClick={() => setActive(r.id)}
          >
            <span className="fr-axis-dot" />
            <span className="fr-axis-name">{r.name}</span>
          </button>
        ))}
      </div>

      {/* Selected regime detail */}
      <div className="fr-ground-detail">
        <div className="fr-ground-detail-head">
          <span className="fr-ground-detail-name">{regime.name}</span>
          <span className="fr-ground-detail-tag">{regime.tag}</span>
        </div>
        <div className="fr-notions">
          {NOTIONS.map(n => {
            const r = regime.ratings[n.id]
            const star = n.id === 'referential'
            return (
              <div key={n.id} className={`fr-notion ${r}${star ? ' star' : ''}`}>
                <span className={`fr-notion-mark ${r}`}>{RATING_MARK[r]}</span>
                <span className="fr-notion-body">
                  <span className="fr-notion-name">
                    {n.name}
                    {star && <span className="fr-notion-crux">the crux</span>}
                  </span>
                  <span className="fr-notion-gloss">{n.gloss}</span>
                </span>
                <span className={`fr-notion-rating ${r}`}>{RATING_WORD[r]}</span>
              </div>
            )
          })}
        </div>
        <p className="fr-ground-verdict">{regime.verdict}</p>
      </div>

      {/* The three-way dissociation mirror */}
      <h2 className="fr-h2">The dissociation, one more time</h2>
      <p className="fr-sub">
        Each system in the series breaks meaning apart at a different joint. The machine is the newest break.
      </p>
      <div className="fr-mirror">
        <div className="fr-mirror-row">
          <span className="fr-mirror-sys">Birdsong</span>
          <span className="fr-mirror-has">syntax</span>
          <span className="fr-mirror-without">without semantics</span>
        </div>
        <div className="fr-mirror-row">
          <span className="fr-mirror-sys">Bee waggle</span>
          <span className="fr-mirror-has">reference</span>
          <span className="fr-mirror-without">without syntax</span>
        </div>
        <div className="fr-mirror-row accent">
          <span className="fr-mirror-sys">Text-only LM</span>
          <span className="fr-mirror-has">inferential meaning</span>
          <span className="fr-mirror-without">without reference</span>
        </div>
      </div>

      {/* The sharpened stance */}
      <h2 className="fr-h2">Where I plant the flag</h2>
      <div className="fr-stance">
        <div className="fr-stance-line">
          <span className="fr-stance-pole left">no meaning at all</span>
          <span className="fr-stance-pole right">genuine understanding</span>
        </div>
        <div className="fr-stance-thinkers">
          <div className="fr-thinker too">
            <span className="fr-thinker-pos">Deflation</span>
            <span className="fr-thinker-name">Bender & Koller</span>
            <span className="fr-thinker-claim">“A system trained on form can never acquire meaning.” Too strong — LLMs plainly have rich inferential-role semantics.</span>
            <span className="fr-thinker-tag">overshoots ←</span>
          </div>
          <div className="fr-thinker flag">
            <span className="fr-thinker-pos">The flag</span>
            <span className="fr-thinker-name">Mollo & Millière</span>
            <span className="fr-thinker-claim">Inferential meaning is real; <em>referential</em> grounding is the kind semantics needs, and text-only models lack exactly that. The middle is not a fudge — it is the precise diagnosis.</span>
            <span className="fr-thinker-tag">★ planted here</span>
          </div>
          <div className="fr-thinker too">
            <span className="fr-thinker-pos">Permission</span>
            <span className="fr-thinker-name">Piantadosi & Hill</span>
            <span className="fr-thinker-claim">“These models genuinely understand.” Too permissive — it papers over the missing referential link that the spectrum above makes visible.</span>
            <span className="fr-thinker-tag">→ overshoots</span>
          </div>
        </div>
      </div>

      <div className="fr-callout">
        <strong>The honest caveat.</strong> The flag rests on a premise inferentialists reject: that
        referential grounding is necessary for meaning at all. If meaning really is just inferential role,
        the gap closes and the text-only model is further along than I am granting. I think reference matters
        — but I am taking a side in a live dispute, not reporting a settled result.
      </div>
    </div>
  )
}
