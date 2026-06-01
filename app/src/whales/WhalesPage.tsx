import { lazy, Suspense, useState, useEffect } from 'react'
import { Link, useParams, useLocation } from '@tanstack/react-router'
import { TweaksProvider } from '../lib/tweaks'
import { TweaksPanel } from '../components/TweaksPanel'
import { whaleAudio } from '../lib/audio'

const SECTIONS = [
  { id: 'hero',         label: 'Surface' },
  { id: 'spectrum',     label: 'Voices' },
  { id: 'range',        label: 'Range' },
  { id: 'anatomy',      label: 'Anatomy' },
  { id: 'coda',         label: 'Codas' },
  { id: 'dsl',          label: 'Score' },
  { id: 'synth',        label: 'Synthesize' },
  { id: 'dialect',      label: 'Dialects' },
  { id: 'conversation', label: 'Conversation' },
  { id: 'capacity',     label: 'Capacity' },
  { id: 'network',      label: 'Network' },
  { id: 'humpback',     label: 'Song' },
  { id: 'clade',        label: 'Clade' },
  { id: 'larynx',       label: 'Larynx' },
  { id: 'designspace',  label: 'Design Space' },
  { id: 'zipf',         label: 'Zipf' },
  { id: 'brain',        label: 'Brain' },
  { id: 'gap',          label: 'Gap' },
] as const

type SectionId = typeof SECTIONS[number]['id']

const VALID_SECTIONS = new Set<string>(SECTIONS.map(s => s.id))

const SECTION_COMPONENTS: Record<SectionId, React.LazyExoticComponent<React.ComponentType>> = {
  hero:         lazy(() => import('../acts/ActHero').then(m => ({ default: m.ActHero }))),
  spectrum:     lazy(() => import('../acts/ActSpectrum').then(m => ({ default: m.ActSpectrum }))),
  range:        lazy(() => import('../acts/ActRange').then(m => ({ default: m.ActRange }))),
  anatomy:      lazy(() => import('../acts/ActAnatomy').then(m => ({ default: m.ActAnatomy }))),
  coda:         lazy(() => import('../acts/ActCoda').then(m => ({ default: m.ActCoda }))),
  dsl:          lazy(() => import('../acts/ActDsl').then(m => ({ default: m.ActDsl }))),
  synth:        lazy(() => import('../acts/ActSynth').then(m => ({ default: m.ActSynth }))),
  dialect:      lazy(() => import('../acts/ActDialect').then(m => ({ default: m.ActDialect }))),
  conversation: lazy(() => import('../acts/ActConversation').then(m => ({ default: m.ActConversation }))),
  capacity:     lazy(() => import('../acts/ActCapacity').then(m => ({ default: m.ActCapacity }))),
  network:      lazy(() => import('../acts/ActNetwork').then(m => ({ default: m.ActNetwork }))),
  humpback:     lazy(() => import('../acts/ActHumpback').then(m => ({ default: m.ActHumpback }))),
  clade:        lazy(() => import('../acts/ActClade').then(m => ({ default: m.ActClade }))),
  larynx:       lazy(() => import('../acts/ActLarynx').then(m => ({ default: m.ActLarynx }))),
  designspace:  lazy(() => import('../acts/ActDesignSpace').then(m => ({ default: m.ActDesignSpace }))),
  zipf:         lazy(() => import('../acts/ActZipf').then(m => ({ default: m.ActZipf }))),
  brain:        lazy(() => import('../acts/ActBrain').then(m => ({ default: m.ActBrain }))),
  gap:          lazy(() => import('../acts/ActGap').then(m => ({ default: m.ActGap }))),
}

function WhalesPageInner() {
  const { section: raw } = useParams({ strict: false }) as { section?: string }
  const section: SectionId = VALID_SECTIONS.has(raw ?? '') ? (raw as SectionId) : 'hero'
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

  const [audioOn, setAudioOn] = useState(false)
  const [tweaksOpen, setTweaksOpen] = useState(false)

  useEffect(() => {
    let armed = false
    function arm() {
      if (armed) return
      armed = true
      void whaleAudio.resume()
    }
    document.addEventListener('click', arm, { once: true })
    document.addEventListener('keydown', arm, { once: true })
    return () => {
      document.removeEventListener('click', arm)
      document.removeEventListener('keydown', arm)
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        setTweaksOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function handleAudioToggle() {
    const next = !audioOn
    setAudioOn(next)
    void whaleAudio.resume()
    whaleAudio.setMuted(!next)
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className={`twk-trigger${tweaksOpen ? ' active' : ''}`}
            onClick={() => setTweaksOpen(prev => !prev)}
            aria-label="Toggle tweaks panel"
            title="Tweaks (` key)"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <circle cx="7.5" cy="3" r="1.5" fill="currentColor"/>
              <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>
              <circle cx="7.5" cy="12" r="1.5" fill="currentColor"/>
              <line x1="1" y1="3" x2="5.5" y2="3" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="9.5" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="1" y1="7.5" x2="5.5" y2="7.5" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="9.5" y1="7.5" x2="14" y2="7.5" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="1" y1="12" x2="5.5" y2="12" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="9.5" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </button>
          <button className={`badge${audioOn ? '' : ' off'}`} onClick={handleAudioToggle}>
            <span className="lbl">Audio · {audioOn ? 'on' : 'off'}</span>
          </button>
        </div>
      </header>

      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} />

      <div className="whale-layout">
        <aside className="whale-sidebar">
          <p className="whale-sidebar-label">Cetacean Acoustics</p>
          <nav>
            {SECTIONS.map(s => (
              <Link
                key={s.id}
                to="/whales/$section"
                params={{ section: s.id }}
                activeProps={{ className: 'active' }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="whale-main">
          <Suspense fallback={null}>
            <SectionComp />
          </Suspense>
        </main>
      </div>
    </>
  )
}

export function WhalesPage() {
  return (
    <TweaksProvider>
      <WhalesPageInner />
    </TweaksProvider>
  )
}
