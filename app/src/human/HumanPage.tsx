import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',           label: 'Intro' },
  { id: 'hierarchy',       label: 'Formal Hierarchy' },
  { id: 'duality',         label: 'Duality' },
  { id: 'compositionality', label: 'Compositionality' },
  { id: 'neuro',           label: 'Neuroscience' },
  { id: 'grid',            label: 'Pillar Grid' },
  { id: 'infotheory',      label: 'Info Theory' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'The Assembled Whole',
    blurb: 'Human language is not a single magic ingredient — it is a bundle of ~8 co-evolved features that no other known system combines. Compositional semantics is the keystone; the rest are the arch.',
  },
  hierarchy: {
    title: 'Formal Hierarchy',
    blurb: 'Human language is mildly context-sensitive (MCS) — strictly above context-free, far below full Turing power. The Shieber 1985 Swiss German argument, TAG/CCG/LIG/HG, and where each animal system falls on the Chomsky hierarchy.',
  },
  duality: {
    title: 'Duality of Patterning',
    blurb: 'Two independent combinatorial levels: meaningless phonemes compose into morphemes; morphemes compose into sentences. Birds show level one only; no non-human system robustly shows both.',
  },
  compositionality: {
    title: 'Compositional Semantics',
    blurb: 'The keystone feature: meaning of the whole = f(meanings of parts, structure). Primate calls have local semantics at best; titi monkey sequences hint at additivity without composition. Only human language satisfies Frege\'s principle fully.',
  },
  neuro: {
    title: 'The Language Network',
    blurb: 'An amodal frontotemporal network (Fedorenko et al. 2024), dual processing streams, an expanded arcuate fasciculus, a direct cortico-laryngeal projection convergent with songbirds, FOXP2 reframed as a sensorimotor-sequencing gene, and the NSL genesis experiment.',
  },
  grid: {
    title: 'Seven-Pillar Grid',
    blurb: 'All six animal systems × twelve communicative dimensions in a single comparison matrix — the convergence and homology ledger that closes the series.',
  },
  infotheory: {
    title: 'Information Theory Across Species',
    blurb: 'Zipf\'s law, Menzerath-Altmann, and Uniform Information Density recur across every system in the series. Arnon et al. 2025 (Science) showed humpback whales and humans share the same compressibility signature — but compressibility is not compositionality.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:           lazy(() => import('./sections/HumanIntro').then(m => ({ default: m.HumanIntro }))),
  hierarchy:       lazy(() => import('./sections/HumanHierarchy').then(m => ({ default: m.HumanHierarchy }))),
  duality:         lazy(() => import('./sections/HumanDuality').then(m => ({ default: m.HumanDuality }))),
  compositionality: lazy(() => import('./sections/HumanCompositionality').then(m => ({ default: m.HumanCompositionality }))),
  neuro:           lazy(() => import('./sections/HumanNeuro').then(m => ({ default: m.HumanNeuro }))),
  grid:            lazy(() => import('./sections/HumanGrid').then(m => ({ default: m.HumanGrid }))),
  infotheory:      lazy(() => import('./sections/HumanInfoTheory').then(m => ({ default: m.HumanInfoTheory }))),
}

function HumanStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="human-stub">
      <p className="human-stub-eyebrow">Human Language</p>
      <h1 className="human-stub-title">{meta.title}</h1>
      <p className="human-stub-blurb">{meta.blurb}</p>
      <span className="human-stub-tag">Coming soon</span>
    </div>
  )
}

export function HumanPage() {
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
      <header className="chrome human-chrome">
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

      <div className="human-layout">
        <aside className="human-sidebar">
          <p className="human-sidebar-label">Human Language</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/human/$section"
                params={{ section: s.id }}
                activeProps={{ className: 'active' }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="human-main">
          {SectionComp
            ? <Suspense fallback={<HumanStub section={section} />}><SectionComp /></Suspense>
            : <HumanStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
