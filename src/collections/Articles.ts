import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { seoTab } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { previewUrl } from '@/lib/preview'
import { readingMinutes } from '@/lib/utils'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Articolo', plural: 'Articoli' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Notizie',
    description:
      'Notizie e approfondimenti. Puoi programmare la pubblicazione: l’articolo comparirà sul sito dalla data indicata.',
    preview: (doc) => (doc?.slug ? previewUrl(`/notizie/${doc.slug}`) : null),
  },
  defaultSort: '-publishedAt',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 50,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenuto',
          fields: [
            { name: 'title', label: 'Titolo', type: 'text', required: true },
            {
              name: 'excerpt',
              label: 'Sommario',
              type: 'textarea',
              required: true,
              maxLength: 320,
              admin: {
                description:
                  '1–2 frasi che riassumono l’articolo: compaiono nell’elenco notizie e su Google.',
              },
            },
            {
              name: 'coverImage',
              label: 'Immagine di copertina',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'content', label: 'Testo', type: 'richText', required: true },
            {
              name: 'faqs',
              label: 'Domande frequenti (facoltative)',
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
      name: 'publishedAt',
      label: 'Data di pubblicazione',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description: 'Se nel futuro, l’articolo pubblicato apparirà sul sito da quel momento.',
      },
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'relationship',
      relationTo: 'article-categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      label: 'Autore',
      type: 'relationship',
      relationTo: 'team',
      admin: { position: 'sidebar' },
    },
    {
      name: 'reviewedBy',
      label: 'Revisione medica',
      type: 'relationship',
      relationTo: 'team',
      admin: {
        position: 'sidebar',
        description: 'Medico che ha verificato i contenuti (aumenta l’affidabilità per Google).',
      },
    },
    {
      name: 'relatedServices',
      label: 'Servizi correlati',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingTime',
      label: 'Minuti di lettura',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.content) {
          try {
            data.readingTime = readingMinutes(convertLexicalToPlaintext({ data: data.content }))
          } catch {
            // contenuto non ancora valido: si ricalcola al prossimo salvataggio
          }
        }
        return data
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
