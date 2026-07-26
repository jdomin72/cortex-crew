import { cn } from '@/lib/cn'
import type { BrandAccent, ResponsiveImage } from '@/data/types'
import { Img } from './Img'

const GRADIENT: Record<BrandAccent, string> = {
  cyan: 'linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)',
  blue: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
  violet: 'linear-gradient(135deg, #a855f7 0%, #2563eb 100%)',
}

const RING: Record<BrandAccent, string> = {
  cyan: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
  blue: 'linear-gradient(135deg, #3b82f6, #a855f7)',
  violet: 'linear-gradient(135deg, #a855f7, #22d3ee)',
}

export interface AvatarProps {
  name: string
  initials: string
  photo?: ResponsiveImage
  accent?: BrandAccent
  size?: number
  className?: string
}

/**
 * Hexagonal avatar. Renders a photo when there is one and a gradient monogram
 * when there isn't.
 *
 * The frame — hex clip, gradient ring, size, spacing — is IDENTICAL in both
 * branches; only the interior swaps. That is what makes a row of one photo and
 * two monograms read as a designed system rather than two missing images. The
 * monogram is a variant, not a placeholder.
 *
 * The root carries role="img" + aria-label={name}, so a screen reader announces
 * the person, not "no photo available".
 */
export function Avatar({ name, initials, photo, accent = 'cyan', size = 112, className }: AvatarProps) {
  const inner = size - 6

  return (
    <div
      role="img"
      aria-label={name}
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
    >
      {/* gradient ring */}
      <div className="hex absolute inset-0" style={{ backgroundImage: RING[accent] }} />

      {/* interior — identical footprint either way */}
      <div
        className="hex absolute overflow-hidden bg-base-900"
        style={{ inset: 3, width: inner, height: inner }}
      >
        {photo ? (
          <Img image={{ ...photo, alt: '' }} className="h-full w-full" />
        ) : (
          <div
            className="relative flex h-full w-full items-center justify-center"
            style={{ backgroundImage: GRADIENT[accent] }}
          >
            {/* circuit-trace texture, matching the logo art */}
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.14]"
              viewBox="0 0 100 100"
              aria-hidden="true"
              focusable="false"
            >
              <g stroke="#fff" strokeWidth="1.4" fill="none">
                <path d="M0 26h22l8 8h20M100 26H78l-8 8H50M0 74h22l8-8h20M100 74H78l-8-8H50" />
              </g>
              <g fill="#fff">
                <circle cx="22" cy="26" r="2.4" />
                <circle cx="78" cy="26" r="2.4" />
                <circle cx="22" cy="74" r="2.4" />
                <circle cx="78" cy="74" r="2.4" />
              </g>
            </svg>
            <span
              aria-hidden="true"
              className="relative font-display font-bold text-white"
              style={{ fontSize: size * 0.34, letterSpacing: '0.08em' }}
            >
              {initials}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
