import { useState } from 'react'
import { Eyebrow } from '../components/Eyebrow'

/* ── Cetacean vocal-culture case studies ────────────────────
   Three species, three modes of socially-learned vocal signal.
   Illustrative figures drawn from the cited literature.        */

type TransmissionMode = 'vertical' | 'horizontal' | 'invention'

interface Species {
  id: string
  name: string
  latin: string
  color: string
  signal: string
  mode: TransmissionMode
  modeLabel: string
  headline: string
  body: string
  facts: { k: string; v: string }[]
  refs: string
}

const SPECIES: Species[] = [
  {
    id: 'dolphin',
    name: 'Bottlenose dolphin',
    latin: 'Tursiops truncatus',
    color: '#4afdc6',
    signal: 'Signature whistles',
    mode: 'invention',
    modeLabel: 'Individual invention + copying',
    headline: 'A name you invent for yourself',
    body: 'In its first year of life each dolphin develops a unique frequency-modulated signature whistle — a self-identifier it broadcasts to announce its presence. It is not inherited and not assigned: the calf invents it, often modelled loosely on associates but distinct from any of them. Crucially, dolphins copy each other\'s signature whistles to address specific individuals — the closest thing to a proper name documented outside humans (King & Janik 2013).',
    facts: [
      { k: 'Develops by', v: '~1 year of age' },
      { k: 'Function', v: 'Individual identity broadcast' },
      { k: 'Copying', v: 'Used to "address" specific dolphins' },
      { k: 'Stability', v: 'Stable for decades' },
    ],
    refs: 'Caldwell & Caldwell 1965; Janik & Sayigh 2013; King & Janik 2013',
  },
  {
    id: 'orca',
    name: 'Killer whale',
    latin: 'Orcinus orca',
    color: '#7da6ff',
    signal: 'Matrilineal call dialects',
    mode: 'vertical',
    modeLabel: 'Vertical · mother → offspring',
    headline: 'A dialect you inherit from your mother',
    body: 'Resident killer whales live in stable matrilines that never disperse. Each pod has a repertoire of discrete pulsed calls, and the degree of repertoire overlap between pods tracks their matrilineal relatedness: more shared calls means more recent common ancestry (Ford 1991). Dialects are transmitted vertically and conservatively, drifting slowly over generations. Sympatric ecotypes — fish-eating residents vs. mammal-eating transients — maintain entirely distinct vocal cultures despite sharing the water.',
    facts: [
      { k: 'Unit', v: 'Discrete pulsed calls' },
      { k: 'Transmission', v: 'Matrilineal (vertical)' },
      { k: 'Repertoire overlap', v: 'Tracks relatedness' },
      { k: 'Ecotypes', v: 'Resident / transient / offshore' },
    ],
    refs: 'Ford 1991; Deecke et al. 2000; Filatova et al. 2012',
  },
  {
    id: 'humpback',
    name: 'Humpback whale',
    latin: 'Megaptera novaeangliae',
    color: '#ffb472',
    signal: 'Song revolutions',
    mode: 'horizontal',
    modeLabel: 'Horizontal · population → population',
    headline: 'A song that sweeps across an ocean',
    body: 'All males in a breeding population sing the same hierarchically-structured song, which mutates gradually within a season. Periodically, an entirely new song originating in one population sweeps eastward across the South Pacific — population by population — replacing the local song within a year or two (Garland et al. 2011). These "song revolutions" are the fastest, largest-scale example of horizontal cultural transmission known in any non-human animal. (The song\'s nested grammar is explored in the Song act.)',
    facts: [
      { k: 'Unit', v: 'Nested themes & phrases' },
      { k: 'Transmission', v: 'Horizontal (population-wide)' },
      { k: 'Revolution', v: 'Sweeps W→E across S. Pacific' },
      { k: 'Timescale', v: '~1–2 years per population' },
    ],
    refs: 'Payne & McVay 1971; Noad et al. 2000; Garland et al. 2011',
  },
]

/* ── Per-species transmission glyph ─────────────────────────
   invention: scattered self-loops · vertical: matriline tree ·
   horizontal: left-to-right wave of converging nodes.           */
