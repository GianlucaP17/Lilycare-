import { Fraunces, Inter } from 'next/font/google'
import React from 'react'

/**
 * Carica nel pannello admin gli stessi due caratteri del sito e li espone come
 * variabili CSS, usate poi da src/app/(payload)/custom.scss.
 *
 * Sono i file serviti dal nostro server (next/font li scarica al momento della
 * compilazione): nessuna richiesta a Google quando qualcuno apre il pannello.
 */

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
})

export function AdminFonts({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <style>{`:root{--lily-font-sans:${inter.style.fontFamily};--lily-font-serif:${fraunces.style.fontFamily};}`}</style>
      {children}
    </>
  )
}
