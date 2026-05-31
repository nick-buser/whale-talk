import { useState } from 'react'

// ── Scatter plot data ─────────────────────────────────────────────────────────

interface SpeciesData {
  id: string
  label: string
  sx: number
  sy: number
  color: string
  tag: string
  headline: string
  body: string
}

const SPECIES: SpeciesData[] = [
  {
    id: 'birds',
    label: 'Songbirds',
    sx: 0.82, sy: 0.05,
    color: '#ffb472',
    tag: 'Rich syntax · No meaning',
    headline: 'Syntax without semantics',
    body: 'Oscine songbirds produce syllable sequences governed by finite-state grammars — the best-characterised animal phonological syntax. No syllable carries known meaning. They occupy the maximum-syntax, zero-reference corner.',
  },
  {
    id: 'cetaceans',
    label: 'Cetaceans',
    sx: 0.52, sy: 0.15,
    color: '#4afdc6',
    tag: 'Combinatorial form · Uncharted meaning',
    headline: 'Structure without a decoder',
    body: 'Cetaceans show Zipfian and Menzerath structure and signature whistles that converge with parrot contact calls — yet the bulk of their vocal repertoire is formally uninterpreted. Closer to birds on the syntax axis than to primates.',
  },
  {
    id: 'primates',
    label: 'Primates',
    sx: 0.18, sy: 0.68,
    color: '#b57bee',
    tag: 'Functional reference · No compositionality',
    headline: 'Semantics without syntax',
    body: 'Primates sit in the opposite corner from songbirds: rich reference, intentionality, and pragmatic inference — but no productive syntax. Their calls and gestures demonstrate the semantic building-blocks of language without the grammar that binds them.',
  },
  {
    id: 'parrots',
    label: 'Parrots',
    sx: 0.58, sy: 0.44,
    color: '#8ae04a',
    tag: 'Syntax + reference · Convergent hardware',
    headline: 'The fourth pillar',
    body: 'Parrots sit between songbirds and primates on both axes — they have more reference than any other bird (signature calls, trained labels) and more rule-governed syntax than primates. Uniquely, they combine oscine-grade vocal-learning hardware with a parrot-specific cortical elaboration (the "shell") and use their tongue as a vocal-tract articulator, convergent with human speech.',
  },
  {
    id: 'humans',
    label: 'Humans',
    sx: 0.93, sy: 0.93,
    color: '#ff6b54',
    tag: 'Recursive syntax · Compositional meaning',
    headline: 'Syntax bound to semantics',
    body: 'Humans uniquely couple recursive hierarchical syntax to compositional semantics with unlimited vocal production learning. Each of the four non-human pillars holds one piece of this: parrots come closest to holding two at once.',
  },
]

const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  birds:    { dx: 12,   dy: 4,   anchor: 'start' },
  cetaceans:{ dx: -12,  dy: 18,  anchor: 'end'   },
  primates: { dx: 12,   dy: 4,   anchor: 'start' },
  parrots:  { dx: -12,  dy: -14, anchor: 'end'   },
  humans:   { dx: 12,   dy: -10, anchor: 'start' },
}

const VB = '0 0 560 390'
const L = 64, R = 530, T = 28, B = 360
const PW = R - L, PH = B - T

function px(sx: number) { return L + sx * PW }
function py(sy: number) { return B - sy * PH }

