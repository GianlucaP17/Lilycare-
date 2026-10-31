import React from 'react'

/**
 * Permette di evidenziare parole nei titoli scrivendo *così* nel pannello admin.
 * "Diagnosi e cura, *in un unico centro*" → "in un unico centro" in corsivo color cipria.
 */
export function Emphasis({ text }: { text?: string | null }) {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <em key={i} className="font-serif text-orchid-600 italic">
            {part.slice(1, -1)}
          </em>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

/** Testo senza asterischi (per meta tag e dati strutturati). */
export const stripEmphasis = (text?: string | null) => (text ?? '').replace(/\*/g, '')
