import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type {
  Article,
  ArticleCategory,
  Navigation,
  Page,
  Service,
  ServiceCategory,
  Setting,
  Team,
} from '@/payload-types'

/**
 * Accesso ai contenuti del CMS per le pagine pubbliche.
 *
 * - Le pagine vengono generate a ogni richiesta (nessun database necessario durante la build,
 *   così il sito si può compilare su GitHub e caricare su Namecheap già pronto).
 * - I risultati delle query restano in cache per 5 minuti (tag "cms") e vengono invalidati
 *   subito quando lo staff salva qualcosa nel pannello admin (vedi src/hooks/revalidate.ts).
 * - In modalità anteprima la cache viene saltata e si vedono anche le bozze.
 */

export const CMS_CACHE_TAG = 'cms'
const CACHE_SECONDS = 300

export const getPayloadClient = cache(async () => getPayload({ config }))

export const isDraftMode = cache(async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
})

/** Crea una funzione di lettura con cache (per i visitatori) e senza cache (per l'anteprima). */
function cmsQuery<Args extends unknown[], Result>(
  key: string,
  fetcher: (draft: boolean, ...args: Args) => Promise<Result>,
) {
  const cached = unstable_cache((...args: Args) => fetcher(false, ...args), ['cms', key], {
    tags: [CMS_CACHE_TAG],
    revalidate: CACHE_SECONDS,
  })
  return cache(async (...args: Args): Promise<Result> => {
    if (await isDraftMode()) return fetcher(true, ...args)
    return cached(...args)
  })
}

const publishedWhere = (draft: boolean, where?: Where): Where => {
  if (draft) return where ?? {}
  return where
    ? { and: [where, { _status: { equals: 'published' } }] }
    : { _status: { equals: 'published' } }
}

/* ── Impostazioni globali ─────────────────────────── */

export const getSettings = cmsQuery('settings', async (): Promise<Setting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'settings', depth: 1 })
})

export const getNavigation = cmsQuery('navigation', async (): Promise<Navigation> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', depth: 0 })
})

/* ── Servizi ──────────────────────────────────────── */

export const getServiceCategories = cmsQuery(
  'service-categories',
  async (): Promise<ServiceCategory[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'service-categories',
      sort: 'order',
      limit: 100,
      depth: 0,
      pagination: false,
    })
    return res.docs
  },
)

export const getServices = cmsQuery('services', async (draft): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'services',
    where: publishedWhere(draft),
    draft,
    sort: 'order',
    limit: 200,
    depth: 1,
    pagination: false,
  })
  return res.docs
})

export const getService = cmsQuery(
  'service',
  async (draft, slug: string): Promise<Service | null> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'services',
      where: publishedWhere(draft, { slug: { equals: slug } }),
      draft,
      limit: 1,
      depth: 2,
    })
    return res.docs[0] ?? null
  },
)

export const getServicesByProfessional = cmsQuery(
  'services-by-professional',
  async (draft, memberId: number): Promise<Service[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'services',
      where: publishedWhere(draft, { professionals: { in: [memberId] } }),
      draft,
      sort: 'order',
      limit: 100,
      depth: 1,
      pagination: false,
    })
    return res.docs
  },
)

/* ── Team ─────────────────────────────────────────── */

export const getTeam = cmsQuery('team', async (draft): Promise<Team[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'team',
    where: publishedWhere(draft),
    draft,
    sort: 'order',
    limit: 100,
    depth: 1,
    pagination: false,
  })
  return res.docs
})

export const getMember = cmsQuery('member', async (draft, slug: string): Promise<Team | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'team',
    where: publishedWhere(draft, { slug: { equals: slug } }),
    draft,
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
})

/* ── Notizie ──────────────────────────────────────── */

const visibleArticles = (draft: boolean, extra?: Where): Where => {
  const conditions: Where[] = []
  if (extra) conditions.push(extra)
  if (!draft) {
    conditions.push({ _status: { equals: 'published' } })
    // Articoli programmati: visibili solo dalla data di pubblicazione
    conditions.push({ publishedAt: { less_than_equal: new Date().toISOString() } })
  }
  return conditions.length ? { and: conditions } : {}
}

type ArticleQuery = {
  page?: number
  limit?: number
  categoryId?: number
  serviceId?: number
  excludeId?: number
}

export const getArticles = cmsQuery('articles', async (draft, query: ArticleQuery = {}) => {
  const { page = 1, limit = 9, categoryId, serviceId, excludeId } = query
  const payload = await getPayloadClient()
  const filters: Where[] = []
  if (categoryId) filters.push({ category: { equals: categoryId } })
  if (serviceId) filters.push({ relatedServices: { in: [serviceId] } })
  if (excludeId) filters.push({ id: { not_equals: excludeId } })
  return payload.find({
    collection: 'articles',
    where: visibleArticles(draft, filters.length ? { and: filters } : undefined),
    draft,
    sort: '-publishedAt',
    page,
    limit,
    depth: 1,
  })
})

export const getArticle = cmsQuery(
  'article',
  async (draft, slug: string): Promise<Article | null> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'articles',
      where: visibleArticles(draft, { slug: { equals: slug } }),
      draft,
      limit: 1,
      depth: 2,
    })
    return res.docs[0] ?? null
  },
)

export const getArticleCategories = cmsQuery(
  'article-categories',
  async (): Promise<ArticleCategory[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'article-categories',
      sort: 'title',
      limit: 100,
      depth: 0,
      pagination: false,
    })
    return res.docs
  },
)

export const getArticleCategory = cmsQuery(
  'article-category',
  async (_draft, slug: string): Promise<ArticleCategory | null> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'article-categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    return res.docs[0] ?? null
  },
)

/* ── Pagine ───────────────────────────────────────── */

export const getPage = cmsQuery('page', async (draft, slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: publishedWhere(draft, { slug: { equals: slug } }),
    draft,
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

/** Slug pubblicati di una collezione (per la sitemap). */
export const getPublishedSlugs = cmsQuery(
  'published-slugs',
  async (
    _draft,
    collection: 'services' | 'team' | 'articles' | 'pages',
  ): Promise<Array<{ slug: string; updatedAt: string }>> => {
    const payload = await getPayloadClient()
    const conditions: Where[] = [{ _status: { equals: 'published' } }]
    if (collection === 'articles') {
      conditions.push({ publishedAt: { less_than_equal: new Date().toISOString() } })
    }
    const res = await payload.find({
      collection,
      where: { and: conditions },
      limit: 1000,
      depth: 0,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    return res.docs
      .filter((d): d is typeof d & { slug: string } => typeof d.slug === 'string' && d.slug !== '')
      .map((d) => ({ slug: d.slug, updatedAt: d.updatedAt }))
  },
)

/* ── Utilità per relazioni ────────────────────────── */

/** Restituisce l'oggetto se la relazione è popolata, altrimenti null. */
export function populated<T extends { id: number }>(
  value: number | T | null | undefined,
): T | null {
  return value && typeof value === 'object' ? value : null
}

export function populatedList<T extends { id: number }>(
  values: Array<number | T> | null | undefined,
): T[] {
  return (values ?? []).filter((v): v is T => Boolean(v) && typeof v === 'object')
}
