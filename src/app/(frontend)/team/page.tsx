import type { Metadata } from 'next'
import React from 'react'

import { MemberCard } from '@/components/cards/MemberCard'
import { PageHeader } from '@/components/page/PageHeader'
import { CtaBand } from '@/components/sections/CtaBand'
import { Container } from '@/components/ui/Container'
import { getSettings, getTeam } from '@/lib/data'
import { paths } from '@/lib/paths'
import { buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const team = await getTeam()
  return buildMetadata({
    title: 'Il team',
    description: `Conosci i professionisti di LilyCare a Coldrerio: ${team
      .map((m) => [m.prefix, m.name].filter(Boolean).join(' ') + `, ${m.role.toLowerCase()}`)
      .join('; ')}. Curriculum, competenze e prestazioni.`,
    path: paths.team,
    ogSubtitle: 'Professionisti che lavorano insieme sul tuo percorso',
  })
}

export default async function TeamPage() {
  const [team, settings] = await Promise.all([getTeam(), getSettings()])
  return (
    <>
      <PageHeader
        eyebrow="Il team"
        title={
          <>
            Persone, prima che <em className="text-blush-600 italic">professionisti</em>
          </>
        }
        intro="Medici e personale sanitario che collaborano ogni giorno, dalla diagnosi al trattamento. Scopri il percorso, le competenze e le prestazioni di ciascuno."
        crumbs={[{ label: 'Team', href: paths.team }]}
      />
      <section className="bg-cream py-20 md:py-28">
        <Container>
          <div
            className={cn(
              'grid',
              team.length >= 3
                ? 'gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3'
                : 'gap-8 lg:grid-cols-2',
            )}
          >
            {team.map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                layout={team.length >= 3 ? 'vertical' : 'horizontal'}
              />
            ))}
          </div>
        </Container>
      </section>
      <CtaBand
        heading="Prenota una visita con il nostro team"
        text="Indica la prestazione e, se vuoi, il professionista che preferisci: ti ricontattiamo noi."
        phone={settings.phone}
      />
    </>
  )
}
