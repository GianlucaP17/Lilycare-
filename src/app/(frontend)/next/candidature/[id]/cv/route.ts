import fs from 'fs/promises'
import { cookies, headers } from 'next/headers'
import path from 'path'

import { applicationFilesDir } from '@/collections/ApplicationFiles'
import { getPayloadClient } from '@/lib/data'

export const dynamic = 'force-dynamic'

/**
 * Apre il curriculum allegato a una candidatura, dal pannello admin.
 *
 * Perché non si usa l'indirizzo del file di Payload (/api/application-files/file/...):
 * quella via accetta il cookie dell'accesso solo se la richiesta porta l'intestazione
 * "Origin" oppure "Sec-Fetch-Site". Il clic su un collegamento non manda "Origin", e
 * alcuni browser non mandano nemmeno "Sec-Fetch-Site": il pannello rispondeva allora
 * "Non sei autorizzato" anche a chi era regolarmente collegato.
 *
 * Qui il token viene letto dal cookie e passato come intestazione di autorizzazione, che
 * non dipende da quel dettaglio. La protezione resta intera: senza un utente del pannello
 * non si ottiene nulla, i permessi della collezione vengono comunque applicati e le
 * richieste che il browser dichiara provenire da un altro sito vengono rifiutate.
 */

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const intestazioni = await headers()

  // Se il browser dichiara che la richiesta arriva da un altro sito, si rifiuta.
  if (intestazioni.get('sec-fetch-site') === 'cross-site') {
    return json({ error: 'Richiesta non consentita.' }, 403)
  }

  const payload = await getPayloadClient()
  const token = (await cookies()).get(`${payload.config.cookiePrefix}-token`)?.value
  if (!token) return json({ error: 'Accedi al pannello per aprire il curriculum.' }, 401)

  const auth = new Headers()
  auth.set('Authorization', `JWT ${token}`)
  const { user } = await payload.auth({ headers: auth })
  if (!user) return json({ error: 'Accedi al pannello per aprire il curriculum.' }, 401)

  const { id } = await params
  const numero = Number(id)
  if (!Number.isInteger(numero) || numero <= 0)
    return json({ error: 'Candidatura non valida.' }, 400)

  // overrideAccess: false → valgono i permessi della collezione, non si scavalca nulla
  const candidatura = await payload
    .findByID({
      collection: 'job-applications',
      id: numero,
      depth: 1,
      overrideAccess: false,
      user,
    })
    .catch(() => null)

  const file = typeof candidatura?.cv === 'object' ? candidatura.cv : null
  if (!file?.filename) return json({ error: 'Curriculum non trovato.' }, 404)

  // Si usa solo il nome registrato nel database, e si controlla che resti nella sua cartella
  const cartella = path.resolve(applicationFilesDir)
  const percorso = path.resolve(cartella, path.basename(file.filename))
  if (!percorso.startsWith(cartella + path.sep)) return json({ error: 'File non valido.' }, 400)

  let contenuto: Buffer
  try {
    contenuto = await fs.readFile(percorso)
  } catch {
    payload.logger.error(`[candidature] curriculum mancante sul disco: ${percorso}`)
    return json({ error: 'Il file non si trova più sul server.' }, 404)
  }

  return new Response(new Uint8Array(contenuto), {
    headers: {
      'Content-Type': file.mimeType || 'application/pdf',
      'Content-Length': String(contenuto.length),
      // "inline": il PDF si apre nel browser invece di essere scaricato
      'Content-Disposition': `inline; filename="${encodeURIComponent(file.filename)}"`,
      'Cache-Control': 'no-store, private',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
