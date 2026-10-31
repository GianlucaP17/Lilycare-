import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { SocialIcon, socialLabel } from '@/components/icons/Social'
import { HoursList } from '@/components/ui/HoursList'
import { formatAddress, mapsUrl } from '@/lib/settings-helpers'
import { toTelHref } from '@/lib/utils'
import type { Navigation, Service, Setting } from '@/payload-types'

import { Logo } from './Logo'

export function Footer({
  settings,
  navigation,
  services,
}: {
  settings: Setting
  navigation: Navigation
  services: Service[]
}) {
  const year = new Date().getFullYear()
  const legal = navigation.footerLegal?.length
    ? navigation.footerLegal
    : [
        { label: 'Privacy', url: '/privacy' },
        { label: 'Note legali', url: '/note-legali' },
      ]

  return (
    <footer className="bg-petrol-950 text-petrol-100" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Informazioni su {settings.clinicName}
      </h2>
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-28 sm:px-8 lg:pb-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo
              logo={settings.logoOnDark}
              name={settings.clinicName}
              tagline={settings.tagline}
              invert
            />
            <p className="mt-6 max-w-sm leading-relaxed text-petrol-200">{settings.description}</p>
            {settings.socialLinks?.length ? (
              <ul className="mt-6 flex gap-2">
                {settings.socialLinks.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialLabel(s.platform)}
                      className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-petrol-700 transition-colors hover:bg-petrol-800"
                    >
                      <SocialIcon platform={s.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Servizi" className="lg:col-span-3">
            <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-blush-200 uppercase">
              Servizi
            </p>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/servizi/${s.slug}`}
                    className="text-petrol-100 transition-colors hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Lo studio" className="lg:col-span-2">
            <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-blush-200 uppercase">
              Lo studio
            </p>
            <ul className="space-y-2.5">
              {[
                { label: 'Chi siamo', url: '/chi-siamo' },
                { label: 'Il team', url: '/team' },
                { label: 'Notizie', url: '/notizie' },
                { label: 'Contatti', url: '/contatti' },
                { label: 'Prenota una visita', url: '/prenota' },
              ].map((l) => (
                <li key={l.url}>
                  <Link href={l.url} className="text-petrol-100 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-blush-200 uppercase">
              Contatti
            </p>
            <address className="space-y-3 not-italic">
              <a
                href={mapsUrl(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 text-petrol-100 hover:text-white"
              >
                <MapPin size={18} className="mt-0.5 shrink-0 text-blush-300" aria-hidden />
                <span>
                  {settings.address?.street}
                  {settings.address?.addressNote ? (
                    <>
                      <br />
                      {settings.address.addressNote}
                    </>
                  ) : null}
                  <br />
                  {settings.address?.postalCode} {settings.address?.city}
                </span>
              </a>
              <a
                href={toTelHref(settings.phone)}
                className="flex gap-3 text-petrol-100 hover:text-white"
              >
                <Phone size={18} className="mt-0.5 shrink-0 text-blush-300" aria-hidden />
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex gap-3 text-petrol-100 hover:text-white"
              >
                <Mail size={18} className="mt-0.5 shrink-0 text-blush-300" aria-hidden />
                {settings.email}
              </a>
            </address>
            <HoursList hours={settings.openingHours} invert className="mt-6 text-sm" />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-petrol-800 pt-8 text-sm text-petrol-300 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.legalName || settings.clinicName} ·{' '}
            {formatAddress(settings.address)}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="font-medium text-blush-200">Emergenze: 144</p>
            {legal.map((l) => (
              <Link key={l.url} href={l.url} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
