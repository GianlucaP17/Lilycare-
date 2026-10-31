import {
  ArrowRight,
  Award,
  Briefcase,
  ExternalLink,
  GraduationCap,
  Languages,
  Phone,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Icon } from '@/components/icons/Icon'
import { BookingAside } from '@/components/page/BookingAside'
import { CtaBand } from '@/components/sections/CtaBand'
import { PortraitArt } from '@/components/ui/Art'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { getMember, getServicesByProfessional, getSettings } from '@/lib/data'
import { bookingHref, paths } from '@/lib/paths'
import { personSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { toTelHref } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = await getMember(slug)
  if (!member) return {}
  const fullName = [member.prefix, member.name].filter(Boolean).join(' ')
  return buildMetadata({
    title: `${fullName} – ${member.role}`,
    description: member.shortBio,
    path: paths.member(slug),
    meta: member.meta,
    image: member.photo,
    type: 'profile',
    ogSubtitle: member.role,
  })
}

function Timeline({
  items,
}: {
  items: Array<{
    id?: string | null
    when?: string | null
    title: string
    subtitle?: string | null
    text?: string | null
  }>
}) {
  return (
    <ol className="relative space-y-8 border-l border-line pl-8">
      {items.map((item, i) => (
        <li key={item.id ?? i} className="relative">
          <span
            className="absolute top-1.5 -left-[2.3rem] h-3 w-3 rounded-full bg-orchid-400 ring-4 ring-white"
            aria-hidden
          />
          {item.when ? (
            <p className="text-sm font-semibold tracking-wide text-orchid-700">{item.when}</p>
          ) : null}
          <p className="mt-1 text-lg font-medium text-navy-950">{item.title}</p>
          {item.subtitle ? <p className="text-muted">{item.subtitle}</p> : null}
          {item.text ? <p className="mt-2 leading-relaxed text-muted">{item.text}</p> : null}
        </li>
      ))}
    </ol>
  )
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params
  const [member, settings] = await Promise.all([getMember(slug), getSettings()])
  if (!member) notFound()

  const services = await getServicesByProfessional(member.id)
  const fullName = [member.prefix, member.name].filter(Boolean).join(' ')
  const book = bookingHref({ member: member.slug })

  return (
    <>
      <section className="relative overflow-hidden bg-sand-100">
        <div
          className="pointer-events-none absolute -top-40 -left-24 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--color-orchid-100),transparent_70%)]"
          aria-hidden
        />
        <Container className="relative pt-8 pb-16 md:pb-24">
          <Breadcrumbs
            items={[
              { label: 'Team', href: paths.team },
              { label: fullName, href: paths.member(slug) },
            ]}
          />
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="arch relative mx-auto aspect-[4/5] max-w-sm overflow-hidden shadow-lift ring-8 ring-white lg:max-w-none">
                {member.photo ? (
                  <MediaImage
                    media={member.photo}
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    alt={`${fullName}, ${member.role}`}
                  />
                ) : (
                  <PortraitArt name={member.name} />
                )}
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="eyebrow mb-5">{member.role}</p>
              <h1 className="text-5xl leading-[1.04] font-light md:text-6xl">{fullName}</h1>
              <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
                {member.shortBio}
              </p>
              {member.specialties?.length ? (
                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Ambiti di competenza">
                  {member.specialties.map((s) => (
                    <li
                      key={s.id ?? s.text}
                      className="rounded-full bg-white px-4 py-2 text-sm font-medium text-navy-900 ring-1 ring-line"
                    >
                      {s.text}
                    </li>
                  ))}
                </ul>
              ) : null}
              {member.languages?.length ? (
                <p className="mt-6 flex items-center gap-2 text-sm text-muted">
                  <Languages size={16} aria-hidden /> Lingue:{' '}
                  {member.languages.map((l) => l.language).join(', ')}
                </p>
              ) : null}
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={book} size="lg">
                  Prenota con {member.prefix ? fullName : member.name.split(' ')[0]}{' '}
                  <ArrowRight size={18} aria-hidden />
                </Button>
                <Button href={toTelHref(settings.phone)} variant="secondary" size="lg">
                  <Phone size={18} aria-hidden /> {settings.phone}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="bg-white py-16 md:py-24">
        <Container className="grid gap-14 lg:grid-cols-12">
          <article className="space-y-16 lg:col-span-8">
            {member.bio ? (
              <section aria-labelledby="presentazione">
                <h2 id="presentazione" className="mb-6 text-3xl font-normal md:text-4xl">
                  Presentazione
                </h2>
                <RichText data={member.bio} size="lg" />
              </section>
            ) : null}

            {member.education?.length ? (
              <section aria-labelledby="formazione">
                <h2
                  id="formazione"
                  className="mb-8 flex items-center gap-3 text-3xl font-normal md:text-4xl"
                >
                  <GraduationCap
                    size={28}
                    strokeWidth={1.3}
                    className="text-orchid-600"
                    aria-hidden
                  />{' '}
                  Formazione
                </h2>
                <Timeline
                  items={member.education.map((e) => ({
                    id: e.id,
                    when: e.year,
                    title: e.title,
                    subtitle: e.institution,
                  }))}
                />
              </section>
            ) : null}

            {member.experience?.length ? (
              <section aria-labelledby="esperienza">
                <h2
                  id="esperienza"
                  className="mb-8 flex items-center gap-3 text-3xl font-normal md:text-4xl"
                >
                  <Briefcase size={26} strokeWidth={1.3} className="text-orchid-600" aria-hidden />{' '}
                  Esperienza
                </h2>
                <Timeline
                  items={member.experience.map((e) => ({
                    id: e.id,
                    when: e.period,
                    title: e.role,
                    subtitle: e.organization,
                    text: e.description,
                  }))}
                />
              </section>
            ) : null}

            {member.memberships?.length ? (
              <section aria-labelledby="affiliazioni">
                <h2
                  id="affiliazioni"
                  className="mb-6 flex items-center gap-3 text-3xl font-normal md:text-4xl"
                >
                  <Award size={26} strokeWidth={1.3} className="text-orchid-600" aria-hidden />{' '}
                  Società e albi
                </h2>
                <ul className="space-y-3">
                  {member.memberships.map((m) => (
                    <li
                      key={m.id ?? m.name}
                      className="rounded-2xl bg-cream px-5 py-4 ring-1 ring-line"
                    >
                      {m.url ? (
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-medium text-navy-900 hover:text-navy-700"
                        >
                          {m.name} <ExternalLink size={14} aria-hidden />
                        </a>
                      ) : (
                        <span className="font-medium text-navy-900">{m.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              {services.length ? (
                <div className="rounded-3xl bg-cream p-7 ring-1 ring-line">
                  <p className="font-serif text-2xl text-navy-950">Prestazioni</p>
                  <ul className="mt-5 space-y-1">
                    {services.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={paths.service(s.slug as string)}
                          className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                            <Icon name={s.icon} size={18} />
                          </span>
                          <span className="font-medium text-navy-950 group-hover:text-navy-700">
                            {s.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {member.profiles?.length ? (
                <div className="rounded-3xl bg-cream p-7 ring-1 ring-line">
                  <p className="font-serif text-2xl text-navy-950">Profili</p>
                  <ul className="mt-4 space-y-2">
                    {member.profiles.map((p) => (
                      <li key={p.id ?? p.url}>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer me"
                          className="inline-flex items-center gap-2 text-navy-800 underline-offset-4 hover:underline"
                        >
                          {p.label} <ExternalLink size={14} aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <BookingAside
                settings={settings}
                bookingUrl={book}
                title={
                  member.prefix ? 'Prenota una visita' : `Prenota con ${member.name.split(' ')[0]}`
                }
              />
            </div>
          </aside>
        </Container>
      </div>

      <CtaBand
        heading="Hai domande prima della visita?"
        text="Chiamaci: saremo felici di spiegarti come si svolge la prestazione e come prepararti."
        primary={{ label: 'Richiedi un appuntamento', url: book }}
        phone={settings.phone}
        style="blush"
      />

      <JsonLd data={personSchema(member, services)} />
    </>
  )
}
