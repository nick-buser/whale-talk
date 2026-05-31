import { useState } from 'react'

// ── Model/rival roles ─────────────────────────────────────────────────────────

const MR_STEPS = [
  {
    id: 'display',
    role: 'Trainer presents object',
    who: 'Trainer A',
    detail: 'Holds up an object (e.g. a green wooden square). Alex watches from a T-perch — a participant, not a passive observer.',
    color: '#8ae04a',
  },
  {
    id: 'model',
    role: 'Model gives correct label',
    who: 'Trainer B',
    detail: 'Acts as model: names the object correctly ("green wood"). Trainer A rewards B with the object and social praise. Alex sees the entire transaction.',
    color: '#ffb472',
  },
  {
    id: 'rival',
    role: 'Rival competes for reward',
    who: 'Trainer B (now rival)',
    detail: 'If B gives a wrong label, A scolds, turns away, and re-presents to B. This makes B a rival for Alex\'s attention — driving Alex to answer correctly to regain the trainer\'s focus.',
    color: '#7da6ff',
  },
  {
    id: 'alex',
    role: 'Alex responds',
    who: 'Alex',
    detail: 'Alex answers the trainer\'s question ("What color?", "What shape?", "What matter?"). Correct answers yield the object and praise; wrong answers are gently corrected.',
    color: '#4afdc6',
  },
]

// ── Capability categories ─────────────────────────────────────────────────────

interface CapEntry {
  label: string
  example: string
  status: 'robust' | 'strong' | 'contested'
}

interface CapCategory {
  id: string
  name: string
  color: string
  count: string
  entries: CapEntry[]
}

const CAPABILITIES: CapCategory[] = [
  {
    id: 'color',
    name: 'Color',
    color: '#8ae04a',
    count: '7 labels',
    entries: [
      { label: 'Red', example: 'Answered "red" for novel red objects not seen during training', status: 'robust' },
      { label: 'Green', example: '"What color?" → "green" for any green object', status: 'robust' },
      { label: 'Blue', example: 'Included in conjunctive questions: "What shape is blue AND cork?"', status: 'robust' },
      { label: 'Yellow', example: 'Correctly labeled yellow across multiple materials and shapes', status: 'robust' },
      { label: 'Orange', example: 'Generalized to orange objects outside training set', status: 'robust' },
      { label: 'Purple', example: 'Acquired later; used in multi-attribute questions', status: 'strong' },
      { label: 'Rose/pink', example: 'Spontaneous: Alex once called his own color "rose" — unscripted', status: 'strong' },
    ],
  },
  {
    id: 'shape',
    name: 'Shape',
    color: '#ffb472',
    count: '5 labels',
    entries: [
      { label: 'Square / 4-corner', example: '"What shape?" → "4-corner" for square/rectangular objects', status: 'robust' },
      { label: 'Triangle / 3-corner', example: 'Generalized to 3-cornered shapes across materials', status: 'robust' },
      { label: 'Round / circle', example: '"Round" for discs; combined with "What color is round?"', status: 'robust' },
      { label: '5-corner', example: 'Pentagon-like shapes; used in conjunctive questions', status: 'strong' },
      { label: '6-corner', example: 'Acquired with more difficulty; fewer conjunctive tests', status: 'strong' },
    ],
  },
  {
    id: 'material',
    name: 'Material',
    color: '#7da6ff',
    count: '7 labels',
    entries: [
      { label: 'Wood', example: '"What matter?" → "wood" for wooden objects; combined with color and shape', status: 'robust' },
      { label: 'Metal', example: 'Generalized to novel metal objects; used in conjunctive queries', status: 'robust' },
      { label: 'Paper', example: '"Paper" used for paper items; correctly differentiated from wood', status: 'robust' },
      { label: 'Cork', example: 'Key material in published experimental objects (Pepperberg 1994)', status: 'robust' },
      { label: 'Wool', example: 'Soft material; generalized across colors', status: 'strong' },
      { label: 'Rock / stone', example: 'Later addition to material vocabulary', status: 'strong' },
      { label: 'Leather / hide', example: 'Used in some experimental objects; fewer data points', status: 'strong' },
    ],
  },
  {
    id: 'number',
    name: 'Number',
    color: '#4afdc6',
    count: '1–8',
    entries: [
      { label: '1–6', example: 'Cardinal labels trained explicitly; answered "How many?" for sets of 1–6 items', status: 'robust' },
      { label: '7 (inferred)', example: 'Given Arabic numeral "7" and asked its value: Alex inferred from ordinal position without cardinal training (Pepperberg & Carey 2012)', status: 'strong' },
      { label: '8 (inferred)', example: 'Same ordinal transfer for "8". Errors were mostly mislabeling of subsets, not random', status: 'strong' },
      { label: 'Heterogeneous subsets', example: '"How many blue squares?" in a tray with mixed objects — correct across multiple attributes', status: 'strong' },
      { label: '"None" / zero-like', example: 'When no item matched the query, Alex spontaneously said "none." Pepperberg calls it "zero-like," not isomorphic with human zero', status: 'contested' },
    ],
  },
  {
    id: 'conjunctive',
    name: 'Conjunctive Q',
    color: '#b57bee',
    count: 'Multi-attribute',
    entries: [
      { label: 'Color + Shape', example: '"What shape is green?" — identifies target from tray by two attributes', status: 'robust' },
      { label: 'Color + Material', example: '"What color is the wood?" — selects and labels by material + color', status: 'robust' },
      { label: 'Shape + Material', example: '"What matter is the triangle?" — identifies by shape and reports material', status: 'strong' },
      { label: 'Three-attribute', example: '"What color is the object that is both square AND wood?" — reported correct color in published experiments', status: 'strong' },
      { label: 'Same/different', example: '"What\'s same?" / "What\'s different?" between two objects — abstract relational labels', status: 'strong' },
    ],
  },
]

