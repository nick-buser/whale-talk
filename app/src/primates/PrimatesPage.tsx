import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',           label: 'Intro' },
  { id: 'reference',       label: 'Reference' },
  { id: 'combinatorics',   label: 'Combinatorics' },
  { id: 'compositionality', label: 'Compositionality' },
  { id: 'gesture',         label: 'Gesture' },
  { id: 'vocalcontrol',    label: 'Vocal Control' },
  { id: 'rsa',             label: 'RSA Model' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'Primate Communication',
    blurb: 'The inverse of birdsong: rich reference and intentionality without productive syntax — and what that asymmetry reveals about language origins.',
  },
  reference: {
    title: 'Functional Reference',
    blurb: 'Vervet alarm calls as the canonical case: three call types, three predator categories, three escape behaviors — and the hard question of what "meaning" amounts to here.',
  },
  combinatorics: {
    title: 'Call Combinatorics',
    blurb: 'Campbell\'s monkey affixation, the pyow-hack idiom result, gelada Menzerath\'s law, and the cotton-top tamarin AⁿBⁿ failure — what sequence structure looks like without grammar.',
  },
  compositionality: {
    title: 'The Productivity Test',
    blurb: 'Yang\'s Zipfian productivity criterion applied to Nim Chimpsky\'s combinations, Schlenker\'s formal monkey linguistics, and the Berthet 2026 titi monkey result.',
  },
  gesture: {
    title: 'Ape Gesture',
    blurb: 'An ~80-type lexicon, intentionality criteria, and the Graham & Hobaiter 2023 cross-species comprehension finding — reference and intent without combinatorial syntax.',
  },
  vocalcontrol: {
    title: 'Vocal Control',
    blurb: 'The dual-pathway model (PAG affective vs. cortical volitional), Hage & Nieder vlPFC neurons, and the direct LMC→nucleus ambiguus projection unique to humans.',
  },
  rsa: {
    title: 'Bayesian Pragmatics',
    blurb: 'Rational Speech Acts model: arousal-gradient likelihood, recursive L₀→S₁→L₁ recursion, and live comparison against Campbell\'s and titi monkey call corpora.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:             lazy(() => import('./sections/PrimateIntro').then(m => ({ default: m.PrimateIntro }))),
  reference:         lazy(() => import('./sections/PrimateReference').then(m => ({ default: m.PrimateReference }))),
  combinatorics:     lazy(() => import('./sections/PrimateCombinatorics').then(m => ({ default: m.PrimateCombinatorics }))),
  compositionality:  lazy(() => import('./sections/PrimateCompositionality').then(m => ({ default: m.PrimateCompositionality }))),
  gesture:           lazy(() => import('./sections/PrimateGesture').then(m => ({ default: m.PrimateGesture }))),
  vocalcontrol:      lazy(() => import('./sections/PrimateVocalControl').then(m => ({ default: m.PrimateVocalControl }))),
  rsa:               lazy(() => import('./sections/PrimateRSA').then(m => ({ default: m.PrimateRSA }))),
}

function PrimateStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="primate-stub">
      <p className="primate-stub-eyebrow">Primates</p>
      <h1 className="primate-stub-title">{meta.title}</h1>
      <p className="primate-stub-blurb">{meta.blurb}</p>
      <span className="primate-stub-tag">Coming soon</span>
    </div>
  )
}

export function PrimatesPage() {
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
      <header className="chrome">
        <div className="chrome-left">
          <Link to="/whales/$section" params={{ section: 'hero' }} className="brand">
            <img src="/assets/mark.svg" alt="Sounding" />
          </Link>
          <div className="chrome-tabs">
            <Link to="/whales/$section" params={{ section: 'hero' }} className={onWhales ? 'active' : ''}>
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
            <Link
              to="/elephants/$section"
              params={{ section: 'intro' }}
              className={onElephants ? 'active' : ''}
            >
              Elephants
            </Link>
            <Link
              to="/human/$section"
              params={{ section: 'intro' }}
              className={onHuman ? 'active' : ''}
            >
              Human
            </Link>
            <Link
              to="/llm/$section"
              params={{ section: 'intro' }}
              className={onLlm ? 'active' : ''}
            >
              LLMs
            </Link>
            <Link
              to="/frontiers/$section"
              params={{ section: 'intro' }}
              className={onFrontiers ? 'active' : ''}
            >
              Frontiers
            </Link>
            <Link
              to="/pets/$section"
              params={{ section: 'intro' }}
              className={onPets ? 'active' : ''}
            >
              Pets
            </Link>
          </div>
        </div>
        <div />
        <div />
      </header>

      <div className="bird-layout">
        <aside className="bird-sidebar">
          <p className="bird-sidebar-label">Primates</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/primates/$section"
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
            ? <Suspense fallback={<PrimateStub section={section} />}><SectionComp /></Suspense>
            : <PrimateStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
