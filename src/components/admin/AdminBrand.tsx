import React from 'react'

/** Logo ufficiale nella pagina di accesso del pannello. */
export function AdminLogo() {
  return (
    <div className="lily-login-brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/lilycare-logo.svg"
        alt="LilyCare Medical Center"
        className="lily-login-brand__logo"
      />
      <span className="lily-login-brand__label">Pannello di amministrazione</span>
    </div>
  )
}

/** Fiore di loto nella barra laterale del pannello. */
export function AdminIcon() {
  return (
    <span className="lily-nav-brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/lilycare-fiore.svg" alt="" className="lily-nav-brand__mark" aria-hidden />
      <span className="lily-nav-brand__name">LilyCare</span>
    </span>
  )
}
