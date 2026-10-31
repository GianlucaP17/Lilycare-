import type { MetadataRoute } from 'next'

/** Manifest web app: permette di "installare" il sito sullo smartphone (base per la futura app). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LilyCare – Centro medico Coldrerio',
    short_name: 'LilyCare',
    description:
      'Radiologia, ecografie, terapia del dolore, cure infermieristiche e agopuntura a Coldrerio (Ticino).',
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
