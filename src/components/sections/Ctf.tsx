import { ctf, ctfTeamUrl, ctfWidgetEnabled } from '@/data/site'
import { Section } from '../Section'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

/**
 * Both states of the CTFtime slot occupy the same footprint, so flipping
 * `ctf.teamId` from null to an id causes no reflow.
 */
function CtfTimeSlot() {
  if (!ctfWidgetEnabled || !ctf.stats || !ctfTeamUrl) {
    return (
      <div className="flex min-h-[7.5rem] flex-col items-center justify-center rounded-card border border-dashed border-base-600 p-6 text-center">
        <Icon name="flag" size={20} className="text-fg-subtle" />
        <p className="mt-3 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
          CTFtime team profile — registration pending
        </p>
      </div>
    )
  }

  const { stats } = ctf

  return (
    <Card accent="cyan" topRule className="min-h-[7.5rem] p-6">
      <dl className="grid grid-cols-3 gap-4">
        <div>
          <dt className="font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
            Global rank
          </dt>
          <dd className="tnum mt-1 font-display text-xl font-bold text-fg">#{stats.ratingPlace}</dd>
        </div>
        <div>
          <dt className="font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
            Rating
          </dt>
          <dd className="tnum mt-1 font-display text-xl font-bold text-fg">{stats.ratingPoints}</dd>
        </div>
        <div>
          <dt className="font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
            Events
          </dt>
          <dd className="tnum mt-1 font-display text-xl font-bold text-fg">{stats.eventsPlayed}</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
          {stats.year} season · updated {stats.updated}
        </p>
        <Button href={ctfTeamUrl} variant="ghost" size="sm" icon="external" external>
          CTFtime
        </Button>
      </div>
    </Card>
  )
}

export function Ctf() {
  return (
    <Section
      id="ctf"
      eyebrow="What's next"
      title={ctf.headline}
      lead={ctf.body}
      band
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* ── focus areas ── */}
        <Reveal>
          <ul className="space-y-5">
            {ctf.focusAreas.map((area) => (
              <li key={area.label} className="flex gap-3">
                <span aria-hidden="true" className="mt-0.5 font-mono text-brand-cyan">
                  &gt;
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-fg">{area.label}</h3>
                  <p className="mt-1 text-sm text-fg-muted">{area.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {ctf.platforms.map((platform) => (
              <li key={platform.id}>
                <a
                  href={platform.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={
                    'focus-ring flex items-center justify-between rounded-chip border border-base-700 px-4 py-3 transition-colors hover:border-brand-cyan/50 ' +
                    (platform.status === 'planned' ? 'opacity-60' : '')
                  }
                >
                  <span>
                    <span className="block text-sm font-medium text-fg">{platform.name}</span>
                    {platform.note ? (
                      <span className="block text-xs text-fg-subtle">{platform.note}</span>
                    ) : null}
                  </span>
                  <Icon name="external" size={14} className="text-fg-subtle" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── terminal panel — static text, no typewriter, no blinking cursor ── */}
        <Reveal delay={100}>
          <Card accent="cyan" className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-base-700 bg-base-900 px-4 py-3">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-base-600" />
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-base-600" />
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-base-600" />
              <span className="ml-2 font-mono text-xs text-fg-subtle">cortex@ctf: ~</span>
            </div>

            <pre className="overflow-x-auto bg-base-950 p-5 font-mono text-xs leading-relaxed text-fg-muted">
              <code>
                {ctf.terminalLines.map((line, index) => (
                  <span
                    key={`${index}-${line}`}
                    className={line.startsWith('$') ? 'block text-brand-cyan' : 'block'}
                  >
                    {line || ' '}
                  </span>
                ))}
              </code>
            </pre>
          </Card>

          <div className="mt-5">
            <CtfTimeSlot />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
