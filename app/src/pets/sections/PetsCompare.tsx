import { useState } from 'react'

type Rating = 'strong' | 'partial' | 'weak' | 'none' | 'contested'

interface Dim {
  id: string
  label: string
  gloss: string
  dog: Rating
  cat: Rating
  dogNote: string
  catNote: string
}

const DIMS: Dim[] = [
  { id: 'vocab',      label: 'Referential vocab',      gloss: 'Learned associations between signals and objects/categories', dog: 'partial',   cat: 'weak',     dogNote: 'Most dogs: low. GWL dogs: 200–1000+ labels. Boros 2024 EEG suggests referential understanding is widespread even without GWL vocabulary.', catNote: 'Own name recognition (Saito 2019). Limited evidence beyond a handful of items. Understudied.' },
  { id: 'pointread',  label: 'Human-cue reading',      gloss: 'Following points, gaze, ostensive signals from humans', dog: 'strong',   cat: 'partial',  dogNote: 'Reliable from puppyhood; outperforms chimps; sensitive to ostensive cues (eye contact, dog-directed speech).', catNote: 'Can follow points (Miklósi 2005), but less attentive and harder to test. Less responsive to ostensive cues.' },
  { id: 'humanvocal', label: 'Human-directed vocalizing', gloss: 'Producing vocalizations specifically aimed at humans', dog: 'strong',   cat: 'strong',   dogNote: 'Elaborated across 5+ contexts; reliably classified by humans for emotion and context. A domestication novelty.', catNote: 'Meow essentially absent in adult cat–cat interaction; clearly human-directed. Solicitation purr embeds cry peak.' },
  { id: 'vplearn',    label: 'Vocal production learning', gloss: 'Imitating new sounds from the environment', dog: 'none',     cat: 'none',     dogNote: 'Not a vocal production learner. What changed was usage and acoustic tuning via receiver selection.', catNote: 'Not a vocal production learner. Meow diversification is domestication-driven, not imitative.' },
  { id: 'attach',     label: 'Secure attachment to owner', gloss: 'Using human as secure base, distress at separation', dog: 'strong',   cat: 'partial',  dogNote: 'Strong secure-base effect; reunion behavior after separation. Well-documented in standard attachment paradigms.', catNote: '65.8% secure — nearly identical to human infant rate. Some studies (Potter & Mills 2015) did not replicate; debated.' },
  { id: 'social',     label: 'Ancestral social complexity', gloss: 'Social complexity of wild ancestor', dog: 'strong',   cat: 'weak',     dogNote: 'Cooperative group-hunting wolves; hierarchical pack structure; rich conspecific communication toolkit.', catNote: 'Largely solitary wildcat. Group living emerged only partly under domestication (feral colonies).' },
  { id: 'domestmod',  label: 'Degree of domestication modification', gloss: 'Morphological/behavioral modification under selection', dog: 'strong',   cat: 'weak',     dogNote: 'Massive: 150+ breeds, paedomorphic retention, muscle fiber changes, LAOM variation. Longest-domesticated species.', catNote: '"Semi-domesticated." Minimal directed breeding until Middle Ages. More morphologically similar to wildcat ancestor.' },
  { id: 'caregivexp', label: 'Caregiver-system exploitation', gloss: 'Signals that activate human nurturing responses', dog: 'strong',   cat: 'strong',   dogNote: 'Puppy-dog eyes (LAOM), high-pitched distress vocalizations, juvenile body proportions (paedomorphism).', catNote: 'Solicitation purr embeds infant-cry frequencies; meow pitch and pleasantness tuned toward human preferences.' },
  { id: 'olfact',     label: 'Olfactory communication', gloss: 'Scent marking, glands, chemical signals', dog: 'strong',   cat: 'strong',   dogNote: 'Raised-leg urination, ground-scratching, anal glands. May exaggerate body size; functions as property marking.', catNote: 'Primary conspecific channel: facial rubbing (F3 fraction), urine spraying, scratching. Feliway analog is commercial F3.' },
  { id: 'crossmod',   label: 'Cross-modal owner recognition', gloss: 'Matching owner\'s voice to face, or voice to expectation', dog: 'strong',   cat: 'partial',  dogNote: 'Andics 2016: separates meaning from intonation. Boros 2024: voice activates object concept.', catNote: 'Takagi 2019: match owner voice to face. de Mouzon 2022: discriminates cat-directed speech — but only from owner, not stranger.' },
]

const RATING_COLOR: Record<Rating, string> = {
  strong:    'var(--pet-amber)',
  partial:   'var(--pet-cat)',
  weak:      'var(--fg-muted)',
  none:      'var(--fg-quiet)',
  contested: 'var(--fr-amber)',
}
const RATING_WORD: Record<Rating, string> = {
  strong: 'strong', partial: 'partial', weak: 'weak', none: 'absent', contested: 'contested',
}

