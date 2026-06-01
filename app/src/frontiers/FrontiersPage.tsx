import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',         label: 'The Open Edge' },
  { id: 'scratchpad',    label: 'The Scratchpad Escape' },
  { id: 'grounding',     label: 'The Grounding Spectrum' },
  { id: 'multimodal',    label: 'Crossing Modalities' },
  { id: 'emergence',     label: 'Emergence or Mirage?' },
  { id: 'compressibility', label: 'Cause or Consequence?' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'The Open Edge',
    blurb: 'The previous tab made strong claims. This one is honest about the seams. Six places where the LLM analysis is genuinely unsettled — sorted by how much weight the evidence can bear — and where the stance should be sharpened or softened.',
  },
  scratchpad: {
    title: 'The Scratchpad Escape',
    blurb: 'The TC⁰ irony has an escape hatch. A transformer that may not compute PARITY in one shot can compute it perfectly when allowed to think out loud. Chain-of-thought externalizes intermediate state into the token stream — and lifts the model out of its formal ceiling, in front of you, step by step.',
  },
  grounding: {
    title: 'The Grounding Spectrum',
    blurb: 'Grounding is not one thing. Pull the five notions apart, place each training regime on the axis, and the soft-pedaled stance gets sharp: text-only models have rich inferential-role meaning and lack the one kind — referential — that semantics arguably requires.',
  },
  multimodal: {
    title: 'Crossing Modalities',
    blurb: 'Text-only was never the whole story. Contrastive image–text training pulls a symbol and its percept into one shared space. Watch a toy CLIP align from noise — the closest thing yet to Harnad\'s symbol grounding, and where it still falls short of reference.',
  },
  emergence: {
    title: 'Emergence or Mirage?',
    blurb: 'Capabilities that appear suddenly at scale are the most cited evidence for a phase transition. Toggle the metric on a single fixed model and watch the cliff appear and vanish. Much of "emergence" is a nonlinear ruler applied to smooth improvement — but not all of it.',
  },
  compressibility: {
    title: 'Cause or Consequence?',
    blurb: 'Humpback whales, humans, and LLMs share a compressibility signature. Is the machine re-deriving efficient coding under its own pressure (convergence) — or echoing the already-compressed output of human language (distillation)? The single sharpest open question, and the experiment that could settle it.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:           lazy(() => import('./sections/FrontiersIntro').then(m => ({ default: m.FrontiersIntro }))),
  scratchpad:      lazy(() => import('./sections/FrontiersScratchpad').then(m => ({ default: m.FrontiersScratchpad }))),
  grounding:       lazy(() => import('./sections/FrontiersGrounding').then(m => ({ default: m.FrontiersGrounding }))),
  multimodal:      lazy(() => import('./sections/FrontiersMultimodal').then(m => ({ default: m.FrontiersMultimodal }))),
  emergence:       lazy(() => import('./sections/FrontiersEmergence').then(m => ({ default: m.FrontiersEmergence }))),
  compressibility: lazy(() => import('./sections/FrontiersCompressibility').then(m => ({ default: m.FrontiersCompressibility }))),
}

function FrontiersStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="fr-stub">
      <p className="fr-stub-eyebrow">Open Frontiers</p>
      <h1 className="fr-stub-title">{meta.title}</h1>
      <p className="fr-stub-blurb">{meta.blurb}</p>
      <span className="fr-stub-tag">Coming soon</span>
    </div>
  )
}

export function FrontiersPage() {
  const { section: raw } = useParams({ strict: false }) as { section?: string }
  const section: SectionId = VALID_SECTIONS.has(raw ?? '') ? (raw as SectionId) : 'intro'
  const loc = useLocation()
  const onBirds     = loc.pathname.startsWith('/birds')
  const onPrimates  = loc.pathname.startsWith('/primates')
  const onParrots   = loc.pathname.startsWith('/parrots')
  const onBees      = loc.pathname.startsWith('/bees')
  const onElephants = loc.pathname.startsWith('/elephants')
  const onHuman     = loc.pathname.startsWith('/human')
  const onLlm       = loc.pathname.startsWith('/llm')
  const onFrontiers = loc.pathname.startsWith('/frontiers')
  const onPets      = loc.pathname.startsWith('/pets')
  const onWhales    = loc.pathname.startsWith('/whales') || loc.pathname === '/'

  const SectionComp = SECTION_COMPONENTS[section]

  return (
    <>
      <header className="chrome fr-chrome">
        <div className="chrome-left">
          <Link to="/whales/$section" params={{ section: 'hero' }} className="brand">
            <img src="/assets/mark.svg" alt="Sounding" />
          </Link>
          <div className="chrome-tabs">
            <Link to="/whales/$section" params={{ section: 'hero' }} className={onWhales ? 'active' : ''}>
              Whales
            </Link>
            <Link to="/birds/$section" params={{ section: 'intro' }} className={onBirds ? 'active' : ''}>
              Birds
            </Link>
            <Link to="/primates/$section" params={{ section: 'intro' }} className={onPrimates ? 'active' : ''}>
              Primates
            </Link>
            <Link to="/parrots/$section" params={{ section: 'intro' }} className={onParrots ? 'active' : ''}>
              Parrots
            </Link>
            <Link to="/bees/$section" params={{ section: 'intro' }} className={onBees ? 'active' : ''}>
              Bees
            </Link>
            <Link to="/elephants/$section" params={{ section: 'intro' }} className={onElephants ? 'active' : ''}>
              Elephants
            </Link>
            <Link to="/human/$section" params={{ section: 'intro' }} className={onHuman ? 'active' : ''}>
              Human
            </Link>
            <Link to="/llm/$section" params={{ section: 'intro' }} className={onLlm ? 'active' : ''}>
              LLMs
            </Link>
            <Link to="/frontiers/$section" params={{ section: 'intro' }} className={onFrontiers ? 'active' : ''}>
              Frontiers
            </Link>
            <Link to="/pets/$section" params={{ section: 'intro' }} className={onPets ? 'active' : ''}>
              Pets
            </Link>
          </div>
        </div>
        <div />
        <div />
      </header>

      <div className="fr-layout">
        <aside className="fr-sidebar">
          <p className="fr-sidebar-label">Open Frontiers</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/frontiers/$section"
                params={{ section: s.id }}
                activeProps={{ className: 'active' }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="fr-main">
          {SectionComp
            ? <Suspense fallback={<FrontiersStub section={section} />}><SectionComp /></Suspense>
            : <FrontiersStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
