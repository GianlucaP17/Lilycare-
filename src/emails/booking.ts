import { dayOptions, labelFor, timeOptions } from '@/lib/booking-options'

export type BookingEmailData = {
  name: string
  phone: string
  email: string
  serviceLabel?: string | null
  professionalLabel?: string | null
  preferredDays?: string[] | null
  preferredTime?: string | null
  message?: string | null
  createdAt?: string
}

type ClinicInfo = {
  clinicName: string
  phone?: string | null
  email?: string | null
  address?: string | null
  siteUrl: string
  adminUrl?: string
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const nl2br = (value: string) => escapeHtml(value).replace(/\n/g, '<br>')

const formatDays = (days?: string[] | null) =>
  days && days.length ? days.map((d) => labelFor(dayOptions, d)).join(', ') : 'Nessuna preferenza'

const layout = (title: string, body: string, footer: string) => `<!doctype html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f6f3ee;font-family:Helvetica,Arial,sans-serif;color:#1d2b2f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#163e42;padding:28px 32px;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#ffffff;letter-spacing:0.3px;">LilyCare</div>
          <div style="font-size:13px;color:#cfe2e1;margin-top:4px;">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.6;">${body}</td></tr>
        <tr><td style="padding:20px 32px;background:#faf8f5;font-size:12px;line-height:1.6;color:#5b6b6f;">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #eee7dd;color:#5b6b6f;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eee7dd;font-weight:600;vertical-align:top;">${value}</td>
  </tr>`

/** Email allo studio: nuova richiesta di appuntamento. */
export function clinicNotificationEmail(data: BookingEmailData, clinic: ClinicInfo) {
  const subject = `Nuova richiesta di appuntamento – ${data.name}${data.serviceLabel ? ` (${data.serviceLabel})` : ''}`
  const telHref = `tel:${data.phone.replace(/[^\d+]/g, '')}`
  const body = `
    <p style="margin:0 0 16px;">È arrivata una nuova richiesta di appuntamento dal sito.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      ${row('Nome', escapeHtml(data.name))}
      ${row('Telefono', `<a href="${escapeHtml(telHref)}" style="color:#1e5257;">${escapeHtml(data.phone)}</a>`)}
      ${row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:#1e5257;">${escapeHtml(data.email)}</a>`)}
      ${row('Prestazione', escapeHtml(data.serviceLabel || 'Da definire'))}
      ${row('Professionista', escapeHtml(data.professionalLabel || 'Nessuna preferenza'))}
      ${row('Giorni preferiti', escapeHtml(formatDays(data.preferredDays)))}
      ${row('Fascia oraria', escapeHtml(labelFor(timeOptions, data.preferredTime) || 'Indifferente'))}
      ${row('Messaggio', data.message ? nl2br(data.message) : '—')}
    </table>
    ${
      clinic.adminUrl
        ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(clinic.adminUrl)}" style="display:inline-block;background:#163e42;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px;">Apri nel pannello admin</a></p>`
        : ''
    }`
  const footer = `Rispondi direttamente a questa email per scrivere al paziente. La richiesta è salvata anche nel pannello admin, sezione "Richieste di appuntamento".`
  const text = [
    'Nuova richiesta di appuntamento',
    `Nome: ${data.name}`,
    `Telefono: ${data.phone}`,
    `Email: ${data.email}`,
    `Prestazione: ${data.serviceLabel || 'Da definire'}`,
    `Professionista: ${data.professionalLabel || 'Nessuna preferenza'}`,
    `Giorni preferiti: ${formatDays(data.preferredDays)}`,
    `Fascia oraria: ${labelFor(timeOptions, data.preferredTime) || 'Indifferente'}`,
    `Messaggio: ${data.message || '—'}`,
  ].join('\n')
  return { subject, html: layout('Nuova richiesta di appuntamento', body, footer), text }
}

/** Email di conferma al paziente: richiesta ricevuta (non ancora appuntamento confermato). */
export function patientConfirmationEmail(
  data: BookingEmailData,
  clinic: ClinicInfo,
  responseTime?: string | null,
) {
  const subject = `Abbiamo ricevuto la tua richiesta – ${clinic.clinicName}`
  const firstName = data.name.split(' ')[0]
  const body = `
    <p style="margin:0 0 16px;">Gentile ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 16px;">grazie per averci contattato. Abbiamo ricevuto la tua richiesta di appuntamento${
      data.serviceLabel ? ` per <strong>${escapeHtml(data.serviceLabel)}</strong>` : ''
    }.</p>
    <p style="margin:0 0 16px;">${escapeHtml(
      responseTime || 'Ti ricontatteremo al più presto per concordare data e ora della visita.',
    )}</p>
    <p style="margin:0 0 16px;padding:14px 16px;background:#f1f7f7;border-radius:10px;font-size:14px;">
      <strong>Nota:</strong> questa email conferma la ricezione della richiesta, non l’appuntamento. L’appuntamento è fissato solo dopo il nostro contatto.
    </p>
    ${
      clinic.phone
        ? `<p style="margin:0 0 16px;">Per qualsiasi necessità puoi chiamarci al <a href="tel:${escapeHtml(
            clinic.phone.replace(/[^\d+]/g, ''),
          )}" style="color:#1e5257;font-weight:600;">${escapeHtml(clinic.phone)}</a>.</p>`
        : ''
    }
    <p style="margin:24px 0 0;">Cordiali saluti,<br>il team di ${escapeHtml(clinic.clinicName)}</p>`
  const footer = `${escapeHtml(clinic.clinicName)}${clinic.address ? ` · ${escapeHtml(clinic.address)}` : ''}<br>
    <a href="${escapeHtml(clinic.siteUrl)}" style="color:#5b6b6f;">${escapeHtml(clinic.siteUrl.replace(/^https?:\/\//, ''))}</a><br>
    In caso di emergenza chiama il 144.`
  const text = [
    `Gentile ${firstName},`,
    '',
    `grazie per averci contattato. Abbiamo ricevuto la tua richiesta di appuntamento${
      data.serviceLabel ? ` per ${data.serviceLabel}` : ''
    }.`,
    responseTime || 'Ti ricontatteremo al più presto per concordare data e ora della visita.',
    '',
    'Nota: questa email conferma la ricezione della richiesta, non l’appuntamento.',
    clinic.phone ? `Telefono: ${clinic.phone}` : '',
    '',
    `Il team di ${clinic.clinicName}`,
    'In caso di emergenza chiama il 144.',
  ].join('\n')
  return { subject, html: layout('Richiesta ricevuta', body, footer), text }
}
