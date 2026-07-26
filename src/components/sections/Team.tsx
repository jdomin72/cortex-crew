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

export function Team() {
  const crew = members.filter((member) => member.kind === 'member')
  const mentors = members.filter((member) => member.kind === 'mentor')

  return (
    <Section
      id="team"
      eyebrow="The crew"
      title="Three people, one team name."
      lead="We split the work the way a competition demands it — someone owns the model, someone owns the machine it runs on, someone owns what the judges see."
    >
      {/* accents run cyan → blue → violet, so the avatar row reproduces the brand gradient */}
      <div className="grid gap-5 md:grid-cols-3">
        {crew.map((member, index) => (
          <Reveal key={member.id} as="div" delay={index * 80}>
            <Card className="flex h-full flex-col items-center p-8 text-center">
              <Avatar
                name={member.name}
                initials={member.initials}
                photo={member.photo}
                accent={member.accent}
                size={112}
              />

              <h3 className="mt-6 font-display text-lg font-bold text-fg">{member.name}</h3>
              <p className="mt-1 font-mono text-label uppercase tracking-[0.14em] text-brand-cyan">
                {member.role}
              </p>
              {member.department ? (
                <p className="mt-2 text-xs text-fg-subtle">{member.department}</p>
              ) : null}

              <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
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
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-chip border border-base-700 text-fg-subtle transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan"
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
          <Card className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:text-left">
            <Avatar
              name={mentor.name}
              initials={mentor.initials}
              photo={mentor.photo}
              accent={mentor.accent}
              size={84}
            />
            <div className="text-center sm:text-left">
              <p className="font-mono text-label uppercase tracking-[0.18em] text-fg-subtle">
                Mentor
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-fg">{mentor.name}</h3>
              <p className="mt-1 text-sm text-fg-muted">{mentor.department}</p>
            </div>
          </Card>
        </Reveal>
      ))}
    </Section>
  )
}
