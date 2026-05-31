import { useState } from 'react'

// ── Cross-fostering experiment steps ─────────────────────────────────────────

const STEPS = [
  {
    num: '1',
    label: 'Biological parents',
    body: 'Each green-rumped parrotlet pair has a distinctive contact call — individually unique in frequency contour and timing.',
    accent: '#8ae04a',
  },
  {
    num: '2',
    label: 'Eggs swapped',
    body: 'Before hatching, Berg et al. moved eggs between nests. Chicks develop with unrelated foster parents — no exposure to biological parents\' calls.',
    accent: '#ffb472',
  },
  {
    num: '3',
    label: 'Raised by foster parents',
    body: 'The nestling hears only the foster parents\' calls during the sensitive developmental period. Foster parents do not adjust their calls.',
    accent: '#7da6ff',
  },
  {
    num: '4',
    label: 'Result: foster call acquired',
    body: 'The adult chick\'s contact call matches the foster parents\' signature — not the biological parents\'. The label is entirely learned, not inherited.',
    accent: '#8ae04a',
  },
]

// ── Convergence comparison data ───────────────────────────────────────────────

interface CompareRow {
  label: string
  parrot: string
  dolphin: string
}

const COMPARE_ROWS: CompareRow[] = [
  { label: 'Species',          parrot: 'Green-rumped parrotlet (Forpus passerinus)', dolphin: 'Bottlenose dolphin (Tursiops truncatus)' },
  { label: 'How acquired',     parrot: 'Learned from parents during nestling period', dolphin: 'Invented de novo in first year of life' },
  { label: 'Individually unique', parrot: 'Yes — each bird has a distinct call', dolphin: 'Yes — each dolphin has a distinct whistle' },
  { label: 'Direction of copying', parrot: 'Offspring copies parents; males copy mate during bonding', dolphin: 'Others copy the individual\'s signature (social mirroring)' },
  { label: 'Function',         parrot: 'Individual ID, flock cohesion, pair bond maintenance', dolphin: 'Identity signalling, reunion, social bonding' },
  { label: 'Addressing by name', parrot: 'Implied by copying (call convergence)', dolphin: 'Experimentally demonstrated (King & Janik 2013)' },
  { label: 'Lifelong plasticity', parrot: 'Yes — continues to update calls through adulthood', dolphin: 'Signature stable; copying selective and maintained' },
  { label: 'Key evidence',     parrot: 'Berg et al. 2012 (cross-fostering)', dolphin: 'King & Janik 2013 (PNAS)' },
]

// ── Accordion items ───────────────────────────────────────────────────────────

interface AccordionItem {
  id: string
  label: string
  body: string
}

