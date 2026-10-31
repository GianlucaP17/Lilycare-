import type { Navigation, Setting } from '@/payload-types'

/** Dati dello studio (modificabili in Admin → Impostazioni studio). Fonte: sito attuale lilycare.ch. */
export const settings: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'> = {
  clinicName: 'LilyCare',
  tagline: 'Centro medico a Coldrerio',
  description:
    'Centro medico a Coldrerio (Ticino): radiografie, ecografie, ecodoppler, ozonoterapia, infiltrazioni, onde d’urto, cure infermieristiche e agopuntura.',
  phone: '+41 78 335 51 53',
  email: 'info@lilycare.ch',
  bookingEmails: 'info@lilycare.ch',
  address: {
    street: 'Via Monte Generoso 2',
    postalCode: '6877',
    city: 'Coldrerio',
    region: 'Ticino',
    country: 'CH',
  },
  directions: [
    {
      icon: 'car',
      title: 'In auto',
      text: 'Coldrerio si trova nel Mendrisiotto, tra Mendrisio e Chiasso. Imposta sul navigatore “Via Monte Generoso 2, 6877 Coldrerio”.',
    },
    {
      icon: 'bus',
      title: 'Con i mezzi pubblici',
      text: 'Pianifica il viaggio con l’orario FFS (sbb.ch) indicando come destinazione “Coldrerio, Via Monte Generoso”.',
    },
  ],
  openingHours: [{ days: ['mon', 'tue', 'wed', 'thu', 'fri'], opens: '08:00', closes: '19:00' }],
  hoursNote: 'Visite su appuntamento',
  bookingIntro:
    'Compila il modulo in un minuto: la richiesta arriva subito al nostro staff, che ti ricontatterà per concordare data e ora. Se preferisci, puoi anche chiamarci.',
  responseTimeText: 'Ti ricontatteremo al più presto per concordare data e ora della visita.',
  insuranceNote:
    'Molte prestazioni mediche sono coperte dall’assicurazione di base (LAMal) alle condizioni previste dalla legge; alcuni trattamenti, come l’agopuntura, possono essere rimborsati dalle assicurazioni complementari. Ti consigliamo di verificare con la tua cassa malati.',
  socialLinks: [],
  announcement: { enabled: false },
}

export const navigation: Omit<Navigation, 'id' | 'createdAt' | 'updatedAt'> = {
  header: [
    { label: 'Servizi', url: '/servizi', servicesMenu: true },
    { label: 'Team', url: '/team', servicesMenu: false },
    { label: 'Notizie', url: '/notizie', servicesMenu: false },
    { label: 'Chi siamo', url: '/chi-siamo', servicesMenu: false },
    { label: 'Contatti', url: '/contatti', servicesMenu: false },
  ],
  footerLegal: [
    { label: 'Privacy', url: '/privacy' },
    { label: 'Note legali', url: '/note-legali' },
  ],
}
