import { useState } from 'react'

type CellVal = 'yes' | 'partial' | 'no' | 'contested' | 'human'

interface GridCell {
  val: CellVal
  note: string
}

interface Pillar {
  id: string
  label: string
  color: string
}

interface Feature {
  id: string
  label: string
  desc: string
}

const PILLARS: Pillar[] = [
  { id: 'whales',    label: 'Whales',    color: '#4afdc6' },
  { id: 'birds',     label: 'Birds',     color: '#ffb472' },
  { id: 'primates',  label: 'Primates',  color: '#b57bee' },
  { id: 'parrots',   label: 'Parrots',   color: '#8ae04a' },
  { id: 'bees',      label: 'Bees',      color: '#f4c430' },
  { id: 'elephants', label: 'Elephants', color: '#d4854a' },
  { id: 'human',     label: 'Human',     color: '#c9a84c' },
]

const FEATURES: Feature[] = [
  { id: 'vpl',          label: 'Vocal production learning', desc: 'Ability to modify vocalizations based on auditory experience — "open-ended" means new sounds can be acquired throughout life.' },
  { id: 'ref',          label: 'Functional reference',      desc: 'Calls or signals that refer to external objects, events, or locations — distinct from purely affective/emotional communication.' },
  { id: 'comp',         label: 'Compositional semantics',   desc: 'Meaning of a complex signal = f(meanings of parts + structure). Frege\'s principle. Requires recursive, structure-sensitive interpretation.' },
  { id: 'syntax',       label: 'Hierarchical syntax',       desc: 'Phrases embed inside phrases recursively, beyond what a finite-state grammar can express.' },
  { id: 'duality',      label: 'Duality of patterning',     desc: 'Two independent combinatorial levels: meaningless phoneme-like units → meaningful morpheme-like units → sentences.' },
  { id: 'displacement', label: 'Displacement',              desc: 'Reference to objects, events, or states not present in the immediate here-and-now — past, future, hypothetical, distant.' },
  { id: 'arbitrary',    label: 'Arbitrariness',             desc: 'Sound–meaning mappings are conventional, not iconic or intrinsically motivated.' },
  { id: 'cultural',     label: 'Cultural transmission',     desc: 'System is learned from conspecifics rather than being fully specified by the genome.' },
  { id: 'pragmatics',   label: 'Gricean pragmatics',        desc: 'Speakers/listeners coordinate on implicature, relevance, and common ground beyond literal truth conditions.' },
  { id: 'indivrecog',   label: 'Individual vocal recog.',   desc: 'Ability to identify specific individuals by their voice alone.' },
  { id: 'sign',         label: 'Gestural / sign mode',      desc: 'Communication through body movement (gesture, sign language, dance) rather than vocalisation.' },
  { id: 'formalclass',  label: 'Formal class (max.)',       desc: 'Highest formal complexity demonstrated. MCS = mildly context-sensitive; CF = context-free; FS = finite-state; SC = sub-regular; NC = non-combinatorial.' },
]

type GridData = Record<string, Record<string, GridCell>>

