import { ArrowRight, Check, Info, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { ArticleCard } from '@/components/cards/ArticleCard'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { BookingAside } from '@/components/page/BookingAside'
import { MemberMini } from '@/components/page/MemberMini'
import { CtaBand } from '@/components/sections/CtaBand'
import { FaqList } from '@/components/sections/FaqList'
import { ServiceArt } from '@/components/ui/Art'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import {
  getArticles,
  getPublishedSlugs,
  getService,
  getServices,
  getSettings,
  populated,
  populatedList,
} from '@/lib/data'
import { bookingHref, paths } from '@/lib/paths'
import { serviceSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { formatDate, toTelHref } from '@/lib/utils'
import type { ServiceCategory, Team } from '@/payload-types'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await getPublishedSlugs('services')).map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}
  return buildMetadata({
    title: `${service.title} a Coldrerio (Ticino)`,
    description: service.summary,
    path: paths.service(slug),
    meta: service.meta,
    image: service.image,
    ogSubtitle: 'Coldrerio · Mendrisiotto · Ticino',
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const [service, settings, allServices] = await Promise.all([
    getService(slug),
    getSettings(),
    getServices(),
  ])
  if (!service) notFound()

  const category = populated<ServiceCategory>(service.category)
  const professionals = populatedList<Team>(service.professionals)
  const { docs: articles } = await getArticles({ serviceId: service.id, limit: 3 })
  const related = allServices
    .filter((s) => s.id !== service.id)
    .filter((s) => (typeof s.category === 'object' ? s.category?.id : s.category) === category?.id)
    .slice(0, 3)
  const book = bookingHref({ service: service.slug })

  return (
    <>
      {/* Intestazione */}
      <section className="relative overflow-hidden bg-sand-100">
        <div
          className="pointer-events-none absolute -top-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--color-blush-100),transparent_70%)]"
          aria-hidden
        />
        <Container className="relative pt-8 pb-16 md:pb-20">
          <Breadcrumbs
            items={[
              { label: 'Servizi', href: paths.services },
              { label: service.title, href: paths.service(slug) },
            ]}
          />
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {category ? <p className="eyebrow mb-5">{category.title}</p> : null}
              <h1 className="text-5xl leading-[1.04] font-light md:text-6xl">{service.title}</h1>
              <div className="mt-8 rounded-3xl bg-white/80 p-6 ring-1 ring-line backdrop-blur md:p-7">
                <p className="text-xs font-semibold tracking-[0.16em] text-blush-700 uppercase">
                  In breve
                </p>
                <p className="mt-3 text-lg leading-relaxed text-ink md:text-xl">
                  {service.summary}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={book} size="lg">
                  Prenota questa prestazione <ArrowRight size={18} aria-hidden />
                </Button>
                <Button href={toTelHref(settings.phone)} variant="secondary" size="lg">
                  <Phone size={18} aria-hidden /> {settings.phone}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="arch relative mx-auto aspect-[4/5] max-w-sm overflow-hidden shadow-lift ring-8 ring-white lg:max-w-none">
                {service.image ? (
                  <MediaImage
                    media={service.image}
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                  />
                ) : (
                  <ServiceArt icon={service.icon} />
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contenuto */}
      <div className="bg-white py-16 md:py-24">
        <Container className="grid gap-14 lg:grid-cols-12">
          <article className="space-y-16 lg:col-span-8">
            {service.content ? (
              <section>
                <RichText data={service.content} size="lg" />
              </section>
            ) : null}

            {service.indications?.length ? (
              <section aria-labelledby="indicazioni">
                <h2 id="indicazioni" className="text-3xl font-normal md:text-4xl">
                  Quando è indicato
                </h2>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {service.indications.map((item) => (
                    <li
                      key={item.id ?? item.text}
                      className="flex gap-3 rounded-2xl bg-cream p-4 ring-1 ring-line"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-petrol-800 text-white">
                        <Check size={14} strokeWidth={2.5} aria-hidden />
                      </span>
                      <span className="leading-snug">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {service.procedure?.length ? (
              <section aria-labelledby="svolgimento">
                <h2 id="svolgimento" className="text-3xl font-normal md:text-4xl">
                  Come si svolge
                </h2>
                <ol className="mt-8 space-y-0">
                  {service.procedure.map((step, i) => (
                    <li key={step.id ?? i} className="relative flex gap-6 pb-8 last:pb-0">
                      {i < (service.procedure?.length ?? 0) - 1 ? (
                        <span
                          className="absolute top-12 bottom-0 left-[1.4rem] w-px bg-line"
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-50 font-serif text-lg text-blush-700 ring-1 ring-blush-200">
                        {i + 1}
                      </span>
                      <div className="pt-1.5">
                        <h3 className="font-sans text-lg font-semibold text-petrol-950">
                          {step.title}
                        </h3>
                        {step.text ? (
                          <p className="mt-1.5 leading-relaxed text-muted">{step.text}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {service.preparation ? (
              <section
                aria-labelledby="preparazione"
                className="rounded-3xl bg-petrol-50 p-8 ring-1 ring-petrol-100"
              >
                <h2 id="preparazione" className="text-2xl font-normal md:text-3xl">
                  Come prepararsi
                </h2>
                <p className="mt-4 leading-relaxed whitespace-pre-line text-ink">
                  {service.preparation}
                </p>
              </section>
            ) : null}

            {service.faqs?.length ? (
              <section aria-labelledby="faq">
                <h2 id="faq" className="mb-8 text-3xl font-normal md:text-4xl">
                  Domande frequenti
                </h2>
                <FaqList items={service.faqs} />
              </section>
            ) : null}

            <p className="flex gap-3 rounded-2xl bg-sand-100 p-5 text-sm leading-relaxed text-muted">
              <Info size={18} className="mt-0.5 shrink-0 text-petrol-600" aria-hidden />
              <span>
                Le informazioni in questa pagina hanno carattere divulgativo e non sostituiscono la
                valutazione medica: l’indicazione a esami e trattamenti viene sempre stabilita
                durante la visita. In caso di emergenza chiama il 144. Ultimo aggiornamento:{' '}
                {formatDate(service.updatedAt)}.
              </span>
            </p>
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              {service.facts?.length ? (
                <div className="rounded-3xl bg-cream p-7 ring-1 ring-line">
                  <p className="font-serif text-2xl text-petrol-950">Informazioni utili</p>
                  <dl className="mt-5 divide-y divide-line">
                    {service.facts.map((f) => (
                      <div key={f.id ?? f.label} className="flex justify-between gap-6 py-3">
                        <dt className="text-muted">{f.label}</dt>
                        <dd className="text-right font-medium text-petrol-950">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {professionals.length ? (
                <div className="rounded-3xl bg-cream p-7 ring-1 ring-line">
                  <p className="font-serif text-2xl text-petrol-950">
                    {professionals.length > 1 ? 'I professionisti' : 'Il professionista'}
                  </p>
                  <div className="mt-5 space-y-5">
                    {professionals.map((p) => (
                      <MemberMini key={p.id} member={p} />
                    ))}
                  </div>
                </div>
              ) : null}

              <BookingAside
                settings={settings}
                bookingUrl={book}
                title={`Prenota: ${service.title}`}
              />
            </div>
          </aside>
        </Container>
      </div>

      {articles.length ? (
        <section className="bg-cream py-20">
          <Container>
            <h2 className="text-3xl font-normal md:text-4xl">Approfondimenti</h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {related.length ? (
        <section className="bg-sand-100 py-20">
          <Container>
            <h2 className="text-3xl font-normal md:text-4xl">Altri servizi: {category?.title}</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand
        heading={`Vuoi prenotare: ${service.title.toLowerCase()}?`}
        text="Invia una richiesta online o chiamaci: ti ricontattiamo per fissare l’appuntamento."
        primary={{ label: 'Prenota ora', url: book }}
        phone={settings.phone}
      />

      <JsonLd data={serviceSchema(service, settings)} />
    </>
  )
}
