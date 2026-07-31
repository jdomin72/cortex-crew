import type { MouseEventHandler, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

/**
 * The primary button used to be the brand gradient with a cyan glow shadow.
 * Two problems: it was the third place on one screen where that gradient
 * appeared, and a glowing gradient CTA is the most templated control on the
 * dark web. Solid near-white on near-black is the highest contrast available
 * here (15.9:1 inverted), reads as deliberate rather than decorative, and
 * leaves colour to mean what it means everywhere else on this page — a result.
 */
const VARIANTS: Record<Variant, string> = {
  solid: 'bg-fg text-base-950 hover:bg-white',
  outline: 'border border-line-strong text-fg hover:border-fg-subtle hover:bg-base-850',
  ghost: 'text-fg-muted hover:text-fg hover:bg-base-800',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export interface ButtonProps {
  /** Present → renders an <a>. Absent → renders a <button type="button">. */
  href?: string
  variant?: Variant
  size?: Size
  icon?: IconName
  iconPosition?: 'left' | 'right'
  external?: boolean
  children: ReactNode
  onClick?: MouseEventHandler
  className?: string
  'aria-label'?: string
}

export function Button({
  href,
  variant = 'solid',
  size = 'md',
  icon,
  iconPosition = 'right',
  external = false,
  children,
  onClick,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    'focus-ring inline-flex items-center justify-center rounded-chip font-medium',
    'transition-colors duration-200',
    SIZES[size],
    VARIANTS[variant],
    className,
  )

  const glyph = icon ? <Icon name={icon} size={size === 'lg' ? 18 : 15} /> : null

  const content = (
    <>
      {iconPosition === 'left' ? glyph : null}
      {children}
      {iconPosition === 'right' ? glyph : null}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes} {...rest}>
      {content}
    </button>
  )
}
