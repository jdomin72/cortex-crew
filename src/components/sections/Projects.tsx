import { projects } from '@/data/site'
import type { BrandAccent, Project } from '@/data/types'
import { cn } from '@/lib/cn'
import { Section } from '../Section'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Img } from '../ui/Img'
import { Reveal } from '../ui/Reveal'

const FALLBACK: Record<BrandAccent, string> = {
  cyan: 'from-brand-cyan/25 to-brand-blue/10 text-brand-cyan',
  blue: 'from-brand-blue/25 to-brand-violet/10 text-brand-blue',
  violet: 'from-brand-violet/25 to-brand-cyan/10 text-brand-violet',
}

const STATUS_DOT = {
  live: 'bg-emerald-400',
  'in-progress': 'bg-brand-cyan',
  archived: 'bg-base-600',
  concept: 'bg-fg-faint',
} as const

const STATUS_LABEL = {
  live: 'Open source',
  'in-progress': 'In progress',
  archived: 'Competition build',
  concept: 'Concept',
} as const

/** Shorter than a real 16:9 cover — an empty panel at full height reads as a
    missing image, whereas a band reads as a deliberate header. */
function CoverFallback({ project }: { project: Project }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-nodes relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br',
        FALLBACK[project.accent],
      )}
    >
      {/* faint hexagon lattice, echoing the emblem */}
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 200 64"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="currentColor" strokeWidth="0.6">
          <path d="M20 4 34 12v16L20 36 6 28V12Z" />
          <path d="M60 4 74 12v16L60 36 46 28V12Z" />
          <path d="M180 28 194 36v16l-14 8-14-8V36Z" />
        </g>
      </svg>
      <span className="hex relative flex h-16 w-16 items-center justify-center bg-base-950/70">
        <span className="font-display text-2xl font-bold">{project.name.charAt(0)}</span>
      </span>
    </div>
  )
}

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="The work"
      title="What we build to compete."
      lead="Three systems the team designed, built and demoed live. Each one exists because a competition asked a hard question — and each one is the evidence behind a result above."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.id} as="div" delay={index * 80}>
            <Card
              as="article"
              accent={project.accent}
              notch="br"
              topRule
              interactive
              className="flex h-full flex-col overflow-hidden"
            >
              {project.cover ? (
                <Img
                  image={project.cover}
                  ratio="16/9"
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
                />
              ) : (
                <CoverFallback project={project} />
              )}

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold text-fg">{project.name}</h3>
                <p className="mt-1 text-sm text-fg-subtle">{project.tagline}</p>

                <p className="mt-4 text-sm leading-relaxed text-fg-muted">{project.description}</p>

                {project.metrics ? (
                  <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-y border-base-800 py-4">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
                          {metric.label}
                        </dt>
                        <dd className="tnum mt-0.5 font-display text-sm font-bold text-fg">
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
                  <div className="flex items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-fg-subtle">
                    <span
                      aria-hidden="true"
                      className={cn('block h-1.5 w-1.5 rounded-full', STATUS_DOT[project.status])}
                    />
                    {STATUS_LABEL[project.status]}
                    <span aria-hidden="true">·</span>
                    {project.year}
                  </div>

                  {project.builtFor ? (
                    <p className="mt-2 text-xs text-fg-subtle">{project.builtFor}</p>
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
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
