import type { SelectField } from 'payload'

/** Icone disponibili per servizi e punti di forza. Le chiavi corrispondono a src/components/icons. */
export const iconOptions = [
  { label: 'Radiografia (osso)', value: 'xray' },
  { label: 'Ecografia (sonda)', value: 'ultrasound' },
  { label: 'Ecodoppler (flusso)', value: 'doppler' },
  { label: 'Ozono (molecola)', value: 'ozone' },
  { label: 'Infiltrazione (siringa)', value: 'syringe' },
  { label: 'Onde d’urto', value: 'shockwave' },
  { label: 'Infermieristica (cuore)', value: 'nursing' },
  { label: 'Agopuntura (ago)', value: 'acupuncture' },
  { label: 'Estetica (fiore)', value: 'aesthetic' },
  { label: 'Stetoscopio', value: 'stethoscope' },
  { label: 'Scudo / sicurezza', value: 'shield' },
  { label: 'Persone', value: 'users' },
  { label: 'Calendario', value: 'calendar' },
  { label: 'Orologio', value: 'clock' },
  { label: 'Posizione', value: 'pin' },
  { label: 'Cuore', value: 'heart' },
  { label: 'Foglia', value: 'leaf' },
  { label: 'Scintille', value: 'sparkles' },
  { label: 'Percorso', value: 'route' },
  { label: 'Auto', value: 'car' },
  { label: 'Treno', value: 'train' },
  { label: 'Autobus', value: 'bus' },
  { label: 'Parcheggio', value: 'parking' },
  { label: 'Accessibilità', value: 'accessibility' },
] as const

export type IconName = (typeof iconOptions)[number]['value']

export const iconField = (overrides: Partial<SelectField> = {}): SelectField =>
  ({
    name: 'icon',
    label: 'Icona',
    type: 'select',
    options: iconOptions.map((o) => ({ label: o.label, value: o.value })),
    ...overrides,
  }) as SelectField
