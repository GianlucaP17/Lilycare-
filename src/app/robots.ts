import type { MetadataRoute } from 'next'

import { absoluteUrl, isNoIndex } from '@/lib/utils'

// Calcolato a ogni richiesta: dipende da variabili lette all'avvio (NOINDEX, SERVER_URL)
export const dynamic = 'force-dynamic'

/**
 * Regole per i motori di ricerca e per gli assistenti AI.
 * Scelta voluta: i crawler di ricerca AI (ChatGPT, Claude, Perplexity, Gemini…) sono ammessi,
 * così LilyCare può essere citata nelle loro risposte.
 */
const aiAndSearchBots = [
  'Googlebot',
  'Bingbot',
  'Google-Extended',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot',
  'Applebot-Extended',
  'DuckDuckBot',
]

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api/', '/next/']
  const allow = ['/', '/api/media/']
  // In sviluppo e nelle demo (NOINDEX=true) il sito non va indicizzato; in produzione sì.
  return {
    rules: isNoIndex()
      ? [{ userAgent: '*', disallow: '/' }]
      : [
          { userAgent: '*', allow, disallow },
          { userAgent: aiAndSearchBots, allow, disallow },
        ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
