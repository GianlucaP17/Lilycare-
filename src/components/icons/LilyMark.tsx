import React from 'react'

import { cn } from '@/lib/utils'

type Props = {
  size?: number
  /** Monocromatico bianco (per sfondi scuri). */
  mono?: boolean
  className?: string
  title?: string
}

/** Fiore di loto del logo ufficiale LilyCare (public/brand/lilycare-fiore.svg). */
export function LilyMark({ size = 40, mono = false, className, title }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/lilycare-fiore.svg"
      width={size}
      height={Math.round((size * 271) / 342)}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      className={cn('select-none', mono && 'brightness-0 invert', className)}
      draggable={false}
    />
  )
}
