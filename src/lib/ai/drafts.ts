import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'

import { emailButton, emailLayout, escapeHtml } from '@/emails/layout'
import { formatAddress } from '@/lib/settings-helpers'
import { getServerUrl, slugify, truncate } from '@/lib/utils'
import type { Service, Team } from '@/payload-types'

import {
  type ArticleDraft,
  AiWriterError,
  type WriterContext,
  writeArticleDraft,
} from './article-writer'
import { CoverImageError, coverImagesEnabled, generateCoverImage } from './cover-image'

/**
 * Flusso delle bozze AI:
 * 1. si crea subito un articolo in bozza "in preparazione" (risposta immediata al pannello);
 * 2. in background l'assistente scrive il testo e la bozza viene completata;
 * 3. lo staff riceve un'email, rilegge, spunta "Ho riletto e verificato il testo" e pubblica.
 */

export type DraftLength = 'breve' | 'media' | 'lunga'

export type DraftOptions = {
  topic?: string | null
  categoryId?: number | null
  serviceIds?: number[]
  notes?: string | null
  length?: DraftLength | null
  source: 'manual' | 'daily'
  /** id della voce del piano editoriale da segnare come "usata" */
  topicId?: string | null
}

/** Massimo di bozze su richiesta nelle ultime 24 ore (protezione dai costi). */
export const MANUAL_DRAFTS_PER_DAY = 10

const context = { disableRevalidate: true }

const markdown = async (payload: Payload, text: string) => {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  return convertMarkdownToLexical({ editorConfig, markdown: text })
}

export async function countRecentAiDrafts(
  payload: Payload,
  source?: 'manual' | 'daily',
  hours = 24,
) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
  const { totalDocs } = await payload.count({
    collection: 'articles',
    where: {
      and: [
        { aiGenerated: { equals: true } },
        { createdAt: { greater_than: since } },
        ...(source ? [{ aiSource: { equals: source } }] : []),
      ],
    },
  })
  return totalDocs
}

/** Crea la bozza "in preparazione" e ne restituisce l'id. */
export async function createPlaceholderDraft(
  payload: Payload,
  opts: DraftOptions,
): Promise<number> {
  const topic = opts.topic?.trim()
  const doc = await payload.create({
    collection: 'articles',
    draft: true,
    context,
    data: {
      _status: 'draft',
      title: `Bozza in preparazione: ${topic || 'argomento scelto dall’assistente'}`,
      excerpt: 'Bozza in preparazione da parte dell’assistente AI.',
      content: await markdown(
        payload,
        '_La bozza è in preparazione: tra circa un minuto troverai qui il testo completo da rileggere._',
      ),
      category: opts.categoryId || undefined,
      relatedServices: opts.serviceIds?.length ? opts.serviceIds : undefined,
      aiGenerated: true,
      aiStatus: 'generating',
      aiSource: opts.source,
      reviewConfirmed: false,
    },
  })
  return doc.id
}

async function buildContext(
  payload: Payload,
): Promise<{ ctx: WriterContext; defaultLength: DraftLength }> {
  const [settings, ai, services, team, categories, recent] = await Promise.all([
    payload.findGlobal({ slug: 'settings', depth: 0 }),
    payload.findGlobal({ slug: 'ai-assistant', depth: 0 }),
    payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      sort: 'order',
      limit: 100,
      depth: 1,
      pagination: false,
    }),
    payload.find({
      collection: 'team',
      where: { _status: { equals: 'published' } },
      sort: 'order',
      limit: 100,
      depth: 0,
      pagination: false,
    }),
    payload.find({ collection: 'article-categories', limit: 100, depth: 0, pagination: false }),
    payload.find({
      collection: 'articles',
      draft: true,
      sort: '-createdAt',
      limit: 40,
      depth: 0,
      select: { title: true },
    }),
  ])

  const memberName = (m: Team) => [m.prefix, m.name].filter(Boolean).join(' ')

  return {
    defaultLength: (ai.defaultLength as DraftLength) || 'media',
    ctx: {
      clinic: {
        name: settings.clinicName,
        address: formatAddress(settings.address, true),
        phone: settings.phone,
        area: settings.areaNote,
      },
      services: services.docs.map((s: Service) => ({
        slug: s.slug as string,
        title: s.title,
        summary: s.summary,
        performedBy: (s.professionals ?? [])
          .filter((p): p is Team => typeof p === 'object' && p !== null)
          .map(memberName),
      })),
      team: team.docs.map((m) => ({ name: memberName(m), role: m.role })),
      categories: categories.docs.map((c) => ({ slug: c.slug as string, title: c.title })),
      recentTitles: recent.docs
        .map((a) => a.title)
        .filter(
          (t): t is string =>
            Boolean(t) &&
            !t.startsWith('Bozza in preparazione') &&
            !t.startsWith('Bozza non riuscita'),
        ),
      styleGuide: ai.styleGuide,
      imageStyle: ai.imageStyle,
    },
  }
}

