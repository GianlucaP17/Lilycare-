import { readFile } from 'node:fs/promises'

import { ImageResponse } from 'next/og'

/**
 * Immagine di condivisione (1200×630) generata automaticamente per ogni pagina
 * senza una foto dedicata: /og?title=…&subtitle=…
 * Font: Fraunces e Inter (SIL Open Font License).
 */
export const runtime = 'nodejs'

const fraunces = readFile(new URL('./fraunces-400.woff', import.meta.url))
const inter = readFile(new URL('./inter-500.woff', import.meta.url))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || 'LilyCare – Centro medico a Coldrerio').slice(0, 110)
  const subtitle = (searchParams.get('subtitle') || 'Coldrerio · Ticino').slice(0, 90)

  const [frauncesData, interData] = await Promise.all([fraunces, inter])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #faf7f2 0%, #f6f1e9 55%, #f8e9e5 100%)',
          position: 'relative',
          fontFamily: 'Inter',
        }}
      >
        <svg
          width="520"
          height="520"
          viewBox="0 0 48 48"
          style={{ position: 'absolute', right: -60, bottom: -90, opacity: 0.12 }}
        >
          <path d="M24 41.5c-6.8-8.3-7.6-21.6 0-33.5 7.6 11.9 6.8 25.2 0 33.5Z" fill="#1e5257" />
          <path d="M22.6 41.4C14 40.6 6.2 33 5 20.6c8.4 1.8 15.5 9.4 17.6 20.8Z" fill="#c98a7f" />
          <path
            d="M25.4 41.4c8.6-.8 16.4-8.4 17.6-20.8-8.4 1.8-15.5 9.4-17.6 20.8Z"
            fill="#c98a7f"
          />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 48 48">
            <path d="M24 41.5c-6.8-8.3-7.6-21.6 0-33.5 7.6 11.9 6.8 25.2 0 33.5Z" fill="#1e5257" />
            <path d="M22.6 41.4C14 40.6 6.2 33 5 20.6c8.4 1.8 15.5 9.4 17.6 20.8Z" fill="#c98a7f" />
            <path
              d="M25.4 41.4c8.6-.8 16.4-8.4 17.6-20.8-8.4 1.8-15.5 9.4-17.6 20.8Z"
              fill="#c98a7f"
            />
          </svg>
          <div style={{ fontFamily: 'Fraunces', fontSize: 46, color: '#0a2023' }}>LilyCare</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940 }}>
          <div
            style={{
              fontFamily: 'Fraunces',
              fontSize: title.length > 60 ? 62 : 76,
              lineHeight: 1.08,
              color: '#0a2023',
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: '#8e564d' }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#55666a' }}>
          Centro medico · Coldrerio, Ticino
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Fraunces', data: frauncesData, weight: 400, style: 'normal' },
        { name: 'Inter', data: interData, weight: 500, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    },
  )
}
