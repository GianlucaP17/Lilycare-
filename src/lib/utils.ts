/** Unisce classi CSS ignorando valori falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Converte un testo in uno "slug" per gli URL, gestendo accenti e apostrofi italiani.
 * "Onde d'urto" → "onde-d-urto", "Perché è utile?" → "perche-e-utile"
 */
export function slugify(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’`´]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

/** URL pubblico del sito, senza slash finale. */
export function getServerUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  return url.replace(/\/$/, '')
}

/** Rende assoluto un percorso relativo ("/servizi" → "https://lilycare.ch/servizi"). */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path
  return `${getServerUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

const dateFormatter = new Intl.DateTimeFormat('it-CH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Zurich',
})

export function formatDate(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return dateFormatter.format(date)
}

/** Normalizza un numero di telefono per i link `tel:` (es. "+41 78 335 51 53" → "+41783355153"). */
export function toTelHref(phone?: string | null): string {
  if (!phone) return ''
  const cleaned = phone.replace(/[^\d+]/g, '')
  return `tel:${cleaned}`
}

/** Tempo di lettura stimato in minuti (circa 200 parole al minuto). */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Tronca un testo alla lunghezza indicata senza spezzare le parole. */
export function truncate(text: string | null | undefined, max = 160): string {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`
}

/** Iniziali di un nome ("Mauro Binda" → "MB"). */
export function initials(name?: string | null): string {
  if (!name) return ''
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
