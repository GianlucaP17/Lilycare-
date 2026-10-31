import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header, type MenuGroup, type NavItem } from '@/components/layout/Header'
import { Logo } from '@/components/layout/Logo'
import { MobileActionBar } from '@/components/layout/MobileActionBar'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { TopBar } from '@/components/layout/TopBar'
import { JsonLd } from '@/components/ui/JsonLd'
import { getNavigation, getServiceCategories, getServices, getSettings, getTeam } from '@/lib/data'
import { clinicSchema, websiteSchema } from '@/lib/schema'
import { formatAddress } from '@/lib/settings-helpers'
import { getServerUrl } from '@/lib/utils'

import './globals.css'

/**
 * Pagine generate a ogni richiesta (con cache dei dati): il sito si compila senza database
 * e mostra sempre i contenuti aggiornati dal pannello admin.
 */
export const dynamic = 'force-dynamic'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const defaultNav: NavItem[] = [
  { label: 'Servizi', url: '/servizi', servicesMenu: true },
  { label: 'Team', url: '/team' },
  { label: 'Notizie', url: '/notizie' },
  { label: 'Chi siamo', url: '/chi-siamo' },
  { label: 'Contatti', url: '/contatti' },
]

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = `${settings.clinicName} – ${settings.tagline || 'Centro medico'}`
  return {
    metadataBase: new URL(getServerUrl()),
    title: { default: title, template: `%s | ${settings.clinicName}` },
    description: settings.description,
    applicationName: settings.clinicName,
    formatDetection: { telephone: false },
    openGraph: { siteName: settings.clinicName, locale: 'it_CH', type: 'website' },
    verification: {
      google: settings.googleSiteVerification || undefined,
      other: settings.bingSiteVerification
        ? { 'msvalidate.01': settings.bingSiteVerification }
        : undefined,
    },
    alternates: { types: { 'text/plain': [{ url: '/llms.txt', title: 'llms.txt' }] } },
  }
}

export const viewport: Viewport = {
  themeColor: '#fbf9f6',
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [settings, navigation, services, categories, team] = await Promise.all([
    getSettings(),
    getNavigation(),
    getServices(),
    getServiceCategories(),
    getTeam(),
  ])

  const groups: MenuGroup[] = categories
    .map((c) => ({
      title: c.title,
      services: services
        .filter((s) => (typeof s.category === 'object' ? s.category?.id : s.category) === c.id)
        .map((s) => ({ title: s.title, slug: s.slug as string, icon: s.icon })),
    }))
    .filter((g) => g.services.length)

  const nav: NavItem[] = navigation.header?.length
    ? navigation.header.map((n) => ({ label: n.label, url: n.url, servicesMenu: n.servicesMenu }))
    : defaultNav

  return (
    <html lang="it-CH" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-navy-800 focus:px-5 focus:py-3 focus:text-white"
        >
          Vai al contenuto
        </a>
        <PreviewBanner />
        <TopBar settings={settings} />
        <Header
          logo={<Logo logo={settings.logo} name={settings.clinicName} height={44} heightLg={54} />}
          nav={nav}
          groups={groups}
          phone={settings.phone}
          address={formatAddress(settings.address)}
        />
        <main id="contenuto">{children}</main>
        <Footer settings={settings} navigation={navigation} services={services} />
        <MobileActionBar phone={settings.phone} whatsapp={settings.whatsapp} />
        <JsonLd data={[clinicSchema(settings, services, team), websiteSchema(settings)]} />
      </body>
    </html>
  )
}
