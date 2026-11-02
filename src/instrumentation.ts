/**
 * Eseguito una volta all'avvio del server.
 *
 * 1. Crea, se mancano, le cartelle dei dati (database e immagini caricate dal pannello):
 *    su cPanel stanno fuori dall'applicazione e così non serve prepararle a mano.
 * 2. Svuota la cache dei dati: dopo un aggiornamento del sito, un riavvio o il ripristino di un
 *    backup del database, le pagine mostrano subito i contenuti reali (mai dati vecchi).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.NEXT_PHASE === 'phase-production-build') return
  const fs = await import('node:fs')
  const path = await import('node:path')

  // 1. Cartelle dei dati
  const databaseUrl = process.env.DATABASE_URL || 'file:./data/lilycare.db'
  const media = process.env.MEDIA_DIR || 'media'
  const folders = [media, process.env.APPLICATIONS_DIR || path.resolve(media, '..', 'candidature')]
  if (databaseUrl.startsWith('file:')) {
    folders.push(path.dirname(databaseUrl.slice('file:'.length).split('?')[0]))
  }
  for (const folder of folders) {
    try {
      fs.mkdirSync(folder, { recursive: true })
    } catch (error) {
      console.error(`[LilyCare] Cartella "${folder}" non creata:`, error)
    }
  }

  // 2. Cache dei dati
  try {
    fs.rmSync(path.join(process.cwd(), '.next', 'cache', 'fetch-cache'), {
      recursive: true,
      force: true,
    })
  } catch {
    // nessuna cache da svuotare
  }
}
