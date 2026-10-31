import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { type CollectionConfig, ValidationError } from 'payload'

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
    defaultColumns: ['title', 'category', 'publishedAt', '_status', 'aiStatus'],
    group: 'Notizie',
    description:
      'Notizie e approfondimenti. Puoi programmare la pubblicazione: l’articolo comparirà sul sito dalla data indicata.',
    preview: (doc) => (doc?.slug ? previewUrl(`/notizie/${doc.slug}`) : null),
    components: {
      beforeListTable: ['/components/admin/AiDraftPanel#AiDraftPanel'],
    },
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
      name: 'reviewConfirmed',
      label: 'Ho riletto e verificato il testo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Obbligatorio per pubblicare una bozza preparata dall’assistente AI: conferma di aver controllato contenuti medici, toni e i punti indicati sotto.',
        condition: (data) => Boolean(data?.aiGenerated),
      },
    },
    {
      name: 'aiReviewNotes',
      label: 'Assistente AI – punti da verificare',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.aiGenerated),
      },
    },
    {
      name: 'aiStatus',
      label: 'Assistente AI – stato',
      type: 'select',
      options: [
        { label: '⏳ In preparazione', value: 'generating' },
        { label: '✅ Bozza pronta da rivedere', value: 'ready' },
        { label: '⚠️ Errore', value: 'error' },
        { label: '📰 Pubblicato dopo la revisione', value: 'reviewed' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.aiGenerated),
      },
    },
    {
      name: 'aiGenerated',
      label: 'Preparato dall’assistente AI',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.aiGenerated),
      },
    },
    {
      name: 'aiSource',
      type: 'select',
      options: [
        { label: 'Su richiesta', value: 'manual' },
        { label: 'Automatica giornaliera', value: 'daily' },
      ],
      admin: { hidden: true },
    },
    {
      name: 'publishedAt',
      label: 'Data di pubblicazione',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description:
          'Lascia vuoto per usare il momento della pubblicazione. Una data futura programma l’articolo: apparirà sul sito da quel momento.',
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
      ({ data, originalDoc, req }) => {
        const publishing = data?._status === 'published'
        if (publishing) {
          const aiGenerated = data.aiGenerated ?? originalDoc?.aiGenerated
          const aiStatus = data.aiStatus ?? originalDoc?.aiStatus
          const confirmed = data.reviewConfirmed ?? originalDoc?.reviewConfirmed
          if (aiGenerated && aiStatus === 'generating') {
            throw new ValidationError({
              collection: 'articles',
              errors: [
                {
                  path: 'aiStatus',
                  message: 'La bozza è ancora in preparazione: attendi qualche istante.',
                },
              ],
              req,
            })
          }
          if (aiGenerated && !confirmed) {
            throw new ValidationError({
              collection: 'articles',
              errors: [
                {
                  path: 'reviewConfirmed',
                  message:
                    'Prima di pubblicare un testo preparato dall’assistente AI, rileggilo e spunta “Ho riletto e verificato il testo”.',
                },
              ],
              req,
            })
          }
          if (aiGenerated) data.aiStatus = 'reviewed'
          // Data di pubblicazione: se vuota, il momento in cui si pubblica
          if (!data.publishedAt && !originalDoc?.publishedAt)
            data.publishedAt = new Date().toISOString()
        }
        return data
      },
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
