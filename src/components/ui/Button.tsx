import type { MouseEventHandler, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

type Variant = 'gradient' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  gradient:
    'text-white bg-[linear-gradient(100deg,#22d3ee_0%,#2563eb_50%,#7c3aed_100%)] ' +
    'hover:brightness-110 shadow-[0_10px_30px_-14px_rgb(34_211_238/0.7)]',
  outline: 'border border-base-600 text-fg hover:border-brand-cyan/60 hover:text-brand-cyan',
  ghost: 'text-fg-muted hover:text-brand-cyan hover:bg-base-800',
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
  variant = 'gradient',
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
