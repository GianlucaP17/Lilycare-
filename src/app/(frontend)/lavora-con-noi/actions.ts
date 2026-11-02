'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/data'
import { labelFor, roleOptions } from '@/lib/job-options'
import { type JobErrors, type JobValues, readJobForm, validateJob } from '@/lib/job-validation'
import { rateLimit } from '@/lib/rate-limit'
import type { JobApplication } from '@/payload-types'

export type JobState =
  | { status: 'idle' }
  | { status: 'success'; name: string; cvEmail: string }
  | { status: 'error'; message: string; errors?: JobErrors; values?: JobValues }

const MIN_FILL_MS = 2500

/** Riceve la candidatura, la salva nel pannello e invia le email. */
export async function submitApplication(_prev: JobState, formData: FormData): Promise<JobState> {
  const values = readJobForm(formData)
  const done = (cvEmail: string): JobState => ({
    status: 'success',
    name: values.name.split(' ')[0],
    cvEmail,
  })

  // Anti-spam 1: campo nascosto che solo i bot compilano
  if (String(formData.get('website') ?? '') !== '') return done('info@lilycare.ch')

  // Anti-spam 2: invio troppo rapido dopo il caricamento della pagina
  const startedAt = Number(formData.get('startedAt'))
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return done('info@lilycare.ch')
  }

  // Anti-spam 3: limite di invii per indirizzo IP
  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? 'unknown').split(',')[0].trim()
  if (!rateLimit(`candidatura:${ip}`)) {
    return {
      status: 'error',
      message: 'Hai inviato troppe candidature in poco tempo. Riprova fra qualche minuto.',
      values,
    }
  }

  const errors = validateJob(values)
  if (Object.keys(errors).length) {
    return { status: 'error', message: 'Controlla i campi evidenziati.', errors, values }
  }

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })

    await payload.create({
      collection: 'job-applications',
      overrideAccess: true,
      data: {
        status: 'nuova',
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        role: values.role as JobApplication['role'],
        roleLabel: values.role === 'altro' ? values.roleOther : labelFor(roleOptions, values.role),
        collaboration: (values.collaboration || undefined) as JobApplication['collaboration'],
        availability: (values.availability || undefined) as JobApplication['availability'],
        message: values.message,
        consent: values.consent,
      },
    })

    return done(settings.email || 'info@lilycare.ch')
  } catch (error) {
    console.error('Errore salvataggio candidatura', error)
    return {
      status: 'error',
      message: 'Si è verificato un problema tecnico. Riprova oppure scrivici direttamente.',
      values,
    }
  }
}
