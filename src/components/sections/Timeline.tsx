import { timeline } from '@/data/site'
import type { MedalTier, TimelineStatus } from '@/data/types'
import { formatShort } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Section } from '../Section'
import { Reveal } from '../ui/Reveal'

const NODE: Record<MedalTier | TimelineStatus, string> = {
  gold: 'bg-tier-gold',
  silver: 'bg-tier-silver',
  bronze: 'bg-tier-bronze',
  finalist: 'bg-tier-finalist',
  participant: 'bg-base-600',
  done: 'bg-brand-blue',
  ongoing: 'bg-brand-cyan',
  upcoming: 'bg-base-600',
}

/**
 * The rail is the brand gradient used literally as the spine of the team's
 * history. `upcoming` entries render a DASHED segment, so the line visibly
 * stops being solid exactly where the CTF ambition begins — and the last dashed
 * node sits directly above the CTF section.
 */
export function Timeline() {
  return (
    <Section
      id="timeline"
      eyebrow="How we got here"
      title="One year, five competitions."
      lead="From a first competition in January to the hackathon final in July — and what comes next."
      band
    >
      <ol className="relative mx-auto max-w-3xl">
        {timeline.map((event, index) => {
          const last = index === timeline.length - 1
          const dashed = event.status === 'upcoming'

          return (
            <Reveal as="li" key={event.id} delay={index * 60} className="relative flex gap-6 pb-10 last:pb-0">
              {/* rail + node */}
              <div className="relative flex w-4 shrink-0 justify-center">
                {!last ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute left-1/2 top-4 h-full w-px -translate-x-1/2',
                      dashed
                        ? 'border-l border-dashed border-base-600'
                        : 'bg-gradient-to-b from-brand-cyan/70 via-brand-blue/60 to-brand-violet/50',
                    )}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={cn(
                    'hex relative mt-2 block h-3.5 w-3.5',
                    NODE[event.tier ?? event.status],
                    event.tier === 'gold' && 'ring-2 ring-tier-gold/30',
                  )}
                />
              </div>

              <div className={cn('flex-1 pb-2', dashed && 'opacity-80')}>
                <p className="font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                  {formatShort(event.date)}
                  {dashed ? ' · next' : ''}
                </p>
                <h3
                  className={cn(
                    'mt-1.5 font-display text-base font-bold',
                    dashed ? 'text-fg-muted' : 'text-fg',
                  )}
                >
                  {event.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{event.detail}</p>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
