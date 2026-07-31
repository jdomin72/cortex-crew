import { site } from '@/data/site'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

/**
 * The three icons are the exact glyphs printed along the bottom of the team's
 * own logo, so this band reads as inherited from the brand rather than invented
 * for the website.
 *
 * The three markers used to be tinted cyan / blue / violet, one per pillar.
 * That collided with the page's accent system, where cyan means "reached the
 * final" — a cyan badge on an unrelated band teaches the reader the colour is
 * decorative, and then the record sheet's colour stops carrying information.
 * The markers are neutral now; the hexagon alone does the brand work.
 */
export function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="border-y border-line-strong bg-base-900">
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
                'relative py-10 md:px-8 md:first:pl-0 ' +
                (index > 0 ? 'border-t border-line md:border-l md:border-t-0' : '')
              }
            >
              <span className="hex mb-5 flex h-11 w-11 items-center justify-center bg-base-800 text-fg-muted">
                <Icon name={pillar.icon} size={20} />
              </span>

              <h3 className="semiwide font-display text-lg font-bold uppercase tracking-wide text-fg">
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
