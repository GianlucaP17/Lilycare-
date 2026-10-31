/**
 * Limite di richieste in memoria (protezione anti-spam di base per il modulo di prenotazione).
 * Su più istanze/serverless il limite è per istanza: sufficiente come primo filtro.
 */
const hits = new Map<string, number[]>()

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
  }
  return true
}
