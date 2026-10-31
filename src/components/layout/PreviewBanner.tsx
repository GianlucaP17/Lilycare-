import React from 'react'

import { isDraftMode } from '@/lib/data'

/** Avviso visibile solo in modalità anteprima (bozze). */
export async function PreviewBanner() {
  if (!(await isDraftMode())) return null
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-4 bg-amber-100 px-4 py-2 text-sm text-amber-950">
      <span>Modalità anteprima: stai vedendo anche i contenuti in bozza.</span>
      {/* Link "classico": la route disattiva l'anteprima lato server e reindirizza */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/next/exit-preview" className="font-semibold underline underline-offset-4">
        Esci dall’anteprima
      </a>
    </div>
  )
}
