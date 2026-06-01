import { useState } from 'react'

interface Theory {
  id: string
  name: string
  proponent: string
  claim: string
  evidence: string[]
  challenge: string
  color: string
}

const THEORIES: Theory[] = [
  {
    id: 'domestication',
    name: 'Domestication hypothesis',
    proponent: 'Hare, Tomasello et al.',
    claim: 'Dogs evolved specialized social-cognitive skills for reading human communicative cues during domestication. The ability is genetic, not purely learned.',
    evidence: [
      'Dogs outperform wolves and chimpanzees on following human points — even in first trials',
      'Puppies with minimal human contact still follow gaze and points above chance (Salomons et al. 2021)',
      'Foxes selected for tameness (Belyaev) show increased human-cue sensitivity — parallel evolution',
    ],
    challenge: 'Udell et al. found human-reared wolves can match or exceed dogs on some tasks — suggesting ontogeny (experience) matters more than genetics. Puppies\' innate advantage may be narrower than claimed.',
    color: '#e2924c',
  },
  {
    id: 'ontogeny',
    name: 'Ontogeny / learning hypothesis',
    proponent: 'Udell, Wynne et al.',
    claim: 'Dogs\' human-cue skills are primarily learned through developmental exposure to humans, not a genetic domestication adaptation.',
    evidence: [
      'Socialized wolves can follow human points — sometimes as well as dogs',
      'Shelter dogs (less human contact) perform worse than owned pets',
      'Experience with humans in early development predicts skill level',
    ],
    challenge: 'Hare et al. (2010) contested the wolf data quality and socialization controls. Salomons et al. (2021) showed 8-week-old puppies with minimal exposure show the skill — hard for pure ontogeny to explain.',
    color: '#56b6ff',
  },
  {
    id: 'cooperation',
    name: 'Canine-cooperation hypothesis',
    proponent: 'Range, Virányi et al.',
    claim: 'Wolf–wolf cooperative hunting pre-adapted the dog lineage for social cue-reading. Dogs did not gain new skills — they lost the fear of humans that blocked the expression of pre-existing ones.',
    evidence: [
      'Wolves raised cooperatively with humans show comparable point-following',
      'Wolf cooperative hunting requires tracking partner gaze and intention — same cognitive substrate',
      'Dogs and wolves show similar cooperative problem-solving when tested fairly',
    ],
    challenge: 'Difficulty explaining why dogs are reliably more responsive to human *ostensive* cues (eye contact, dog-directed speech) rather than simply cue-reading in general. Ostensive sensitivity looks like a new skill.',
    color: '#4ade80',
  },
]

interface GWL {
  name: string
  labels: number
  finding: string
}

const GWLS: GWL[] = [
  { name: 'Rico (border collie)', labels: 200, finding: 'First documented fast-mapping: inferred a new object\'s name by exclusion from known items. Kaminski et al. 2004, Science.' },
  { name: 'Chaser (border collie)', labels: 1022, finding: 'Largest documented vocabulary; also learned category labels (toy, ball, Frisbee) and responded to simple prepositional commands. Pilley & Reid 2011.' },
  { name: 'GWL cohort (17 dogs)', labels: 37, finding: 'Fugazza et al. 2021: identified dogs from 6 countries who spontaneously learned toy names. All were herding breeds or hybrids. Acquisition within ~3 months; 2-year retention. Most dogs cannot do this.' },
]

