'use server'

import { headers } from 'next/headers'

import { CV_MIME_TYPES, MAX_CV_BYTES } from '@/collections/ApplicationFiles'
import { getPayloadClient } from '@/lib/data'
import { labelFor, roleOptions } from '@/lib/job-options'
import { type JobErrors, type JobValues, readJobForm, validateJob } from '@/lib/job-validation'
import { rateLimit } from '@/lib/rate-limit'
import { slugify } from '@/lib/utils'
import type { JobApplication } from '@/payload-types'

export type JobState =
  | { status: 'idle' }
  | { status: 'success'; name: string }
  | { status: 'error'; message: string; errors?: JobErrors; values?: JobValues }

const MIN_FILL_MS = 2500

const EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

/** Legge e controlla il curriculum allegato. */
async function readCv(formData: FormData) {
  const file = formData.get('cv')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Allega il tuo curriculum in PDF o Word.' as const }
  }
  if (file.size > MAX_CV_BYTES) {
    return { error: 'Il file supera i 5 MB. Comprimilo o invia un PDF più leggero.' as const }
  }
  if (!CV_MIME_TYPES.includes(file.type)) {
    return { error: 'Formato non accettato: allega un PDF oppure un documento Word.' as const }
  }
  return {
    data: Buffer.from(await file.arrayBuffer()),
    mimetype: file.type,
    extension: EXTENSIONS[file.type] ?? 'pdf',
  }
}

/** Riceve la candidatura con il curriculum, la salva e invia le email. */
export async function submitApplication(_prev: JobState, formData: FormData): Promise<JobState> {
  const values = readJobForm(formData)
  const done = (): JobState => ({ status: 'success', name: values.name.split(' ')[0] })

  // Anti-spam 1: campo nascosto che solo i bot compilano
  if (String(formData.get('website') ?? '') !== '') return done()

  // Anti-spam 2: invio troppo rapido dopo il caricamento della pagina
  const startedAt = Number(formData.get('startedAt'))
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) return done()

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
  const cv = await readCv(formData)
  if ('error' in cv) errors.cv = cv.error
  if (Object.keys(errors).length || 'error' in cv) {
    return { status: 'error', message: 'Controlla i campi evidenziati.', errors, values }
  }

  try {
    const payload = await getPayloadClient()
    const roleLabel =
      values.role === 'altro' ? values.roleOther : labelFor(roleOptions, values.role)

    // Nome del file costruito da noi: non si usa mai quello scelto da chi carica
    const nomeFile = `${slugify(values.name).slice(0, 50) || 'candidato'}-cv.${cv.extension}`
    const fileDoc = await payload.create({
      collection: 'application-files',
      overrideAccess: true,
      file: {
        data: cv.data,
        mimetype: cv.mimetype,
        name: nomeFile,
        size: cv.data.length,
      },
      data: { candidateName: values.name },
    })

    await payload.create({
      collection: 'job-applications',
      overrideAccess: true,
      data: {
        status: 'nuova',
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        role: values.role as JobApplication['role'],
        roleLabel,
        collaboration: (values.collaboration || undefined) as JobApplication['collaboration'],
        availability: (values.availability || undefined) as JobApplication['availability'],
        cv: fileDoc.id,
        message: values.message,
        consent: values.consent,
      },
    })

    return done()
  } catch (error) {
    console.error('Errore salvataggio candidatura', error)
    // Payload controlla che il file sia davvero del tipo dichiarato: senza questo messaggio
    // un PDF danneggiato risulterebbe un generico "problema tecnico".
    const testo = error instanceof Error ? error.message : String(error)
    if (/file/i.test(testo) && /invalid|valid/i.test(testo)) {
      return {
        status: 'error',
        message: 'Controlla i campi evidenziati.',
        errors: {
          cv: 'Il file non è leggibile: riesportalo in PDF oppure allega un documento Word.',
        },
        values,
      }
    }
    return {
      status: 'error',
      message: 'Si è verificato un problema tecnico. Riprova oppure scrivici direttamente.',
      values,
    }
  }
}
