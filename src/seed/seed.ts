/**
 * Caricamento dei contenuti iniziali (servizi, team, articoli, pagine, impostazioni).
 * Usato da `npm run seed` e, in produzione, automaticamente al primo avvio con database vuoto.
 */
import fs from 'node:fs'
import path from 'node:path'

import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { CollectionSlug, Payload } from 'payload'

import { articleCategories, articles } from './data/articles'
import { pages } from './data/pages'
import { photos } from './data/photos'
import { categories, services } from './data/services'
import { navigation, settings } from './data/site'
import { team } from './data/team'

export async function seedDatabase(
  payload: Payload,
  { force = false }: { force?: boolean } = {},
): Promise<'seeded' | 'skipped'> {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const md = (markdown: string) => convertMarkdownToLexical({ editorConfig, markdown })
  const context = { disableRevalidate: true, skipEmails: true }
  const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

  const { totalDocs: existing } = await payload.count({ collection: 'services' })
  if (existing > 0 && !force) {
    log(
      'Il database contiene già dei contenuti: nessuna modifica. Usa "npm run seed -- --force" per sostituirli.',
    )
    return 'skipped'
  }

  if (force) {
    const toClear: CollectionSlug[] = [
      'pages',
      'articles',
      'services',
      'team',
      'service-categories',
      'article-categories',
    ]
    for (const collection of toClear) {
      await payload.delete({ collection, where: { id: { exists: true } }, context })
      log(`Svuotata la collezione "${collection}"`)
    }
  }

  /* Foto dello studio (riutilizzate se già presenti nella libreria) */
  const photoIds: Record<string, number> = {}
  const photoDir = path.join(process.cwd(), 'public', 'images')
  for (const p of photos) {
    const existingPhoto = await payload.find({
      collection: 'media',
      where: { filename: { equals: p.file } },
      limit: 1,
      depth: 0,
    })
    if (existingPhoto.docs[0]) {
      photoIds[p.key] = existingPhoto.docs[0].id
      continue
    }
    const filePath = path.join(photoDir, p.dir ?? 'studio', p.file)
    if (!fs.existsSync(filePath)) {
      log(`Foto non trovata, saltata: ${filePath}`)
      continue
    }
    const doc = await payload.create({
      collection: 'media',
      context,
      filePath,
      data: { alt: p.alt, caption: p.caption, focalX: p.focalX, focalY: p.focalY },
    })
    photoIds[p.key] = doc.id
  }
  log(`Foto caricate: ${Object.keys(photoIds).length}`)

  /** Sostituisce i riferimenti "@photo:chiave" con l'id dell'immagine caricata. */
  const withPhotos = (value: unknown): unknown => {
    if (typeof value === 'string' && value.startsWith('@photo:'))
      return photoIds[value.slice(7)] ?? null
    if (Array.isArray(value)) return value.map(withPhotos)
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withPhotos(v)]))
    }
    return value
  }

  /* Impostazioni e menu */
  await payload.updateGlobal({
    slug: 'settings',
    data: { ...settings, defaultOgImage: photoIds.reception ?? null },
    context,
  })
  await payload.updateGlobal({ slug: 'navigation', data: navigation, context })
  log('Impostazioni dello studio e menu salvati')

  /* Team */
  const memberIds: Record<string, number> = {}
  for (const m of team) {
    const doc = await payload.create({
      collection: 'team',
      context,
      data: {
        _status: 'published',
        slug: m.slug,
        prefix: m.prefix,
        name: m.name,
        role: m.role,
        photo: m.photo ? (photoIds[m.photo] ?? null) : null,
        isPhysician: m.isPhysician,
        order: m.order,
        shortBio: m.shortBio,
        bio: md(m.bio),
        specialties: m.specialties.map((text) => ({ text })),
        languages: m.languages.map((language) => ({ language })),
        education: m.education,
        experience: m.experience,
        memberships: m.memberships,
        profiles: m.profiles,
        meta: { title: m.metaTitle, description: m.metaDescription },
      },
    })
    memberIds[m.slug] = doc.id
  }
  log(`Team: ${team.length} profili`)

  /* Categorie e servizi */
  const categoryIds: Record<string, number> = {}
  for (const c of categories) {
    const doc = await payload.create({
      collection: 'service-categories',
      context,
      data: { title: c.title, slug: c.slug, description: c.description, order: c.order },
    })
    categoryIds[c.key] = doc.id
  }

  const serviceIds: Record<string, number> = {}
  for (const s of services) {
    const doc = await payload.create({
      collection: 'services',
      context,
      data: {
        _status: 'published',
        title: s.title,
        slug: s.slug,
        category: categoryIds[s.category],
        icon: s.icon as never,
        schemaType: s.schemaType,
        professionals: s.professionals.map((slug) => memberIds[slug]).filter(Boolean),
        order: s.order,
        featured: s.featured,
        image: s.photo ? (photoIds[s.photo] ?? null) : null,
        summary: s.summary,
        content: md(s.content),
        indications: s.indications.map((text) => ({ text })),
        procedure: s.procedure,
        preparation: s.preparation,
        facts: s.facts,
        faqs: s.faqs,
        meta: { title: s.metaTitle, description: s.metaDescription },
      },
    })
    serviceIds[s.slug] = doc.id
  }
  log(`Servizi: ${services.length} in ${categories.length} categorie`)

  /* Notizie */
  const articleCategoryIds: Record<string, number> = {}
  for (const c of articleCategories) {
    const doc = await payload.create({ collection: 'article-categories', context, data: c })
    articleCategoryIds[c.slug] = doc.id
  }

  const now = Date.now()
  for (const a of articles) {
    const publishedAt = new Date(now - a.daysAgo * 24 * 60 * 60 * 1000)
    publishedAt.setUTCHours(7, 30, 0, 0)
    await payload.create({
      collection: 'articles',
      context,
      data: {
        _status: 'published',
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: md(a.content),
        category: articleCategoryIds[a.category],
        relatedServices: a.relatedServices.map((slug) => serviceIds[slug]).filter(Boolean),
        publishedAt: publishedAt.toISOString(),
        faqs: a.faqs,
        meta: { title: a.metaTitle, description: a.metaDescription },
      },
    })
  }
  log(`Notizie: ${articles.length} articoli in ${articleCategories.length} categorie`)

  /* Pagine (i blocchi con testo formattato sono in Markdown) */
  for (const p of pages) {
    const layout = p.layout.map((block) => {
      const resolved = withPhotos(block) as typeof block
      return typeof resolved.content === 'string'
        ? { ...resolved, content: md(resolved.content) }
        : resolved
    })
    await payload.create({
      collection: 'pages',
      context,
      data: {
        _status: 'published',
        title: p.title,
        slug: p.slug,
        layout: layout as never,
        meta: { title: p.metaTitle, description: p.metaDescription },
      },
    })
  }
  log(`Pagine: ${pages.map((p) => p.slug).join(', ')}`)

  log('Contenuti iniziali caricati ✔  Apri /admin per creare il primo utente amministratore.')
  return 'seeded'
}

/**
 * Primo avvio in produzione: se il database è appena stato creato (nessun servizio, nessuna pagina
 * e dati dello studio mai salvati), carica i contenuti iniziali. Non interviene mai su un sito già
 * in uso, neppure se lo staff elimina tutti i servizi.
 */
export async function seedIfFreshDatabase(payload: Payload): Promise<void> {
  if (process.env.AUTO_SEED === 'false') return
  const [services, pagesCount, studio] = await Promise.all([
    payload.count({ collection: 'services' }),
    payload.count({ collection: 'pages' }),
    payload.findGlobal({ slug: 'settings', depth: 0 }),
  ])
  if (services.totalDocs > 0 || pagesCount.totalDocs > 0 || studio.phone) return
  try {
    await seedDatabase(payload)
  } catch (error) {
    // Se due processi partono insieme, il secondo trova gli slug già occupati: nessun problema.
    payload.logger.warn({ err: error, msg: '[seed] Caricamento automatico non completato' })
  }
}
