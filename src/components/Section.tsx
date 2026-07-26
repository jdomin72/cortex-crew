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
  className?: string
  children: ReactNode
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  align = 'left',
  band = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        'py-20 md:py-28',
        band && 'border-y border-base-700/60 bg-base-900',
        className,
      )}
    >
      <div className="container">
        <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
          {eyebrow ? (
            <p className="mb-3 font-mono text-label uppercase tracking-[0.18em] text-brand-cyan">
              {eyebrow}
            </p>
          ) : null}
          <h2 id={`${id}-title`} className="font-display text-section font-bold text-fg">
            {title}
          </h2>
          {lead ? <p className="mt-4 text-base leading-relaxed text-fg-muted">{lead}</p> : null}
        </Reveal>

        <div className="mt-12 md:mt-14">{children}</div>
      </div>
    </section>
  )
}