function TransmissionGlyph({ mode, color }: { mode: TransmissionMode; color: string }) {
  const W = 280, H = 120
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} aria-hidden="true">
      {mode === 'invention' && (
        <>
          {[[60, 60], [140, 40], [140, 84], [220, 60]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={11} fill={`color-mix(in oklch, ${color} 18%, transparent)`} stroke={color} strokeWidth={1.4} />
              <circle cx={x} cy={y} r={20} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.3} strokeDasharray="3 3" />
            </g>
          ))}
          <text x={W / 2} y={H - 4} textAnchor="middle" fill={color} fontFamily="IBM Plex Mono" fontSize={9} opacity={0.6}>
            each individual coins its own
          </text>
        </>
      )}
      {mode === 'vertical' && (
        <>
          <line x1={140} y1={24} x2={80} y2={64} stroke={color} strokeWidth={1.2} strokeOpacity={0.6} />
          <line x1={140} y1={24} x2={200} y2={64} stroke={color} strokeWidth={1.2} strokeOpacity={0.6} />
          <line x1={80} y1={64} x2={56} y2={98} stroke={color} strokeWidth={1.2} strokeOpacity={0.6} />
          <line x1={80} y1={64} x2={104} y2={98} stroke={color} strokeWidth={1.2} strokeOpacity={0.6} />
          <line x1={200} y1={64} x2={176} y2={98} stroke={color} strokeWidth={1.2} strokeOpacity={0.6} />
          <line x1={200} y1={64} x2={224} y2={98} stroke={color} strokeWidth={1.2} strokeOpacity={0.6} />
          {[[140, 24], [80, 64], [200, 64], [56, 98], [104, 98], [176, 98], [224, 98]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 0 ? 10 : 7}
                    fill={`color-mix(in oklch, ${color} ${i === 0 ? 28 : 16}%, transparent)`}
                    stroke={color} strokeWidth={1.3} />
          ))}
          <text x={W / 2} y={H - 2} textAnchor="middle" fill={color} fontFamily="IBM Plex Mono" fontSize={9} opacity={0.6}>
            passed down the matriline
          </text>
        </>
      )}
      {mode === 'horizontal' && (
        <>
          {[0, 1, 2, 3].map(i => {
            const x = 44 + i * 64
            return (
              <g key={i}>
                {i < 3 && <line x1={x + 12} y1={56} x2={x + 52} y2={56} stroke={color} strokeWidth={1.4} strokeOpacity={0.55} markerEnd="url(#clade-arrow)" />}
                <circle cx={x} cy={56} r={11} fill={`color-mix(in oklch, ${color} 18%, transparent)`} stroke={color} strokeWidth={1.4} />
              </g>
            )
          })}
          <defs>
            <marker id="clade-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={color} opacity={0.7} />
            </marker>
          </defs>
          <text x={W / 2} y={H - 4} textAnchor="middle" fill={color} fontFamily="IBM Plex Mono" fontSize={9} opacity={0.6}>
            sweeps population to population
          </text>
        </>
      )}
    </svg>
  )
}

export function ActClade() {
  const [active, setActive] = useState('dolphin')
  const sp = SPECIES.find(s => s.id === active)!

  return (
    <section id="clade" className="act" data-screen-label="07 Clade">
      <div className="col-wide">
        <Eyebrow num={6}>The wider clade · beyond the sperm whale</Eyebrow>
        <h2>One ocean, <span className="hl">many vocal cultures</span>.</h2>
        <p className="lede" style={{ maxWidth: '54ch' }}>
          Sperm whale codas are one cetacean signal among many. Across the clade, socially-learned
          vocal traditions recur again and again — but they are transmitted in strikingly different
          ways. Pick a species to see how its signal is learned and spread.
        </p>

        {/* Species selector */}
        <div className="clade-tabs" style={{ marginTop: 32 }}>
          {SPECIES.map(s => (
            <button
              key={s.id}
              className={`clade-tab${active === s.id ? ' active' : ''}`}
              style={{ '--sp-color': s.color } as React.CSSProperties}
              onClick={() => setActive(s.id)}
            >
              <span className="clade-tab-name">{s.name}</span>
              <span className="clade-tab-signal">{s.signal}</span>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="split-2" style={{ marginTop: 28, gap: 44, alignItems: 'start' }}>
          {/* LEFT — narrative */}
          <div>
            <div className="specimen" style={{ borderTopColor: sp.color }}>
              <span className="latin">{sp.latin}</span>
              <span className="name">{sp.name}</span>
              <div className="coord-row">
                <span>SIGNAL<span className="v" style={{ color: sp.color }}>{sp.signal}</span></span>
                <span>MODE<span className="v">{sp.modeLabel}</span></span>
              </div>
            </div>

            <h3 style={{ fontSize: 24, margin: '28px 0 12px', color: sp.color }}>{sp.headline}</h3>
            <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65 }}>{sp.body}</p>
            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--shoal)', lineHeight: 1.5 }}>
              Refs: {sp.refs}
            </p>
          </div>

          {/* RIGHT — glyph + facts */}
          <div>
            <div className="panel panel--lumen" style={{ padding: '20px 24px', borderTopColor: sp.color }}>
              <span className="corner mono">transmission</span>
              <TransmissionGlyph mode={sp.mode} color={sp.color} />
            </div>

            <div className="clade-facts" style={{ marginTop: 20 }}>
              {sp.facts.map(f => (
                <div key={f.k} className="clade-fact">
                  <span className="clade-fact-k">{f.k}</span>
                  <span className="clade-fact-v">{f.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Synthesis */}
        <div className="panel" style={{ marginTop: 56, padding: '28px 32px', borderLeft: '3px solid var(--lumen)' }}>
          <h3 style={{ marginTop: 0, fontSize: 20 }}>Two axes of cultural transmission</h3>
          <p style={{ fontSize: 15, color: 'var(--mist)', lineHeight: 1.65, maxWidth: '64ch' }}>
            The same capacity — vocal production learning — produces opposite social dynamics. Killer whale
            dialects are <em>vertical</em> and conservative, drifting over generations like a family heirloom.
            Humpback song is <em>horizontal</em> and volatile, whole repertoires swept aside in a single
            season. Dolphin signature whistles are neither inherited nor copied wholesale — they are
            <em> invented</em>, then selectively imitated to refer to one another. Three solutions to the
            same problem, in animals that last shared a vocal-learning ancestor tens of millions of years ago.
          </p>
        </div>

        <p className="small" style={{ marginTop: 32, color: 'var(--shoal)' }}>
          Figures illustrative, drawn from the cited literature. Transmission glyphs are schematic.
        </p>
      </div>
    </section>
  )
}
