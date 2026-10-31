import { CalendarCheck, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { toTelHref } from '@/lib/utils'

/** Barra fissa in basso su smartphone: chiamare o prenotare è sempre a un tocco. */
export function MobileActionBar({
  phone,
  whatsapp,
}: {
  phone?: string | null
  whatsapp?: string | null
}) {
  const wa = whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}` : null
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="flex gap-2">
        {phone ? (
          <a
            href={toTelHref(phone)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white font-medium text-navy-900 ring-1 ring-line"
          >
            <Phone size={18} aria-hidden /> Chiama
          </a>
        ) : null}
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Scrivici su WhatsApp"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-900 ring-1 ring-line"
          >
            <MessageCircle size={20} aria-hidden />
          </a>
        ) : null}
        <Link
          href="/prenota"
          className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-full bg-navy-800 font-medium text-white"
        >
          <CalendarCheck size={18} aria-hidden /> Prenota
        </Link>
      </div>
    </div>
  )
}
