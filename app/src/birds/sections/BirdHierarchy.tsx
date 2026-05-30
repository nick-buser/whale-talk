import { useState } from 'react'

// ── Zone data ─────────────────────────────────────────────────────────────────
// All zones centered at SVG (360, 200). Render outer→inner so inner rects are
// painted last (on top) and receive pointer events first.

interface ZoneData {
  id: string
  short: string
  label: string
  machine: string
  color: string
  x: number; y: number; w: number; h: number; rx: number
  dashed?: boolean
  memory: string
  body: string
}

const ZONES: ZoneData[] = [
  {
    id: 're', short: 'Type 0', label: 'Recursively Enumerable',
    machine: 'Turing Machine', color: '#6b8ca6',
    x: 0, y: 0, w: 720, h: 400, rx: 0,
    memory: 'Unbounded read-write tape — no limit on memory or computation time',
    body: 'The most expressive class, recognized by unrestricted Turing machines. Every algorithmically describable language lives here. No natural communication system is known to require Turing-complete power — this is an upper bound on what cognition in general can do, not a description of any animal signal.',
  },
  {
    id: 'cs', short: 'Type 1', label: 'Context-Sensitive',
    machine: 'Linear Bounded Automaton', color: '#7da6ff',
    x: 40, y: 36, w: 640, h: 328, rx: 11,
    memory: 'Read-write tape bounded proportionally to input length',
    body: 'Natural languages with cross-serial dependencies — Dutch and Swiss-German verb clusters, multiple agreement phenomena — need at least context-sensitive power. "Mildly context-sensitive" grammars (tree-adjoining grammars, minimalist grammars) sit between CF and CS and are the current best formal model of full human language. They handle the crossing dependencies that context-free grammars cannot.',
  },
  {
    id: 'cf', short: 'Type 2', label: 'Context-Free',
    machine: 'Pushdown Automaton', color: '#ffb472',
    x: 92, y: 76, w: 536, h: 248, rx: 10,
    memory: 'Unbounded LIFO stack — one auxiliary memory channel',
    body: 'Recognized by pushdown automata: finite-state machines augmented with an unbounded stack. Required for center-embedding ("The rat the cat the dog chased bit ran") and for AⁿBⁿ languages. Classical Chomskyan syntax placed human language here. The claim that starlings discriminate AⁿBⁿ from (AB)ⁿ (Gentner et al. 2006) is unestablished — zebra finches achieve the same discrimination via simpler counting or edge-detection strategies (van Heijningen et al. 2009), and the CFG advantage disappears under matched controls.',
  },
  {
    id: 'reg', short: 'Type 3', label: 'Regular',
    machine: 'Finite-State Automaton', color: '#4afdc6',
    x: 152, y: 120, w: 416, h: 160, rx: 8,
    memory: 'Finite states only — no stack, no tape, no counters',
    body: 'Recognized by finite-state automata (FSAs) — the grammar underlying the Syntax section\'s Bengalese finch model. Every first-order Markov chain is regular; so are the hidden-state extensions (POMMA) that fix Markov failures by adding many-to-one state→syllable mappings. Bengalese finch song, whale codas, and most monkey call sequences have never been shown to require a stack — they live here or in the subregular subset below.',
  },
  {
    id: 'sub', short: '⊂ Regular', label: 'Subregular',
    machine: 'SL · SP · TSL automata', color: '#a8ffdf',
    x: 280, y: 146, w: 160, h: 108, rx: 7, dashed: true,
    memory: 'Bounded window of k adjacent (SL) or non-adjacent (SP) positions',
    body: 'A proper subset of the regular languages — strictly weaker than FSAs. Strictly Local (SL-k) grammars encode constraints over adjacent k-grams. Strictly Piecewise (SP) grammars encode long-distance constraints between non-adjacent element pairs. Tier-based Strictly Local (TSL) applies SL to a projected feature tier, handling apparent long-range dependencies efficiently. All subregular classes are learnable from positive examples alone. Berwick et al. (2011) and De Santo & Rawski (2020) argue birdsong is almost certainly characterizable here, making it weaker than the Chomsky Type 3 baseline.',
  },
]

