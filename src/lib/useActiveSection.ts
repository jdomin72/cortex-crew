import { useEffect, useState } from 'react'

/**
 * Scroll-spy for the nav.
 *
 * The rootMargin brackets the viewport so the section crossing the vertical
 * midline is the one reported as active — which matches what a reader would
 * say they are "on".
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // Report the first in document order, so the result is stable when two
        // short sections straddle the midline at once.
        const next = ids.find((id) => visible.has(id)) ?? null
        setActive(next)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
