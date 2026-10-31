import Link from 'next/link'
import type { ServerProps } from 'payload'
import React from 'react'

const card: React.CSSProperties = {
  display: 'block',
  padding: '18px 20px',
  borderRadius: 12,
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-elevation-0)',
  textDecoration: 'none',
  color: 'inherit',
}

/** Pannello di benvenuto in cima alla dashboard, con scorciatoie e richieste da gestire. */
export async function Welcome({ payload, user }: ServerProps) {
  const { totalDocs: newRequests } = await payload.count({
    collection: 'booking-requests',
    where: { status: { equals: 'nuova' } },
  })
  const { totalDocs: aiToReview } = await payload.count({
    collection: 'articles',
    where: { and: [{ aiStatus: { equals: 'ready' } }, { _status: { equals: 'draft' } }] },
  })
  const name = (user as { name?: string } | undefined)?.name?.split(' ')[0]

  const shortcuts = [
    {
      href: '/admin/collections/booking-requests?where[status][equals]=nuova',
      title:
        newRequests === 1
          ? '1 nuova richiesta'
          : newRequests > 1
            ? `${newRequests} nuove richieste`
            : 'Richieste di appuntamento',
      text: newRequests ? 'Da ricontattare' : 'Nessuna richiesta in attesa',
      highlight: newRequests > 0,
    },
    {
      href: '/admin/collections/articles',
      title: aiToReview ? `${aiToReview} bozze AI da rivedere` : '✨ Assistente AI',
      text: aiToReview ? 'Rileggi e pubblica' : 'Prepara la bozza di un articolo',
      highlight: aiToReview > 0,
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
    { href: '/', title: 'Vedi il sito', text: 'Apre il sito pubblico' },
  ]

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 26 }}>Buongiorno{name ? `, ${name}` : ''} 👋</h2>
      <p style={{ margin: '0 0 20px', opacity: 0.75 }}>
        Da qui gestisci tutto il sito di LilyCare: contenuti, team, notizie e richieste dei
        pazienti.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 12,
        }}
      >
        {shortcuts.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              ...card,
              ...(s.highlight
                ? { borderColor: 'var(--theme-success-500)', background: 'var(--theme-success-50)' }
                : {}),
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{s.text}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
