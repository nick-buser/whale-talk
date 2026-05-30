import { useState } from 'react'

// ── Radar data ────────────────────────────────────────────────────────────────

const AXES = [
  { label: 'Vocal Learning',   angle: 0   },
  { label: 'Syntax',           angle: 60  },
  { label: 'Semantics',        angle: 120 },
  { label: 'Cultural Tx',      angle: 180 },
  { label: 'Mechanism',        angle: 240 },
  { label: 'Molecular',        angle: 300 },
]

// Scores: [Vocal Learning, Syntax, Semantics, Cultural Tx, Mechanism, Molecular] — 0–10
const COMPARE_SPECIES = [
  {
    id: 'birds', label: 'Songbirds',
    color: '#ffb472',
    scores: [9, 7, 0, 8, 10, 9],
    note: 'The deepest mechanistic window: a named, dissectable circuit. Rich syntax, zero semantics. FoxP2 regulation in Area X is the molecular anchor.',
  },
  {
    id: 'cetaceans', label: 'Cetaceans',
    color: '#7da6ff',
    scores: [8, 4, 1, 9, 1, 3],
    note: 'Strong vocal production learners with combinatorial coda structure and Zipfian statistics — but the neural mechanism is unknown and meaning is undecoded.',
  },
  {
    id: 'humans', label: 'Humans',
    color: '#ff6b54',
    scores: [10, 10, 10, 10, 6, 8],
    note: 'The only species to bind recursive syntax to compositional semantics with open-ended vocal learning. The direct LMC→ambiguus projection is the structural key.',
  },
  {
    id: 'primates', label: 'Primates',
    color: '#4afdc6',
    scores: [2, 2, 5, 3, 8, 6],
    note: 'Rich intentionality and functional reference — but no productive syntax, no vocal production learning (except marmosets), and no compositional combination.',
  },
]

// ── Radar chart ───────────────────────────────────────────────────────────────

const CX = 250, CY = 252, MAX_R = 150, LABEL_R = MAX_R + 26

function radarPt(axisIndex: number, score: number): [number, number] {
  const angleDeg = axisIndex * 60
  const angleRad = (angleDeg * Math.PI) / 180
  const r = (score / 10) * MAX_R
  return [CX + r * Math.sin(angleRad), CY - r * Math.cos(angleRad)]
}

function axisLabelPt(axisIndex: number): [number, number] {
  const angleDeg = axisIndex * 60
  const angleRad = (angleDeg * Math.PI) / 180
  return [CX + LABEL_R * Math.sin(angleRad), CY - LABEL_R * Math.cos(angleRad)]
}

function polyPath(scores: number[]): string {
  const pts = scores.map((s, i) => radarPt(i, s))
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'
}

function gridPath(level: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => radarPt(i, level * 10))
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'
}

function textAnchor(axisIndex: number): 'start' | 'middle' | 'end' {
  if (axisIndex === 0 || axisIndex === 3) return 'middle'
  return axisIndex <= 2 ? 'start' : 'end'
}

function RadarChart({ highlighted, onHighlight }: {
  highlighted: string | null
  onHighlight: (id: string | null) => void
}) {
  return (
    <svg viewBox="0 0 500 510" width="100%" style={{ display: 'block' }}
         aria-label="Multi-dimensional vocal communication comparison">

      {/* Grid */}
      {[0.25, 0.5, 0.75, 1].map(level => (
        <path key={level} d={gridPath(level)}
          fill="none" stroke="#b6c8df"
          strokeOpacity={level === 1 ? 0.25 : 0.13} strokeWidth={1} />
      ))}

      {/* Axis lines */}
      {AXES.map((_, i) => {
        const [ex, ey] = radarPt(i, 10)
        return (
          <line key={i} x1={CX} y1={CY} x2={ex} y2={ey}
            stroke="#b6c8df" strokeOpacity={0.2} strokeWidth={1} />
        )
      })}

      {/* Grid value labels (25%, 50%, 75% rings) */}
      {[2.5, 5, 7.5].map(v => {
        const [x, y] = radarPt(0, v) // label on Vocal Learning axis (top)
        return (
          <text key={v} x={x + 4} y={y + 4} fill="#b6c8df" fontSize={8}
                fontFamily="IBM Plex Mono" opacity={0.35}>{v * 10}%</text>
        )
      })}

      {/* Species polygons — unhighlighted first, highlighted on top */}
      {[...COMPARE_SPECIES].reverse().map(s => {
        const isHl = highlighted === s.id
        const isOther = highlighted !== null && !isHl
        return (
          <path key={s.id} d={polyPath(s.scores)}
            fill={`color-mix(in oklch, ${s.color} ${isHl ? 22 : 12}%, transparent)`}
            stroke={s.color}
            strokeWidth={isHl ? 2.5 : 1.5}
            strokeOpacity={isOther ? 0.2 : 0.75}
            fillOpacity={isOther ? 0.04 : undefined}
            style={{ cursor: 'pointer', transition: 'stroke-opacity 0.15s, fill-opacity 0.15s' }}
            onClick={() => onHighlight(isHl ? null : s.id)}
          />
        )
      })}

      {/* Axis labels */}
      {AXES.map((axis, i) => {
        const [lx, ly] = axisLabelPt(i)
        const anchor = textAnchor(i)
        return (
          <text key={i} x={lx} y={ly + (i === 3 ? 12 : i === 0 ? -2 : 4)}
                textAnchor={anchor} fill="#b6c8df" fontSize={11}
                fontFamily="IBM Plex Sans" fontWeight={600}
                opacity={0.6} letterSpacing="0.04em">
            {axis.label}
          </text>
        )
      })}

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={3} fill="#b6c8df" opacity={0.25} />
    </svg>
  )
}

