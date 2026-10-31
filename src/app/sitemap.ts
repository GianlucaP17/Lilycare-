import type { MetadataRoute } from 'next'

import { getArticleCategories, getPublishedSlugs } from '@/lib/data'
import { paths } from '@/lib/paths'
import { absoluteUrl } from '@/lib/utils'

export const revalidate = 3600

/** Mappa del sito per Google e Bing: generata automaticamente dai contenuti pubblicati. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: absoluteUrl(paths.services),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    { url: absoluteUrl(paths.team), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: absoluteUrl(paths.booking),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: absoluteUrl(paths.contacts),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    { url: absoluteUrl(paths.news), lastModified: now, changeFrequency: 'daily', priority: 0.7 },
  ]

  try {
    const [services, team, articles, pages, categories] = await Promise.all([
      getPublishedSlugs('services'),
      getPublishedSlugs('team'),
      getPublishedSlugs('articles'),
      getPublishedSlugs('pages'),
      getArticleCategories(),
    ])

    return [
      ...staticRoutes,
      ...services.map((s) => ({
        url: absoluteUrl(paths.service(s.slug)),
        lastModified: new Date(s.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      })),
      ...team.map((t) => ({
        url: absoluteUrl(paths.member(t.slug)),
        lastModified: new Date(t.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...articles.map((a) => ({
        url: absoluteUrl(paths.article(a.slug)),
        lastModified: new Date(a.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...categories.map((c) => ({
        url: absoluteUrl(paths.newsCategory(c.slug as string)),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.4,
      })),
      ...pages
        .filter((p) => p.slug !== 'home')
        .map((p) => ({
          url: absoluteUrl(paths.page(p.slug)),
          lastModified: new Date(p.updatedAt),
          changeFrequency: 'yearly' as const,
          priority: ['privacy', 'note-legali'].includes(p.slug) ? 0.2 : 0.6,
        })),
    ]
  } catch {
    return staticRoutes
  }
}
