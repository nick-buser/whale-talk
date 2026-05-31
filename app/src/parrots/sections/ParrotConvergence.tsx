import { useState } from 'react'

// ── Three convergence pillars ─────────────────────────────────────────────────

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
    id: 'tongue',
    num: 'I',
    label: 'Tongue Articulation',
    tagline: 'Source + filter — convergent with human speech',
    color: '#8ae04a',
    body: 'Parrots use the tongue as a vocal-tract articulator — unique among birds, convergent with humans. Beckers, Nelson & Suthers (2004, Current Biology) replaced the syrinx of monk parakeets with a speaker and showed that tongue movements alone shift formant frequencies and amplitudes. Ohms et al. (2012) confirmed via X-ray cineradiography that the tongue, beak, and oropharyngeal-esophageal cavity modulate formants in real vocalizations. This is source-filter speech production: the syrinx (source) is independently modulated by a supralaryngeal filter — the same architecture as human speech. Songbirds rely primarily on the OEC and beak; only parrots have a tongue-as-articulator.',
    bullets: [
      'Syrinx = source (FEWER intrinsic muscles than oscines, yet more vocal flexibility)',
      'Tongue = filter (shifts formants and amplitudes independently of source)',
      'Beckers 2004: speaker-replaced syrinx confirms lingual-formant control',
      'Paradox: parrots have simpler syrinx than oscines yet greater flexibility — resolved by tongue',
      'Source-filter architecture convergent with human speech (unique among birds)',
    ],
  },
  {
    id: 'neurons',
    num: 'II',
    label: 'Neuron Density',
    tagline: 'Primate-like pallial counts at half the brain mass',
    color: '#ffb472',
    body: 'Olkowicz et al. (2016, PNAS) counted neurons across 28 avian species using the isotropic fractionator. Parrots and songbirds have on average twice as many neurons as primate brains of the same mass, at higher packing density. The macaw illustration: a blue-and-yellow macaw brain (14.38 g) contains 1,914 million pallial neurons — while a macaque with a 69.83 g brain (nearly 5× heavier) contains only 1,710 million cortical neurons. Large parrots match or exceed primates in absolute neuron count with dramatically less brain mass. Subpallial neuron number in parrots scales hyperallometrically (exponent ~1.19) with brain mass. This density convergence is the substrate for the enlarged SpM cerebellar loop (Gutiérrez-Ibáñez 2018) — a telencephalon-to-cerebellum circuit analogous to the primate cortico-ponto-cerebellar pathway.',
    bullets: [
      'Parrots + songbirds: ~2× neurons per gram vs primates (Olkowicz 2016)',
      'Macaw (14 g): 1,914M pallial neurons > Macaque (70 g): 1,710M cortical neurons',
      'Higher packing density: more neurons without proportional size increase',
      'SpM (medial spiriform nucleus): 2–5× larger in parrots than other birds (Gutiérrez-Ibáñez 2018)',
      'SpM forms telencephalon→SpM→cerebellar loop analogous to primate cortico-ponto-cerebellar pathway',
    ],
  },
  {
    id: 'molecular',
    num: 'III',
    label: 'Molecular Toolkit',
    tagline: 'FoxP2, SLIT-ROBO, and convergent gene expression',
    color: '#7da6ff',
    body: 'Pfenning et al. (2014, Science) found convergent specialization in >50 genes — motor-control and connectivity functions — shared between songbird RA, parrot AAC core, hummingbird vocal nucleus, and human laryngeal motor cortex. The SLIT-ROBO axon-guidance system, which directs the direct forebrain→brainstem projection, shows convergent regulatory evolution in all four lineages. FoxP2 (the "language gene") is implicated in all four: in budgerigar MMSt it is persistently downregulated (open-ended learning); in oscine Area X it fluctuates with singing; in humans it is required for speech motor learning. Wirthlin et al. (2018, Current Biology) found parrot-specific gene duplications and accelerated noncoding regions near genes involved in neural development and cognition — with positive selection enriched near FOXP2, NEUROD6, ZEB2, and MEF2C.',
    bullets: [
      '>50 convergently expressed genes in songbird RA, parrot AAC core, hummingbird, human LMC',
      'SLIT-ROBO axon-guidance: convergent downregulation directs the direct cortex→brainstem projection',
      'FoxP2: persistent downregulation in parrot MMSt (vs singing-dependent in oscines)',
      'Wirthlin 2018: parrot-specific gene duplications near FOXP2, NEUROD6, MEF2C',
      'ERBB4, ESRRG: parrot-specific acceleration near cognition/longevity genes',
    ],
  },
]

// ── Four-way convergence table ────────────────────────────────────────────────

