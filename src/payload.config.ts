import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { it } from '@payloadcms/translations/languages/it'
import path from 'path'
import { buildConfig, type SharpDependency } from 'payload'
import { fileURLToPath } from 'url'

import { ArticleCategories } from './collections/ArticleCategories'
import { Articles } from './collections/Articles'
import { BookingRequests } from './collections/BookingRequests'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { ServiceCategories } from './collections/ServiceCategories'
import { Services } from './collections/Services'
import { Team } from './collections/Team'
import { Users } from './collections/Users'
import { AiAssistant } from './globals/AiAssistant'
import { Navigation } from './globals/Navigation'
import { Settings } from './globals/Settings'
import { getServerUrl, truncate } from './lib/utils'
import { migrations } from './migrations'
import { seedIfFreshDatabase } from './seed/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpPort = Number(process.env.SMTP_PORT || 465)

/**
 * "sharp" ridimensiona le immagini caricate. Se sul server non fosse disponibile (librerie di
 * sistema troppo vecchie), il sito funziona comunque: le immagini vengono salvate senza varianti.
 */
let sharp: SharpDependency | undefined
try {
  sharp = (await import('sharp')).default as unknown as SharpDependency
} catch (error) {
  console.warn(
    '[LilyCare] Modulo "sharp" non disponibile: ridimensionamento immagini disattivato.',
    error,
  )
}

const pathFor = (collection: string | undefined, slug: string | undefined) => {
  if (!slug) return '/'
  switch (collection) {
    case 'services':
      return `/servizi/${slug}`
    case 'team':
      return `/team/${slug}`
    case 'articles':
      return `/notizie/${slug}`
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    default:
      return '/'
  }
}

export default buildConfig({
  serverURL: getServerUrl(),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    dateFormat: 'dd/MM/yyyy HH:mm',
    // Avatar interno: niente richieste a servizi esterni (Gravatar)
    avatar: 'default',
    meta: {
      titleSuffix: ' · LilyCare Admin',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/AdminBrand#AdminLogo',
        Icon: '/components/admin/AdminBrand#AdminIcon',
      },
      beforeDashboard: ['/components/admin/Welcome#Welcome'],
    },
  },
  i18n: {
    supportedLanguages: { it, en },
    fallbackLanguage: 'it',
  },
  collections: [
    Pages,
    Services,
    ServiceCategories,
    Team,
    Articles,
    ArticleCategories,
    BookingRequests,
    Media,
    Users,
  ],
  globals: [Settings, Navigation, AiAssistant],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/lilycare.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    // In produzione la struttura del database si aggiorna da sola all'avvio
    prodMigrations: migrations,
  }),
  onInit: async (payload) => {
    // Primo avvio in produzione con database vuoto: carica i contenuti iniziali
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE !== 'phase-production-build'
    ) {
      await seedIfFreshDatabase(payload)
    }
  },
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'info@lilycare.ch',
        defaultFromName: process.env.SMTP_FROM_NAME || 'LilyCare',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  sharp,
  telemetry: false,
  plugins: [
    seoPlugin({
      uploadsCollection: 'media',
      generateTitle: async ({ doc, collectionConfig, req }) => {
        const title = doc?.title || doc?.name || ''
        if (collectionConfig?.slug === 'services') {
          const settings = await req.payload.findGlobal({ slug: 'settings', depth: 0, req })
          const city = settings.address?.city
          return `${title}${city ? ` a ${city}` : ''} | ${settings.clinicName || 'LilyCare'}`
        }
        return title ? `${title} | LilyCare` : 'LilyCare'
      },
      generateDescription: ({ doc }) =>
        truncate(doc?.summary || doc?.excerpt || doc?.shortBio || '', 158),
      generateURL: ({ doc, collectionConfig }) =>
        `${getServerUrl()}${pathFor(collectionConfig?.slug, doc?.slug)}`,
    }),
  ],
})
