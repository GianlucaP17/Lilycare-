/**
 * Eseguito una volta all'avvio del server.
 * Svuota la cache dei dati: dopo un aggiornamento del sito, un riavvio o il ripristino di un
 * backup del database, le pagine mostrano subito i contenuti reali (mai dati vecchi).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const fs = await import('node:fs')
  const path = await import('node:path')
  try {
    fs.rmSync(path.join(process.cwd(), '.next', 'cache', 'fetch-cache'), {
      recursive: true,
      force: true,
    })
  } catch {
    // nessuna cache da svuotare
  }
}
