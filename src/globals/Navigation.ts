import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menu di navigazione',
  admin: { group: 'Impostazioni' },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      name: 'header',
      label: 'Menu principale',
      type: 'array',
      labels: { singular: 'Voce', plural: 'Voci' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Testo', type: 'text', required: true },
            { name: 'url', label: 'Collegamento', type: 'text', required: true },
          ],
        },
        {
          name: 'servicesMenu',
          label: 'Mostra il menu a tendina con tutti i servizi',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'footerLegal',
      label: 'Link legali nel piè di pagina',
      type: 'array',
      labels: { singular: 'Link', plural: 'Link' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Testo', type: 'text', required: true },
            { name: 'url', label: 'Collegamento', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateGlobal] },
}
