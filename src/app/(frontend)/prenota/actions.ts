'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/data'
import { rateLimit } from '@/lib/rate-limit'
import {
  type BookingErrors,
  type BookingValues,
  readBookingForm,
  validateBooking,
} from '@/lib/booking-validation'
import type { BookingRequest } from '@/payload-types'

export type BookingState =
  | { status: 'idle' }
  | { status: 'success'; name: string }
  | { status: 'error'; message: string; errors?: BookingErrors; values?: BookingValues }

const MIN_FILL_MS = 2500

/** Riceve la richiesta di appuntamento, la salva nel pannello admin e invia le email. */
export async function submitBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const values = readBookingForm(formData)

  // Anti-spam 1: campo nascosto che solo i bot compilano
  if (String(formData.get('website') ?? '') !== '') return { status: 'success', name: values.name }

  // Anti-spam 2: invio troppo rapido dopo il caricamento della pagina
  const startedAt = Number(formData.get('startedAt'))
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return { status: 'success', name: values.name }
  }

  // Anti-spam 3: limite di invii per indirizzo IP
  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? 'unknown').split(',')[0].trim()
  if (!rateLimit(`booking:${ip}`)) {
    return {
      status: 'error',
      message:
        'Hai inviato troppe richieste in poco tempo. Riprova tra qualche minuto oppure chiamaci.',
      values,
    }
  }

  const errors = validateBooking(values)
  if (Object.keys(errors).length) {
    return { status: 'error', message: 'Controlla i campi evidenziati.', errors, values }
  }

  try {
    const payload = await getPayloadClient()

    const [service, professional] = await Promise.all([
      values.service
        ? payload
            .find({
              collection: 'services',
              where: {
                and: [{ slug: { equals: values.service } }, { _status: { equals: 'published' } }],
              },
              limit: 1,
              depth: 0,
            })
            .then((r) => r.docs[0])
        : undefined,
      values.professional
        ? payload
            .find({
              collection: 'team',
              where: {
                and: [
                  { slug: { equals: values.professional } },
                  { _status: { equals: 'published' } },
                ],
              },
              limit: 1,
              depth: 0,
            })
            .then((r) => r.docs[0])
        : undefined,
    ])

    await payload.create({
      collection: 'booking-requests',
      overrideAccess: true,
      data: {
        status: 'nuova',
        name: values.name,
        phone: values.phone,
        email: values.email,
        service: service?.id,
        serviceLabel:
          service?.title ?? (values.service === 'altro' ? 'Altro / da definire' : undefined),
        professional: professional?.id,
        professionalLabel: professional
          ? [professional.prefix, professional.name].filter(Boolean).join(' ')
          : undefined,
        preferredDays: values.preferredDays as BookingRequest['preferredDays'],
        preferredTime: (values.preferredTime || undefined) as BookingRequest['preferredTime'],
        message: values.message || undefined,
        consent: values.consent,
        sourcePage: String(formData.get('sourcePage') ?? '').slice(0, 200) || '/prenota',
      },
    })

    return { status: 'success', name: values.name.split(' ')[0] }
  } catch (error) {
    console.error('Errore salvataggio richiesta di appuntamento', error)
    return {
      status: 'error',
      message:
        'Si è verificato un problema tecnico. Riprova o chiamaci direttamente: ti risponderemo volentieri.',
      values,
    }
  }
}
