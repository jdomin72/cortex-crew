import { members } from '@/data/site'
import type { SocialPlatform } from '@/data/types'
import { Section } from '../Section'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Icon, type IconName } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

const PLATFORM_ICON: Record<SocialPlatform, IconName> = {
  facebook: 'facebook',
  github: 'github',
  linkedin: 'linkedin',
  telegram: 'telegram',
  email: 'mail',
  website: 'globe',
  ctftime: 'flag',
}

/**
 * ── Why these are left-aligned now ──
 * The crew cards were centred, which made them the only centred block on a page
 * built entirely from left-aligned ruled sheets — and centring three cards of
 * unequal content (one member has social links, two do not) advertises the
 * unevenness rather than absorbing it. Left-aligned, the ragged right edge is
 * simply where the text ends, and the three read as a roster.
 *
 * The name gets the same drawn rule on hover and focus-within that the project
 * cards use, so the page has one interaction vocabulary rather than a different
 * hover per section.
 */
export function Team() {
  const crew = members.filter((member) => member.kind === 'member')
  const mentors = members.filter((member) => member.kind === 'mentor')

  return (
    <Section
      id="team"
      eyebrow="The crew"
      title="Three builders and a mentor."
      lead="We split the work the way a competition demands it — someone owns the model, someone owns the machine it runs on, someone owns what the judges see."
    >
      {/* accents run cyan → blue → violet, so the badge row reproduces the
          brand gradient across the three people */}
      <div className="grid gap-5 md:grid-cols-3">
        {crew.map((member, index) => (
          <Reveal key={member.id} as="div" delay={index * 80}>
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

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {member.focus.map((item) => (
                  <li key={item}>
                    <Badge variant="outline">{item}</Badge>
                  </li>
                ))}
              </ul>

              {member.links?.length ? (
                <ul className="mt-auto flex gap-1 pt-6">
                  {member.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-chip border border-line text-fg-subtle transition-colors hover:border-fg-subtle hover:text-fg"
                      >
                        <Icon name={PLATFORM_ICON[link.platform]} size={16} />
                        <span className="sr-only">
                          {member.name} on {link.label} (opens in a new tab)
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          </Reveal>
        ))}
      </div>

      {mentors.map((mentor) => (
        <Reveal key={mentor.id} as="div" delay={120} className="mt-5">
          <Card className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center md:p-7">
            <Avatar
              name={mentor.name}
              initials={mentor.initials}
              photo={mentor.photo}
              accent={mentor.accent}
              size={72}
            />
            <div>
              <p className="semiwide font-display text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                Mentor
              </p>
              <h3 className="semiwide mt-2 font-display text-lg font-bold text-fg">
                {mentor.name}
              </h3>
              <p className="mt-1 text-sm text-fg-muted">{mentor.department}</p>
            </div>
          </Card>
        </Reveal>
      ))}
    </Section>
  )
}
