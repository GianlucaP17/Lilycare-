import config from '@payload-config'
import { convertLexicalToMarkdown, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { getArticles, getServiceCategories, getServices, getSettings, getTeam } from './data'
import { paths } from './paths'
import { areaServedList, formatAddress, groupedHours } from './settings-helpers'
import { absoluteUrl } from './utils'

/**
 * Testi per gli assistenti AI (standard llms.txt, https://llmstxt.org):
 * una sintesi chiara e verificabile di chi siamo, dove siamo e cosa offriamo.
 */

async function toMarkdown(data: unknown): Promise<string> {
  if (!data || typeof data !== 'object' || !('root' in data)) return ''
  try {
    const editorConfig = await editorConfigFactory.default({ config: await config })
    return convertLexicalToMarkdown({ data: data as SerializedEditorState, editorConfig }).trim()
  } catch {
    return ''
  }
}

export async function buildLlmsText(full: boolean): Promise<string> {
  const [settings, services, categories, team, articlesRes] = await Promise.all([
    getSettings(),
    getServices(),
    getServiceCategories(),
    getTeam(),
    getArticles({ limit: full ? 30 : 10 }),
  ])

  const hours = groupedHours(settings.openingHours)
    .map((r) => `${r.label}: ${r.value}`)
    .join('; ')

  const lines: string[] = []
  lines.push(`# ${settings.clinicName} – ${settings.tagline || 'Centro medico'}`)
  lines.push('')
  lines.push(`> ${settings.description}`)
  lines.push('')
  lines.push('## Informazioni essenziali')
  lines.push('')
  lines.push(
    `- Nome: ${settings.clinicName}${settings.legalName ? ` (${settings.legalName})` : ''}`,
  )
  lines.push(`- Tipo: centro medico polispecialistico ambulatoriale`)
  lines.push(
    `- Indirizzo: ${formatAddress(settings.address, true)}, ${settings.address?.region || 'Ticino'}, Svizzera`,
  )
  lines.push(`- Telefono: ${settings.phone}`)
  lines.push(`- Email: ${settings.email}`)
  lines.push(`- Orari: ${hours}${settings.hoursNote ? ` (${settings.hoursNote})` : ''}`)
  lines.push(`- Prenotazione online: ${absoluteUrl(paths.booking)}`)
  lines.push(
    `- Zona: ${settings.address?.city || ''}${settings.areaNote ? `, ${settings.areaNote}` : ''} (Canton ${settings.address?.region || 'Ticino'}, Svizzera)`,
  )
  const served = areaServedList(settings)
  if (served.length) lines.push(`- Pazienti da: ${served.join(', ')}`)
  lines.push(`- Lingua: italiano`)
  lines.push(`- Emergenze: in Svizzera chiamare il 144`)
  lines.push('')

  lines.push('## Servizi')
  lines.push('')
  for (const cat of categories) {
    const items = services.filter(
      (s) => (typeof s.category === 'object' ? s.category?.id : s.category) === cat.id,
    )
    if (!items.length) continue
    lines.push(`### ${cat.title}`)
    lines.push('')
    for (const s of items) {
      lines.push(`- [${s.title}](${absoluteUrl(paths.service(s.slug as string))}): ${s.summary}`)
    }
    lines.push('')
  }

  lines.push('## Team')
  lines.push('')
  for (const m of team) {
    const name = [m.prefix, m.name].filter(Boolean).join(' ')
    lines.push(
      `- [${name}](${absoluteUrl(paths.member(m.slug as string))}) – ${m.role}. ${m.shortBio}`,
    )
  }
  lines.push('')

  if (articlesRes.docs.length) {
    lines.push('## Notizie e approfondimenti')
    lines.push('')
    for (const a of articlesRes.docs) {
      lines.push(`- [${a.title}](${absoluteUrl(paths.article(a.slug as string))}): ${a.excerpt}`)
    }
    lines.push('')
  }

  lines.push('## Pagine utili')
  lines.push('')
  lines.push(`- [Tutti i servizi](${absoluteUrl(paths.services)})`)
  lines.push(`- [Chi siamo](${absoluteUrl('/chi-siamo')})`)
  lines.push(`- [Contatti e mappa](${absoluteUrl(paths.contacts)})`)
  lines.push(`- [Prenota una visita](${absoluteUrl(paths.booking)})`)
  if (!full) lines.push(`- [Versione completa per assistenti AI](${absoluteUrl('/llms-full.txt')})`)
  lines.push('')

  if (!full) return lines.join('\n')

  lines.push('---')
  lines.push('')
  lines.push('# Schede complete dei servizi')
  lines.push('')
  for (const s of services) {
    lines.push(`## ${s.title}`)
    lines.push('')
    lines.push(`URL: ${absoluteUrl(paths.service(s.slug as string))}`)
    lines.push('')
    lines.push(`**In breve:** ${s.summary}`)
    lines.push('')
    const body = await toMarkdown(s.content)
    if (body) lines.push(body, '')
    if (s.indications?.length) {
      lines.push('**Quando è indicato:**')
      for (const i of s.indications) lines.push(`- ${i.text}`)
      lines.push('')
    }
    if (s.procedure?.length) {
      lines.push('**Come si svolge:**')
      s.procedure.forEach((p, i) =>
        lines.push(`${i + 1}. ${p.title}${p.text ? ` – ${p.text}` : ''}`),
      )
      lines.push('')
    }
    if (s.preparation) lines.push(`**Come prepararsi:** ${s.preparation}`, '')
    if (s.facts?.length) {
      lines.push('**Informazioni utili:**')
      for (const f of s.facts) lines.push(`- ${f.label}: ${f.value}`)
      lines.push('')
    }
    if (s.faqs?.length) {
      lines.push('**Domande frequenti:**')
      for (const f of s.faqs) lines.push(`- D: ${f.question}`, `  R: ${f.answer}`)
      lines.push('')
    }
  }

  lines.push('# Curriculum del team')
  lines.push('')
  for (const m of team) {
    lines.push(`## ${[m.prefix, m.name].filter(Boolean).join(' ')} – ${m.role}`)
    lines.push('')
    lines.push(`URL: ${absoluteUrl(paths.member(m.slug as string))}`)
    lines.push('')
    const bio = await toMarkdown(m.bio)
    lines.push(bio || m.shortBio, '')
    if (m.education?.length) {
      lines.push('**Formazione:**')
      for (const e of m.education)
        lines.push(
          `- ${e.year ? `${e.year} – ` : ''}${e.title}${e.institution ? `, ${e.institution}` : ''}`,
        )
      lines.push('')
    }
    if (m.experience?.length) {
      lines.push('**Esperienza:**')
      for (const e of m.experience)
        lines.push(
          `- ${e.period ? `${e.period} – ` : ''}${e.role}${e.organization ? `, ${e.organization}` : ''}`,
        )
      lines.push('')
    }
    if (m.memberships?.length) {
      lines.push('**Società e albi:**')
      for (const x of m.memberships) lines.push(`- ${x.name}`)
      lines.push('')
    }
  }

  if (articlesRes.docs.length) {
    lines.push('# Articoli')
    lines.push('')
    for (const a of articlesRes.docs) {
      lines.push(`## ${a.title}`)
      lines.push('')
      lines.push(
        `URL: ${absoluteUrl(paths.article(a.slug as string))} – pubblicato il ${a.publishedAt?.slice(0, 10) ?? ''}`,
      )
      lines.push('')
      const body = await toMarkdown(a.content)
      lines.push(body || a.excerpt, '')
    }
  }

  return lines.join('\n')
}
