import { useState } from 'react'

/* ── All-six-pillar comparison ──────────────────────────────── */
interface PillarRow {
  feature: string
  whales: string
  birds: string
  primates: string
  parrots: string
  bees: string
  elephants: string
}

const ALL_PILLARS: PillarRow[] = [
  {
    feature: 'Primary channel',
    whales: 'Acoustic (infra–ultrasound)',
    birds: 'Acoustic (song)',
    primates: 'Acoustic + gesture',
    parrots: 'Acoustic (vocal learning)',
    bees: 'Kinesthetic + substrate vib.',
    elephants: 'Acoustic + seismic + chemical',
  },
  {
    feature: 'Vocal learning',
    whales: 'Open-ended (song)',
    birds: 'Open-ended (oscines)',
    primates: 'Minimal/absent',
    parrots: 'Open-ended',
    bees: 'None (innate)',
    elephants: 'Limited (individual cases)',
  },
  {
    feature: 'Combinatorial syntax',
    whales: 'Humpback hierarchical',
    birds: 'Oscine finite-state',
    primates: 'Minimal',
    parrots: 'Limited',
    bees: 'None',
    elephants: 'None demonstrated',
  },
  {
    feature: 'Displaced reference',
    whales: 'Not demonstrated',
    birds: 'Not demonstrated',
    primates: 'Minimal',
    parrots: 'Partial (contact calls)',
    bees: 'Full (waggle dance)',
    elephants: 'Partial (matriarch memory)',
  },
  {
    feature: 'Individual vocal ID',
    whales: 'Signature whistle (delphinids)',
    birds: 'Song-type recognition',
    primates: 'Individual calls (vervet)',
    parrots: 'Contact calls (~names)',
    bees: 'Queen piping only',
    elephants: '~100 individuals, 2 km',
  },
  {
    feature: 'Von Economo neurons',
    whales: 'Yes (multiple cetaceans)',
    birds: 'No',
    primates: 'Yes (great apes)',
    parrots: 'Not characterized',
    bees: 'No (no neocortex)',
    elephants: 'Yes (both species)',
  },
  {
    feature: 'Unique channel',
    whales: 'Echolocation (toothed)',
    birds: 'Oscine dual-voice (syrinx)',
    primates: 'Gestural intentionality',
    parrots: 'Tongue articulation',
    bees: 'Seismic + polar-coordinate dance',
    elephants: 'Seismic Rayleigh waves',
  },
  {
    feature: 'Hockett: displacement',
    whales: 'No',
    birds: 'No',
    primates: 'No',
    parrots: 'Partial',
    bees: 'Yes (productive)',
    elephants: 'Partial (matriarch; names contested)',
  },
]

/* ── Elephant-specific findings ─────────────────────────────── */
interface Finding {
  id: string
  title: string
  body: string
  accent: string
  type: 'unique' | 'convergent' | 'gap'
}

const FINDINGS: Finding[] = [
  {
    id: 'seismic-unique',
    title: 'Seismic channel — unique across all six pillars',
    body: 'No other species in the series uses ground-borne Rayleigh waves for communication. The physics (low-frequency long-range propagation across open substrate) is an ecological niche specialization unique to a large terrestrial body on open savanna.',
    accent: '#d4854a',
    type: 'unique',
  },
  {
    id: 'chem-unique',
    title: 'Largest olfactory receptor gene repertoire (~2,000)',
    body: 'African elephants have more functional OR genes than any other characterized mammal — more than 2× dog, ~5× human. Chemical/olfactory communication (musth, estrous, identity) is as central as acoustic communication, with no parallel in scale anywhere else in the series.',
    accent: '#e8941a',
    type: 'unique',
  },
  {
    id: 'neuron-paradox',
    title: 'The cortical-neuron paradox',
    body: 'The largest terrestrial brain has only chimp-level cortical neurons. This decouples neuron count from cognitive sophistication and is the most important caution against simple neuron-count-based hierarchies of intelligence or communicative capacity.',
    accent: '#c49a6c',
    type: 'unique',
  },
  {
    id: 'cetacean-conv',
    title: 'Deepest cetacean convergence — but fully homoplastic',
    body: 'Every shared trait — large brain, matrilineal fission-fusion, matriarch-as-repository, vocal learning, individual recognition, VEN neurons, infrasound — arose independently in Afrotheria and Boreoeutheria. The convergence is driven by a shared life-history syndrome, not shared ancestry.',
    accent: '#4afdc6',
    type: 'convergent',
  },
  {
    id: 'syntax-gap',
    title: 'Combinatorial syntax: an open gap',
    body: 'No Zipf analysis, no entropy-rate study, no formal-language placement has been applied to elephant call corpora comparable to what exists for birdsong, whale song, or even budgerigar warble. This is one of the largest methodological gaps in the field.',
    accent: '#ff6b54',
    type: 'gap',
  },
  {
    id: 'pathway-gap',
    title: 'Vocal-motor pathway: completely uncharacterized',
    body: 'Whether elephants possess a direct cortico-laryngeal projection (the anatomical hallmark of vocal learning shared across songbirds, parrots, cetaceans, and humans) is unknown. This is the single highest-priority neuroscience experiment for the field.',
    accent: '#ff6b54',
    type: 'gap',
  },
]