// ── Species annotations ───────────────────────────────────────────────────────
// Positions verified against zone geometry (all zones centered at 360, 200):
//   Sub:  x=280–440, y=146–254   Monkey at cx=216 (in Reg left of Sub) ✓
//   Reg:  x=152–568, y=120–280   Whale at cx=504 (in Reg right of Sub) ✓
//   CF:   x=92–628,  y=76–324    Human at cy=98  (in CF above Reg)     ✓

const SPECIES_DOTS = [
  {
    label: 'Birdsong',
    sub: '(Bengalese finch, canary)',
    color: '#ffb472', cx: 360, cy: 200, anchor: 'middle' as const, ldy: 16,
  },
  {
    label: 'Monkey calls',
    sub: '(Campbell\'s, gelada)',
    color: '#4afdc6', cx: 215, cy: 196, anchor: 'middle' as const, ldy: -12,
  },
  {
    label: 'Whale codas',
    sub: '(sperm whale, humpback)',
    color: '#7da6ff', cx: 505, cy: 196, anchor: 'middle' as const, ldy: -12,
  },
  {
    label: 'Human language',
    sub: '(mildly context-sensitive)',
    color: '#ff6b54', cx: 360, cy: 98, anchor: 'middle' as const, ldy: -10,
  },
]

// ── SVG ───────────────────────────────────────────────────────────────────────

