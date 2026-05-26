import { useRef, type CSSProperties, type ReactNode, type ElementType } from 'react'
import { useInView } from '../lib/hooks'

interface RevealProps {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
}

export function Reveal({ children, delay = 0, as: As = 'div', className, style }: RevealProps) {
  const ref = useRef<Element>(null)
  const seen = useInView(ref)
  return (
    <As ref={ref} className={className} style={{
      ...(style || {}),
      opacity: seen ? 1 : 0,
      transform: seen ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 900ms var(--ease-glide) ${delay}ms, transform 900ms var(--ease-glide) ${delay}ms`,
    }}>
      {children}
    </As>
  )
}
