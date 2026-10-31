import React from 'react'

import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

/** Intestazione delle pagine interne (titolo, introduzione, percorso). */
export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
  crumbs: Crumb[]
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('relative overflow-hidden bg-sand-100', className)}>
      <div
        className="pointer-events-none absolute -top-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--color-blush-100),transparent_70%)]"
        aria-hidden
      />
      <Container className="relative pt-8 pb-16 md:pb-24">
        <Breadcrumbs items={crumbs} />
        <div className="mt-12 max-w-3xl md:mt-16">
          {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
          <h1 className="text-5xl leading-[1.05] font-light md:text-6xl">{title}</h1>
          {intro ? (
            <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {intro}
            </div>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  )
}
