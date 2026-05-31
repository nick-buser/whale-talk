import { useState } from 'react'

// ── Nucleus data ──────────────────────────────────────────────────────────────

interface Nucleus {
  id: string
  parrot: string      // parrot name
  oscine: string      // oscine analog
  x: number; y: number; r: number
  role: string
  coreDetail: string
  shellDetail: string
  shellUnique: boolean
}

const NUCLEI: Nucleus[] = [
  {
    id: 'nlc',
    parrot: 'NLC', oscine: 'HVC',
    x: 120, y: 80, r: 26,
    role: 'Premotor sequence generator',
    coreDetail: 'The NLC core is the premotor nucleus organizing song sequences — the parrot homolog of HVC in oscines. Drives downstream motor output via AAC core. Like HVC, it projects to the AAC core (motor pathway) and to MMSt (AFP learning pathway).',
    shellDetail: 'The NLC shell is unique to parrots. It projects to adjacent forebrain nuclei rather than directly to brainstem — a distinct connectivity profile from the core. Shell activity correlates with learned vocal modifications beyond what the core alone supports.',
    shellUnique: true,
  },
  {
    id: 'aac',
    parrot: 'AAC', oscine: 'RA',
    x: 280, y: 180, r: 28,
    role: 'Vocal motor output',
    coreDetail: 'The AAC core is the robust vocal motor nucleus — the parrot analog of oscine RA. It sends the direct forebrain→brainstem projection to vocal motor neurons, the key pathway enabling learned vocal production. Yang & Long (2025, Nature) found the AAC core is organized by phonetic-like features (especially vocal pitch) — convergent with human laryngeal motor cortex.',
    shellDetail: 'The AAC shell is proportionally larger in grey parrots and macaws than in budgerigars. It projects to adjacent forebrain areas rather than to brainstem, and is hypothesized to support the broader mimicry repertoire in large-brained species — though this causal link is not yet directly demonstrated.',
    shellUnique: true,
  },
  {
    id: 'mmst',
    parrot: 'MMSt', oscine: 'Area X',
    x: 440, y: 80, r: 24,
    role: 'Basal ganglia loop — vocal learning',
    coreDetail: 'MMSt (magnocellular nucleus of the medial striatum) is the parrot Area X analog — the striatal node of the anterior forebrain pathway (AFP) loop. It participates in the pallial-basal-ganglia-thalamic circuit for trial-and-error vocal learning. FoxP2 is persistently downregulated in parrot MMSt regardless of vocal state — contrasting with the singing-dependent, seasonally-variable FoxP2 modulation in oscine Area X. This persistent downregulation is linked to open-ended learning.',
    shellDetail: 'The MMSt shell is a parrot-specific expansion around the striatal learning circuit. Its exact computational function is unclear; it may extend the temporal scale of the learning loop or support the larger vocal repertoire of complex mimics.',
    shellUnique: true,
  },
]

// ── Species shell-size data ───────────────────────────────────────────────────

interface ParrotSpecies {
  id: string
  name: string
  latin: string
  superfamily: string
  shellRel: number    // relative shell-to-core ratio (0 = no shell, 1 = large shell)
  mya: number | null  // divergence (Mya) for timeline
  notes: string
}

