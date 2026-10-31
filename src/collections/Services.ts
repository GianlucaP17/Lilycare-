import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { iconField } from '@/fields/icon'
import { seoTab } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { previewUrl } from '@/lib/preview'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Servizio', plural: 'Servizi' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'order', 'updatedAt'],
    group: 'Servizi e team',
    description:
      'Ogni servizio ha la sua pagina con descrizione, indicazioni, svolgimento, domande frequenti e pulsante di prenotazione.',
    preview: (doc) => (doc?.slug ? previewUrl(`/servizi/${doc.slug}`) : null),
  },
  defaultSort: 'order',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 30 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenuto',
          fields: [
            { name: 'title', label: 'Nome del servizio', type: 'text', required: true },
            {
              name: 'summary',
              label: 'In breve',
              type: 'textarea',
              required: true,
              maxLength: 400,
              admin: {
                description:
                  'Risposta diretta a "che cos’è?" in 2–3 frasi. Appare in cima alla pagina, nelle schede e viene letta da Google e dagli assistenti AI.',
              },
            },
            {
              name: 'image',
              label: 'Immagine',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Facoltativa. Se assente viene mostrata un’illustrazione.' },
            },
            {
              name: 'content',
              label: 'Descrizione completa',
              type: 'richText',
            },
            {
              name: 'indications',
              label: 'Quando è indicato',
              type: 'array',
              labels: { singular: 'Indicazione', plural: 'Indicazioni' },
              fields: [{ name: 'text', label: 'Testo', type: 'text', required: true }],
            },
            {
              name: 'procedure',
              label: 'Come si svolge',
              type: 'array',
              labels: { singular: 'Passaggio', plural: 'Passaggi' },
              fields: [
                { name: 'title', label: 'Titolo', type: 'text', required: true },
                { name: 'text', label: 'Descrizione', type: 'textarea' },
              ],
            },
            {
              name: 'preparation',
              label: 'Come prepararsi',
              type: 'textarea',
            },
            {
              name: 'facts',
              label: 'Informazioni utili',
              type: 'array',
              labels: { singular: 'Informazione', plural: 'Informazioni' },
              admin: { description: 'Es. Durata: 20 minuti · Preparazione: nessuna.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Voce', type: 'text', required: true },
                    { name: 'value', label: 'Valore', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              name: 'faqs',
              label: 'Domande frequenti',
              type: 'array',
              labels: { singular: 'Domanda', plural: 'Domande' },
              fields: [
                { name: 'question', label: 'Domanda', type: 'text', required: true },
                { name: 'answer', label: 'Risposta', type: 'textarea', required: true },
              ],
            },
          ],
        },
        seoTab,
      ],
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'relationship',
      relationTo: 'service-categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    iconField({ admin: { position: 'sidebar' }, defaultValue: 'stethoscope' }),
    {
      name: 'professionals',
      label: 'Chi esegue il servizio',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'schemaType',
      label: 'Tipo (per Google)',
      type: 'select',
      defaultValue: 'TherapeuticProcedure',
      options: [
        { label: 'Esame di diagnostica per immagini', value: 'ImagingTest' },
        { label: 'Esame diagnostico', value: 'MedicalTest' },
        { label: 'Terapia / trattamento', value: 'TherapeuticProcedure' },
        { label: 'Procedura medica generica', value: 'MedicalProcedure' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: 'In evidenza in homepage',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      label: 'Ordine',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Numero più basso = mostrato prima.' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