async function uniqueSlug(payload: Payload, title: string, id: number): Promise<string> {
  const base = slugify(title).slice(0, 80).replace(/-$/, '') || `articolo-${id}`
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`
    const { totalDocs } = await payload.count({
      collection: 'articles',
      where: { and: [{ slug: { equals: candidate } }, { id: { not_equals: id } }] },
    })
    if (totalDocs === 0) return candidate
  }
  return `${base}-${id}`
}

/** Toglie un eventuale titolo di primo livello (il titolo è già un campo a parte). */
const cleanMarkdown = (text: string) => text.replace(/^\s*#\s+.+\n+/, '').trim()

async function notify(payload: Payload, subject: string, title: string, body: string) {
  try {
    const [settings, ai] = await Promise.all([
      payload.findGlobal({ slug: 'settings', depth: 0 }),
      payload.findGlobal({ slug: 'ai-assistant', depth: 0 }),
    ])
    const to = (ai.notifyEmails || settings.bookingEmails || settings.email || '')
      .split(/[,;\s]+/)
      .filter(Boolean)
    if (!to.length) return
    await payload.sendEmail({
      to,
      subject,
      html: emailLayout(title, body, 'Email automatica dell’assistente AI del sito LilyCare.'),
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: '[AI] Invio email di notifica non riuscito' })
  }
}

/** Scrive il testo con l'assistente e completa la bozza. Non lancia mai eccezioni. */
export async function generateIntoDraft(
  payload: Payload,
  id: number,
  opts: DraftOptions,
): Promise<void> {
  const adminUrl = `${getServerUrl()}/admin/collections/articles/${id}`
  try {
    const { ctx, defaultLength } = await buildContext(payload)

    const [category, services] = await Promise.all([
      opts.categoryId
        ? payload
            .findByID({ collection: 'article-categories', id: opts.categoryId, depth: 0 })
            .catch(() => null)
        : null,
      opts.serviceIds?.length
        ? payload.find({
            collection: 'services',
            where: { id: { in: opts.serviceIds } },
            depth: 0,
            limit: 10,
          })
        : null,
    ])

    const draft: ArticleDraft = await writeArticleDraft(ctx, {
      topic: opts.topic,
      categorySlug: category?.slug ?? null,
      serviceSlugs: services?.docs.map((s) => s.slug as string) ?? [],
      notes: opts.notes,
      length: opts.length || defaultLength,
    })

    // Categoria e servizi: quelli scelti dallo staff hanno la precedenza su quelli proposti
    const categoryId =
      opts.categoryId ||
      (await payload
        .find({
          collection: 'article-categories',
          where: { slug: { equals: draft.categorySlug } },
          limit: 1,
          depth: 0,
        })
        .then((r) => r.docs[0]?.id)) ||
      undefined
    const suggested = draft.relatedServiceSlugs.length
      ? (
          await payload.find({
            collection: 'services',
            where: { slug: { in: draft.relatedServiceSlugs.slice(0, 3) } },
            depth: 0,
            limit: 3,
          })
        ).docs.map((s) => s.id)
      : []
    const relatedServices = Array.from(new Set([...(opts.serviceIds ?? []), ...suggested]))

    /* Copertina: descritta dall’assistente insieme al testo, disegnata dal servizio immagini.
       Un problema qui non deve mai far fallire la bozza: l’articolo resta valido senza. */
    const aiSettings = await payload.findGlobal({ slug: 'ai-assistant', depth: 0 })
    let coverImage: number | null = null
    let coverNote: string | null = null
    if (aiSettings.coverImages === false) {
      // Copertine disattivate dal pannello: è una scelta dello staff, non serve segnalarla.
    } else if (!coverImagesEnabled()) {
      coverNote =
        'manca la chiave OPENAI_API_KEY fra le variabili del server, oppure l’applicazione non è stata riavviata dopo averla aggiunta.'
    } else if (!draft.imagePrompt?.trim()) {
      coverNote = 'l’assistente non ha descritto l’illustrazione da disegnare.'
    } else {
      try {
        const cover = await generateCoverImage(draft.imagePrompt)
        if (cover) {
          const media = await payload.create({
            collection: 'media',
            context,
            file: {
              data: cover.data,
              mimetype: cover.mimetype,
              name: `${slugify(draft.title).slice(0, 60) || 'articolo'}-copertina.${cover.extension}`,
              size: cover.data.length,
            },
            data: { alt: truncate(draft.imageAlt || draft.title, 120) },
          })
          coverImage = media.id
          payload.logger.info(`[AI] Copertina generata per la bozza ${id}`)
        }
      } catch (error) {
        coverNote =
          error instanceof CoverImageError
            ? error.message
            : 'Errore imprevisto nella generazione dell’immagine.'
        payload.logger.warn(`[AI] Copertina non creata (bozza ${id}): ${coverNote}`)
      }
    }

    const reviewPoints = [...draft.reviewNotes]
    if (coverImage) {
      reviewPoints.push(
        'L’immagine di copertina è generata da un’intelligenza artificiale e mostra un ambiente generico, non lo studio di LilyCare: controlla che sia adatta e, se preferisci, sostituiscila con una foto vera.',
      )
    }
    if (coverNote) reviewPoints.push(`Immagine di copertina non creata: ${coverNote}`)
    const notes = reviewPoints.length
      ? reviewPoints.map((n) => `• ${n}`).join('\n')
      : '• Rileggi l’intero testo e verifica le informazioni mediche.'

    const updated = await payload.update({
      collection: 'articles',
      id,
      draft: true,
      context,
      data: {
        title: draft.title.trim(),
        slug: await uniqueSlug(payload, draft.title, id),
        excerpt: truncate(draft.excerpt, 315),
        content: await markdown(payload, cleanMarkdown(draft.contentMarkdown)),
        faqs: draft.faqs.slice(0, 6),
        meta: {
          title: truncate(draft.metaTitle, 70),
          description: truncate(draft.metaDescription, 160),
        },
        category: categoryId,
        relatedServices,
        ...(coverImage ? { coverImage } : {}),
        aiStatus: 'ready',
        aiReviewNotes: notes,
        reviewConfirmed: false,
      },
    })

    if (opts.topicId) await markTopicUsed(payload, opts.topicId, id)

    await notify(
      payload,
      `Bozza pronta da rivedere: ${updated.title}`,
      'Nuova bozza da rivedere',
      `<p style="margin:0 0 16px;">L’assistente AI ha preparato una nuova bozza:</p>
       <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:20px;">${escapeHtml(updated.title)}</p>
       <p style="margin:0 0 8px;"><strong>Punti da verificare prima di pubblicare:</strong></p>
       <p style="margin:0 0 24px;padding:14px 16px;background:#f3f6fc;border-radius:10px;font-size:14px;white-space:pre-line;">${escapeHtml(notes)}</p>
       <p style="margin:0 0 24px;">${emailButton(adminUrl, 'Apri la bozza nel pannello')}</p>
       <p style="margin:0;font-size:13px;color:#586178;">La bozza non è visibile sul sito finché non viene riletta e pubblicata.</p>`,
    )
    payload.logger.info(`[AI] Bozza pronta: ${updated.title} (id ${id})`)
  } catch (error) {
    const message =
      error instanceof AiWriterError
        ? error.message
        : 'Errore imprevisto durante la preparazione della bozza.'
    payload.logger.error({ err: error, msg: `[AI] Bozza ${id} non riuscita` })
    try {
      await payload.update({
        collection: 'articles',
        id,
        draft: true,
        context,
        data: {
          title: `Bozza non riuscita: ${opts.topic?.trim() || 'argomento automatico'}`,
          aiStatus: 'error',
          aiReviewNotes: message,
        },
      })
    } catch (updateError) {
      payload.logger.error({ err: updateError, msg: `[AI] Impossibile aggiornare la bozza ${id}` })
    }
    if (opts.source === 'daily') {
      await notify(
        payload,
        'Bozza automatica non riuscita',
        'Bozza automatica non riuscita',
        `<p style="margin:0 0 16px;">La bozza automatica di oggi non è stata completata.</p>
         <p style="margin:0 0 24px;padding:14px 16px;background:#fdf2f2;border-radius:10px;font-size:14px;">${escapeHtml(message)}</p>
         <p style="margin:0;">${emailButton(adminUrl, 'Apri nel pannello')}</p>`,
      )
    }
  }
}

async function markTopicUsed(payload: Payload, topicId: string, articleId: number) {
  const ai = await payload.findGlobal({ slug: 'ai-assistant', depth: 0 })
  const topics = (ai.topics ?? []).map((t) =>
    t.id === topicId ? { ...t, status: 'used' as const, article: articleId } : t,
  )
  await payload.updateGlobal({ slug: 'ai-assistant', data: { topics }, context })
}

/** Bozza automatica giornaliera (chiamata dal cron di cPanel). */
export async function prepareDailyDraft(
  payload: Payload,
): Promise<
  | { status: 'disabled' | 'already-done'; id?: undefined }
  | { status: 'started'; id: number; opts: DraftOptions }
> {
  const ai = await payload.findGlobal({ slug: 'ai-assistant', depth: 0 })
  if (!ai.dailyEnabled) return { status: 'disabled' }
  if ((await countRecentAiDrafts(payload, 'daily', 20)) > 0) return { status: 'already-done' }

  const next = (ai.topics ?? []).find((t) => t.status !== 'used')
  const opts: DraftOptions = {
    source: 'daily',
    topic: next?.topic ?? null,
    categoryId: next?.category
      ? typeof next.category === 'object'
        ? next.category.id
        : next.category
      : null,
    serviceIds: (next?.services ?? []).map((s) => (typeof s === 'object' ? s.id : s)),
    notes: next?.notes ?? null,
    length: (ai.defaultLength as DraftLength) || 'media',
    topicId: next?.id ?? null,
  }
  const id = await createPlaceholderDraft(payload, opts)
  return { status: 'started', id, opts }
}
