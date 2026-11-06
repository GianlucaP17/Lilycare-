import { ArrowUpRight, CalendarDays, Clock, MapPin, Wine } from 'lucide-react'
import React from 'react'

import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { getSettings } from '@/lib/data'
import { inaugurazione, inaugurazioneInCorso } from '@/lib/evento'
import { directionsUrl, formatAddress } from '@/lib/settings-helpers'
import { getServerUrl } from '@/lib/utils'

/**
 * Invito all'inaugurazione, in cima alla homepage.
 * Sparisce da solo quando l'evento è finito (vedi src/lib/evento.ts).
 */
export async function InaugurazioneBanner() {
  if (!inaugurazioneInCorso()) return null

  const settings = await getSettings()
  const indirizzo = formatAddress(settings.address)

  const dati = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${inaugurazione.titolo} ${settings.clinicName}`,
    startDate: inaugurazione.inizio,
    endDate: inaugurazione.fine,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    description: `Inaugurazione di ${settings.clinicName} a ${settings.address?.city ?? 'Chiasso'}: porte aperte e aperitivo.`,
    organizer: { '@type': 'Organization', name: settings.clinicName, url: getServerUrl() },
    location: {
      '@type': 'Place',
      name: settings.clinicName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address?.street ?? undefined,
        postalCode: settings.address?.postalCode ?? undefined,
        addressLocality: settings.address?.city ?? undefined,
        addressCountry: settings.address?.country ?? 'CH',
      },
    },
  }

  const dettagli = [
    { icona: CalendarDays, etichetta: inaugurazione.giorno },
    { icona: Clock, etichetta: `Dalle ore ${inaugurazione.ora}` },
    { icona: Wine, etichetta: 'Aperitivo' },
  ]

  return (
    <section
      aria-labelledby="inaugurazione"
      className="relative overflow-hidden bg-navy-950 text-white"
    >
      <JsonLd data={dati} />
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(207_126_180/0.32),transparent_68%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgb(76_113_196/0.3),transparent_70%)]"
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/lilycare-fiore.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-10 -bottom-16 hidden w-72 opacity-[0.07] md:block"
      />

      <Container className="relative py-12 text-center md:py-16">
        <p className="eyebrow mb-4 justify-center text-orchid-300 before:bg-orchid-400">
          {inaugurazione.invito}
        </p>
        <h2
          id="inaugurazione"
          className="font-serif text-4xl leading-[1.05] font-normal text-white md:text-6xl"
        >
          {inaugurazione.titolo}
        </h2>

        <ul className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {dettagli.map(({ icona: Icona, etichetta }) => (
            <li
              key={etichetta}
              className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-5 py-3 text-[0.95rem] font-medium ring-1 ring-white/15"
            >
              <Icona size={18} className="shrink-0 text-orchid-300" aria-hidden />
              {etichetta}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-xl leading-relaxed text-navy-100">
          Vi aspettiamo per visitare i nuovi spazi, conoscere il team e brindare insieme. Si entra
          liberamente, senza appuntamento.
        </p>

        {indirizzo ? (
          <a
            href={directionsUrl(settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex max-w-full items-center gap-2 rounded-full bg-white py-1.5 pr-1.5 pl-4 text-[0.85rem] font-medium text-navy-800 shadow-lift transition-shadow sm:text-sm"
          >
            <MapPin size={16} className="shrink-0 text-orchid-500" aria-hidden />
            {/* Sul telefono solo la via: con città e CAP la pillola verrebbe troncata */}
            <span className="min-w-0">
              {settings.address?.street}
              <span className="hidden sm:inline">
                , {settings.address?.postalCode} {settings.address?.city}
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-navy-800 px-3 py-1.5 text-[0.78rem] font-semibold text-white transition-colors group-hover:bg-navy-700">
              Come arrivare
              <ArrowUpRight size={13} aria-hidden />
            </span>
          </a>
        ) : null}
      </Container>
    </section>
  )
}
