import { dayOptions, timeOptions } from './booking-options'

export type BookingValues = {
  name: string
  phone: string
  email: string
  service: string
  professional: string
  preferredDays: string[]
  preferredTime: string
  message: string
  consent: boolean
}

export type BookingErrors = Partial<Record<keyof BookingValues, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\d\s./-]{6,25}$/

export function readBookingForm(formData: FormData): BookingValues {
  const str = (key: string) => String(formData.get(key) ?? '').trim()
  return {
    name: str('name').slice(0, 120),
    phone: str('phone').slice(0, 30),
    email: str('email').slice(0, 160).toLowerCase(),
    service: str('service').slice(0, 120),
    professional: str('professional').slice(0, 120),
    preferredDays: formData
      .getAll('preferredDays')
      .map(String)
      .filter((d) => dayOptions.some((o) => o.value === d)),
    preferredTime: timeOptions.some((o) => o.value === str('preferredTime'))
      ? str('preferredTime')
      : '',
    message: str('message').slice(0, 2000),
    consent: formData.get('consent') === 'on',
  }
}

export function validateBooking(values: BookingValues): BookingErrors {
  const errors: BookingErrors = {}
  if (values.name.length < 3 || !/\s/.test(values.name)) errors.name = 'Inserisci nome e cognome.'
  if (!PHONE.test(values.phone) || values.phone.replace(/\D/g, '').length < 6)
    errors.phone = 'Inserisci un numero di telefono valido.'
  if (!EMAIL.test(values.email)) errors.email = 'Inserisci un indirizzo email valido.'
  if (!values.consent) errors.consent = 'Per inviare la richiesta è necessario il consenso.'
  return errors
}
