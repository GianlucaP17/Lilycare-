import Image from 'next/image'
import React from 'react'

import { asMedia, mediaSrc } from '@/lib/media'
import { cn } from '@/lib/utils'

type Props = {
  media: unknown
  className?: string
  /** Riempie il contenitore (che deve avere position: relative e dimensioni). */
  fill?: boolean
  sizes?: string
  priority?: boolean
  alt?: string
}

/** Immagine caricata dal pannello admin, ottimizzata (AVIF/WebP, dimensioni responsive). */
export function MediaImage({
  media,
  className,
  fill = true,
  sizes = '100vw',
  priority,
  alt,
}: Props) {
  const m = asMedia(media)
  const src = mediaSrc(m)
  if (!m || !src) return null

  const altText = alt ?? m.alt ?? ''
  const position =
    typeof m.focalX === 'number' && typeof m.focalY === 'number'
      ? `${m.focalX}% ${m.focalY}%`
      : 'center'

  if (m.mimeType === 'image/svg+xml') {
    // Gli SVG (es. logo) non richiedono ottimizzazione
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={altText} className={className} loading={priority ? 'eager' : 'lazy'} />
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={altText}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', className)}
        style={{ objectPosition: position }}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={altText}
      width={m.width ?? 1200}
      height={m.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