export function PetsCompare() {
  const [selected, setSelected] = useState<string | null>('humanvocal')
  const sel = selected ? DIMS.find(d => d.id === selected) : null

  return (
    <div className="pet-section">
      <p className="pet-eyebrow">Dogs &amp; Cats · Pillar IX</p>
      <h1 className="pet-title">Natural Experiment</h1>
      <p className="pet-lede">
        Two lineages — cooperative-pack wolves, solitary wildcats — arrived at the same niche: living
        inside human social worlds. The contrast is a clean test of the social-complexity-drives-
        communication hypothesis, and places both species in the comparative grid that runs through the
        whole series. Click any row for detail.
      </p>

      {/* comparison grid */}
      <h2 className="pet-h2">Dog vs cat, dimension by dimension</h2>
      <div className="pet-grid">
        <div className="pet-grid-head">
          <span>Dimension</span>
          <span>Dog</span>
          <span>Cat</span>
        </div>
        {DIMS.map(d => (
          <button
            key={d.id}
            className={`pet-grid-row${selected === d.id ? ' open' : ''}`}
            onClick={() => setSelected(selected === d.id ? null : d.id)}
          >
            <span className="pet-grid-dim">
              <span className="pet-grid-dim-label">{d.label}</span>
              <span className="pet-grid-dim-gloss">{d.gloss}</span>
            </span>
            <span className="pet-grid-cell" style={{ color: RATING_COLOR[d.dog] }}>
              {RATING_WORD[d.dog]}
            </span>
            <span className="pet-grid-cell" style={{ color: RATING_COLOR[d.cat] }}>
              {RATING_WORD[d.cat]}
            </span>
          </button>
        ))}
      </div>
      {sel && (
        <div className="pet-grid-detail">
          <div className="pet-grid-detail-col">
            <span className="pet-grid-detail-who dog">Dog</span>
            <p>{sel.dogNote}</p>
          </div>
          <div className="pet-grid-detail-col">
            <span className="pet-grid-detail-who cat">Cat</span>
            <p>{sel.catNote}</p>
          </div>
        </div>
      )}

      {/* Social complexity hypothesis */}
      <h2 className="pet-h2">Social complexity and the human channel</h2>
      <p className="pet-sub">
        The hypothesis: richer ancestral social structure predicts richer communicative complexity. Dogs
        and cats are a small stress-test of it.
      </p>
      <div className="pet-soc">
        <div className="pet-soc-row">
          <span className="pet-soc-label">Social complexity predicts conspecific repertoire?</span>
          <span className="pet-soc-verdict support">Supported</span>
          <p>Dogs' wolf ancestry gave them a richer multimodal conspecific toolkit that was then redirected toward humans. Cats' sparse conspecific system is the starting point their human channel had to work around.</p>
        </div>
        <div className="pet-soc-row">
          <span className="pet-soc-label">Social complexity predicts human-directed channel?</span>
          <span className="pet-soc-verdict mixed">Partially</span>
          <p>Dogs lead on most measurable dimensions. But cats' solicitation purr and attachment bonds are genuinely strong — built from scratch on a solitary substrate. Social complexity helped dogs; it was not necessary for cats.</p>
        </div>
        <div className="pet-soc-row">
          <span className="pet-soc-label">The tail-up in cats as a micro-experiment</span>
          <span className="pet-soc-verdict support">Instructive</span>
          <p>The affiliative tail-up appears in group-living cats (domestic and feral) but not in solitary wildcats — a natural "social complexity emerged → signal elaborated" example in a species that only partially underwent the transition.</p>
        </div>
      </div>

      {/* Placing them in the series */}
      <h2 className="pet-h2">Where they sit in the series</h2>
      <div className="pet-series-place">
        <p>
          The rest of the series is graded on conspecific communication. Dogs and cats must be placed
          differently: their most elaborated channel is <em>interspecific</em>, aimed at us. On
          conspecific vocal complexity, dogs sit below cetaceans and birds; on human-directed
          communication, no other wild species comes close. On Hockett features:
        </p>
        <div className="pet-hockett">
          <div className="pet-hockett-row">
            <span>Arbitrariness</span>
            <span>Partial — some (name-like individual recognition by owners); most signals are iconic or graded</span>
          </div>
          <div className="pet-hockett-row">
            <span>Displacement</span>
            <span>Weak — communication about absent objects is rare and mostly human-mediated</span>
          </div>
          <div className="pet-hockett-row">
            <span>Productivity</span>
            <span>None — no evidence of novel signal construction beyond learned label combinations (GWL dogs)</span>
          </div>
          <div className="pet-hockett-row">
            <span>Duality of patterning</span>
            <span>None</span>
          </div>
          <div className="pet-hockett-row special">
            <span>Interspecific channel</span>
            <span>Unique in the series — the one dimension where no other pillar species competes</span>
          </div>
        </div>
      </div>

      <div className="pet-callout">
        <strong>The summary framing.</strong> Domestication created a novel communicative niche — "talking
        to the apes" — that neither wolves nor wildcats occupied. Each lineage filled it with the materials
        at hand: dogs leveraged a rich ancestral social toolkit and added domestication-specific channels
        (puppy-eyes, gaze loop, word-learning). Cats repurposed kitten-to-mother signals (meow, purr,
        tail-up) for a human caregiver who never stops being a parent. Neither species is a vocal
        production learner. Both achieved interspecific communication on the strength of receiver
        selection, ontogenetic tuning, and the biology of caregiving — a fourth category the rest of the
        series does not need.
      </div>
    </div>
  )
}
