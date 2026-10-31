import type { MetadataRoute } from 'next'

import { getServices, getSettings } from '@/lib/data'
import { placeLabel } from '@/lib/settings-helpers'

export const dynamic = 'force-dynamic'

/** Manifest web app: permette di "installare" il sito sullo smartphone (base per la futura app). */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [settings, services] = await Promise.all([
    getSettings().catch(() => null),
    getServices().catch(() => []),
  ])
  const name = settings?.clinicName || 'LilyCare'
  const place = settings ? placeLabel(settings) : ''
  return {
    name: place ? `${name} – Centro medico ${settings?.address?.city}` : name,
    short_name: name,
    description:
      settings?.description ||
      `${services.map((s) => s.title).join(', ')}${place ? ` a ${place}` : ''}.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#faf7f2',
    theme_color: '#163e42',
    lang: 'it-CH',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
