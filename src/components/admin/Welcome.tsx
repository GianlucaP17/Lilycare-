import Link from 'next/link'
import type { ServerProps } from 'payload'
import React from 'react'

/** Riquadro di benvenuto in cima alla dashboard: scorciatoie e cose da fare. */
export async function Welcome({ payload, user }: ServerProps) {
  const [{ totalDocs: newRequests }, { totalDocs: aiToReview }, { totalDocs: newApplications }] =
    await Promise.all([
      payload.count({
        collection: 'booking-requests',
        where: { status: { equals: 'nuova' } },
      }),
      payload.count({
        collection: 'articles',
        where: { and: [{ aiStatus: { equals: 'ready' } }, { _status: { equals: 'draft' } }] },
      }),
      payload.count({
        collection: 'job-applications',
        where: { status: { equals: 'nuova' } },
      }),
    ])

  const name = (user as { name?: string } | undefined)?.name?.split(' ')[0]
  const plural = (n: number, uno: string, molti: string) => (n === 1 ? uno : molti)

  const shortcuts: {
    href: string
    title: string
    text: string
    accent?: boolean
  }[] = [
    {
      href: '/admin/collections/booking-requests?where[status][equals]=nuova',
      title: newRequests
        ? `${newRequests} ${plural(newRequests, 'nuova richiesta', 'nuove richieste')}`
        : 'Richieste di appuntamento',
      text: newRequests ? 'Pazienti da ricontattare' : 'Nessuna richiesta in attesa',
      accent: newRequests > 0,
    },
    {
      href: '/admin/collections/articles',
      title: aiToReview
        ? `${aiToReview} ${plural(aiToReview, 'bozza AI da rivedere', 'bozze AI da rivedere')}`
        : 'Assistente AI',
      text: aiToReview ? 'Rileggi, correggi e pubblica' : 'Prepara la bozza di un articolo',
      accent: aiToReview > 0,
    },
    {
      href: '/admin/collections/job-applications?where[status][equals]=nuova',
      title: newApplications
        ? `${newApplications} ${plural(newApplications, 'nuova candidatura', 'nuove candidature')}`
        : 'Candidature',
      text: newApplications ? 'Curriculum da leggere' : 'Lavora con noi',
      accent: newApplications > 0,
    },
    {
      href: '/admin/collections/articles/create',
      title: 'Scrivi un articolo',
      text: 'Notizie e approfondimenti',
    },
    {
      href: '/admin/collections/services',
      title: 'Servizi',
      text: 'Modifica o aggiungi prestazioni',
    },
    { href: '/admin/collections/team', title: 'Team', text: 'Profili e curriculum' },
    {
      href: '/admin/globals/settings',
      title: 'Dati dello studio',
      text: 'Telefono, orari, indirizzo',
    },
    { href: '/', title: 'Vedi il sito', text: 'Apre lilycare.ch in una scheda' },
  ]

  return (
    <div className="lily-welcome">
      <p className="lily-eyebrow">Pannello LilyCare</p>
      <h2 className="lily-welcome__title">Buongiorno{name ? `, ${name}` : ''}</h2>
      <p className="lily-welcome__intro">
        Da qui gestisci tutto il sito: contenuti, servizi, team, notizie e le richieste dei
        pazienti. Le modifiche salvate compaiono subito online.
      </p>
      <div className="lily-welcome__grid">
        {shortcuts.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`lily-card${s.accent ? ' lily-card--accent' : ''}`}
          >
            <span className="lily-card__title">{s.title}</span>
            <span className="lily-card__text">{s.text}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
