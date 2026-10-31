import { Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { OpenStatus } from '@/components/ui/OpenStatus'
import { formatAddress, mapsUrl } from '@/lib/settings-helpers'
import type { Setting } from '@/payload-types'

/** Barra informativa sottile in cima (desktop): sede, stato apertura, email, avvisi. */
export function TopBar({ settings }: { settings: Setting }) {
  const announcement =
    settings.announcement?.enabled && settings.announcement.text ? settings.announcement : null
  return (
    <>
      {announcement ? (
        <div className="bg-orchid-100 px-5 py-2.5 text-center text-sm text-navy-950">
          {announcement.url ? (
            <Link href={announcement.url} className="underline-offset-4 hover:underline">
              {announcement.text}
            </Link>
          ) : (
            announcement.text
          )}
        </div>
      ) : null}
      <div className="hidden bg-navy-900 text-[0.8rem] text-navy-100 md:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <a
              href={mapsUrl(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-white"
            >
              <MapPin size={14} aria-hidden /> {formatAddress(settings.address)}
            </a>
            <OpenStatus hours={settings.openingHours} />
          </div>
          <a
            href={`mailto:${settings.email}`}
            className="inline-flex items-center gap-2 hover:text-white"
          >
            <Mail size={14} aria-hidden /> {settings.email}
          </a>
        </div>
      </div>
    </>
  )
}
