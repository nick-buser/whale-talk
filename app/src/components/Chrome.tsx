interface ChromeProps {
  activeAct: string
  audioOn: boolean
  onAudioToggle: () => void
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
  { id: 'zipf',     label: 'Zipf' },
  { id: 'brain',    label: 'Brain' },
  { id: 'gap',      label: 'Gap' },
]

export function Chrome({ activeAct, audioOn, onAudioToggle }: ChromeProps) {
  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="chrome">
      <a href="#hero" className="brand" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
        <img src="/assets/mark.svg" alt="Sounding" />
      </a>
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
      <button className={`badge${audioOn ? '' : ' off'}`} onClick={onAudioToggle}>
        <span className="lbl">Audio · {audioOn ? 'on' : 'off'}</span>
      </button>
    </header>
  )
}
