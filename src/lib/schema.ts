import type { Article, Service, Setting, Team } from '@/payload-types'

import { asMedia, mediaSrc } from './media'
import { paths } from './paths'
import {
  areaServedList,
  formatAddress,
  mapsUrl,
  openingHoursSpecification,
} from './settings-helpers'
import { absoluteUrl, getServerUrl } from './utils'

/**
 * Dati strutturati schema.org.
 * Descrivono in modo inequivocabile chi siamo, dove siamo, cosa offriamo e chi lo offre:
 * sono la base per i risultati arricchiti di Google e per le risposte degli assistenti AI.
 */

export const ids = {
  clinic: () => `${getServerUrl()}/#clinic`,
  website: () => `${getServerUrl()}/#website`,
  person: (slug: string) => `${absoluteUrl(paths.member(slug))}#person`,
  service: (slug: string) => `${absoluteUrl(paths.service(slug))}#service`,
  article: (slug: string) => `${absoluteUrl(paths.article(slug))}#article`,
}

const imageUrl = (value: unknown) => {
  const m = asMedia(value)
  const src = m ? mediaSrc(m) : null
  return src ? absoluteUrl(src) : undefined
}

export function clinicSchema(settings: Setting, services: Service[], team: Team[]) {
  const sameAs = (settings.socialLinks ?? []).map((s) => s.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': ids.clinic(),
    name: settings.clinicName,
    legalName: settings.legalName || undefined,
    description: settings.description,
    url: getServerUrl(),
    logo: imageUrl(settings.logo) ?? absoluteUrl('/icon.svg'),
    image: imageUrl(settings.defaultOgImage) ?? imageUrl(settings.logo) ?? absoluteUrl('/og'),
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address?.street,
      postalCode: settings.address?.postalCode,
      addressLocality: settings.address?.city,
      addressRegion: settings.address?.region || 'Ticino',
      addressCountry: settings.address?.country || 'CH',
    },
    ...(settings.geo?.lat && settings.geo?.lng
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: settings.geo.lat,
            longitude: settings.geo.lng,
          },
        }
      : {}),
    hasMap: mapsUrl(settings),
    openingHoursSpecification: openingHoursSpecification(settings.openingHours),
    medicalSpecialty: ['Radiography', 'Musculoskeletal', 'Nursing'],
    isAcceptingNewPatients: true,
    availableLanguage: [{ '@type': 'Language', name: 'Italiano', alternateName: 'it' }],
    areaServed: areaServedList(settings).map((name) => ({ '@type': 'Place', name })),
    availableService: services.map((s) => ({
      '@type': s.schemaType || 'MedicalProcedure',
      '@id': ids.service(s.slug as string),
      name: s.title,
      url: absoluteUrl(paths.service(s.slug as string)),
    })),
    employee: team.map((m) => ({ '@id': ids.person(m.slug as string) })),
    potentialAction: {
      '@type': 'ReserveAction',
      name: 'Richiedi un appuntamento',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl(paths.booking),
        inLanguage: 'it-CH',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
    },
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function websiteSchema(settings: Setting) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ids.website(),
    name: settings.clinicName,
    url: getServerUrl(),
    inLanguage: 'it-CH',
    description: settings.description,
    publisher: { '@id': ids.clinic() },
  }
}

const imagingTechnique = (icon?: string | null) =>
  icon === 'xray'
    ? 'Radiography'
    : icon === 'ultrasound' || icon === 'doppler'
      ? 'Ultrasound'
      : undefined

