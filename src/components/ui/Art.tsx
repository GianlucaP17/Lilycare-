import React from 'react'

import { Icon } from '@/components/icons/Icon'
import { cn, initials } from '@/lib/utils'

/**
 * Illustrazioni originali mostrate quando non è ancora stata caricata una foto.
 * Sono pensate per essere eleganti di per sé: appena carichi una foto dal pannello admin,
 * la foto prende automaticamente il loro posto.
 */

/** Fiore di loto del logo ufficiale, usato come decorazione leggera. */
const Lotus = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/brand/lilycare-fiore.svg"
    alt=""
    aria-hidden
    className={cn('pointer-events-none select-none', className)}
  />
)

const Waves = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden>
    {[60, 100, 140, 180, 220, 260].map((r) => (
      <circle key={r} cx="200" cy="200" r={r} stroke="currentColor" strokeWidth="0.75" />
    ))}
  </svg>
)

/** Pannello decorativo per la testata (hero). */
export function HeroArt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden bg-[radial-gradient(120%_90%_at_80%_0%,var(--color-orchid-100),transparent_60%),radial-gradient(120%_100%_at_0%_100%,var(--color-navy-100),transparent_65%)] bg-sand-50',
        className,
      )}
      aria-hidden
    >
      <Waves className="absolute -bottom-40 -left-40 h-[34rem] w-[34rem] text-navy-300/50" />
      <Lotus className="absolute top-1/2 left-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 opacity-80" />
      <div className="absolute top-[18%] right-[16%] h-3 w-3 rounded-full bg-orchid-400/80" />
      <div className="absolute bottom-[22%] left-[14%] h-2 w-2 rounded-full bg-navy-400/70" />
    </div>
  )
}

/** Riquadro decorativo per un servizio, con la sua icona. */
export function ServiceArt({ icon, className }: { icon?: string | null; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(90%_90%_at_70%_20%,var(--color-orchid-100),transparent_60%)] bg-navy-50',
        className,
      )}
      aria-hidden
    >
      <Waves className="absolute h-[140%] w-[140%] text-navy-200" />
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/80 text-navy-700 shadow-soft ring-1 ring-white backdrop-blur">
        <Icon name={icon} size={52} strokeWidth={1.1} />
      </div>
    </div>
  )
}

/** Ritratto con iniziali, finché non viene caricata la foto. */
export function PortraitArt({ name, className }: { name?: string | null; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(100%_80%_at_50%_0%,var(--color-orchid-100),transparent_70%)] bg-navy-100',
        className,
      )}
      aria-hidden
    >
      <Lotus className="absolute bottom-[8%] left-1/2 w-[70%] -translate-x-1/2 opacity-25" />
      <span className="relative font-serif text-6xl font-light tracking-wide text-navy-800 md:text-7xl">
        {initials(name)}
      </span>
    </div>
  )
}

/** Copertina decorativa per articoli senza immagine. */
export function ArticleArt({
  label,
  seed = 0,
  className,
}: {
  label?: string | null
  seed?: number
  className?: string
}) {
  const palettes = [
    'bg-[radial-gradient(100%_100%_at_100%_0%,var(--color-orchid-200),transparent_60%)] bg-navy-50',
    'bg-[radial-gradient(100%_100%_at_0%_0%,var(--color-navy-200),transparent_60%)] bg-sand-100',
    'bg-[radial-gradient(100%_100%_at_50%_100%,var(--color-orchid-100),transparent_65%)] bg-navy-100',
  ]
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden',
        palettes[seed % palettes.length],
        className,
      )}
      aria-hidden
    >
      <Waves className="absolute -right-24 -bottom-24 h-80 w-80 text-white/70" />
      <Lotus className="absolute top-1/2 left-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2 opacity-60" />
      {label ? (
        <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-navy-800 backdrop-blur">
          {label}
        </span>
      ) : null}
    </div>
  )
}
