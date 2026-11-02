/** Percorsi pubblici per ogni tipo di contenuto (unico punto da modificare se cambiano gli URL). */
export const paths = {
  home: '/',
  services: '/servizi',
  service: (slug: string) => `/servizi/${slug}`,
  team: '/team',
  member: (slug: string) => `/team/${slug}`,
  news: '/notizie',
  article: (slug: string) => `/notizie/${slug}`,
  newsCategory: (slug: string) => `/notizie/categoria/${slug}`,
  booking: '/prenota',
  contacts: '/contatti',
  careers: '/lavora-con-noi',
  page: (slug: string) => (slug === 'home' ? '/' : `/${slug}`),
}

export function pathForDoc(relationTo: string, slug?: string | null): string {
  if (!slug) return '/'
  switch (relationTo) {
    case 'services':
      return paths.service(slug)
    case 'team':
      return paths.member(slug)
    case 'articles':
      return paths.article(slug)
    case 'pages':
      return paths.page(slug)
    default:
      return '/'
  }
}

/** Link alla pagina di prenotazione con servizio e/o professionista già selezionati. */
export function bookingHref({
  service,
  member,
}: { service?: string | null; member?: string | null } = {}) {
  const params = new URLSearchParams()
  if (service) params.set('servizio', service)
  if (member) params.set('specialista', member)
  const qs = params.toString()
  return qs ? `${paths.booking}?${qs}` : paths.booking
}
