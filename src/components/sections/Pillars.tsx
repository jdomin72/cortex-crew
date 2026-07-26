import { site } from '@/data/site'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

const ACCENT_TEXT = {
  cyan: 'text-brand-cyan',
  blue: 'text-brand-blue',
  violet: 'text-brand-violet',
} as const

const ACCENT_BG = {
  cyan: 'bg-brand-cyan/10',
  blue: 'bg-brand-blue/10',
  violet: 'bg-brand-violet/10',
} as const

/**
 * The three icons are the exact glyphs printed along the bottom of the team's
 * own logo, so this band reads as inherited from the brand rather than invented
 * for the website.
 */
export function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="border-y border-base-700/60 bg-base-900">
      <div className="container">
        <h2 id="pillars-title" className="sr-only">
          What we compete in
        </h2>
        <div className="grid md:grid-cols-3">
          {site.pillars.map((pillar, index) => (
            <Reveal
              key={pillar.id}
              delay={index * 90}
              className={
                'relative px-0 py-10 md:px-8 ' +
                (index > 0
                  ? 'border-t border-base-800 md:border-l md:border-t-0 md:border-base-800'
                  : '')
              }
            >
              {/* vertical gradient hairline between cells */}
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-brand-cyan/25 to-transparent md:block"
                />
              ) : null}

              <span
                className={
                  'hex mb-5 flex h-11 w-11 items-center justify-center ' +
                  ACCENT_BG[pillar.accent] +
                  ' ' +
                  ACCENT_TEXT[pillar.accent]
                }
              >
                <Icon name={pillar.icon} size={20} />
              </span>

              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-fg">
                {pillar.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{pillar.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