// ── Neural analogs table ──────────────────────────────────────────────────────

type Confidence = 'known' | 'predicted' | 'unknown'

interface NeuralEntry { label: string; confidence: Confidence; note?: string }

const NEURAL_ROWS: { role: string; birds: NeuralEntry; humans: NeuralEntry; cetaceans: NeuralEntry; primates: NeuralEntry }[] = [
  {
    role: 'Motor timing & syntax',
    birds:     { label: 'HVC', confidence: 'known',     note: 'Cooling alters tempo + sequence' },
    humans:    { label: 'LMC / premotor', confidence: 'known', note: 'Laryngeal motor cortex' },
    cetaceans: { label: '?', confidence: 'unknown',     note: '' },
    primates:  { label: 'vlPFC / SMA', confidence: 'known', note: 'Volitional initiation only' },
  },
  {
    role: 'RL critic (basal ganglia)',
    birds:     { label: 'Area X', confidence: 'known',  note: 'Timing + efference + dopamine' },
    humans:    { label: 'Striatum (putamen)', confidence: 'known', note: 'Vocal-motor RL' },
    cetaceans: { label: 'Predicted: striatum', confidence: 'predicted', note: 'Jarvis motor theory' },
    primates:  { label: 'Caudate / putamen', confidence: 'known', note: 'Not vocal-specific' },
  },
  {
    role: 'Direct vocal-motor path',
    birds:     { label: 'RA → nXIIts', confidence: 'known',     note: 'Monosynaptic to syringeal MNs' },
    humans:    { label: 'LMC → nuc. ambiguus', confidence: 'known', note: 'Human-specific innovation' },
    cetaceans: { label: '? → CN VII', confidence: 'predicted', note: 'Nasal effector, not laryngeal' },
    primates:  { label: 'Absent', confidence: 'known',     note: 'Reticular relay — key deficit' },
  },
  {
    role: 'Thalamic relay',
    birds:     { label: 'DLM', confidence: 'known',     note: 'Disinhibitory, topographic' },
    humans:    { label: 'VL/VA thalamus', confidence: 'known', note: 'Standard cortico-thalamic' },
    cetaceans: { label: 'Unknown', confidence: 'unknown', note: '' },
    primates:  { label: 'VL/VA thalamus', confidence: 'known', note: 'Conserved mammalian' },
  },
  {
    role: 'AFP actor / explorer',
    birds:     { label: 'LMAN', confidence: 'known',    note: 'Lesions abolish variability' },
    humans:    { label: 'Unknown', confidence: 'unknown', note: 'No LMAN analog identified' },
    cetaceans: { label: 'Unknown', confidence: 'unknown', note: '' },
    primates:  { label: 'Unknown', confidence: 'unknown', note: '' },
  },
  {
    role: 'FoxP2 / FOXP2',
    birds:     { label: 'Area X (song-specific)', confidence: 'known', note: 'Activity-dependent regulation' },
    humans:    { label: 'Striatum (conserved)', confidence: 'known', note: 'Sweep claim retracted 2018' },
    cetaceans: { label: 'Predicted: striatum', confidence: 'predicted', note: 'No vocal-motor data' },
    primates:  { label: 'Striatum (conserved)', confidence: 'known', note: 'No song-specific reg.' },
  },
]

const NEURAL_COLS: { key: 'birds' | 'humans' | 'cetaceans' | 'primates'; label: string; color: string }[] = [
  { key: 'birds',     label: 'Songbirds',  color: '#ffb472' },
  { key: 'humans',    label: 'Humans',     color: '#ff6b54' },
  { key: 'cetaceans', label: 'Cetaceans',  color: '#7da6ff' },
  { key: 'primates',  label: 'Primates',   color: '#4afdc6' },
]

