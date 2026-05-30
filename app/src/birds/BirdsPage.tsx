import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',     label: 'Intro' },
  { id: 'anatomy',   label: 'Song System' },
  { id: 'syntax',    label: 'Syntax' },
  { id: 'hierarchy', label: 'Hierarchy' },
  { id: 'learning',  label: 'Vocal Learning' },
  { id: 'compare',   label: 'Compare' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'Birdsong',
    blurb: 'An introduction to avian vocal communication from a formal and neuroscientific angle — and why it rhymes with whale codas.',
  },
  anatomy: {
    title: 'Song System',
    blurb: 'The neural circuit that drives song — HVC as premotor clock, RA as motor pattern generator, and the AFP reinforcement loop through Area X.',
  },
  syntax: {
    title: 'Finite-State Syntax',
    blurb: 'Bengalese finch grammars as interactive automata: state nodes, branching probabilities, and what happens when you add one crossing edge.',
  },
  hierarchy: {
    title: 'Chomsky Hierarchy',
    blurb: 'Where birdsong and whale codas fall on the formal-language ladder — and why phonological syntax without semantics matters for language origins.',
  },
  learning: {
    title: 'Vocal Learning',
    blurb: 'Sensitive periods, the AFP as a reinforcement-learning loop, and the FoxP2 gene that links avian song to human speech disorders.',
  },
  compare: {
    title: 'Compare',
    blurb: 'Birds, whales, and humans side-by-side across vocal learning, combinatorial syntax, dialects, and the key neural loci involved.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

// Lazy-load real section components; others fall back to the stub
const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:     lazy(() => import('./sections/BirdIntro').then(m => ({ default: m.BirdIntro }))),
  anatomy:   lazy(() => import('./sections/BirdAnatomy').then(m => ({ default: m.BirdAnatomy }))),
  syntax:    lazy(() => import('./sections/BirdSyntax').then(m => ({ default: m.BirdSyntax }))),
  hierarchy: lazy(() => import('./sections/BirdHierarchy').then(m => ({ default: m.BirdHierarchy }))),
  learning:  lazy(() => import('./sections/BirdLearning').then(m => ({ default: m.BirdLearning }))),
  compare:   lazy(() => import('./sections/BirdCompare').then(m => ({ default: m.BirdCompare }))),
}

function BirdStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="bird-stub">
      <p className="bird-stub-eyebrow">Birdsong</p>
      <h1 className="bird-stub-title">{meta.title}</h1>
      <p className="bird-stub-blurb">{meta.blurb}</p>
      <span className="bird-stub-tag">Coming soon</span>
    </div>
  )
}

export function BirdsPage() {
  const { section: raw } = useParams({ strict: false }) as { section?: string }
  const section: SectionId = VALID_SECTIONS.has(raw ?? '') ? (raw as SectionId) : 'intro'
  const loc = useLocation()
  const onBirds = loc.pathname.startsWith('/birds')
  const onPrimates = loc.pathname.startsWith('/primates')

  const SectionComp = SECTION_COMPONENTS[section]

  return (
    <>
      <header className="chrome">
        <div className="chrome-left">
          <Link to="/" className="brand">
            <img src="/assets/mark.svg" alt="Sounding" />
          </Link>
          <div className="chrome-tabs">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'active' }}>
              Whales
            </Link>
            <Link
              to="/birds/$section"
              params={{ section: 'intro' }}
              className={onBirds ? 'active' : ''}
            >
              Birds
            </Link>
            <Link
              to="/primates/$section"
              params={{ section: 'intro' }}
              className={onPrimates ? 'active' : ''}
            >
              Primates
            </Link>
          </div>
        </div>
        <div />
        <div />
      </header>

      <div className="bird-layout">
        <aside className="bird-sidebar">
          <p className="bird-sidebar-label">Birdsong</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/birds/$section"
                params={{ section: s.id }}
                activeProps={{ className: 'active' }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="bird-main">
          {SectionComp
            ? <Suspense fallback={<BirdStub section={section} />}><SectionComp /></Suspense>
            : <BirdStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
