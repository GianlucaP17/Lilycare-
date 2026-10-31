import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { it } from '@payloadcms/translations/languages/it'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
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
import { Navigation } from './globals/Navigation'
import { Settings } from './globals/Settings'
import { getServerUrl, truncate } from './lib/utils'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpPort = Number(process.env.SMTP_PORT || 587)

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
  globals: [Settings, Navigation],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/lilycare.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
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
      generateTitle: ({ doc, collectionConfig }) => {
        const title = doc?.title || doc?.name || ''
        if (collectionConfig?.slug === 'services') return `${title} a Coldrerio, Ticino | LilyCare`
        return title ? `${title} | LilyCare` : 'LilyCare'
      },
      generateDescription: ({ doc }) =>
        truncate(doc?.summary || doc?.excerpt || doc?.shortBio || '', 158),
      generateURL: ({ doc, collectionConfig }) =>
        `${getServerUrl()}${pathFor(collectionConfig?.slug, doc?.slug)}`,
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
