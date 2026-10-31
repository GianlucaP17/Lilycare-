import type { Block, Field } from 'payload'

import { iconField } from '@/fields/icon'
import { linkGroup } from '@/fields/link'

/**
 * BLOCCHI MODULARI
 * Ogni pagina (homepage compresa) è composta da una sequenza di blocchi che lo staff
 * può aggiungere, togliere e riordinare dal pannello admin.
 *
 * Per creare un nuovo tipo di blocco:
 *   1. aggiungi qui la sua configurazione (campi) e inseriscilo in `pageBlocks`;
 *   2. crea il componente in src/blocks/components/ e registralo in RenderBlocks.tsx;
 *   3. esegui `npm run generate:types`.
 */

const sectionIntro: Field[] = [
  { name: 'eyebrow', label: 'Sopratitolo', type: 'text' },
  { name: 'heading', label: 'Titolo', type: 'text' },
  { name: 'intro', label: 'Testo introduttivo', type: 'textarea' },
]

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Testata (hero)', plural: 'Testate' },
  fields: [
    {
      name: 'variant',
      label: 'Stile',
      type: 'select',
      defaultValue: 'home',
      options: [
        { label: 'Grande con immagine (homepage)', value: 'home' },
        { label: 'Compatta (pagine interne)', value: 'page' },
      ],
    },
    { name: 'eyebrow', label: 'Sopratitolo', type: 'text' },
    { name: 'heading', label: 'Titolo principale', type: 'text', required: true },
    { name: 'text', label: 'Testo', type: 'textarea' },
    {
      name: 'image',
      label: 'Immagine',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Consigliata una foto dello studio o del team (verticale o quadrata).',
      },
    },
    linkGroup('primaryCta', 'Pulsante principale'),
    {
      name: 'showPhoneButton',
      label: 'Mostra pulsante "Chiama"',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'highlights',
      label: 'Punti di forza (brevi)',
      type: 'array',
      maxRows: 4,
      fields: [{ name: 'text', label: 'Testo', type: 'text', required: true }],
    },
  ],
}

export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  labels: { singular: 'Elenco servizi', plural: 'Elenchi servizi' },
  fields: [
    ...sectionIntro,
    {
      name: 'source',
      label: 'Quali servizi mostrare',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'Tutti', value: 'all' },
        { label: 'Solo quelli "in evidenza"', value: 'featured' },
        { label: 'Una categoria', value: 'category' },
        { label: 'Scelti a mano', value: 'manual' },
      ],
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'relationship',
      relationTo: 'service-categories',
      admin: { condition: (_, sibling) => sibling?.source === 'category' },
    },
    {
      name: 'services',
      label: 'Servizi',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { condition: (_, sibling) => sibling?.source === 'manual' },
    },
    {
      name: 'groupByCategory',
      label: 'Raggruppa per categoria',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  interfaceName: 'TeamGridBlock',
  labels: { singular: 'Team', plural: 'Team' },
  fields: [
    ...sectionIntro,
    {
      name: 'members',
      label: 'Persone (lascia vuoto per mostrare tutto il team)',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
    },
  ],
}

export const FeaturesBlock: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: { singular: 'Punti di forza', plural: 'Punti di forza' },
  fields: [
    ...sectionIntro,
    {
      name: 'items',
      label: 'Elementi',
      type: 'array',
      minRows: 1,
      fields: [
        iconField(),
        { name: 'title', label: 'Titolo', type: 'text', required: true },
        { name: 'text', label: 'Testo', type: 'textarea' },
      ],
    },
  ],
}

export const StepsBlock: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Passaggi (come funziona)', plural: 'Passaggi' },
  fields: [
    ...sectionIntro,
    {
      name: 'items',
      label: 'Passaggi',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', label: 'Titolo', type: 'text', required: true },
        { name: 'text', label: 'Testo', type: 'textarea' },
      ],
    },
    linkGroup('cta', 'Pulsante (facoltativo)'),
  ],
}

export const LocationBlock: Block = {
  slug: 'location',
  interfaceName: 'LocationBlock',
  labels: { singular: 'Dove siamo (mappa e contatti)', plural: 'Dove siamo' },
  fields: [
    ...sectionIntro,
    { name: 'showMap', label: 'Mostra mappa', type: 'checkbox', defaultValue: true },
    {
      name: 'showDirections',
      label: 'Mostra "Come arrivare"',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

export const LatestNewsBlock: Block = {
  slug: 'latestNews',
  interfaceName: 'LatestNewsBlock',
  labels: { singular: 'Ultime notizie', plural: 'Ultime notizie' },
  fields: [
    ...sectionIntro,
    { name: 'limit', label: 'Quanti articoli', type: 'number', defaultValue: 3, min: 1, max: 9 },
    {
      name: 'category',
      label: 'Solo questa categoria (facoltativo)',
      type: 'relationship',
      relationTo: 'article-categories',
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'Domande frequenti', plural: 'Domande frequenti' },
  fields: [
    ...sectionIntro,
    {
      name: 'items',
      label: 'Domande',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', label: 'Domanda', type: 'text', required: true },
        { name: 'answer', label: 'Risposta', type: 'textarea', required: true },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: { singular: 'Invito all’azione', plural: 'Inviti all’azione' },
  fields: [
    { name: 'heading', label: 'Titolo', type: 'text', required: true },
    { name: 'text', label: 'Testo', type: 'textarea' },
    linkGroup('primary', 'Pulsante principale'),
    { name: 'showPhone', label: 'Mostra pulsante "Chiama"', type: 'checkbox', defaultValue: true },
    {
      name: 'style',
      label: 'Colore',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Scuro', value: 'dark' },
        { label: 'Chiaro', value: 'light' },
        { label: 'Rosa cipria', value: 'blush' },
      ],
    },
  ],
}

export const ContentBlock: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: { singular: 'Testo', plural: 'Testi' },
  fields: [
    { name: 'content', label: 'Contenuto', type: 'richText', required: true },
    {
      name: 'width',
      label: 'Larghezza',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Stretta (ideale per la lettura)', value: 'narrow' },
        { label: 'Larga', value: 'wide' },
      ],
    },
  ],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Immagine + testo', plural: 'Immagine + testo' },
  fields: [
    { name: 'eyebrow', label: 'Sopratitolo', type: 'text' },
    { name: 'heading', label: 'Titolo', type: 'text', required: true },
    { name: 'content', label: 'Testo', type: 'richText' },
    { name: 'image', label: 'Immagine', type: 'upload', relationTo: 'media' },
    {
      name: 'imagePosition',
      label: 'Posizione immagine',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'A destra', value: 'right' },
        { label: 'A sinistra', value: 'left' },
      ],
    },
    linkGroup('cta', 'Pulsante (facoltativo)'),
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Numeri', plural: 'Numeri' },
  fields: [
    {
      name: 'items',
      label: 'Numeri',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', label: 'Valore', type: 'text', required: true },
            { name: 'label', label: 'Descrizione', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  ServicesGridBlock,
  TeamGridBlock,
  FeaturesBlock,
  StepsBlock,
  LocationBlock,
  LatestNewsBlock,
  FaqBlock,
  CtaBlock,
  ContentBlock,
  ImageTextBlock,
  StatsBlock,
]
