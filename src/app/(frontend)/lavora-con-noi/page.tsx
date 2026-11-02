import { Clock, HeartHandshake, Mail, MapPin, Stethoscope, Users } from 'lucide-react'
import type { Metadata } from 'next'
import React from 'react'

import { JobForm } from '@/components/careers/JobForm'
import { PageHeader } from '@/components/page/PageHeader'
import { Container } from '@/components/ui/Container'
import { getSettings } from '@/lib/data'
import { roleOptions } from '@/lib/job-options'
import { paths } from '@/lib/paths'
import { buildMetadata } from '@/lib/seo'
import { formatAddress, placeLabel } from '@/lib/settings-helpers'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Lavora con noi',
    description: `${settings.clinicName} cerca collaboratori sanitari a ${placeLabel(settings)}: assistenti di studio medico, personale infermieristico e medici di diverse specializzazioni. Invia la tua candidatura.`,
    path: paths.careers,
    ogSubtitle: 'Collaboratori sanitari a Chiasso',
  })
}

const motivi = [
  {
    icon: Stethoscope,
    title: 'Diagnosi e cura nello stesso centro',
    text: 'Diagnostica per immagini, terapia del dolore, cure infermieristiche e agopuntura convivono sotto lo stesso tetto: i percorsi si costruiscono insieme, senza rimbalzare il paziente altrove.',
  },
  {
    icon: Users,
    title: 'Una squadra piccola',
    text: 'Ci si parla direttamente, le decisioni sono rapide e ciascuno vede l’effetto del proprio lavoro sul percorso della persona che abbiamo davanti.',
  },
  {
    icon: Clock,
    title: 'Orari definiti',
    text: 'Si lavora su appuntamento, dal lunedì al venerdì. Gli orari sono concordati e rispettati.',
  },
  {
    icon: HeartHandshake,
    title: 'Tempo per il paziente',
    text: 'Spieghiamo ogni passaggio e non rincorriamo i numeri: chi lavora con noi deve potersi permettere di ascoltare.',
  },
]

export default async function CareersPage() {
  const settings = await getSettings()
  const cvEmail = settings.email || 'info@lilycare.ch'

  return (
    <>
      <PageHeader
        eyebrow="Lavora con noi"
        title={
          <>
            Cerchiamo <em className="text-orchid-600 italic">colleghi</em>, non solo curriculum
          </>
        }
        intro="LilyCare è un centro medico a Chiasso in crescita. Cerchiamo collaboratori sanitari che condividano un modo di lavorare: competenza, tempo dedicato alle persone e collaborazione fra professionisti."
        crumbs={[{ label: 'Lavora con noi', href: paths.careers }]}
      />

      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl text-navy-950 md:text-4xl">Chi stiamo cercando</h2>
              <p className="mt-5 leading-relaxed text-muted">
                Valutiamo candidature per questi profili, e anche candidature spontanee di altre
                figure sanitarie: se pensi di poter portare qualcosa al centro, scrivici.
              </p>
              <ul className="mt-8 space-y-3">
                {roleOptions
                  .filter((r) => r.value !== 'altro')
                  .map((r) => (
                    <li
                      key={r.value}
                      className="flex items-center gap-3 rounded-2xl bg-sand-100 px-5 py-3.5 text-ink"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-orchid-500"
                        aria-hidden
                      />
                      {r.label}
                    </li>
                  ))}
              </ul>
              <p className="mt-8 rounded-2xl bg-navy-50 p-5 text-sm leading-relaxed text-ink">
                Per i profili medici e sanitari è necessaria l’abilitazione all’esercizio della
                professione in Svizzera. Se il tuo titolo è stato conseguito all’estero, indicacelo
                pure: valutiamo insieme a che punto è il riconoscimento.
              </p>
            </div>

            <div className="lg:col-span-7">
              <h2 className="font-serif text-3xl text-navy-950 md:text-4xl">
                Perché lavorare a LilyCare
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {motivi.map((m) => (
                  <div key={m.title} className="rounded-3xl p-6 ring-1 ring-line">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy-700">
                      <m.icon size={22} aria-hidden />
                    </span>
                    <h3 className="mt-5 font-serif text-xl leading-snug text-navy-950">
                      {m.title}
                    </h3>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{m.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} className="text-orchid-500" aria-hidden />
                  {formatAddress(settings.address)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail size={16} className="text-orchid-500" aria-hidden />
                  {cvEmail}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-sand-100 py-20" id="candidatura">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="eyebrow">Candidatura</p>
              <h2 className="mt-4 font-serif text-3xl text-navy-950 md:text-4xl">
                Raccontaci chi sei
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
                Compila il modulo e allega il curriculum: lo riceviamo direttamente noi. Leggiamo
                tutte le candidature, anche quando non abbiamo una posizione aperta.
              </p>
            </div>
            <div className="mt-10">
              <JobForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
