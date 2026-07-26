import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import type { BrandAccent, MedalTier } from '@/data/types'

type Accent = 'none' | BrandAccent | MedalTier

/** Top-rule gradients. `none` renders no rule at all. */
const RULE: Record<Accent, string> = {
  none: '',
  cyan: 'from-brand-cyan to-brand-blue',
  blue: 'from-brand-blue to-brand-violet',
  violet: 'from-brand-violet to-brand-cyan',
  gold: 'from-tier-gold to-tier-gold/20',
  silver: 'from-tier-silver to-tier-silver/20',
  bronze: 'from-tier-bronze to-tier-bronze/20',
  finalist: 'from-tier-finalist to-tier-finalist/20',
  participant: 'from-base-600 to-base-600/20',
}

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'li' | 'section'
  accent?: Accent
  notch?: 'none' | 'tr' | 'br'
  topRule?: boolean
  interactive?: boolean
}

/**
 * Angular surface.
 *
 * IMPORTANT: the clip-path notch is applied to an absolutely-positioned
 * decorative layer, never to the card root. Clipping the root would also clip
 * the element's own focus outline, silently destroying focus-visible on any
 * interactive card.
 */
export function Card({
  as: Tag = 'div',
  accent = 'none',
  notch = 'none',
  topRule = false,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'relative isolate rounded-card border border-base-700 bg-base-850',
        interactive &&
          'transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-base-600',
        className,
      )}
      {...rest}
    >
      {/* decorative notch layer — safe to clip */}
      {notch !== 'none' ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 rounded-card bg-base-850',
            notch === 'tr' ? 'notch-tr' : 'notch-br',
          )}
        />
      ) : null}

      {topRule && accent !== 'none' ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-card bg-gradient-to-r',
            RULE[accent],
          )}
        />
      ) : null}

      {children}
    </Tag>
  )
}
