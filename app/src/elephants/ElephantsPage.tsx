import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',       label: 'Intro' },
  { id: 'infrasound',  label: 'Infrasound' },
  { id: 'names',       label: 'Name-like Calls' },
  { id: 'seismic',     label: 'Seismic Channel' },
  { id: 'brain',       label: 'Brain & Neurons' },
  { id: 'convergence', label: 'Convergence' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'The Sixth Pillar',
    blurb: 'Elephants are the deepest behavioral convergence with cetaceans: large-brained, long-lived, matrilineal, fission–fusion vocal learners who independently evolved individual recognition, candidate arbitrary labels, and von Economo neurons — all from a last common ancestor ~100 Mya.',
  },
  infrasound: {
    title: 'Infrasound',
    blurb: 'Rumbles at 14–35 Hz produced by the same myoelastic-aerodynamic mechanism as human speech. Active formant modulation via nasal vs. oral emission (2 m vs 0.7 m vocal tract). The world\'s most low-frequency-biased mammalian audiogram.',
  },
  names: {
    title: 'Name-like Calls',
    blurb: 'Pardo et al. 2024: a random-forest classifier predicts call receiver at 27.5% accuracy in wild Kenyan elephants — claimed as arbitrary, non-imitative vocal labels. The Dharmarajan 2026 statistical rebuttal and the unresolved caller-ID confound make this the single most consequential open question in elephant communication.',
  },
  seismic: {
    title: 'The Seismic Channel',
    blurb: 'Rumbles couple into the ground as Rayleigh waves detectable at up to ~6 km. Elephants behaviorally freeze and lean forward in response to seismic playbacks. The detection mechanism — Pacinian corpuscles vs. bone conduction — remains contested. Unique among all six pillars.',
  },
  brain: {
    title: 'Brain & Neurons',
    blurb: 'The largest terrestrial brain (4.6 kg, 257 billion neurons) — but 97.5% of neurons are in the cerebellum. Only ~5.6 billion cortical neurons, one-third of the human count. The neuron-count paradox: sophistication decoupled from cortical size.',
  },
  convergence: {
    title: 'Convergence',
    blurb: 'Semantics-heavy, syntax-light — the inverse of oscine song, the parallel of dolphins. Hockett features: plausible arbitrariness and displacement, no demonstrated productivity or duality. The cetacean convergence is the deepest in the series.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:       lazy(() => import('./sections/ElephantIntro').then(m => ({ default: m.ElephantIntro }))),
  infrasound:  lazy(() => import('./sections/ElephantInfrasound').then(m => ({ default: m.ElephantInfrasound }))),
  names:       lazy(() => import('./sections/ElephantNames').then(m => ({ default: m.ElephantNames }))),
  seismic:     lazy(() => import('./sections/ElephantSeismic').then(m => ({ default: m.ElephantSeismic }))),
  brain:       lazy(() => import('./sections/ElephantBrain').then(m => ({ default: m.ElephantBrain }))),
  convergence: lazy(() => import('./sections/ElephantConvergence').then(m => ({ default: m.ElephantConvergence }))),
}

function ElephantStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="elephant-stub">
      <p className="elephant-stub-eyebrow">Elephants</p>
      <h1 className="elephant-stub-title">{meta.title}</h1>
      <p className="elephant-stub-blurb">{meta.blurb}</p>
      <span className="elephant-stub-tag">Coming soon</span>
    </div>
  )
}

export function ElephantsPage() {
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

  const SectionComp = SECTION_COMPONENTS[section]

  return (
    <>
      <header className="chrome elephant-chrome">
        <div className="chrome-left">
          <Link to="/" className="brand">
            <img src="/assets/mark.svg" alt="Sounding" />
          </Link>
          <div className="chrome-tabs">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'active' }}>
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
          </div>
        </div>
        <div />
        <div />
      </header>

      <div className="elephant-layout">
        <aside className="elephant-sidebar">
          <p className="elephant-sidebar-label">Elephants</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/elephants/$section"
                params={{ section: s.id }}
                activeProps={{ className: 'active' }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="elephant-main">
          {SectionComp
            ? <Suspense fallback={<ElephantStub section={section} />}><SectionComp /></Suspense>
            : <ElephantStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
