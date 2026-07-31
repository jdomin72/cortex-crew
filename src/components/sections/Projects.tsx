import { projects } from '@/data/site'
import { cn } from '@/lib/cn'
import { Section } from '../Section'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { CAROUSEL_ITEM, Carousel } from '../ui/Carousel'

const STATUS_DOT = {
  live: 'bg-tier-finalist',
  'in-progress': 'bg-tier-finalist',
  archived: 'bg-base-600',
  concept: 'bg-fg-faint',
} as const

const STATUS_LABEL = {
  live: 'Open source',
  'in-progress': 'In progress',
  archived: 'Competition build',
  concept: 'Concept',
} as const

/**
 * ── Why there is no cover image ──
 * Every card used to open with a 128px band containing a gradient wash, a
 * `bg-nodes` dot texture, a three-hexagon SVG lattice and the project's first
 * letter — a placeholder dressed up to look like a photograph. None of the four
 * projects has a real cover, so all four rendered the same invented artwork,
 * and it was the loudest thing on the card. Typography carries these cards now:
 * the name, what it does in one line, and what it was built for.
 *
 * ── Framing rule ──
 * `builtFor` names the competition and the result, so a project card always
 * points back at the team's record rather than standing on its own.
 */
export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="The work"
      title="What we build to compete."
      lead="Four systems the team designed, built and demoed live. Each one exists because a competition asked a hard question — and each one is the evidence behind a result above."
    >
      {/* A slideshow at every width now, not just on phones — see `Carousel`
          for why it is a scroll container rather than a slide swapper. All four
          cards stay in the DOM and in the prerendered HTML; the buttons and dots
          are a convenience layer that only appears once the bundle has run. */}
      <Carousel label="our projects">
        {projects.map((project) => (
          <div key={project.id} className={CAROUSEL_ITEM}>
            <Card
              as="article"
              notch="br"
              interactive
              className="group flex h-full flex-col p-6 md:p-7"
            >
              <p className="flex items-center gap-2 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                <span
                  aria-hidden="true"
                  className={cn('block h-1.5 w-1.5 rounded-full', STATUS_DOT[project.status])}
                />
                {STATUS_LABEL[project.status]}
                <span aria-hidden="true">·</span>
                {project.year}
              </p>

              <h3 className="wide mt-4 font-display text-2xl font-extrabold uppercase leading-none text-fg">
                {project.name}
              </h3>
              {/* Draws left-to-right on hover AND on focus-within, so tabbing to
                  the card's Source button gets the same feedback as pointing at
                  it. */}
              <span aria-hidden="true" className="draw-x mt-3 block h-px w-16 bg-fg" />
              <p className="mt-3 text-sm text-fg-subtle">{project.tagline}</p>

              <p className="mt-4 text-sm leading-relaxed text-fg-muted">{project.description}</p>

              {project.metrics ? (
                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4">
                  {project.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                        {metric.label}
                      </dt>
                      <dd className="tnum semiwide mt-1 font-display text-sm font-bold text-fg">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Badge variant="outline" mono>
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                {project.builtFor ? (
                  <p className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                    <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
                    Built for · {project.builtFor}
                  </p>
                ) : null}

                {project.links?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.links.map((link) => (
                      <Button
                        key={link.href}
                        href={link.href}
                        variant="outline"
                        size="sm"
                        icon="external"
                        external
                      >
                        {link.label}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        ))}
      </Carousel>
    </Section>
  )
}
