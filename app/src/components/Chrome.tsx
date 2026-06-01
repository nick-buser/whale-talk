import { Link, useLocation } from '@tanstack/react-router'

interface ChromeProps {
  activeAct: string
  audioOn: boolean
  onAudioToggle: () => void
  tweaksOpen: boolean
  onTweaksToggle: () => void
}

const NAV_ITEMS = [
  { id: 'hero',     label: 'Surface' },
  { id: 'spectrum', label: 'Voices' },
  { id: 'range',    label: 'Range' },
  { id: 'anatomy',  label: 'Anatomy' },
  { id: 'coda',     label: 'Codas' },
  { id: 'dsl',      label: 'Score' },
  { id: 'network',  label: 'Network' },
  { id: 'humpback', label: 'Song' },
  { id: 'clade',    label: 'Clade' },
  { id: 'larynx',   label: 'Voice' },
  { id: 'designspace', label: 'Space' },
  { id: 'zipf',     label: 'Zipf' },
  { id: 'brain',    label: 'Brain' },
  { id: 'gap',      label: 'Gap' },
]

export function Chrome({ activeAct, audioOn, onAudioToggle, tweaksOpen, onTweaksToggle }: ChromeProps) {
  const loc = useLocation()
  const onBirds     = loc.pathname.startsWith('/birds')
  const onPrimates  = loc.pathname.startsWith('/primates')
  const onParrots   = loc.pathname.startsWith('/parrots')
  const onBees      = loc.pathname.startsWith('/bees')
  const onElephants = loc.pathname.startsWith('/elephants')
  const onHuman     = loc.pathname.startsWith('/human')
  const onLlm       = loc.pathname.startsWith('/llm')
  const onFrontiers = loc.pathname.startsWith('/frontiers')

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="chrome">
      <div className="chrome-left">
        <a href="#hero" className="brand" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
          <img src="/assets/mark.svg" alt="Sounding" />
        </a>
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
        </div>
      </div>
      <nav className="nav">
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            data-act={item.id}
            className={activeAct === item.id ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollTo(item.id) }}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          className={`twk-trigger${tweaksOpen ? ' active' : ''}`}
          onClick={onTweaksToggle}
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
        <button className={`badge${audioOn ? '' : ' off'}`} onClick={onAudioToggle}>
          <span className="lbl">Audio · {audioOn ? 'on' : 'off'}</span>
        </button>
      </div>
    </header>
  )
}

