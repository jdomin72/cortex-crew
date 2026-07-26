import { achievements, site } from '@/data/site'
import { formatShort } from '@/lib/format'
import { Card } from '../ui/Card'
import { Reveal } from '../ui/Reveal'

/**
 * Who the team is, in continuous prose, beside a precise tally of the record.
 *
 * ── Why the prose exists ──
 * This is the page's extraction surface. The rest of the site is deliberately
 * fragmented — headings, badges, mono labels, stat tiles — which reads well but
 * gives boilerplate extractors nothing to hold onto. Measured before this
 * section existed: trafilatura recovered 47 of 1,247 words. Search engines and
 * LLMs run that same class of extractor to decide what a page is *about*, so
 * these three paragraphs are the highest-leverage text on the site. Keep them
 * factual and self-contained — they should make sense quoted with no context.
 *
 * ── Why the ledger exists ──
 * The record is five results of two different kinds, and the difference matters:
 * two were won, three were finals the team reached without placing. Stating that
 * as one number ("6 placed") overclaims, and a bare claim has no structure —
 * which is exactly why this section used to read as a floating slab of grey text.
 *
 * So the podium rows are set large and in tier colour, and the finals sit below
 * a labelled hairline, smaller and quieter. The typography carries the
 * distinction; nobody has to read a qualifier to see that three of these were
 * not wins. Both groups derive from `achievements` by tier, so adding a result
 * never means touching this file.
 */
export function About() {
  const podium = achievements.filter((a) => a.tier !== 'finalist')
  const finals = achievements.filter((a) => a.tier === 'finalist')

  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="container">
        {/* 7/5 split, echoing the hero's asymmetry so the ratio reads as the
            page's structure rather than a one-off. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 id="about-title" className="font-display text-section font-bold text-fg">
              Who we are
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-fg-muted">
              <strong className="font-semibold text-fg">Cortex Crew</strong> is a student
              competition team at{' '}
              <strong className="font-semibold text-fg">{site.university}</strong> in {site.city},{' '}
              {site.country}, founded in {site.founded}. The team competes in project showcases,
              hackathons, and Capture the Flag events, and is made up of Software Engineering
              students working across machine learning, cyber security, cloud infrastructure, and
              full-stack development.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-fg-muted">
              Cortex Crew has five competition results from 2026. The team won{' '}
              <strong className="font-semibold text-fg">Champion</strong> at the CSAD 2026 Project
              Showcasing Competition, held by the Cyber Security Centre at Daffodil International
              University, and finished{' '}
              <strong className="font-semibold text-fg">1st Runners-up</strong> at the IEEE ICADHI
              2026 Project Showcase, run by the IEEE DIU Student Branch. It reached the final round
              at three more without placing: the AI Innovation Hackathon 2026, the AI Project
              Competition 2026, and the 5th Data Science Summit.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-fg-muted">
              The team is led by Md Kawsher Ahmed, with Shafiur Rahman Shafim on infrastructure and
              telemetry and Arnob Kumar Paul on interface and presentation, mentored by Md. Abdul
              Hye Zebon of the Department of Software Engineering. Cortex Crew builds working
              systems and demonstrates them live rather than presenting concepts, and is now moving
              into competitive Capture the Flag.
            </p>
          </Reveal>

          {/* ── the ledger ── */}
          <Reveal as="aside" delay={90} className="lg:col-span-5">
            {/* Sizes to its content — no h-full. Stretching it to match the
                prose column left a dead band under the last row. */}
            <Card notch="tr" className="p-6 md:p-7">
              <p className="font-mono text-label uppercase tracking-[0.18em] text-fg-subtle">
                Record · {site.founded}
              </p>

              <ol className="mt-6 space-y-5">
                {podium.map((item) => (
                  <li key={item.id}>
                    <p
                      className={
                        item.tier === 'gold'
                          ? 'font-display text-2xl font-bold leading-none text-tier-gold'
                          : 'font-display text-2xl font-bold leading-none text-tier-silver'
                      }
                    >
                      {item.rankLabel}
                    </p>
                    <p className="mt-2 text-sm leading-snug text-fg-muted">{item.event}</p>
                    <p className="tnum mt-1.5 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                      {formatShort(item.date)}
                      {item.prize ? ` · ${item.prize}` : ''}
                    </p>
                  </li>
                ))}
              </ol>

              {/* The labelled hairline IS the honesty. Everything above it was
                  won; everything below it was a final the team did not place in.
                  Said once, structurally, instead of qualified in every row. */}
              <p className="mt-7 flex items-center gap-3 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                <span aria-hidden="true" className="h-px flex-1 bg-base-700" />
                Reached the final
                <span aria-hidden="true" className="h-px flex-1 bg-base-700" />
              </p>

              <ol className="mt-5 space-y-3">
                {finals.map((item) => (
                  <li key={item.id} className="flex items-baseline gap-3">
                    {/* 10px, not 8 — below that the hexagon reads as a dot and
                        the brand motif is wasted. */}
                    <span
                      aria-hidden="true"
                      className="hex mt-1 block h-2.5 w-2.5 shrink-0 bg-tier-finalist"
                    />
                    <span className="min-w-0 flex-1 text-sm leading-snug text-fg-muted">
                      {item.event}
                    </span>
                    <span className="tnum shrink-0 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                      {formatShort(item.date)}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
