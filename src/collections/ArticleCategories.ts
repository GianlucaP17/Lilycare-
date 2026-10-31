import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  labels: { singular: 'Categoria notizie', plural: 'Categorie notizie' },
  admin: {
    useAsTitle: 'title',
    group: 'Notizie',
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'title', label: 'Nome', type: 'text', required: true },
    { name: 'description', label: 'Descrizione (per Google)', type: 'textarea' },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