function NeuralChip({ entry, color }: { entry: NeuralEntry; color: string }) {
  const opacity = entry.confidence === 'unknown' ? 0.35 : entry.confidence === 'predicted' ? 0.7 : 1
  return (
    <div title={entry.note || undefined} style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
      <span style={{
        display: 'inline-block', width: 7, height: 7, borderRadius: '50%', marginTop: 4, flexShrink: 0,
        background: entry.confidence === 'known' ? color : 'transparent',
        border: entry.confidence !== 'unknown' ? `1.5px solid ${color}` : 'none',
        opacity,
      }} />
      <span style={{
        fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-muted)',
        opacity, lineHeight: 1.4,
      }}>
        {entry.label}
      </span>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function BirdCompare() {
  const [highlighted, setHighlighted] = useState<string | null>(null)

  const hlSpecies = highlighted ? COMPARE_SPECIES.find(s => s.id === highlighted) : null

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Birds · Compare
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Side by Side
        </h2>
        <p className="lede" style={{ marginBottom: 40 }}>
          Six dimensions: vocal production learning, syntax complexity, semantic reference,
          cultural transmission, circuit accessibility, and molecular evidence.
          Click a species to highlight its profile.
        </p>

        {/* Radar chart */}
        <div style={{ background: 'color-mix(in oklch, var(--surface-1) 40%, transparent)', border: '1px solid var(--line)', borderRadius: 12, padding: '4px 4px 0', marginBottom: 24 }}>
          <RadarChart highlighted={highlighted} onHighlight={setHighlighted} />
        </div>

        {/* Species selector row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {COMPARE_SPECIES.map(s => (
            <button
              key={s.id}
              onClick={() => setHighlighted(highlighted === s.id ? null : s.id)}
              style={{
                padding: '8px 14px',
                background: highlighted === s.id
                  ? `color-mix(in oklch, ${s.color} 18%, transparent)`
                  : 'color-mix(in oklch, var(--surface-1) 50%, transparent)',
                border: `1px solid ${highlighted === s.id ? s.color : 'var(--line)'}`,
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 600,
                color: s.color,
                transition: 'background 0.12s, border-color 0.12s',
              }}
            >
              {s.label}
            </button>
          ))}
          {highlighted && (
            <button onClick={() => setHighlighted(null)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-quiet)' }}>
              Clear
            </button>
          )}
        </div>

        {/* Highlighted species note */}
        {hlSpecies && (
          <div style={{ padding: '14px 18px', background: `color-mix(in oklch, ${hlSpecies.color} 7%, transparent)`, border: `1px solid color-mix(in oklch, ${hlSpecies.color} 35%, transparent)`, borderRadius: 8, marginBottom: 40 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, margin: 0 }}>
              {hlSpecies.note}
            </p>
          </div>
        )}

        {/* Neural analogs table */}
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: 'var(--tr-label)', textTransform: 'uppercase', color: 'var(--fg-quiet)', marginBottom: 14, marginTop: hlSpecies ? 0 : 40 }}>
          Neural structure analogs
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="bird-intro-table" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ color: 'var(--fg-quiet)' }}>Role</th>
                {NEURAL_COLS.map(col => (
                  <th key={col.key} style={{ color: col.color }}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NEURAL_ROWS.map(row => (
                <tr key={row.role}>
                  <td className="bird-intro-table-dim" style={{ fontSize: 11, whiteSpace: 'normal' }}>
                    {row.role}
                  </td>
                  {NEURAL_COLS.map(col => (
                    <td key={col.key} style={{ padding: '10px 12px' }}>
                      <NeuralChip entry={row[col.key]} color={col.color} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-quiet)', marginTop: 8, opacity: 0.6 }}>
            ● confirmed · ○ predicted / inferred · no marker = unknown · hover cells for detail
          </p>
        </div>

        {/* Key insight callout */}
        <div className="bird-intro-callout" style={{ marginTop: 48 }}>
          <p className="bird-intro-callout-label">The direct projection — the sharpest single criterion</p>
          <p>
            The most concrete shared feature of confirmed vocal learners is a <em>direct monosynaptic
            projection from forebrain to vocal-motor neurons</em>: RA→nXIIts in songbirds;
            LMC→nucleus ambiguus in humans. This pathway is absent or indirect in non-learning
            primates (reticular relay only) and is the leading predicted but unconfirmed feature
            in cetaceans — where the effector is the nasal phonic-lip complex innervated by CN VII,
            not the larynx, so even the homology target differs. No single anatomical test would
            be more decisive for the vocal-learning hypothesis in cetaceans than finding a direct
            cortical projection to the facial motor nucleus.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '1/4', label: 'Species with both productive syntax AND compositional semantics — human language alone clears both bars' },
            { val: '6',   label: 'Independent origins of complex vocal production learning across bird and mammal lineages' },
            { val: '≥2',  label: 'Chomsky hierarchy levels separating birdsong (subregular) from human syntax (mildly context-sensitive)' },
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
