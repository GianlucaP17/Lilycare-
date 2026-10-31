/**
 * Caricamento dei contenuti iniziali.
 *
 *   npm run seed            → carica i contenuti solo se il database è vuoto
 *   npm run seed -- --force → SOSTITUISCE servizi, team, articoli e pagine con quelli iniziali
 *                             (utenti, immagini e richieste di appuntamento non vengono toccati)
 */
import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { type CollectionSlug, getPayload } from 'payload'

import { articleCategories, articles } from './data/articles'
import { pages } from './data/pages'
import { categories, services } from './data/services'
import { navigation, settings } from './data/site'
import { team } from './data/team'

const force = process.argv.includes('--force') || process.env.SEED_FORCE === '1'

const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })
const md = (markdown: string) => convertMarkdownToLexical({ editorConfig, markdown })
const context = { disableRevalidate: true, skipEmails: true }

const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

const { totalDocs: existing } = await payload.count({ collection: 'services' })
if (existing > 0 && !force) {
  log(
    'Il database contiene già dei contenuti: nessuna modifica. Usa "npm run seed -- --force" per sostituirli.',
  )
  process.exit(0)
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

/* Impostazioni e menu */
await payload.updateGlobal({ slug: 'settings', data: settings, context })
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
  const layout = p.layout.map((block) =>
    typeof block.content === 'string' ? { ...block, content: md(block.content) } : block,
  )
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
process.exit(0)
