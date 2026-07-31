import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './ui/Reveal'

export interface SectionProps {
  id: string
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  /** Full-bleed band with a distinct background and hairline edges. */
  band?: boolean
  /** Tightens the vertical rhythm. Used where a section is a coda, not a chapter. */
  compact?: boolean
  className?: string
  children: ReactNode
}

/**
 * Shared section head.
 *
 * The eyebrow is prefixed by a short hairline rather than set in mono cyan. Two
 * reasons: cyan now means "finalist" and must not appear as generic decoration,
 * and mono is now reserved for data (dates, prizes, counts). The rule is the
 * page's structural motif — a record is a ruled sheet — so the heading inherits
 * it instead of introducing a fourth labelling device.
 */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  align = 'left',
  band = false,
  compact = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        compact ? 'py-16 md:py-20' : 'py-20 md:py-28',
        band && 'border-y border-line-strong bg-base-900',
        className,
      )}
    >
      <div className="container">
        <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
          {eyebrow ? (
            <p
              className={cn(
                'mb-4 flex items-center gap-3 font-display semiwide text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle',
                align === 'center' && 'justify-center',
              )}
            >
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              {eyebrow}
            </p>
          ) : null}
          <h2 id={`${id}-title`} className="semiwide font-display text-section font-bold text-fg">
            {title}
          </h2>
          {lead ? <p className="mt-4 text-base leading-relaxed text-fg-muted">{lead}</p> : null}
        </Reveal>

        <div className={cn(compact ? 'mt-10 md:mt-12' : 'mt-12 md:mt-16')}>{children}</div>
      </div>
    </section>
  )
}
