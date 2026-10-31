/** Funzioni di supporto per indirizzo, mappe e orari (usate da sito, email e dati strutturati). */

export type AddressLike =
  | {
      street?: string | null
      addressNote?: string | null
      postalCode?: string | null
      city?: string | null
      region?: string | null
      country?: string | null
    }
  | null
  | undefined

export type OpeningHoursLike =
  | Array<{ days?: string[] | null; opens?: string | null; closes?: string | null }>
  | null
  | undefined

export const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type DayKey = (typeof DAY_ORDER)[number]

export const DAY_LABELS: Record<DayKey, { long: string; short: string; schema: string }> = {
  mon: { long: 'Lunedì', short: 'Lun', schema: 'Monday' },
  tue: { long: 'Martedì', short: 'Mar', schema: 'Tuesday' },
  wed: { long: 'Mercoledì', short: 'Mer', schema: 'Wednesday' },
  thu: { long: 'Giovedì', short: 'Gio', schema: 'Thursday' },
  fri: { long: 'Venerdì', short: 'Ven', schema: 'Friday' },
  sat: { long: 'Sabato', short: 'Sab', schema: 'Saturday' },
  sun: { long: 'Domenica', short: 'Dom', schema: 'Sunday' },
}

/** "Via Monte Generoso 2, 6877 Coldrerio" */
export function formatAddress(address: AddressLike, withNote = false): string {
  if (!address) return ''
  const street = [address.street, withNote ? address.addressNote : null].filter(Boolean).join(' – ')
  const city = [address.postalCode, address.city].filter(Boolean).join(' ')
  return [street, city].filter(Boolean).join(', ')
}

/** Link per aprire lo studio su Google Maps (scheda ufficiale se disponibile). */
export function mapsUrl(settings: {
  googleMapsUrl?: string | null
  clinicName?: string | null
  address?: AddressLike
}): string {
  if (settings.googleMapsUrl) return settings.googleMapsUrl
  const query = [settings.clinicName, formatAddress(settings.address)].filter(Boolean).join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/** Link "Indicazioni stradali" (Google Maps, navigazione dalla posizione attuale). */
export function directionsUrl(settings: {
  address?: AddressLike
  geo?: { lat?: number | null; lng?: number | null } | null
}): string {
  const destination =
    settings.geo?.lat && settings.geo?.lng
      ? `${settings.geo.lat},${settings.geo.lng}`
      : formatAddress(settings.address)
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

/** URL per la mappa incorporata (caricata solo dopo il consenso del visitatore). */
export function mapEmbedUrl(settings: {
  clinicName?: string | null
  address?: AddressLike
  geo?: { lat?: number | null; lng?: number | null } | null
}): string {
  const q =
    settings.geo?.lat && settings.geo?.lng
      ? `${settings.geo.lat},${settings.geo.lng}`
      : [settings.clinicName, formatAddress(settings.address)].filter(Boolean).join(', ')
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&hl=it&output=embed`
}

/** Fasce orarie per ciascun giorno della settimana. */
export function hoursByDay(hours: OpeningHoursLike): Record<DayKey, string[]> {
  const result = Object.fromEntries(DAY_ORDER.map((d) => [d, [] as string[]])) as Record<
    DayKey,
    string[]
  >
  for (const slot of hours ?? []) {
    if (!slot?.opens || !slot?.closes) continue
    for (const day of slot.days ?? []) {
      if (day in result) result[day as DayKey].push(`${slot.opens}–${slot.closes}`)
    }
  }
  for (const day of DAY_ORDER) result[day].sort()
  return result
}

export type HoursRow = { label: string; value: string; days: DayKey[] }

/** Raggruppa i giorni consecutivi con lo stesso orario: "Lunedì – Venerdì · 08:00–19:00". */
export function groupedHours(hours: OpeningHoursLike, short = false): HoursRow[] {
  const byDay = hoursByDay(hours)
  const rows: HoursRow[] = []
  for (const day of DAY_ORDER) {
    const value = byDay[day].length ? byDay[day].join(', ') : 'Chiuso'
    const last = rows[rows.length - 1]
    if (last && last.value === value) {
      last.days.push(day)
    } else {
      rows.push({ label: '', value, days: [day] })
    }
  }
  const name = (d: DayKey) => (short ? DAY_LABELS[d].short : DAY_LABELS[d].long)
  for (const row of rows) {
    const first = row.days[0]
    const lastDay = row.days[row.days.length - 1]
    row.label = row.days.length > 1 ? `${name(first)} – ${name(lastDay)}` : name(first)
  }
  return rows
}

/** Specifiche orarie per i dati strutturati schema.org. */
export function openingHoursSpecification(hours: OpeningHoursLike) {
  return (hours ?? [])
    .filter((slot) => slot?.opens && slot?.closes && slot.days?.length)
    .map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: (slot.days ?? [])
        .filter((d): d is DayKey => d in DAY_LABELS)
        .map((d) => `https://schema.org/${DAY_LABELS[d].schema}`),
      opens: slot.opens,
      closes: slot.closes,
    }))
}
