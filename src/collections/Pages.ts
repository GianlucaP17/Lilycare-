import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { pageBlocks } from '@/blocks/configs'
import { seoTab } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { previewUrl } from '@/lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Pagina', plural: 'Pagine' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Pagine',
    description:
      'Homepage (slug "home"), Chi siamo, Privacy e qualsiasi nuova pagina. Ogni pagina è composta da blocchi riordinabili.',
    preview: (doc) => (doc?.slug ? previewUrl(doc.slug === 'home' ? '/' : `/${doc.slug}`) : null),
  },
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
            { name: 'title', label: 'Titolo', type: 'text', required: true },
            {
              name: 'layout',
              label: 'Sezioni della pagina',
              type: 'blocks',
              blocks: pageBlocks,
              required: true,
              admin: { initCollapsed: true },
            },
          ],
        },
        seoTab,
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
