import { useState } from 'react'

type Status = 'present' | 'contested' | 'absent' | 'inverted'
type Source = 'distilled' | 'convergent' | 'apparent' | 'mixed' | 'none'

interface Dim {
  id: string
  dimension: string
  exemplar: string
  status: Status
  statusText: string
  source: Source
  sourceText: string
  note: string
  keystone?: boolean
}

const DIMS: Dim[] = [
  {
    id: 'phon',
    dimension: 'Combinatorial / phonological syntax',
    exemplar: 'birdsong',
    status: 'present', statusText: 'Plausibly present',
    source: 'distilled', sourceText: 'Distilled',
    note: 'Subword/token recombination — trivially inherited from text. The model recombines tokens because the corpus does.',
  },
  {
    id: 'duality',
    dimension: 'Duality of patterning',
    exemplar: 'human capstone',
    status: 'present', statusText: 'Plausibly present',
    source: 'distilled', sourceText: 'Distilled',
    note: 'Meaningless tokens → meaningful sequences, inherited from the corpus structure. Two-level combinatorics borrowed wholesale.',
  },
  {
    id: 'comp',
    dimension: 'Compositional semantics',
    exemplar: 'the keystone',
    status: 'contested', statusText: 'Contested',
    source: 'mixed', sourceText: 'Distilled + partly Apparent',
    note: 'Brittle "subgraph matching" (Dziri 2023); human-like systematicity is achievable via a meta-learning objective, not scale alone (Lake & Baroni 2023). The keystone of the human bundle — and the degree LLMs have it is THE central question.',
    keystone: true,
  },
  {
    id: 'recursion',
    dimension: 'Hierarchical / recursive structure',
    exemplar: 'human',
    status: 'contested', statusText: 'Contested',
    source: 'distilled', sourceText: 'Distilled',
    note: 'Captured statistically within the context window; formally TC⁰-bounded (cannot do unbounded Dyck). Chain-of-thought externalizes state to gain real recursion-like power — but unfaithfully.',
  },
  {
    id: 'displaced',
    dimension: 'Displaced reference',
    exemplar: 'bee dance',
    status: 'absent', statusText: 'Contested → Absent (grounded sense)',
    source: 'apparent', sourceText: 'Apparent',
    note: 'The model produces text about absent things, but its world models are often incoherent (Vafa 2024) and there is no grounded referent. The bee dance points to a real food source; the model points to nothing.',
  },
  {
    id: 'arbitrary',
    dimension: 'Arbitrariness',
    exemplar: 'all systems',
    status: 'present', statusText: 'Plausibly present',
    source: 'distilled', sourceText: 'Distilled',
    note: 'Token–meaning mappings are inherited from the corpus and arbitrary by construction. The one Hockett feature LLMs get for free.',
  },
  {
    id: 'vpl',
    dimension: 'Production learning (as ontogeny)',
    exemplar: 'songbird, parrot, cetacean',
    status: 'absent', statusText: 'Absent',
    source: 'none', sourceText: '—',
    note: 'No sensorimotor babbling, no tutoring, no critical period. "Learning" is gradient descent over a static corpus — not developmental vocal learning. The ontogeny that defines the vocal-learning pillars is simply not present.',
  },
  {
    id: 'cultural',
    dimension: 'Cultural transmission',
    exemplar: 'whale song, birdsong dialects',
    status: 'inverted', statusText: 'Present but inverted',
    source: 'mixed', sourceText: 'See Inverted Bottleneck',
    note: 'LLMs are an imitation/transmission engine (Yiu et al. 2023) — but they lack the transmission bottleneck that makes human cultural transmission generative of structure (Galke 2022). Transmission without the bottleneck that builds structure.',
  },
  {
    id: 'multimodal',
    dimension: 'Multimodality',
    exemplar: 'elephant, bee',
    status: 'present', statusText: 'Plausibly present (engineering)',
    source: 'distilled', sourceText: 'Distilled',
    note: 'Added by training, not constitutive — and it does not resolve grounding (Mollo & Millière 2023: multimodality is neither necessary nor sufficient for referential grounding).',
  },
  {
    id: 'pragmatics',
    dimension: 'Pragmatics / cooperative intent',
    exemplar: 'human',
    status: 'contested', statusText: 'Contested',
    source: 'mixed', sourceText: 'Distilled (base) + engineered (RLHF)',
    note: 'RLHF simulates a Gricean speaker; genuine intent is unestablished (Jian & Siddharth 2024). The behavioral signature of cooperation without evidence of the thing itself.',
  },
  {
    id: 'efficiency',
    dimension: 'Information-theoretic efficiency laws',
    exemplar: 'Zipf / Menzerath / UID',
    status: 'present', statusText: 'Plausibly present',
    source: 'convergent', sourceText: 'Distilled AND plausibly Convergent',
    note: 'Reproduced from text AND possibly re-derived under the compression objective. THE cross-system commonality, and the single best candidate for a legitimately deep convergence rather than mere distillation. (See Compression & the Brain.)',
  },
  {
    id: 'integrated',
    dimension: 'The integrated bundle',
    exemplar: 'recursive integration + keystone',
    status: 'absent', statusText: 'Absent as an integrated whole',
    source: 'none', sourceText: '—',
    note: 'LLMs exhibit dissociated pieces, not the co-evolved recursive integration anchored on the compositional-semantic keystone. A disassembled kit, not the assembled whole.',
  },
]

