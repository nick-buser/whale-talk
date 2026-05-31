import { useState } from 'react'

/* ── Convergent features ────────────────────────────────────── */
interface ConvFeature {
  id: string
  feature: string
  bees: string
  humans: string
  overlap: 'full' | 'partial' | 'none'
  significance: string
}

const CONV_FEATURES: ConvFeature[] = [
  { id: 'displacement', feature: 'Displaced reference',        bees: 'Full (location absent in time & space)', humans: 'Full (unbounded)', overlap: 'full',    significance: 'Only two systems reach productive displacement independently. Evolutionary convergence on the same design goal.' },
  { id: 'composit',     feature: 'Compositional encoding',     bees: 'Angle + duration → location',           humans: 'Syntax → sentence meaning', overlap: 'partial', significance: 'Both combine sub-signals to produce a meaning not encoded in either alone. But bee composition is fixed-rule, not open-ended.' },
  { id: 'arbitrary',    feature: 'Arbitrary convention',       bees: 'Partial (angle maps to sun; not iconic)', humans: 'Strong (words arbitrary)', overlap: 'partial', significance: 'The mapping between dance angle and food direction is a convention, not an icon — but it is genetically fixed, not socially agreed.' },
  { id: 'precision',    feature: 'Metric precision',           bees: 'High (±3° direction, ±20m distance)', humans: 'Variable (context-dependent)', overlap: 'partial', significance: 'The waggle channel exceeds many human pointing systems in geometric precision, though it operates in a single domain.' },
  { id: 'openness',     feature: 'Openness / productivity',    bees: 'Within-domain open (any location)',    humans: 'Cross-domain open (anything)', overlap: 'partial', significance: 'Any reachable location in 360° × any distance can be encoded. But new domains (time, causation, hypotheticals) are inaccessible.' },
  { id: 'tradition',    feature: 'Cultural transmission',      bees: 'None — fully innate',                  humans: 'Primary mechanism', overlap: 'none',    significance: 'The bee dance is species-typical and not learned from conspecifics. Dialectal variation exists across subspecies but is genetic.' },
  { id: 'recursion',    feature: 'Recursion / hierarchical syntax', bees: 'None',                         humans: 'Core feature', overlap: 'none',    significance: 'No bee communication shows embedding. The channel is a flat two-parameter signal, not a hierarchical structure.' },
  { id: 'generalize',   feature: 'Cross-domain generalization', bees: 'None — foraging only',               humans: 'Unlimited', overlap: 'none',    significance: 'No evidence bees use dance-like encoding for swarming sites, predator warnings, or any non-foraging context — though swarm scouts do dance for nest sites.' },
]

/* ── Design space pillars ────────────────────────────────────── */
interface Pillar {
  id: string
  num: string
  label: string
  tagline: string
  color: string
  body: string
  bullets: string[]
}

const PILLARS: Pillar[] = [
  {
    id: 'channel',
    num: '01',
    label: 'Channel architecture',
    tagline: 'Different routes, same destination',
    color: '#f4c430',
    body: 'The bee waggle dance and human propositional language both transmit information about absent referents, but through radically different channel architectures. The dance is analog-geometric: angle and duration are continuous variables read off from a motor program. Human language is digital-combinatorial: discrete symbols combined by hierarchical rules.',
    bullets: [
      'Analog channel: angle and duration are graded, not categorical',
      'Fixed motor program, not a learned symbol system',
      'Geometric mapping to world coordinates (sun-compass)',
      'No evidence of phonological or morphological levels',
    ],
  },
  {
    id: 'evolution',
    label: 'Evolutionary path',
    num: '02',
    tagline: 'Two independently derived solutions',
    color: '#e8941a',
    body: 'Bees and humans arrived at displaced reference via completely independent evolutionary paths, separated by ~600 million years of divergence. The shared function (communicating about absent locations) did not arise from a shared ancestor with that capacity. This is strong evidence that displaced reference is a stable design solution in communication systems — it can be arrived at from very different starting points.',
    bullets: [
      '~600 Ma since insect–vertebrate divergence',
      'No shared neural substrate for displacement',
      'Bee dance present in Asian honeybee Apis dorsata; Australian Trigona lacks full dance — multiple origins even within bees',
      'Functional convergence, not homology',
    ],
  },
  {
    id: 'limits',
    label: 'The boundary conditions',
    num: '03',
    tagline: 'Where the channel ends',
    color: '#4afdc6',
    body: 'The critical observation is not just what bees can do but where the channel terminates. Bees are the most powerful non-human displacement system and the most constrained. The constraints reveal what additional machinery human language requires: cultural transmission of conventions, recursive hierarchical structure, ability to predicate properties of referents, and domain generalization.',
    bullets: [
      'No temporal indexing (cannot encode "yesterday\'s patch")',
      'No property predication (cannot say "the red flowers")',
      'No domain transfer (no evidence outside foraging + swarming)',
      'No receiver response beyond "go" or "ignore"',
    ],
  },
]

