import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { site } from '@/data/site'
import { useActiveSection } from '@/lib/useActiveSection'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'

const NAV_IDS = site.nav.map((item) => item.id)

function HexMark({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="nav-mark" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset=".5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path
        d="M16 3 27 9.5v13L16 29 5 22.5v-13Z"
        fill="none"
        stroke="url(#nav-mark)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity=".5"
      />
      <path
        d="M20.6 11.6a6 6 0 1 0 0 8.8"
        fill="none"
        stroke="url(#nav-mark)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(NAV_IDS)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Lock scroll, trap focus, and close on Escape while the mobile panel is open.
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <a
        href="#hero"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-chip focus:bg-base-800 focus:px-4 focus:py-2 focus:text-sm focus:text-fg"
      >
        Skip to content
      </a>

      <header className="glass fixed inset-x-0 top-0 z-50 border-b border-base-700/50">
        <nav aria-label="Primary" className="container flex h-16 items-center justify-between">
          <a href="#hero" className="focus-ring flex items-center gap-2.5">
            <HexMark />
            <span className="font-display text-sm font-bold tracking-tight text-fg">
              {site.shortName}
            </span>
          </a>

          {/* Mono lowercase links — the terminal register, deliberately not the
              Inter-nav look every SaaS marketing site uses. */}
          <ul className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={cn(
                    'focus-ring relative block px-3 py-2 font-mono text-xs tracking-[0.08em] transition-colors',
                    active === item.id ? 'text-brand-cyan' : 'text-fg-subtle hover:text-fg',
                  )}
                >
                  {item.label}
                  {active === item.id ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-0.5 bg-brand-cyan"
                    />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              href="https://facebook.com/teamcortexcrew"
              variant="outline"
              size="sm"
              external
              className="hidden sm:inline-flex"
              icon="facebook"
              iconPosition="left"
            >
              Follow
            </Button>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="focus-ring rounded-chip p-2 text-fg md:hidden"
            >
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </nav>
      </header>

      {open ? (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="fixed inset-0 z-40 bg-base-950 pt-16 md:hidden"
        >
          <ul className="container flex flex-col gap-1 py-6">
            {site.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="focus-ring block border-b border-base-800 py-4 font-mono text-lg tracking-[0.06em] text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <Button
                href="https://facebook.com/teamcortexcrew"
                external
                icon="facebook"
                iconPosition="left"
                className="w-full"
              >
                Follow on Facebook
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  )
}
