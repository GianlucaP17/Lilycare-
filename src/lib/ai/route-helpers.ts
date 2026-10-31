import { timingSafeEqual } from 'node:crypto'

import { getServerUrl } from '@/lib/utils'

export const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

/** Le richieste dal pannello devono arrivare dal sito stesso (protezione CSRF). */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  const allowed = new Set([new URL(getServerUrl()).origin, new URL(request.url).origin])
  return allowed.has(origin)
}

/** Confronto a tempo costante del token del cron. */
export function validCronToken(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || secret.length < 16) return false
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const a = Buffer.from(token)
  const b = Buffer.from(secret)
  return a.length === b.length && timingSafeEqual(a, b)
}
