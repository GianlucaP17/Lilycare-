/** Opzioni condivise tra modulo di prenotazione, pannello admin ed email. */
export const dayOptions = [
  { label: 'Lunedì', value: 'lun' },
  { label: 'Martedì', value: 'mar' },
  { label: 'Mercoledì', value: 'mer' },
  { label: 'Giovedì', value: 'gio' },
  { label: 'Venerdì', value: 'ven' },
  { label: 'Sabato', value: 'sab' },
] as const

export const timeOptions = [
  { label: 'Mattina', value: 'mattina' },
  { label: 'Pomeriggio', value: 'pomeriggio' },
  { label: 'Indifferente', value: 'indifferente' },
] as const

export const statusOptions = [
  { label: '🟢 Nuova', value: 'nuova' },
  { label: '🟡 In lavorazione', value: 'in-lavorazione' },
  { label: '✅ Appuntamento fissato', value: 'confermata' },
  { label: '⚪ Archiviata', value: 'archiviata' },
] as const

export const labelFor = (
  options: ReadonlyArray<{ label: string; value: string }>,
  value?: string | null,
) => options.find((o) => o.value === value)?.label ?? value ?? ''
