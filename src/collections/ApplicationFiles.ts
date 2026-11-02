import path from 'path'
import type { CollectionConfig } from 'payload'

import { authenticated, isAdmin } from '@/access'

/** Dimensione massima di un curriculum. */
export const MAX_CV_BYTES = 5 * 1024 * 1024

export const CV_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

/**
 * Cartella dei curriculum, accanto a quella delle immagini e fuori dall'applicazione,
 * così gli aggiornamenti del sito non la toccano.
 */
export const applicationFilesDir =
  process.env.APPLICATIONS_DIR ||
  path.resolve(process.env.MEDIA_DIR || 'media', '..', 'candidature')

/**
 * Curriculum allegati alle candidature.
 *
 * Sono documenti personali di terzi: la lettura è riservata a chi ha accesso al pannello
 * (Payload applica il controllo degli accessi anche allo scaricamento del file, quindi
 * l'indirizzo diretto non è pubblico) e vengono cancellati automaticamente dopo 30 giorni
 * insieme alla candidatura.
 */
export const ApplicationFiles: CollectionConfig = {
  slug: 'application-files',
  labels: { singular: 'Curriculum', plural: 'Curriculum ricevuti' },
  admin: {
    group: 'Sistema',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'createdAt'],
    description:
      'Curriculum allegati alle candidature. Non sono raggiungibili dal sito pubblico e vengono cancellati automaticamente dopo 30 giorni.',
  },
  access: {
    // Caricati dal server quando arriva una candidatura, mai dall'API pubblica.
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: isAdmin,
  },
  upload: {
    staticDir: applicationFilesDir,
    mimeTypes: CV_MIME_TYPES,
    // Il limite di dimensione è applicato nell'azione del modulo (MAX_CV_BYTES): è l'unica
    // via d'ingresso pubblica, perché la creazione diretta dall'API richiede l'accesso.
    disableLocalStorage: false,
  },
  fields: [
    {
      name: 'candidateName',
      label: 'Candidato',
      type: 'text',
      admin: { description: 'Compilato automaticamente, per ritrovare il file.' },
    },
  ],
  timestamps: true,
}