const SPECIES_DATA: ParrotSpecies[] = [
  { id: 'kea',      name: 'Kea',                latin: 'Nestor notabilis',        superfamily: 'Strigopoidea',  shellRel: 0.10, mya: 29, notes: 'Basal Strigopoidea. Well-formed core with only rudimentary shell — sets the minimum bound: parrot vocal learning ≥ 29 Mya. (Chakraborty 2015)' },
  { id: 'kakapo',   name: 'Kakapo',             latin: 'Strigops habroptila',     superfamily: 'Strigopoidea',  shellRel: 0.15, mya: null, notes: 'Fellow Strigopoid. Also shows rudimentary shell. Vocal behavior less studied than kea due to low population.' },
  { id: 'budgie',   name: 'Budgerigar',          latin: 'Melopsittacus undulatus', superfamily: 'Psittacoidea',  shellRel: 0.38, notes: 'The primary lab model for parrot vocal neuroscience. Small shell relative to macaws and greys, consistent with a moderate mimicry repertoire. The AAC core was the site of Yang & Long (2025).', mya: null },
  { id: 'cockatiel',name: 'Cockatiel',           latin: 'Nymphicus hollandicus',  superfamily: 'Cacatuoidea',   shellRel: 0.42, notes: 'Cacatuoidea representative. Moderate shell; good social vocal learner but less mimicry complexity than true parrots.', mya: null },
  { id: 'amazon',   name: 'Yellow-naped Amazon', latin: 'Amazona auropalliata',   superfamily: 'Psittacoidea',  shellRel: 0.72, notes: 'Wrightʼs long-term wild system. Complex vocal dialects and duets. Large shell. Dahlin et al. (2026) found >20 syntactic rules in duet structure.', mya: null },
  { id: 'grey',     name: 'African grey',        latin: 'Psittacus erithacus',    superfamily: 'Psittacoidea',  shellRel: 0.88, notes: 'Alex\'s species. Largest AAC shell of any tested parrot — consistent with the richest vocal mimicry and referential learning capacity. Shell-size/complexity correlation is correlational, not yet causal.', mya: null },
  { id: 'macaw',    name: 'Blue-and-yellow macaw',latin:'Ara ararauna',           superfamily: 'Psittacoidea',  shellRel: 0.85, notes: 'Largest parrot. Very large shell; 1,914 million pallial neurons (Olkowicz 2016) — matching macaque pallial neuron count in a brain 5× lighter.', mya: null },
]

// ── Key findings ──────────────────────────────────────────────────────────────

interface Finding {
  id: string
  year: string
  ref: string
  headline: string
  body: string
  color: string
}

const FINDINGS: Finding[] = [
  {
    id: 'chakraborty',
    year: '2015', ref: 'Chakraborty et al. — PLoS ONE',
    headline: 'Core and shell across all three parrot superfamilies',
    body: 'Used constitutive gene expression (PVALB) and vocalizing-driven immediate-early-gene expression (EGR-1, DUSP1) across 9 parrot species spanning Strigopoidea, Cacatuoidea, and Psittacoidea. Every parrot song nucleus has a core resembling oscine/hummingbird nuclei and a surrounding shell unique to parrots. The kea has rudimentary shell, placing the origin of the parrot vocal learning system at ≥ 29 Mya.',
    color: '#8ae04a',
  },
  {
    id: 'yang',
    year: '2025', ref: 'Yang & Long — Nature 640:427–434',
    headline: 'AAC is a functional vocal motor map convergent with human LMC',
    body: 'First population recordings in budgerigar AAC (n = 4, high-density silicon probes). Found that AAC neurons form a functional vocal motor map reflecting the spectral properties of ongoing vocalizations — organized by phonetic-like features, notably vocal pitch. Unlike the zebra finch RA (which lacks a pitch map), this is directly analogous to the topographic organization of human laryngeal motor cortex. Establishes the budgerigar as a tractable lab model for speech motor control research.',
    color: '#ffb472',
  },
  {
    id: 'pfenning',
    year: '2014', ref: 'Pfenning et al. — Science',
    headline: 'Convergent transcriptomics: >50 genes shared with human LMC',
    body: 'Genome-wide expression analysis across oscine RA, parrot AAC core, hummingbird vocal nucleus, and human laryngeal motor cortex found convergent specialization in >50 genes with motor-control and connectivity functions. The direct forebrain→brainstem projection shared by songbirds, parrots, hummingbirds, and humans shows convergent SLIT-ROBO axon-guidance regulation. This is convergence at the molecular level — the same toolkit deployed independently four times.',
    color: '#7da6ff',
  },
  {
    id: 'foxp2',
    year: '2015', ref: 'Hara et al.; Chakraborty/Whitney',
    headline: 'FoxP2 persistently downregulated in parrot MMSt',
    body: 'In budgerigar MMSt (the Area X analog), FoxP2 is persistently downregulated relative to surrounding striatum regardless of vocal state or season — contrasting with oscine Area X where FoxP2 modulation is singing-dependent and seasonally variable. This persistent downregulation is linked to open-ended vocal learning (the "plasticity gateway" hypothesis): parrots can modify calls throughout life because the learning circuitry remains permissive year-round.',
    color: '#4afdc6',
  },
]

