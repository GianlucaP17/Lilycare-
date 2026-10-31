/** Struttura grafica comune delle email di LilyCare. */
import { getServerUrl } from '@/lib/utils'

export const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const nl2br = (value: string) => escapeHtml(value).replace(/\n/g, '<br>')

export const emailButton = (href: string, label: string) =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;background:#284a9f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px;">${escapeHtml(label)}</a>`

export const emailLayout = (title: string, body: string, footer: string) => `<!doctype html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f6f3ee;font-family:Helvetica,Arial,sans-serif;color:#1c2540;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px 18px;border-bottom:3px solid #cf7eb4;">
          <img src="${escapeHtml(getServerUrl())}/brand/lilycare-logo-email.png" width="180" alt="LilyCare Medical Center" style="display:block;width:180px;max-width:100%;height:auto;border:0;font-family:Georgia,serif;font-size:22px;color:#2f55b4;">
          <div style="font-size:13px;color:#586178;margin-top:12px;">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.6;">${body}</td></tr>
        <tr><td style="padding:20px 32px;background:#fbf9f6;font-size:12px;line-height:1.6;color:#586178;">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
