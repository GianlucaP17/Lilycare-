import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Immagine', plural: 'Immagini e file' },
  admin: {
    group: 'Sistema',
    description:
      'Foto dello studio, del team e immagini per articoli. Consiglio: foto orizzontali di almeno 1600 px di larghezza.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      label: 'Testo alternativo',
      type: 'text',
      required: true,
      admin: {
        description:
          'Descrivi cosa mostra l’immagine (es. "Sala d’attesa luminosa dello studio LilyCare"). Importante per accessibilità e Google.',
      },
    },
    { name: 'caption', label: 'Didascalia (facoltativa)', type: 'text' },
  ],
  upload: {
    // Cartella dei file caricati: sul server è fuori dalla cartella dell'app (variabile MEDIA_DIR)
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Le foto dello smartphone (4000+ px) vengono ridotte a max 2400 px, raddrizzate secondo
    // l'orientamento EXIF e salvate SENZA metadati (posizione GPS, modello del telefono).
    resizeOptions: { width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true },
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 360, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
}
