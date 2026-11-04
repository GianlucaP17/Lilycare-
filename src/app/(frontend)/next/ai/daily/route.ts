import { after } from 'next/server'

import { isAiConfigured } from '@/lib/ai/article-writer'
import { recordDailyCall } from '@/lib/ai/daily-log'
import { generateIntoDraft, prepareDailyDraft } from '@/lib/ai/drafts'
import { json, validCronToken } from '@/lib/ai/route-helpers'
import { getPayloadClient } from '@/lib/data'

export const dynamic = 'force-dynamic'

/**
 * Bozza automatica giornaliera. Da chiamare una volta al giorno con un "Cron Job" di cPanel:
 *   curl -fsS -X POST -H "Authorization: Bearer IL_TUO_CRON_SECRET" https://lilycare.ch/next/ai/daily
 *
 * Ogni chiamata viene annotata in Notizie → Assistente AI, comprese quelle rifiutate: dal
 * pannello si vede così se il cron arriva davvero e, quando arriva, cosa succede.
 */
async function handle(request: Request) {
  const payload = await getPayloadClient()
  const annota = (esito: string, throttle = false) => recordDailyCall(payload, esito, { throttle })

  if (!process.env.CRON_SECRET) {
    await annota('Il cron ha chiamato, ma sul server manca la variabile CRON_SECRET.', true)
    return json({ error: 'CRON_SECRET non impostata sul server.' }, 503)
  }

  // validCronToken rifiuta una chiave troppo corta: senza questo messaggio sembrerebbe un token errato
  if (process.env.CRON_SECRET.length < 16) {
    await annota(
      'La variabile CRON_SECRET sul server è troppo corta: servono almeno 16 caratteri.',
      true,
    )
    return json({ error: 'CRON_SECRET troppo corta: servono almeno 16 caratteri.' }, 503)
  }

  if (!validCronToken(request)) {
    await annota(
      request.headers.get('authorization')
        ? 'Chiamata rifiutata: il token del cron non corrisponde a CRON_SECRET.'
        : 'Chiamata rifiutata: nel comando del cron manca l’intestazione Authorization.',
      true,
    )
    return json({ error: 'Non autorizzato.' }, 401)
  }

  if (!isAiConfigured()) {
    await annota('Il cron ha chiamato, ma sul server manca ANTHROPIC_API_KEY.')
    return json({ error: 'Manca ANTHROPIC_API_KEY sul server.' }, 503)
  }

  const result = await prepareDailyDraft(payload)
  if (result.status !== 'started') {
    await annota(
      result.status === 'disabled'
        ? 'Il cron ha chiamato, ma la bozza automatica giornaliera è disattivata qui sopra.'
        : 'Il cron ha chiamato: una bozza automatica era già stata creata nelle ultime 20 ore.',
    )
    return json({ status: result.status })
  }

  await annota(`Bozza avviata (articolo n. ${result.id}): l’assistente sta scrivendo il testo.`)
  after(() => generateIntoDraft(payload, result.id, result.opts))
  return json({ status: 'started', id: result.id }, 202)
}

export const POST = handle

/** Alcuni cron chiamano senza "-X POST": accettiamo anche GET, il token resta obbligatorio. */
export const GET = handle
