import { headers } from 'next/headers'
import { after } from 'next/server'

import { AI_MODEL, isAiConfigured } from '@/lib/ai/article-writer'
import {
  countRecentAiDrafts,
  createPlaceholderDraft,
  type DraftLength,
  generateIntoDraft,
  MANUAL_DRAFTS_PER_DAY,
} from '@/lib/ai/drafts'
import { json, sameOrigin } from '@/lib/ai/route-helpers'
import { getPayloadClient } from '@/lib/data'

export const dynamic = 'force-dynamic'

const LENGTHS: DraftLength[] = ['breve', 'media', 'lunga']

/** Pannello admin → "Prepara la bozza". Risponde subito; il testo viene scritto in background. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Origine non consentita.' }, 403)

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return json({ error: 'Accedi al pannello per usare l’assistente.' }, 401)

  if (!isAiConfigured()) {
    return json({ error: 'Assistente non configurato: manca ANTHROPIC_API_KEY sul server.' }, 503)
  }

  if ((await countRecentAiDrafts(payload, 'manual')) >= MANUAL_DRAFTS_PER_DAY) {
    return json(
      {
        error: `Raggiunto il limite di ${MANUAL_DRAFTS_PER_DAY} bozze nelle ultime 24 ore. Riprova domani.`,
      },
      429,
    )
  }

  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'Richiesta non valida.' }, 400)
  }

  const toId = (v: unknown) => (typeof v === 'number' && Number.isInteger(v) && v > 0 ? v : null)
  const opts = {
    source: 'manual' as const,
    topic: typeof body.topic === 'string' ? body.topic.slice(0, 300) : null,
    notes: typeof body.notes === 'string' ? body.notes.slice(0, 2000) : null,
    categoryId: toId(body.categoryId),
    serviceIds: Array.isArray(body.serviceIds)
      ? body.serviceIds
          .map(toId)
          .filter((v): v is number => v !== null)
          .slice(0, 5)
      : [],
    length: LENGTHS.includes(body.length as DraftLength) ? (body.length as DraftLength) : null,
  }

  const id = await createPlaceholderDraft(payload, opts)
  after(() => generateIntoDraft(payload, id, opts))

  return json({ id, model: AI_MODEL, adminUrl: `/admin/collections/articles/${id}` }, 202)
}
