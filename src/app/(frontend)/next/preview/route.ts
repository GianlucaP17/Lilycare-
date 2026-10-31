import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/data'

/**
 * Anteprima delle bozze: accessibile solo a chi ha effettuato l'accesso al pannello admin.
 * Usata dal pulsante "Anteprima" nel pannello.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/'

  // Evita redirect verso siti esterni
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Percorso non valido', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) {
    return new Response('Accedi al pannello admin per vedere l’anteprima.', { status: 403 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