const GRID: GridData = {
  whales: {
    vpl:          { val: 'yes',       note: 'Open-ended vocal learning in humpbacks, belugas, killer whales; sperm whale coda dialects copied across groups.' },
    ref:          { val: 'partial',   note: 'No demonstrated functional reference to external objects. Signature whistles encode identity, not world-states.' },
    comp:         { val: 'no',        note: 'No evidence of compositional semantics in any cetacean system.' },
    syntax:       { val: 'partial',   note: 'Humpback song has hierarchical phrase structure but within finite-state bounds (Suzuki et al. 2006).' },
    duality:      { val: 'contested', note: 'Sharma 2024 claimed sperm whale codas show duality of patterning — the claim is contested and unreplicated.' },
    displacement: { val: 'no',        note: 'No demonstrated displacement — calls appear to reference current context.' },
    arbitrary:    { val: 'partial',   note: 'Coda dialects are group-conventional but may not be arbitrary vs. iconic.' },
    cultural:     { val: 'yes',       note: 'Humpback song spreads culturally across ocean basins; killer whale calls are clan-specific learned dialects.' },
    pragmatics:   { val: 'no',        note: 'No evidence of Gricean reasoning in cetaceans.' },
    indivrecog:   { val: 'yes',       note: 'Dolphin signature whistles enable reliable individual identification; humpback song identity encoding.' },
    sign:         { val: 'no',        note: 'No gestural communication documented.' },
    formalclass:  { val: 'partial',   note: 'Finite-state (humpback song). Sub-regular for most cetacean call sequences.' },
  },
  birds: {
    vpl:          { val: 'yes',       note: 'Oscine songbirds are the most-studied vocal learners; budgerigar vocal learning parallel. Corvids can imitate.' },
    ref:          { val: 'partial',   note: 'Alarm calls can be functionally referential (chickadee mobbing, corvid food calls) but not for arbitrary objects.' },
    comp:         { val: 'no',        note: 'Rearranging song syllables does not create new meanings; birdsong has no demonstrated compositional semantics.' },
    syntax:       { val: 'partial',   note: 'Bengalese finch song has hierarchical motif structure; zebra finch has syllable-sequence rules. Max: sub-regular to finite-state.' },
    duality:      { val: 'partial',   note: 'Birdsong has a phonological-like level (syllable recombination) but no semantic-compositional level. One level only.' },
    displacement: { val: 'no',        note: 'Bird calls and song appear to reference immediate context; no demonstrated displacement.' },
    arbitrary:    { val: 'no',        note: 'Song structure is species-specific and not arbitrary; alarms have innate structure, though learn-able.' },
    cultural:     { val: 'yes',       note: 'Song is socially learned from tutors; dialects form and evolve culturally.' },
    pragmatics:   { val: 'no',        note: 'No evidence of Gricean pragmatics. Some audience effects suggest basic perspective-taking.' },
    indivrecog:   { val: 'yes',       note: 'Many species recognize individuals by voice; zebra finches maintain lifelong vocal pair recognition.' },
    sign:         { val: 'no',        note: 'No gestural communication comparable to ape gesture.' },
    formalclass:  { val: 'partial',   note: 'Sub-regular to finite-state. Starling CF training (Gentner 2006) is disputed (Beckers 2012).' },
  },
  primates: {
    vpl:          { val: 'no',        note: 'Vocal production learning absent in non-human primates. Apes raised with humans do not acquire speech sounds.' },
    ref:          { val: 'yes',       note: 'Vervet alarm calls are the canonical case: 3 call types, 3 predator categories, 3 escape behaviors. Campbell\'s monkey alarm system extends this.' },
    comp:         { val: 'no',        note: 'Call combinations (pyow-hack, titi A→B) are idiom-like or additive — not compositional by Frege\'s standard.' },
    syntax:       { val: 'no',        note: 'No demonstrated recursive syntax. Call sequences are short, locally constrained, and non-productive.' },
    duality:      { val: 'no',        note: 'Campbell\'s -oo affix is one morphological rule, not a productive phonology.' },
    displacement: { val: 'no',        note: 'Calls appear to reference immediate context; no demonstrated past-tense or future reference.' },
    arbitrary:    { val: 'no',        note: 'Calls are mostly non-arbitrary (shared across groups without learning); gesture is more flexible.' },
    cultural:     { val: 'partial',   note: 'Some call variants are culturally transmitted; ape gesture vocabularies are culturally maintained.' },
    pragmatics:   { val: 'partial',   note: 'RSA modeling (Schlenker; Berthet 2024) shows receiver-sensitive production — proto-pragmatic. But not full Gricean reasoning.' },
    indivrecog:   { val: 'partial',   note: 'Individual recognition by voice documented in some primates; limited range and reliability.' },
    sign:         { val: 'yes',       note: 'Ape gesture: ~80-type lexicon in chimpanzees and bonobos (Graham & Hobaiter 2023); intentional, goal-directed, audience-sensitive.' },
    formalclass:  { val: 'partial',   note: 'Sub-regular. Call sequences are short Markov chains.' },
  },
  parrots: {
    vpl:          { val: 'yes',       note: 'Open-ended vocal learning: Alex learned ~150 object labels, colors, shapes, and numbers vocally.' },
    ref:          { val: 'yes',       note: 'Irene Pepperberg\'s Alex demonstrated object-referential labels for material, color, shape — and "wanna go back" displacement.' },
    comp:         { val: 'no',        note: 'No demonstrated compositional semantics; multi-label combinations are not structurally compositional.' },
    syntax:       { val: 'partial',   note: 'Wild parrot contact calls have phrase-level structure; Alex used 2-3 word combinations without clear recursive syntax.' },
    duality:      { val: 'no',        note: 'No documented phonological level distinct from semantic labels.' },
    displacement: { val: 'partial',   note: 'Alex used "wanna go back" to request return to lab cage — possible displacement; but most references are immediate.' },
    arbitrary:    { val: 'partial',   note: 'Labels are learned and somewhat arbitrary (Alex learned English words), but species-typical calls are not.' },
    cultural:     { val: 'yes',       note: 'Wild parrot dialects (budgerigars, orange-fronted parakeets) are culturally transmitted and shift across generations.' },
    pragmatics:   { val: 'partial',   note: 'Alex\'s "wanna X" requests show audience-sensitive communication; limited pragmatic flexibility.' },
    indivrecog:   { val: 'yes',       note: 'Individual recognition documented; parrot contact calls encode identity information.' },
    sign:         { val: 'no',        note: 'No gestural communication documented.' },
    formalclass:  { val: 'partial',   note: 'Unknown; likely sub-regular to finite-state for wild calls.' },
  },
  bees: {
    vpl:          { val: 'no',        note: 'Waggle dance is innate. No vocal learning — bees produce sound but it is not learned.' },
    ref:          { val: 'yes',       note: 'The waggle dance encodes the bearing and distance of a food source with remarkable precision (von Frisch 1967, Nobel Prize).' },
    comp:         { val: 'no',        note: 'The dance is analog, not combinatorial. Bearing and distance are encoded by continuous parameters, not discrete combining units.' },
    syntax:       { val: 'no',        note: 'No combinatorial syntax. The dance is a single signal encoding two continuous parameters.' },
    duality:      { val: 'no',        note: 'No discrete units at any level; encoding is continuous/analog.' },
    displacement: { val: 'yes',       note: 'The waggle dance references a location that is not perceptually present — pure displacement. The most precise displacement of any non-human system.' },
    arbitrary:    { val: 'no',        note: 'Dance orientation is iconic with solar bearing; duration is iconic with distance. Not arbitrary.' },
    cultural:     { val: 'no',        note: 'The dance is species-typical and genetically encoded; no cultural transmission of the form.' },
    pragmatics:   { val: 'no',        note: 'No evidence of Gricean reasoning; dance production is stimulus-driven.' },
    indivrecog:   { val: 'no',        note: 'No individual recognition; colony-level kin recognition by odor.' },
    sign:         { val: 'yes',       note: 'The waggle dance is a gestural/body-movement system — the most information-dense known non-human gestural signal.' },
    formalclass:  { val: 'no',        note: 'Non-combinatorial; no grammar. Analog signal encoding.' },
  },
  elephants: {
    vpl:          { val: 'partial',   note: 'Koshik (Asian elephant) produced Korean speech sounds. Mlaika imitated truck engine. But capacity is limited compared to cetaceans or songbirds.' },
    ref:          { val: 'yes',       note: 'Pardo et al. 2024: random-forest classifier identified call receivers at 27.5% accuracy — candidate arbitrary vocal labels. The Dharmarajan 2026 rebuttal raises caller-ID confounds.' },
    comp:         { val: 'no',        note: 'No demonstrated compositional semantics.' },
    syntax:       { val: 'no',        note: 'No documented combinatorial syntax in elephant calls.' },
    duality:      { val: 'no',        note: 'No phonological level or duality.' },
    displacement: { val: 'no',        note: 'Calls appear to reference immediate social context; no demonstrated displacement.' },
    arbitrary:    { val: 'partial',   note: 'If Pardo et al. 2024 arbitrary name-calls are confirmed, this would be partial arbitrariness. Currently contested.' },
    cultural:     { val: 'partial',   note: 'Matriarchal knowledge is socially transmitted; some call variants may be culturally specific, but less documented than cetaceans.' },
    pragmatics:   { val: 'partial',   note: 'Audience effects and referential looking suggest proto-pragmatic sensitivity. Not full Gricean reasoning.' },
    indivrecog:   { val: 'yes',       note: 'McComb et al. 2001: female elephants recognize up to ~100 individuals by voice at up to 2 km. One of the highest non-human capacities.' },
    sign:         { val: 'no',        note: 'No documented gestural communication; trunk use is manipulative, not communicative.' },
    formalclass:  { val: 'no',        note: 'Sub-regular. Call sequences are short and locally constrained.' },
  },
  human: {
    vpl:          { val: 'human',     note: 'Open-ended vocal learning, critical-period sensitive. Direct cortico-laryngeal projection enables fine-grained control unavailable to non-human primates.' },
    ref:          { val: 'human',     note: 'Reference to any object, event, property, relation, or abstract entity. Proper names, common nouns, pronouns — all referential mechanisms present.' },
    comp:         { val: 'human',     note: 'Full compositionality: meaning of "the big whale saw the small bird" is derived from parts + structure, and extends to any novel combination.' },
    syntax:       { val: 'human',     note: 'Mildly context-sensitive: recursive phrase embedding, cross-serial dependencies, unbounded hierarchical structure.' },
    duality:      { val: 'human',     note: 'Both levels: phoneme inventory (~11–141 by language) → morphemes; morphemes → sentences. Robustly documented across all 7,000+ languages and sign languages.' },
    displacement: { val: 'human',     note: 'Unrestricted: past, future, counterfactual, hypothetical, fictional, modal. No non-human system has unrestricted displacement.' },
    arbitrary:    { val: 'human',     note: 'Sound–meaning mappings are by convention. Iconicity exists (sound symbolism, onomatopoeia) but is not required or dominant.' },
    cultural:     { val: 'human',     note: 'Language is culturally transmitted; individual languages change across generations. No language is the same as 500 years ago.' },
    pragmatics:   { val: 'human',     note: 'Full Gricean pragmatics: scalar implicature, relevance, common ground, speech acts, irony, metaphor, indirect requests.' },
    indivrecog:   { val: 'human',     note: 'Highly reliable individual recognition by voice; also by name, face, gait, and a large lexicon of proper nouns.' },
    sign:         { val: 'human',     note: 'Natural sign languages (ASL, BSL, NSL, etc.) are full languages using the gestural-visual channel with the same neural substrate.' },
    formalclass:  { val: 'human',     note: 'MCS (mildly context-sensitive): above context-free (Shieber 1985 Swiss German argument); weakly generated by TAG, CCG, LIG, and HG.' },
  },
}

