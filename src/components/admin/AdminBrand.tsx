import React from 'react'

import { LilyMark } from '@/components/icons/LilyMark'

/** Logo mostrato nella pagina di accesso del pannello admin. */
export function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <LilyMark size={48} />
      <div>
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 30,
            lineHeight: 1,
            letterSpacing: 0.2,
          }}
        >
          LilyCare
        </div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>Pannello di amministrazione</div>
      </div>
    </div>
  )
}

/** Icona piccola nella barra di navigazione del pannello admin. */
export function AdminIcon() {
  return <LilyMark size={28} />
}
