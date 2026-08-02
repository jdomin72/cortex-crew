import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

/** Slack for sub-pixel item widths, so a card that fits by a hair still counts. */
const FIT_EPSILON = 2

/**
 * The scroll positions of each page, read from the items themselves.
 *
 * ── Why this is not arithmetic on clientWidth ──
 * It used to be `ceil(scrollWidth / clientWidth)` pages at `index * clientWidth`
 * each, which assumes a page is exactly one track-width of scroll. The LAST page
 * is almost never a full width, and that broke the controls outright: Projects at
 * 1440px has `clientWidth 1152` but can only scroll to **391**, so page 2's target
 * clamped to 391 and `round(391 / 1152)` reported page **0**. The dot stayed on 1,
 * `Previous` stayed disabled, and a reader who pressed Next could not get back.
 * The same rounding dropped the crew's last dot at every width below 1024, and
 * invented a phantom page at 820 and 640.
 *
 * Every item is `snap-start`, so the item boundaries ARE the only positions the
 * track can come to rest at. Reading them means the dots cannot disagree with
 * where the browser actually stopped — the failure mode above becomes unreachable
 * rather than patched. (The old 32px `PAGE_EPSILON` was a patch on that
 * arithmetic; with real offsets there is no trailing gap left to absorb.)
 *
 * A page starts at an item boundary and greedily takes every item that fits
 * entirely inside `clientWidth`; the final offset is clamped to `maxScroll`.
 *
 * `offsetLeft` is taken relative to the FIRST child, not raw: the track is not
 * `position: relative`, so `offsetParent` is some ancestor above it and the raw
 * values carry an unrelated origin.
 */
function pageOffsets(el: HTMLElement): number[] {
  const items = Array.from(el.children) as HTMLElement[]
  if (items.length === 0 || el.clientWidth === 0) return [0]

  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
  if (maxScroll === 0) return [0]

  const base = items[0].offsetLeft
  const starts = items.map((item) => item.offsetLeft - base)
  const offsets: number[] = []

  let index = 0
  while (index < items.length) {
    const start = Math.min(starts[index], maxScroll)
    if (offsets.length === 0 || start > offsets[offsets.length - 1] + FIT_EPSILON) {
      offsets.push(start)
    }
    if (start >= maxScroll) break

    // Advance past every item whose right edge is still inside this page.
    let last = index
    while (last + 1 < items.length) {
      const next = items[last + 1]
      const right = next.offsetLeft - base + next.offsetWidth
      if (right > start + el.clientWidth + FIT_EPSILON) break
      last++
    }
    index = Math.max(last + 1, index + 1)
  }

  return offsets.length > 0 ? offsets : [0]
}

/** Active page = the offset the track is closest to. Replaces a division. */
function nearestPage(offsets: number[], scrollLeft: number): number {
  let best = 0
  for (let i = 1; i < offsets.length; i++) {
    if (Math.abs(offsets[i] - scrollLeft) < Math.abs(offsets[best] - scrollLeft)) best = i
  }
  return best
}

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
 * ── Auto-rotation, and the five ways it stops ──
 * `autoRotate` advances a page on a timer so every card is seen without input.
 * Content that moves on its own is a genuine accessibility hazard, so it:
 *
 * 1. **never starts** under `prefers-reduced-motion: reduce`;
 * 2. **only runs while the track is on screen** — the timer used to start at page
 *    load, so by the time a reader scrolled down to the crew it had already
 *    advanced and the first three members were never reliably what they saw
 *    first. Leaving the viewport also resets it to page one, which happens while
 *    nobody is looking, so arriving is always a clean start;
 * 3. **pauses** while the pointer is over it or focus is inside it — otherwise it
 *    would yank a card away mid-read, or mid-tab through someone's links;
 * 4. **pauses** while the tab is hidden, so a backgrounded page is not animating
 *    on a phone battery;
 * 5. **stops for good** the moment the reader takes control — a swipe, a wheel,
 *    a key, or any button here. Once you have steered, it does not fight you,
 *    and the off-screen reset defers to it too.
 *
 * It also renders an explicit pause/play toggle, which is what WCAG 2.2.2
 * actually requires for anything that auto-starts and runs longer than five
 * seconds; hover-pause alone does not satisfy it for keyboard or touch users.
 */
