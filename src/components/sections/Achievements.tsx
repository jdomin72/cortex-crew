import { achievements } from '@/data/site'
import type { Achievement, MedalTier } from '@/data/types'
import { formatMonthYear } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Section } from '../Section'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Icon, type IconName } from '../ui/Icon'
import { Img } from '../ui/Img'
import { Reveal } from '../ui/Reveal'

const TIER_TEXT: Record<MedalTier, string> = {
  gold: 'text-tier-gold',
  silver: 'text-tier-silver',
  bronze: 'text-tier-bronze',
  finalist: 'text-tier-finalist',
  participant: 'text-fg-subtle',
}

const TIER_BG: Record<MedalTier, string> = {
  gold: 'bg-tier-gold/12',
  silver: 'bg-tier-silver/12',
  bronze: 'bg-tier-bronze/12',
  finalist: 'bg-tier-finalist/12',
  participant: 'bg-base-800',
}

const TIER_ICON: Record<MedalTier, IconName> = {
  gold: 'trophy',
  silver: 'medal',
  bronze: 'medal',
  finalist: 'flag',
  participant: 'flag',
}

/** The result and the team lead. The project is a small meta chip, never the headline. */
function Meta({ item }: { item: Achievement }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
      <span className="inline-flex items-center gap-1.5">
        <Icon name="calendar" size={12} />
        {formatMonthYear(item.date)}
      </span>
      {item.location ? (
        <span className="inline-flex items-center gap-1.5">
          <Icon name="pin" size={12} />
          {item.location}
        </span>
      ) : null}
      {item.prize ? <span className={TIER_TEXT[item.tier]}>{item.prize}</span> : null}
    </div>
  )
}

function TierMark({ tier, size = 'md' }: { tier: MedalTier; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'
  return (
    <span
      className={cn(
        'hex inline-flex items-center justify-center',
        box,
        TIER_BG[tier],
        TIER_TEXT[tier],
      )}
    >
      <Icon name={TIER_ICON[tier]} size={size === 'lg' ? 22 : 18} />
    </span>
  )
}

export function Achievements() {
  const featured = achievements.find((item) => item.featured) ?? achievements[0]
  const rest = achievements.filter((item) => item.id !== featured.id)

  return (
    <Section
      id="achievements"
      eyebrow="The record"
      title="Six competitions. Six times on the board."
      lead="Every event Cortex Crew has entered, and where we finished. One championship, one runners-up, four finals — across project showcases and hackathons at Daffodil International University and beyond."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {/* ── feature card ── */}
        <Reveal as="div" className="sm:col-span-2 lg:col-span-4">
          <Card
            as="article"
            accent={featured.tier}
            notch="tr"
            topRule
            interactive
            className="h-full overflow-hidden"
          >
            <div className="grid h-full md:grid-cols-2">
              {featured.photo ? (
                <Img
                  image={featured.photo}
                  // aspect-ratio on mobile; on md+ the grid row sets the height and
                  // the ratio must be dropped, or `h-full` + `aspect` would resolve
                  // width from height and overflow the column.
                  className="aspect-[16/10] w-full min-w-0 md:aspect-auto md:h-full"
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 92vw, 92vw"
                />
              ) : null}

              <div className="flex min-w-0 flex-col justify-center p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <TierMark tier={featured.tier} size="lg" />
                  <p
                    className={cn(
                      'font-display text-2xl font-bold uppercase tracking-tight md:text-3xl',
                      TIER_TEXT[featured.tier],
                    )}
                  >
                    {featured.rankLabel}
                  </p>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-fg">
                  {featured.event}
                </h3>
                <p className="mt-1 text-sm text-fg-subtle">{featured.organizer}</p>

                {featured.summary ? (
                  <p className="mt-4 text-sm leading-relaxed text-fg-muted">{featured.summary}</p>
                ) : null}

                <Meta item={featured} />
              </div>
            </div>
          </Card>
        </Reveal>

        {/* ── remaining results ──
            Feature spans 4 + silver spans 2 fills row one. The four finalists
            then take 3 columns each across two rows, so the grid resolves flush
            instead of leaving an orphan card on a row of its own. */}
        {rest.map((item, index) => (
          <Reveal
            key={item.id}
            as="div"
            delay={(index + 1) * 60}
            className={index === 0 ? 'lg:col-span-2' : 'lg:col-span-3'}
          >
            <Card
              as="article"
              accent={item.tier}
              notch="tr"
              topRule
              interactive
              className="flex h-full flex-col p-6"
            >
              <div className="flex items-start gap-3">
                <TierMark tier={item.tier} />
                <div className="min-w-0">
                  <p
                    className={cn(
                      'font-display text-lg font-bold uppercase tracking-tight',
                      TIER_TEXT[item.tier],
                    )}
                  >
                    {item.rankLabel}
                  </p>
                  {item.prize ? (
                    <p className="font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
                      {item.prize}
                    </p>
                  ) : null}
                </div>
              </div>

              <h3 className="mt-4 font-display text-base font-bold leading-snug text-fg">
                {item.event}
              </h3>
              <p className="mt-1 text-xs text-fg-subtle">{item.organizer}</p>

              {item.summary ? (
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.summary}</p>
              ) : null}

              {item.photo ? (
                <Img
                  image={item.photo}
                  ratio="16/10"
                  className="mt-5 rounded-chip"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                />
              ) : null}

              <div className="mt-auto">
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="calendar" size={12} />
                    {formatMonthYear(item.date)}
                  </span>
                  {item.builtWith ? (
                    <Badge variant="outline" mono>
                      built · {item.builtWith}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