const ACCORDION: AccordionItem[] = [
  {
    id: 'arbitrary',
    label: 'Are the calls arbitrary labels?',
    body: 'In human names and dolphin signature whistles, the acoustic form has no iconic relationship to the referent — the signal is arbitrary. Parrot signature calls are individually distinctive but their acoustic form may be partly influenced by dialects shared within flocks. The degree of arbitrariness vs. culturally patterned form is a genuine open question. Spectacled parrotlets (Forpus conspicillatus) go further: Wanker et al. documented that birds vocally label specific family members, not just their own identity — a closer parallel to human name use.',
  },
  {
    id: 'direction',
    label: 'Parent→offspring vs. individual invention',
    body: 'In parrotlets, the direction is top-down: parents\' calls shape the offspring\'s call through learning in the nest. In dolphins, each individual invents its own signature whistle in the first year of life; others then copy it when addressing that individual. These are functionally equivalent outcomes — learned arbitrary individual labels — arrived at through different learning mechanisms. The convergence at the functional level is real even if the acquisition pathway differs.',
  },
  {
    id: 'pair',
    label: 'Pair-bond convergence (budgerigars)',
    body: 'In budgerigars, the convergence mechanism plays out in adult life: Hile, Plummer & Striedter (2000) showed that 8 of 9 males imitated their assigned mate\'s contact call during pair formation, with a shared call developing on average within 2.1 weeks. Female groups converge on a shared call type within 4–8 weeks of cohabitation. This is not merely acoustic accommodation — the male adopts the female\'s call, losing some individuality in favour of pair identity. Wild parrots show analogous dialect formation: immigrants preferentially adopt local call types (biased cultural transmission).',
  },
  {
    id: 'naming',
    label: 'Does this count as naming?',
    body: 'King & Janik (2013, PNAS) played back signature whistles of individual dolphins to groups and found that individuals selectively responded to their own whistle — and that dolphins copy the signature whistle of a social partner to "call" them. This is the closest any non-human has come to name use: a learned, arbitrary, individually-distinctive label that is used to address a specific other individual. Parrot cross-fostering shows the label is learned rather than inherited; the addressing-by-copy mechanism in budgerigars parallels the dolphin result. Together they are the two clearest non-human cases of learned arbitrary individual labels.',
  },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function ParrotSignature() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--parrot)', marginBottom: 8 }}>
          Parrots · Signature Calls
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Learned Names
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Green-rumped parrotlet nestlings learn individually-distinctive contact calls from
          their parents — demonstrated by cross-fostering. This makes parrots and bottlenose
          dolphins the two clearest non-human cases of learned, arbitrary individual vocal labels.
        </p>

        {/* Cross-fostering experiment */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '0 0 24px' }}>
          The Cross-Fostering Experiment
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 28 }}>
          Berg, Delgado, Cortopassi, Beissinger & Bradbury (2012, <em>Proc R Soc B</em>) moved
          eggs between nests before hatching, then compared nestlings' adult calls to those of
          their biological vs. foster parents. If calls were genetically inherited, nestlings
          would sound like their biological parents. Instead:
        </p>

        <div className="parrot-sig-steps">
          {STEPS.map((s, i) => (
            <div key={s.num} className="parrot-sig-step-wrap">
              <div className="parrot-sig-step" style={{ '--sig-accent': s.accent } as React.CSSProperties}>
                <span className="parrot-sig-step-num">{s.num}</span>
                <span className="parrot-sig-step-label">{s.label}</span>
                <p className="parrot-sig-step-body">{s.body}</p>
              </div>
              {i < STEPS.length - 1 && <span className="parrot-sig-step-arrow" aria-hidden="true">→</span>}
            </div>
          ))}
        </div>

        <div className="bird-intro-callout" style={{ marginTop: 32 }}>
          <p className="bird-intro-callout-label">Finding</p>
          <p>
            Nestlings' calls were significantly more similar to foster parents' calls than to
            biological parents' calls. Contact-call identity is entirely a product of social
            learning — a vocal "name" inherited culturally, not genetically.
          </p>
        </div>

        {/* Parrot vs dolphin comparison */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 8px' }}>
          Convergence with Dolphin Signature Whistles
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 28 }}>
          Two completely unrelated lineages — Psittaciformes and Cetacea — independently evolved
          learned, individually-distinctive vocal labels serving the same social function.
        </p>

        <div className="parrot-sig-compare" role="table" aria-label="Parrot vs dolphin signature call comparison">
          <div className="parrot-sig-compare-header" role="row">
            <div className="parrot-sig-compare-dim" role="columnheader"></div>
            <div className="parrot-sig-compare-col" role="columnheader" style={{ color: 'var(--parrot)' }}>
              Parrot signature call
            </div>
            <div className="parrot-sig-compare-col" role="columnheader" style={{ color: '#4afdc6' }}>
              Dolphin signature whistle
            </div>
          </div>
          {COMPARE_ROWS.map(row => (
            <div key={row.label} className="parrot-sig-compare-row" role="row">
              <div className="parrot-sig-compare-dim" role="rowheader">{row.label}</div>
              <div className="parrot-sig-compare-cell" role="cell">{row.parrot}</div>
              <div className="parrot-sig-compare-cell" role="cell">{row.dolphin}</div>
            </div>
          ))}
        </div>

        {/* Accordion */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 20px' }}>
          Key Questions
        </h3>

        <div className="primate-limits">
          {ACCORDION.map(item => (
            <div
              key={item.id}
              className={`primate-limit-card${expanded === item.id ? ' open' : ''}`}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              role="button"
              aria-expanded={expanded === item.id}
            >
              <div className="primate-limit-header">
                <span className="primate-limit-label">{item.label}</span>
                <span className="primate-limit-caret">{expanded === item.id ? '−' : '+'}</span>
              </div>
              {expanded === item.id && (
                <p className="primate-limit-body">{item.body}</p>
              )}
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="bird-intro-callout" style={{ marginTop: 40 }}>
          <p className="bird-intro-callout-label">The shared pattern</p>
          <p>
            Parrots and dolphins arrived at learned individual labels via different routes —
            parent-to-offspring transmission vs. individual invention. The convergence is at the
            functional level: both produce a learned, arbitrary, individually-distinctive
            signal used for social identity and address. This is the closest any non-human
            system comes to the function of a name.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '2.1 wk', label: 'Average time for budgerigar pair to converge on a shared contact call (Hile et al. 2000)' },
            { val: '8/9',    label: 'Male budgerigars who imitated their mate\'s contact call during pair bonding (Hile et al. 2000)' },
            { val: '2',      label: 'Species with clear experimental evidence for learned arbitrary individual vocal labels: parrot + dolphin' },
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
