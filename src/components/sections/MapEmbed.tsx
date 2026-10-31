'use client'

import { MapPin } from 'lucide-react'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * Mappa con caricamento su richiesta: Google Maps viene caricato solo dopo il clic
 * del visitatore (rispetto della privacy, nessun cookie di terzi in automatico, pagina più veloce).
 */
export function MapEmbed({
  embedUrl,
  label,
  address,
  className,
}: {
  embedUrl: string
  label: string
  address: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn('relative overflow-hidden rounded-3xl bg-navy-50 ring-1 ring-line', className)}
    >
      {loaded ? (
        <iframe
          src={embedUrl}
          title={`Mappa: ${label}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center text-left"
          aria-label="Carica la mappa interattiva di Google Maps"
        >
          {/* Mappa stilizzata decorativa */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 600 400"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <rect width="600" height="400" fill="#f3f6fc" />
            <path
              d="M-20 260 C 120 230, 210 300, 330 250 S 520 170, 640 210"
              stroke="#e5ecf8"
              strokeWidth="38"
              fill="none"
            />
            <g stroke="#ffffff" strokeLinecap="round" fill="none">
              <path d="M-10 120 C 140 140, 260 90, 380 130 S 560 160, 620 120" strokeWidth="10" />
              <path d="M90 -10 C 120 120, 70 260, 140 420" strokeWidth="8" />
              <path d="M300 -10 C 290 110, 330 230, 300 420" strokeWidth="12" />
              <path d="M460 -10 C 430 120, 500 260, 470 420" strokeWidth="7" />
              <path d="M-10 330 C 160 320, 420 360, 620 320" strokeWidth="6" />
            </g>
            <g fill="#e6acd2" opacity="0.35">
              <circle cx="180" cy="60" r="26" />
              <circle cx="520" cy="300" r="34" />
            </g>
          </svg>
          <span className="relative flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-800 text-white shadow-lift ring-8 ring-white/70 transition-transform group-hover:scale-105">
              <MapPin size={28} aria-hidden />
            </span>
            <span className="mt-4 rounded-2xl bg-white/95 px-5 py-3 text-center shadow-soft">
              <span className="block font-serif text-lg text-navy-950">{label}</span>
              <span className="block text-sm text-muted">{address}</span>
            </span>
            <span className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-soft ring-1 ring-line transition-colors group-hover:bg-navy-800 group-hover:text-white">
              Mostra la mappa interattiva
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
