import { ArrowRight } from 'lucide-react'
import React from 'react'

import { ServiceCard } from '@/components/cards/ServiceCard'
import { Button } from '@/components/ui/Button'
import { Container, Section, SectionHeading } from '@/components/ui/Container'
import { getServiceCategories, getServices } from '@/lib/data'
import type { Service, ServicesGridBlock as Block } from '@/payload-types'

const categoryId = (s: Service) => (typeof s.category === 'object' ? s.category?.id : s.category)

export async function ServicesGridBlock({ block }: { block: Block }) {
  const [all, categories] = await Promise.all([getServices(), getServiceCategories()])

  let services = all
  if (block.source === 'featured') services = all.filter((s) => s.featured)
  if (block.source === 'category' && block.category) {
    const id = typeof block.category === 'object' ? block.category.id : block.category
    services = all.filter((s) => categoryId(s) === id)
  }
  if (block.source === 'manual' && block.services?.length) {
    const ids = block.services.map((s) => (typeof s === 'object' ? s.id : s))
    services = ids.map((id) => all.find((s) => s.id === id)).filter((s): s is Service => Boolean(s))
  }
  if (!services.length) return null

  return (
    <Section tone="white">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
          {block.source !== 'all' ? (
            <Button href="/servizi" variant="secondary" className="self-start md:self-auto">
              Tutti i servizi <ArrowRight size={16} aria-hidden />
            </Button>
          ) : null}
        </div>

        {block.groupByCategory ? (
          <div className="mt-14 space-y-16">
            {categories.map((cat) => {
              const items = services.filter((s) => categoryId(s) === cat.id)
              if (!items.length) return null
              return (
                <div key={cat.id}>
                  <div className="mb-6 flex items-baseline gap-4 border-b border-line pb-4">
                    <h3 className="font-serif text-3xl text-petrol-950">{cat.title}</h3>
                    {cat.description ? (
                      <p className="hidden text-muted md:block">{cat.description}</p>
                    ) : null}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((s) => (
                      <ServiceCard key={s.id} service={s} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
