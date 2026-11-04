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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('it-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

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
    <div className="lily-panel">
      <div className="lily-ai__head">
        <div>
          <p className="lily-eyebrow">Assistente AI</p>
          <h2 className="lily-ai__title">Prepara una bozza</h2>
          <p className="lily-ai__subtitle">
            L’assistente scrive una bozza in circa un minuto. Non pubblica nulla: rileggi, correggi
            e pubblica tu.
          </p>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="lily-ai__toggle">
          {open ? 'Chiudi' : 'Apri'}
        </button>
      </div>

      {open ? (
        status && !status.configured ? (
          <p className="lily-ai__note lily-ai__note--bad" style={{ marginTop: 18 }}>
            L’assistente non è ancora attivo: sul server manca la chiave{' '}
            <code>ANTHROPIC_API_KEY</code>. Vedi il README, sezione “Assistente AI”.
          </p>
        ) : (
          <form onSubmit={submit} className="lily-ai__form">
            <div>
              <label htmlFor="ai-topic" className="lily-ai__label">
                Argomento
              </label>
              <input
                id="ai-topic"
                className="lily-ai__input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Es. Mal di schiena al risveglio: cause e quando rivolgersi al medico (vuoto = sceglie l’assistente)"
                maxLength={300}
                disabled={busy}
              />
            </div>

            <div className="lily-ai__row">
              <div>
                <label htmlFor="ai-category" className="lily-ai__label">
                  Categoria
                </label>
                <select
                  id="ai-category"
                  className="lily-ai__input"
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
                <label htmlFor="ai-length" className="lily-ai__label">
                  Lunghezza
                </label>
                <select
                  id="ai-length"
                  className="lily-ai__input"
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
              <fieldset className="lily-ai__chips-wrap">
                <legend className="lily-ai__label">Servizi da collegare (facoltativo)</legend>
                <div className="lily-ai__chips">
                  {services.map((s) => {
                    const checked = serviceIds.includes(s.id)
                    return (
                      <label
                        key={s.id}
                        className={`lily-ai__chip${checked ? ' lily-ai__chip--on' : ''}`}
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
              <label htmlFor="ai-notes" className="lily-ai__label">
                Indicazioni per l’assistente (facoltative)
              </label>
              <textarea
                id="ai-notes"
                className="lily-ai__input"
                style={{ minHeight: 76, resize: 'vertical' }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Es. rivolto a sportivi; citare la possibilità di una visita con ecografia"
                maxLength={2000}
                disabled={busy}
              />
            </div>

            <div className="lily-ai__actions">
              <button type="submit" className="lily-ai__go" disabled={busy}>
                {job.state === 'sending'
                  ? 'Invio…'
                  : job.state === 'generating'
                    ? 'Bozza in preparazione…'
                    : 'Prepara la bozza'}
              </button>
              {status ? (
                <span className="lily-ai__meta">
                  Ancora {status.remainingToday} bozze disponibili oggi ·{' '}
                  <Link href="/admin/globals/ai-assistant">
                    piano editoriale e bozza giornaliera
                  </Link>
                  {status.coverImages === 'on' ? (
                    <> · immagine di copertina: attiva ({status.coverImageModel})</>
                  ) : status.coverImages === 'no-key' ? (
                    <>
                      {' · '}
                      <span className="lily-ai__warn">
                        immagine di copertina: manca OPENAI_API_KEY sul server
                      </span>
                    </>
                  ) : status.coverImages === 'off' ? (
                    <> · immagine di copertina: disattivata</>
                  ) : null}
                </span>
              ) : null}
            </div>

            {status ? (
              <p className="lily-ai__meta" style={{ margin: 0 }}>
                <strong>Bozza automatica giornaliera:</strong>{' '}
                {status.dailyEnabled ? 'attiva' : 'disattivata'}
                {!status.cronConfigured ? (
                  <>
                    {' · '}
                    <span className="lily-ai__warn">
                      manca CRON_SECRET fra le variabili del server
                    </span>
                  </>
                ) : null}
                {' · '}
                {status.lastDaily ? (
                  <>
                    ultima chiamata del cron: {formatDate(status.lastDaily.at)}
                    {status.lastDaily.outcome ? ` — ${status.lastDaily.outcome}` : ''}
                  </>
                ) : (
                  <span className="lily-ai__warn">
                    il cron di cPanel non ha mai chiamato il sito
                  </span>
                )}
              </p>
            ) : null}

            {job.state === 'generating' ? (
              <p role="status" className="lily-ai__note lily-ai__note--wait">
                L’assistente sta scrivendo la bozza (di solito circa un minuto). Puoi anche lasciare
                questa pagina: la troverai nell’elenco e riceverai un’email quando è pronta.
              </p>
            ) : null}

            {job.state === 'ready' ? (
              <div role="status" className="lily-ai__note lily-ai__note--ok">
                Bozza pronta: <strong>{job.title}</strong>
                {job.notes ? (
                  <span style={{ display: 'block', whiteSpace: 'pre-line', marginTop: 8 }}>
                    <strong>Da verificare:</strong>
                    {'\n'}
                    {job.notes}
                  </span>
                ) : null}
                <span style={{ display: 'block', marginTop: 10 }}>
                  <Link href={`/admin/collections/articles/${job.id}`}>
                    <strong>Apri la bozza e rileggila →</strong>
                  </Link>
                </span>
              </div>
            ) : null}

            {job.state === 'error' ? (
              <div role="alert" className="lily-ai__note lily-ai__note--bad">
                {job.message}
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
