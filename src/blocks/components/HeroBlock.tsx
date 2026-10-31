import { ArrowRight, Check, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Icon } from '@/components/icons/Icon'
import { HeroArt } from '@/components/ui/Art'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Emphasis } from '@/components/ui/Emphasis'
import { MediaImage } from '@/components/ui/MediaImage'
import { OpenStatus } from '@/components/ui/OpenStatus'
import { getServices, getSettings } from '@/lib/data'
import { paths } from '@/lib/paths'
import { toTelHref } from '@/lib/utils'
import type { HeroBlock as HeroBlockType } from '@/payload-types'

export async function HeroBlock({ block, isFirst }: { block: HeroBlockType; isFirst?: boolean }) {
  const settings = await getSettings()
  const HeadingTag = isFirst ? 'h1' : 'h2'

  if (block.variant === 'page') {
    return (
      <section className="relative overflow-hidden bg-sand-100">
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,var(--color-orchid-100),transparent_70%)]"
          aria-hidden
        />
        <Container className="relative py-20 md:py-28">
          <div className="max-w-3xl">
            {block.eyebrow ? <p className="eyebrow mb-5">{block.eyebrow}</p> : null}
            <HeadingTag className="text-5xl leading-[1.05] font-light md:text-6xl">
              <Emphasis text={block.heading} />
            </HeadingTag>
            {block.text ? (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                {block.text}
              </p>
            ) : null}
            {block.primaryCta?.url || block.showPhoneButton ? (
              <div className="mt-9 flex flex-wrap gap-3">
                {block.primaryCta?.url ? (
                  <Button href={block.primaryCta.url} size="lg">
                    {block.primaryCta.label || 'Scopri di più'} <ArrowRight size={18} aria-hidden />
                  </Button>
                ) : null}
                {block.showPhoneButton && settings.phone ? (
                  <Button href={toTelHref(settings.phone)} variant="secondary" size="lg">
                    <Phone size={18} aria-hidden /> {settings.phone}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </Container>
      </section>
    )
  }

  const services = await getServices()

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 right-0 h-[46rem] w-[46rem] translate-x-1/3 -translate-y-1/4 rounded-full bg-[radial-gradient(circle,var(--color-orchid-100),transparent_65%)]"
        aria-hidden
      />
      <Container className="relative grid items-center gap-14 pt-10 pb-14 md:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-20">
        <div className="animate-fade-up lg:col-span-7">
          {block.eyebrow ? (
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-navy-800 shadow-soft ring-1 ring-line">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid-500" aria-hidden />
              {block.eyebrow}
            </p>
          ) : null}
          <HeadingTag className="mt-7 text-[2.75rem] leading-[1.04] font-light sm:text-6xl lg:text-[4.1rem]">
            <Emphasis text={block.heading} />
          </HeadingTag>
          {block.text ? (
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              {block.text}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={block.primaryCta?.url || paths.booking} size="lg">
              {block.primaryCta?.label || 'Prenota una visita'} <ArrowRight size={18} aria-hidden />
            </Button>
            {block.showPhoneButton && settings.phone ? (
              <Button href={toTelHref(settings.phone)} variant="secondary" size="lg">
                <Phone size={18} aria-hidden /> {settings.phone}
              </Button>
            ) : null}
          </div>
          {block.highlights?.length ? (
            <ul className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-3">
              {block.highlights.map((h) => (
                <li
                  key={h.id ?? h.text}
                  className="flex items-start gap-3 text-[0.95rem] leading-snug text-ink"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-100 text-navy-700">
                    <Check size={13} strokeWidth={2.5} aria-hidden />
                  </span>
                  {h.text}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="arch relative aspect-[4/5] overflow-hidden shadow-lift ring-8 ring-white">
            {block.image ? (
              <MediaImage media={block.image} priority sizes="(min-width: 1024px) 40vw, 90vw" />
            ) : (
              <HeroArt />
            )}
          </div>
          <div className="absolute -bottom-6 -left-2 max-w-[17rem] rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-line backdrop-blur sm:-left-8">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orchid-50 text-orchid-700">
                <MapPin size={18} aria-hidden />
              </span>
              <div className="text-sm leading-snug">
                <p className="font-semibold text-navy-950">
                  {settings.address?.city}, {settings.address?.region || 'Ticino'}
                </p>
                <p className="text-muted">{settings.address?.street}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-8 -right-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-medium text-navy-900 shadow-lift ring-1 ring-line backdrop-blur sm:-right-6">
            <OpenStatus hours={settings.openingHours} />
          </div>
        </div>
      </Container>

      {services.length ? (
        <Container className="relative pb-6">
          <nav
            aria-label="Le nostre prestazioni"
            className="rounded-[1.75rem] bg-white p-2 shadow-soft ring-1 ring-line"
          >
            <ul className="flex snap-x gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-wrap lg:justify-center">
              {services.map((s) => (
                <li key={s.id} className="snap-start">
                  <Link
                    href={paths.service(s.slug as string)}
                    className="flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap text-navy-900 transition-colors hover:bg-navy-50"
                  >
                    <Icon name={s.icon} size={18} className="text-navy-600" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      ) : null}
    </section>
  )
}
