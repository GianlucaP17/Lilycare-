import { Clock, Info, Mail, MapPin, Phone, Siren } from 'lucide-react'
import type { Metadata } from 'next'
import React from 'react'

import { BookingForm } from '@/components/booking/BookingForm'
import { PageHeader } from '@/components/page/PageHeader'
import { Container } from '@/components/ui/Container'
import { HoursList } from '@/components/ui/HoursList'
import { getServiceCategories, getServices, getSettings, getTeam } from '@/lib/data'
import { paths } from '@/lib/paths'
import { buildMetadata } from '@/lib/seo'
import { formatAddress } from '@/lib/settings-helpers'
import { toTelHref } from '@/lib/utils'

type Props = { searchParams: Promise<{ servizio?: string; specialista?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Prenota una visita',
    description:
      'Richiedi un appuntamento a LilyCare, centro medico a Coldrerio: radiografie, ecografie, ecodoppler, ozonoterapia, infiltrazioni, onde d’urto, cure infermieristiche e agopuntura.',
    path: paths.booking,
    ogSubtitle: 'Richiesta online in un minuto',
  })
}

export default async function BookingPage({ searchParams }: Props) {
  const sp = await searchParams
  const [settings, services, categories, team] = await Promise.all([
    getSettings(),
    getServices(),
    getServiceCategories(),
    getTeam(),
  ])

  const serviceGroups = categories
    .map((c) => ({
      label: c.title,
      options: services
        .filter((s) => (typeof s.category === 'object' ? s.category?.id : s.category) === c.id)
        .map((s) => ({ value: s.slug as string, label: s.title })),
    }))
    .filter((g) => g.options.length)

  const professionals = team.map((m) => ({
    value: m.slug as string,
    label: [m.prefix, m.name].filter(Boolean).join(' ') + ` – ${m.role}`,
  }))

  const defaultService = services.some((s) => s.slug === sp.servizio) ? sp.servizio : undefined
  const defaultProfessional = team.some((m) => m.slug === sp.specialista)
    ? sp.specialista
    : undefined

  return (
    <>
      <PageHeader
        eyebrow="Prenotazioni"
        title={
          <>
            Prenota una <em className="text-blush-600 italic">visita</em>
          </>
        }
        intro={
          settings.bookingIntro ||
          'Compila il modulo in un minuto: ti ricontatteremo per concordare data e ora. Se preferisci, puoi anche chiamarci.'
        }
        crumbs={[{ label: 'Prenota una visita', href: paths.booking }]}
      >
        <a
          href={toTelHref(settings.phone)}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2 font-medium text-petrol-900 shadow-soft ring-1 ring-line hover:ring-petrol-300"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-petrol-800 text-white">
            <Phone size={16} aria-hidden />
          </span>
          Preferisci telefonare? {settings.phone}
        </a>
      </PageHeader>

      <section className="bg-cream py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <BookingForm
              serviceGroups={serviceGroups}
              professionals={professionals}
              defaultService={defaultService}
              defaultProfessional={defaultProfessional}
              phone={settings.phone}
              responseTime={settings.responseTimeText}
            />
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl bg-white p-7 ring-1 ring-line">
              <p className="font-serif text-2xl text-petrol-950">Cosa succede dopo?</p>
              <ol className="mt-5 space-y-4">
                {[
                  'Riceviamo la tua richiesta e ti inviamo un’email di conferma di ricezione.',
                  'Ti ricontattiamo per concordare giorno e ora dell’appuntamento.',
                  'Ti diamo le indicazioni per prepararti alla visita o all’esame.',
                ].map((text, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush-50 font-serif text-sm text-blush-700 ring-1 ring-blush-200">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-muted">{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl bg-white p-7 ring-1 ring-line">
              <p className="font-serif text-2xl text-petrol-950">Contatti</p>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                <li className="flex gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-petrol-600" aria-hidden />
                  <a
                    href={toTelHref(settings.phone)}
                    className="font-medium text-petrol-950 hover:text-petrol-700"
                  >
                    {settings.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-petrol-600" aria-hidden />
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-medium text-petrol-950 hover:text-petrol-700"
                  >
                    {settings.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-petrol-600" aria-hidden />
                  <span>{formatAddress(settings.address)}</span>
                </li>
              </ul>
              <div className="mt-6 border-t border-line pt-5">
                <p className="mb-3 flex items-center gap-2 text-sm font-medium text-petrol-950">
                  <Clock size={16} aria-hidden /> Orari
                </p>
                <HoursList hours={settings.openingHours} className="text-sm" />
              </div>
            </div>

            {settings.insuranceNote ? (
              <div className="flex gap-3 rounded-3xl bg-petrol-50 p-6 text-sm leading-relaxed text-petrol-900 ring-1 ring-petrol-100">
                <Info size={18} className="mt-0.5 shrink-0" aria-hidden />
                <p>{settings.insuranceNote}</p>
              </div>
            ) : null}

            <div className="flex gap-3 rounded-3xl bg-blush-50 p-6 text-sm leading-relaxed text-blush-700 ring-1 ring-blush-200">
              <Siren size={18} className="mt-0.5 shrink-0" aria-hidden />
              <p>
                <strong>In caso di emergenza</strong> non usare questo modulo: chiama subito il{' '}
                <strong>144</strong>.
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  )
}
