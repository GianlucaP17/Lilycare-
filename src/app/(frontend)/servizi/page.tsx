import type { Metadata } from 'next'
import React from 'react'

import { ServiceCardGrid } from '@/components/cards/ServiceCard'
import { PageHeader } from '@/components/page/PageHeader'
import { CtaBand } from '@/components/sections/CtaBand'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { getServiceCategories, getServices, getSettings } from '@/lib/data'
import { paths } from '@/lib/paths'
import { buildMetadata } from '@/lib/seo'
import { placeLabel } from '@/lib/settings-helpers'
import { absoluteUrl } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [services, settings] = await Promise.all([getServices(), getSettings()])
  return buildMetadata({
    title: 'Servizi e specialità',
    description: `Le prestazioni di ${settings.clinicName} a ${placeLabel(settings)}: ${services
      .map((s) => s.title.toLowerCase())
      .slice(0, 7)
      .join(', ')} e altro ancora.`,
    path: paths.services,
    ogSubtitle: 'Diagnosi e terapia in un unico centro',
  })
}

export default async function ServicesPage() {
  const [services, categories, settings] = await Promise.all([
    getServices(),
    getServiceCategories(),
    getSettings(),
  ])

  const groups = categories
    .map((c) => ({
      category: c,
      items: services.filter(
        (s) => (typeof s.category === 'object' ? s.category?.id : s.category) === c.id,
      ),
    }))
    .filter((g) => g.items.length)

  return (
    <>
      <PageHeader
        eyebrow="Servizi"
        title={
          <>
            Le nostre <em className="text-orchid-600 italic">specialità</em>
          </>
        }
        intro="Dalla diagnostica per immagini alla terapia del dolore, fino alle cure infermieristiche e all’agopuntura: a LilyCare trovi in un unico centro esami e trattamenti, con professionisti che collaborano sul tuo percorso."
        crumbs={[{ label: 'Servizi', href: paths.services }]}
      >
        {groups.length > 1 ? (
          <nav aria-label="Categorie" className="mt-10 flex flex-wrap gap-2">
            {groups.map(({ category }) => (
              <a
                key={category.id}
                href={`#${category.slug}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-navy-900 ring-1 ring-line transition-colors hover:ring-navy-300"
              >
                {category.title}
              </a>
            ))}
          </nav>
        ) : null}
      </PageHeader>

      <div className="bg-white py-20 md:py-24">
        <Container className="space-y-20">
          {groups.map(({ category, items }) => (
            <section
              key={category.id}
              id={category.slug ?? undefined}
              aria-labelledby={`cat-${category.id}`}
            >
              <div className="mb-8 grid gap-4 border-b border-line pb-6 md:grid-cols-12">
                <h2
                  id={`cat-${category.id}`}
                  className="text-3xl font-normal md:col-span-5 md:text-4xl"
                >
                  {category.title}
                </h2>
                {category.description ? (
                  <p className="leading-relaxed text-muted md:col-span-7 md:pt-2">
                    {category.description}
                  </p>
                ) : null}
              </div>
              <ServiceCardGrid services={items} />
            </section>
          ))}
        </Container>
      </div>

      <CtaBand
        heading="Non sai quale prestazione fa al caso tuo?"
        text="Chiamaci o scrivici: ti aiutiamo a capire il percorso più adatto e a fissare l’appuntamento."
        phone={settings.phone}
      />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Servizi di ${settings.clinicName}`,
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.title,
            url: absoluteUrl(paths.service(s.slug as string)),
          })),
        }}
      />
    </>
  )
}
