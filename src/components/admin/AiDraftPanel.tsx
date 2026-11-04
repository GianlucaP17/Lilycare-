'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Option = { id: number; title: string }
type Status = {
  configured: boolean
  model: string
  dailyEnabled: boolean
  cronConfigured: boolean
  remainingToday: number
  defaultLength: 'breve' | 'media' | 'lunga'
  coverImages?: 'on' | 'off' | 'no-key'
  coverImageModel?: string
  lastDaily?: { at: string; outcome: string } | null
}
type Job =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'generating'; id: number; startedAt: number }
  | { state: 'ready'; id: number; title: string; notes?: string | null }
  | { state: 'error'; message: string; id?: number }

const box: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 12,
  background: 'var(--theme-elevation-50)',
  padding: '18px 20px',
  marginBottom: 24,
}
const input: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid var(--theme-elevation-200)',
  background: 'var(--theme-input-bg, var(--theme-elevation-0))',
  color: 'var(--theme-text)',
  font: 'inherit',
}
const label: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
}
const button: React.CSSProperties = {
  padding: '10px 18px',
  borderRadius: 999,
  border: 'none',
  background: 'var(--theme-elevation-900)',
  color: 'var(--theme-elevation-0)',
  fontWeight: 600,
  cursor: 'pointer',
}

