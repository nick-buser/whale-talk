import { useState } from 'react'

/* ── Evidence timeline ──────────────────────────────────────── */
interface TimelineEvent {
  id: string
  year: string
  label: string
  type: 'support' | 'caution' | 'rebuttal'
  body: string
}

const TIMELINE: TimelineEvent[] = [
  {
    id: 't1', year: '2023', label: 'Pardo et al. preprint (bioRxiv)',
    type: 'support',
    body: '625 rumbles, 20.3% receiver-ID accuracy vs 7.6% null (p < 0.0001). Random forest on acoustic features with 6-fold cross-validation. Initial claim: elephants use arbitrary, non-imitative name-like calls.',
  },
  {
    id: 't2', year: '2024', label: 'Pardo et al. Nature Ecology & Evolution',
    type: 'support',
    body: 'Published version: 469 calls, 27.5% receiver-ID accuracy. 10,000-iteration permutation null. Playback experiment: 17 elephants responded faster and vocalized more to calls originally addressed to them vs. control calls from same caller.',
  },
  {
    id: 't3', year: '2024', label: 'Independent recognition context',
    type: 'caution',
    body: 'The authors report that receiver ID could NOT be predicted independently of caller ID (n = 437, one-tailed P ≈ 0.896). Any "name" is statistically entangled with caller identity — it cannot be isolated as a transferable label.',
  },
  {
    id: 't4', year: '2025', label: 'Author Correction (Nat. Ecol. Evol.)',
    type: 'caution',
    body: 'Five playback data-entry errors corrected. Cox regression for latency-to-vocalize: χ²=7.9 P=0.005 → χ²=6.2 P=0.013. Significance preserved but effect reduced. Dryad dataset reposted. Machine-learning analysis unchanged.',
  },
  {
    id: 't5', year: '2026', label: 'Dharmarajan rebuttal (Animal Behaviour)',
    type: 'rebuttal',
    body: 'Re-analysis of deposited data argues the random-forest evidence is affected by bias in the "black box" modeling pipeline. Specific bias mechanism and corrected effect sizes could not be verified from primary source; existence and target confirmed. No published Pardo reply yet.',
  },
]

/* ── Key contrasts: dolphin vs elephant naming ─────────────── */
const NAMING_CONTRAST = [
  { feature: 'Mechanism',          dolphins: 'Caller copies receiver\'s own signature whistle', elephants: 'Caller generates a label for the receiver — not imitative' },
  { feature: 'Arbitrariness',      dolphins: 'Partially iconic (copied from receiver)', elephants: 'Potentially fully arbitrary (caller-generated)' },
  { feature: 'Transferability',    dolphins: 'Label can be used by third parties', elephants: 'Not yet shown — entangled with caller identity' },
  { feature: 'Human parallel',     dolphins: 'Nicknaming (imitating the other\'s signal)', elephants: 'True naming (caller assigns unique label)' },
  { feature: 'Replication status', dolphins: 'Established (King & Janik 2013 + replications)', elephants: 'Single-lab, contested, not yet replicated' },
]

/* ── What the playback showed ───────────────────────────────── */
const PLAYBACK_POINTS = [
  { metric: 'N subjects', value: '17 wild elephants', note: 'Amboseli and Samburu populations' },
  { metric: 'Design', value: '2 conditions', note: 'Call addressed to subject vs. to different elephant, same caller' },
  { metric: 'Key result (original)', value: 'χ² = 7.9, P = 0.005', note: 'Latency-to-vocalize Cox regression (corrected to P = 0.013)' },
  { metric: 'Response pattern', value: 'Faster approach + more vocalizing', note: 'To self-addressed calls; consistent with recognition of own label' },
  { metric: 'Alternative', value: 'Affective/acoustic cue', note: 'Caller\'s state toward the specific receiver could differ, not requiring a discrete label' },
]

/* ── Verdict criteria ───────────────────────────────────────── */
const UPGRADE_CONDITIONS = [
  'Independent replication on a new population with separate recording team',
  'Receiver ID predictable above chance WITH caller identity properly partialled out (current P ≈ 0.896 is the crux)',
  'Preregistered playback with n > 17',
  'Substantive resolution or published reply to Dharmarajan (2026) statistical critique',
]

const TYPE_COLORS: Record<TimelineEvent['type'], string> = {
  support:  '#4afdc6',
  caution:  '#f4c430',
  rebuttal: '#ff6b54',
}

const TYPE_LABELS: Record<TimelineEvent['type'], string> = {
  support:  'Support',
  caution:  'Caution',
  rebuttal: 'Rebuttal',
}

