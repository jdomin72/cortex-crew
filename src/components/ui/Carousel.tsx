import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

/** Matches the track's `gap-5` (20px), with a little slack for sub-pixel widths. */
const PAGE_EPSILON = 32

export interface CarouselProps {
  /** Announced to screen readers as the name of the scrollable region. */
  label: string
  /** ms between automatic advances. Omit for a manual-only carousel. */
  autoRotate?: number
  children: ReactNode
  className?: string
}

/**
 * A slideshow that never hides anything.
 *
 * ── Why it is a scroll container and not a slide swapper ──
 * A conventional carousel renders one slide and hides the rest, which would
 * break three things this site depends on: the prerendered HTML would contain
 * hidden content (that reads as cloaking), a reader would have to press a
 * control to discover most of the work, and the whole thing would stop existing
 * if the bundle failed. Here every card is always in the DOM, always visible to
 * a screen reader, and always reachable by swipe, trackpad, or arrow key —
 * because the "slideshow" is native `overflow-x` plus CSS scroll snapping.
 *
 * The buttons and dots are a convenience layer on top. They are rendered only
 * after mount, so the static HTML never ships a control that cannot work, and
 * if JavaScript never runs the track still scrolls perfectly well on its own.
 *
 * `tabIndex={0}` on the track is deliberate: a scrollable region that is not
 * focusable cannot be scrolled by keyboard, which is a WCAG 2.1.1 failure.
 *
 * ── Auto-rotation, and the four ways it stops ──
 * `autoRotate` advances a page on a timer so every card is seen without input.
 * Content that moves on its own is a genuine accessibility hazard, so it:
 *
 * 1. **never starts** under `prefers-reduced-motion: reduce`;
 * 2. **pauses** while the pointer is over it or focus is inside it — otherwise it
 *    would yank a card away mid-read, or mid-tab through someone's links;
 * 3. **pauses** while the tab is hidden, so a backgrounded page is not animating
 *    on a phone battery;
 * 4. **stops for good** the moment the reader takes control — a swipe, a wheel,
 *    a key, or any button here. Once you have steered, it does not fight you.
 *
 * It also renders an explicit pause/play toggle, which is what WCAG 2.2.2
 * actually requires for anything that auto-starts and runs longer than five
 * seconds; hover-pause alone does not satisfy it for keyboard or touch users.
 */
