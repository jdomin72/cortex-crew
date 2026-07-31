import { achievements } from '@/data/site'
import type { Achievement, MedalTier } from '@/data/types'
import { formatShort } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Section } from '../Section'
import { Img } from '../ui/Img'
import { Reveal } from '../ui/Reveal'

/**
 * The record, set as a results sheet.
 *
 * ── Why this is not a card grid ──
 * The previous version was a bento of six glowing cards: a 4-column feature, a
 * 2-column silver, and finalists at 3 columns each. Two problems. The layout
 * one: 2 + 3 + 3 + 3 left the last finalist orphaned on a row of its own at
 * half width, which the code comment claimed "resolves flush" and did not. The
 * design one is bigger — a competition record is ranked, dated, tabular data,
 * and a card grid is the least specific container available for it. Every other
 * section on this site used the same card, so the record did not read as the
 * page's main event; it read as one more grid.
 *
 * A results sheet is what this content actually is. One shared rail — date in a
 * fixed left gutter, a vertical rule, the result beside it — carries every row,
 * and the rank is set large in expanded tier-coloured caps, which is the
 * lettering of a standings board rather than a landing page.
 *
 * ── The hairline is the honesty ──
 * `REACHED THE FINAL` splits the sheet. Everything above it was won; everything
 * below it is a final the team reached without placing. This device is promoted
 * from the About ledger, where it worked, to the section it matters most in.
 * Podium rows are set large with their evidence photo; finals are quieter and
 * tighter. The typography carries the distinction, so nobody has to read a
 * qualifier to see that three of the five were not wins.
 *
 * Both groups derive from `achievements` by tier, so adding a result never
 * means touching this file.
 */

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

function ResultRow({
  item,
  weight,
  index,
}: {
  item: Achievement
  weight: 'podium' | 'final'
  index: number
}) {
  const podium = weight === 'podium'

  return (
    // Row-level entrance uses <Reveal> — the mechanism already shipped and
    // proven on this site — rather than a second, newer scroll-driven effect.
    // Its `from` state is opacity + translate on a whole row, and it only
    // applies while the row is below the fold, which is the behaviour that has
    // been running here for months.
    <Reveal as="li" delay={index * 60} className="border-t border-line">
      <div className={cn('grid gap-x-8 md:grid-cols-[7rem_1fr]', podium ? 'py-10' : 'py-8')}>
        {/* ── gutter: the date, and the hexagon node that ties this sheet to the
            timeline rail below. 10px — smaller and the hexagon reads as a dot
            and the brand motif is wasted. ── */}
        {/* self-start, or the gutter stretches to the row height and the date
            floats level with the middle of the copy instead of the rank. */}
        <p className="flex items-center gap-2.5 self-start md:pt-3">
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

        {/* ── the rail ──
            Two layers, and the split is deliberate. The `border-l` is STATIC and
            always painted: it is the sheet's structure, and structure must not
            depend on an animation resolving. The span on top is the draw — a
            tier-coloured segment that scales down over the static rule as the
            row enters view, so the sheet visibly inks itself in as you scroll.

            Strictly additive: if the view timeline never resolves, or the
            browser does not support one, you get the plain rail that shipped
            before — never a missing one. This construction is why the animation
            did not need to be verifiable to be safe, which matters, because
            scroll-driven state could not be measured reliably here: two
            harnesses disagreed, and headless returns a blank frame for any
            scrolled viewport. */}
        <div className="relative mt-4 grid gap-8 md:mt-0 md:border-l md:border-line md:pl-8 lg:grid-cols-12">
          <span
            aria-hidden="true"
            className={cn(
              'rail-draw absolute inset-y-0 -left-px hidden w-px md:block',
              TIER_FILL[item.tier],
            )}
          />

          <div className={cn(item.photo ? 'lg:col-span-7' : 'lg:col-span-12 lg:max-w-3xl')}>
            <p
              className={cn(
                'wide font-display font-extrabold uppercase leading-none',
                podium ? 'text-rank' : 'text-2xl md:text-3xl',
                TIER_TEXT[item.tier],
              )}
            >
              {item.rankLabel}
            </p>
            <h3
              className={cn(
                'semiwide mt-5 font-display font-bold leading-snug text-fg',
                podium ? 'text-xl md:text-2xl' : 'text-lg',
              )}
            >
              {item.event}
            </h3>
            <p className="mt-1.5 text-sm text-fg-subtle">
              {item.organizer}
              {item.location ? ` · ${item.location}` : ''}
            </p>

            {item.summary ? (
              <p
                className={cn(
                  'mt-4 leading-relaxed text-fg-muted',
                  podium ? 'text-base' : 'text-sm',
                )}
              >
                {item.summary}
              </p>
            ) : null}

            {item.builtWith ? (
              <p className="mt-6 inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
                Built · {item.builtWith}
              </p>
            ) : null}
          </div>

          {item.photo ? (
            <figure className="lg:col-span-5">
              <Img
                image={item.photo}
                ratio="16/10"
                className="rounded-card border border-line"
                sizes="(min-width: 1024px) 32vw, (min-width: 768px) 60vw, 92vw"
              />
            </figure>
          ) : null}
        </div>
      </div>
    </Reveal>
  )
}

export function Achievements() {
  const podium = achievements.filter((item) => item.tier !== 'finalist')
  const finals = achievements.filter((item) => item.tier === 'finalist')

  return (
    <Section
      id="achievements"
      eyebrow="The record"
      title="Five competitions. Two podiums, three finals."
      lead="Where Cortex Crew finished, event by event — one championship, one runners-up, and three finals reached, across project showcases and hackathons at Daffodil International University and beyond."
    >
      {/* No <Reveal> around the sheet. Fading the whole thing in as one block
          fought the per-row rail draw — the rows need to arrive individually,
          which is the entire point of a sheet that writes itself. */}
      <ol>
        {podium.map((item, index) => (
          <ResultRow key={item.id} item={item} weight="podium" index={index} />
        ))}
      </ol>

      {/* The labelled hairline IS the honesty. Everything above it was won;
          everything below it was a final the team did not place in. Said once,
          structurally, instead of qualified in every row. */}
      <p className="mt-4 flex items-center gap-4 py-6 font-display semiwide text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle">
        <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
        Reached the final
        <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
      </p>

      <ol>
        {finals.map((item, index) => (
          <ResultRow key={item.id} item={item} weight="final" index={index} />
        ))}
      </ol>

      {/* Closes the sheet. Without it the last row just stopped, and a ruled
          document that opens on a rule and does not close on one reads as
          truncated — it left a 250px dead band before the next section. */}
      <hr className="border-0 border-t border-line-strong" />
    </Section>
  )
}
