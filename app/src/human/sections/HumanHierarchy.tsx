import { useState } from 'react'

type Level = 'mcs' | 'cf' | 'regular' | 'subregular' | 'none'

interface LevelDef {
  id: Level
  name: string
  formal: string
  desc: string
  systems: string[]
  evidence: string
  color: string
}

const LEVELS: LevelDef[] = [
  {
    id: 'none',
    name: 'Non-combinatorial',
    formal: 'No grammar',
    desc: 'Signals encode states directly, without combinatorial structure. Adding units does not change meaning compositionally.',
    systems: ['Bees (waggle dance)', 'Vervet alarm calls'],
    evidence: 'Waggle dance encodes a single vector (bearing × distance) in a continuous analog signal — no discrete units combine to form new meanings.',
    color: '#888888',
  },
  {
    id: 'subregular',
    name: 'Sub-regular',
    formal: 'Strictly local / tier-based',
    desc: 'Sequences with local co-occurrence constraints (no bigram/trigram forbidden patterns). A proper sub-class of finite-state languages.',
    systems: ['Zebra finch song', 'Bengalese finch song', 'Most primate call sequences'],
    evidence: 'Bengalese finch song is well-modeled by variable-order Markov chains; forbidden trigrams but not long-distance dependencies. Consistent with tier-based strictly local grammars.',
    color: '#ffb472',
  },
  {
    id: 'regular',
    name: 'Finite-state / Regular',
    formal: 'Type 3 (Chomsky)',
    desc: 'Recognizable by a finite automaton. Long-distance dependencies allowed only if expressible as finite-state transitions.',
    systems: ['Humpback whale song (Suzuki et al. 2006)', 'Some corvid alarm sequences'],
    evidence: 'Humpback whale song has hierarchical phrase structure but within bounded depth — consistent with finite-state generation. No crossing dependencies demonstrated.',
    color: '#4afdc6',
  },
  {
    id: 'cf',
    name: 'Context-free',
    formal: 'Type 2 (Chomsky)',
    desc: 'Push-down automaton. Handles nested center-embedding (AnBn patterns) and recursive phrase structure without crossing dependencies.',
    systems: ['Claimed for Bengal finch (Gentner et al. 2006 — disputed)', 'Not confirmed for any non-human system'],
    evidence: 'Gentner et al. trained starlings on AnBn sequences; Beckers et al. 2012 argued this was achievable with finite-state mechanisms. No non-human system has survived rigorous CF testing.',
    color: '#b57bee',
  },
  {
    id: 'mcs',
    name: 'Mildly context-sensitive',
    formal: 'MCS: TAG / CCG / LIG / HG',
    desc: 'Above CF: handles cross-serial dependencies (Swiss German, Bambara) and some degree of scrambling. Below context-sensitive: polynomial parsing.',
    systems: ['Human language (all languages tested)'],
    evidence: 'Shieber 1985: Swiss German subordinate clauses have crossed dependencies (NPs and VPs interleave) — not generable by a CFG. TAG, CCG, LIG, and HG are weakly equivalent formalisms that generate exactly MCS languages.',
    color: '#c9a84c',
  },
]

