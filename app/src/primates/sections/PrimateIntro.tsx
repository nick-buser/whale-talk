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
    body: 'Oscine songbirds produce syllable sequences governed by probabilistic finite-state grammars. No syllable carries known meaning. Birdsong is the direct complement of primate vocalizations: intricate rule-governed structure with nothing to say.',
  },
  {
    id: 'primates',
    label: 'Primates',
    sx: 0.18, sy: 0.68,
    color: '#4afdc6',
    tag: 'Functional reference · No compositionality',
    headline: 'Semantics without syntax',
    body: 'Primates sit in the opposite corner from songbirds: rich reference, intentionality, and pragmatic inference — but no productive syntax. Three independent lines of evidence (vocalizations, gesture, language training) converge on the same conclusion: primates demonstrate the building blocks of meaning without the grammar that binds them.',
  },
  {
    id: 'whales',
    label: 'Cetaceans',
    sx: 0.52, sy: 0.15,
    color: '#7da6ff',
    tag: 'Combinatorial form · Uncharted meaning',
    headline: 'Structure without a decoder',
    body: 'Cetaceans show rich combinatorial structure (Zipf\'s law, Menzerath\'s law, hierarchical coda organization) but meaning is essentially undecoded. They cluster closer to birds on the syntax axis than to primates.',
  },
  {
    id: 'humans',
    label: 'Humans',
    sx: 0.93, sy: 0.93,
    color: '#ff6b54',
    tag: 'Recursive syntax · Compositional meaning',
    headline: 'Syntax bound to semantics',
    body: 'Humans uniquely occupy the upper-right corner: recursive hierarchical syntax coupled to compositional semantics with unlimited vocal production learning. The human innovation is not adding syntax to primate semantics, or meaning to birdsong — it is coupling the two systems.',
  },
]

const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  birds:    { dx: 12,  dy: 4,   anchor: 'start' },
  primates: { dx: 12,  dy: 4,   anchor: 'start' },
  whales:   { dx: -12, dy: 18,  anchor: 'end'   },
  humans:   { dx: 12,  dy: -10, anchor: 'start' },
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
    id: 'vocal',
    label: 'Vocalizations',
    color: '#4afdc6',
    tag: 'Functionally referential',
    headline: 'Reference without grammar',
    body: 'Vervet alarm calls (Seyfarth et al. 1980) are the canonical case: three call types elicit predator-specific escape behaviors even on playback. The reference is functional — the call picks out a predator class — but whether this constitutes encoded semantics or arousal-plus-inference is contested. Campbell\'s monkey adds the closest thing to primate morphology: a "-oo" suffix reduces urgency and combines with krak/hok calls. Yet the flagship "proto-syntax" result — the putty-nosed monkey pyow-hack sequence — proved idiomatic on direct test (Arnold & Zuberbühler 2011): its meaning is not derived from its parts.',
    bullets: [
      'Vervet three-call alarm system — aerial, terrestrial, snake predators (Seyfarth 1980)',
      'Campbell\'s monkey "-oo" suffix: reduces urgency, closest to primate morphological productivity',
      'Pyow-hack idiom: observed meaning ≠ sum-of-parts (Arnold & Zuberbühler 2011)',
      'Cotton-top tamarin: fails AⁿBⁿ grammar recognition (Fitch & Hauser 2004)',
    ],
  },
  {
    id: 'gesture',
    label: 'Gesture',
    color: '#ffb472',
    tag: 'Intentional ~80-item lexicon',
    headline: 'Intentionality without syntax',
    body: 'Great-ape gesture is the strongest evidence for primate semantics. Hobaiter & Byrne (2014) documented ~80 gesture types in wild chimpanzees with consistent meanings across individuals — a functional lexicon with full intentionality criteria met: gestures are directed, attention-checked, and repeated if the recipient does not respond. Graham & Hobaiter (2023, PLOS Biology, n=5,656) showed naive humans interpret ape gestures above chance without prior exposure. The limitation: gesture combinations are non-additive. Meanings do not compose — combinations are idiomatic rather than generated by rule.',
    bullets: [
      '~80 gesture types with consistent meanings in wild chimpanzees (Hobaiter & Byrne 2014)',
      'Full intentionality: directed, attention-checked, repeated if ignored',
      'Human cross-species comprehension above chance (Graham & Hobaiter 2023, n=5,656)',
      'Combinations are non-additive — idiomatic, not compositional',
    ],
  },
  {
    id: 'training',
    label: 'Language Training',
    color: '#7da6ff',
    tag: 'Lexical reference · No grammar',
    headline: 'The productivity test failure',
    body: 'Decades of ape language training established that apes can learn to use symbols referentially and intentionally (Washoe, Nim Chimpsky, Kanzi, Chantek). The grammar question was settled by Yang (2013): a productive grammar should generate a Zipfian distribution heavily weighted toward novel combinations (many hapax legomena). Nim Chimpsky\'s 19,000+ documented combinations show the opposite — dominated by high-frequency formulaic phrases, almost no unique combinations. The statistics match memorized associations, not a generative grammar. This is not a failure of effort or training time; it is the correct null result for what these systems produce.',
    bullets: [
      'Apes acquire a lexicon and use symbols intentionally (Kanzi, Washoe, Nim, Chantek)',
      'Yang (2013) Zipfian productivity test applied to Nim\'s 19,000+ combinations',
      'Result: dominated by formulaic phrases — not the hapax-heavy tail of a grammar',
      'Combinations are memorized associations, not rule-generated sequences',
    ],
  },
]

