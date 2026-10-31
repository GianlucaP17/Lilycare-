import Link from 'next/link'
import React from 'react'

import { LilyMark } from '@/components/icons/LilyMark'
import { MediaImage } from '@/components/ui/MediaImage'
import { asMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

/**
 * Logo del sito. Se nel pannello admin (Impostazioni studio → Logo) è stato caricato
 * il logo ufficiale, viene usato quello; altrimenti il marchio grafico predefinito.
 */
export function Logo({
  logo,
  name = 'LilyCare',
  tagline,
  invert = false,
  className,
}: {
  logo?: unknown
  name?: string
  tagline?: string | null
  invert?: boolean
  className?: string
}) {
  const media = asMedia(logo)
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-3', className)}
      aria-label={`${name} – torna alla homepage`}
    >
      {media ? (
        <span className="relative block h-11 w-40">
          <MediaImage media={media} sizes="160px" className="object-contain object-left" priority />
        </span>
      ) : (
        <>
          <LilyMark size={38} mono={invert} className={invert ? 'text-white' : undefined} />
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                'font-serif text-[1.6rem] font-normal tracking-tight',
                invert ? 'text-white' : 'text-petrol-950',
              )}
            >
              {name}
            </span>
            {tagline ? (
              <span
                className={cn(
                  'mt-1 text-[0.68rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase',
                  invert ? 'text-petrol-200' : 'text-muted',
                )}
              >
                {tagline}
              </span>
            ) : null}
          </span>
        </>
      )}
    </Link>
  )
}