export function HumanHierarchy() {
  const [active, setActive] = useState<Level>('mcs')
  const activeDef = LEVELS.find(l => l.id === active)!

  return (
    <div className="human-section">
      <p className="human-eyebrow">Human Language</p>
      <h1 className="human-title">Formal Hierarchy</h1>
      <p className="human-lede">
        Where does each animal communication system fall on the Chomsky hierarchy?
        Human language occupies a specific and narrow band: mildly context-sensitive (MCS).
        That is not the top — it is a precise, empirically motivated position.
      </p>

      {/* Nested hierarchy diagram */}
      <div className="hier-diagram-wrap">
        <svg viewBox="0 0 600 340" className="hier-svg" aria-label="Chomsky hierarchy">
          {/* Outermost: MCS */}
          <ellipse cx={300} cy={170} rx={285} ry={158} fill="color-mix(in oklch, #c9a84c 8%, transparent)" stroke="#c9a84c" strokeWidth="2" style={{ cursor: 'pointer' }} onClick={() => setActive('mcs')} />
          <text x={300} y={26} textAnchor="middle" fill="#c9a84c" fontSize="11" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.1em">MILDLY CONTEXT-SENSITIVE</text>

          {/* CF */}
          <ellipse cx={300} cy={178} rx={228} ry={122} fill="color-mix(in oklch, #b57bee 8%, transparent)" stroke="#b57bee" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setActive('cf')} />
          <text x={300} y={64} textAnchor="middle" fill="#b57bee" fontSize="10" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.08em">CONTEXT-FREE</text>

          {/* Regular */}
          <ellipse cx={300} cy={186} rx={170} ry={90} fill="color-mix(in oklch, #4afdc6 8%, transparent)" stroke="#4afdc6" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setActive('regular')} />
          <text x={300} y={102} textAnchor="middle" fill="#4afdc6" fontSize="10" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.08em">FINITE-STATE / REGULAR</text>

          {/* Sub-regular */}
          <ellipse cx={300} cy={196} rx={110} ry={62} fill="color-mix(in oklch, #ffb472 8%, transparent)" stroke="#ffb472" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setActive('subregular')} />
          <text x={300} y={140} textAnchor="middle" fill="#ffb472" fontSize="10" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.08em">SUB-REGULAR</text>

          {/* Non-combinatorial */}
          <ellipse cx={300} cy={208} rx={52} ry={36} fill="color-mix(in oklch, #888 15%, transparent)" stroke="#888888" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setActive('none')} />
          <text x={300} y={202} textAnchor="middle" fill="#aaaaaa" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.06em">NON-COMB.</text>
          <text x={300} y={215} textAnchor="middle" fill="#aaaaaa" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.06em">(e.g. bees)</text>

          {/* Human label outside */}
          <text x={548} y={40} textAnchor="end" fill="#c9a84c" fontSize="11" fontFamily="var(--font-sans)" fontStyle="italic">Human language</text>
          <line x1={490} y1={38} x2={525} y2={38} stroke="#c9a84c" strokeWidth="1" strokeDasharray="4 3" />
        </svg>
        <p className="hier-caption">Click a level to see details below.</p>
      </div>

      {/* Detail panel */}
      <div className="hier-detail" style={{ borderColor: activeDef.color }}>
        <div className="hier-detail-head">
          <span className="hier-level-name" style={{ color: activeDef.color }}>{activeDef.name}</span>
          <code className="hier-level-formal">{activeDef.formal}</code>
        </div>
        <p className="hier-detail-desc">{activeDef.desc}</p>
        <div className="hier-detail-systems">
          <span className="hier-detail-label">Systems at this level:</span>
          <div className="hier-system-tags">
            {activeDef.systems.map(s => (
              <span key={s} className="hier-system-tag" style={{ borderColor: activeDef.color, color: activeDef.color }}>{s}</span>
            ))}
          </div>
        </div>
        <p className="hier-evidence-label">Key evidence</p>
        <p className="hier-evidence">{activeDef.evidence}</p>
      </div>

      {/* Shieber box */}
      <div className="human-callout">
        <div>
          <strong>The Shieber 1985 argument:</strong> Swiss German subordinate clauses
          exhibit <em>cross-serial dependencies</em> — the NP arguments of multiple verbs
          interleave with the verbs in a pattern that no context-free grammar can generate.
          The string <code>d' Chind laa d' Meitschi em Hans es Huus hälfe aastriche</code>{' '}
          ("the children let the girls help Hans paint the house") has dependencies that
          cross in a way that requires MCS power. This is the standard argument that
          human language is strictly above context-free.
        </div>
      </div>

      <div className="hier-table-wrap">
        <h2 className="human-h2">All Systems at a Glance</h2>
        <div className="hier-table">
          <div className="hier-thead">
            <span>System</span>
            <span>Level</span>
            <span>Key evidence</span>
          </div>
          {[
            { system: 'Bees (waggle dance)', level: 'Non-combinatorial', color: '#888888', note: 'Continuous vector encoding; no discrete grammar' },
            { system: 'Vervet alarm calls', level: 'Non-combinatorial', color: '#888888', note: '3 discrete signals → 3 states; no combination' },
            { system: 'Zebra / Bengalese finch', level: 'Sub-regular', color: '#ffb472', note: 'Variable-order Markov; locally constrained sequences' },
            { system: 'Primate call sequences', level: 'Sub-regular', color: '#ffb472', note: 'Campbell\'s monkey suffix = local affixation rule' },
            { system: 'Humpback whale song', level: 'Finite-state', color: '#4afdc6', note: 'Hierarchical phrases within bounded depth' },
            { system: 'Starling (Gentner 2006)', level: 'Disputed CF', color: '#b57bee', note: 'Beckers 2012: finite-state reanalysis plausible' },
            { system: 'Human language', level: 'MCS (TAG/CCG/LIG)', color: '#c9a84c', note: 'Shieber 1985; Swiss German cross-serial dependencies' },
          ].map(row => (
            <div key={row.system} className="hier-trow">
              <span className="hier-tsystem">{row.system}</span>
              <span className="hier-tlevel" style={{ color: row.color }}>{row.level}</span>
              <span className="hier-tnote">{row.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
