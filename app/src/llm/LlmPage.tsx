import { lazy, Suspense } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'

const SECTIONS = [
  { id: 'intro',           label: 'Intro' },
  { id: 'grounding',       label: 'Form vs Meaning' },
  { id: 'expressivity',    label: 'The TC⁰ Irony' },
  { id: 'architectures',   label: 'Architectures' },
  { id: 'grid',            label: 'Diagnostic Grid' },
  { id: 'compositionality', label: 'Compositionality' },
  { id: 'compression',     label: 'Compression & Brain' },
  { id: 'bottleneck',      label: 'Inverted Bottleneck' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const SECTION_META: Record<SectionId, { title: string; blurb: string }> = {
  intro: {
    title: 'The Artificial Tongue',
    blurb: 'LLMs are a third evolutionary category — neither biological convergence nor homology, but high-bandwidth cultural distillation. They inherit the behavioral product of the human language bundle without the evolutionary process that built it.',
  },
  grounding: {
    title: 'Form vs Meaning',
    blurb: 'Can a system trained on form alone acquire meaning? The octopus thought experiment, the symbol-grounding problem, the vector-grounding problem, and inferential-role semantics — the exact artificial analog of the contested animal-semantics debates.',
  },
  expressivity: {
    title: 'The TC⁰ Irony',
    blurb: 'Transformers sit in the circuit class TC⁰ — formally below the regular languages, unable to compute PARITY or unbounded Dyck nesting. Human language is mildly context-sensitive, far above. Yet the transformer captures it superbly. The deepest irony in the comparison.',
  },
  architectures: {
    title: 'Architecture Tour',
    blurb: 'From n-grams (literally the Markov chains that model birdsong) through RNN/LSTM, the base transformer, scaling and "emergence," RLHF as an installed Gricean layer, mixture-of-experts, chain-of-thought, and world models.',
  },
  grid: {
    title: 'The Diagnostic Grid',
    blurb: 'The bundle, dimension by dimension, applied to LLMs — each resemblance labelled Distilled (borrowed from training text), Convergent (arising from the objective), or Apparent (surface mimicry). A disassembled kit, not the integrated whole.',
  },
  compositionality: {
    title: 'Compositionality — the Crux',
    blurb: 'The keystone of the human bundle is present but brittle. Dziri\'s "Faith and Fate" shows transformers reduce multi-step composition to linearized subgraph matching; Lake & Baroni show systematicity needs a meta-learning objective, not scale alone.',
  },
  compression: {
    title: 'Compression & the Brain',
    blurb: 'Language modeling is provably equivalent to lossless compression — and biological codes obey the same efficiency laws. The single best candidate for a legitimately deep, convergent (not distilled) shared property. Plus near-noise-ceiling brain alignment.',
  },
  bottleneck: {
    title: 'The Inverted Bottleneck',
    blurb: 'Human compositionality is an adaptation to a transmission bottleneck (Kirby). LLMs ingest the product of that bottleneck without ever undergoing the process. Iterated learning, inverted — and model collapse as its photographic negative.',
  },
}

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Partial<Record<SectionId, React.LazyExoticComponent<React.ComponentType>>> = {
  intro:            lazy(() => import('./sections/LlmIntro').then(m => ({ default: m.LlmIntro }))),
  grounding:        lazy(() => import('./sections/LlmGrounding').then(m => ({ default: m.LlmGrounding }))),
  expressivity:     lazy(() => import('./sections/LlmExpressivity').then(m => ({ default: m.LlmExpressivity }))),
  architectures:    lazy(() => import('./sections/LlmArchitectures').then(m => ({ default: m.LlmArchitectures }))),
  grid:             lazy(() => import('./sections/LlmGrid').then(m => ({ default: m.LlmGrid }))),
  compositionality: lazy(() => import('./sections/LlmCompositionality').then(m => ({ default: m.LlmCompositionality }))),
  compression:      lazy(() => import('./sections/LlmCompression').then(m => ({ default: m.LlmCompression }))),
  bottleneck:       lazy(() => import('./sections/LlmBottleneck').then(m => ({ default: m.LlmBottleneck }))),
}

function LlmStub({ section }: { section: SectionId }) {
  const meta = SECTION_META[section]
  return (
    <div className="llm-stub">
      <p className="llm-stub-eyebrow">Machine Language</p>
      <h1 className="llm-stub-title">{meta.title}</h1>
      <p className="llm-stub-blurb">{meta.blurb}</p>
      <span className="llm-stub-tag">Coming soon</span>
    </div>
  )
}

export function LlmPage() {
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
      <header className="chrome llm-chrome">
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

      <div className="llm-layout">
        <aside className="llm-sidebar">
          <p className="llm-sidebar-label">Machine Language</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/llm/$section"
                params={{ section: s.id }}
                activeProps={{ className: 'active' }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="llm-main">
          {SectionComp
            ? <Suspense fallback={<LlmStub section={section} />}><SectionComp /></Suspense>
            : <LlmStub section={section} />
          }
        </main>
      </div>
    </>
  )
}
