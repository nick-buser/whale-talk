import { useState } from 'react'

type Finding = 'network' | 'dualstream' | 'arcuate' | 'foxp2' | 'sign' | 'critical' | 'csl'

interface FindingDef {
  id: Finding
  label: string
  title: string
  body: string
  cite: string
  implication: string
}

const FINDINGS: FindingDef[] = [
  {
    id: 'network',
    label: 'Amodal network',
    title: 'The Frontotemporal Language Network',
    body: 'A left-lateralized network of inferior frontal gyrus (IFG/Broca\'s area) and posterior temporal cortex (STS, MTG, angular gyrus) responds selectively to linguistic content — not to non-linguistic cognition. Critically, this same network activates for speech, sign language, and reading. It does not activate for music, working memory, or math at the same selectivity threshold.',
    cite: 'Fedorenko et al. (2024, Nature), Kanwisher lab localizer paradigm',
    implication: 'Language has a dedicated cortical substrate that is substrate-neutral — it processes linguistic structure regardless of modality. The "language network" is about structure, not sound.',
  },
  {
    id: 'dualstream',
    label: 'Dual-stream model',
    title: 'Ventral + Dorsal Processing Streams',
    body: 'Hickok & Poeppel (2007) proposed two parallel pathways from auditory cortex. The ventral stream (superior temporal → inferior frontal via IFOF and UF) maps sound to meaning — the "what" pathway. The dorsal stream (superior temporal → parietal → frontal via the arcuate fasciculus) maps sound to motor articulation — the "how" pathway. Both are active during normal speech comprehension but become dissociable in lesion cases.',
    cite: 'Hickok & Poeppel (2007, Nature Reviews Neuroscience)',
    implication: 'Damage to the ventral stream causes Wernicke\'s aphasia (sounds but not meanings); damage to the dorsal stream causes Broca\'s aphasia (meanings but not fluent production). The dissociation validates the two-pathway architecture.',
  },
  {
    id: 'arcuate',
    label: 'Arcuate fasciculus',
    title: 'The Expanded Arcuate Fasciculus',
    body: 'The arcuate fasciculus (AF) is a white-matter tract connecting temporal and frontal language regions. Rilling et al. (2008) showed that humans have a large temporal branch of the AF that is reduced or absent in macaques and chimpanzees — suggesting it co-evolved with language. However, Hecht et al. (2025) found substantial temporal AF in chimpanzees using improved tractography, qualifying the uniqueness claim. The AF is larger and more bilateral in humans; its elaboration likely contributed to the dorsal-stream integration supporting syntax.',
    cite: 'Rilling et al. (2008, Nature Neuroscience); Hecht et al. (2025)',
    implication: 'The arcuate fasciculus is not uniquely human but is substantially expanded. Its elaboration may reflect a gradient rather than a saltational change — consistent with gradual evolution of dorsal-stream language capacity.',
  },
  {
    id: 'foxp2',
    label: 'FOXP2 reframed',
    title: 'FOXP2: Not the "Language Gene"',
    body: 'FOXP2 was initially described as a "language gene" after mutations in the KE family caused a severe speech and language disorder. It was thought to be uniquely derived in humans, with two amino-acid substitutions not seen in other species. Atkinson et al. (2018) performed the most comprehensive re-analysis: FOXP2 is a conserved sensorimotor-sequencing gene expressed in the striatum, cerebellum, and motor cortex across vertebrates. The human-specific substitutions improve fine motor coordination and vocal-motor learning. It is not a language gene; it is a sequencing gene that was co-opted.',
    cite: 'Atkinson et al. (2018, Cell)',
    implication: 'FOXP2 mutations disrupt language because language requires fine-grained sensorimotor sequencing — not because FOXP2 encodes anything linguistic. The KE family disorder is primarily a speech motor disorder. This reframing positions FOXP2 as part of the vocal-motor infrastructure, not the compositional-semantic architecture.',
  },
  {
    id: 'sign',
    label: 'Sign language',
    title: 'Sign Language and Amodality',
    body: 'American Sign Language (ASL), British Sign Language (BSL), and other natural sign languages are fully grammatical languages with the same range of syntactic complexity as spoken languages. They activate the same left-lateralized frontotemporal network. Nicaraguan Sign Language (NSL), which emerged spontaneously among deaf children in the 1980s, provides a natural experiment: the first generation developed home signing; the second generation introduced grammatical structure and compositionality; subsequent generations elaborated it further. NSL shows that language can self-organize from communicative interaction without a pre-formed model.',
    cite: 'Sandler et al. (2005, PNAS); Senghas et al. (2004, Science)',
    implication: 'Language is not tied to the vocal-auditory channel. The neural substrate is amodal. NSL shows that the compositional architecture of language can emerge within a generation under the right social conditions.',
  },
  {
    id: 'critical',
    label: 'Critical periods',
    title: 'Critical Periods for Language Acquisition',
    body: 'Mayberry et al. (2002, 2011) provide the clearest evidence for a language acquisition critical period: late first-language learners of ASL (who were born deaf and did not receive language input until school age) show permanent deficits in morphosyntactic processing, proportional to age of first exposure — even after decades of fluent use. Unlike second-language learners (who already have an L1), L1 deprivation during the critical period leaves a permanent neural imprint. The critical period closes gradually across the first decade, not abruptly at puberty.',
    cite: 'Mayberry (2002, 2011); Newport et al. (2001)',
    implication: 'The critical period is for first language, not specifically for speech. It is a window during which the language network is shaped by linguistic input. The sign language AoA findings are the cleanest dissociation of modality from the linguistic critical period.',
  },
  {
    id: 'csl',
    label: 'Cortico-laryngeal',
    title: 'Direct Cortico-Laryngeal Projection',
    body: 'In humans (and songbirds, but not in non-human primates), there is a direct projection from primary motor cortex to nucleus ambiguus (laryngeal motor neurons) — a "cortico-laryngeal" pathway that bypasses the brainstem relay. In non-human primates, laryngeal control goes through the PAG and basal ganglia without a direct cortical projection. Kuypers (1958) first described this in humans; Jürgens (2002) confirmed absence in macaques. In songbirds, the LMAN→RA→12N pathway is the convergent equivalent — direct cortical control of the vocal organ.',
    cite: 'Jürgens (2002, Brain Research); Simonyan & Horwitz (2011, Neuroscientist)',
    implication: 'The direct cortico-laryngeal projection in humans (and birds) is a convergent solution for volitional, learned vocalization. Its absence in apes may be why apes cannot learn new vocalizations — and why Gua, Viki, and other raised-chimp experiments on speech production all failed.',
  },
]

