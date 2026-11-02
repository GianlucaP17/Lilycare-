'use client'

import { CircleCheck, LoaderCircle, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import React, { useActionState, useEffect, useRef } from 'react'

import { type JobState, submitApplication } from '@/app/(frontend)/lavora-con-noi/actions'
import { Field, fieldBase } from '@/components/ui/FormField'
import { availabilityOptions, collaborationOptions, roleOptions } from '@/lib/job-options'
import { cn } from '@/lib/utils'

/** Modulo di candidatura. Il curriculum non passa dal sito: si invia per email. */
export function JobForm({ cvEmail }: { cvEmail: string }) {
  const [state, formAction, pending] = useActionState<JobState, FormData>(submitApplication, {
    status: 'idle',
  })
  const formRef = useRef<HTMLFormElement>(null)
  const startedAtRef = useRef<HTMLInputElement>(null)
  const openedAt = useRef(0)
  const [showOther, setShowOther] = React.useState(false)

  useEffect(() => {
    if (!openedAt.current) openedAt.current = Date.now()
    if (startedAtRef.current) startedAtRef.current.value = String(openedAt.current)
  }, [state])

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state.status])

  const errors = state.status === 'error' ? (state.errors ?? {}) : {}
  const values = state.status === 'error' ? state.values : undefined
  const describedBy = (name: string) =>
    errors[name as keyof typeof errors] ? `${name}-error` : undefined

  if (state.status === 'success') {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-line sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-700">
          <CircleCheck size={28} aria-hidden />
        </span>
        <h2 className="mt-6 font-serif text-3xl text-navy-950">Grazie, {state.name}</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          Abbiamo ricevuto la tua candidatura e ti abbiamo scritto un’email di conferma.
        </p>
        <p className="mx-auto mt-6 max-w-md rounded-2xl bg-orchid-50 p-5 text-left leading-relaxed text-ink">
          <strong className="text-navy-950">Manca il curriculum.</strong> Inviacelo in allegato a{' '}
          <a href={`mailto:${cvEmail}`} className="font-semibold text-navy-700 underline">
            {cvEmail}
          </a>
          , oppure rispondendo all’email che hai appena ricevuto.
        </p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-line sm:p-10"
    >
      {/* Campi anti-spam (invisibili) */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="website">Non compilare</label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      <div className="grid gap-5 md:grid-cols-2">
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

        <Field label="Telefono" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+41 …"
            defaultValue={values?.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy('phone')}
            className={fieldBase}
          />
        </Field>

        <Field label="Profilo" htmlFor="role" required error={errors.role}>
          <select
            id="role"
            name="role"
            required
            defaultValue={values?.role ?? ''}
            onChange={(e) => setShowOther(e.target.value === 'altro')}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={describedBy('role')}
            className={fieldBase}
          >
            <option value="">Scegli…</option>
            {roleOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Disponibilità" htmlFor="availability" error={errors.availability}>
          <select
            id="availability"
            name="availability"
            defaultValue={values?.availability ?? ''}
            className={fieldBase}
          >
            <option value="">Da concordare</option>
            {availabilityOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        {showOther || values?.role === 'altro' ? (
          <Field
            label="Quale profilo"
            htmlFor="roleOther"
            required
            error={errors.roleOther}
            className="md:col-span-2"
          >
            <input
              id="roleOther"
              name="roleOther"
              type="text"
              defaultValue={values?.roleOther}
              placeholder="Es. fisioterapista, osteopata…"
              aria-describedby={describedBy('roleOther')}
              className={fieldBase}
            />
          </Field>
        ) : null}

        <Field
          label="Tipo di collaborazione"
          htmlFor="collaboration"
          error={errors.collaboration}
          className="md:col-span-2"
        >
          <select
            id="collaboration"
            name="collaboration"
            defaultValue={values?.collaboration ?? ''}
            className={fieldBase}
          >
            <option value="">Da valutare insieme</option>
            {collaborationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Presentati in breve"
          htmlFor="message"
          required
          error={errors.message}
          hint="Formazione, esperienza, cosa cerchi. Due o tre frasi bastano."
          className="md:col-span-2"
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            minLength={20}
            defaultValue={values?.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy('message')}
            className={cn(fieldBase, 'resize-y')}
          />
        </Field>
      </div>

      <div className="mt-8 rounded-2xl bg-sand-100 p-5">
        <p className="flex gap-3 text-sm leading-relaxed text-ink">
          <Mail size={18} className="mt-0.5 shrink-0 text-navy-600" aria-hidden />
          <span>
            Il <strong>curriculum</strong> non si allega qui: dopo l’invio ti arriva un’email, e
            basta rispondere allegandolo. Così il tuo CV resta nella nostra casella di posta e non
            sul sito.
          </span>
        </p>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-ink">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={values?.consent}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-navy-700 focus:ring-navy-500"
          />
          <span>
            Acconsento al trattamento dei miei dati per la valutazione della candidatura, come
            indicato nell’
            <Link href="/privacy" className="font-medium text-navy-700 underline">
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

      {state.status === 'error' ? (
        <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-800" role="alert">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-700 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60 sm:w-auto"
      >
        {pending ? (
          <>
            <LoaderCircle size={18} className="animate-spin" aria-hidden /> Invio…
          </>
        ) : (
          <>
            <Send size={18} aria-hidden /> Invia la candidatura
          </>
        )}
      </button>
    </form>
  )
}
