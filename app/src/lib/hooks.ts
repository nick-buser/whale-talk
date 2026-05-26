import { useState, useEffect, useLayoutEffect, type RefObject } from 'react'

/* Intersection-observer hook */
export function useInView(ref: RefObject<Element | null>, opts?: IntersectionObserverInit): boolean {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!ref.current || seen) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setSeen(true); obs.disconnect() }
      })
    }, opts || { rootMargin: '-10% 0px -10% 0px', threshold: 0.05 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, seen, opts])
  return seen
}

/* Format seconds */
export function fmtSec(s: number | null | undefined): string {
  if (s == null) return '—'
  if (s < 1) return `${Math.round(s * 1000)} ms`
  return `${s.toFixed(2)} s`
}

/* RAF state hook */
export function useRaf(active: boolean): number {
  const [now, setNow] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const t0 = performance.now()
    const loop = () => {
      setNow((performance.now() - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return now
}

/* Measured-element hook */
export function useSize(ref: RefObject<Element | null>): { w: number; h: number } {
  const [size, setSize] = useState({ w: 800, h: 400 })
  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  return size
}
