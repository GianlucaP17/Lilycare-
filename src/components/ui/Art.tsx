import React from 'react'

import { Icon } from '@/components/icons/Icon'
import { cn, initials } from '@/lib/utils'

/**
 * Illustrazioni originali mostrate quando non è ancora stata caricata una foto.
 * Sono pensate per essere eleganti di per sé: appena carichi una foto dal pannello admin,
 * la foto prende automaticamente il loro posto.
 */

const LilyLines = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
    <g stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
      <path d="M100 176c-28-34-31-89 0-138 31 49 28 104 0 138Z" />
      <path d="M94 175c-35-3-67-35-72-86 35 8 63 39 72 86Z" />
      <path d="M106 175c35-3 67-35 72-86-35 8-63 39-72 86Z" />
      <path d="M100 150V60M100 120c-6-9-15-16-26-20M100 120c6-9 15-16 26-20" opacity="0.6" />
    </g>
  </svg>
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
        'relative h-full w-full overflow-hidden bg-[radial-gradient(120%_90%_at_80%_0%,var(--color-blush-100),transparent_60%),radial-gradient(120%_100%_at_0%_100%,var(--color-petrol-100),transparent_65%)] bg-sand-50',
        className,
      )}
      aria-hidden
    >
      <Waves className="absolute -bottom-40 -left-40 h-[34rem] w-[34rem] text-petrol-300/50" />
      <LilyLines className="absolute top-1/2 left-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-[46%] text-petrol-700/70" />
      <div className="absolute top-[18%] right-[16%] h-3 w-3 rounded-full bg-blush-400/80" />
      <div className="absolute bottom-[22%] left-[14%] h-2 w-2 rounded-full bg-petrol-400/70" />
    </div>
  )
}

/** Riquadro decorativo per un servizio, con la sua icona. */
export function ServiceArt({ icon, className }: { icon?: string | null; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(90%_90%_at_70%_20%,var(--color-blush-100),transparent_60%)] bg-petrol-50',
        className,
      )}
      aria-hidden
    >
      <Waves className="absolute h-[140%] w-[140%] text-petrol-200" />
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/80 text-petrol-700 shadow-soft ring-1 ring-white backdrop-blur">
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
        'relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(100%_80%_at_50%_0%,var(--color-blush-100),transparent_70%)] bg-petrol-100',
        className,
      )}
      aria-hidden
    >
      <LilyLines className="absolute -bottom-6 left-1/2 h-[85%] w-[85%] -translate-x-1/2 text-petrol-700/25" />
      <span className="relative font-serif text-6xl font-light tracking-wide text-petrol-800 md:text-7xl">
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
    'bg-[radial-gradient(100%_100%_at_100%_0%,var(--color-blush-200),transparent_60%)] bg-petrol-50',
    'bg-[radial-gradient(100%_100%_at_0%_0%,var(--color-petrol-200),transparent_60%)] bg-sand-100',
    'bg-[radial-gradient(100%_100%_at_50%_100%,var(--color-blush-100),transparent_65%)] bg-petrol-100',
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
      <LilyLines className="absolute top-1/2 left-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 text-petrol-700/35" />
      {label ? (
        <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-petrol-800 backdrop-blur">
          {label}
        </span>
      ) : null}
    </div>
  )
}
