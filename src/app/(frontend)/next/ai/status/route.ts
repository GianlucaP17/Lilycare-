import { headers } from 'next/headers'

import { AI_MODEL, isAiConfigured } from '@/lib/ai/article-writer'
import { countRecentAiDrafts, MANUAL_DRAFTS_PER_DAY } from '@/lib/ai/drafts'
import { coverImagesEnabled } from '@/lib/ai/cover-image'
import { json } from '@/lib/ai/route-helpers'
import { getPayloadClient } from '@/lib/data'

export const dynamic = 'force-dynamic'

/** Stato dell'assistente per il pannello admin. */
export async function GET() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return json({ error: 'Non autorizzato.' }, 401)

  const ai = await payload.findGlobal({ slug: 'ai-assistant', depth: 0 })
  const used = await countRecentAiDrafts(payload, 'manual')
  return json({
    configured: isAiConfigured(),
    model: AI_MODEL,
    dailyEnabled: Boolean(ai.dailyEnabled),
    cronConfigured: Boolean(process.env.CRON_SECRET),
    remainingToday: Math.max(0, MANUAL_DRAFTS_PER_DAY - used),
    defaultLength: ai.defaultLength || 'media',
    // Copertine: "attive", "disattivate" dal pannello, oppure "senza chiave" sul server
    coverImages: ai.coverImages === false ? 'off' : coverImagesEnabled() ? 'on' : 'no-key',
    coverImageModel: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2',
  })
}