function ComparePlot({ selected, onSelect }: {
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <svg viewBox={VB} width="100%" style={{ display: 'block' }} aria-label="Syntax–semantics design space">
      {[0.25, 0.5, 0.75].map(v => (
        <g key={v}>
          <line x1={px(v)} y1={T} x2={px(v)} y2={B} stroke="#b6c8df" strokeOpacity={0.12} strokeWidth={1} />
          <line x1={L} y1={py(v)} x2={R} y2={py(v)} stroke="#b6c8df" strokeOpacity={0.12} strokeWidth={1} />
        </g>
      ))}
      <line x1={L} y1={B} x2={R} y2={B} stroke="#b6c8df" strokeOpacity={0.35} strokeWidth={1.5} />
      <line x1={L} y1={T} x2={L} y2={B} stroke="#b6c8df" strokeOpacity={0.35} strokeWidth={1.5} />
      <text x={(L + R) / 2} y={B + 28} textAnchor="middle" fill="#b6c8df" fontSize={11}
            fontFamily="IBM Plex Sans" opacity={0.65} letterSpacing="0.06em">
        COMBINATORIAL SYNTAX →
      </text>
      <text x={L - 28} y={(T + B) / 2} textAnchor="middle" fill="#b6c8df" fontSize={11}
            fontFamily="IBM Plex Sans" opacity={0.65} letterSpacing="0.06em"
            transform={`rotate(-90, ${L - 28}, ${(T + B) / 2})`}>
        SEMANTIC REFERENCE →
      </text>
      <text x={L} y={B + 16} textAnchor="middle" fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>None</text>
      <text x={R} y={B + 16} textAnchor="middle" fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>Rich</text>
      <text x={L - 10} y={B} textAnchor="end" fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>None</text>
      <text x={L - 10} y={T + 4} textAnchor="end" fill="#b6c8df" fontSize={9} fontFamily="IBM Plex Mono" opacity={0.45}>Rich</text>
      {SPECIES.map(s => {
        const cx = px(s.sx), cy = py(s.sy)
        const isSel = selected === s.id
        const off = LABEL_OFFSET[s.id]
        return (
          <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(isSel ? null : s.id)}
             role="button" aria-label={s.label}>
            {isSel && <circle cx={cx} cy={cy} r={20} fill="none" stroke={s.color} strokeWidth={1.5} strokeOpacity={0.35} />}
            <circle cx={cx} cy={cy} r={12}
              fill={`color-mix(in oklch, ${s.color} ${isSel ? 30 : 16}%, transparent)`}
              stroke={s.color}
              strokeWidth={isSel ? 2 : 1.5}
              style={isSel ? { filter: `drop-shadow(0 0 8px ${s.color})` } : undefined}
            />
            <text x={cx + off.dx} y={cy + off.dy} fill={s.color} fontSize={12}
                  fontFamily="IBM Plex Sans" fontWeight={600} textAnchor={off.anchor}
                  opacity={isSel ? 1 : 0.75}>
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Three-channel data ────────────────────────────────────────────────────────

interface ChannelData {
  id: string
  label: string
  color: string
  tag: string
  headline: string
  body: string
  bullets: string[]
}

const CHANNELS: ChannelData[] = [
  {
    id: 'wild',
    label: 'Wild Vocalizations',
    color: '#8ae04a',
    tag: 'Signature calls · Rule-governed warble',
    headline: 'Reference and structure in the wild',
    body: 'Wild parrots are dominated by learned contact calls used for individual/flock recognition in dynamic fission-fusion flocks. Green-rumped parrotlet nestlings learn individually-distinctive signature calls from their parents — the clearest avian parallel to dolphin "names." Budgerigar warble is a separate, continuous, multi-element stream best modeled by a ≥5th-order Markov chain with 42 syllable classes — rule-governed, but never formally placed in the Chomsky hierarchy.',
    bullets: [
      'Signature contact calls: individually learned, used for lifelong recognition',
      'Cross-fostering experiment: nestlings acquire call from foster parents (Berg 2012)',
      'Warble: 42 syllable classes, ≥5th-order Markov (Tu, Osmanski & Dooling 2011)',
      'Formal-language class (regular/subregular): never determined — a genuine open question',
    ],
  },
  {
    id: 'alex',
    label: 'Referential Training',
    color: '#ffb472',
    tag: 'Object labels · Ordinal transfer · "None"',
    headline: 'The furthest any non-human has gone with labels',
    body: 'Pepperberg\'s grey parrot Alex used the model/rival technique over ~30 years to acquire referential English labels for objects, colors, shapes, and materials. Most strikingly, after training on cardinal labels 1–6, Alex inferred the correct labels for 7 and 8 from their ordinal position alone — a form of conceptual transfer. He also produced a spontaneous "none"/zero-like response. Critically, referential learning required live social interaction; video and single-trainer regimes failed — a replicated and theoretically important result.',
    bullets: [
      'Referential labels: object × color × shape × material conjunctive questions answered',
      'Ordinal-to-cardinal transfer: inferred "7" and "8" from position after training 1–6',
      '"None" / zero-like response produced spontaneously (Pepperberg — contested)',
      'Social requirement: live model/rival essential; video or single trainer fails (replicated)',
    ],
  },
  {
    id: 'neuro',
    label: 'Neural Architecture',
    color: '#7da6ff',
    tag: 'Core + shell · Convergent LMC · 2× neurons',
    headline: 'A song system within a song system',
    body: 'Parrots have a "core" song system resembling oscine nuclei, surrounded by a "shell" unique to parrots (Chakraborty et al. 2015). The shell is proportionally larger in grey parrots and macaws than in budgerigars. Yang & Long (2025, Nature) made the first population recordings in budgerigar AAC and found it organizes by phonetic-like features (especially vocal pitch) — a functional vocal-motor map convergent with human laryngeal motor cortex, unlike the zebra finch RA. Olkowicz et al. (2016) showed large parrots match or exceed primates in pallial neuron count at half the brain mass.',
    bullets: [
      'Core song system (NLC, AAC, MO, NAO) + parrot-unique surrounding shell',
      'Shell size correlates with vocal-mimicry complexity across species',
      'Budgerigar AAC: pitch-organized motor map convergent with human LMC (Yang & Long 2025)',
      'Blue-and-yellow macaw: 1,914M pallial neurons; macaque: 1,710M in a 5× larger brain',
    ],
  },
]

// ── Capability table ──────────────────────────────────────────────────────────

const TABLE_ROWS = [
  { dim: 'Vocal production learning', vals: ['Lifelong, open-ended (both sexes)', 'Via model/rival social training', 'AFP loop + direct forebrain→brainstem'] },
  { dim: 'Signature / individual labels',vals: ['Yes — learned from parents (Berg 2012)', 'Yes — object, color, material referents', 'Convergent with dolphin signatures'] },
  { dim: 'Compositional syntax',       vals: ['Unclassified; ≥5th-order Markov', 'No evidence', 'Unresolved'] },
  { dim: 'Reference / meaning',        vals: ['Affiliation + individual identity', 'Referential labeling + ordinal transfer', 'Pitch-organized AAC map (Yang & Long 2025)'] },
  { dim: 'Social learning requirement', vals: ['Pair/flock convergence in weeks', 'Live model/rival required (replicated)', 'Open-ended FoxP2 downregulation in MMSt'] },
  { dim: 'Key evidence',               vals: ['Berg 2012; Hile 2000; Tu 2011', 'Pepperberg 1994, 2012', 'Chakraborty 2015; Yang & Long 2025'] },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function ParrotIntro() {
  const [selected, setSelected] = useState<string | null>('parrots')
  const [channel, setChannel] = useState<string>('wild')

  const sel = SPECIES.find(s => s.id === selected)
  const ch = CHANNELS.find(c => c.id === channel)!

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--parrot)', marginBottom: 8 }}>
          Parrots · Introduction
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          The Fourth Pillar
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Parrots are the only vocal-learning bird that has crossed into learned individual
          referential labels. They sit between songbirds and primates in the design space —
          combining oscine-grade syntax hardware with the most flexible referential use among birds.
        </p>

        {/* Scatter plot + species panel */}
        <div className="bird-intro-grid">
          <div className="bird-intro-plot-wrap">
            <ComparePlot selected={selected} onSelect={setSelected} />
          </div>

          <aside className="bird-syntax-panel">
            {sel ? (
              <>
                <span className="bird-syntax-badge" style={{
                  color: sel.color,
                  borderColor: `color-mix(in oklch, ${sel.color} 40%, transparent)`,
                  background: `color-mix(in oklch, ${sel.color} 8%, transparent)`,
                }}>
                  {sel.tag}
                </span>
                <h3 className="bird-info-title" style={{ color: sel.color, marginTop: 14 }}>
                  {sel.headline}
                </h3>
                <p className="bird-info-body">{sel.body}</p>
              </>
            ) : (
              <>
                <p className="bird-info-sub" style={{ marginBottom: 10 }}>Design space</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
                  Five systems plotted on combinatorial syntax vs semantic reference.
                  Click any point to read its profile.
                </p>
              </>
            )}
          </aside>
        </div>

        {/* Three channels */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 20px' }}>
          Three Lines of Evidence
        </h3>

        <div className="primate-channels">
          {CHANNELS.map(c => (
            <button
              key={c.id}
              className={`primate-channel-tab${channel === c.id ? ' active' : ''}`}
              style={{ '--ch-color': c.color } as React.CSSProperties}
              onClick={() => setChannel(c.id)}
            >
              <span className="primate-channel-label">{c.label}</span>
              <span className="primate-channel-tag">{c.tag}</span>
            </button>
          ))}
        </div>

        <div className="primate-channel-panel" style={{ borderLeftColor: ch.color }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: ch.color, margin: '0 0 12px' }}>
            {ch.headline}
          </h4>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, margin: '0 0 16px' }}>
            {ch.body}
          </p>
          <ul className="primate-channel-bullets">
            {ch.bullets.map(b => <li key={b}>{b}</li>)}
          </ul>
        </div>

        {/* Capability table */}
        <div style={{ marginTop: 48, overflowX: 'auto' }}>
          <table className="bird-intro-table">
            <thead>
              <tr>
                <th></th>
                {CHANNELS.map(c => (
                  <th key={c.id} style={{ color: c.color }}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(row => (
                <tr key={row.dim}>
                  <td className="bird-intro-table-dim">{row.dim}</td>
                  {row.vals.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="bird-intro-callout">
          <p className="bird-intro-callout-label">The parrot position</p>
          <p>
            Parrots are the only non-human vocal learner that combines rule-governed phonological
            syntax <em>and</em> learned individual referential labels in the same animal. They do
            not cross into compositional semantics — but they narrow the gap between the bird
            corner and the primate corner more than any other species.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '42',   label: 'Syllable classes in budgerigar warble — never formally placed in the Chomsky hierarchy (Farabaugh 1992)' },
            { val: '29 Mya', label: 'Minimum age of parrot vocal learning — kea has a rudimentary shell, placing the origin before Strigopoidea divergence' },
            { val: '2×',   label: 'Pallial neurons relative to primates of the same brain mass — large parrots match macaques at half the weight (Olkowicz 2016)' },
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