const VAL_STYLE: Record<CellVal, { label: string; className: string }> = {
  yes:       { label: 'Yes',       className: 'cell-yes' },
  partial:   { label: 'Partial',   className: 'cell-partial' },
  no:        { label: 'No',        className: 'cell-no' },
  contested: { label: 'Contested', className: 'cell-contested' },
  human:     { label: 'Yes',       className: 'cell-human' },
}

export function HumanGrid() {
  const [hoverPillar, setHoverPillar] = useState<string | null>(null)
  const [hoverFeature, setHoverFeature] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ note: string; label: string } | null>(null)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const featureDef = activeFeature ? FEATURES.find(f => f.id === activeFeature) : null

  return (
    <div className="human-section">
      <p className="human-eyebrow">Human Language</p>
      <h1 className="human-title">Seven-Pillar Grid</h1>
      <p className="human-lede">
        All six animal systems and human language, compared across twelve communicative
        dimensions. Hover a cell for a source note; click a feature name to expand its
        definition. The pattern: each system has a distinctive signature; only human
        language fills every column.
      </p>

      <div className="grid-legend">
        {Object.entries(VAL_STYLE).map(([val, def]) => (
          <span key={val} className={`grid-legend-item ${def.className}`}>{def.label}</span>
        ))}
      </div>

      <div className="grid-table-wrap">
        <div className="grid-table">
          {/* Header row */}
          <div className="grid-head-row">
            <div className="grid-corner" />
            {PILLARS.map(p => (
              <div
                key={p.id}
                className={`grid-col-head${hoverPillar === p.id ? ' highlight' : ''}`}
                style={{ color: p.color }}
                onMouseEnter={() => setHoverPillar(p.id)}
                onMouseLeave={() => setHoverPillar(null)}
              >
                {p.label}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {FEATURES.map(f => (
            <div key={f.id} className={`grid-row${hoverFeature === f.id ? ' row-highlight' : ''}`}>
              <div
                className={`grid-row-label${activeFeature === f.id ? ' active' : ''}`}
                onClick={() => setActiveFeature(activeFeature === f.id ? null : f.id)}
                onMouseEnter={() => setHoverFeature(f.id)}
                onMouseLeave={() => setHoverFeature(null)}
              >
                {f.label}
                <span className="grid-row-expand">{activeFeature === f.id ? '▲' : '▼'}</span>
              </div>
              {PILLARS.map(p => {
                const cell = GRID[p.id][f.id]
                const style = VAL_STYLE[cell.val]
                return (
                  <div
                    key={p.id}
                    className={`grid-cell ${style.className}${hoverPillar === p.id ? ' col-highlight' : ''}`}
                    onMouseEnter={() => { setHoverPillar(p.id); setHoverFeature(f.id); setTooltip({ note: cell.note, label: `${p.label} — ${f.label}` }) }}
                    onMouseLeave={() => { setHoverPillar(null); setHoverFeature(null); setTooltip(null) }}
                    title={cell.note}
                  >
                    <span className="grid-cell-dot" />
                    <span className="grid-cell-label">{style.label}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip / note panel */}
      {tooltip && (
        <div className="grid-tooltip">
          <span className="grid-tooltip-label">{tooltip.label}:</span>
          <span className="grid-tooltip-note">{tooltip.note}</span>
        </div>
      )}

      {/* Feature detail expand */}
      {featureDef && (
        <div className="grid-feature-detail">
          <span className="grid-feature-name">{featureDef.label}</span>
          <p className="grid-feature-desc">{featureDef.desc}</p>
        </div>
      )}

      <div className="human-callout">
        <div>
          <strong>Reading the pattern:</strong> No animal system has more than a few
          "Yes" entries across all twelve dimensions. Human language has all twelve.
          The closest individual systems: bees on displacement, songbirds on vocal
          learning + syntax, primates on functional reference + gesture. None comes
          close on compositionality — the column that remains empty except for humans.
        </div>
      </div>
    </div>
  )
}
