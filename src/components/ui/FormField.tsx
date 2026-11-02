import React from 'react'

/** Stile comune dei campi di testo dei moduli. */
export const fieldBase =
  'block w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-base text-ink ring-1 ring-line transition-shadow placeholder:text-muted/60 focus:ring-2 focus:ring-navy-500 focus:outline-none'

/** Etichetta, suggerimento ed errore di un campo, con i collegamenti per i lettori di schermo. */
export function Field({
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
