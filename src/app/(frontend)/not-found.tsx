import { ArrowRight, Phone } from 'lucide-react'
import React from 'react'

import { LilyMark } from '@/components/icons/LilyMark'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <section className="py-24 md:py-36">
      <Container size="narrow" className="text-center">
        <LilyMark size={64} className="mx-auto" />
        <p className="eyebrow mt-8 justify-center">Errore 404</p>
        <h1 className="mt-4 text-5xl font-light md:text-6xl">Pagina non trovata</h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted">
          La pagina che cerchi non esiste o è stata spostata. Puoi tornare alla homepage, scoprire i
          nostri servizi o contattarci direttamente.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg">
            Torna alla homepage <ArrowRight size={18} aria-hidden />
          </Button>
          <Button href="/servizi" variant="secondary" size="lg">
            I nostri servizi
          </Button>
          <Button href="/contatti" variant="ghost" size="lg">
            <Phone size={18} aria-hidden /> Contatti
          </Button>
        </div>
      </Container>
    </section>
  )
}
