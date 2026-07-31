import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'li' | 'section'
  notch?: 'none' | 'tr' | 'br'
  interactive?: boolean
}

/**
 * Angular surface.
 *
 * ── What was removed ──
 * `accent` and `topRule` painted a two-pixel brand gradient across the top of
 * every card. Applied to results, projects and the CTF panel alike, that was
 * the same three colours on five sections, and on the project cards the accent
 * was assigned arbitrarily per project — so it looked like a code and decoded
 * to nothing. Colour on this page now means a result tier and nothing else.
 *
 * IMPORTANT: the clip-path notch is applied to an absolutely-positioned
 * decorative layer, never to the card root. Clipping the root would also clip
 * the element's own focus outline, silently destroying focus-visible on any
 * interactive card.
 */
export function Card({
  as: Tag = 'div',
  notch = 'none',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'relative isolate rounded-card border border-line bg-base-900',
        interactive &&
          'transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-strong',
        className,
      )}
      {...rest}
    >
      {/* decorative notch layer — safe to clip */}
      {notch !== 'none' ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 rounded-card bg-base-900',
            notch === 'tr' ? 'notch-tr' : 'notch-br',
          )}
        />
      ) : null}

      {children}
    </Tag>
  )
}