interface ConvergenceFeature {
  feature: string
  parrot: string
  oscine: string
  cetacean: string
  human: string
}

const CONV_FEATURES: ConvergenceFeature[] = [
  {
    feature: 'Direct forebrain→brainstem vocal projection',
    parrot:   'AAC core → brainstem ✓',
    oscine:   'RA → brainstem ✓',
    cetacean: 'Inferred ✓',
    human:    'LMC → nucleus ambiguus ✓',
  },
  {
    feature: 'Cortico/pallial-basal-ganglia-thalamic learning loop',
    parrot:   'MMSt (AFP) ✓',
    oscine:   'Area X (AFP) ✓',
    cetacean: 'Likely ✓',
    human:    'Speech striatum ✓',
  },
  {
    feature: 'FoxP2 / FoxP1 vocal specialization',
    parrot:   'Persistent MMSt downregulation',
    oscine:   'Singing-dependent Area X modulation',
    cetacean: 'Downregulated in vocal control areas',
    human:    'Required for speech motor learning (FOXP2 mutations → speech disorder)',
  },
  {
    feature: 'SLIT-ROBO convergent regulation',
    parrot:   '✓ (Pfenning 2014)',
    oscine:   '✓ (Pfenning 2014)',
    cetacean: 'Not yet tested',
    human:    '✓ SLIT1 downregulation in LMC',
  },
  {
    feature: 'Lifelong / open-ended vocal learning',
    parrot:   '✓ both sexes, throughout life',
    oscine:   '✗ sensitive-period constrained (mostly)',
    cetacean: '✓ lifelong (dolphins, whales)',
    human:    '✓',
  },
  {
    feature: 'Learned individual vocal labels ("names")',
    parrot:   '✓ (Berg 2012; Hile 2000)',
    oscine:   '✗',
    cetacean: '✓ dolphin signature whistles (King & Janik 2013)',
    human:    '✓',
  },
  {
    feature: 'Tongue / supralaryngeal filter articulation',
    parrot:   '✓ tongue as formant filter (UNIQUE among birds)',
    oscine:   '✗ (OEC and beak only)',
    cetacean: '✗ (nasal vocal tract)',
    human:    '✓ tongue shapes all vowels',
  },
]

// ── Monophyly debate ──────────────────────────────────────────────────────────

const HOMOLOGY_ITEMS = [
  {
    id: 'phylo',
    label: 'Parrot + passerine sister-group relationship',
    body: 'Suh et al. (2011, Nat Commun) established via ~51 retroposon markers that parrots are the sister group of passerines (clade Psittacopasserae), with falcons next. Jarvis et al. (2014, Science avian phylogeny) confirmed: Australaves = (seriemas, (falcons, (parrots, passerines))). This short shared branch raises the question: did parrots and oscines inherit vocal learning from a common ancestor, or did each evolve it independently?',
  },
  {
    id: 'threegain',
    label: 'Three-gains hypothesis (current majority view)',
    body: 'Jarvis and Chakraborty favor three independent origins: parrots, oscines, and hummingbirds each evolved the core independently. Evidence: (1) the branch ancestral to parrots+all songbirds is very short; (2) parrots uniquely have the extra shell system not present in any oscine — hard to explain as retention from a common ancestor; (3) suboscines (which should also have the system if inherited) do not. Under this view, the parrot core is ANALOGOUS (convergent) to oscine RA/HVC at the trait level, even though both are built from deeply homologous pallial subdivisions.',
  },
  {
    id: 'twogain',
    label: 'Two-gains-with-losses hypothesis (minority view)',
    body: 'An alternative: vocal learning arose once in the parrot+oscine ancestor, with loss in suboscines and New Zealand wrens (Acanthisittidae). Suggestive evidence: a rudimentary RA-like nucleus in the suboscine Eastern phoebe; vocal learning in a bellbird (suboscine). If this is right, the parrot core is HOMOLOGOUS to oscine RA/HVC. The field leans against this — but the question is genuinely unresolved, and parrot/kea neuroanatomical data combined with developmental data from suboscines and Acanthisittidae are the decisive missing evidence.',
  },
  {
    id: 'deepconv',
    label: 'Deep convergence at the circuit-motif level',
    body: 'Regardless of whether the parrot core is homologous or convergent with oscine song nuclei, the recurring circuit architecture — pallial learning loop + direct cortico-brainstem motor projection + SLIT-ROBO + FoxP2 — is independently assembled in parrots, oscines, hummingbirds, cetaceans, and humans. This constrained "limited design space" of complex vocal learning is one of the clearest evolutionary findings to emerge from comparative vocal neuroscience in the last 20 years.',
  },
]

