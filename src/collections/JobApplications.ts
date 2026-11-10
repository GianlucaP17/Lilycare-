import path from 'path'
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { authenticated, isAdmin } from '@/access'
import { applicationFilesDir } from '@/collections/ApplicationFiles'
import { candidateConfirmationEmail, clinicApplicationEmail } from '@/emails/job-application'
import {
  applicationStatusOptions,
  availabilityOptions,
  collaborationOptions,
  roleOptions,
} from '@/lib/job-options'
import { formatAddress } from '@/lib/settings-helpers'
import { getServerUrl } from '@/lib/utils'

/** Avvisa lo studio e conferma al candidato quando arriva una candidatura. */
const sendApplicationEmails: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create' || req.context?.skipEmails) return doc

  const settings = await req.payload.findGlobal({ slug: 'settings', req, depth: 0 })
  const recipients = (settings.jobEmails || settings.bookingEmails || settings.email || '')
    .split(/[,;\s]+/)
    .filter(Boolean)

  const clinic = {
    clinicName: settings.clinicName || 'LilyCare',
    phone: settings.phone,
    email: settings.email,
    address: formatAddress(settings.address),
    siteUrl: getServerUrl(),
    adminUrl: `${getServerUrl()}/admin/collections/job-applications/${doc.id}`,
  }
  // Il curriculum viene allegato all'email: così la casella dello studio ha tutto,
  // anche dopo che il sito avrà cancellato il file.
  const cv =
    typeof doc.cv === 'object' && doc.cv
      ? doc.cv
      : doc.cv
        ? await req.payload
            .findByID({ collection: 'application-files', id: doc.cv, req, depth: 0 })
            .catch(() => null)
        : null
  const allegati =
    cv?.filename && typeof cv.filename === 'string'
      ? [{ filename: cv.filename, path: path.join(applicationFilesDir, cv.filename) }]
      : undefined

  const data = {
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    roleLabel: doc.roleLabel,
    collaboration: doc.collaboration,
    availability: doc.availability,
    message: doc.message,
    cvFilename: cv?.filename ?? null,
  }

  if (recipients.length) {
    try {
      const toClinic = clinicApplicationEmail(data, clinic)
      await req.payload.sendEmail({
        to: recipients,
        replyTo: doc.email,
        subject: toClinic.subject,
        html: toClinic.html,
        text: toClinic.text,
        attachments: allegati,
      })
    } catch (error) {
      req.payload.logger.error({ err: error, msg: 'Invio candidatura allo studio non riuscito' })
    }
  }

  try {
    const toCandidate = candidateConfirmationEmail(data, clinic)
    await req.payload.sendEmail({
      to: doc.email,
      replyTo: settings.email || undefined,
      subject: toCandidate.subject,
      html: toCandidate.html,
      text: toCandidate.text,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Conferma al candidato non riuscita' })
  }

  return doc
}

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: { singular: 'Candidatura', plural: 'Candidature' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'roleLabel', 'status', 'createdAt'],
    group: 'Prenotazioni',
    description:
      'Candidature inviate dalla pagina “Lavora con noi”, con il curriculum allegato. Candidature e curriculum vengono cancellati automaticamente dopo 30 giorni, come indicato nell’informativa privacy.',
    listSearchableFields: ['name', 'email', 'roleLabel'],
  },
  defaultSort: '-createdAt',
  access: {
    // Create solo dal server (con i controlli anti-spam dell'azione del modulo).
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'status',
      label: 'Stato',
      type: 'select',
      defaultValue: 'nuova',
      required: true,
      options: applicationStatusOptions.map((o) => ({ ...o })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      label: 'Note interne',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Visibili solo allo staff.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nome e cognome', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Telefono', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          label: 'Profilo',
          type: 'select',
          options: roleOptions.map((o) => ({ ...o })),
        },
        {
          name: 'roleLabel',
          label: 'Profilo (testo)',
          type: 'text',
          admin: { description: 'Quello che ha indicato il candidato.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'collaboration',
          label: 'Collaborazione',
          type: 'select',
          options: collaborationOptions.map((o) => ({ ...o })),
        },
        {
          name: 'availability',
          label: 'Disponibilità',
          type: 'select',
          options: availabilityOptions.map((o) => ({ ...o })),
        },
      ],
    },
    {
      // Il collegamento sul nome del file, generato da Payload, viene rifiutato da alcuni
      // browser (vedi src/app/(frontend)/next/candidature/[id]/cv/route.ts): questo no.
      name: 'cvApri',
      type: 'ui',
      label: 'Curriculum',
      admin: { components: { Field: '/components/admin/CvLink#CvLink' } },
    },
    {
      name: 'cv',
      label: 'File allegato',
      type: 'upload',
      relationTo: 'application-files',
      admin: {
        description:
          'Allegato dal candidato. Per leggerlo usa il pulsante qui sopra. Viene cancellato insieme alla candidatura dopo 30 giorni.',
      },
    },
    { name: 'message', label: 'Presentazione', type: 'textarea' },
    {
      name: 'consent',
      label: 'Consenso al trattamento dei dati',
      type: 'checkbox',
      admin: { readOnly: true },
    },
  ],
  hooks: { afterChange: [sendApplicationEmails] },
  timestamps: true,
}