export function HumanNeuro() {
  const [active, setActive] = useState<Finding>('network')
  const def = FINDINGS.find(f => f.id === active)!

  return (
    <div className="human-section">
      <p className="human-eyebrow">Human Language</p>
      <h1 className="human-title">The Language Network</h1>
      <p className="human-lede">
        Language is implemented in a specific, amodal cortical network — but the neural
        architecture spans from the genome (FOXP2) through white-matter connectivity
        (arcuate fasciculus) to the brainstem (cortico-laryngeal projection). Each node
        connects to the comparative evidence from other pillars.
      </p>

      {/* Brain schematic SVG */}
      <div className="neuro-brain-wrap">
        <svg viewBox="0 0 640 300" className="neuro-brain-svg" aria-label="Language network brain schematic">
          {/* Cortex outline */}
          <ellipse cx={220} cy={150} rx={180} ry={130} fill="color-mix(in oklch, var(--human-gold) 6%, transparent)" stroke="color-mix(in oklch, var(--human-gold) 25%, transparent)" strokeWidth="1.5" />

          {/* Broca's area (IFG) */}
          <circle cx={130} cy={185} r={22} fill="color-mix(in oklch, #c9a84c 30%, transparent)" stroke="#c9a84c" strokeWidth="1.5" />
          <text x={130} y={182} textAnchor="middle" fill="#c9a84c" fontSize="8" fontFamily="var(--font-sans)" fontWeight="600">IFG</text>
          <text x={130} y={193} textAnchor="middle" fill="#c9a84c" fontSize="7" fontFamily="var(--font-sans)">(Broca)</text>

          {/* Wernicke's (posterior temporal) */}
          <circle cx={310} cy={200} r={22} fill="color-mix(in oklch, #c9a84c 30%, transparent)" stroke="#c9a84c" strokeWidth="1.5" />
          <text x={310} y={197} textAnchor="middle" fill="#c9a84c" fontSize="8" fontFamily="var(--font-sans)" fontWeight="600">STS/MTG</text>
          <text x={310} y={208} textAnchor="middle" fill="#c9a84c" fontSize="7" fontFamily="var(--font-sans)">(Wernicke)</text>

          {/* Motor cortex */}
          <circle cx={170} cy={75} r={18} fill="color-mix(in oklch, #4afdc6 20%, transparent)" stroke="#4afdc6" strokeWidth="1.5" />
          <text x={170} y={72} textAnchor="middle" fill="#4afdc6" fontSize="8" fontFamily="var(--font-sans)" fontWeight="600">Motor</text>
          <text x={170} y={83} textAnchor="middle" fill="#4afdc6" fontSize="7" fontFamily="var(--font-sans)">cortex</text>

          {/* Parietal */}
          <circle cx={275} cy={95} r={16} fill="color-mix(in oklch, #b57bee 20%, transparent)" stroke="#b57bee" strokeWidth="1.5" />
          <text x={275} y={92} textAnchor="middle" fill="#b57bee" fontSize="7.5" fontFamily="var(--font-sans)" fontWeight="600">Parietal</text>
          <text x={275} y={103} textAnchor="middle" fill="#b57bee" fontSize="7" fontFamily="var(--font-sans)">(IPL/SMG)</text>

          {/* Dorsal stream arc */}
          <path d="M 152 78 Q 230 50 258 98" fill="none" stroke="#4afdc6" strokeWidth="1.5" strokeDasharray="5 3" />
          <path d="M 152 78 Q 140 130 148 168" fill="none" stroke="#4afdc6" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={185} y={48} textAnchor="middle" fill="#4afdc6" fontSize="9" fontFamily="var(--font-sans)" fontStyle="italic">dorsal stream</text>

          {/* Ventral stream arc */}
          <path d="M 152 198 Q 230 230 288 200" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={220} y={248} textAnchor="middle" fill="#c9a84c" fontSize="9" fontFamily="var(--font-sans)" fontStyle="italic">ventral stream</text>

          {/* Arcuate fasciculus deep */}
          <path d="M 148 170 Q 220 140 290 178" fill="none" stroke="color-mix(in oklch, #c9a84c 60%, #4afdc6)" strokeWidth="2" />
          <text x={220} y={148} textAnchor="middle" fill="color-mix(in oklch, #c9a84c 60%, #4afdc6)" fontSize="8.5" fontFamily="var(--font-sans)" fontWeight="600">arcuate fasciculus</text>

          {/* Subcortical / brainstem region */}
          <ellipse cx={470} cy={150} rx={120} ry={80} fill="color-mix(in oklch, var(--fg-quiet) 5%, transparent)" stroke="color-mix(in oklch, var(--fg-quiet) 20%, transparent)" strokeWidth="1" />
          <text x={470} y={100} textAnchor="middle" fill="var(--fg-muted)" fontSize="10" fontFamily="var(--font-sans)" fontWeight="600">Subcortical</text>

          <circle cx={440} cy={130} r={14} fill="color-mix(in oklch, #ffb472 20%, transparent)" stroke="#ffb472" strokeWidth="1.5" />
          <text x={440} y={127} textAnchor="middle" fill="#ffb472" fontSize="7" fontFamily="var(--font-sans)" fontWeight="600">Striatum</text>
          <text x={440} y={137} textAnchor="middle" fill="#ffb472" fontSize="7" fontFamily="var(--font-sans)">(FOXP2)</text>

          <circle cx={500} cy={165} r={14} fill="color-mix(in oklch, #8ae04a 20%, transparent)" stroke="#8ae04a" strokeWidth="1.5" />
          <text x={500} y={162} textAnchor="middle" fill="#8ae04a" fontSize="7" fontFamily="var(--font-sans)" fontWeight="600">Nucleus</text>
          <text x={500} y={172} textAnchor="middle" fill="#8ae04a" fontSize="7" fontFamily="var(--font-sans)">ambiguus</text>

          {/* Direct cortico-laryngeal arrow */}
          <path d="M 170 93 Q 400 80 487 152" fill="none" stroke="#8ae04a" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x={330} y={68} textAnchor="middle" fill="#8ae04a" fontSize="8.5" fontFamily="var(--font-sans)">direct cortico-laryngeal</text>
          <text x={330} y={79} textAnchor="middle" fill="#8ae04a" fontSize="8.5" fontFamily="var(--font-sans)">(absent in non-human apes)</text>

          {/* Labels */}
          <text x={320} y={288} textAnchor="middle" fill="var(--fg-quiet)" fontSize="9" fontFamily="var(--font-sans)">Left hemisphere schematic — not to scale</text>
        </svg>
      </div>

      {/* Finding selector */}
      <div className="neuro-tabs">
        {FINDINGS.map(f => (
          <button
            key={f.id}
            className={`neuro-tab${active === f.id ? ' active' : ''}`}
            onClick={() => setActive(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="neuro-detail">
        <h3 className="neuro-detail-title">{def.title}</h3>
        <p className="neuro-detail-body">{def.body}</p>
        <div className="neuro-detail-cite">
          <span className="neuro-cite-label">Source:</span> {def.cite}
        </div>
        <div className="neuro-detail-impl">
          <span className="neuro-impl-label">Comparative implication:</span> {def.implication}
        </div>
      </div>
    </div>
  )
}
