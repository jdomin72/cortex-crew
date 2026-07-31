import { members, site } from '@/data/site'
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
 * ── Why the panel beside it is NOT the record ──
 * This slot used to hold a ledger of all five results, tiered. That ledger was
 * the right idea in the wrong place: the Achievements section below now renders
 * the same five results as a full results sheet, with the same labelled
 * `REACHED THE FINAL` hairline, at ten times the size. Two renderings of one
 * record, four hundred pixels apart, made the page repeat itself and left this
 * column short against a much taller prose block.
 *
 * So the panel carries what the sheet does not: who the team *is*, as a spec
 * sheet — founded, based, university, what it competes in, how many people.
 * Every row derives from `site`/`members`, so it cannot drift.
 */
export function About() {
  const crew = members.filter((member) => member.kind === 'member')

  const facts: { label: string; value: string }[] = [
    { label: 'Founded', value: site.founded },
    { label: 'Based', value: `${site.city}, ${site.country}` },
    { label: 'University', value: site.university },
    { label: 'Competes in', value: site.pillars.map((pillar) => pillar.label).join(' · ') },
    { label: 'Crew', value: `${crew.length} members` },
  ]

  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="container">
        {/* 7/5 split, echoing the hero's asymmetry so the ratio reads as the
            page's structure rather than a one-off. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 id="about-title" className="semiwide font-display text-section font-bold text-fg">
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
              The team is led by Kawsher HRidoy, with Shafiur Rahman Shafim on infrastructure and
              telemetry, Arnob Kumar Paul on interface and presentation, Abdullah Al Khalil and
              Arvin Ahmed Alok on development, and AL Fahad on UI and UX design. Cortex Crew builds
              working systems and demonstrates them live rather than presenting concepts, and is now
              moving into competitive Capture the Flag.
            </p>
          </Reveal>

          {/* ── the spec sheet ──
              Sticky on desktop. The panel is five rows against three long
              paragraphs, so pinned to the top of the viewport it stays beside
              the prose it annotates instead of leaving a 500px dead band under
              itself. `position: sticky` sits on the inner element, not on the
              <Reveal>: the reveal animation drives `transform`, and a
              transformed ancestor would become the containing block and break
              the stick. */}
          <Reveal as="aside" delay={90} className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h3 className="flex items-center gap-3 font-display semiwide text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                At a glance
              </h3>

              <dl className="mt-6 border-t border-line-strong">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[8rem_1fr]"
                  >
                    <dt className="font-display semiwide text-label font-semibold uppercase tracking-[0.16em] text-fg-subtle">
                      {fact.label}
                    </dt>
                    <dd className="text-sm leading-snug text-fg">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
