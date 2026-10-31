import React from 'react'

import { groupedHours, type OpeningHoursLike } from '@/lib/settings-helpers'
import { cn } from '@/lib/utils'

/** Tabella orari raggruppata ("Lunedì – Venerdì · 08:00–19:00"). */
export function HoursList({
  hours,
  className,
  invert = false,
}: {
  hours: OpeningHoursLike
  className?: string
  invert?: boolean
}) {
  const rows = groupedHours(hours)
  if (!rows.some((r) => r.value !== 'Chiuso')) return null
  return (
    <dl className={cn('space-y-2 text-[0.95rem]', className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-6">
          <dt className={invert ? 'text-petrol-100' : 'text-muted'}>{row.label}</dt>
          <dd
            className={cn(
              'text-right font-medium tabular-nums',
              row.value === 'Chiuso'
                ? invert
                  ? 'text-petrol-300'
                  : 'text-muted'
                : invert
                  ? 'text-white'
                  : 'text-petrol-950',
            )}
          >
            {row.value.split(', ').map((slot) => (
              <span key={slot} className="block whitespace-nowrap">
                {slot.replaceAll('–', ' – ')}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}
