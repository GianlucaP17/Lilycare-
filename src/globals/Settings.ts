import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { iconField } from '@/fields/icon'
import { revalidateGlobal } from '@/hooks/revalidate'

export const dayValues = [
  { label: 'Lunedì', value: 'mon' },
  { label: 'Martedì', value: 'tue' },
  { label: 'Mercoledì', value: 'wed' },
  { label: 'Giovedì', value: 'thu' },
  { label: 'Venerdì', value: 'fri' },
  { label: 'Sabato', value: 'sat' },
  { label: 'Domenica', value: 'sun' },
]

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Impostazioni studio',
  admin: {
    group: 'Impostazioni',
    description:
      'Dati dello studio usati in tutto il sito (intestazione, piè di pagina, contatti, Google). Modificali qui una volta sola.',
  },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Studio',
          fields: [
            {
              name: 'clinicName',
              label: 'Nome',
              type: 'text',
              required: true,
              defaultValue: 'LilyCare',
            },
            {
              name: 'legalName',
              label: 'Ragione sociale (per note legali)',
              type: 'text',
              admin: { description: 'Es. "LilyCare Sagl". Facoltativo.' },
            },
            {
              name: 'tagline',
              label: 'Slogan breve',
              type: 'text',
              defaultValue: 'Centro medico a Coldrerio',
            },
            {
              name: 'description',
              label: 'Descrizione del centro (per Google e AI)',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Usata come descrizione predefinita del sito e nei dati strutturati. 150–160 caratteri ideali.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  label: 'Logo (su sfondo chiaro)',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'PNG trasparente o SVG. Se vuoto, si usa il logo grafico del sito.',
                  },
                },
                {
                  name: 'logoOnDark',
                  label: 'Logo (su sfondo scuro)',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'defaultOgImage',
              label: 'Immagine predefinita per condivisioni',
              type: 'upload',
              relationTo: 'media',
              admin: { description: '1200×630 px. Se vuota viene generata automaticamente.' },
            },
          ],
        },
        {
          label: 'Contatti e sede',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  label: 'Telefono principale',
                  type: 'text',
                  required: true,
                  admin: { description: 'Formato internazionale, es. +41 78 335 51 53' },
                },
                {
                  name: 'whatsapp',
                  label: 'WhatsApp (facoltativo)',
                  type: 'text',
                  admin: { description: 'Se compilato, appare il pulsante WhatsApp.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'email', label: 'Email pubblica', type: 'email', required: true },
                {
                  name: 'bookingEmails',
                  label: 'Email che ricevono le richieste',
                  type: 'text',
                  admin: {
                    description:
                      'Uno o più indirizzi separati da virgola. Se vuoto: email pubblica.',
                  },
                },
              ],
            },
            {
              name: 'address',
              label: 'Indirizzo',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'street', label: 'Via e numero', type: 'text', required: true },
                    {
                      name: 'addressNote',
                      label: 'Indicazione aggiuntiva',
                      type: 'text',
                      admin: { description: 'Es. "presso Polimedica, 1° piano".' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'postalCode', label: 'NPA', type: 'text', required: true },
                    { name: 'city', label: 'Località', type: 'text', required: true },
                    { name: 'region', label: 'Cantone', type: 'text', defaultValue: 'Ticino' },
                    { name: 'country', label: 'Paese (codice)', type: 'text', defaultValue: 'CH' },
                  ],
                },
              ],
            },
            {
              name: 'geo',
              label: 'Coordinate (facoltative, migliorano Google Maps)',
              type: 'group',
              admin: {
                description:
                  'Su Google Maps: clic destro sul punto esatto dello studio → copia i due numeri (es. 45.85, 8.98).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'lat', label: 'Latitudine', type: 'number' },
                    { name: 'lng', label: 'Longitudine', type: 'number' },
                  ],
                },
              ],
            },
            {
              name: 'googleMapsUrl',
              label: 'Link alla scheda Google Maps',
              type: 'text',
              admin: {
                description:
                  'Incolla il link "Condividi" della scheda Google dello studio. Se vuoto, si usa l’indirizzo.',
              },
            },
            {
              name: 'directions',
              label: 'Come arrivare',
              type: 'array',
              labels: { singular: 'Indicazione', plural: 'Indicazioni' },
              fields: [
                iconField({ defaultValue: 'car' }),
                { name: 'title', label: 'Titolo', type: 'text', required: true },
                { name: 'text', label: 'Testo', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Orari',
          fields: [
            {
              name: 'openingHours',
              label: 'Orari di apertura',
              type: 'array',
              labels: { singular: 'Fascia', plural: 'Fasce orarie' },
              admin: {
                description:
                  'Una riga per ogni fascia. Per una pausa pranzo crea due righe (es. 08:00–12:00 e 14:00–18:00). I giorni non indicati risultano chiusi.',
              },
              fields: [
                {
                  name: 'days',
                  label: 'Giorni',
                  type: 'select',
                  hasMany: true,
                  required: true,
                  options: dayValues,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'opens',
                      label: 'Apertura',
                      type: 'text',
                      required: true,
                      admin: { description: 'HH:MM' },
                    },
                    {
                      name: 'closes',
                      label: 'Chiusura',
                      type: 'text',
                      required: true,
                      admin: { description: 'HH:MM' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'hoursNote',
              label: 'Nota sugli orari',
              type: 'text',
              defaultValue: 'Visite su appuntamento',
            },
          ],
        },
        {
          label: 'Prenotazioni',
          fields: [
            {
              name: 'bookingIntro',
              label: 'Testo introduttivo della pagina "Prenota"',
              type: 'textarea',
            },
            {
              name: 'responseTimeText',
              label: 'Tempi di risposta',
              type: 'text',
              defaultValue:
                'Ti ricontatteremo al più presto per concordare data e ora della visita.',
              admin: { description: 'Mostrato dopo l’invio e nell’email di conferma al paziente.' },
            },
            {
              name: 'insuranceNote',
              label: 'Nota su casse malati e rimborsi',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Social, Google e avvisi',
          fields: [
            {
              name: 'socialLinks',
              label: 'Profili social e schede',
              type: 'array',
              admin: {
                description:
                  'Facebook, Instagram, LinkedIn, Google Business, OneDoc… Vengono collegati anche nei dati per Google e AI.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      label: 'Piattaforma',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Google Business', value: 'google' },
                        { label: 'OneDoc', value: 'onedoc' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'Altro', value: 'other' },
                      ],
                    },
                    { name: 'url', label: 'URL', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'googleSiteVerification',
                  label: 'Codice verifica Google Search Console',
                  type: 'text',
                },
                {
                  name: 'bingSiteVerification',
                  label: 'Codice verifica Bing Webmaster',
                  type: 'text',
                },
              ],
            },
            {
              name: 'announcement',
              label: 'Avviso in cima al sito',
              type: 'group',
              admin: { description: 'Es. chiusure per ferie, nuovi servizi.' },
              fields: [
                { name: 'enabled', label: 'Mostra avviso', type: 'checkbox', defaultValue: false },
                { name: 'text', label: 'Testo', type: 'text' },
                { name: 'url', label: 'Link (facoltativo)', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
}
