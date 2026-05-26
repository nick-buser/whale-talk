import type { ReactNode } from 'react'

interface ChipProps {
  active?: boolean
  onClick?: () => void
  dotColor?: string
  children: ReactNode
}

export function Chip({ active, onClick, dotColor, children }: ChipProps) {
  return (
    <button className={`chip${active ? ' active' : ''}`} onClick={onClick}>
      {dotColor && <span className="dot" style={{ background: dotColor }}></span>}
      {children}
    </button>
  )
}