export function Carousel({ label, autoRotate, children, className }: CarouselProps) {
  const track = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(0)
  /** Scroll position of each page. Length is the page count. */
  const [offsets, setOffsets] = useState<number[]>([0])

  /** Auto-rotation is possible at all: mounted, requested, motion allowed. */
  const [canRotate, setCanRotate] = useState(false)
  /** Transient — pointer is over it, focus is inside it, or the tab is hidden. */
  const [suspended, setSuspended] = useState(false)
  /** Transient — the track is scrolled into view. */
  const [onScreen, setOnScreen] = useState(false)
  /** Sticky — the reader took control, or pressed pause. */
  const [stopped, setStopped] = useState(false)
  /** Same value, readable from inside an observer callback without re-subscribing. */
  const stoppedRef = useRef(false)
  stoppedRef.current = stopped

  const pages = offsets.length

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!autoRotate) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setCanRotate(true)
  }, [autoRotate])

  /**
   * Recompute the page offsets. Layout-reading, so it runs on mount and on
   * resize only — never per scroll frame.
   */
  const measure = useCallback(() => {
    const el = track.current
    if (!el || el.clientWidth === 0) return
    const next = pageOffsets(el)
    setOffsets((current) =>
      current.length === next.length && current.every((value, i) => value === next[i])
        ? current
        : next,
    )
    setPage(nearestPage(next, el.scrollLeft))
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    // Cards are content-sized, so a card growing (a wrapped chip row, a late
    // webfont) moves every boundary after it without the track itself resizing.
    Array.from(el.children).forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [measure])

  // Scrolling only re-derives the active index from the cached offsets. No
  // layout is read here, which is what keeps a scroll frame cheap.
  useEffect(() => {
    const el = track.current
    if (!el) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setPage(nearestPage(offsets, el.scrollLeft)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [offsets])

  useEffect(() => {
    const el = track.current
    if (!el) return

    // A real gesture — not our own scrollTo, which fires 'scroll' but none of
    // these. This is why takeover is detected from input events, not scrolling.
    const takeOver = () => setStopped(true)
    const gestures = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const
    gestures.forEach((type) => el.addEventListener(type, takeOver, { passive: true }))

    return () => gestures.forEach((type) => el.removeEventListener(type, takeOver))
  }, [])

  useEffect(() => {
    const onVisibility = () => setSuspended(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const scrollToPage = useCallback(
    (index: number, smooth = true) => {
      const el = track.current
      if (!el) return
      const target = offsets[Math.max(0, Math.min(index, offsets.length - 1))] ?? 0
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollTo({ left: target, behavior: smooth && !reduced ? 'smooth' : 'auto' })
    },
    [offsets],
  )

  /**
   * Rotation only runs while the track is on screen, and leaving the viewport
   * rewinds it to page one.
   *
   * Resetting on EXIT rather than on entry is deliberate: the jump happens while
   * the section is out of frame, so a reader arriving always finds page one
   * already in place and never sees it snap back under them.
   *
   * `stopped` is honoured — someone who navigated by hand keeps their position.
   * The threshold is a bare 0 so "on screen" means the same thing a reader would
   * mean; there is no need for the track to be substantially visible to justify
   * running a timer.
   */
  useEffect(() => {
    const el = track.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting)
        if (!entry.isIntersecting && !stoppedRef.current) {
          el.scrollTo({ left: 0, behavior: 'auto' })
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const rotating = canRotate && !stopped && !suspended && onScreen && pages > 1

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
      const current = nearestPage(offsets, el.scrollLeft)
      scrollToPage(current >= offsets.length - 1 ? 0 : current + 1)
    }, autoRotate)

    return () => clearInterval(timer)
  }, [rotating, autoRotate, offsets, scrollToPage])

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
