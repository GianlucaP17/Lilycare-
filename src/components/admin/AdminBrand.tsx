import React from 'react'

/** Logo ufficiale nella pagina di accesso del pannello admin. */
export function AdminLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/lilycare-logo.svg"
        alt="LilyCare Medical Center"
        style={{ width: 220, height: 'auto' }}
      />
      <div style={{ fontSize: 13, opacity: 0.7 }}>Pannello di amministrazione</div>
    </div>
  )
}

/** Fiore di loto nella barra di navigazione del pannello admin. */
export function AdminIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/lilycare-fiore.svg" alt="LilyCare" style={{ width: 30, height: 'auto' }} />
  )
}
