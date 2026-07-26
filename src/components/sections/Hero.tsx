import { site } from '@/data/site'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'

/**
 * The hero is deliberately NOT wrapped in <Reveal> — a hidden LCP element
 * defers LCP paint. Every background layer here is static CSS: no animation
 * runs on this page at rest.
 */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden pt-16">
      {/* layer 1 — PCB trace grid */}
      <div aria-hidden="true" className="bg-grid mask-radial-fade absolute inset-0" />
      {/* layer 2 — junction dots */}
      <div aria-hidden="true" className="bg-nodes mask-radial-fade absolute inset-0 opacity-40" />
      {/* layer 3 — corner glows */}
      <div
        aria-hidden="true"
        className="absolute -left-40 -top-32 h-[32rem] w-[32rem] rounded-full bg-brand-cyan/20 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-brand-violet/20 blur-[140px]"
      />

      <div className="container relative flex min-h-[92svh] items-center py-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ── copy ── */}
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-chip border border-base-700 bg-base-900/70 px-3 py-1.5 font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
              <span
                aria-hidden="true"
                className="hex block h-2.5 w-2.5 bg-[linear-gradient(135deg,#22d3ee,#a855f7)]"
              />
              {site.university} · {site.city}
            </p>

            <h1 id="hero-title" className="mt-6 font-display text-hero font-bold">
              <span className="block text-fg">CORTEX</span>
              <span className="text-gradient block">CREW</span>
            </h1>

            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label uppercase tracking-[0.18em] text-fg-muted">
              {site.taglineWords.map((word, index) => (
                <span key={word} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-brand-cyan">
                      •
                    </span>
                  ) : null}
                  {word}
                </span>
              ))}
            </p>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              Six competitions entered in 2026. We placed in every one — one championship, one
              runners-up, four finals. {site.secondaryTagline}.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="#achievements" size="lg" icon="arrow-right">
                See our record
              </Button>
              <Button
                href="https://facebook.com/teamcortexcrew"
                variant="outline"
                size="lg"
                icon="facebook"
                iconPosition="left"
                external
              >
                Follow the team
              </Button>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
              {site.heroStats.map((stat) => (
                <div key={stat.label} className="border-l border-base-700 pl-4">
                  <dt className="font-mono text-label uppercase tracking-[0.16em] text-fg-subtle">
                    {stat.label}
                  </dt>
                  <dd className="tnum mt-1 font-display text-3xl font-bold text-fg">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── emblem — the LCP element ── */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-square w-60 lg:w-[380px]">
              <div
                aria-hidden="true"
                className="hex absolute inset-0 scale-110 bg-[linear-gradient(135deg,#22d3ee,#a855f7)] opacity-[0.18] blur-2xl"
              />
              <Img
                image={site.logo}
                priority
                ratio="1/1"
                className="relative"
                imgClassName="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
