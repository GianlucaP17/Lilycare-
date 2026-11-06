import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access'

export const aiLengthOptions = [
  { label: 'Breve (circa 600 parole)', value: 'breve' },
  { label: 'Media (circa 900 parole)', value: 'media' },
  { label: 'Lunga (circa 1200 parole)', value: 'lunga' },
] as const

/**
 * Impostazioni dell'assistente AI che prepara le bozze degli articoli.
 * Le bozze NON vengono mai pubblicate da sole: lo staff le rilegge, le corregge e le pubblica.
 */
export const AiAssistant: GlobalConfig = {
  slug: 'ai-assistant',
  label: 'Assistente AI',
  admin: {
    group: 'Notizie',
    description:
      'L’assistente prepara bozze di articoli da rileggere: non pubblica mai nulla da solo. Puoi chiedere una bozza in qualsiasi momento da Notizie → Articoli, oppure attivare la bozza automatica giornaliera.',
  },
  access: { read: authenticated, update: authenticated },
  fields: [
    {
      name: 'dailyEnabled',
      label: 'Prepara automaticamente una bozza ogni giorno',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Richiede il "Cron Job" giornaliero di cPanel descritto nel README. Ogni giorno viene usato il primo argomento "da fare" del piano editoriale; se il piano è vuoto, l’assistente sceglie un tema utile ai pazienti.',
      },
    },
    {
      type: 'collapsible',
      label: 'Controllo della bozza automatica',
      admin: {
        initCollapsed: false,
        description:
          'Ogni volta che il cron di cPanel chiama il sito, qui viene annotato quando è successo e com’è andata. Se la data resta vuota il cron non sta arrivando: in cPanel → Cron Jobs controlla che il comando esista e che l’indirizzo sia https://lilycare.ch/next/ai/daily (non demo.lilycare.ch).',
      },
      fields: [
        {
          name: 'lastDailyAt',
          label: 'Ultima chiamata del cron',
          type: 'date',
          admin: {
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
          },
        },
        {
          name: 'lastDailyOutcome',
          label: 'Esito dell’ultima chiamata',
          type: 'text',
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'defaultLength',
          label: 'Lunghezza predefinita',
          type: 'select',
          defaultValue: 'media',
          options: aiLengthOptions.map((o) => ({ ...o })),
        },
        {
          name: 'notifyEmails',
          label: 'Avvisa quando una bozza è pronta',
          type: 'text',
          admin: {
            description:
              'Indirizzi separati da virgola. Se vuoto: le email che ricevono le richieste.',
          },
        },
      ],
    },
    {
      name: 'styleGuide',
      label: 'Linee guida di stile',
      type: 'textarea',
      defaultValue:
        'Tono rassicurante, chiaro e professionale. Frasi brevi, linguaggio comprensibile a tutti, termini tecnici spiegati. Dare del "tu" al lettore. Nessuna promessa di guarigione o di risultato. Collegare l’argomento, quando pertinente, ai servizi del centro.',
      admin: { description: 'Indicazioni che l’assistente segue in ogni bozza.' },
    },
    {
      name: 'imageStyle',
      label: 'Indicazioni sulle immagini di copertina',
      type: 'textarea',
      admin: {
        description:
          'Si aggiungono alle regole fisse (ambiente clinico realistico, nessuna persona, niente sangue, nessuna immagine medica sugli schermi). Esempi: “inquadrature più ravvicinate sull’apparecchio”, “ambienti più luminosi”, “mostrare anche la sala d’attesa”.',
      },
    },
    {
      name: 'coverImages',
      label: 'Genera anche l’immagine di copertina',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'L’assistente descrive l’immagine mentre scrive l’articolo e un servizio esterno la disegna (richiede la variabile OPENAI_API_KEY sul server, circa 3–8 centesimi per immagine). Sono fotografie di ambienti e apparecchiature: mai persone, nemmeno le mani, perché l’anatomia inventata viene spesso sbagliata. Controlla sempre il risultato prima di pubblicare.',
      },
    },
    {
      name: 'topics',
      label: 'Piano editoriale (argomenti)',
      type: 'array',
      labels: { singular: 'Argomento', plural: 'Argomenti' },
      admin: {
        description:
          'Elenco di argomenti da trattare. La bozza automatica giornaliera usa il primo argomento "da fare" e poi lo segna come usato.',
        initCollapsed: true,
      },
      fields: [
        { name: 'topic', label: 'Argomento', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'category',
              label: 'Categoria',
              type: 'relationship',
              relationTo: 'article-categories',
            },
            {
              name: 'services',
              label: 'Servizi collegati',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
            },
          ],
        },
        { name: 'notes', label: 'Indicazioni per l’assistente', type: 'textarea' },
        {
          type: 'row',
          fields: [
            {
              name: 'status',
              label: 'Stato',
              type: 'select',
              defaultValue: 'todo',
              options: [
                { label: 'Da fare', value: 'todo' },
                { label: 'Usato', value: 'used' },
              ],
            },
            {
              name: 'article',
              label: 'Bozza creata',
              type: 'relationship',
              relationTo: 'articles',
              admin: { readOnly: true },
            },
          ],
        },
      ],
    },
  ],
}
