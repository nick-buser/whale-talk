import { useState } from 'react'

/* ── Wave propagation animation ─────────────────────────────── */
// Simple SVG showing concentric ellipses (Rayleigh waves) emanating from a stomping elephant

/* ── Range estimates ────────────────────────────────────────── */
interface RangeEstimate {
  id: string
  source: string
  channel: string
  rangeKm: number
  conditions: string
  status: 'established' | 'modeled' | 'contested'
  accent: string
}

const RANGES: RangeEstimate[] = [
  { id: 'acoustic',  source: 'McComb et al. 2000',          channel: 'Airborne acoustic (rumble)', rangeKm: 2.5, conditions: 'Quiet savanna, calm air',          status: 'established', accent: '#d4854a' },
  { id: 'seismic-m', source: 'Mortimer et al. 2018',        channel: 'Seismic (rumble, modeled)',   rangeKm: 6.4, conditions: 'Sandy substrate; cow rumble peak forces 2546 N', status: 'modeled',    accent: '#e8941a' },
  { id: 'seismic-g', source: 'Günther et al. 2004',         channel: 'Seismic (rumble, modeled)',   rangeKm: 2.0, conditions: 'Human hearing threshold benchmark; probably ≤ acoustic range normally', status: 'contested', accent: '#c49a6c' },
  { id: 'walk',      source: 'Mortimer et al. 2018',        channel: 'Seismic (fast walk)',         rangeKm: 3.6, conditions: 'Peak forces ~946 N; reduced 84% under high noise', status: 'modeled', accent: '#8a4820' },
  { id: 'localize',  source: 'Reinwald et al. 2021',        channel: 'Seismic source localization',  rangeKm: 1.5, conditions: 'Demonstrated for controlled playbacks', status: 'established', accent: '#d4854a' },
]

/* ── Detection mechanism debate ─────────────────────────────── */
interface MechOption {
  id: string
  name: string
  mechanism: string
  evidence: string
  status: 'proposed' | 'contested' | 'supported'
}

const MECHANISMS: MechOption[] = [
  {
    id: 'pacinian',
    name: 'Pacinian corpuscles',
    mechanism: 'Vibration-sensitive mechanoreceptors clustered in the digital cushion and trunk tip of the foot detect ground-borne vibration.',
    evidence: 'Bouley et al. 2007 (J. Anat.): Pacinian corpuscles confirmed in foot of Asian elephant; clustering in digital cushion region consistent with seismic detection function.',
    status: 'supported',
  },
  {
    id: 'bone',
    name: 'Bone conduction',
    mechanism: 'Seismic energy enters the body via forefeet and travels through the skeleton to the middle/inner ear, bypassing the airborne acoustic pathway.',
    evidence: 'Proposed by O\'Connell-Rodwell based on behavior (leaning onto forefeet during seismic playbacks, which would increase coupling). Mechanism not directly confirmed by neurophysiology.',
    status: 'proposed',
  },
  {
    id: 'both',
    name: 'Combined pathway',
    mechanism: 'Both Pacinian somatosensory detection and bone-conduction cochlear stimulation may operate simultaneously, with different frequency sensitivities.',
    evidence: 'No study has yet distinguished the two pathways with controlled neurophysiological recording. The combined hypothesis is parsimonious but untested.',
    status: 'contested',
  },
]

/* ── Behavioral evidence ────────────────────────────────────── */
const BEHAV_EVIDENCE = [
  { behavior: 'Freezing', description: 'Elephants stop moving and orient toward the seismic source' },
  { behavior: 'Foot-leaning', description: 'Lean forward onto front feet, increasing ground contact area and coupling' },
  { behavior: 'Trunk-to-ground', description: 'Lower trunk to touch ground — trunk tip has Pacinian corpuscles' },
  { behavior: 'Orienting', description: 'Accurate directional orientation toward seismic playback source' },
  { behavior: 'Alerting contagion', description: 'Group members adopt seismic-detection posture after one individual freezes' },
]

const STATUS_COLORS = { established: '#4afdc6', modeled: '#f4c430', contested: '#ff6b54' }
const STATUS_LABELS = { established: 'Established', modeled: 'Modeled', contested: 'Contested' }
const MECH_COLORS = { supported: '#4afdc6', proposed: '#f4c430', contested: '#ff6b54' }

