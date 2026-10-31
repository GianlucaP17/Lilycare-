import Link from 'next/link'
import React from 'react'

import { MediaImage } from '@/components/ui/MediaImage'
import { asMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

/** Proporzioni del logo orizzontale ufficiale (viewBox 1288 × 302). */
const RATIO = 1288 / 302

/**
 * Logo del sito: versione orizzontale del logo ufficiale (public/brand).
 * Se nel pannello admin (Impostazioni studio → Logo) viene caricato un altro file, si usa quello.
 */
export function Logo({
  logo,
  name = 'LilyCare',
  invert = false,
  height = 46,
  className,
}: {
  logo?: unknown
  name?: string
  /** @deprecated il sottotitolo fa parte del logo ufficiale ("Medical Center") */
  tagline?: string | null
  invert?: boolean
  height?: number
  className?: string
}) {
  const media = asMedia(logo)
  return (
    <Link
      href="/"
      className={cn('group inline-flex shrink-0 items-center', className)}
      aria-label={`${name} Medical Center – torna alla homepage`}
    >
      {media ? (
        <span className="relative block" style={{ height, width: Math.round(height * RATIO) }}>
          <MediaImage media={media} sizes="220px" className="object-contain object-left" priority />
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={
            invert
              ? '/brand/lilycare-logo-orizzontale-chiaro.svg'
              : '/brand/lilycare-logo-orizzontale.svg'
          }
          alt={`${name} Medical Center`}
          width={Math.round(height * RATIO)}
          height={height}
          className="block h-auto max-w-full"
          style={{ height, width: 'auto' }}
          fetchPriority="high"
        />
      )}
    </Link>
  )
}
