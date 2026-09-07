import { achievements, leader, members, projects, site } from '@/data/site'
import type { MedalTier, SocialPlatform } from '@/data/types'
import { formatShort } from '@/lib/format'
import { cn } from '@/lib/cn'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { Section } from '@/components/Section'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon, type IconName } from '@/components/ui/Icon'

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

const TIER_TEXT: Record<MedalTier, string> = {
  gold: 'text-tier-gold',
  silver: 'text-tier-silver',
  bronze: 'text-tier-bronze',
  finalist: 'text-tier-finalist',
  participant: 'text-fg-subtle',
}

const TIER_FILL: Record<MedalTier, string> = {
  gold: 'bg-tier-gold',
  silver: 'bg-tier-silver',
  bronze: 'bg-tier-bronze',
  finalist: 'bg-tier-finalist',
  participant: 'bg-base-600',
}

const NAV_FROM_PROFILE = {
  homeHref: '/',
  skipHref: '#profile',
  sectionPrefix: '/',
} as const

const PORTRAIT_SIZES = '(min-width: 768px) 176px, 144px'

/**
 * Public biography for the team lead.
 *
 * This page exists so crawlers have one owned, prerendered source of truth —
 * a photo, a third-person biography, and the same social URLs used everywhere
 * else. Visible copy uses Kawsher HRidoy; the official-name mapping lives in
 * Person JSON-LD on the prerendered document.
 */
export function LeaderPage() {
  const member = members.find((item) => item.id === leader.id)
  if (!member) {
    throw new Error(`LeaderPage: missing member '${leader.id}'`)
  }

  const portrait = member.photo
    ? { ...member.photo, sizes: PORTRAIT_SIZES, alt: `${leader.publicName}, ${member.role}` }
    : undefined

  return (
    <>
      <SiteNav {...NAV_FROM_PROFILE} />
      <main>
        <article id="profile" aria-labelledby="profile-name">
          <header className="border-b border-line-strong bg-base-900 pt-24 pb-16 md:pt-28 md:pb-20">
            <div className="container grid items-start gap-10 md:grid-cols-[auto_1fr] md:gap-14">
              <Avatar
                name={leader.publicName}
                initials={member.initials}
                photo={portrait}
                accent={member.accent}
                size={176}
                priority
              />

              <div>
                <p className="mb-4 flex items-center gap-3 font-display semiwide text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                  <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                  Cortex Crew · DIU
                </p>
                <h1
                  id="profile-name"
                  className="semiwide font-display text-section font-bold text-fg"
                >
                  {leader.publicName}
                </h1>
                <p className="mt-3 font-display semiwide text-sm font-semibold uppercase tracking-[0.12em] text-fg-muted">
                  {member.role}
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
                  Team lead of Cortex Crew at {site.university} ({site.city}). AI and machine
                  learning developer; five competition results in 2026.
                </p>

                {member.links?.length ? (
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {member.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target={link.platform === 'email' ? undefined : '_blank'}
                          rel={link.platform === 'email' ? undefined : 'noreferrer noopener'}
                          className="focus-ring flex h-10 w-10 items-center justify-center rounded-chip border border-line text-fg-subtle transition-colors hover:border-fg-subtle hover:text-fg"
                        >
                          <Icon name={PLATFORM_ICON[link.platform]} size={16} />
                          <span className="sr-only">
                            {leader.publicName} on {link.label}
                            {link.platform === 'email' ? '' : ' (opens in a new tab)'}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/" variant="solid" size="md">
                    Cortex Crew
                  </Button>
                  <Button href="/#achievements" variant="outline" size="md">
                    2026 record
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <Section
            id="biography"
            eyebrow="Biography"
            title={`${leader.publicName} leads Cortex Crew.`}
            lead="An AI and machine learning developer at Daffodil International University, and the person who leads Cortex Crew from planning through a live demo."
          >
            <div className="max-w-3xl space-y-5 text-base leading-relaxed text-fg-muted">
              {leader.biography.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-1.5">
              {leader.stack.map((item) => (
                <li key={item}>
                  <Badge variant="outline">{item}</Badge>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            id="record"
            band
            eyebrow="2026 record"
            title="Five results, under his lead."
            lead="The team's competition sheet for 2026. Two podium finishes and three finals reached."
          >
            <ol className="border-y border-line">
              {achievements.map((item) => (
                <li key={item.id} className="border-t border-line first:border-t-0">
                  <div className="grid gap-x-8 py-6 md:grid-cols-[7rem_1fr]">
                    <p className="flex items-center gap-2.5 self-start md:pt-1">
                      <span
                        aria-hidden="true"
                        className={cn('hex block h-2.5 w-2.5 shrink-0', TIER_FILL[item.tier])}
                      />
                      <time
                        dateTime={item.date}
                        className="tnum font-mono text-label uppercase tracking-[0.16em] text-fg-subtle"
                      >
                        {formatShort(item.date)}
                      </time>
                    </p>
                    <div>
                      <p
                        className={cn(
                          'wide font-display text-xl font-extrabold uppercase leading-none tracking-tight md:text-2xl',
                          TIER_TEXT[item.tier],
                        )}
                      >
                        {item.rankLabel}
                      </p>
                      <h3 className="mt-2 text-base font-medium text-fg">{item.event}</h3>
                      <p className="mt-1 text-sm text-fg-subtle">
                        {item.organizer}
                        {item.builtWith ? ` · ${item.builtWith}` : null}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section
            id="work"
            eyebrow="Selected work"
            title="Systems taken to the stage."
            lead="Niro, Autopilot, and AI Mentor are the production systems named in the biography. Darktrace3 is the CSAD Champion build."
          >
            <ul className="grid gap-4 md:grid-cols-2">
              {projects.filter((project) => project.builtFor).map((project) => (
                <li key={project.id}>
                  <Card as="article" className="flex h-full flex-col p-6">
                    <h3 className="wide font-display text-2xl font-extrabold uppercase leading-none text-fg">
                      {project.name}
                    </h3>
                    <span aria-hidden="true" className="mt-3 block h-px w-12 bg-fg" />
                    <p className="mt-3 text-sm text-fg-subtle">{project.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{project.description}</p>
                    {project.builtFor ? (
                      <p className="mt-4 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                        {project.builtFor}
                      </p>
                    ) : null}
                    {project.links?.length ? (
                      <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                        {project.links.map((link) => (
                          <li key={link.href}>
                            <Button href={link.href} variant="outline" size="sm" external>
                              {link.label}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ul>
          </Section>
        </article>
      </main>
      <SiteFooter sectionPrefix="/" />
    </>
  )
}
