import type { Payload } from 'payload'

/** Giorni di conservazione di candidature e curriculum. Dichiarato nell'informativa privacy. */
export const APPLICATION_RETENTION_DAYS = 30

const TWELVE_HOURS = 12 * 60 * 60 * 1000

/**
 * Cancella candidature e curriculum più vecchi del periodo di conservazione.
 * Eliminando la candidatura viene eliminato anche il file collegato, quindi niente orfani.
 */
export async function deleteExpiredApplications(payload: Payload): Promise<number> {
  const limite = new Date(
    Date.now() - APPLICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString()

  const scadute = await payload.find({
    collection: 'job-applications',
    where: { createdAt: { less_than: limite } },
    depth: 0,
    limit: 200,
    overrideAccess: true,
  })

  let eliminate = 0
  for (const candidatura of scadute.docs) {
    const fileId =
      typeof candidatura.cv === 'object' && candidatura.cv ? candidatura.cv.id : candidatura.cv
    try {
      await payload.delete({ collection: 'job-applications', id: candidatura.id, overrideAccess: true })
      if (fileId) {
        await payload.delete({
          collection: 'application-files',
          id: fileId as number,
          overrideAccess: true,
        })
      }
      eliminate++
    } catch (error) {
      payload.logger.error({ err: error, msg: `Candidatura ${candidatura.id} non eliminata` })
    }
  }

  // Curriculum rimasti senza candidatura (per esempio se l'invio si è interrotto a metà)
  const orfani = await payload.find({
    collection: 'application-files',
    where: { createdAt: { less_than: limite } },
    depth: 0,
    limit: 200,
    overrideAccess: true,
  })
  for (const file of orfani.docs) {
    try {
      await payload.delete({ collection: 'application-files', id: file.id, overrideAccess: true })
    } catch {
      // già eliminato insieme alla candidatura
    }
  }

  if (eliminate) payload.logger.info(`[candidature] Eliminate ${eliminate} candidature scadute`)
  return eliminate
}

/** Avvia la pulizia all'avvio del sito e poi ogni dodici ore. */
export function scheduleApplicationCleanup(payload: Payload): void {
  const esegui = () =>
    deleteExpiredApplications(payload).catch((error) =>
      payload.logger.error({ err: error, msg: 'Pulizia delle candidature non riuscita' }),
    )
  void esegui()
  const timer = setInterval(esegui, TWELVE_HOURS)
  // Non tiene sveglio il processo se non c'è altro da fare
  if (typeof timer.unref === 'function') timer.unref()
}
