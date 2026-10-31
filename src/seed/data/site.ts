import type { Navigation, Setting } from '@/payload-types'

/** Dati dello studio (modificabili in Admin → Impostazioni studio). Confermati da LilyCare. */
export const settings: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'> = {
  clinicName: 'LilyCare',
  tagline: 'Centro medico a Chiasso',
  description:
    'Centro medico a Chiasso (Ticino): radiografie, ecografie, ecodoppler, ozonoterapia e GAET, infiltrazioni, onde d’urto, cure infermieristiche e agopuntura.',
  phone: '+41 21 988 70 95',
  email: 'info@lilycare.ch',
  bookingEmails: 'info@lilycare.ch',
  address: {
    street: 'Corso San Gottardo 89',
    addressNote: '3° piano',
    postalCode: '6830',
    city: 'Chiasso',
    region: 'Ticino',
    country: 'CH',
  },
  areaNote: 'nel Mendrisiotto, al confine con Como',
  areaServed:
    'Chiasso, Balerna, Vacallo, Morbio Inferiore, Novazzano, Coldrerio, Mendrisio, Mendrisiotto, Ticino, Como',
  directions: [
    {
      icon: 'car',
      title: 'In auto',
      text: 'Imposta sul navigatore “Corso San Gottardo 89, 6830 Chiasso”. Chiasso si trova nel sud del Ticino, al confine con Como.',
    },
    {
      icon: 'train',
      title: 'In treno',
      text: 'Chiasso ha una stazione FFS servita dai treni regionali TILO. Pianifica il viaggio su sbb.ch indicando come destinazione “Chiasso, Corso San Gottardo”.',
    },
  ],
  openingHours: [
    { days: ['mon', 'tue', 'wed', 'thu', 'fri'], opens: '08:00', closes: '12:30' },
    { days: ['mon', 'tue', 'wed', 'thu', 'fri'], opens: '13:30', closes: '18:00' },
  ],
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
