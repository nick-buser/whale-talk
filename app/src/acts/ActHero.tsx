import { useEffect, useRef } from 'react'
import { Eyebrow } from '../components/Eyebrow'

export function ActHero() {
  const sonarRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      if (!sonarRef.current) return
      const y = window.scrollY
      sonarRef.current.style.transform = `translateY(calc(-50% + ${y * 0.18}px))`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!driftRef.current) return
    const el = driftRef.current
    const dots: Array<{ el: HTMLDivElement; dx: number; dy: number; twink: number }> = []
    const N = 28
    for (let i = 0; i < N; i++) {
      const d = document.createElement('div')
      d.className = 'd'
      const r = Math.random() * 2 + 0.6
      d.style.cssText = `position:absolute;width:${r*2}px;height:${r*2}px;border-radius:999px;background:var(--lumen-core);box-shadow:0 0 ${8+r*4}px var(--lumen-core);opacity:${0.25 + Math.random()*0.5};left:${Math.random()*100}%;top:${Math.random()*100}%;pointer-events:none;`
      el.appendChild(d)
      dots.push({ el: d, dx: (Math.random()-0.5)*0.05, dy: (Math.random()-0.5)*0.05, twink: Math.random()*Math.PI*2 })
    }
    let raf = 0
    const t0 = performance.now()
    const loop = () => {
      const t = (performance.now() - t0) / 1000
      dots.forEach(dot => {
        const cx = parseFloat(dot.el.style.left)
        const cy = parseFloat(dot.el.style.top)
        let nx = cx + dot.dx
        let ny = cy + dot.dy
        if (nx < -2) nx = 102; if (nx > 102) nx = -2
        if (ny < -2) ny = 102; if (ny > 102) ny = -2
        dot.el.style.left = nx + '%'
        dot.el.style.top  = ny + '%'
        dot.el.style.opacity = (0.25 + Math.abs(Math.sin(t + dot.twink)) * 0.6).toFixed(2)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      while (el.firstChild) el.removeChild(el.firstChild)
    }
  }, [])

  return (
    <section id="hero" className="act act-hero" data-screen-label="01 Surface">
      <div className="bio">
        <img src="/assets/bioluminescence.svg" alt="" />
      </div>
      <div className="bio" ref={driftRef} aria-hidden="true"></div>
      <div className="sonar" ref={sonarRef}>
        <img src="/assets/sonar-rings.svg" alt="" />
      </div>

      <div className="col">
        <Eyebrow>
          <span style={{ color: 'var(--lumen)' }}>An interactive essay</span>
          {' '}· ocean acoustics, communication, and the long attempt to listen
        </Eyebrow>
        <h1>
          Sounding<br />
          the <span className="acc">deep</span>
        </h1>
        <p className="lede">
          For seventy years we have been recording. We have a corpus of millions of clicks, moans, and songs.
          We have models that find structure. We still do not know — not really — what any of it&nbsp;means.
        </p>

        <div className="meta">
          <div>
            <span className="k">Corpus</span>
            <span className="v">~9 million coded clicks</span>
          </div>
          <div>
            <span className="k">Species featured</span>
            <span className="v">6</span>
          </div>
          <div>
            <span className="k">Interactives</span>
            <span className="v">8 acts</span>
          </div>
          <div>
            <span className="k">Reading time</span>
            <span className="v">~22 min</span>
          </div>
        </div>
      </div>

      <div className="scroll-cue">
        <span>sounding</span>
        <span className="line"></span>
      </div>
    </section>
  )
}
