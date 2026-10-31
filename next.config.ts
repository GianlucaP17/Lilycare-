import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/images/**' }],
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    // Vecchi URL del sito precedente → nuove pagine (evita 404 e conserva il posizionamento)
    return [
      { source: '/about-us', destination: '/chi-siamo', permanent: true },
      { source: '/about-us/', destination: '/chi-siamo', permanent: true },
      { source: '/contact', destination: '/contatti', permanent: true },
      { source: '/contact-us', destination: '/contatti', permanent: true },
      { source: '/services', destination: '/servizi', permanent: true },
      { source: '/team-members', destination: '/team', permanent: true },
      { source: '/blog', destination: '/notizie', permanent: true },
      { source: '/blog/:slug', destination: '/notizie/:slug', permanent: true },
      { source: '/appointment', destination: '/prenota', permanent: true },
      { source: '/home', destination: '/', permanent: true },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
