import { NextResponse, type NextRequest } from 'next/server'

/**
 * Un solo indirizzo per il sito.
 *
 * Il sito risponde sia su lilycare.ch sia su www.lilycare.ch. Non è soltanto una questione
 * di posizionamento su Google: il pannello admin costruisce i collegamenti ai file —
 * per esempio i curriculum allegati alle candidature — usando SERVER_URL, cioè sempre
 * l'indirizzo senza "www". Chi lavora dall'indirizzo con "www" clicca un collegamento che
 * porta su un altro dominio: il cookie dell'accesso non viene inviato (vale solo per il
 * dominio su cui è stato creato) e il pannello risponde "Non sei autorizzato".
 *
 * Qui chi arriva sull'indirizzo sbagliato viene mandato su quello indicato da SERVER_URL,
 * conservando percorso e parametri. Non si tocca nessun altro indirizzo.
 */

function indirizzoCanonico(): URL | null {
  const valore = process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL
  if (!valore) return null
  try {
    return new URL(valore)
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const canonico = indirizzoCanonico()
  const host = request.headers.get('host')
  if (!canonico || !host || host === canonico.host) return NextResponse.next()

  // Si interviene solo fra "dominio" e "www.dominio": ogni altro host passa invariato
  const alternativo = canonico.host.startsWith('www.')
    ? canonico.host.slice(4)
    : `www.${canonico.host}`
  if (host !== alternativo) return NextResponse.next()

  const destinazione = new URL(request.url)
  destinazione.protocol = canonico.protocol
  destinazione.host = canonico.host
  return NextResponse.redirect(destinazione, 308)
}

export const config = {
  // I file statici di Next non hanno bisogno del controllo
  matcher: ['/((?!_next/static|_next/image).*)'],
}
