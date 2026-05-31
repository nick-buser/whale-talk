import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',       label: 'Intro' },
  { id: 'waggle',      label: 'Waggle Dance' },
  { id: 'displaced',   label: 'Displaced Reference' },
  { id: 'information', label: 'Information Theory' },
  { id: 'navigator',   label: 'Million-Neuron Nav' },
  { id: 'convergence', label: 'Convergence' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'The Great Inversion',
    blurb: 'Honeybees achieve full displaced reference — communicating about locations never experienced by the receiver — without vocal learning, language acquisition, or a cortex. The inversion that reframes every primate-centric theory of communication.',
  },
  waggle: {
    title: 'The Waggle Dance',
    blurb: 'Direction encoded as solar-azimuth angle transposed to gravity; distance encoded in run duration via a nonlinear curve. A geometric channel that transmits the full polar coordinates of a foraging site invisible to the receiver.',
  },
  displaced: {
    title: 'Displaced Reference',
    blurb: 'Hockett\'s rarest design feature: the ability to communicate about things absent in time and space. Only bees and humans use it productively. What the bee channel achieves — and where it stops.',
  },
  information: {
    title: 'Information Theory',
    blurb: 'Shannon capacity of the waggle channel: ~3 bits direction, ~2 bits distance, ~1 bit resource quality — 6 bits total per dance. How that compares to great-ape gesture, vervet alarms, and songbird syntax.',
  },
  navigator: {
    title: 'Million-Neuron Navigator',
    blurb: 'One million neurons, no cortex, and a path-integration system that outperforms most robotics. Place cells, vector navigation, spatial working memory, and numerical ordinal sense — all running on 0.0002% of a human brain.',
  },
  convergence: {
    title: 'Convergence & Synthesis',
    blurb: 'The bee channel and human language share displaced reference, compositional encoding, and arbitrary convention — but diverge on openness, learnability, and recursion. What the overlap and the gap together reveal about communication design space.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:       lazy(() => import('./sections/BeeIntro').then(m => ({ default: m.BeeIntro }))),
  waggle:      lazy(() => import('./sections/BeeWaggle').then(m => ({ default: m.BeeWaggle }))),
  displaced:   lazy(() => import('./sections/BeeDisplaced').then(m => ({ default: m.BeeDisplaced }))),
  information: lazy(() => import('./sections/BeeInformation').then(m => ({ default: m.BeeInformation }))),
  navigator:   lazy(() => import('./sections/BeeNavigator').then(m => ({ default: m.BeeNavigator }))),
  convergence: lazy(() => import('./sections/BeeConvergence').then(m => ({ default: m.BeeConvergence }))),
}

function BeeStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="bee-stub">
      <p className="bee-stub-eyebrow">Bees</p>
      <h1 className="bee-stub-title">{meta.title}</h1>
      <p className="bee-stub-blurb">{meta.blurb}</p>
      <span className="bee-stub-tag">Coming soon</span>
    </div>
  )
}

export function BeesPage() {
  const { section: raw } = useParams({ strict: false }) as { section?: string }
  const section: SectionId = VALID_SECTIONS.has(raw ?? '') ? (raw as SectionId) : 'intro'
  const loc = useLocation()
  const onBirds    = loc.pathname.startsWith('/birds')
  const onPrimates = loc.pathname.startsWith('/primates')
  const onParrots  = loc.pathname.startsWith('/parrots')
  const onBees     = loc.pathname.startsWith('/bees')

  const SectionComp = SECTION_COMPONENTS[section]

  return (
    <>
      <header className="chrome bee-chrome">
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
            <Link
              to="/parrots/$section"
              params={{ section: 'intro' }}
              className={onParrots ? 'active' : ''}
            >
              Parrots
            </Link>
            <Link
              to="/bees/$section"
              params={{ section: 'intro' }}
              className={onBees ? 'active' : ''}
            >
              Bees
            </Link>
          </div>
        </div>
        <div />
        <div />
      </header>

      <div className="bee-layout">
        <aside className="bee-sidebar">
          <p className="bee-sidebar-label">Bees</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/bees/$section"
                params={{ section: s.id }}
                activeProps={{ className: 'active' }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="bee-main">
          {SectionComp
            ? <Suspense fallback={<BeeStub section={section} />}><SectionComp /></Suspense>
            : <BeeStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
