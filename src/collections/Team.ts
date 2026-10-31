import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { seoTab } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { previewUrl } from '@/lib/preview'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Membro del team', plural: 'Team' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', '_status', 'order'],
    group: 'Servizi e team',
    description: 'Ogni persona ha la sua pagina con foto, presentazione e curriculum.',
    preview: (doc) => (doc?.slug ? previewUrl(`/team/${doc.slug}`) : null),
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
          label: 'Profilo',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'prefix',
                  label: 'Titolo',
                  type: 'text',
                  admin: { width: '25%', description: 'Es. Dr. med.' },
                },
                {
                  name: 'name',
                  label: 'Nome e cognome',
                  type: 'text',
                  required: true,
                  admin: { width: '75%' },
                },
              ],
            },
            {
              name: 'role',
              label: 'Ruolo / qualifica',
              type: 'text',
              required: true,
              admin: { description: 'Es. "Medico specialista in radiologia", "Infermiera".' },
            },
            {
              name: 'photo',
              label: 'Foto',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Ritratto verticale, sfondo neutro, almeno 1000 px di altezza.',
              },
            },
            {
              name: 'shortBio',
              label: 'Presentazione breve',
              type: 'textarea',
              required: true,
              maxLength: 320,
              admin: { description: '2–3 frasi: appare nelle schede del team.' },
            },
            { name: 'bio', label: 'Presentazione completa', type: 'richText' },
            {
              name: 'specialties',
              label: 'Ambiti di competenza',
              type: 'array',
              labels: { singular: 'Ambito', plural: 'Ambiti' },
              fields: [{ name: 'text', label: 'Ambito', type: 'text', required: true }],
            },
            {
              name: 'languages',
              label: 'Lingue parlate',
              type: 'array',
              labels: { singular: 'Lingua', plural: 'Lingue' },
              fields: [{ name: 'language', label: 'Lingua', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Curriculum',
          fields: [
            {
              name: 'education',
              label: 'Formazione',
              type: 'array',
              labels: { singular: 'Titolo di studio', plural: 'Formazione' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'year', label: 'Anno', type: 'text', admin: { width: '20%' } },
                    {
                      name: 'title',
                      label: 'Titolo',
                      type: 'text',
                      required: true,
                      admin: { width: '80%' },
                    },
                  ],
                },
                { name: 'institution', label: 'Istituto / università', type: 'text' },
              ],
            },
            {
              name: 'experience',
              label: 'Esperienza professionale',
              type: 'array',
              labels: { singular: 'Esperienza', plural: 'Esperienze' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'period',
                      label: 'Periodo',
                      type: 'text',
                      admin: { width: '25%', description: 'Es. 2010 – 2014' },
                    },
                    {
                      name: 'role',
                      label: 'Ruolo',
                      type: 'text',
                      required: true,
                      admin: { width: '75%' },
                    },
                  ],
                },
                { name: 'organization', label: 'Struttura', type: 'text' },
                { name: 'description', label: 'Descrizione', type: 'textarea' },
              ],
            },
            {
              name: 'memberships',
              label: 'Società scientifiche e albi',
              type: 'array',
              labels: { singular: 'Affiliazione', plural: 'Affiliazioni' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Nome', type: 'text', required: true },
                    { name: 'url', label: 'Sito (facoltativo)', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'profiles',
              label: 'Profili esterni',
              type: 'array',
              labels: { singular: 'Profilo', plural: 'Profili' },
              admin: {
                description:
                  'Link a OneDoc, LinkedIn, albi professionali… Aiutano Google e gli assistenti AI a riconoscere la persona.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Nome', type: 'text', required: true },
                    { name: 'url', label: 'URL', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        seoTab,
      ],
    },
    {
      name: 'isPhysician',
      label: 'È un medico',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      label: 'Ordine',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Numero più basso = mostrato prima.' },
    },
    slugField('name'),
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