export function Carousel({ label, autoRotate, children, className }: CarouselProps) {
  const track = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)

  /** Auto-rotation is possible at all: mounted, requested, motion allowed. */
  const [canRotate, setCanRotate] = useState(false)
  /** Transient — pointer is over it, focus is inside it, or the tab is hidden. */
  const [suspended, setSuspended] = useState(false)
  /** Sticky — the reader took control, or pressed pause. */
  const [stopped, setStopped] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!autoRotate) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setCanRotate(true)
  }, [autoRotate])

  const measure = useCallback(() => {
    const el = track.current
    if (!el || el.clientWidth === 0) return

    // Page count is derived from how far the track can actually SCROLL, not
    // from its total width. `ceil(scrollWidth / clientWidth)` looks right and
    // is wrong: six cards three-up measured 2324/1152 → 3, but the third page
    // sits at 2304px and the track only scrolls to 1172px, so it clamped onto
    // page two. Auto-rotation advanced once and then sat still, forever trying
    // to reach a page that does not exist.
    //
    // The epsilon absorbs the trailing gap — the last card contributes a 20px
    // gap that is not content, and without it every full track reports one
    // phantom page too many.
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
    const count = Math.max(1, Math.ceil((maxScroll - PAGE_EPSILON) / el.clientWidth) + 1)

    setPages(count)
    setPage(Math.min(count - 1, Math.round(el.scrollLeft / el.clientWidth)))
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    el.addEventListener('scroll', onScroll, { passive: true })

    // A real gesture — not our own scrollTo, which fires 'scroll' but none of
    // these. This is why takeover is detected from input events, not scrolling.
    const takeOver = () => setStopped(true)
    const gestures = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const
    gestures.forEach((type) => el.addEventListener(type, takeOver, { passive: true }))

    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', onScroll)
      gestures.forEach((type) => el.removeEventListener(type, takeOver))
      cancelAnimationFrame(frame)
    }
  }, [measure])

  useEffect(() => {
    const onVisibility = () => setSuspended(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const scrollToPage = useCallback((index: number) => {
    const el = track.current
    if (!el) return
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Clamped, so the last page lands on the true end of the track rather than
    // on a position the browser would silently pull back from.
    el.scrollTo({
      left: Math.min(index * el.clientWidth, maxScroll),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [])

  const rotating = canRotate && !stopped && !suspended && pages > 1

  useEffect(() => {
    if (!rotating || !autoRotate) return

    // The next page is computed from the track's LIVE scrollLeft, not from the
    // `page` state. `page` is updated by a rAF-throttled scroll listener, so
    // driving rotation from it means rotation stops dead any time rAF is
    // starved — which is not hypothetical: it is exactly what happens under a
    // loaded main thread, and it is reproducible in headless Chrome, where rAF
    // ticks about six times in total and rotation advanced once and then hung.
    // Reading the DOM makes the timer self-sufficient.
    const timer = setInterval(() => {
      const el = track.current
      if (!el) return
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
      const atEnd = el.scrollLeft >= maxScroll - PAGE_EPSILON
      scrollToPage(atEnd ? 0 : Math.round(el.scrollLeft / el.clientWidth) + 1)
    }, autoRotate)

    return () => clearInterval(timer)
  }, [rotating, autoRotate, scrollToPage])

  const goTo = (index: number) => {
    setStopped(true)
    scrollToPage(index)
  }

  const showControls = mounted && pages > 1
  const controlClass =
    'focus-ring flex h-10 w-10 items-center justify-center rounded-chip border border-line text-fg transition-colors hover:border-fg-subtle disabled:pointer-events-none disabled:text-fg-faint'

  return (
    <div
      className={className}
      onMouseEnter={() => setSuspended(true)}
      onMouseLeave={() => setSuspended(false)}
      onFocusCapture={() => setSuspended(true)}
      onBlurCapture={() => setSuspended(false)}
    >
      <div
        ref={track}
        role="group"
        aria-label={label}
        tabIndex={0}
        className={cn(
          'focus-ring flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2',
          // Hides the horizontal scrollbar without disabling scrolling. The
          // partially visible next card is the affordance instead.
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {children}
      </div>

      {/* flex-wrap plus a shrinkable dot list: at 320px the crew has six pages,
          and six dots beside three 40px buttons overflowed the viewport. The
          dots give way; the controls keep their size. */}
      {showControls ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <ul className="flex min-w-0 flex-wrap items-center gap-2">
            {Array.from({ length: pages }, (_, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to ${label}, page ${index + 1} of ${pages}`}
                  aria-current={index === page ? 'true' : undefined}
                  className={cn(
                    'focus-ring block h-1.5 rounded-full transition-all duration-200',
                    index === page ? 'w-8 bg-fg' : 'w-4 bg-line-strong hover:bg-fg-subtle',
                  )}
                />
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 gap-2">
            {canRotate ? (
              <button
                type="button"
                onClick={() => setStopped((value) => !value)}
                aria-label={stopped ? `Play ${label} automatically` : `Pause ${label}`}
                className={controlClass}
              >
                <Icon name={stopped ? 'play' : 'pause'} size={15} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              disabled={page === 0}
              aria-label={`Previous ${label}`}
              className={controlClass}
            >
              <Icon name="arrow-right" size={16} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => goTo(page + 1)}
              disabled={page >= pages - 1}
              aria-label={`Next ${label}`}
              className={controlClass}
            >
              <Icon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Fixed-width track item. Shows ~1 card on phones, 2 on tablets, 3 on desktop. */
export const CAROUSEL_ITEM =
  'snap-start shrink-0 w-[85%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]'