export function ElephantSeismic() {
  const [activeMech, setActiveMech] = useState<string>('pacinian')
  const [animating, setAnimating] = useState(true)

  const mech = MECHANISMS.find(m => m.id === activeMech)!

  return (
    <div className="elephant-seismic">
      <p className="elephant-eyebrow">Seismic Channel</p>
      <h1 className="elephant-title">Tremors in the Ground</h1>
      <p className="elephant-lede">
        Elephant rumbles couple into the ground as Rayleigh waves propagating at up to ~6 km.
        Elephants freeze, lean forward, and orient toward the source in response to seismic
        playbacks. The detection mechanism and whether seismic signals are truly used for
        long-distance communication — not merely detected — remain contested.
        This channel is unique among all six pillars.
      </p>

      {/* Rayleigh wave animation */}
      <div>
        <h2 className="elephant-h2">Seismic Wave Propagation</h2>
        <p className="elephant-sub">Rayleigh waves radiate outward from vocalization/locomotion. Vertically polarized near F0 (~16–20 Hz).</p>
        <div className="elephant-seismic-anim-wrap">
          <svg viewBox="0 0 500 220" className="elephant-seismic-svg">
            <rect width="500" height="220" fill="var(--elephant-soil)" rx="6" />
            {/* Ground line */}
            <line x1="0" y1="130" x2="500" y2="130" stroke="var(--elephant-clay)" strokeWidth="2" />
            <text x="20" y="145" fontSize="9" fill="var(--elephant-deep)" fontFamily="var(--font-sans)">Ground surface</text>
            {/* Rayleigh wave ellipses */}
            {animating && [1, 2, 3, 4].map(i => (
              <ellipse key={i} cx="160" cy="130" rx={i * 42} ry={i * 16}
                fill="none"
                stroke={`color-mix(in oklch, var(--elephant) ${40 - i * 8}%, transparent)`}
                strokeWidth="1.5"
                strokeDasharray="6 4"
              >
                <animateTransform attributeName="transform" type="scale"
                  values="1;1.04;1" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite"
                  additive="sum" />
              </ellipse>
            ))}
            {/* Elephant silhouette (simple) */}
            <ellipse cx="160" cy="112" rx="38" ry="18" fill="color-mix(in oklch, var(--elephant) 25%, transparent)" stroke="var(--elephant)" strokeWidth="1.5" />
            <circle cx="195" cy="105" r="14" fill="color-mix(in oklch, var(--elephant) 25%, transparent)" stroke="var(--elephant)" strokeWidth="1.5" />
            {/* Trunk */}
            <path d="M 207 112 Q 220 118 215 128" fill="none" stroke="var(--elephant)" strokeWidth="2" strokeLinecap="round" />
            {/* Receiving elephant */}
            <ellipse cx="380" cy="112" rx="32" ry="15" fill="color-mix(in oklch, var(--elephant-deep) 30%, transparent)" stroke="var(--elephant-deep)" strokeWidth="1.5" />
            <circle cx="347" cy="105" r="12" fill="color-mix(in oklch, var(--elephant-deep) 30%, transparent)" stroke="var(--elephant-deep)" strokeWidth="1.5" />
            {/* Receiving elephant trunk-to-ground */}
            <path d="M 338 112 Q 325 122 328 130" fill="none" stroke="var(--elephant-deep)" strokeWidth="2" strokeLinecap="round" />
            {/* Distance annotation */}
            <line x1="198" y1="160" x2="348" y2="160" stroke="var(--elephant-clay)" strokeWidth="1" markerEnd="url(#arr-dist)" markerStart="url(#arr-dist)" />
            <text x="273" y="174" textAnchor="middle" fontSize="9" fill="var(--elephant-deep)" fontFamily="var(--font-mono)">up to ~6 km (modeled)</text>
            <defs>
              <marker id="arr-dist" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="var(--elephant-clay)" />
              </marker>
            </defs>
          </svg>
          <button className="elephant-toggle-btn" style={{ marginTop: 8 }} onClick={() => setAnimating(v => !v)}>
            {animating ? '⏸ Pause animation' : '▶ Resume animation'}
          </button>
        </div>
      </div>

      {/* Range estimates */}
      <div>
        <h2 className="elephant-h2">Range Estimates</h2>
        <div className="elephant-seismic-ranges">
          {RANGES.map(r => (
            <div key={r.id} className="elephant-seismic-range-row">
              <div className="elephant-seismic-range-left">
                <span className="elephant-seismic-range-channel" style={{ color: r.accent }}>{r.channel}</span>
                <span className="elephant-seismic-range-source">{r.source}</span>
                <span className="elephant-seismic-range-cond">{r.conditions}</span>
              </div>
              <div className="elephant-seismic-range-right">
                <span className="elephant-seismic-range-km" style={{ color: r.accent }}>{r.rangeKm} km</span>
                <span className="elephant-seismic-range-status"
                  style={{ color: STATUS_COLORS[r.status] }}>
                  {STATUS_LABELS[r.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection mechanism */}
      <div>
        <h2 className="elephant-h2">Detection Mechanism — Contested</h2>
        <div className="elephant-seismic-mech-tabs">
          {MECHANISMS.map(m => (
            <button key={m.id}
              className={`elephant-vc-tab${activeMech === m.id ? ' active' : ''}`}
              style={{ '--vc-color': MECH_COLORS[m.status] } as React.CSSProperties}
              onClick={() => setActiveMech(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="elephant-vc-panel" style={{ borderColor: MECH_COLORS[mech.status] }}>
          <div className="elephant-vc-head">
            <span className="elephant-vc-name" style={{ color: MECH_COLORS[mech.status] }}>{mech.name}</span>
            <span className="elephant-vc-species" style={{ color: MECH_COLORS[mech.status] }}>
              {STATUS_LABELS[mech.status as keyof typeof STATUS_LABELS]}
            </span>
          </div>
          <div className="elephant-vc-rows">
            <div className="elephant-vc-row"><span>How</span><span>{mech.mechanism}</span></div>
            <div className="elephant-vc-row"><span>Evidence</span><span>{mech.evidence}</span></div>
          </div>
        </div>
      </div>

      {/* Behavioral evidence */}
      <div>
        <h2 className="elephant-h2">Established Behavioral Responses</h2>
        <div className="elephant-seismic-behav">
          {BEHAV_EVIDENCE.map(b => (
            <div key={b.behavior} className="elephant-seismic-behav-row">
              <span className="elephant-seismic-behav-label">{b.behavior}</span>
              <span className="elephant-seismic-behav-desc">{b.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="elephant-callout">
        <span className="elephant-callout-icon">〰</span>
        <div>
          <strong>Unique among all six pillars:</strong> No other species in this series uses a
          seismic ground-wave channel for communication. The physics are compelling —
          Rayleigh waves propagate well across savanna substrate — but the critical unresolved
          question is whether elephants actually use seismic-only information for long-distance
          decisions in the wild, or merely detect it. Controlled field tests with seismic-masked
          conditions are the key experiment.
        </div>
      </div>
    </div>
  )
}
