import { slugField as payloadSlugField } from 'payload'

import { slugify } from '@/lib/utils'

/**
 * Campo "slug" (la parte finale dell'URL, es. /servizi/ozonoterapia).
 * Generato automaticamente dal titolo, gestisce accenti e apostrofi.
 */
export const slugField = (useAsSlug = 'title') =>
  payloadSlugField({
    useAsSlug,
    slugify: ({ valueToSlugify }) => slugify(valueToSlugify),
    overrides: (field) => {
      const slug = field.fields[1]
      if (slug && 'name' in slug && slug.type === 'text') {
        slug.label = 'Indirizzo pagina (slug)'
        slug.admin = {
          ...slug.admin,
          description: 'Parte finale dell’URL. Generato dal titolo: modificalo solo se necessario.',
        }
      }
      return field
    },
  })
