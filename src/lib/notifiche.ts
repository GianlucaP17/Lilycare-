import type { PayloadRequest } from 'payload'

/**
 * Esito dell'invio delle email di avviso.
 *
 * Serve perché un invio fallito non lasciava traccia visibile: la richiesta o la candidatura
 * veniva salvata, l'errore finiva solo nel log del server e nessuno si accorgeva che la
 * casella dello studio non aveva ricevuto niente.
 *
 * Attenzione a un caso insidioso: se sul server manca SMTP_HOST, Payload NON solleva un
 * errore — scrive soltanto "Email attempted without being configured" nel log e prosegue.
 * Per questo la configurazione va controllata prima, non si può dedurre dall'eccezione.
 */

export const postaConfigurata = () => Boolean(process.env.SMTP_HOST)

const adesso = () =>
  new Date().toLocaleString('it-CH', {
    timeZone: 'Europe/Zurich',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const inviata = (destinatari: string[]) =>
  `Inviata il ${adesso()} a ${destinatari.join(', ')}`

export const nonInviata = (motivo: string) => `NON inviata (${adesso()}): ${motivo}`

export const SENZA_DESTINATARI =
  'manca l’indirizzo dello studio. Compilalo in Impostazioni studio → Contatti e sede.'

export const SENZA_POSTA =
  'sul server manca la configurazione della posta (variabile SMTP_HOST). Vedi il README.'

/** Messaggio d'errore leggibile, senza dettagli inutili. */
export function motivo(errore: unknown): string {
  const testo = errore instanceof Error ? errore.message : String(errore)
  if (/invalid login|authentication|535|534/i.test(testo)) {
    return 'la casella ha rifiutato nome utente o password (SMTP_USER / SMTP_PASS).'
  }
  if (/ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(testo))
    return 'il server di posta non è raggiungibile.'
  if (/ETIMEDOUT|ECONNREFUSED|ECONNRESET/i.test(testo)) {
    return 'il server di posta non ha risposto (porta bloccata o indirizzo errato).'
  }
  return testo.slice(0, 180)
}

/** Scrive l'esito sulla richiesta o sulla candidatura, così si vede dal pannello. */
export async function annota(
  req: PayloadRequest,
  collection: 'job-applications' | 'booking-requests',
  id: number | string,
  esito: string,
): Promise<void> {
  try {
    await req.payload.update({
      collection,
      id,
      data: { notifica: esito.slice(0, 300) },
      context: { skipEmails: true },
      req,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: `[${collection}] esito dell’avviso non annotato` })
  }
}