function ChomskySVG({
  selected, onSelect,
}: {
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  // Render outer zones first (painted behind) then inner zones (painted in front, catch clicks)
  const orderedZones = [...ZONES] // already outer→inner

  return (
    <svg viewBox="0 0 720 400" width="100%" style={{ display: 'block' }}
         aria-label="Chomsky formal-language hierarchy">
      <defs>
        <pattern id="hatch-sub" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#a8ffdf" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>

      {orderedZones.map(z => {
        const isSel = selected === z.id
        return (
          <g key={z.id}
             style={{ cursor: 'pointer' }}
             onClick={e => { e.stopPropagation(); onSelect(isSel ? null : z.id) }}
             role="button" aria-label={z.label}>

            {/* Zone fill — transparent participates in pointer events unlike none */}
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h} rx={z.rx}
              fill={isSel
                ? `color-mix(in oklch, ${z.color} 10%, transparent)`
                : z.id === 'sub' ? 'url(#hatch-sub)' : 'transparent'}
              stroke={z.color}
              strokeWidth={isSel ? 2 : 1.5}
              strokeOpacity={isSel ? 0.9 : 0.45}
              strokeDasharray={z.dashed ? '6 4' : undefined}
            />

            {/* Zone label — top-left inside the box, above any inner zone */}
            <text
              x={z.x + (z.id === 're' ? 10 : 12)}
              y={z.y + (z.id === 're' ? 18 : 20)}
              fill={z.color}
              fontSize={z.id === 're' ? 10 : 11}
              fontFamily="IBM Plex Sans"
              fontWeight={600}
              letterSpacing="0.04em"
              opacity={isSel ? 1 : 0.6}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {z.label}
            </text>

            {/* Machine type — next line */}
            <text
              x={z.x + (z.id === 're' ? 10 : 12)}
              y={z.y + (z.id === 're' ? 29 : 32)}
              fill={z.color}
              fontSize={9}
              fontFamily="IBM Plex Mono"
              opacity={isSel ? 0.75 : 0.38}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {z.machine}
            </text>
          </g>
        )
      })}

      {/* Species dots (non-interactive — informational) */}
      {SPECIES_DOTS.map(s => (
        <g key={s.label} style={{ pointerEvents: 'none' }}>
          <circle cx={s.cx} cy={s.cy} r={6}
            fill={`color-mix(in oklch, ${s.color} 20%, transparent)`}
            stroke={s.color} strokeWidth={1.5}
          />
          <text
            x={s.cx} y={s.cy + s.ldy}
            textAnchor={s.anchor}
            fill={s.color} fontSize={11} fontFamily="IBM Plex Sans" fontWeight={600}
            opacity={0.9}
          >
            {s.label}
          </text>
          <text
            x={s.cx} y={s.cy + s.ldy + 13}
            textAnchor={s.anchor}
            fill={s.color} fontSize={9} fontFamily="IBM Plex Mono"
            opacity={0.55}
          >
            {s.sub}
          </text>
        </g>
      ))}

      {/* "Click a zone" hint */}
      {!selected && (
        <text x={360} y={390} textAnchor="middle" fill="#b6c8df" fontSize={9}
              fontFamily="IBM Plex Sans" opacity={0.4} style={{ pointerEvents: 'none' }}>
          Click a zone for details
        </text>
      )}
    </svg>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function BirdHierarchy() {
  const [selected, setSelected] = useState<string | null>(null)

  const sel = selected ? ZONES.find(z => z.id === selected) : null

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--krill)', marginBottom: 8 }}>
          Birds · Hierarchy
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          The Chomsky Hierarchy
        </h2>
        <p className="lede" style={{ marginBottom: 40 }}>
          Formal language theory stratifies grammars by the computational memory they require.
          Birdsong sits in the innermost ring — subregular, weaker than a finite-state machine.
          Human language needs the outer rings. Click any zone to explore.
        </p>

        {/* Full-width diagram */}
        <div className="bird-hierarchy-svg-wrap">
          <ChomskySVG selected={selected} onSelect={setSelected} />
        </div>

        {/* Info card */}
        {sel ? (
          <div className="bird-hierarchy-info" style={{ borderColor: `color-mix(in oklch, ${sel.color} 40%, transparent)` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="bird-syntax-badge" style={{
                color: sel.color,
                borderColor: `color-mix(in oklch, ${sel.color} 40%, transparent)`,
                background: `color-mix(in oklch, ${sel.color} 8%, transparent)`,
              }}>
                {sel.short}
              </span>
              <h3 className="bird-info-title" style={{ color: sel.color, margin: 0 }}>
                {sel.label}
              </h3>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-muted)', marginBottom: 10 }}>
              <strong style={{ color: sel.color, marginRight: 6 }}>Machine:</strong>
              {sel.machine}
              <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
              <strong style={{ color: sel.color, marginRight: 6 }}>Memory:</strong>
              {sel.memory}
            </p>
            <p className="bird-info-body" style={{ margin: 0 }}>{sel.body}</p>
          </div>
        ) : (
          <div className="bird-hierarchy-info" style={{ borderColor: 'var(--line)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-quiet)', fontStyle: 'italic', margin: 0 }}>
              Select a zone above to read about its memory model, closure properties, and which signals fall within it.
            </p>
          </div>
        )}

        {/* Deflationary note */}
        <div className="bird-intro-callout" style={{ marginTop: 36 }}>
          <p className="bird-intro-callout-label">The key finding</p>
          <p>
            No birdsong corpus has been demonstrated to require more than regular (Type 3) power —
            and the best evidence places Bengalese finch song in the <em>subregular</em> interior,
            below even finite-state. Human language needs at least mildly context-sensitive power (between
            Type 2 and Type 1). The gap between birdsong and human language is not "birds are missing
            one level" — it is at least two levels, and the operational difference is whether the grammar
            requires a stack at all.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '4',        label: 'Chomsky levels — from regular (FSA) to recursively enumerable (TM)' },
            { val: '≤ Type 3', label: 'Formal class of all documented birdsong and animal call sequences' },
            { val: '≥ Type 2', label: 'Minimum power needed for human center-embedded syntax' },
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