// ── Main export ───────────────────────────────────────────────────────────────

export function ParrotConvergence() {
  const [pillar, setPillar] = useState<string>('tongue')
  const [expanded, setExpanded] = useState<string | null>(null)

  const sel = PILLARS.find(p => p.id === pillar)!

  return (
    <div className="bird-act">
      <div className="col-wide">
        <p className="eyebrow" style={{ color: 'var(--parrot)', marginBottom: 8 }}>
          Parrots · Convergence
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-h1)', color: 'var(--fg)', marginBottom: 16 }}>
          Three Convergences
        </h2>
        <p className="lede" style={{ marginBottom: 48 }}>
          Parrots independently arrived at tongue-based articulation, primate-like neuron counts,
          and a shared molecular toolkit with human speech. Each is a separate evolutionary
          event — converging on the same solution from a different starting point.
        </p>

        {/* Three pillars */}
        <div className="parrot-conv-pillars">
          {PILLARS.map(p => (
            <button
              key={p.id}
              className={`parrot-conv-pillar${pillar === p.id ? ' active' : ''}`}
              style={{ '--conv-color': p.color } as React.CSSProperties}
              onClick={() => setPillar(p.id)}
            >
              <span className="parrot-conv-num">{p.num}</span>
              <span className="parrot-conv-label">{p.label}</span>
              <span className="parrot-conv-tagline">{p.tagline}</span>
            </button>
          ))}
        </div>

        <div className="primate-channel-panel" style={{ borderLeftColor: sel.color }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: sel.color, margin: '0 0 12px' }}>
            {sel.label}
          </h4>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, margin: '0 0 16px' }}>
            {sel.body}
          </p>
          <ul className="primate-channel-bullets">
            {sel.bullets.map(b => <li key={b}>{b}</li>)}
          </ul>
        </div>

        {/* Four-way convergence table */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 16px' }}>
          Four-Way Convergence Table
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: 20 }}>
          The ingredients of complex vocal learning recur independently across four lineages.
          Parrots are the only non-human system that contributes to all but the tongue-column row.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="bird-intro-table" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                <th>Feature</th>
                <th style={{ color: 'var(--parrot)' }}>Parrot</th>
                <th style={{ color: '#ffb472' }}>Oscine</th>
                <th style={{ color: '#4afdc6' }}>Cetacean</th>
                <th style={{ color: '#ff6b54' }}>Human</th>
              </tr>
            </thead>
            <tbody>
              {CONV_FEATURES.map(row => (
                <tr key={row.feature}>
                  <td className="bird-intro-table-dim">{row.feature}</td>
                  <td>{row.parrot}</td>
                  <td>{row.oscine}</td>
                  <td>{row.cetacean}</td>
                  <td>{row.human}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Homology debate */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--fg)', margin: '56px 0 20px' }}>
          Homology vs Convergence: The Core Question
        </h3>

        <div className="primate-limits">
          {HOMOLOGY_ITEMS.map(item => (
            <div
              key={item.id}
              className={`primate-limit-card${expanded === item.id ? ' open' : ''}`}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              role="button"
              aria-expanded={expanded === item.id}
            >
              <div className="primate-limit-header">
                <span className="primate-limit-label">{item.label}</span>
                <span className="primate-limit-caret">{expanded === item.id ? '−' : '+'}</span>
              </div>
              {expanded === item.id && (
                <p className="primate-limit-body">{item.body}</p>
              )}
            </div>
          ))}
        </div>

        {/* Final callout */}
        <div className="bird-intro-callout" style={{ marginTop: 40 }}>
          <p className="bird-intro-callout-label">What four independent lineages prove</p>
          <p>
            Across parrots, oscines, cetaceans, and humans, the same four ingredients
            recur: a pallial–basal-ganglia–thalamic learning loop, a direct forebrain→brainstem
            projection, a shared FoxP2/SLIT-ROBO molecular toolkit, and peripheral articulatory
            control. The convergence is too constrained to be coincidental — it is strong
            evidence that complex vocal learning has a limited set of evolutionary solutions.
            Parrots contribute two features no other non-human lineage provides together: the
            core-and-shell elaboration and tongue-based source-filter articulation.
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-grid" style={{ marginTop: 56 }}>
          {[
            { val: '4',   label: 'Independent lineages that evolved the same core vocal-learning circuit: parrots, oscines, hummingbirds, and humans' },
            { val: '>50', label: 'Genes with convergent expression specializations in parrot AAC, oscine RA, hummingbird nuclei, and human LMC (Pfenning 2014)' },
            { val: '1',   label: 'Avian lineage known to use tongue-based vocal-tract articulation convergent with human speech: Psittaciformes' },
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