const SOURCE_STYLE: Record<Source, { label: string; cls: string }> = {
  distilled:  { label: 'Distilled',  cls: 'src-distilled' },
  convergent: { label: 'Convergent', cls: 'src-convergent' },
  apparent:   { label: 'Apparent',   cls: 'src-apparent' },
  mixed:      { label: 'Mixed',      cls: 'src-mixed' },
  none:       { label: '—',          cls: 'src-none' },
}

const STATUS_STYLE: Record<Status, string> = {
  present:   'st-present',
  contested: 'st-contested',
  absent:    'st-absent',
  inverted:  'st-inverted',
}

export function LlmGrid() {
  const [open, setOpen] = useState<string | null>('comp')
  const [filter, setFilter] = useState<Source | 'all'>('all')

  const rows = filter === 'all' ? DIMS : DIMS.filter(d => d.source === filter || (filter === 'convergent' && d.source === 'convergent'))

  return (
    <div className="llm-section">
      <p className="llm-eyebrow">Pillar VIII · Machine Language</p>
      <h1 className="llm-title">The Diagnostic Grid</h1>
      <p className="llm-lede">
        The bundle, dimension by dimension, applied to LLMs. For each, a <strong>status</strong>{' '}
        (present / contested / absent) and — the novel axis — a <strong>source of resemblance</strong>:
        Distilled (culturally borrowed from training text), Convergent (independently arising from the
        objective), or Apparent (surface mimicry). The verdict: a disassembled kit, not the integrated whole.
      </p>

      {/* Source legend / filter */}
      <div className="llm-grid-legend">
        <button className={`llm-grid-filter${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {(['distilled', 'convergent', 'apparent'] as Source[]).map(s => (
          <button
            key={s}
            className={`llm-grid-filter ${SOURCE_STYLE[s].cls}${filter === s ? ' active' : ''}`}
            onClick={() => setFilter(filter === s ? 'all' : s)}
          >
            {SOURCE_STYLE[s].label}
          </button>
        ))}
      </div>

      <div className="llm-grid">
        <div className="llm-grid-head">
          <span>Bundle dimension</span>
          <span className="llm-grid-head-status">Status</span>
          <span className="llm-grid-head-source">Source</span>
        </div>
        {rows.map(d => (
          <div key={d.id} className={`llm-grid-block${d.keystone ? ' keystone' : ''}`}>
            <button className="llm-grid-row" onClick={() => setOpen(open === d.id ? null : d.id)}>
              <span className="llm-grid-dim">
                {d.dimension}
                {d.keystone && <span className="llm-grid-keystone">keystone</span>}
                <span className="llm-grid-exemplar">{d.exemplar}</span>
              </span>
              <span className={`llm-grid-status ${STATUS_STYLE[d.status]}`}>{d.statusText}</span>
              <span className={`llm-grid-source ${SOURCE_STYLE[d.source].cls}`}>{d.sourceText}</span>
            </button>
            {open === d.id && (
              <p className="llm-grid-note">{d.note}</p>
            )}
          </div>
        ))}
      </div>

      <div className="llm-callout">
        <div>
          <strong>The grid's verdict:</strong> LLMs exhibit many of the bundle's behavioral signatures —
          but as a <em>disassembled kit</em>, not the integrated, keystone-anchored whole. And almost every
          resemblance is <em>distilled</em> (borrowed from training text) rather than convergent, with the
          one crucial possible exception: the information-theoretic efficiency laws, which may arise
          independently from the compression objective. That single column is where the LLM–biology
          relationship might be genuinely deep rather than parasitic.
        </div>
      </div>
    </div>
  )
}
