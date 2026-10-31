import { readFile } from 'node:fs/promises'

import { ImageResponse } from 'next/og'

import { LOTUS_PATH, LOTUS_VIEWBOX } from '@/components/icons/brand-paths'
import { getSettings } from '@/lib/data'
import { placeLabel } from '@/lib/settings-helpers'

export const dynamic = 'force-dynamic'

/**
 * Immagine di condivisione (1200×630) generata automaticamente per ogni pagina
 * senza una foto dedicata: /og?title=…&subtitle=…
 * Font: Fraunces e Inter (SIL Open Font License). Logo: logo ufficiale LilyCare.
 */
const fraunces = readFile(new URL('./fraunces-400.woff', import.meta.url))
const inter = readFile(new URL('./inter-500.woff', import.meta.url))
const logo = readFile(new URL('./logo-orizzontale.svg', import.meta.url))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const settings = await getSettings().catch(() => null)
  const name = settings?.clinicName || 'LilyCare'
  const place = settings ? placeLabel(settings) : 'Ticino'
  const title = (
    searchParams.get('title') || `${name} – ${settings?.tagline || 'Centro medico'}`
  ).slice(0, 110)
  const subtitle = (searchParams.get('subtitle') || place).slice(0, 90)

  const [frauncesData, interData, logoData] = await Promise.all([fraunces, inter, logo])
  const logoSrc = `data:image/svg+xml;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          background: 'linear-gradient(135deg, #ffffff 0%, #fbf9f6 55%, #f8e7f2 100%)',
          position: 'relative',
          fontFamily: 'Inter',
        }}
      >
        <svg
          width="560"
          height="444"
          viewBox={LOTUS_VIEWBOX}
          style={{ position: 'absolute', right: -70, bottom: -90, opacity: 0.18 }}
        >
          <path d={LOTUS_PATH} fill="#cf7eb4" fillRule="evenodd" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={364} height={85} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940 }}>
          <div
            style={{
              fontFamily: 'Fraunces',
              fontSize: title.length > 60 ? 60 : 74,
              lineHeight: 1.08,
              color: '#152856',
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 26, fontSize: 30, color: '#934b7d' }}>{subtitle}</div>
        </div>
        <div
          style={{ display: 'flex', fontSize: 24, color: '#586178' }}
        >{`Centro medico · ${place}`}</div>
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
