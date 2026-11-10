import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { authenticated, isAdmin } from '@/access'
import { clinicNotificationEmail, patientConfirmationEmail } from '@/emails/booking'
import { dayOptions, statusOptions, timeOptions } from '@/lib/booking-options'
import {
  annota,
  esitoInvio,
  motivo,
  nonInviata,
  postaConfigurata,
  SENZA_DESTINATARI,
  SENZA_POSTA,
} from '@/lib/notifiche'
import { formatAddress } from '@/lib/settings-helpers'
import { getServerUrl } from '@/lib/utils'

/** Invia le email (allo studio e al paziente) quando arriva una nuova richiesta. */
const sendBookingEmails: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create' || req.context?.skipEmails) return doc

  const settings = await req.payload.findGlobal({ slug: 'settings', req, depth: 0 })
  const recipients = (settings.bookingEmails || settings.email || 'info@lilycare.ch')
    .split(/[,;\s]+/)
    .filter(Boolean)

  const clinic = {
    clinicName: settings.clinicName || 'LilyCare',
    phone: settings.phone,
    email: settings.email,
    address: formatAddress(settings.address),
    siteUrl: getServerUrl(),
    adminUrl: `${getServerUrl()}/admin/collections/booking-requests/${doc.id}`,
  }

  const data = {
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    serviceLabel: doc.serviceLabel,
    professionalLabel: doc.professionalLabel,
    preferredDays: doc.preferredDays,
    preferredTime: doc.preferredTime,
    message: doc.message,
  }

  // L'esito viene annotato sulla richiesta: un invio fallito non deve passare inosservato
  let esito: string
  if (!recipients.length) {
    esito = nonInviata(SENZA_DESTINATARI)
  } else if (!postaConfigurata()) {
    esito = nonInviata(SENZA_POSTA)
  } else {
    try {
      const toClinic = clinicNotificationEmail(data, clinic)
      const info = await req.payload.sendEmail({
        to: recipients,
        replyTo: doc.email,
        subject: toClinic.subject,
        html: toClinic.html,
        text: toClinic.text,
      })
      esito = esitoInvio(info, recipients)
    } catch (error) {
      req.payload.logger.error({ err: error, msg: 'Invio email allo studio non riuscito' })
      esito = nonInviata(motivo(error))
    }
  }
  await annota(req, 'booking-requests', doc.id, esito)

  try {
    const toPatient = patientConfirmationEmail(data, clinic, settings.responseTimeText)
    await req.payload.sendEmail({
      to: doc.email,
      replyTo: settings.email || undefined,
      subject: toPatient.subject,
      html: toPatient.html,
      text: toPatient.text,
    })
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: 'Invio email di conferma al paziente non riuscito',
    })
  }

  return doc
}

export const BookingRequests: CollectionConfig = {
  slug: 'booking-requests',
  labels: { singular: 'Richiesta di appuntamento', plural: 'Richieste di appuntamento' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'serviceLabel', 'status', 'notifica', 'createdAt'],
    group: 'Prenotazioni',
    description:
      'Richieste inviate dal modulo "Prenota una visita". Ogni richiesta arriva anche via email. Aggiorna lo stato dopo aver contattato il paziente.',
    listSearchableFields: ['name', 'email', 'phone'],
  },
  defaultSort: '-createdAt',
  access: {
    // Le richieste dal sito vengono create dal server (con controlli anti-spam), mai dall'API pubblica.
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
      options: statusOptions.map((o) => ({ ...o })),
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
        { name: 'phone', label: 'Telefono', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'service', label: 'Servizio', type: 'relationship', relationTo: 'services' },
        {
          name: 'professional',
          label: 'Professionista preferito',
          type: 'relationship',
          relationTo: 'team',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'serviceLabel',
          label: 'Prestazione richiesta',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'professionalLabel',
          label: 'Preferenza professionista',
          type: 'text',
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'preferredDays',
          label: 'Giorni preferiti',
          type: 'select',
          hasMany: true,
          options: dayOptions.map((o) => ({ ...o })),
        },
        {
          name: 'preferredTime',
          label: 'Fascia oraria',
          type: 'select',
          options: timeOptions.map((o) => ({ ...o })),
        },
      ],
    },
    { name: 'message', label: 'Messaggio', type: 'textarea' },
    {
      name: 'notifica',
      label: 'Avviso allo studio',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Se qui c’è scritto “NON inviata”, nessuno in studio ha ricevuto l’email.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'consent',
          label: 'Consenso al trattamento dei dati',
          type: 'checkbox',
          admin: { readOnly: true },
        },
        {
          name: 'sourcePage',
          label: 'Pagina di provenienza',
          type: 'text',
          admin: { readOnly: true },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [sendBookingEmails],
  },
  timestamps: true,
}