/** Assistente AI nella lista Articoli: prepara una bozza da rileggere. */
export function AiDraftPanel() {
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState<Status | null>(null)
  const [categories, setCategories] = useState<Option[]>([])
  const [services, setServices] = useState<Option[]>([])
  const [topic, setTopic] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [serviceIds, setServiceIds] = useState<number[]>([])
  const [length, setLength] = useState<'breve' | 'media' | 'lunga'>('media')
  const [notes, setNotes] = useState('')
  const [job, setJob] = useState<Job>({ state: 'idle' })

  useEffect(() => {
    let active = true
    Promise.all([
      fetch('/next/ai/status', { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/article-categories?limit=100&depth=0&sort=title', {
        credentials: 'include',
      }).then((r) => r.json()),
      fetch('/api/services?limit=100&depth=0&sort=order', { credentials: 'include' }).then((r) =>
        r.json(),
      ),
    ])
      .then(([s, c, sv]) => {
        if (!active) return
        if (s) {
          setStatus(s as Status)
          setLength((s as Status).defaultLength)
        }
        setCategories((c?.docs ?? []).map((d: Option) => ({ id: d.id, title: d.title })))
        setServices((sv?.docs ?? []).map((d: Option) => ({ id: d.id, title: d.title })))
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  // Controlla ogni 4 secondi se la bozza in preparazione è pronta
  useEffect(() => {
    if (job.state !== 'generating') return
    const { id, startedAt } = job
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/articles/${id}?depth=0&draft=true`, {
          credentials: 'include',
        })
        const doc = await res.json()
        if (doc?.aiStatus === 'ready') {
          setJob({ state: 'ready', id, title: doc.title, notes: doc.aiReviewNotes })
          return
        }
        if (doc?.aiStatus === 'error') {
          setJob({ state: 'error', id, message: doc.aiReviewNotes || 'Bozza non riuscita.' })
          return
        }
      } catch {
        // rete momentaneamente non disponibile: si riprova al giro successivo
      }
      if (Date.now() - startedAt > 6 * 60 * 1000) {
        setJob({
          state: 'error',
          id,
          message:
            'La preparazione sta richiedendo più del previsto. Controlla tra qualche minuto l’elenco degli articoli.',
        })
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [job])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setJob({ state: 'sending' })
    try {
      const res = await fetch('/next/ai/draft', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          notes,
          length,
          categoryId: categoryId ? Number(categoryId) : null,
          serviceIds,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setJob({ state: 'error', message: data?.error || 'Richiesta non riuscita.' })
        return
      }
      setJob({ state: 'generating', id: data.id, startedAt: Date.now() })
      setStatus((s) => (s ? { ...s, remainingToday: Math.max(0, s.remainingToday - 1) } : s))
    } catch {
      setJob({ state: 'error', message: 'Connessione non riuscita. Riprova.' })
    }
  }

  const busy = job.state === 'sending' || job.state === 'generating'

  return (
    <div style={box}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>✨ Assistente AI – prepara una bozza</div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            L’assistente scrive una bozza in circa un minuto. Non pubblica nulla: rileggi, correggi
            e pubblica tu.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            ...button,
            background: 'transparent',
            color: 'var(--theme-text)',
            border: '1px solid var(--theme-elevation-200)',
          }}
        >
          {open ? 'Chiudi' : 'Apri'}
        </button>
      </div>

      {open ? (
        status && !status.configured ? (
          <p style={{ marginTop: 16, fontSize: 14 }}>
            L’assistente non è ancora attivo: sul server manca la chiave{' '}
            <code>ANTHROPIC_API_KEY</code>. Vedi il README, sezione “Assistente AI”.
          </p>
        ) : (
          <form onSubmit={submit} style={{ marginTop: 18, display: 'grid', gap: 14 }}>
            <div>
              <label htmlFor="ai-topic" style={label}>
                Argomento
              </label>
              <input
                id="ai-topic"
                style={input}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Es. Mal di schiena al risveglio: cause e quando rivolgersi al medico (vuoto = sceglie l’assistente)"
                maxLength={300}
                disabled={busy}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
              }}
            >
              <div>
                <label htmlFor="ai-category" style={label}>
                  Categoria
                </label>
                <select
                  id="ai-category"
                  style={input}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={busy}
                >
                  <option value="">Scelta dall’assistente</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ai-length" style={label}>
                  Lunghezza
                </label>
                <select
                  id="ai-length"
                  style={input}
                  value={length}
                  onChange={(e) => setLength(e.target.value as 'breve' | 'media' | 'lunga')}
                  disabled={busy}
                >
                  <option value="breve">Breve (circa 600 parole)</option>
                  <option value="media">Media (circa 900 parole)</option>
                  <option value="lunga">Lunga (circa 1200 parole)</option>
                </select>
              </div>
            </div>
            {services.length ? (
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={label}>Servizi da collegare (facoltativo)</legend>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {services.map((s) => {
                    const checked = serviceIds.includes(s.id)
                    return (
                      <label
                        key={s.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 999,
                          border: '1px solid var(--theme-elevation-200)',
                          background: checked ? 'var(--theme-elevation-150)' : 'transparent',
                          fontSize: 13,
                          cursor: busy ? 'default' : 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={busy}
                          onChange={() =>
                            setServiceIds((ids) =>
                              checked ? ids.filter((i) => i !== s.id) : [...ids, s.id].slice(0, 5),
                            )
                          }
                        />
                        {s.title}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ) : null}
            <div>
              <label htmlFor="ai-notes" style={label}>
                Indicazioni per l’assistente (facoltative)
              </label>
              <textarea
                id="ai-notes"
                style={{ ...input, minHeight: 70, resize: 'vertical' }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Es. rivolto a sportivi; citare la possibilità di una visita con ecografia"
                maxLength={2000}
                disabled={busy}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
              <button type="submit" style={{ ...button, opacity: busy ? 0.6 : 1 }} disabled={busy}>
                {job.state === 'sending'
                  ? 'Invio…'
                  : job.state === 'generating'
                    ? 'Bozza in preparazione…'
                    : 'Prepara la bozza'}
              </button>
              {status ? (
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  Ancora {status.remainingToday} bozze disponibili oggi ·{' '}
                  <Link href="/admin/globals/ai-assistant">
                    piano editoriale e bozza giornaliera
                  </Link>
                  {status.coverImages === 'on' ? (
                    <> · immagine di copertina: attiva ({status.coverImageModel})</>
                  ) : status.coverImages === 'no-key' ? (
                    <>
                      {' '}
                      ·{' '}
                      <strong style={{ color: '#b5609a' }}>
                        immagine di copertina: manca OPENAI_API_KEY sul server
                      </strong>
                    </>
                  ) : status.coverImages === 'off' ? (
                    <> · immagine di copertina: disattivata</>
                  ) : null}
                </span>
              ) : null}
            </div>

            {status ? (
              <p style={{ margin: 0, fontSize: 12, opacity: 0.75, lineHeight: 1.6 }}>
                <strong>Bozza automatica giornaliera:</strong>{' '}
                {status.dailyEnabled ? 'attiva' : 'disattivata'}
                {!status.cronConfigured ? (
                  <>
                    {' · '}
                    <strong style={{ color: '#b5609a' }}>
                      manca CRON_SECRET fra le variabili del server
                    </strong>
                  </>
                ) : null}
                {' · '}
                {status.lastDaily ? (
                  <>
                    ultima chiamata del cron:{' '}
                    {new Date(status.lastDaily.at).toLocaleString('it-CH', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {status.lastDaily.outcome ? ` — ${status.lastDaily.outcome}` : ''}
                  </>
                ) : (
                  <strong style={{ color: '#b5609a' }}>
                    il cron di cPanel non ha mai chiamato il sito
                  </strong>
                )}
              </p>
            ) : null}

            {job.state === 'generating' ? (
              <p role="status" style={{ margin: 0, fontSize: 14 }}>
                ⏳ L’assistente sta scrivendo la bozza (di solito circa un minuto). Puoi anche
                lasciare questa pagina: la troverai nell’elenco e riceverai un’email quando è
                pronta.
              </p>
            ) : null}
            {job.state === 'ready' ? (
              <div
                role="status"
                style={{
                  fontSize: 14,
                  padding: 14,
                  borderRadius: 10,
                  background: 'var(--theme-success-50)',
                }}
              >
                ✅ Bozza pronta: <strong>{job.title}</strong>
                {job.notes ? (
                  <div style={{ whiteSpace: 'pre-line', marginTop: 8, opacity: 0.85 }}>
                    <strong>Da verificare:</strong>
                    {'\n'}
                    {job.notes}
                  </div>
                ) : null}
                <div style={{ marginTop: 10 }}>
                  <Link href={`/admin/collections/articles/${job.id}`} style={{ fontWeight: 600 }}>
                    Apri la bozza e rileggila →
                  </Link>
                </div>
              </div>
            ) : null}
            {job.state === 'error' ? (
              <div
                role="alert"
                style={{
                  fontSize: 14,
                  padding: 14,
                  borderRadius: 10,
                  background: 'var(--theme-error-50)',
                }}
              >
                ⚠️ {job.message}
                {job.id ? (
                  <>
                    {' '}
                    <Link href={`/admin/collections/articles/${job.id}`}>Apri</Link>
                  </>
                ) : null}
              </div>
            ) : null}
          </form>
        )
      ) : null}
    </div>
  )
}
