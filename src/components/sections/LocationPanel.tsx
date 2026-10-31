import { Mail, MapPin, Navigation, Phone } from 'lucide-react'
import React from 'react'

import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { HoursList } from '@/components/ui/HoursList'
import { OpenStatus } from '@/components/ui/OpenStatus'
import { directionsUrl, formatAddress, mapEmbedUrl, mapsUrl } from '@/lib/settings-helpers'
import { cn, toTelHref } from '@/lib/utils'
import type { Setting } from '@/payload-types'

import { MapEmbed } from './MapEmbed'

/** Dove siamo: indirizzo, telefono, email, orari, mappa e indicazioni. */
export function LocationPanel({
  settings,
  showMap = true,
  showDirections = false,
  className,
}: {
  settings: Setting
  showMap?: boolean
  showDirections?: boolean
  className?: string
}) {
  const address = formatAddress(settings.address)
  return (
    <div className={cn('grid gap-6 lg:grid-cols-12', className)}>
      <div
        className={cn(
          'rounded-3xl bg-white p-8 ring-1 ring-line md:p-10',
          showMap ? 'lg:col-span-5' : 'lg:col-span-12',
        )}
      >
        <ul className="space-y-6">
          <li className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700">
              <MapPin size={20} aria-hidden />
            </span>
            <div>
              <p className="text-sm text-muted">Indirizzo</p>
              <p className="mt-0.5 text-lg font-medium text-petrol-950">
                {settings.address?.street}
                <br />
                {settings.address?.postalCode} {settings.address?.city} (
                {settings.address?.region || 'Ticino'})
              </p>
              {settings.address?.addressNote ? (
                <p className="mt-1 text-sm text-muted">{settings.address.addressNote}</p>
              ) : null}
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700">
              <Phone size={20} aria-hidden />
            </span>
            <div>
              <p className="text-sm text-muted">Telefono</p>
              <a
                href={toTelHref(settings.phone)}
                className="mt-0.5 block text-lg font-medium text-petrol-950 hover:text-petrol-700"
              >
                {settings.phone}
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700">
              <Mail size={20} aria-hidden />
            </span>
            <div>
              <p className="text-sm text-muted">Email</p>
              <a
                href={`mailto:${settings.email}`}
                className="mt-0.5 block text-lg font-medium text-petrol-950 hover:text-petrol-700"
              >
                {settings.email}
              </a>
            </div>
          </li>
        </ul>

        <div className="mt-8 border-t border-line pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="font-serif text-xl text-petrol-950">Orari</p>
            <OpenStatus hours={settings.openingHours} className="text-sm text-muted" />
          </div>
          <HoursList hours={settings.openingHours} />
          {settings.hoursNote ? (
            <p className="mt-4 text-sm text-muted">{settings.hoursNote}</p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={directionsUrl(settings)} size="md">
            <Navigation size={17} aria-hidden /> Indicazioni stradali
          </Button>
          <Button href={mapsUrl(settings)} variant="secondary" size="md">
            Apri in Google Maps
          </Button>
        </div>
      </div>

      {showMap ? (
        <MapEmbed
          embedUrl={mapEmbedUrl(settings)}
          label={settings.clinicName}
          address={address}
          className="min-h-[26rem] lg:col-span-7 lg:min-h-full"
        />
      ) : null}

      {showDirections && settings.directions?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4">
          {settings.directions.map((d) => (
            <div key={d.id ?? d.title} className="rounded-3xl bg-white p-6 ring-1 ring-line">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-50 text-blush-700">
                <Icon name={d.icon} size={20} />
              </span>
              <p className="mt-4 font-serif text-xl text-petrol-950">{d.title}</p>
              <p className="mt-2 leading-relaxed text-muted">{d.text}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