/* ── Hockett summary for elephants ─────────────────────────── */
const HOCKETT_SUMMARY = [
  { feature: 'Semanticity',          status: 'yes',     note: 'Individual identity, emotional state, hormonal context all encoded' },
  { feature: 'Displacement',         status: 'partial',  note: 'Matriarch memory of absent individuals; names claim contested' },
  { feature: 'Arbitrariness',        status: 'partial',  note: 'If naming holds; formant encoding of body size is non-arbitrary' },
  { feature: 'Productivity',         status: 'no',       note: 'No demonstrated open-ended combination of novel calls' },
  { feature: 'Duality of patterning', status: 'no',      note: 'Graded repertoire; no phonological level' },
  { feature: 'Cultural transmission', status: 'partial', note: 'Matriarch social knowledge; vocal learning is individual, not population-level' },
  { feature: 'Interchangeability',   status: 'yes',      note: 'Senders and receivers are interchangeable across contexts' },
  { feature: 'Broadcast transmission', status: 'yes',    note: 'Infrasound available to any receiver in range' },
]

const STATUS_COLORS2: Record<string, string> = {
  yes: '#4afdc6', partial: '#f4c430', no: 'var(--fg-quiet)',
}
const STATUS_CLASSES: Record<string, string> = {
  yes: 'bee-hockett-yes', partial: 'bee-hockett-partial', no: 'bee-hockett-no',
}

const TYPE_COLORS: Record<Finding['type'], string> = {
  unique: '#d4854a', convergent: '#4afdc6', gap: '#ff6b54',
}
const TYPE_LABELS: Record<Finding['type'], string> = {
  unique: 'Unique', convergent: 'Convergent', gap: 'Open gap',
}

export function ElephantConvergence() {
  const [activeCol, setActiveCol] = useState<keyof PillarRow>('elephants')
  const [activeFinding, setActiveFinding] = useState<string | null>(null)

  const COLS: Array<{ key: keyof PillarRow; label: string; color: string }> = [
    { key: 'whales',    label: 'Whales',    color: '#4afdc6' },
    { key: 'birds',     label: 'Birds',     color: '#ffb472' },
    { key: 'primates',  label: 'Primates',  color: '#b57bee' },
    { key: 'parrots',   label: 'Parrots',   color: '#8ae04a' },
    { key: 'bees',      label: 'Bees',      color: '#f4c430' },
    { key: 'elephants', label: 'Elephants', color: '#d4854a' },
  ]

  const activeColDef = COLS.find(c => c.key === activeCol)!

  return (
    <div className="elephant-conv-section">
      <p className="elephant-eyebrow">Convergence</p>
      <h1 className="elephant-title">Convergence & Synthesis</h1>
      <p className="elephant-lede">
        Elephants complete the series: semantics-heavy, syntax-light, uniquely multimodal,
        and the deepest convergence case with cetaceans. They also bring three
        wholly unique features — seismic channel, extreme olfactory repertoire, and the
        cortical-neuron paradox — that no other pillar contributes.
      </p>

      {/* All-six comparison table */}
      <div>
        <h2 className="elephant-h2">All Six Pillars — Side by Side</h2>
        <p className="elephant-sub">Click a column header to highlight that pillar.</p>
        <div className="elephant-conv-all-table">
          <div className="elephant-conv-all-head">
            <span>Feature</span>
            {COLS.map(c => (
              <button key={c.key}
                className={`elephant-conv-all-col-btn${activeCol === c.key ? ' active' : ''}`}
                style={{ '--col-color': c.color } as React.CSSProperties}
                onClick={() => setActiveCol(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {ALL_PILLARS.map(row => (
            <div key={row.feature} className="elephant-conv-all-row">
              <span className="elephant-conv-all-feature">{row.feature}</span>
              {COLS.map(c => (
                <span key={c.key}
                  className={`elephant-conv-all-cell${activeCol === c.key ? ' active' : ''}`}
                  style={{ '--col-color': c.color } as React.CSSProperties}
                >
                  {row[c.key]}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hockett summary */}
      <div>
        <h2 className="elephant-h2">Hockett Design Features — Elephants</h2>
        <div className="elephant-conv-hockett">
          <div className="elephant-conv-hockett-head">
            <span>Feature</span><span>Status</span><span>Notes</span>
          </div>
          {HOCKETT_SUMMARY.map(h => (
            <div key={h.feature} className="elephant-conv-hockett-row">
              <span className="elephant-conv-hockett-feat">{h.feature}</span>
              <span className={`bee-hockett-cell ${STATUS_CLASSES[h.status]}`} style={{ color: STATUS_COLORS2[h.status] }}>
                {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
              </span>
              <span className="elephant-conv-hockett-note">{h.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key findings */}
      <div>
        <h2 className="elephant-h2">Elephant-Specific Findings</h2>
        <div className="elephant-conv-findings">
          {FINDINGS.map(f => (
            <div key={f.id}
              className={`elephant-conv-finding${activeFinding === f.id ? ' active' : ''}`}
              style={{ '--find-color': f.accent } as React.CSSProperties}
              onClick={() => setActiveFinding(activeFinding === f.id ? null : f.id)}
            >
              <div className="elephant-conv-finding-head">
                <span className="elephant-conv-finding-title">{f.title}</span>
                <span className="elephant-conv-finding-type"
                  style={{ color: TYPE_COLORS[f.type] }}>{TYPE_LABELS[f.type]}</span>
              </div>
              {activeFinding === f.id && (
                <p className="elephant-conv-finding-body">{f.body}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final synthesis callout */}
      <div className="elephant-callout">
        <span className="elephant-callout-icon">🐘</span>
        <div>
          <strong>The series conclusion:</strong> Across all six pillars — whales, birds,
          primates, parrots, bees, elephants — no non-human system combines displacement,
          productivity, cultural transmission, and recursion. Each species reaches one or
          two of these properties via a different mechanism. Elephants reach rich reference,
          multimodal breadth, and the deepest social-cognitive convergence with cetaceans —
          but fall short on syntax, just as bees fall short on openness and primates fall
          short on both. The design space of animal communication is large, and no single
          species samples more than a fragment of it.
        </div>
      </div>
    </div>
  )
}
