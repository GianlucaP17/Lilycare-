import type { Payload } from 'payload'

/**
 * Traccia dell'ultima chiamata al cron della bozza giornaliera.
 *
 * Senza questa traccia, dal pannello non si distingue "il cron non ha mai chiamato il sito"
 * (manca il Cron Job, indirizzo sbagliato) da "ha chiamato, ma il token è errato" o
 * "ha chiamato, ma la bozza automatica è disattivata": in tutti i casi non appare nessuna bozza.
 */

const context = { disableRevalidate: true }

/**
 * L'indirizzo è pubblico: una chiamata rifiutata si annota al massimo una volta ogni 10 minuti,
 * così nessuno può far scrivere sul database a raffica. Un esito diverso dal precedente viene
 * invece annotato subito, perché è proprio il cambiamento che interessa.
 */
const INTERVALLO_MINIMO_MS = 10 * 60 * 1000
let ultimaLimitata = { quando: 0, esito: '' }

export async function recordDailyCall(
  payload: Payload,
  outcome: string,
  { throttle = false }: { throttle?: boolean } = {},
): Promise<void> {
  if (throttle) {
    const ripetuta = outcome === ultimaLimitata.esito
    if (ripetuta && Date.now() - ultimaLimitata.quando < INTERVALLO_MINIMO_MS) return
    ultimaLimitata = { quando: Date.now(), esito: outcome }
  }
  try {
    await payload.updateGlobal({
      slug: 'ai-assistant',
      data: { lastDailyAt: new Date().toISOString(), lastDailyOutcome: outcome.slice(0, 300) },
      context,
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: '[AI] Chiamata del cron non annotata' })
  }
}
