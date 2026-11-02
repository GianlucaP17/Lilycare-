import { availabilityOptions, collaborationOptions, labelFor } from '@/lib/job-options'

import { emailLayout, escapeHtml, nl2br } from './layout'

export type JobEmailData = {
  name: string
  email: string
  phone?: string | null
  roleLabel: string
  collaboration?: string | null
  availability?: string | null
  message?: string | null
  cvFilename?: string | null
}

type ClinicInfo = {
  clinicName: string
  phone?: string | null
  email?: string | null
  address?: string | null
  siteUrl: string
  adminUrl?: string
}

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #eee7dd;color:#586178;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eee7dd;font-weight:600;vertical-align:top;">${value}</td>
  </tr>`

/** Email allo studio: candidatura completa, con il curriculum in allegato. */
export function clinicApplicationEmail(data: JobEmailData, clinic: ClinicInfo) {
  const subject = `Nuova candidatura – ${data.name} (${data.roleLabel})`
  const body = `
    <p style="margin:0 0 16px;">È arrivata una candidatura dalla pagina “Lavora con noi”.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      ${row('Nome', escapeHtml(data.name))}
      ${row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:#2f55b4;">${escapeHtml(data.email)}</a>`)}
      ${row('Telefono', data.phone ? escapeHtml(data.phone) : '—')}
      ${row('Profilo', escapeHtml(data.roleLabel))}
      ${row('Collaborazione', escapeHtml(labelFor(collaborationOptions, data.collaboration) || 'Da valutare'))}
      ${row('Disponibilità', escapeHtml(labelFor(availabilityOptions, data.availability) || 'Da concordare'))}
      ${row('Curriculum', data.cvFilename ? `In allegato: ${escapeHtml(data.cvFilename)}` : 'Non allegato')}
      ${row('Presentazione', data.message ? nl2br(data.message) : '—')}
    </table>
    ${
      clinic.adminUrl
        ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(clinic.adminUrl)}" style="display:inline-block;background:#284a9f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px;">Apri nel pannello admin</a></p>`
        : ''
    }
    <p style="margin:20px 0 0;padding:14px 16px;background:#f3f6fc;border-radius:10px;font-size:13px;color:#586178;">
      Candidatura e curriculum vengono cancellati automaticamente dal sito dopo 30 giorni. Se il profilo ti interessa, conserva questa email.
    </p>`
  const footer =
    'Rispondi direttamente a questa email per scrivere al candidato. La candidatura è salvata anche nel pannello admin, sezione “Candidature”.'
  const text = [
    'Nuova candidatura',
    `Nome: ${data.name}`,
    `Email: ${data.email}`,
    `Telefono: ${data.phone || '—'}`,
    `Profilo: ${data.roleLabel}`,
    `Collaborazione: ${labelFor(collaborationOptions, data.collaboration) || 'Da valutare'}`,
    `Disponibilità: ${labelFor(availabilityOptions, data.availability) || 'Da concordare'}`,
    `Curriculum: ${data.cvFilename ? `in allegato (${data.cvFilename})` : 'non allegato'}`,
    `Presentazione: ${data.message || '—'}`,
  ].join('\n')
  return { subject, html: emailLayout('Nuova candidatura', body, footer), text }
}

/** Email al candidato: conferma di ricezione. */
export function candidateConfirmationEmail(data: JobEmailData, clinic: ClinicInfo) {
  const subject = `Abbiamo ricevuto la tua candidatura – ${clinic.clinicName}`
  const firstName = data.name.split(' ')[0]
  const body = `
    <p style="margin:0 0 16px;">Gentile ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 16px;">grazie per il tuo interesse. Abbiamo ricevuto la tua candidatura come <strong>${escapeHtml(
      data.roleLabel,
    )}</strong>${data.cvFilename ? ', con il curriculum allegato,' : ''} e la leggeremo con attenzione.</p>
    <p style="margin:0 0 16px;">Ti ricontatteremo se il tuo profilo corrisponde a una posizione aperta o a un’esigenza del centro.</p>
    <p style="margin:0 0 16px;padding:14px 16px;background:#f3f6fc;border-radius:10px;font-size:14px;">
      <strong>I tuoi dati:</strong> conserviamo la candidatura e il curriculum per un massimo di 30 giorni, poi vengono cancellati automaticamente. Puoi chiederne la cancellazione immediata scrivendo a
      <a href="mailto:${escapeHtml(clinic.email || 'info@lilycare.ch')}" style="color:#2f55b4;">${escapeHtml(clinic.email || 'info@lilycare.ch')}</a>.
    </p>
    <p style="margin:24px 0 0;">Cordiali saluti,<br>il team di ${escapeHtml(clinic.clinicName)}</p>`
  const footer = `${escapeHtml(clinic.clinicName)}${clinic.address ? ` · ${escapeHtml(clinic.address)}` : ''}`
  const text = [
    `Gentile ${firstName},`,
    '',
    `abbiamo ricevuto la tua candidatura come ${data.roleLabel}${data.cvFilename ? ' con il curriculum allegato' : ''}.`,
    '',
    'Conserviamo i dati per un massimo di 30 giorni, poi vengono cancellati automaticamente.',
    '',
    `Cordiali saluti, il team di ${clinic.clinicName}`,
  ].join('\n')
  return { subject, html: emailLayout('Candidatura ricevuta', body, footer), text }
}