export function ElephantNames() {
  const [activeEvent, setActiveEvent] = useState<string>('t2')
  const [showContrast, setShowContrast] = useState(true)

  const ev = TIMELINE.find(e => e.id === activeEvent)!

  return (
    <div className="elephant-names">
      <p className="elephant-eyebrow">Name-like Calls</p>
      <h1 className="elephant-title">Arbitrary Labels — Contested</h1>
      <p className="elephant-lede">
        Pardo et al. 2024 claim wild African elephants use non-imitative, individually-specific
        vocal labels — caller-generated "names" for receivers. If valid, this would be arbitrary
        vocal reference without combinatorial syntax in a non-human mammal. The claim is
        plausible, novel, and actively disputed.
      </p>

      {/* Evidence timeline */}
      <div>
        <h2 className="elephant-h2">Evidence Timeline</h2>
        <p className="elephant-sub">Click an event for details. Colors: support (teal), caution (gold), rebuttal (red).</p>
        <div className="elephant-names-timeline">
          {TIMELINE.map((e, i) => (
            <div key={e.id} className="elephant-names-timeline-item">
              <div className="elephant-names-timeline-connector">
                <div className="elephant-names-timeline-dot"
                  style={{ background: TYPE_COLORS[e.type], borderColor: TYPE_COLORS[e.type] }} />
                {i < TIMELINE.length - 1 && <div className="elephant-names-timeline-line" />}
              </div>
              <button
                className={`elephant-names-event${activeEvent === e.id ? ' active' : ''}`}
                style={{ '--ev-color': TYPE_COLORS[e.type] } as React.CSSProperties}
                onClick={() => setActiveEvent(e.id)}
              >
                <span className="elephant-names-event-year">{e.year}</span>
                <span className="elephant-names-event-label">{e.label}</span>
                <span className="elephant-names-event-type"
                  style={{ color: TYPE_COLORS[e.type] }}>{TYPE_LABELS[e.type]}</span>
              </button>
            </div>
          ))}
        </div>
        <div className="elephant-names-event-body" style={{ borderColor: TYPE_COLORS[ev.type] }}>
          <span className="elephant-names-event-body-head" style={{ color: TYPE_COLORS[ev.type] }}>
            {ev.year} — {ev.label}
          </span>
          <p className="elephant-names-event-body-text">{ev.body}</p>
        </div>
      </div>

      {/* Playback evidence */}
      <div>
        <h2 className="elephant-h2">The Playback Experiment</h2>
        <div className="elephant-names-playback">
          {PLAYBACK_POINTS.map(p => (
            <div key={p.metric} className="elephant-names-playback-row">
              <span className="elephant-names-playback-metric">{p.metric}</span>
              <span className="elephant-names-playback-val">{p.value}</span>
              <span className="elephant-names-playback-note">{p.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dolphin vs elephant contrast */}
      <div>
        <h2 className="elephant-h2">Elephants vs. Dolphins — Two Naming Mechanisms</h2>
        <div className="elephant-names-contrast-tabs">
          <button className={`elephant-tract-tab${showContrast ? ' active' : ''}`} onClick={() => setShowContrast(true)}>
            Compare
          </button>
          <button className={`elephant-tract-tab${!showContrast ? ' active' : ''}`} onClick={() => setShowContrast(false)}>
            Hide table
          </button>
        </div>
        {showContrast && (
          <div className="elephant-names-contrast-table">
            <div className="elephant-names-contrast-head">
              <span>Feature</span><span>Dolphins</span><span>Elephants</span>
            </div>
            {NAMING_CONTRAST.map(r => (
              <div key={r.feature} className="elephant-names-contrast-row">
                <span className="elephant-names-contrast-feature">{r.feature}</span>
                <span>{r.dolphins}</span>
                <span>{r.elephants}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade conditions */}
      <div className="elephant-names-verdict">
        <h2 className="elephant-h2">Threshold to Upgrade to "Established"</h2>
        <p className="elephant-sub">Current verdict: suggestive, not established. The four conditions below must be met.</p>
        <ol className="elephant-names-conditions">
          {UPGRADE_CONDITIONS.map((c, i) => (
            <li key={i} className="elephant-names-condition">
              <span className="elephant-names-condition-num">{i + 1}</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="elephant-callout">
        <span className="elephant-callout-icon">🔬</span>
        <div>
          <strong>Why this matters for the series:</strong> If the Pardo claim holds, elephants
          would be the only non-human mammal with demonstrably arbitrary vocal reference —
          a feature otherwise attributed only to humans. The mechanism (caller-generated label,
          not signature-copying) would be more radical than the dolphin case and would force
          a revision of theories that tie arbitrary reference to symbolic cognition or language.
          The Dharmarajan rebuttal means this is an open question, not a settled result.
        </div>
      </div>
    </div>
  )
}
