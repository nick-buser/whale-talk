import type { ReactNode } from 'react'

interface EyebrowProps {
  num?: number
  children: ReactNode
}

export function Eyebrow({ num, children }: EyebrowProps) {
  return (
    <div className="eyebrow">
      <span className="rule"></span>
      {num != null && <span className="num">§ {String(num).padStart(2, '0')}</span>}
      <span>{children}</span>
    </div>
  )
}
