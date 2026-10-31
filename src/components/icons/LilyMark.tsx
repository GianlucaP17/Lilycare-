import React from 'react'

type Props = {
  size?: number
  /** Monocromatico: usa il colore del testo corrente (per sfondi scuri). */
  mono?: boolean
  className?: string
  title?: string
}

/** Marchio grafico: un giglio stilizzato a tre petali. */
export function LilyMark({ size = 40, mono = false, className, title }: Props) {
  const center = mono ? 'currentColor' : '#1e5257'
  const side = mono ? 'currentColor' : '#c98a7f'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d="M24 41.5c-6.8-8.3-7.6-21.6 0-33.5 7.6 11.9 6.8 25.2 0 33.5Z" fill={center} />
      <path
        d="M22.6 41.4C14 40.6 6.2 33 5 20.6c8.4 1.8 15.5 9.4 17.6 20.8Z"
        fill={side}
        opacity={mono ? 0.7 : 1}
      />
      <path
        d="M25.4 41.4c8.6-.8 16.4-8.4 17.6-20.8-8.4 1.8-15.5 9.4-17.6 20.8Z"
        fill={side}
        opacity={mono ? 0.7 : 1}
      />
    </svg>
  )
}
