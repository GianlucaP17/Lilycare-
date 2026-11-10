'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

/**
 * Collegamento per aprire il curriculum allegato alla candidatura.
 *
 * Non si usa il collegamento del file di Payload perché, su alcuni browser, un clic su un
 * semplice collegamento non manda le intestazioni che il controllo anti-CSRF di Payload
 * pretende per accettare il cookie: la risposta era "Non sei autorizzato" anche da collegati.
 * Questo punta a /next/candidature/<id>/cv, che legge il token dal cookie e applica
 * comunque i permessi della collezione.
 */
export function CvLink() {
  const { id } = useDocumentInfo()
  if (!id) return null
  return (
    <div className="lily-cv">
      <span className="lily-cv__etichetta">Curriculum</span>
      <div className="lily-cv__riga">
        <a
          className="lily-cv__link"
          href={`/next/candidature/${id}/cv`}
          target="_blank"
          rel="noreferrer"
        >
          Apri il curriculum
        </a>
        <span className="lily-cv__nota">
          Si apre in una nuova scheda; da lì puoi anche salvarlo o stamparlo.
        </span>
      </div>
    </div>
  )
}
