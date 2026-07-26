import { site } from '@/data/site'
import { Reveal } from '../ui/Reveal'

/**
 * A short block of continuous prose stating who the team is and what it has
 * done.
 *
 * This exists for extraction as much as for readers. The rest of the page is
 * deliberately fragmented — headings, badges, mono labels, stat tiles — which
 * reads well but gives boilerplate extractors almost nothing to hold onto.
 * Measured before this section existed: trafilatura recovered 47 of 1,247
 * words, because the densest prose block on the page was a single card summary.
 *
 * Search engines and LLMs run the same class of extractor to decide what a page
 * is *about*. One dense, self-contained paragraph that names the team, the
 * university, the city, the record and the discipline is the highest-leverage
 * text on the site.
 *
 * Keep it factual and self-contained: it should make sense quoted on its own,
 * with no surrounding context.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-16 md:py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-3xl">
          <h2
            id="about-title"
            className="font-mono text-label uppercase tracking-[0.18em] text-brand-cyan"
          >
            About the team
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            <strong className="font-semibold text-fg">Cortex Crew</strong> is a student competition
            team at <strong className="font-semibold text-fg">{site.university}</strong> in{' '}
            {site.city}, {site.country}, founded in {site.founded}. The team competes in project
            showcases, hackathons, and Capture the Flag events, and is made up of Software
            Engineering students working across machine learning, cyber security, cloud
            infrastructure, and full-stack development.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            In 2026 Cortex Crew entered six competitions and placed in all six. The team won{' '}
            <strong className="font-semibold text-fg">Champion</strong> at the CSAD 2026 Project
            Showcasing Competition held by the Cyber Security Centre at Daffodil International
            University, and finished{' '}
            <strong className="font-semibold text-fg">1st Runners-up</strong> at the IEEE ICADHI
            2026 Project Showcase run by the IEEE DIU Student Branch. It reached the finals of four
            more events: the AI Innovation Hackathon 2026, the AI Project Competition 2026, the 5th
            Data Science Summit, and The Infinity AI Buildfest 2026.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            The team is led by Md Kawsher Ahmed, with Shafiur Rahman Shafim on infrastructure and
            telemetry and Arnob Kumar Paul on interface and presentation, mentored by Md. Abdul Hye
            Zebon of the Department of Software Engineering. Cortex Crew builds working systems and
            demonstrates them live rather than presenting concepts, and is now moving into
            competitive Capture the Flag.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