/* ── What bees reveal ────────────────────────────────────────── */
const REVEALS = [
  {
    id: 'rev1',
    title: 'Displacement does not require language',
    body: 'The claim that displaced reference requires symbolic language is empirically false. Bees achieve it without symbols. The question shifts to: what does human-style language add beyond displacement?',
    accent: '#f4c430',
  },
  {
    id: 'rev2',
    title: 'Neurons are not the bottleneck for displacement',
    body: 'With 1 million neurons, bees out-perform every non-human primate on displaced reference. The bottleneck is architectural — analog vs. digital, closed vs. open — not neural count.',
    accent: '#e8941a',
  },
  {
    id: 'rev3',
    title: 'Cultural transmission is critical for openness',
    body: 'The bee channel is closed because it is innate. Every human language, however simple, can be extended by cultural innovation. The link between learnability and openness is not accidental.',
    accent: '#4afdc6',
  },
  {
    id: 'rev4',
    title: 'The design-feature approach survives — and is sharpened',
    body: 'Hockett\'s 1960 list predicted that displacement would be the key differentiator. Six decades of comparative cognition confirm: bees have it, other non-humans mostly don\'t. The feature is real, and its distribution is informative.',
    accent: '#8ae04a',
  },
]

const OVERLAP_CLASS: Record<string, string> = {
  full:    'bee-conv-overlap-full',
  partial: 'bee-conv-overlap-partial',
  none:    'bee-conv-overlap-none',
}

const OVERLAP_LABEL: Record<string, string> = {
  full: 'Full',
  partial: 'Partial',
  none: 'None',
}

export function BeeConvergence() {
  const [activePillar, setActivePillar] = useState<string>('channel')
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const pillar = PILLARS.find(p => p.id === activePillar)!

  return (
    <div className="bee-conv">
      <p className="bee-intro-eyebrow">Convergence</p>
      <h1 className="bee-intro-title">Convergence & Synthesis</h1>
      <p className="bee-intro-lede">
        Bees and humans share displaced reference, compositional encoding, and geometric
        precision — but diverge on openness, cultural transmission, and recursion. Mapping
        the overlap and the gap specifies exactly what communication design features arise
        independently across deep evolutionary time, and which require language.
      </p>

      {/* Three pillars */}
      <div>
        <h2 className="bee-section-h2">Three Pillars of Synthesis</h2>
        <div className="bee-conv-pillars">
          {PILLARS.map(p => (
            <button
              key={p.id}
              className={`bee-conv-pillar${activePillar === p.id ? ' active' : ''}`}
              style={{ '--cp-color': p.color } as React.CSSProperties}
              onClick={() => setActivePillar(p.id)}
            >
              <span className="bee-conv-num">{p.num}</span>
              <span className="bee-conv-label">{p.label}</span>
              <span className="bee-conv-tagline">{p.tagline}</span>
            </button>
          ))}
        </div>
        <div className="bee-conv-panel" style={{ borderColor: pillar.color }}>
          <p className="bee-conv-body">{pillar.body}</p>
          <ul className="bee-nav-cap-list">
            {pillar.bullets.map((b, i) => (
              <li key={i} className="bee-nav-cap-item">{b}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feature comparison table */}
      <div>
        <h2 className="bee-section-h2">Bees vs. Human Language — Feature by Feature</h2>
        <p className="bee-intro-sub">Click a row for the significance of the overlap or gap.</p>
        <div className="bee-conv-table">
          <div className="bee-conv-table-head">
            <span>Feature</span>
            <span>Bees</span>
            <span>Humans</span>
            <span>Overlap</span>
          </div>
          {CONV_FEATURES.map(f => (
            <div
              key={f.id}
              className={`bee-conv-table-row${activeFeature === f.id ? ' active' : ''}`}
              onClick={() => setActiveFeature(activeFeature === f.id ? null : f.id)}
            >
              <span className="bee-conv-feat-name">{f.feature}</span>
              <span className="bee-conv-feat-cell">{f.bees}</span>
              <span className="bee-conv-feat-cell">{f.humans}</span>
              <span className={`bee-conv-overlap ${OVERLAP_CLASS[f.overlap]}`}>{OVERLAP_LABEL[f.overlap]}</span>
              {activeFeature === f.id && (
                <p className="bee-conv-feat-sig">{f.significance}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* What bees reveal */}
      <div>
        <h2 className="bee-section-h2">What Bees Reveal</h2>
        <div className="bee-conv-reveals">
          {REVEALS.map(r => (
            <div key={r.id} className="bee-conv-reveal" style={{ '--rev-color': r.accent } as React.CSSProperties}>
              <span className="bee-conv-reveal-title">{r.title}</span>
              <p className="bee-conv-reveal-body">{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final callout */}
      <div className="bee-intro-callout">
        <span className="bee-intro-callout-icon">⬡</span>
        <div>
          <strong>The bigger picture:</strong> Across whales, birds, primates, parrots, and bees,
          no non-human system combines displacement, productivity, cultural transmission, and
          recursion. Each species reaches one or two of these properties via a different mechanism —
          and each stops short of the combination. Bees stop at productivity without openness.
          That's the gap, and mapping it is the work of comparative cognition.
        </div>
      </div>
    </div>
  )
}
