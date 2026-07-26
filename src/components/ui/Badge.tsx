import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { BrandAccent, MedalTier } from '@/data/types'
import { Icon, type IconName } from './Icon'

type Variant = 'neutral' | 'outline' | BrandAccent | MedalTier

const VARIANTS: Record<Variant, string> = {
  neutral: 'bg-base-800 text-fg-muted border-base-700',
  outline: 'bg-transparent text-fg-subtle border-base-600',
  cyan: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30',
  blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/30',
  violet: 'bg-brand-violet/10 text-brand-violet border-brand-violet/30',
  gold: 'bg-tier-gold/10 text-tier-gold border-tier-gold/30',
  silver: 'bg-tier-silver/10 text-tier-silver border-tier-silver/30',
  bronze: 'bg-tier-bronze/10 text-tier-bronze border-tier-bronze/30',
  finalist: 'bg-tier-finalist/10 text-tier-finalist border-tier-finalist/30',
  participant: 'bg-base-800 text-fg-subtle border-base-700',
}

export interface BadgeProps {
  variant?: Variant
  size?: 'sm' | 'md'
  mono?: boolean
  icon?: IconName
  children: ReactNode
  className?: string
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  mono = false,
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-chip border whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        mono && 'font-mono uppercase tracking-[0.12em] text-label',
        VARIANTS[variant],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={size === 'sm' ? 12 : 14} /> : null}
      {children}
    </span>
  )
}
