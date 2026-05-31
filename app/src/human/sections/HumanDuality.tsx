import { useState } from 'react'

interface SystemDef {
  id: string
  label: string
  color: string
  level1: boolean | 'partial'
  level2: boolean | 'partial'
  level1note: string
  level2note: string
  note: string
}

const SYSTEMS: SystemDef[] = [
  {
    id: 'human',
    label: 'Human language',
    color: '#c9a84c',
    level1: true,
    level2: true,
    level1note: 'Phonemes: ~44 in English, 11–141 across languages. Meaningless atoms that distinguish minimal pairs (bit/bat/bet).',
    level2note: 'Morphemes → words → phrases → sentences. Compositional semantics at every level.',
    note: 'Canonical case. Two independent combinatorial systems stacked: phonology and syntax operate by different principles on different units.',
  },
  {
    id: 'sign',
    label: 'Sign language (ASL/BSL)',
    color: '#c9a84c',
    level1: true,
    level2: true,
    level1note: 'Primes: handshape, location, movement, palm orientation — meaningless atoms that distinguish signs (MOTHER vs FATHER differ in location).',
    level2note: 'Full morphosyntax: agreement, aspect marking, spatial grammar. Same amodal network as spoken language.',
    note: 'Sign languages independently developed duality of patterning — phoneme-like primes recombine to form signs that then combine syntactically.',
  },
  {
    id: 'birds',
    label: 'Oscine songbirds',
    color: '#ffb472',
    level1: true,
    level2: false,
    level1note: 'Song syllables are discrete, learned acoustic units that recombine into motifs and songs by species-specific rules.',
    level2note: 'No demonstrated semantic composition: rearranging syllables or elements does not create new meanings.',
    note: 'Birdsong has the phonological level — learned sound units combining by rule — but lacks compositional semantics. One level, not two.',
  },
  {
    id: 'whales',
    label: 'Sperm whale codas',
    color: '#4afdc6',
    level1: 'partial',
    level2: false,
    level1note: 'Sharma 2024: coda clicks may have a combinatorial structure analogous to phoneme-level units — claimed first evidence of duality in a non-human system. Heavily contested.',
    level2note: 'No semantic composition demonstrated at the coda-sequence level.',
    note: 'Contested partial case. If Sharma 2024 holds, sperm whale codas would have something like level 1 — but level 2 compositional semantics is absent.',
  },
  {
    id: 'primates',
    label: 'Primates',
    color: '#b57bee',
    level1: false,
    level2: false,
    level1note: 'Calls are holistic, not decomposable into sub-call units. Campbell\'s monkey -oo suffix is an exception — a single affix, not a productive phonology.',
    level2note: 'Call sequences (pyow-hack, titi A→B) show adjacency effects but not semantic composition from meaningless sub-units.',
    note: 'The -oo affix (krak→krak-oo) is morphology-adjacent but not evidence of a full phonological level: it is one rule over whole-call units.',
  },
  {
    id: 'bees',
    label: 'Bees',
    color: '#f4c430',
    level1: false,
    level2: false,
    level1note: 'The waggle dance encodes bearing and distance continuously — no discrete sub-dance units that recombine.',
    level2note: 'No combinatorial structure at either level.',
    note: 'The waggle dance is the most precise communication system after language for displacement, but it is analog, not combinatorial.',
  },
  {
    id: 'elephants',
    label: 'Elephants',
    color: '#d4854a',
    level1: false,
    level2: false,
    level1note: 'Rumbles, roars, and chirps are holistic calls, not combinations of sub-call phoneme-like units.',
    level2note: 'No combinatorial semantics demonstrated.',
    note: 'Elephant communication is rich in context and meaning but is not structured by duality of patterning.',
  },
]

export function HumanDuality() {
  const [active, setActive] = useState('human')

  const sys = SYSTEMS.find(s => s.id === active)!

  function badge(has: boolean | 'partial') {
    if (has === true) return <span className="duality-badge yes">Yes</span>
    if (has === 'partial') return <span className="duality-badge partial">Partial</span>
    return <span className="duality-badge no">No</span>
  }

  return (
    <div className="human-section">
      <p className="human-eyebrow">Human Language</p>
      <h1 className="human-title">Duality of Patterning</h1>
      <p className="human-lede">
        One of Hockett's 1960 design features that most sharply separates human language
        from animal communication: the same inventory of meaningless phonemes recombines
        to form an unlimited set of meaningful morphemes, which then recombine at a second
        independent level to form sentences. Two combinatorial systems, stacked.
      </p>

      {/* Conceptual diagram */}
      <div className="duality-diagram">
        <div className="duality-level level1">
          <div className="duality-level-label">Level 1 — Phonology</div>
          <div className="duality-atoms">
            {['/b/', '/æ/', '/t/', '/d/', '/ɪ/', '/g/'].map(p => (
              <span key={p} className="duality-atom">{p}</span>
            ))}
          </div>
          <div className="duality-arrow-row">
            <span className="duality-arrow-label">meaningless atoms recombine →</span>
          </div>
          <div className="duality-words">
            {['bat', 'bad', 'bit', 'bid', 'tab', 'bag', 'gab'].map(w => (
              <span key={w} className="duality-word">{w}</span>
            ))}
          </div>
        </div>
        <div className="duality-divider">
          <span className="duality-divider-label">both levels present only in human language (and sign languages)</span>
        </div>
        <div className="duality-level level2">
          <div className="duality-level-label">Level 2 — Syntax / Semantics</div>
          <div className="duality-atoms">
            {['[bat]', '[bit]', '[the]', '[big]', '[small]'].map(p => (
              <span key={p} className="duality-atom morph">{p}</span>
            ))}
          </div>
          <div className="duality-arrow-row">
            <span className="duality-arrow-label">meaningful units compose →</span>
          </div>
          <div className="duality-words">
            <span className="duality-sentence">the big bat bit the small bat</span>
          </div>
        </div>
      </div>

      {/* System selector */}
      <h2 className="human-h2">Across the Pillars</h2>
      <div className="duality-sys-tabs">
        {SYSTEMS.map(s => (
          <button
            key={s.id}
            className={`duality-sys-tab${active === s.id ? ' active' : ''}`}
            style={active === s.id ? { borderColor: s.color, color: s.color } : {}}
            onClick={() => setActive(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="duality-detail" style={{ borderColor: sys.color }}>
        <div className="duality-detail-header">
          <span className="duality-detail-name" style={{ color: sys.color }}>{sys.label}</span>
        </div>
        <div className="duality-levels-grid">
          <div className="duality-level-row">
            <div className="duality-level-title">Level 1 (Phonological)</div>
            <div>{badge(sys.level1)}</div>
            <p className="duality-level-note">{sys.level1note}</p>
          </div>
          <div className="duality-level-row">
            <div className="duality-level-title">Level 2 (Compositional)</div>
            <div>{badge(sys.level2)}</div>
            <p className="duality-level-note">{sys.level2note}</p>
          </div>
        </div>
        <div className="duality-verdict">
          <span className="duality-verdict-label">Verdict:</span> {sys.note}
        </div>
      </div>

      <div className="human-callout">
        <div>
          <strong>The ABSL edge case (Al-Sayyid Bedouin Sign Language):</strong> Sandler et al.
          2011 showed that ABSL, a young village sign language, developed phonological structure
          (sub-sign primes) within ~75 years of emergence — suggesting duality arises rapidly
          from language-internal pressures toward learnability and distinctiveness,
          not from cultural transmission over millennia.
        </div>
      </div>
    </div>
  )
}
