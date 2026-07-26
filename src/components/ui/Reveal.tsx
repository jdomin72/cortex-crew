import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { observeOnce, prefersReducedMotion } from '@/lib/observer'

export interface RevealProps {
  children: ReactNode
  as?: ElementType
  /** ms. Stagger a list with `index * 70`. */
  delay?: number
  threshold?: number
  className?: string
}

/**
 * Scroll-reveal wrapper. The visual transition itself lives in index.css, gated
 * behind `prefers-reduced-motion: no-preference` — so a reduced-motion user
 * never receives the hidden state at all.
 *
 * The matchMedia check here is the second belt: it skips the observer entirely
 * so nothing depends on JS running for the content to be visible.
 *
 * Never wrap hero content in this — a hidden LCP element defers LCP paint.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  threshold = 0.15,
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (shown || !ref.current) return
    return observeOnce(ref.current, () => setShown(true), { threshold })
  }, [shown, threshold])

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? 'in' : ''}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  )
}
