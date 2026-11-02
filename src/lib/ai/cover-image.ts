/**
 * Illustrazione di copertina per gli articoli, generata da OpenAI.
 *
 * Il testo e la descrizione dell'immagine nascono insieme: è l'assistente che scrive
 * l'articolo a comporre il "prompt" (vedi article-writer.ts), così l'illustrazione conosce
 * il contesto. Qui quella descrizione viene inviata al servizio di generazione immagini.
 *
 * Senza OPENAI_API_KEY la funzione resta inattiva e l'articolo mantiene la copertina
 * grafica predefinita del sito: la bozza non fallisce mai per colpa dell'immagine.
 */

/**
 * Indirizzo del servizio. Si può puntare a un fornitore diverso purché compatibile con
 * l'API di OpenAI, impostando OPENAI_BASE_URL (senza "/images/generations" finale).
 */
const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
const ENDPOINT = `${BASE_URL}/images/generations`

/**
 * Modello di generazione immagini. Si cambia dalle variabili d'ambiente (cPanel) senza
 * ricompilare il sito: i nomi dei modelli OpenAI cambiano e quelli vecchi vengono dismessi.
 */
const MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2'
/** Formato orizzontale, adatto alle schede e alle anteprime di condivisione. */
const SIZE = process.env.OPENAI_IMAGE_SIZE || '1536x1024'
const QUALITY = process.env.OPENAI_IMAGE_QUALITY || 'medium'
const TIMEOUT_MS = Number(process.env.OPENAI_IMAGE_TIMEOUT_MS || 120_000)

export class CoverImageError extends Error {}

export function coverImagesEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY)
}

export type GeneratedCover = {
  data: Buffer
  mimetype: string
  extension: string
}

/** Riduce il peso del file. Se "sharp" non è disponibile sul server si usa l'originale. */
async function optimise(raw: Buffer): Promise<GeneratedCover> {
  try {
    const sharp = (await import('sharp')).default
    const data = await sharp(raw)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer()
    return { data, mimetype: 'image/jpeg', extension: 'jpg' }
  } catch {
    return { data: raw, mimetype: 'image/png', extension: 'png' }
  }
}

/**
 * Genera l'illustrazione. Restituisce `null` se la funzione non è configurata;
 * lancia CoverImageError se il servizio risponde con un errore.
 */
export async function generateCoverImage(prompt: string): Promise<GeneratedCover | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || !prompt.trim()) return null

  let response: Response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt.trim(),
        size: SIZE,
        quality: QUALITY,
        n: 1,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new CoverImageError(`Servizio immagini non raggiungibile (${reason}).`)
  }

  if (!response.ok) {
    let detail = `codice ${response.status}`
    try {
      const body = (await response.json()) as { error?: { message?: string } }
      if (body?.error?.message) detail = body.error.message
    } catch {
      // risposta non leggibile: resta il codice di stato
    }
    // 404 e "model not found" capitano quando il modello è stato dismesso
    throw new CoverImageError(
      `Il servizio immagini ha rifiutato la richiesta (modello "${MODEL}"): ${detail}`,
    )
  }

  const body = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>
  }
  const item = body.data?.[0]
  if (!item) throw new CoverImageError('Il servizio immagini non ha restituito nessuna immagine.')

  // I modelli recenti restituiscono l'immagine codificata; quelli più vecchi un indirizzo
  if (item.b64_json) return optimise(Buffer.from(item.b64_json, 'base64'))
  if (item.url) {
    const file = await fetch(item.url, { signal: AbortSignal.timeout(60_000) })
    if (!file.ok) throw new CoverImageError('Immagine generata ma non scaricabile.')
    return optimise(Buffer.from(await file.arrayBuffer()))
  }
  throw new CoverImageError('Risposta del servizio immagini in un formato non riconosciuto.')
}
