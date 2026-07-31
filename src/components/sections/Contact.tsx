import { site } from '@/data/site'
import { Button } from '../ui/Button'
import { Icon, type IconName } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

const PLATFORM_ICON: Record<string, IconName> = {
  facebook: 'facebook',
  github: 'github',
  linkedin: 'linkedin',
  telegram: 'telegram',
  website: 'globe',
}

/**
 * The close.
 *
 * ── What was removed ──
 * A 42rem double-hexagon outline sat behind this section at 25% opacity in
 * `--color-fg-faint`, a colour the tokens document as decorative-only at 2.4:1.
 * At that size and opacity it did not read as a hexagon; it was a smudge behind
 * the type, and it was the largest element on the page. The gradient rule above
 * the heading went with it — a record sheet closes on a hairline.
 *
 * The one piece of colour left is `we make an impact` in tier gold. Gold means
 * "won" everywhere else here, so the closing claim is tied to the result that
 * backs it rather than tinted for effect.
 */
export function Contact() {
  const secondary = site.socials.filter((social) => !social.primary)
  const primary = site.socials.find((social) => social.primary) ?? site.socials[0]

  return (
    // Asymmetric padding on purpose: the CTF band above closes on its own
    // border, so a further 128px before this section's rule left ~190px of
    // nothing. The bottom stays generous — the page should end on air.
    <section id="contact" aria-labelledby="contact-title" className="pb-24 pt-16 md:pb-32 md:pt-20">
      <div className="container">
        <hr className="mb-14 border-0 border-t border-line-strong" />

        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 flex items-center justify-center gap-3 font-display semiwide text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            Work with us
          </p>

          <h2 id="contact-title" className="semiwide font-display text-section font-bold text-fg">
            We don't just participate, <span className="text-tier-gold">we make an impact.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-fg-muted">
            Organising a competition, looking for a team to invite, or a student at DIU who wants in
            for CTF season? Message the page or send us a line.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href={primary.href} size="lg" icon="facebook" iconPosition="left" external>
              Message us on Facebook
            </Button>
            <Button
              href={`mailto:${site.contactEmail}`}
              variant="outline"
              size="lg"
              icon="mail"
              iconPosition="left"
            >
              Email the team
            </Button>
          </div>

          {secondary.length ? (
            <ul className="mt-8 flex justify-center gap-2">
              {secondary.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring flex h-10 w-10 items-center justify-center rounded-chip border border-line text-fg-subtle transition-colors hover:border-fg-subtle hover:text-fg"
                  >
                    <Icon name={PLATFORM_ICON[social.platform] ?? 'globe'} size={17} />
                    <span className="sr-only">{social.label} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
