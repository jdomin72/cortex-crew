import { cn } from '@/lib/cn'
import type { ResponsiveImage } from '@/data/types'

export interface ImgProps {
  image: ResponsiveImage
  sizes?: string
  /** Exactly one image on the page should set this (the hero logo). */
  priority?: boolean
  /** e.g. "16/10" — a second CLS guard on top of width/height. */
  ratio?: string
  className?: string
  imgClassName?: string
}

/**
 * Every image goes through here so `width`/`height` can never be forgotten —
 * they are required by ResponsiveImage, which is what keeps CLS at ~0.
 */
export function Img({ image, sizes, priority = false, ratio, className, imgClassName }: ImgProps) {
  return (
    <div className={cn('overflow-hidden', className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes ?? image.sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        aria-hidden={image.alt === '' ? true : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  )
}
