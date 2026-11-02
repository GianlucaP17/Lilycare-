/**
 * Profili iniziali del team.
 * Dati del Dr. Binda tratti da fonti pubbliche (OneDoc, sito ozonoterapiaticino.ch, SIOOT):
 * da verificare e completare. Il profilo di Monica Gaiga va completato con il suo curriculum.
 */
export type SeedMember = {
  slug: string
  prefix?: string
  name: string
  role: string
  /** Chiave del ritratto in photos.ts */
  photo?: string
  isPhysician: boolean
  order: number
  shortBio: string
  bio: string
  specialties: string[]
  languages: string[]
  education: Array<{ year?: string; title: string; institution?: string }>
  experience: Array<{ period?: string; role: string; organization?: string; description?: string }>
  memberships: Array<{ name: string; url?: string }>
  profiles: Array<{ label: string; url: string }>
  metaTitle: string
  metaDescription: string
}

export const team: SeedMember[] = [
  {
    slug: 'mauro-binda',
    prefix: 'Dr. med.',
    name: 'Mauro Binda',
    role: 'Medico specialista in radiologia',
    photo: 'ritratto-mauro-binda',
    isPhysician: true,
    order: 1,
    shortBio:
      'Medico radiologo con oltre 40 anni di esperienza in ospedali e strutture private in Italia e in Svizzera. Si occupa di diagnostica per immagini e di terapia del dolore della colonna e delle articolazioni.',
    bio: `Il Dr. med. Mauro Binda è **medico specialista in radiologia** con oltre quarant’anni di esperienza in ospedali pubblici e strutture private in Italia e in Svizzera.

Si è laureato in Medicina e Chirurgia all’Università degli Studi di Pavia nel 1980 e nello stesso ateneo ha conseguito, nel 1984, la specializzazione in Radiologia. Dal 2010 al 2014 è stato consulente del servizio di radiologia dell’Ente Ospedaliero Cantonale a Mendrisio; dal 2014 esercita in libera pratica in Ticino.

A LilyCare esegue personalmente **radiografie, ecografie ed ecocolordoppler** e si dedica alla **terapia del dolore** muscolo-scheletrico e della colonna vertebrale, con trattamenti di ossigeno-ozonoterapia, infiltrazioni ecoguidate e onde d’urto.

La sua formazione da radiologo gli permette di unire, nello stesso percorso, una diagnosi accurata e un trattamento mirato: l’ecografo diventa così anche uno strumento per guidare con precisione le terapie.`,
    specialties: [
      'Radiologia e diagnostica per immagini',
      'Ecografia muscolo-scheletrica',
      'Ecocolordoppler',
      'Ossigeno-ozonoterapia',
      'Infiltrazioni ecoguidate',
      'Terapia del dolore della colonna vertebrale',
    ],
    languages: ['Italiano'],
    education: [
      {
        year: '1984',
        title: 'Specializzazione in Radiologia',
        institution: 'Università degli Studi di Pavia',
      },
      {
        year: '1980',
        title: 'Laurea in Medicina e Chirurgia',
        institution: 'Università degli Studi di Pavia',
      },
    ],
    experience: [
      {
        period: 'Oggi',
        role: 'Medico radiologo e terapia del dolore',
        organization: 'LilyCare, Chiasso',
      },
      {
        period: 'Dal 2014',
        role: 'Libera pratica in radiologia e ossigeno-ozonoterapia',
        organization: 'Canton Ticino',
      },
      {
        period: '2010 – 2014',
        role: 'Consulente del servizio di radiologia',
        organization: 'Ente Ospedaliero Cantonale (EOC), Mendrisio',
      },
      {
        period: 'Fino al 2010',
        role: 'Medico radiologo',
        organization: 'Strutture ospedaliere in Italia',
      },
    ],
    memberships: [
      {
        name: 'SIOOT – Società Scientifica Internazionale di Ossigeno-Ozono Terapia',
        url: 'https://ossigenoozono.it/ozonoterapeuti/dott-binda-mauro/',
      },
      { name: 'Ordine dei Medici del Canton Ticino', url: 'https://www.omct.ch' },
    ],
    profiles: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mauro-binda-3b916b61/' },
      {
        label: 'SIOOT – elenco ozonoterapeuti',
        url: 'https://ossigenoozono.it/ozonoterapeuti/dott-binda-mauro/',
      },
    ],
    metaTitle: 'Dr. med. Mauro Binda – Radiologo a Chiasso | LilyCare',
    metaDescription:
      'Dr. med. Mauro Binda, medico specialista in radiologia: radiografie, ecografie, ecodoppler, ozonoterapia e infiltrazioni a Chiasso (Ticino). Curriculum.',
  },
  {
    slug: 'monica-gaiga',
    name: 'Monica Gaiga',
    role: 'Infermiera · GAET e agopuntura',
    photo: 'ritratto-monica-gaiga',
    isPhysician: false,
    order: 2,
    shortBio:
      'Infermiera, si occupa delle cure infermieristiche del centro e della GAET (grande autoemoterapia con ossigeno-ozono). Pratica anche l’agopuntura, per il benessere e in ambito estetico.',
    bio: `Monica Gaiga è **infermiera** e segue le cure infermieristiche di LilyCare: medicazioni, iniezioni, controllo dei parametri e assistenza durante le procedure, in stretta collaborazione con il medico.

Esegue la **GAET**, la grande autoemoterapia con ossigeno-ozono, su indicazione medica: dal colloquio iniziale al prelievo, fino alla reinfusione e al controllo dopo la seduta.

Pratica inoltre l’**agopuntura**, proposta come trattamento complementare per il dolore muscolo-scheletrico, la tensione e il benessere generale, e l’**agopuntura estetica**, ad esempio per migliorare l’aspetto della cellulite e la luminosità della pelle del viso.

Per i pazienti è un punto di riferimento attento e disponibile: dedica tempo all’ascolto, spiega con chiarezza ogni passaggio e accompagna ciascuno nel proprio percorso di cura.`,
    specialties: [
      'Cure infermieristiche',
      'GAET – grande autoemoterapia con ossigeno-ozono',
      'Agopuntura',
      'Agopuntura estetica',
    ],
    languages: ['Italiano'],
    education: [],
    experience: [
      { period: 'Oggi', role: 'Infermiera, GAET e agopuntura', organization: 'LilyCare, Chiasso' },
    ],
    memberships: [],
    profiles: [],
    metaTitle: 'Monica Gaiga – Infermiera, GAET e agopuntura | LilyCare',
    metaDescription:
      'Monica Gaiga, infermiera: cure infermieristiche, GAET (autoemoterapia con ossigeno-ozono), agopuntura e agopuntura estetica a LilyCare, Chiasso.',
  },
]
