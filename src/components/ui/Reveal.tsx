import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface RevealProps {
  children: ReactNode
  as?: ElementType
  /** ms — offsets the entrance animation so siblings cascade. */
  delay?: number
  className?: string
}

/**
 * Section wrapper. Applies a pure-CSS entrance animation and nothing else.
 *
 * ## Why there is no JavaScript here
 *
 * This used to hide each block and reveal it via IntersectionObserver. That
 * design put the site's own content behind a JS success condition, and it
 * stranded content three separate times under real conditions: a fast scroll,
 * a scrollbar drag, and the gap between mount and the observer attaching.
 * Every fix moved the race rather than removing it.
 *
 * Content is the product; the animation is decoration. Decoration must never be
 * able to hide the product. So:
 *
 * - **No hidden initial state.** Nothing can get stuck invisible, because
 *   nothing is ever set to `opacity: 0` from script.
 * - **Prerender-safe.** The static HTML shipped to crawlers is visible markup,
 *   not `opacity: 0` markup that would read as cloaking.
 * - **No-JS safe.** The page is fully readable if the bundle never loads.
 * - **Cheaper.** One CSS animation per block, no observers, no state, no
 *   re-renders.
 *
 * The animation itself is defined in `index.css` under
 * `@media (prefers-reduced-motion: no-preference)`, so reduced-motion users get
 * plain static content.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className }: RevealProps) {
  return (
    <Tag
      className={cn('reveal', className)}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
