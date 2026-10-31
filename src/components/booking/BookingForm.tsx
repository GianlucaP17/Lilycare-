'use client'

import { CircleCheck, LoaderCircle, Phone, Send } from 'lucide-react'
import Link from 'next/link'
import React, { useActionState, useEffect, useRef } from 'react'

import { type BookingState, submitBooking } from '@/app/(frontend)/prenota/actions'
import { dayOptions, timeOptions } from '@/lib/booking-options'
import { cn, toTelHref } from '@/lib/utils'

type Option = { value: string; label: string }
type Group = { label: string; options: Option[] }

const fieldBase =
  'block w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-base text-ink ring-1 ring-line transition-shadow placeholder:text-muted/60 focus:ring-2 focus:ring-navy-500 focus:outline-none'

function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-navy-950">
        {label}
        {required ? (
          <span className="text-orchid-600"> *</span>
        ) : (
          <span className="font-normal text-muted"> (facoltativo)</span>
        )}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-sm text-muted">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** Modulo di richiesta appuntamento. */
export function BookingForm({
  serviceGroups,
  professionals,
  defaultService,
  defaultProfessional,
  phone,
  responseTime,
}: {
  serviceGroups: Group[]
  professionals: Option[]
  defaultService?: string
  defaultProfessional?: string
  phone?: string | null
  responseTime?: string | null
}) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(submitBooking, {
    status: 'idle',
  })
  const successRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const startedAtRef = useRef<HTMLInputElement>(null)

  // Anti-spam: memorizza quando il modulo è stato aperto la prima volta (i bot inviano in pochi millisecondi).
  // Il valore viene ripristinato anche dopo il reset automatico del modulo in caso di errori.
  const openedAt = useRef(0)
  useEffect(() => {
    if (!openedAt.current) openedAt.current = Date.now()
    if (startedAtRef.current) startedAtRef.current.value = String(openedAt.current)
  })

  useEffect(() => {
    if (state.status === 'success') successRef.current?.focus()
    if (state.status === 'error') errorRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-line outline-none md:p-14"
        role="status"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
          <CircleCheck size={32} aria-hidden />
        </span>
        <h2 className="mt-6 text-3xl font-normal md:text-4xl">
          Grazie{state.name ? `, ${state.name}` : ''}!
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
          Abbiamo ricevuto la tua richiesta.{' '}
          {responseTime || 'Ti ricontatteremo al più presto per concordare data e ora.'}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Ti abbiamo inviato anche un’email di conferma. Se non la trovi, controlla la cartella
          spam.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-navy-800 px-6 py-3 font-medium text-white hover:bg-navy-700"
          >
            Torna alla homepage
          </Link>
          {phone ? (
            <a
              href={toTelHref(phone)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-navy-900 ring-1 ring-line hover:bg-navy-50"
            >
              <Phone size={17} aria-hidden /> {phone}
            </a>
          ) : null}
        </div>
      </div>
    )
  }

  const errors = state.status === 'error' ? (state.errors ?? {}) : {}
  const values = state.status === 'error' ? state.values : undefined
  const describedBy = (name: string) =>
    errors[name as keyof typeof errors] ? `${name}-error` : undefined

  return (
    <form
      action={formAction}
      className="rounded-[2rem] bg-white p-6 ring-1 ring-line sm:p-10"
      noValidate={false}
    >
      {state.status === 'error' ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-800 ring-1 ring-red-200 outline-none"
        >
          {state.message}
        </div>
      ) : null}

      {/* Campi anti-spam (invisibili) */}
      <div className="hidden" aria-hidden>
        <label>
          Non compilare questo campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />
      <input type="hidden" name="sourcePage" value="/prenota" />

      <fieldset>
        <legend className="font-serif text-2xl text-navy-950">1. Di cosa hai bisogno?</legend>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Prestazione" htmlFor="service">
            <select
              id="service"
              name="service"
              defaultValue={values?.service ?? defaultService ?? ''}
              className={cn(
                fieldBase,
                'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20fill=%27none%27%20stroke=%27%231e5257%27%20stroke-width=%272%27%3E%3Cpath%20d=%27m4%206%204%204%204-4%27/%3E%3C/svg%3E")] bg-[position:right_1rem_center] bg-no-repeat pr-10',
              )}
            >
              <option value="">Scegli una prestazione…</option>
              {serviceGroups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="altro">Altro / non so, vorrei un consiglio</option>
            </select>
          </Field>
          <Field label="Professionista" htmlFor="professional">
            <select
              id="professional"
              name="professional"
              defaultValue={values?.professional ?? defaultProfessional ?? ''}
              className={cn(
                fieldBase,
                'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20fill=%27none%27%20stroke=%27%231e5257%27%20stroke-width=%272%27%3E%3Cpath%20d=%27m4%206%204%204%204-4%27/%3E%3C/svg%3E")] bg-[position:right_1rem_center] bg-no-repeat pr-10',
              )}
            >
              <option value="">Nessuna preferenza</option>
              {professionals.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <div className="mt-10 border-t border-line pt-8">
        <fieldset>
          <legend className="font-serif text-2xl text-navy-950">2. Quando preferisci?</legend>
          <p className="mt-2 text-sm text-muted">
            Facoltativo: ci aiuta a proporti l’appuntamento più comodo.
          </p>
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-navy-950">Giorni</p>
            <div className="flex flex-wrap gap-2">
              {dayOptions.map((d) => (
                <label key={d.value} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="preferredDays"
                    value={d.value}
                    defaultChecked={values?.preferredDays.includes(d.value)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex rounded-full bg-cream px-4 py-2.5 text-sm font-medium text-navy-900 ring-1 ring-line transition-colors peer-checked:bg-navy-800 peer-checked:text-white peer-checked:ring-navy-800 peer-focus-visible:ring-2 peer-focus-visible:ring-navy-500">
                    {d.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-navy-950">Fascia oraria</p>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((t) => (
                <label key={t.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="preferredTime"
                    value={t.value}
                    defaultChecked={(values?.preferredTime || 'indifferente') === t.value}
                    className="peer sr-only"
                  />
                  <span className="inline-flex rounded-full bg-cream px-4 py-2.5 text-sm font-medium text-navy-900 ring-1 ring-line transition-colors peer-checked:bg-navy-800 peer-checked:text-white peer-checked:ring-navy-800 peer-focus-visible:ring-2 peer-focus-visible:ring-navy-500">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>
      </div>

      <div className="mt-10 border-t border-line pt-8">
        <fieldset>
          <legend className="font-serif text-2xl text-navy-950">3. I tuoi dati</legend>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field
              label="Nome e cognome"
              htmlFor="name"
              required
              error={errors.name}
              className="md:col-span-2"
            >
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={3}
                autoComplete="name"
                defaultValue={values?.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy('name')}
                className={fieldBase}
              />
            </Field>
            <Field
              label="Telefono"
              htmlFor="phone"
              required
              error={errors.phone}
              hint="Ti chiameremo a questo numero."
            >
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder="+41 …"
                defaultValue={values?.phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy('phone')}
                className={fieldBase}
              />
            </Field>
            <Field label="Email" htmlFor="email" required error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={values?.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy('email')}
                className={fieldBase}
              />
            </Field>
            <Field
              label="Messaggio"
              htmlFor="message"
              className="md:col-span-2"
              hint="Ad esempio il motivo della visita o se hai già una prescrizione. Non è necessario indicare dati clinici dettagliati."
            >
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={2000}
                defaultValue={values?.message}
                className={cn(fieldBase, 'resize-y')}
              />
            </Field>
          </div>
        </fieldset>
      </div>

      <div className="mt-8">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={values?.consent}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy('consent')}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-line accent-navy-800"
          />
          <span>
            Acconsento al trattamento dei miei dati per essere ricontattato/a in merito alla
            richiesta, secondo l’
            <Link
              href="/privacy"
              className="font-medium text-navy-800 underline underline-offset-4"
              target="_blank"
            >
              informativa sulla privacy
            </Link>
            . <span className="text-orchid-600">*</span>
          </span>
        </label>
        {errors.consent ? (
          <p id="consent-error" className="mt-1.5 text-sm font-medium text-red-700" role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          La richiesta non è ancora un appuntamento confermato: ti ricontatteremo noi.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-13 shrink-0 items-center justify-center gap-2.5 rounded-full bg-navy-800 px-8 font-medium text-white shadow-soft transition-colors hover:bg-navy-700 disabled:opacity-60"
        >
          {pending ? (
            <>
              <LoaderCircle size={18} className="animate-spin" aria-hidden /> Invio in corso…
            </>
          ) : (
            <>
              <Send size={18} aria-hidden /> Invia la richiesta
            </>
          )}
        </button>
      </div>
    </form>
  )
}
