import { site } from '@/data/site'
import { Icon, type IconName } from './ui/Icon'

const PLATFORM_ICON: Record<string, IconName> = {
  facebook: 'facebook',
  github: 'github',
  linkedin: 'linkedin',
  telegram: 'telegram',
  email: 'mail',
  website: 'globe',
  ctftime: 'flag',
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-base-700/60 bg-base-900">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="hex block h-6 w-6 bg-[linear-gradient(135deg,#22d3ee,#a855f7)]"
              />
              <span className="font-display text-sm font-bold tracking-tight text-fg">
                {site.shortName}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
              A competition team at {site.university}. We build working systems, take them on stage,
              and defend every number.
            </p>
            <p className="mt-4 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
              {site.city}, {site.country}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-label uppercase tracking-[0.18em] text-fg-subtle">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="focus-ring font-mono text-xs tracking-[0.06em] text-fg-muted transition-colors hover:text-brand-cyan"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-label uppercase tracking-[0.18em] text-fg-subtle">
              Connect
            </h2>
            <ul className="mt-4 space-y-2.5">
              {site.socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-brand-cyan"
                  >
                    <Icon name={PLATFORM_ICON[social.platform] ?? 'globe'} size={15} />
                    {social.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="focus-ring inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-brand-cyan"
                >
                  <Icon name="mail" size={15} />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="rule-gradient my-10" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-subtle">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-label uppercase tracking-[0.18em] text-fg-subtle">
            {site.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
