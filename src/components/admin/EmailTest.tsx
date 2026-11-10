'use client'

import React, { useState } from 'react'

type Stato =
  | { fase: 'fermo' }
  | { fase: 'invio' }
  | { fase: 'ok'; destinatari: string[]; risposta: string }
  | { fase: 'errore'; messaggio: string }

/**
 * Pulsante "Invia un'email di prova" in Impostazioni studio.
 * Dice subito se la casella dello studio riceve davvero gli avvisi del sito.
 */
export function EmailTest() {
  const [stato, setStato] = useState<Stato>({ fase: 'fermo' })

  const invia = async () => {
    setStato({ fase: 'invio' })
    try {
      const res = await fetch('/next/email/test', { method: 'POST', credentials: 'include' })
      const dati = await res.json()
      if (res.ok)
        setStato({ fase: 'ok', destinatari: dati.to ?? [], risposta: dati.risposta || '' })
      else setStato({ fase: 'errore', messaggio: dati?.error || 'Invio non riuscito.' })
    } catch {
      setStato({ fase: 'errore', messaggio: 'Connessione non riuscita. Riprova.' })
    }
  }

  return (
    <div className="lily-posta">
      <span className="lily-posta__etichetta">Prova della posta</span>
      <div className="lily-posta__riga">
        <button
          type="button"
          className="lily-posta__bottone"
          onClick={invia}
          disabled={stato.fase === 'invio'}
        >
          {stato.fase === 'invio' ? 'Invio in corso…' : 'Invia un’email di prova'}
        </button>
        <span className="lily-posta__nota">
          Arriva agli indirizzi qui sopra. Serve a verificare che richieste e candidature vengano
          davvero recapitate.
        </span>
      </div>
      {stato.fase === 'ok' ? (
        <p className="lily-posta__esito lily-posta__esito--ok">
          Email consegnata al server di posta per {stato.destinatari.join(', ')}.
          {stato.risposta ? ` Il server ha risposto: ${stato.risposta}` : ''} Se fra qualche minuto
          non la trovi, guarda nella posta indesiderata: da qui in poi la consegna non dipende più
          dal sito.
        </p>
      ) : null}
      {stato.fase === 'errore' ? (
        <p className="lily-posta__esito lily-posta__esito--ko">
          Non inviata: {stato.messaggio} Finché non si risolve, le richieste di appuntamento e le
          candidature restano nel pannello ma non arrivano per email.
        </p>
      ) : null}
    </div>
  )
}
