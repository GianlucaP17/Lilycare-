import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

import { asMedia, mediaSrc } from './media'
import { absoluteUrl, isNoIndex, truncate } from './utils'

type MetaInput = {
  /** Titolo della pagina (verrà aggiunto " | LilyCare"). */
  title: string
  description?: string | null
  path: string
  /** Campi SEO compilati nel pannello admin (hanno la precedenza). */
  meta?: { title?: string | null; description?: string | null; image?: unknown } | null
  image?: unknown
  /** Sottotitolo per l'immagine di condivisione generata automaticamente. */
  ogSubtitle?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  noindex?: boolean
}

/** URL dell'immagine di condivisione generata automaticamente (vedi /og). */
export function generatedOgImage(title: string, subtitle?: string) {
  const params = new URLSearchParams({ title })
  if (subtitle) params.set('subtitle', subtitle)
  return `/og?${params.toString()}`
}

/** Metadati completi per Google e social (titolo, descrizione, canonical, Open Graph). */
export function buildMetadata(input: MetaInput): Metadata {
  const description = truncate(input.meta?.description || input.description || '', 160)
  const customTitle = input.meta?.title?.trim()
  const url = absoluteUrl(input.path)

  const media = asMedia(input.meta?.image) || asMedia(input.image)
  const ogUrl = media
    ? absoluteUrl(mediaSrc(media as Media, 'og') || mediaSrc(media as Media) || '')
    : absoluteUrl(generatedOgImage(customTitle || input.title, input.ogSubtitle))

  const ogTitle = customTitle || `${input.title} | LilyCare`

  return {
    title: customTitle ? { absolute: customTitle } : input.title,
    description,
    alternates: { canonical: url },
    robots: isNoIndex()
      ? { index: false, follow: false }
      : input.noindex
        ? { index: false, follow: true }
        : undefined,
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: 'LilyCare',
      locale: 'it_CH',
      type: input.type ?? 'website',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: input.title }],
      ...(input.type === 'article'
        ? {
            publishedTime: input.publishedTime ?? undefined,
            modifiedTime: input.modifiedTime ?? undefined,
            authors: input.authors,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [ogUrl],
    },
  }
}