export function serviceSchema(service: Service, settings: Setting) {
  const url = absoluteUrl(paths.service(service.slug as string))
  const professionals = (service.professionals ?? []).filter(
    (p): p is Team => typeof p === 'object' && p !== null,
  )
  const reviewer = professionals.find((p) => p.isPhysician) ?? professionals[0]
  const type = service.schemaType || 'MedicalProcedure'
  const technique = type === 'ImagingTest' ? imagingTechnique(service.icon) : undefined

  const procedure: Record<string, unknown> = {
    '@type': type,
    '@id': ids.service(service.slug as string),
    name: service.title,
    description: service.summary,
    url,
    ...(technique ? { imagingTechnique: technique } : {}),
    ...(service.indications?.length
      ? {
          [type === 'ImagingTest' || type === 'MedicalTest' ? 'usedToDiagnose' : 'indication']:
            service.indications.map((i) => ({
              '@type':
                type === 'ImagingTest' || type === 'MedicalTest'
                  ? 'MedicalCondition'
                  : 'MedicalIndication',
              name: i.text,
            })),
        }
      : {}),
    ...(service.procedure?.length && type !== 'ImagingTest' && type !== 'MedicalTest'
      ? {
          howPerformed: service.procedure
            .map((p) => `${p.title}${p.text ? `: ${p.text}` : ''}`)
            .join(' '),
        }
      : {}),
    ...(service.preparation && type !== 'ImagingTest' && type !== 'MedicalTest'
      ? { preparation: service.preparation }
      : {}),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      procedure,
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${service.title} – ${settings.clinicName}`,
        description: service.summary,
        inLanguage: 'it-CH',
        isPartOf: { '@id': ids.website() },
        about: { '@id': ids.service(service.slug as string) },
        mainEntity: { '@id': ids.service(service.slug as string) },
        audience: { '@type': 'Patient' },
        lastReviewed: service.updatedAt,
        ...(reviewer ? { reviewedBy: { '@id': ids.person(reviewer.slug as string) } } : {}),
        publisher: { '@id': ids.clinic() },
        provider: { '@id': ids.clinic() },
        ...(professionals.length
          ? { author: professionals.map((p) => ({ '@id': ids.person(p.slug as string) })) }
          : {}),
      },
    ],
  }
}

export function faqSchema(faqs: Array<{ question: string; answer: string }> | null | undefined) {
  if (!faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function personSchema(member: Team, services: Service[] = []) {
  const sameAs = (member.profiles ?? []).map((p) => p.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': ids.person(member.slug as string),
    name: member.name,
    honorificPrefix: member.prefix || undefined,
    jobTitle: member.role,
    description: member.shortBio,
    url: absoluteUrl(paths.member(member.slug as string)),
    image: imageUrl(member.photo),
    worksFor: { '@id': ids.clinic() },
    workLocation: { '@id': ids.clinic() },
    hasOccupation: {
      '@type': 'Occupation',
      name: member.role,
      occupationLocation: { '@type': 'AdministrativeArea', name: 'Ticino, Svizzera' },
    },
    knowsAbout: [...(member.specialties ?? []).map((s) => s.text), ...services.map((s) => s.title)],
    knowsLanguage: (member.languages ?? []).map((l) => l.language),
    alumniOf: (member.education ?? [])
      .filter((e) => e.institution)
      .map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
    hasCredential: (member.education ?? []).map((e) => ({
      '@type': 'EducationalOccupationalCredential',
      name: e.title,
      ...(e.year ? { dateCreated: e.year } : {}),
      ...(e.institution ? { recognizedBy: { '@type': 'Organization', name: e.institution } } : {}),
    })),
    memberOf: (member.memberships ?? []).map((m) => ({
      '@type': 'Organization',
      name: m.name,
      ...(m.url ? { url: m.url } : {}),
    })),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function articleSchema(article: Article, settings: Setting) {
  const url = absoluteUrl(paths.article(article.slug as string))
  const author = typeof article.author === 'object' && article.author ? article.author : null
  const reviewer =
    typeof article.reviewedBy === 'object' && article.reviewedBy ? article.reviewedBy : null
  const category =
    typeof article.category === 'object' && article.category ? article.category.title : undefined
  const related = (article.relatedServices ?? []).filter(
    (s): s is Service => typeof s === 'object' && s !== null,
  )
  const image =
    imageUrl(article.coverImage) ?? absoluteUrl(`/og?title=${encodeURIComponent(article.title)}`)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': ids.article(article.slug as string),
        headline: article.title,
        description: article.excerpt,
        image,
        url,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        inLanguage: 'it-CH',
        mainEntityOfPage: { '@id': `${url}#webpage` },
        author: author
          ? { '@id': ids.person(author.slug as string), name: author.name }
          : { '@id': ids.clinic(), name: settings.clinicName },
        publisher: { '@id': ids.clinic() },
        ...(category ? { articleSection: category } : {}),
        ...(related.length
          ? { about: related.map((s) => ({ '@id': ids.service(s.slug as string), name: s.title })) }
          : {}),
      },
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: article.title,
        inLanguage: 'it-CH',
        isPartOf: { '@id': ids.website() },
        mainEntity: { '@id': ids.article(article.slug as string) },
        lastReviewed: article.updatedAt,
        ...(reviewer
          ? { reviewedBy: { '@id': ids.person(reviewer.slug as string), name: reviewer.name } }
          : {}),
      },
    ],
  }
}

/** Indirizzo in una riga, per testi e llms.txt. */
export const addressLine = (settings: Setting) => formatAddress(settings.address)