// ── Established vs contested ──────────────────────────────────────────────────

interface EvidenceItem {
  claim: string
  evidence: string
}

const ESTABLISHED: EvidenceItem[] = [
  { claim: 'Referential label use requires live social interaction', evidence: 'Replicated across multiple studies: video-only and single-trainer regimes both fail. The model/rival social dynamic is necessary, not incidental. (Pepperberg & McLaughlin 1996; Pepperberg, Gardiner & Luttrell 1999)' },
  { claim: 'Labels transfer to novel objects', evidence: 'Alex applied trained labels (color, shape, material) to objects not seen during training — not merely conditioned associations to specific training items.' },
  { claim: 'Conjunctive/categorical questions answered above chance', evidence: 'Multi-attribute questions ("What color is the object that is square AND wood?") require holding two attributes and selecting the target — well above chance in controlled trials.' },
  { claim: 'Vocal labels are used referentially, not just imitatively', evidence: 'Alex initiated labels spontaneously, used them in requests ("Wanna go back"), and produced them in appropriate new contexts — not simply echoing trained phrases.' },
]

const CONTESTED: EvidenceItem[] = [
  { claim: '"None" = zero concept', evidence: 'Sally Boysen and others argue that "none" may be a default expectancy-violation or "I don\'t know" response rather than a true zero concept. Pepperberg herself calls it "zero-like" — not isomorphic with the human cardinal zero.' },
  { claim: 'Ordinal-to-cardinal transfer', evidence: 'The inference from ordinal position to cardinal label is striking, but rests on a small-N design (single subject). Whether this reflects genuine conceptual transfer vs. a learned ordinal strategy is debated.' },
  { claim: 'Richest numerical interpretations', evidence: 'Whether Alex\'s numerical competence reflects counting vs. subitizing/clumping vs. a general magnitude sense is not fully resolved. Performance on sets > 6 came from a small number of test sessions.' },
  { claim: 'Absence of inadvertent cueing', evidence: 'Pepperberg implemented extensive cueing controls and rebutted cueing critiques (e.g., her 2015 reply to Jaakkola). The single-subject design and the Clever Hans legacy in animal cognition mean caution is warranted despite the controls.' },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function ParrotAlex() {
  const [mrStep, setMrStep] = useState<string>('display')
  const [category, setCategory] = useState<string>('color')
  const [tab, setTab] = useState<'established' | 'contested'>('established')

  const selStep = MR_STEPS.find(s => s.id === mrStep)!
  const selCat = CAPABILITIES.find(c => c.id === category)!
  const items = tab === 'established' ? ESTABLISHED : CONTESTED

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--parrot)', marginBottom: 8 }}>
          Parrots · The Alex Program
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Referential Cognition
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Over ~30 years, Irene Pepperberg used the model/rival technique to train the grey
          parrot Alex to use referential English labels for objects, colors, shapes, materials,
          and numbers up to 8. The social-learning requirement is robustly replicated; the
          richest numerical interpretations remain contested.
        </p>

        {/* Model/rival methodology */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '0 0 16px' }}>
          The Model/Rival Technique
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 20 }}>
          Two human trainers interact with the target object in front of the parrot, alternating
          as model (demonstrating correct labels) and rival (competing for the trainer's
          attention). The parrot joins the social interaction as a third participant — not as
          a passive observer being trained.
        </p>

        <div className="parrot-alex-mr">
          <div className="parrot-alex-mr-steps">
            {MR_STEPS.map(s => (
              <button
                key={s.id}
                className={`parrot-alex-mr-step${mrStep === s.id ? ' active' : ''}`}
                style={{ '--mr-color': s.color } as React.CSSProperties}
                onClick={() => setMrStep(s.id)}
              >
                <span className="parrot-alex-mr-who">{s.who}</span>
                <span className="parrot-alex-mr-role">{s.role}</span>
              </button>
            ))}
          </div>
          <div className="parrot-alex-mr-panel" style={{ borderLeftColor: selStep.color }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: selStep.color, margin: '0 0 10px' }}>
              {selStep.role}
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, margin: 0 }}>
              {selStep.detail}
            </p>
          </div>
        </div>

        <div className="bird-intro-callout" style={{ marginTop: 20 }}>
          <p className="bird-intro-callout-label">Why social interaction is required</p>
          <p>
            Video-only and single-trainer regimes both fail to produce referential label learning.
            The communicative pressure of the model/rival dynamic — not mere repetition — is
            necessary. This is a replicated, theoretically important result: it suggests parrot
            referential learning is driven by the same social motivations that drive human
            language acquisition.
          </p>
        </div>

        {/* Capability grid */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 16px' }}>
          Referential Capabilities
        </h3>

        <div className="parrot-alex-cats">
          {CAPABILITIES.map(c => (
            <button
              key={c.id}
              className={`parrot-alex-cat${category === c.id ? ' active' : ''}`}
              style={{ '--cat-color': c.color } as React.CSSProperties}
              onClick={() => setCategory(c.id)}
            >
              <span className="parrot-alex-cat-name">{c.name}</span>
              <span className="parrot-alex-cat-count">{c.count}</span>
            </button>
          ))}
        </div>

        <div className="parrot-alex-grid">
          {selCat.entries.map(e => (
            <div key={e.label} className={`parrot-alex-entry parrot-alex-entry--${e.status}`}
              style={{ '--cat-color': selCat.color } as React.CSSProperties}>
              <div className="parrot-alex-entry-header">
                <span className="parrot-alex-entry-label">{e.label}</span>
                <span className={`parrot-alex-entry-badge parrot-alex-entry-badge--${e.status}`}>
                  {e.status === 'robust' ? 'Robust' : e.status === 'strong' ? 'Strong' : 'Contested'}
                </span>
              </div>
              <p className="parrot-alex-entry-ex">{e.example}</p>
            </div>
          ))}
        </div>

        {/* Number / ordinal transfer */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 16px' }}>
          The Ordinal-to-Cardinal Transfer
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 20 }}>
          After being trained on cardinal labels "one" through "six" for sets of 1–6 items,
          Alex was given the Arabic numerals "7" and "8" and asked their values.
          He had never been trained on these cardinals — only on their ordinal positions.
        </p>

        <div className="parrot-alex-numline">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className={`parrot-alex-num${n <= 6 ? ' trained' : ' inferred'}`}>
              <div className="parrot-alex-num-circle">{n}</div>
              <span className="parrot-alex-num-tag">{n <= 6 ? 'Trained' : 'Inferred'}</span>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, marginTop: 16, fontStyle: 'italic' }}>
          Alex's errors were mostly mislabeling of subsets rather than random — consistent
          with a genuine ordinal-to-cardinal inference rather than guessing.
          (Pepperberg & Carey 2012, <em>Cognition</em>)
        </p>

        {/* Established vs contested */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 16px' }}>
          Evidence Assessment
        </h3>

        <div className="parrot-alex-assess-tabs">
          <button
            className={`parrot-alex-assess-tab${tab === 'established' ? ' active' : ''}`}
            style={{ '--at-color': '#8ae04a' } as React.CSSProperties}
            onClick={() => setTab('established')}
          >
            Established / robust
          </button>
          <button
            className={`parrot-alex-assess-tab${tab === 'contested' ? ' active' : ''}`}
            style={{ '--at-color': '#ff6b54' } as React.CSSProperties}
            onClick={() => setTab('contested')}
          >
            Contested / single-subject
          </button>
        </div>

        <div className="parrot-alex-assess-list">
          {items.map(item => (
            <div key={item.claim} className={`parrot-alex-assess-item parrot-alex-assess-item--${tab}`}>
              <p className="parrot-alex-assess-claim">{item.claim}</p>
              <p className="parrot-alex-assess-evidence">{item.evidence}</p>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="bird-intro-callout" style={{ marginTop: 40 }}>
          <p className="bird-intro-callout-label">The ape-language parallel</p>
          <p>
            The Alex program faces the same critiques as ape language training (Kanzi, Nim
            Chimpsky): small-N designs, training artifacts, rich vs. lean interpretation.
            The parrot work is, if anything, methodologically tighter on cueing controls
            than the early ape studies. The <em>referential label use under social training</em>
            is among the better-supported claims in animal cognition; the richest numerical
            and conceptual interpretations are suggestive but rest on a single exceptional animal.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '30 yr', label: 'Duration of the Alex program — from 1977 until Alex\'s death in 2007' },
            { val: '~50',   label: 'Vocal labels demonstrated referentially — colors, shapes, materials, numbers, relational terms' },
            { val: '0',     label: 'Alternative species that passed the ordinal-to-cardinal transfer test without cardinal training' },
          ].map(s => (
            <div key={s.label} className="stat-cell">
              <span className="stat-val" style={{ color: 'var(--parrot)', fontFamily: 'var(--font-display)' }}>
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
