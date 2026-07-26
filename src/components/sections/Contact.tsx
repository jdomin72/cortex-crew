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

export function Contact() {
  const secondary = site.socials.filter((social) => !social.primary)

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-24 md:py-32">
      {/* oversized hexagon outline, purely decorative */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 text-fg-faint opacity-25"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 3 91 26.5v47L50 97 9 73.5v-47Z"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
        <path
          d="M50 15 80 32.5v35L50 85 20 67.5v-35Z"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeLinejoin="round"
        />
      </svg>

      <div className="container relative">
        <hr className="rule-gradient mb-14" />

        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-brand-cyan">
            Work with us
          </p>

          <h2 id="contact-title" className="mt-5 font-display text-section font-bold text-fg">
            We don't just participate,{' '}
            <span className="text-gradient">we make an impact.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-fg-muted">
            Organising a competition, looking for a team to invite, or a student at DIU who wants in
            for CTF season? Message the page or send us a line.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button
              href="https://facebook.com/teamcortexcrew"
              size="lg"
              icon="facebook"
              iconPosition="left"
              external
            >
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
                    className="focus-ring flex h-10 w-10 items-center justify-center rounded-chip border border-base-700 text-fg-subtle transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan"
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
