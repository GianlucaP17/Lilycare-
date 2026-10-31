import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/utils'

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
  // In sviluppo il sito non va indicizzato; in produzione sì.
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    rules: isProduction
      ? [
          { userAgent: '*', allow, disallow },
          { userAgent: aiAndSearchBots, allow, disallow },
        ]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
