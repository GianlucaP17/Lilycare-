import { CalendarCheck, Phone } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/Button'
import { OpenStatus } from '@/components/ui/OpenStatus'
import { formatAddress } from '@/lib/settings-helpers'
import { toTelHref } from '@/lib/utils'
import type { Setting } from '@/payload-types'

/** Riquadro laterale per prenotare/chiamare, presente su servizi e profili. */
export function BookingAside({
  settings,
  bookingUrl,
  title = 'Prenota una visita',
  text = 'Invia una richiesta online: ti ricontattiamo per fissare data e ora.',
}: {
  settings: Setting
  bookingUrl: string
  title?: string
  text?: string
}) {
  return (
    <div className="rounded-3xl bg-navy-900 p-7 text-navy-50">
      <p className="font-serif text-2xl text-white">{title}</p>
      <p className="mt-2 leading-relaxed text-navy-100">{text}</p>
      <div className="mt-6 space-y-2.5">
        <Button href={bookingUrl} variant="light" className="w-full">
          <CalendarCheck size={18} aria-hidden /> Richiedi appuntamento
        </Button>
        <Button
          href={toTelHref(settings.phone)}
          variant="ghost"
          className="w-full text-white ring-1 ring-navy-600 hover:bg-navy-800"
        >
          <Phone size={18} aria-hidden /> {settings.phone}
        </Button>
      </div>
      <div className="mt-6 space-y-1 border-t border-navy-700 pt-5 text-sm text-navy-200">
        <OpenStatus hours={settings.openingHours} />
        <p>{formatAddress(settings.address)}</p>
      </div>
    </div>
  )
}
