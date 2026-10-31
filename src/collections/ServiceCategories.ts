import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  labels: { singular: 'Categoria di servizi', plural: 'Categorie di servizi' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    group: 'Servizi e team',
    description: 'Raggruppano i servizi (es. "Diagnostica per immagini", "Terapia del dolore").',
  },
  defaultSort: 'order',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'title', label: 'Nome', type: 'text', required: true },
    { name: 'description', label: 'Descrizione breve', type: 'textarea' },
    {
      name: 'order',
      label: 'Ordine',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Numero più basso = mostrata prima.' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
