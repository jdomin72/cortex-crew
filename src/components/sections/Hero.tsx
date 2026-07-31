import type { CSSProperties } from 'react'
import { achievements, site } from '@/data/site'
import type { MedalTier } from '@/data/types'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'

/**
 * The hero is a letterhead and a standings board, in that order.
 *
 * ── What this replaced, and why ──
 * The previous hero was the template answer for a dark tech landing page: a
 * wordmark, a tagline with bullet separators, two buttons, a row of three big
 * numbers with small labels, a floating logo behind a blurred gradient orb, and
 * a PCB trace grid under all of it. Five decorative layers, none of them saying
 * anything specific about a competition team.
 *
 * ── The tally ──
 * The stat row used to read `5 Competitions · 2 Podium finishes · 3 Finalist`.
 * Those are abstractions *about* the record. This renders the record itself —
 * one row per result tier, with the count — so the reader gets the standings
 * rather than a summary of them, in the same space.
 *
 * It is derived from `achievements` by tier rather than hand-written, which is
 * the point: the hero cannot drift from the record the way a hand-maintained
 * `heroStats` array could. 1 + 1 + 3 = 5 stays true by construction, and the
 * distinction the site exists to be honest about — two won, three finals
 * reached without placing — is stated in the first screen instead of the third.
 *
 * The hero is deliberately NOT wrapped in <Reveal>: a hidden LCP element defers
 * LCP paint. Nothing here animates at rest.
 */

const TIER_TEXT: Record<MedalTier, string> = {
  gold: 'text-tier-gold',
  silver: 'text-tier-silver',
  bronze: 'text-tier-bronze',
  finalist: 'text-tier-finalist',
  participant: 'text-fg-subtle',
}

/** Podium tiers first, then finals — the order the ledger and the sheet use. */
const TALLY_ORDER: MedalTier[] = ['gold', 'silver', 'bronze', 'finalist', 'participant']

/** Typed custom-property style, so the stagger reads as data rather than CSS. */
function delay(name: '--wipe-delay' | '--enter-delay', ms: number): CSSProperties {
  return { [name]: `${ms}ms` } as CSSProperties
}

function buildTally() {
  return TALLY_ORDER.flatMap((tier) => {
    const group = achievements.filter((item) => item.tier === tier)
    if (group.length === 0) return []
    return [
      {
        tier,
        count: group.length,
        // Every result in a tier shares a rank label, so the first is the label.
        label: group[0].rankLabel,
        events: group.map((item) => item.event.split(/\s+[—–-]\s+/)[0]).join(' · '),
      },
    ]
  })
}

export function Hero() {
  const tally = buildTally()
  const primarySocial = site.socials.find((social) => social.primary) ?? site.socials[0]

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative pt-16">
      <div className="container">
        {/* ── letterhead ── */}
        <div className="flex items-end justify-between gap-6 pt-14 md:pt-20">
          <div className="min-w-0">
            <p className="enter font-display semiwide text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle">
              {site.taglineWords.join(' · ')}
            </p>

            {/* The visible words are split across two lines, but the accessible
                name must read "Cortex Crew" — without the sr-only space the DOM
                text serialises as "CORTEXCREW", which is what crawlers and
                screen readers get.

                Monochrome, deliberately. The emblem two hundred pixels to the
                right is already the wordmark in the brand gradient — setting
                the masthead in the same gradient printed it twice and spent the
                page's one loud colour moment on decoration. The colour in this
                hero now belongs entirely to the tally below, where gold, silver
                and cyan mean something.

                Each line is masked so it rises from behind its own edge. This
                is the page's one loud motion moment and the vocabulary every
                rank on the results sheet then repeats. */}
            <h1
              id="hero-title"
              className="wide mt-5 font-display text-masthead font-extrabold uppercase text-fg"
            >
              <span className="wipe" style={delay('--wipe-delay', 40)}>
                <span>Cortex</span>
              </span>
              <span className="sr-only"> </span>
              <span className="wipe" style={delay('--wipe-delay', 130)}>
                <span>Crew</span>
              </span>
            </h1>
          </div>

          {/* ── emblem — no glow layer behind it: the artwork already carries
              its own light, and a blurred gradient orb is the most recognisable
              decoration on the AI-generated web. ── */}
          <div className="enter w-20 shrink-0 sm:w-40 lg:w-56" style={delay('--enter-delay', 200)}>
            <Img image={site.logo} priority ratio="1/1" imgClassName="object-contain" />
          </div>
        </div>

        <hr
          className="enter mt-10 border-0 border-t border-line-strong"
          style={delay('--enter-delay', 260)}
        />

        <p
          className="enter mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted"
          style={delay('--enter-delay', 300)}
        >
          A competition team at {site.university} in {site.city}. We build working systems, take them
          on stage, and defend every number in front of a judging panel.
        </p>

        {/* ── standings ──
            Stacked ruled rows, not a three-column stat band. The columnar
            version is the template shape for a dark landing page, and it also
            broke: `3 FINALIST` carries three event names where the others carry
            one, so the columns never aligned. As rows it previews the results
            sheet further down the page and inherits the same rule motif. */}
        <h2 className="sr-only">Competition record</h2>
        <dl className="mt-12 border-t border-line-strong">
          {tally.map((row, index) => (
            <div
              key={row.tier}
              style={delay('--enter-delay', 360 + index * 60)}
              className="enter grid items-baseline gap-x-6 gap-y-1 border-b border-line py-5 sm:grid-cols-[minmax(0,19rem)_1fr]"
            >
              <dt className="flex items-baseline gap-4">
                <span
                  className={`tnum wide w-10 shrink-0 font-display text-4xl font-extrabold leading-none sm:text-5xl ${TIER_TEXT[row.tier]}`}
                >
                  {row.count}
                </span>
                {/* Deliberately not pluralised. `3 FINALIST` is how a standings
                    tally reads; `3 Finalists` reads as three people. */}
                <span className="semiwide font-display text-sm font-bold uppercase tracking-[0.08em] text-fg">
                  {row.label}
                </span>
              </dt>
              <dd className="text-sm leading-snug text-fg-subtle">{row.events}</dd>
            </div>
          ))}
        </dl>

        <div
          className="enter mt-10 flex flex-wrap gap-3 pb-20 md:pb-28"
          style={delay('--enter-delay', 560)}
        >
          <Button href="#achievements" size="lg" icon="arrow-right">
            See the full record
          </Button>
          <Button
            href={primarySocial.href}
            variant="outline"
            size="lg"
            icon="facebook"
            iconPosition="left"
            external
          >
            Follow the team
          </Button>
        </div>
      </div>
    </section>
  )
}
