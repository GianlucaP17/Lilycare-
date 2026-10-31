import { CalendarCheck, Mail, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { PageHeader } from '@/components/page/PageHeader'
import { LocationPanel } from '@/components/sections/LocationPanel'
import { Container } from '@/components/ui/Container'
import { getSettings } from '@/lib/data'
import { paths } from '@/lib/paths'
import { buildMetadata } from '@/lib/seo'
import { formatAddress } from '@/lib/settings-helpers'
import { toTelHref } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Contatti e dove siamo',
    description: `${settings.clinicName}, ${formatAddress(settings.address)}. Telefono ${settings.phone}, email ${settings.email}. Orari, mappa e indicazioni per raggiungerci.`,
    path: paths.contacts,
    ogSubtitle: formatAddress(settings.address),
  })
}

export default async function ContactsPage() {
  const settings = await getSettings()
  const cards = [
    {
      icon: Phone,
      title: 'Chiamaci',
      text: 'Per informazioni e appuntamenti.',
      action: settings.phone,
      href: toTelHref(settings.phone),
    },
    {
      icon: CalendarCheck,
      title: 'Prenota online',
      text: 'Invia la richiesta in un minuto.',
      action: 'Compila il modulo',
      href: paths.booking,
    },
    {
      icon: Mail,
      title: 'Scrivici',
      text: 'Rispondiamo il prima possibile.',
      action: settings.email,
      href: `mailto:${settings.email}`,
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Contatti"
        title={
          <>
            Siamo a <em className="text-blush-600 italic">{settings.address?.city}</em>
          </>
        }
        intro={`Ci trovi in ${formatAddress(settings.address, true)}${settings.areaNote ? `, ${settings.areaNote}` : ''}.`}
        crumbs={[{ label: 'Contatti', href: paths.contacts }]}
      />

      <section className="bg-white py-14">
        <Container className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => {
            const isInternal = c.href.startsWith('/')
            const content = (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-petrol-50 text-petrol-700 transition-colors group-hover:bg-petrol-800 group-hover:text-white">
                  <c.icon size={22} aria-hidden />
                </span>
                <p className="mt-5 font-serif text-2xl text-petrol-950">{c.title}</p>
                <p className="mt-1 text-muted">{c.text}</p>
                <p className="mt-4 font-semibold text-petrol-800">{c.action}</p>
              </>
            )
            const className =
              'group rounded-3xl bg-cream p-7 ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-lift'
            return isInternal ? (
              <Link key={c.title} href={c.href} className={className}>
                {content}
              </Link>
            ) : (
              <a key={c.title} href={c.href} className={className}>
                {content}
              </a>
            )
          })}
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-24" aria-labelledby="dove-siamo">
        <Container>
          <h2 id="dove-siamo" className="mb-10 text-4xl font-normal md:text-5xl">
            Dove siamo e come arrivare
          </h2>
          <LocationPanel settings={settings} showMap showDirections />
        </Container>
      </section>
    </>
  )
}
