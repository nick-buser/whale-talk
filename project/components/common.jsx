/* Shared React helpers and small components used across acts. */

const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

/* Intersection-observer hook — fire callback when element scrolls into view. */
function useInView(ref, opts) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } });
    }, opts || { rootMargin: '-10% 0px -10% 0px', threshold: 0.05 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, seen]);
  return seen;
}

/* Format seconds → "0.43 s" or "430 ms" depending on magnitude */
function fmtSec(s) {
  if (s == null) return '—';
  if (s < 1) return `${Math.round(s * 1000)} ms`;
  return `${s.toFixed(2)} s`;
}

/* Eyebrow with a horizontal rule */
function Eyebrow({ num, children }) {
  return (
    <div className="eyebrow">
      <span className="rule"></span>
      {num != null && <span className="num">§ {String(num).padStart(2, '0')}</span>}
      <span>{children}</span>
    </div>
  );
}

/* Generic specimen / coord row */
function CoordRow({ items }) {
  return (
    <div className="coord-row">
      {items.map((it, i) => (
        <span key={i}>
          {it.k}<span className="v">{it.v}</span>
        </span>
      ))}
    </div>
  );
}

/* A throttled requestAnimationFrame state hook */
function useRaf(active) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      setNow((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return now;
}

/* A simple measured-element hook — returns {w, h} of element */
function useSize(ref) {
  const [size, setSize] = useState({ w: 800, h: 400 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/* Pill / chip */
function Chip({ active, onClick, children, dotColor }) {
  return (
    <button className={`chip${active ? ' active' : ''}`} onClick={onClick}>
      {dotColor && <span className="dot" style={{ background: dotColor }}></span>}
      {children}
    </button>
  );
}

/* Reveal — fade-up wrapper */
function Reveal({ children, delay=0, as: As = 'div', ...rest }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <As ref={ref} {...rest} style={{
      ...(rest.style||{}),
      opacity: seen ? 1 : 0,
      transform: seen ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 900ms var(--ease-glide) ${delay}ms, transform 900ms var(--ease-glide) ${delay}ms`
    }}>{children}</As>
  );
}

/* Export helpers for other component files */
Object.assign(window, {
  React, useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect,
  useInView, useRaf, useSize, fmtSec,
  Eyebrow, CoordRow, Chip, Reveal,
});
