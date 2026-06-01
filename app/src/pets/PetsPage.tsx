import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',         label: 'Intro' },
  { id: 'bark',          label: 'The Elaborated Bark' },
  { id: 'gaze',          label: 'Gaze & Faces' },
  { id: 'comprehension', label: 'Reading Humans' },
  { id: 'catcall',       label: 'The Cat Channel' },
  { id: 'compare',       label: 'Natural Experiment' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'Talking to the Apes',
    blurb: 'Dogs and cats are unique in this series: their most remarkable communication is aimed at us. It is neither convergence among wild species, nor homology, nor cultural distillation — but a fourth thing: co-evolved interspecific signaling, shaped by domestication and a lifetime of living with humans.',
  },
  bark: {
    title: 'The Elaborated Bark',
    blurb: 'Wolves bark in one context. Dogs bark in five. The domestic bark is a domestication-elaborated, largely human-directed signal — acoustically distinct by emotion and context, and rated reliably by human listeners who have never owned a dog. Paedomorphism, ritualization, and the origin of a new channel.',
  },
  gaze: {
    title: 'Gaze & Faces',
    blurb: 'A facial muscle absent in wolves but present in dogs produces the infant-like inner-brow raise that triggers human nurturing. A mutual gaze loop floods both species with oxytocin. Dogs wag left or right depending on how they feel — and other dogs read it. The anatomy of the cross-species bond.',
  },
  comprehension: {
    title: 'Reading Humans',
    blurb: 'Dogs follow human points from puppyhood, often outperforming chimpanzees. Three competing explanations — domestication hypothesis, ontogeny, canine cooperation — have been live for twenty years. A handful of "Gifted Word Learner" dogs have over 1,000 object labels. Brain imaging shows dogs separate word meaning from intonation.',
  },
  catcall: {
    title: 'The Cat Channel',
    blurb: 'Adult cats rarely meow at each other. The domestic meow, the solicitation purr, and the slow blink are all directed at humans — and the solicitation purr embeds a high-frequency cry that exploits a mammalian caregiving instinct. Cats form secure attachment bonds at the same rate as human infants. They are understudied, not aloof.',
  },
  compare: {
    title: 'Natural Experiment',
    blurb: 'Two lineages — cooperative-pack wolves, solitary wildcats — arrived at the same niche ("talking to the apes") from opposite starting points. The contrast is a clean test of the social-complexity-drives-communication hypothesis, and places both species in the comparative grid across the whole series.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:         lazy(() => import('./sections/PetsIntro').then(m => ({ default: m.PetsIntro }))),
  bark:          lazy(() => import('./sections/PetsBark').then(m => ({ default: m.PetsBark }))),
  gaze:          lazy(() => import('./sections/PetsGaze').then(m => ({ default: m.PetsGaze }))),
  comprehension: lazy(() => import('./sections/PetsComprehension').then(m => ({ default: m.PetsComprehension }))),
  catcall:       lazy(() => import('./sections/PetsCatCall').then(m => ({ default: m.PetsCatCall }))),
  compare:       lazy(() => import('./sections/PetsCompare').then(m => ({ default: m.PetsCompare }))),
}

function PetsStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="pet-stub">
      <p className="pet-stub-eyebrow">Dogs &amp; Cats</p>
      <h1 className="pet-stub-title">{meta.title}</h1>
      <p className="pet-stub-blurb">{meta.blurb}</p>
      <span className="pet-stub-tag">Coming soon</span>
    </div>
  )
}

export function PetsPage() {
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
      <header className="chrome pet-chrome">
        <div className="chrome-left">
          <Link to="/whales/$section" params={{ section: 'hero' }} className="brand">
            <img src="/assets/mark.svg" alt="Sounding" />
          </Link>
          <div className="chrome-tabs">
            <Link to="/whales/$section" params={{ section: 'hero' }} className={onWhales ? 'active' : ''}>Whales</Link>
            <Link to="/birds/$section" params={{ section: 'intro' }} className={onBirds ? 'active' : ''}>Birds</Link>
            <Link to="/primates/$section" params={{ section: 'intro' }} className={onPrimates ? 'active' : ''}>Primates</Link>
            <Link to="/parrots/$section" params={{ section: 'intro' }} className={onParrots ? 'active' : ''}>Parrots</Link>
            <Link to="/bees/$section" params={{ section: 'intro' }} className={onBees ? 'active' : ''}>Bees</Link>
            <Link to="/elephants/$section" params={{ section: 'intro' }} className={onElephants ? 'active' : ''}>Elephants</Link>
            <Link to="/human/$section" params={{ section: 'intro' }} className={onHuman ? 'active' : ''}>Human</Link>
            <Link to="/llm/$section" params={{ section: 'intro' }} className={onLlm ? 'active' : ''}>LLMs</Link>
            <Link to="/frontiers/$section" params={{ section: 'intro' }} className={onFrontiers ? 'active' : ''}>Frontiers</Link>
            <Link to="/pets/$section" params={{ section: 'intro' }} className={onPets ? 'active' : ''}>Pets</Link>
          </div>
        </div>
        <div />
        <div />
      </header>

      <div className="pet-layout">
        <aside className="pet-sidebar">
          <p className="pet-sidebar-label">Dogs &amp; Cats</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/pets/$section"
                params={{ section: s.id }}
                activeProps={{ className: 'active' }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="pet-main">
          {SectionComp
            ? <Suspense fallback={<PetsStub section={section} />}><SectionComp /></Suspense>
            : <PetsStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