export function PetsComprehension() {
  const [theory, setTheory] = useState('domestication')
  const active = THEORIES.find(t => t.id === theory)!

  return (
    <div className="pet-section">
      <p className="pet-eyebrow">Dogs &amp; Cats · Pillar IX</p>
      <h1 className="pet-title">Reading Humans</h1>
      <p className="pet-lede">
        Dogs follow human points from puppyhood, often outperforming chimpanzees who share our evolutionary
        history. <em>Why</em> is one of the most productive debates in animal cognition. Three hypotheses
        have been active for twenty years. A handful of extraordinary dogs can learn over a thousand object
        names. And brain imaging reveals dogs separate word meaning from intonation — the same left-right
        asymmetry humans use.
      </p>

      {/* Theory comparison */}
      <h2 className="pet-h2">Three live theories</h2>
      <p className="pet-sub">Why do dogs follow human points? Click a hypothesis.</p>
      <div className="pet-theory-tabs">
        {THEORIES.map(t => (
          <button
            key={t.id}
            className={`pet-theory-tab${theory === t.id ? ' active' : ''}`}
            style={theory === t.id ? { borderColor: t.color } : undefined}
            onClick={() => setTheory(t.id)}
          >
            <span className="pet-theory-tab-name" style={theory === t.id ? { color: t.color } : undefined}>{t.name}</span>
            <span className="pet-theory-tab-pro">{t.proponent}</span>
          </button>
        ))}
      </div>
      <div className="pet-theory-detail" style={{ borderColor: active.color }}>
        <p className="pet-theory-claim">{active.claim}</p>
        <div className="pet-theory-evidence">
          <span className="pet-theory-evid-label" style={{ color: active.color }}>Evidence</span>
          <ul>
            {active.evidence.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
        <div className="pet-theory-challenge">
          <span className="pet-theory-challenge-label">Key challenge</span>
          <p>{active.challenge}</p>
        </div>
      </div>
      <p className="pet-caption">
        The debate is not closed. Most researchers now hold a middle position: a genetic predisposition
        amplified by developmental experience. The puppies-at-8-weeks data and the socialized-wolves data
        both contain signal; neither fully resolves it.
      </p>

      {/* GWL dogs */}
      <h2 className="pet-h2">Gifted Word Learner dogs</h2>
      <p className="pet-sub">
        Most dogs cannot learn object labels in the way Rico and Chaser could. A small number can — and
        those dogs have now been studied longitudinally.
      </p>
      <div className="pet-gwl-list">
        {GWLS.map(g => (
          <div key={g.name} className="pet-gwl">
            <div className="pet-gwl-head">
              <span className="pet-gwl-name">{g.name}</span>
              <span className="pet-gwl-count">{g.labels.toLocaleString()} labels</span>
            </div>
            <p className="pet-gwl-finding">{g.finding}</p>
          </div>
        ))}
      </div>

      {/* Brain imaging */}
      <h2 className="pet-h2">How the dog brain processes words</h2>
      <p className="pet-sub">
        Andics et al. (2016, <em>Science</em>): fMRI on 13 awake, unrestrained dogs. Words and intonation
        are processed separately — and reward-region activation required both to match.
      </p>
      <div className="pet-brain-schema">
        <div className="pet-brain-hemi left">
          <span className="pet-brain-hemi-label">Left hemisphere</span>
          <span className="pet-brain-hemi-fn">Word meaning (lexical)</span>
          <p>Familiar praise words activate left-hemisphere regions regardless of intonation — consistent with left-lateralized language processing in humans.</p>
        </div>
        <div className="pet-brain-hemi right">
          <span className="pet-brain-hemi-label">Right hemisphere</span>
          <span className="pet-brain-hemi-fn">Intonation (emotional tone)</span>
          <p>Attentional/intonation processing is right-lateralized, also mirroring the human asymmetry.</p>
        </div>
        <div className="pet-brain-integration">
          <span className="pet-brain-integration-label">Reward activation</span>
          <p>Caudate nucleus activated maximally only when <em>both</em> the word was meaningful praise <em>and</em> the intonation was praising. "Well done" in a flat voice: limited reward. A neutral word in a happy voice: limited reward. Both together: reward. Meaning is integrated.</p>
        </div>
      </div>
      <div className="pet-callout">
        <strong>EEG follow-up: Boros et al. 2024.</strong> A mismatch negativity-like effect at ~206–606 ms
        when dogs heard an object name that did not match a shown object — suggesting dogs activate a
        mental representation of the referent when they hear its name. Referential understanding, present
        even in dogs without large GWL-style vocabularies. The word "ball" is not just a sound that
        predicts treats — it calls up a concept.
      </div>
    </div>
  )
}
