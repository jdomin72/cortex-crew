/**
 * Shared IntersectionObserver pool.
 *
 * ~30 <Reveal> elements on the page cost one or two observers instead of thirty,
 * because observers are keyed by their options. Each element fires once and is
 * then unobserved.
 *
 * If IntersectionObserver is unavailable, `onEnter` runs immediately — content
 * is never left trapped in the hidden state.
 */

type Callback = () => void

const pools = new Map<string, { observer: IntersectionObserver; callbacks: WeakMap<Element, Callback> }>()

export interface ObserveOptions {
  threshold?: number
  rootMargin?: string
}

export function observeOnce(el: Element, onEnter: Callback, opts: ObserveOptions = {}): () => void {
  const threshold = opts.threshold ?? 0.15
  const rootMargin = opts.rootMargin ?? '0px 0px -8% 0px'

  if (typeof IntersectionObserver === 'undefined') {
    onEnter()
    return () => {}
  }

  const key = `${threshold}|${rootMargin}`
  let pool = pools.get(key)

  if (!pool) {
    const callbacks = new WeakMap<Element, Callback>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Reveal when the element enters — OR when it is already above the
          // viewport. A fast scroll (scrollbar drag, End key, hash jump) can
          // move past an element without any frame observing it intersecting;
          // without the second check it would stay invisible until the user
          // scrolled back down past it again.
          const entered = entry.isIntersecting || entry.boundingClientRect.bottom < 0
          if (!entered) continue

          const cb = callbacks.get(entry.target)
          observer.unobserve(entry.target)
          callbacks.delete(entry.target)
          cb?.()
        }
      },
      { threshold, rootMargin },
    )
    pool = { observer, callbacks }
    pools.set(key, pool)
  }

  pool.callbacks.set(el, onEnter)
  pool.observer.observe(el)

  return () => {
    pool.callbacks.delete(el)
    pool.observer.unobserve(el)
  }
}

/** True when the user has asked for reduced motion. SSR-safe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
