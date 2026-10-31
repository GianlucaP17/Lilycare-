'use client'

import React, { useEffect, useState } from 'react'

import {
  DAY_LABELS,
  DAY_ORDER,
  type DayKey,
  hoursByDay,
  type OpeningHoursLike,
} from '@/lib/settings-helpers'
import { cn } from '@/lib/utils'

type Status = { open: boolean; text: string }

const zurichNow = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zurich',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const weekday = parts
    .find((p) => p.type === 'weekday')
    ?.value.toLowerCase()
    .slice(0, 3) as DayKey
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00'
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  return { day: weekday, time: `${hour === '24' ? '00' : hour}:${minute}` }
}

export function computeStatus(hours: OpeningHoursLike): Status | null {
  const byDay = hoursByDay(hours)
  if (!DAY_ORDER.some((d) => byDay[d].length)) return null
  const { day, time } = zurichNow()
  const today = byDay[day] ?? []
  for (const slot of today) {
    const [opens, closes] = slot.split('–')
    if (time >= opens && time < closes)
      return { open: true, text: `Aperto ora · fino alle ${closes}` }
  }
  const laterToday = today.map((s) => s.split('–')[0]).find((o) => o > time)
  if (laterToday) return { open: false, text: `Chiuso ora · apre alle ${laterToday}` }
  const start = DAY_ORDER.indexOf(day)
  for (let i = 1; i <= 7; i++) {
    const next = DAY_ORDER[(start + i) % 7]
    if (byDay[next].length) {
      const opens = byDay[next][0].split('–')[0]
      const when = i === 1 ? 'domani' : DAY_LABELS[next].long.toLowerCase()
      return { open: false, text: `Chiuso ora · riapre ${when} alle ${opens}` }
    }
  }
  return null
}

/** Indicatore "Aperto ora / Chiuso", calcolato sull'ora svizzera del visitatore. */
export function OpenStatus({ hours, className }: { hours: OpeningHoursLike; className?: string }) {
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    const update = () => setStatus(computeStatus(hours))
    update()
    const timer = setInterval(update, 60_000)
    return () => clearInterval(timer)
  }, [hours])

  if (!status) return <span className={cn('inline-block h-5', className)} aria-hidden />

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-2.5 w-2.5" aria-hidden>
        {status.open ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        ) : null}
        <span
          className={cn(
            'relative inline-flex h-2.5 w-2.5 rounded-full',
            status.open ? 'bg-emerald-500' : 'bg-orchid-500',
          )}
        />
      </span>
      {status.text}
    </span>
  )
}
