import { useState } from 'react'

/* ── Frequency spectrum ─────────────────────────────────────── */
// Show: rumble F0 range, human hearing range, infrasound boundary
const SPEC_W = 520
const SPEC_H = 100
const SPEC_L = 60
const SPEC_R = 500
const LOG_MIN = Math.log10(8)
const LOG_MAX = Math.log10(20000)

function freqX(hz: number): number {
  return SPEC_L + ((Math.log10(hz) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (SPEC_R - SPEC_L)
}

const FREQ_LABELS = [10, 20, 50, 100, 500, 1000, 5000, 20000]

interface FreqBand {
  id: string
  label: string
  fMin: number
  fMax: number
  color: string
  y: number
  h: number
}

const BANDS: FreqBand[] = [
  { id: 'infra',   label: 'Infrasound (<20 Hz)', fMin: 8,    fMax: 20,   color: '#d4854a', y: 18, h: 22 },
  { id: 'rumble',  label: 'Elephant rumble F0',  fMin: 14,   fMax: 35,   color: '#ff8c50', y: 22, h: 14 },
  { id: 'human-speech', label: 'Human speech',   fMin: 85,   fMax: 3400, color: '#4afdc6', y: 48, h: 18 },
  { id: 'human-hear',   label: 'Human hearing',  fMin: 20,   fMax: 20000,color: '#4afdc6', y: 70, h: 14 },
  { id: 'elephant-hear', label: 'Elephant hearing', fMin: 16, fMax: 10500, color: '#d4854a', y: 44, h: 14 },
]

/* ── Vocal tract diagram ────────────────────────────────────── */
type TractMode = 'nasal' | 'oral'

const TRACT_DATA: Record<TractMode, { length: string; formants: string; label: string; description: string }> = {
  nasal: {
    length: '~2.0 m',
    formants: 'Very low (trunk as resonator)',
    label: 'Nasal (trunk) emission',
    description: 'Air exits through the trunk (length ~2 m). Very long resonating tube → very low formants. Predominant in contact rumbles and long-distance calls.',
  },
  oral: {
    length: '~0.7 m',
    formants: 'Higher (shorter tract)',
    label: 'Oral emission',
    description: 'Air exits through the mouth. Shorter resonating path (~0.7 m) → higher, more variable formants. Occurs in bonding contexts and some vocalizations. Koshik\'s speech imitation exploited a hybrid path by inserting trunk tip into mouth.',
  },
}

/* ── Vocal learning cases ───────────────────────────────────── */
interface VocalCase {
  id: string
  name: string
  species: string
  learned: string
  method: string
  evidence: string
  accent: string
}

const VOCAL_CASES: VocalCase[] = [
  {
    id: 'koshik',
    name: 'Koshik',
    species: 'Asian elephant, Everland Zoo',
    learned: '5 Korean words: annyong, anja, aniya, nuo, choah',
    method: 'Trunk tip inserted into mouth — unique formant-control method',
    evidence: 'Stoeger et al. 2012 (Current Biology): 67% vowel similarity, 21% consonant; 16 native speakers transcribed 47 recordings.',
    accent: '#d4854a',
  },
  {
    id: 'mlaika',
    name: 'Mlaika',
    species: 'African elephant, Kenya',
    learned: 'Truck engine sounds',
    method: 'Standard laryngeal production; precise mechanism uncharacterized',
    evidence: 'Stoeger et al.: spontaneous imitation of truck traffic near her facility. Spectral match confirmed.',
    accent: '#e8941a',
  },
  {
    id: 'calimero',
    name: 'Calimero',
    species: 'African elephant, Basel Zoo',
    learned: 'Asian elephant chirp calls',
    method: 'Cross-species vocal imitation of a non-native call type',
    evidence: 'Stoeger et al.: Calimero lived with Asian elephants; produced chirps acoustically matching Asian not African elephant types.',
    accent: '#c49a6c',
  },
]

/* ── Call types ─────────────────────────────────────────────── */
const CALL_TYPES = [
  { type: 'Rumble',     freq: '14–35 Hz', context: 'Contact, greeting, bonding, caregiving, musth', mechanism: 'Laryngeal MEAD; nasal or oral emission' },
  { type: 'Roar',       freq: '200–600 Hz', context: 'High arousal, alarm, aggression', mechanism: 'Laryngeal; nonlinear chaos common' },
  { type: 'Trumpet',    freq: '500–4000 Hz', context: 'Alarm, excitement, greeting', mechanism: 'Trunk blast + laryngeal components' },
  { type: 'Bark',       freq: '100–600 Hz', context: 'Short-range alarm, play',         mechanism: 'Laryngeal; typically brief' },
  { type: 'Snort',      freq: 'Broadband',  context: 'Alarm, curiosity',                mechanism: 'Nasal airblast; not voiced' },
  { type: 'Rumble-roar',freq: 'Hybrid',     context: 'High-arousal contact',            mechanism: 'Combined laryngeal types; call combination' },
]

export function ElephantInfrasound() {
  const [tractMode, setTractMode] = useState<TractMode>('nasal')
  const [activeCase, setActiveCase] = useState<string>('koshik')
  const [hovBand, setHovBand] = useState<string | null>(null)

  const tract = TRACT_DATA[tractMode]
  const vc = VOCAL_CASES.find(c => c.id === activeCase)!

  return (
    <div className="elephant-infra">
      <p className="elephant-eyebrow">Infrasound</p>
      <h1 className="elephant-title">Rumbles Below Hearing</h1>
      <p className="elephant-lede">
        Elephant rumbles are produced by the same myoelastic-aerodynamic mechanism as human
        speech — flow-induced self-sustaining vocal-fold vibration — but at 14–35 Hz, at the
        edge and below human hearing. Active formant modulation via switching between nasal and
        oral emission adds articulatory control without a tongue.
      </p>

      {/* Frequency spectrum */}
      <div>
        <h2 className="elephant-h2">Frequency Spectrum</h2>
        <p className="elephant-sub">
          Elephant rumble F0 sits at or below the human hearing threshold (20 Hz). Hover a band.
        </p>
        <svg viewBox={`0 0 ${SPEC_W} ${SPEC_H + 20}`} className="elephant-spec-svg">
          <rect width={SPEC_W} height={SPEC_H + 20} fill="var(--elephant-soil)" rx="6" />
          {/* 20 Hz vertical marker */}
          <line x1={freqX(20)} y1={10} x2={freqX(20)} y2={SPEC_H}
            stroke="color-mix(in oklch, var(--elephant) 35%, transparent)"
            strokeWidth="1" strokeDasharray="4 3" />
          <text x={freqX(20)} y={SPEC_H + 14} textAnchor="middle"
            fontSize="9" fill="var(--elephant-deep)" fontFamily="var(--font-mono)">20 Hz</text>
          {/* Frequency bands */}
          {BANDS.map(b => {
            const x1 = freqX(b.fMin), x2 = freqX(b.fMax)
            const isHov = hovBand === b.id
            return (
              <g key={b.id}
                onMouseEnter={() => setHovBand(b.id)}
                onMouseLeave={() => setHovBand(null)}
                style={{ cursor: 'default' }}
              >
                <rect
                  x={x1} y={b.y} width={Math.max(2, x2 - x1)} height={b.h}
                  fill={`color-mix(in oklch, ${b.color} ${isHov ? '40%' : '25%'}, transparent)`}
                  stroke={b.color} strokeWidth={isHov ? '1.5' : '1'} rx="2"
                />
                {isHov && (
                  <text x={(x1 + x2) / 2} y={b.y - 4} textAnchor="middle"
                    fontSize="9" fill={b.color} fontFamily="var(--font-sans)">{b.label}</text>
                )}
              </g>
            )
          })}
          {/* Axis labels */}
          {FREQ_LABELS.map(f => (
            <text key={f} x={freqX(f)} y={SPEC_H + 14} textAnchor="middle"
              fontSize="8" fill="var(--elephant-deep)" fontFamily="var(--font-mono)">{f >= 1000 ? `${f/1000}k` : f}</text>
          ))}
        </svg>
        <div className="elephant-spec-legend">
          {BANDS.map(b => (
            <span key={b.id} className="elephant-spec-legend-item">
              <span className="elephant-spec-legend-dot" style={{ background: b.color }} />
              <span>{b.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Vocal tract toggle */}
      <div>
        <h2 className="elephant-h2">Vocal Tract — Nasal vs. Oral</h2>
        <p className="elephant-sub">Active formant modulation by switching emission pathway.</p>
        <div className="elephant-tract-tabs">
          {(['nasal', 'oral'] as TractMode[]).map(m => (
            <button
              key={m}
              className={`elephant-tract-tab${tractMode === m ? ' active' : ''}`}
              onClick={() => setTractMode(m)}
            >
              {TRACT_DATA[m].label}
            </button>
          ))}
        </div>
        <div className="elephant-tract-panel">
          {/* Simple SVG diagram */}
          <svg viewBox="0 0 260 140" className="elephant-tract-svg">
            <rect width="260" height="140" fill="var(--elephant-clay)" rx="6" />
            {/* Larynx box */}
            <rect x="100" y="90" width="60" height="30" rx="4"
              fill="color-mix(in oklch, var(--elephant) 20%, transparent)"
              stroke="var(--elephant)" strokeWidth="1.5" />
            <text x="130" y="110" textAnchor="middle" fontSize="9" fill="var(--elephant)" fontFamily="var(--font-sans)">Larynx (MEAD)</text>
            {/* Trachea */}
            <line x1="130" y1="90" x2="130" y2="70" stroke="var(--elephant)" strokeWidth="2" />
            {/* Trunk path (nasal) */}
            <path d="M 130 70 Q 110 40 60 50 Q 30 55 20 80 Q 15 100 25 120"
              fill="none"
              stroke={tractMode === 'nasal' ? 'var(--elephant)' : 'var(--elephant-clay)'}
              strokeWidth={tractMode === 'nasal' ? '3' : '1.5'}
              strokeLinecap="round" />
            {tractMode === 'nasal' && (
              <text x="18" y="135" fontSize="8" fill="var(--elephant)" fontFamily="var(--font-sans)">Trunk exit (~2 m)</text>
            )}
            {/* Oral path */}
            <path d="M 130 70 Q 150 50 180 60 Q 210 70 220 90"
              fill="none"
              stroke={tractMode === 'oral' ? 'var(--elephant)' : 'var(--elephant-clay)'}
              strokeWidth={tractMode === 'oral' ? '3' : '1.5'}
              strokeLinecap="round" />
            {tractMode === 'oral' && (
              <text x="195" y="88" fontSize="8" fill="var(--elephant)" fontFamily="var(--font-sans)">Mouth (~0.7 m)</text>
            )}
          </svg>
          <div className="elephant-tract-info">
            <div className="elephant-tract-row">
              <span className="elephant-tract-key">Tract length</span>
              <span className="elephant-tract-val">{tract.length}</span>
            </div>
            <div className="elephant-tract-row">
              <span className="elephant-tract-key">Formant effect</span>
              <span className="elephant-tract-val">{tract.formants}</span>
            </div>
            <p className="elephant-tract-desc">{tract.description}</p>
          </div>
        </div>
      </div>

      {/* Vocal learning */}
      <div>
        <h2 className="elephant-h2">Vocal Production Learning — Case Studies</h2>
        <p className="elephant-sub">
          Three documented cases. Strong evidence of production learning; limited to individuals,
          not population-level like songbird dialects.
        </p>
        <div className="elephant-vc-tabs">
          {VOCAL_CASES.map(c => (
            <button
              key={c.id}
              className={`elephant-vc-tab${activeCase === c.id ? ' active' : ''}`}
              style={{ '--vc-color': c.accent } as React.CSSProperties}
              onClick={() => setActiveCase(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="elephant-vc-panel" style={{ borderColor: vc.accent }}>
          <div className="elephant-vc-head">
            <span className="elephant-vc-name" style={{ color: vc.accent }}>{vc.name}</span>
            <span className="elephant-vc-species">{vc.species}</span>
          </div>
          <div className="elephant-vc-rows">
            <div className="elephant-vc-row"><span>Learned</span><span>{vc.learned}</span></div>
            <div className="elephant-vc-row"><span>Method</span><span>{vc.method}</span></div>
            <div className="elephant-vc-row"><span>Evidence</span><span>{vc.evidence}</span></div>
          </div>
        </div>
      </div>

      {/* Call types table */}
      <div>
        <h2 className="elephant-h2">Call Repertoire Overview</h2>
        <div className="elephant-calls-table">
          <div className="elephant-calls-head">
            <span>Type</span><span>Frequency</span><span>Context</span><span>Mechanism</span>
          </div>
          {CALL_TYPES.map(c => (
            <div key={c.type} className="elephant-calls-row">
              <span className="elephant-calls-type">{c.type}</span>
              <span className="elephant-calls-freq">{c.freq}</span>
              <span>{c.context}</span>
              <span>{c.mechanism}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="elephant-callout">
        <span className="elephant-callout-icon">🎵</span>
        <div>
          <strong>MEAD convergence across all six pillars:</strong> The myoelastic-aerodynamic
          mechanism — flow-induced vocal-fold vibration — is the source mechanism for human
          speech, elephant rumbles, toothed-whale clicks (via nasal lips), songbird syrinx
          vibration, bat calls, and parrot vocalizations. Six independent lineages, one physical
          principle. The convergence is on the engineering solution, not the neural control.
        </div>
      </div>
    </div>
  )
}
