import { members } from '@/data/site'
import type { SocialPlatform } from '@/data/types'
import { Section } from '../Section'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { CAROUSEL_ITEM, Carousel } from '../ui/Carousel'
import { Icon, type IconName } from '../ui/Icon'

const PLATFORM_ICON: Record<SocialPlatform, IconName> = {
  facebook: 'facebook',
  github: 'github',
  linkedin: 'linkedin',
  telegram: 'telegram',
  instagram: 'instagram',
  behance: 'behance',
  x: 'x',
  email: 'mail',
  website: 'globe',
  ctftime: 'flag',
}

/**
 * The crew, as a slideshow.
 *
 * Six people no longer fit a single row at a readable card size, so the roster
 * scrolls. See `Carousel` for why it is a scroll container rather than a slide
 * swapper — the short version is that every card stays in the DOM, in the
 * prerendered HTML, and reachable without JavaScript.
 *
 * Cards are left-aligned to match the rest of the page, and members render a
 * photo where one has been supplied and the monogram hexagon where one has not.
 * The frame is identical either way, which is what stops a mixed row reading as
 * missing images.
 */
export function Team() {
  const crew = members.filter((member) => member.kind === 'member')

  return (
    <Section
      id="team"
      eyebrow="The crew"
      title="Six people, one team name."
      lead="We split the work the way a competition demands it — someone owns the model, someone owns the machine it runs on, someone owns what the judges see."
    >
      {/* Auto-rotates so all six are seen without anyone having to swipe. The
          timer only runs while the section is on screen — it used to start at
          page load, so a reader arriving here found it already on page two and
          never reliably saw the first three. It stops the instant the reader
          takes control, pauses on hover, focus and when the tab is hidden, never
          starts under reduced motion, and ships a pause button — see `Carousel`.

          2s per page is the team's call (2026-08-02). Smooth scrolling eats
          ~0.4s of it, so a card holds still for ~1.6s. The pause button is what
          keeps WCAG 2.2.2 satisfied, not the interval length. */}
      <Carousel label="the crew" autoRotate={2000}>
        {crew.map((member) => (
          <div key={member.id} className={CAROUSEL_ITEM}>
            <Card interactive className="group flex h-full flex-col p-6 md:p-7">
              <Avatar
                name={member.name}
                initials={member.initials}
                photo={member.photo}
                accent={member.accent}
                size={88}
              />

              <h3 className="semiwide mt-6 font-display text-lg font-bold text-fg">
                {member.name}
              </h3>
              <span aria-hidden="true" className="draw-x mt-3 block h-px w-12 bg-fg" />

              <p className="semiwide mt-3 font-display text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                {member.role}
              </p>

              {member.focus?.length ? (
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {member.focus.map((item) => (
                    <li key={item}>
                      <Badge variant="outline">{item}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}

              {member.links?.length ? (
                <ul className="mt-auto flex flex-wrap gap-1 pt-6">
                  {member.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target={link.platform === 'email' ? undefined : '_blank'}
                        rel={link.platform === 'email' ? undefined : 'noreferrer noopener'}
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-chip border border-line text-fg-subtle transition-colors hover:border-fg-subtle hover:text-fg"
                      >
                        <Icon name={PLATFORM_ICON[link.platform]} size={16} />
                        <span className="sr-only">
                          {member.name} on {link.label}
                          {link.platform === 'email' ? '' : ' (opens in a new tab)'}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          </div>
        ))}
      </Carousel>
    </Section>
  )
}