// ── SVG diagram ───────────────────────────────────────────────────────────────

const SHELL_COLOR = '#8ae04a'
const CORE_COLOR  = '#4afdc6'

const VB = '0 0 560 300'

function CoreShellDiagram({ selected, onSelect }: {
  selected: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <svg viewBox={VB} width="100%" style={{ display: 'block' }} aria-label="Core and shell song nuclei">
      <defs>
        <marker id="arr-shell" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={SHELL_COLOR} opacity={0.6} />
        </marker>
        <marker id="arr-core" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CORE_COLOR} opacity={0.7} />
        </marker>
      </defs>

      {/* Labels */}
      <text x={120} y={18} textAnchor="middle" fill="#b6c8df" fontSize={10}
            fontFamily="IBM Plex Mono" letterSpacing="0.08em" opacity={0.6}>
        OSCINE ANALOG
      </text>
      <text x={280} y={18} textAnchor="middle" fill="#b6c8df" fontSize={10}
            fontFamily="IBM Plex Mono" letterSpacing="0.08em" opacity={0.6}>
        PARROT NUCLEUS
      </text>
      <text x={440} y={18} textAnchor="middle" fill="#b6c8df" fontSize={10}
            fontFamily="IBM Plex Mono" letterSpacing="0.08em" opacity={0.6}>
        PARROT NUCLEUS
      </text>

      {/* Connecting arrows between panels (motor pathway) */}
      <line x1={106} y1={108} x2={222} y2={168} stroke={CORE_COLOR} strokeWidth={1.2} opacity={0.4}
            strokeDasharray="4 3" markerEnd="url(#arr-core)" />
      <line x1={312} y1={196} x2={416} y2={100} stroke={CORE_COLOR} strokeWidth={1.2} opacity={0.4}
            strokeDasharray="4 3" markerEnd="url(#arr-core)" />

      {/* AFP loop arrow */}
      <path d="M 296,200 C 360,250 440,240 452,106" stroke={SHELL_COLOR} strokeWidth={1.2} fill="none"
            opacity={0.3} markerEnd="url(#arr-shell)" strokeDasharray="5 4" />

      {NUCLEI.map(n => {
        const isSel = selected === n.id
        const shellR = n.r + 14
        return (
          <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(isSel ? null : n.id)}>
            {/* Shell ring (parrot-unique) */}
            <circle cx={n.x} cy={n.y} r={shellR}
              fill={`color-mix(in oklch, ${SHELL_COLOR} ${isSel ? 14 : 8}%, transparent)`}
              stroke={SHELL_COLOR}
              strokeWidth={isSel ? 2 : 1.2}
              strokeDasharray={isSel ? undefined : '4 3'}
              opacity={0.85}
            />
            {/* Shell label */}
            <text x={n.x} y={n.y - shellR - 5} textAnchor="middle" fill={SHELL_COLOR}
                  fontSize={9} fontFamily="IBM Plex Mono" opacity={0.65}>
              shell
            </text>
            {/* Core circle */}
            <circle cx={n.x} cy={n.y} r={n.r}
              fill={`color-mix(in oklch, ${CORE_COLOR} ${isSel ? 28 : 14}%, transparent)`}
              stroke={CORE_COLOR}
              strokeWidth={isSel ? 2 : 1.5}
              style={isSel ? { filter: `drop-shadow(0 0 6px ${CORE_COLOR})` } : undefined}
            />
            {/* Nucleus labels */}
            <text x={n.x} y={n.y - 3} textAnchor="middle" fill={CORE_COLOR}
                  fontSize={11} fontFamily="IBM Plex Mono" fontWeight={700} opacity={isSel ? 1 : 0.85}>
              {n.parrot}
            </text>
            <text x={n.x} y={n.y + 10} textAnchor="middle" fill="#b6c8df"
                  fontSize={9} fontFamily="IBM Plex Mono" opacity={0.5}>
              ≈{n.oscine}
            </text>
          </g>
        )
      })}

      {/* Brainstem output node */}
      <circle cx={280} cy={260} r={16}
        fill="color-mix(in oklch, #b57bee 12%, transparent)"
        stroke="#b57bee" strokeWidth={1.5} opacity={0.7}
      />
      <text x={280} y={264} textAnchor="middle" fill="#b57bee"
            fontSize={9} fontFamily="IBM Plex Mono" opacity={0.75}>
        motor
      </text>
      <line x1={268} y1={206} x2={272} y2={243} stroke={CORE_COLOR} strokeWidth={1.5}
            opacity={0.5} markerEnd="url(#arr-core)" />

      {/* Legend */}
      <g transform="translate(10, 266)">
        <circle cx={8} cy={7} r={6} fill="none" stroke={SHELL_COLOR} strokeWidth={1.2} strokeDasharray="3 2" />
        <text x={18} y={11} fill={SHELL_COLOR} fontSize={9} fontFamily="IBM Plex Sans" opacity={0.7}>Shell — parrot unique</text>
        <circle cx={110} cy={7} r={6} fill="none" stroke={CORE_COLOR} strokeWidth={1.5} />
        <text x={120} y={11} fill={CORE_COLOR} fontSize={9} fontFamily="IBM Plex Sans" opacity={0.7}>Core — shared with oscines (convergent)</text>
      </g>
    </svg>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ParrotShell() {
  const [selNucleus, setSelNucleus] = useState<string | null>('aac')
  const [selFinding, setSelFinding] = useState<string>('chakraborty')

  const nucleus = NUCLEI.find(n => n.id === selNucleus)
  const finding = FINDINGS.find(f => f.id === selFinding)!

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--parrot)', marginBottom: 8 }}>
          Parrots · Core & Shell
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          A Song System Within a Song System
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Every parrot song nucleus has a core resembling oscine nuclei, surrounded by a shell
          found nowhere else in the animal kingdom. The shell is proportionally larger in the
          best vocal mimics and may represent how a vocal system elaborates through duplication.
        </p>

        {/* Core-and-shell diagram */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '0 0 16px' }}>
          The Parrot Song Nuclei
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 20 }}>
          Three key nuclei — NLC (≈HVC), AAC (≈RA), MMSt (≈Area X) — each with a core that
          mirrors oscine anatomy and a surrounding parrot-unique shell. Click a nucleus to explore.
        </p>

        <div className="bird-intro-grid">
          <div className="bird-intro-plot-wrap">
            <CoreShellDiagram selected={selNucleus} onSelect={setSelNucleus} />
          </div>

          <aside className="bird-syntax-panel">
            {nucleus ? (
              <>
                <span className="bird-syntax-badge" style={{
                  color: CORE_COLOR,
                  borderColor: `color-mix(in oklch, ${CORE_COLOR} 40%, transparent)`,
                  background: `color-mix(in oklch, ${CORE_COLOR} 8%, transparent)`,
                }}>
                  {nucleus.parrot} — {nucleus.role}
                </span>
                <h3 className="bird-info-title" style={{ color: CORE_COLOR, marginTop: 14 }}>
                  Core: {nucleus.parrot} ≈ {nucleus.oscine}
                </h3>
                <p className="bird-info-body">{nucleus.coreDetail}</p>
                <h3 className="bird-info-title" style={{ color: SHELL_COLOR, marginTop: 16 }}>
                  Shell: parrot-unique
                </h3>
                <p className="bird-info-body">{nucleus.shellDetail}</p>
              </>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
                Click any nucleus to read about its core and shell.
              </p>
            )}
          </aside>
        </div>

        {/* Species shell-size spectrum */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 16px' }}>
          Shell Size Across Species
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 20 }}>
          Shell size is correlatively (not yet causally) linked to vocal-mimicry complexity.
          The kea (basal Strigopoidea, 29 Mya) has only a rudimentary shell — setting the
          minimum age of the parrot vocal learning system.
        </p>

        <div className="parrot-shell-species">
          {SPECIES_DATA.map(sp => (
            <div key={sp.id} className="parrot-shell-sp-row">
              <div className="parrot-shell-sp-meta">
                <span className="parrot-shell-sp-name">{sp.name}</span>
                <span className="parrot-shell-sp-latin">{sp.latin}</span>
                <span className="parrot-shell-sp-family">{sp.superfamily}</span>
                {sp.mya && <span className="parrot-shell-sp-mya">≥ {sp.mya} Mya</span>}
              </div>
              <div className="parrot-shell-sp-bar-wrap">
                <div className="parrot-shell-sp-bar-track">
                  <div
                    className="parrot-shell-sp-bar-fill"
                    style={{ width: `${sp.shellRel * 100}%` }}
                  />
                </div>
                <span className="parrot-shell-sp-pct">{Math.round(sp.shellRel * 100)}%</span>
              </div>
              <p className="parrot-shell-sp-note">{sp.notes}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--fg-quiet)', fontStyle: 'italic', marginTop: 8 }}>
          Relative shell-to-core ratio is schematic (Chakraborty et al. 2015 figure 3 data);
          exact percentages are illustrative of the reported trend.
        </p>

        {/* Key findings */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 16px' }}>
          Key Findings
        </h3>

        <div className="parrot-shell-findings">
          <div className="parrot-shell-finding-tabs">
            {FINDINGS.map(f => (
              <button
                key={f.id}
                className={`parrot-shell-finding-tab${selFinding === f.id ? ' active' : ''}`}
                style={{ '--fin-color': f.color } as React.CSSProperties}
                onClick={() => setSelFinding(f.id)}
              >
                <span className="parrot-shell-finding-year">{f.year}</span>
                <span className="parrot-shell-finding-ref">{f.ref}</span>
              </button>
            ))}
          </div>
          <div className="parrot-shell-finding-panel" style={{ borderLeftColor: finding.color }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: finding.color, margin: '0 0 10px' }}>
              {finding.headline}
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, margin: 0 }}>
              {finding.body}
            </p>
          </div>
        </div>

        {/* Callout */}
        <div className="bird-intro-callout" style={{ marginTop: 40 }}>
          <p className="bird-intro-callout-label">The duplication model</p>
          <p>
            The core-and-shell architecture instantiates Jarvis's "continuum hypothesis" directly:
            a basic vocal-learning loop (core) elaborated by a surrounding secondary system (shell).
            Whether the shell emerged by literal gene-regulatory duplication of the core, or by
            recruitment of adjacent tissue, is not yet resolved — but functionally, parrots show
            what happens when a vocal-learning system doubles. The shell is the unique parrot
            contribution to understanding how complex vocal systems can evolve.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '29 Mya', label: 'Minimum age of the parrot vocal learning system — set by the kea\'s rudimentary shell (Chakraborty 2015)' },
            { val: '9',      label: 'Parrot species across all three superfamilies examined in Chakraborty et al. 2015' },
            { val: '2025',   label: 'Yang & Long — first population recordings in budgerigar AAC: a pitch-organized motor map convergent with human LMC' },
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
