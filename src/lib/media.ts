import type { Media } from '@/payload-types'

import { getServerUrl } from './utils'

/** URL utilizzabile da next/image: rende relativi gli URL del nostro server. */
export function mediaSrc(media?: Media | null, size?: 'thumbnail' | 'og'): string | null {
  if (!media) return null
  const url = (size && media.sizes?.[size]?.url) || media.url
  if (!url) return null
  const server = getServerUrl()
  if (url.startsWith(server)) return url.slice(server.length) || '/'
  return url.replace(/^https?:\/\/localhost:\d+/, '')
}

export function asMedia(value: unknown): Media | null {
  return value && typeof value === 'object' && 'url' in value ? (value as Media) : null
}
