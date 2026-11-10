import { cookies, headers } from 'next/headers'

import { emailLayout } from '@/emails/layout'
import { json, sameOrigin } from '@/lib/ai/route-helpers'
import { getPayloadClient } from '@/lib/data'
import { motivo, postaConfigurata, SENZA_DESTINATARI, SENZA_POSTA } from '@/lib/notifiche'

export const dynamic = 'force-dynamic'

/**
 * Invia un'email di prova agli indirizzi dello studio, dal pannello.
 *
 * Serve per sapere subito se la posta funziona, senza aspettare che arrivi una richiesta o
 * una candidatura vera. Non si può scegliere il destinatario: si usano solo gli indirizzi
 * configurati in Impostazioni studio, quindi non è un modo per spedire a terzi.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Origine non consentita.' }, 403)
  const intestazioni = await headers()
  if (intestazioni.get('sec-fetch-site') === 'cross-site') {
    return json({ error: 'Richiesta non consentita.' }, 403)
  }

  const payload = await getPayloadClient()
  const token = (await cookies()).get(`${payload.config.cookiePrefix}-token`)?.value
  const auth = new Headers()
  if (token) auth.set('Authorization', `JWT ${token}`)
  const { user } = await payload.auth({ headers: auth })
  if (!user) return json({ error: 'Accedi al pannello per inviare la prova.' }, 401)

  const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
  const destinatari = (settings.jobEmails || settings.bookingEmails || settings.email || '')
    .split(/[,;\s]+/)
    .filter(Boolean)

  if (!destinatari.length) return json({ error: `Impossibile: ${SENZA_DESTINATARI}` }, 400)
  if (!postaConfigurata()) return json({ error: `Impossibile: ${SENZA_POSTA}` }, 503)

  try {
    await payload.sendEmail({
      to: destinatari,
      subject: 'Prova di invio – sito LilyCare',
      html: emailLayout(
        'La posta del sito funziona',
        `<p style="margin:0 0 16px;">Questa è un’email di prova inviata dal pannello di amministrazione.</p>
         <p style="margin:0;">Se la stai leggendo, le richieste di appuntamento e le candidature arrivano regolarmente a questo indirizzo.</p>`,
        'Email di prova del sito LilyCare.',
      ),
      text: 'Email di prova inviata dal pannello di amministrazione del sito LilyCare. Se la stai leggendo, la posta funziona.',
    })
    return json({ ok: true, to: destinatari })
  } catch (error) {
    payload.logger.error({ err: error, msg: '[posta] email di prova non inviata' })
    return json({ error: motivo(error), to: destinatari }, 502)
  }
}
