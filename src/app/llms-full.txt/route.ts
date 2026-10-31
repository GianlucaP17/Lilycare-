import { buildLlmsText } from '@/lib/llms'

export const dynamic = 'force-dynamic'

export async function GET() {
  const body = await buildLlmsText(true)
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
