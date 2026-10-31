import config from '@payload-config'
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
 * - Mostra solo contenuti pubblicati (salvo anteprima dal pannello admin).
 * - `cache` evita query duplicate durante lo stesso rendering.
 */

export const getPayloadClient = cache(async () => getPayload({ config }))

export const isDraftMode = cache(async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
})

const published = async (where?: Where): Promise<{ where: Where; draft: boolean }> => {
  const draft = await isDraftMode()
  if (draft) return { where: where ?? {}, draft }
  return {
    where: where
      ? { and: [where, { _status: { equals: 'published' } }] }
      : { _status: { equals: 'published' } },
    draft,
  }
}

/* ── Impostazioni globali ─────────────────────────── */

export const getSettings = cache(async (): Promise<Setting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'settings', depth: 1 })
})

export const getNavigation = cache(async (): Promise<Navigation> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', depth: 0 })
})

/* ── Servizi ──────────────────────────────────────── */

export const getServiceCategories = cache(async (): Promise<ServiceCategory[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'service-categories',
    sort: 'order',
    limit: 100,
    depth: 0,
    pagination: false,
  })
  return res.docs
})

export const getServices = cache(async (): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const q = await published()
  const res = await payload.find({
    collection: 'services',
    ...q,
    sort: 'order',
    limit: 200,
    depth: 1,
    pagination: false,
  })
  return res.docs
})

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const q = await published({ slug: { equals: slug } })
  const res = await payload.find({ collection: 'services', ...q, limit: 1, depth: 2 })
  return res.docs[0] ?? null
})

export const getServicesByProfessional = cache(async (memberId: number): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const q = await published({ professionals: { in: [memberId] } })
  const res = await payload.find({
    collection: 'services',
    ...q,
    sort: 'order',
    limit: 100,
    depth: 1,
    pagination: false,
  })
  return res.docs
})

/* ── Team ─────────────────────────────────────────── */

export const getTeam = cache(async (): Promise<Team[]> => {
  const payload = await getPayloadClient()
  const q = await published()
  const res = await payload.find({
    collection: 'team',
    ...q,
    sort: 'order',
    limit: 100,
    depth: 1,
    pagination: false,
  })
  return res.docs
})

export const getMember = cache(async (slug: string): Promise<Team | null> => {
  const payload = await getPayloadClient()
  const q = await published({ slug: { equals: slug } })
  const res = await payload.find({ collection: 'team', ...q, limit: 1, depth: 1 })
  return res.docs[0] ?? null
})

/* ── Notizie ──────────────────────────────────────── */

const visibleArticles = async (extra?: Where) => {
  const draft = await isDraftMode()
  const conditions: Where[] = []
  if (extra) conditions.push(extra)
  if (!draft) {
    conditions.push({ _status: { equals: 'published' } })
    // Articoli programmati: visibili solo dalla data di pubblicazione
    conditions.push({ publishedAt: { less_than_equal: new Date().toISOString() } })
  }
  const where: Where = conditions.length ? { and: conditions } : {}
  return { where, draft }
}

export const getArticles = cache(
  async ({
    page = 1,
    limit = 9,
    categoryId,
    serviceId,
    excludeId,
  }: {
    page?: number
    limit?: number
    categoryId?: number
    serviceId?: number
    excludeId?: number
  } = {}) => {
    const payload = await getPayloadClient()
    const filters: Where[] = []
    if (categoryId) filters.push({ category: { equals: categoryId } })
    if (serviceId) filters.push({ relatedServices: { in: [serviceId] } })
    if (excludeId) filters.push({ id: { not_equals: excludeId } })
    const q = await visibleArticles(filters.length ? { and: filters } : undefined)
    return payload.find({
      collection: 'articles',
      ...q,
      sort: '-publishedAt',
      page,
      limit,
      depth: 1,
    })
  },
)

export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  const payload = await getPayloadClient()
  const q = await visibleArticles({ slug: { equals: slug } })
  const res = await payload.find({ collection: 'articles', ...q, limit: 1, depth: 2 })
  return res.docs[0] ?? null
})

export const getArticleCategories = cache(async (): Promise<ArticleCategory[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'article-categories',
    sort: 'title',
    limit: 100,
    depth: 0,
    pagination: false,
  })
  return res.docs
})

export const getArticleCategory = cache(async (slug: string): Promise<ArticleCategory | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'article-categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return res.docs[0] ?? null
})

/* ── Pagine ───────────────────────────────────────── */

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const q = await published({ slug: { equals: slug } })
  const res = await payload.find({ collection: 'pages', ...q, limit: 1, depth: 2 })
  return res.docs[0] ?? null
})

/** Slug pubblicati di una collezione (per la generazione statica e la sitemap). */
export async function getPublishedSlugs(
  collection: 'services' | 'team' | 'articles' | 'pages',
): Promise<Array<{ slug: string; updatedAt: string }>> {
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
}

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
