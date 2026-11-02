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

/** Email allo studio: è arrivata una candidatura. */
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
      ${row('Presentazione', data.message ? nl2br(data.message) : '—')}
    </table>
    <p style="margin:24px 0 0;padding:14px 16px;background:#f3f6fc;border-radius:10px;font-size:14px;">
      Il curriculum non passa dal sito: la persona è stata invitata a inviarlo per email.
    </p>
    ${
      clinic.adminUrl
        ? `<p style="margin:20px 0 0;"><a href="${escapeHtml(clinic.adminUrl)}" style="display:inline-block;background:#284a9f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px;">Apri nel pannello admin</a></p>`
        : ''
    }`
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
    `Presentazione: ${data.message || '—'}`,
  ].join('\n')
  return { subject, html: emailLayout('Nuova candidatura', body, footer), text }
}

/** Email al candidato: candidatura ricevuta, con l'indirizzo a cui mandare il CV. */
export function candidateConfirmationEmail(data: JobEmailData, clinic: ClinicInfo) {
  const subject = `Abbiamo ricevuto la tua candidatura – ${clinic.clinicName}`
  const firstName = data.name.split(' ')[0]
  const cvAddress = clinic.email || 'info@lilycare.ch'
  const body = `
    <p style="margin:0 0 16px;">Gentile ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 16px;">grazie per il tuo interesse. Abbiamo ricevuto la tua candidatura come <strong>${escapeHtml(
      data.roleLabel,
    )}</strong> e la leggeremo con attenzione.</p>
    <p style="margin:0 0 16px;padding:14px 16px;background:#f8e7f2;border-radius:10px;font-size:14px;">
      <strong>Manca ancora una cosa:</strong> inviaci il tuo curriculum in allegato, rispondendo a questa email oppure scrivendo a
      <a href="mailto:${escapeHtml(cvAddress)}" style="color:#2f55b4;font-weight:600;">${escapeHtml(cvAddress)}</a>.
      Senza il CV non possiamo valutare la candidatura.
    </p>
    <p style="margin:0 0 16px;">Ti ricontatteremo se il tuo profilo corrisponde a una posizione aperta o a un'esigenza futura del centro.</p>
    <p style="margin:24px 0 0;">Cordiali saluti,<br>il team di ${escapeHtml(clinic.clinicName)}</p>`
  const footer = `${escapeHtml(clinic.clinicName)}${clinic.address ? ` · ${escapeHtml(clinic.address)}` : ''}`
  const text = [
    `Gentile ${firstName},`,
    '',
    `abbiamo ricevuto la tua candidatura come ${data.roleLabel}.`,
    '',
    `Inviaci il curriculum in allegato rispondendo a questa email oppure scrivendo a ${cvAddress}.`,
    '',
    `Cordiali saluti, il team di ${clinic.clinicName}`,
  ].join('\n')
  return { subject, html: emailLayout('Candidatura ricevuta', body, footer), text }
}
