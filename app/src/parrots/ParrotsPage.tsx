import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',       label: 'Intro' },
  { id: 'signature',   label: 'Signature Calls' },
  { id: 'warble',      label: 'Warble' },
  { id: 'alex',        label: 'The Alex Program' },
  { id: 'shell',       label: 'Core & Shell' },
  { id: 'convergence', label: 'Convergence' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'Parrots',
    blurb: 'The fourth pillar: oscine-grade vocal-learning hardware fused with the most flexible referential use among birds — and why that combination is unique.',
  },
  signature: {
    title: 'Signature Calls',
    blurb: 'Green-rumped parrotlet nestlings learn individually-distinctive contact calls from parents — the clearest avian parallel to dolphin signature whistles and human names.',
  },
  warble: {
    title: 'Warble & the Formal Gap',
    blurb: 'Budgerigar warble is at least 5th-order Markovian with 42 syllable classes — yet no one has placed it in the Chomsky hierarchy. The most conspicuous gap in animal formal-language analysis.',
  },
  alex: {
    title: 'The Alex Program',
    blurb: 'Model/rival training, referential object labels, ordinal-to-cardinal transfer for 7 and 8, and a zero-like "none" response — alongside the methodological limits every reader should weigh.',
  },
  shell: {
    title: 'Core & Shell',
    blurb: 'Parrots have a song system within a song system: a core resembling oscine nuclei surrounded by a shell unique to parrots — larger in grey parrots and macaws, rudimentary in the kea 29 Mya.',
  },
  convergence: {
    title: 'Convergence',
    blurb: 'Tongue as vocal-tract articulator, primate-like neuron counts at half the brain mass, and a shared FoxP2/SLIT-ROBO toolkit: three independent convergences with human speech.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:       lazy(() => import('./sections/ParrotIntro').then(m => ({ default: m.ParrotIntro }))),
  signature:   lazy(() => import('./sections/ParrotSignature').then(m => ({ default: m.ParrotSignature }))),
  warble:      lazy(() => import('./sections/ParrotWarble').then(m => ({ default: m.ParrotWarble }))),
  alex:        lazy(() => import('./sections/ParrotAlex').then(m => ({ default: m.ParrotAlex }))),
  shell:       lazy(() => import('./sections/ParrotShell').then(m => ({ default: m.ParrotShell }))),
  convergence: lazy(() => import('./sections/ParrotConvergence').then(m => ({ default: m.ParrotConvergence }))),
}

function ParrotStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="parrot-stub">
      <p className="parrot-stub-eyebrow">Parrots</p>
      <h1 className="parrot-stub-title">{meta.title}</h1>
      <p className="parrot-stub-blurb">{meta.blurb}</p>
      <span className="parrot-stub-tag">Coming soon</span>
    </div>
  )
}

export function ParrotsPage() {
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

      <div className="bird-layout">
        <aside className="bird-sidebar">
          <p className="bird-sidebar-label">Parrots</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/parrots/$section"
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
            ? <Suspense fallback={<ParrotStub section={section} />}><SectionComp /></Suspense>
            : <ParrotStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