// ── Capability table ──────────────────────────────────────────────────────────

const TABLE_ROWS = [
  { dim: 'Demonstrated reference',       vals: ['Functional (predator-specific)', 'Yes (~80 types)', 'Yes (symbol → referent)'] },
  { dim: 'Compositionality',             vals: ['No (idiom / arousal)',            'No (non-additive)', 'No (memorized)'] },
  { dim: 'Productive syntax',            vals: ['No',                              'No',               'No'] },
  { dim: 'Full intentionality criteria', vals: ['Partial',                         'Yes',              'Yes (training context)'] },
  { dim: 'Cultural/individual learning', vals: ['Limited',                         'Yes',              'Yes (trained)'] },
  { dim: 'Key evidence',                 vals: ['Seyfarth 1980; Arnold 2011',      'Hobaiter 2014; Graham 2023', 'Yang 2013'] },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function PrimateIntro() {
  const [selected, setSelected] = useState<string | null>('primates')
  const [channel, setChannel] = useState<string>('vocal')

  const sel = SPECIES.find(s => s.id === selected)
  const ch = CHANNELS.find(c => c.id === channel)!

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Primates · Introduction
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Inverted Birdsong
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Songbirds have combinatorial syntax without meaning. Primates have meaning without
          combinatorial syntax — sitting in the opposite corner of the design space. Three
          independent lines of evidence converge on the same conclusion.
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
                  Primates and songbirds occupy opposite corners of the syntax–semantics space.
                  Click any species to read its profile.
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
          <p className="bird-intro-callout-label">Central asymmetry</p>
          <p>
            Primates demonstrate the semantic <em>ingredients</em> of language — reference,
            intentionality, pragmatic inference — without the syntactic machinery that makes
            those ingredients productive. The challenge for language origins is not explaining
            where meaning comes from, but how syntax and semantics came to be coupled.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '1980', label: 'Seyfarth et al. vervet alarm calls — functional reference first documented in a wild primate' },
            { val: '~80',  label: 'Great-ape gesture types with full intentionality criteria met (Hobaiter & Byrne 2014)' },
            { val: '0',    label: 'Primate species passing Yang\'s Zipfian productivity test for a generative grammar' },
          ].map(s => (
            <div key={s.label} className="stat-cell">
              <span className="stat-val" style={{ color: 'var(--krill)', fontFamily: 'var(--font-display)' }}>
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
