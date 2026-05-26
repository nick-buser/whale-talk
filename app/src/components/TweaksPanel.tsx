import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useTweaks } from '../lib/tweaks'

/* ── Sub-controls ─────────────────────────────────────────────────────────── */

function Section({ label }: { label: string }) {
  return <div className="twk-sect">{label}</div>
}

function Row({ label, value, children }: { label: string; value?: ReactNode; children: ReactNode }) {
  return (
    <div className="twk-row">
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button
        type="button"
        className="twk-toggle"
        data-on={value ? '1' : '0'}
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </div>
  )
}

function Slider({
  label, value, min, max, step, unit = '', onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit?: string
  onChange: (v: number) => void
}) {
  return (
    <Row label={label} value={`${value.toFixed(2)}${unit}`}>
      <input
        type="range"
        className="twk-slider"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </Row>
  )
}

/* ── Panel shell ──────────────────────────────────────────────────────────── */

interface TweaksPanelProps {
  open: boolean
  onClose: () => void
}

const PAD = 16

export function TweaksPanel({ open, onClose }: TweaksPanelProps) {
  const { tweaks, setTweak } = useTweaks()
  const panelRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef({ x: PAD, y: PAD })

  function clampToViewport() {
    const panel = panelRef.current
    if (!panel) return
    const w = panel.offsetWidth, h = panel.offsetHeight
    offsetRef.current = {
      x: Math.min(Math.max(PAD, offsetRef.current.x), Math.max(PAD, window.innerWidth - w - PAD)),
      y: Math.min(Math.max(PAD, offsetRef.current.y), Math.max(PAD, window.innerHeight - h - PAD)),
    }
    panel.style.right  = offsetRef.current.x + 'px'
    panel.style.bottom = offsetRef.current.y + 'px'
  }

  function onDragStart(e: React.MouseEvent) {
    const panel = panelRef.current
    if (!panel) return
    const r = panel.getBoundingClientRect()
    const sx = e.clientX, sy = e.clientY
    const startRight  = window.innerWidth  - r.right
    const startBottom = window.innerHeight - r.bottom
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight  - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      }
      clampToViewport()
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  if (!open) return null

  const style: CSSProperties = {
    right:  offsetRef.current.x,
    bottom: offsetRef.current.y,
  }

  return (
    <div ref={panelRef} className="twk-panel" style={style}>
      <div className="twk-hd" onMouseDown={onDragStart}>
        <b>Tweaks</b>
        <button
          className="twk-x"
          aria-label="Close tweaks"
          onMouseDown={e => e.stopPropagation()}
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="twk-body">
        <Section label="Audio" />
        <Toggle
          label="Ambient blue-whale drone"
          value={tweaks.ambientDrone}
          onChange={v => setTweak('ambientDrone', v)}
        />

        <Section label="Reading" />
        <Toggle
          label="Show annotations"
          value={tweaks.showAnnotations}
          onChange={v => setTweak('showAnnotations', v)}
        />

        <Section label="Motion" />
        <Slider
          label="Lumen intensity"
          value={tweaks.lumenIntensity}
          min={0.3} max={1.6} step={0.05}
          onChange={v => setTweak('lumenIntensity', v)}
        />
      </div>
    </div>
  )
}
