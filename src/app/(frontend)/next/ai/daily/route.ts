import { after } from 'next/server'

import { isAiConfigured } from '@/lib/ai/article-writer'
import { generateIntoDraft, prepareDailyDraft } from '@/lib/ai/drafts'
import { json, validCronToken } from '@/lib/ai/route-helpers'
import { getPayloadClient } from '@/lib/data'

export const dynamic = 'force-dynamic'

/**
 * Bozza automatica giornaliera. Da chiamare una volta al giorno con un "Cron Job" di cPanel:
 *   curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://lilycare.ch/next/ai/daily
 */
export async function POST(request: Request) {
  if (!process.env.CRON_SECRET) return json({ error: 'CRON_SECRET non impostata sul server.' }, 503)
  if (!validCronToken(request)) return json({ error: 'Non autorizzato.' }, 401)
  if (!isAiConfigured()) return json({ error: 'Manca ANTHROPIC_API_KEY sul server.' }, 503)

  const payload = await getPayloadClient()
  const result = await prepareDailyDraft(payload)
  if (result.status !== 'started') return json({ status: result.status })

  after(() => generateIntoDraft(payload, result.id, result.opts))
  return json({ status: 'started', id: result.id }, 202)
}
