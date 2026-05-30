import { Link } from '@tanstack/react-router'

export function BirdsPlaceholder() {
  return (
    <>
      <header className="chrome">
        <Link to="/" className="brand">
          <img src="/assets/mark.svg" alt="Sounding" />
        </Link>
        <div className="chrome-tabs">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'active' }}>
            Whales
          </Link>
          <Link to="/birds" activeProps={{ className: 'active' }}>
            Birds
          </Link>
        </div>
        <div />
      </header>
      <main style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-sans)', fontSize: 'var(--t-small)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Birds — coming soon
        </p>
      </main>
    </>
  )
}
