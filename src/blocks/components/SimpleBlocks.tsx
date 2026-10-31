import { ArrowRight } from 'lucide-react'
import React from 'react'

import { ArticleCard } from '@/components/cards/ArticleCard'
import { Icon } from '@/components/icons/Icon'
import { CtaBand } from '@/components/sections/CtaBand'
import { FaqList } from '@/components/sections/FaqList'
import { LocationPanel } from '@/components/sections/LocationPanel'
import { HeroArt } from '@/components/ui/Art'
import { Button } from '@/components/ui/Button'
import { Container, Section, SectionHeading } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { getArticles, getSettings } from '@/lib/data'
import { cn } from '@/lib/utils'
import type {
  ContentBlock as ContentBlockType,
  CtaBlock as CtaBlockType,
  FaqBlock as FaqBlockType,
  FeaturesBlock as FeaturesBlockType,
  ImageTextBlock as ImageTextBlockType,
  LatestNewsBlock as LatestNewsBlockType,
  LocationBlock as LocationBlockType,
  StatsBlock as StatsBlockType,
  StepsBlock as StepsBlockType,
} from '@/payload-types'

export function FeaturesBlock({ block }: { block: FeaturesBlockType }) {
  return (
    <Section tone="sand">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={block.eyebrow}
              heading={block.heading}
              intro={block.intro}
              className="lg:sticky lg:top-32"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {block.items?.map((item, i) => (
              <div
                key={item.id ?? i}
                className={cn(
                  'rounded-3xl bg-white p-8 ring-1 ring-line',
                  i % 2 === 1 && 'sm:translate-y-10',
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-50 text-blush-700">
                  <Icon name={item.icon} size={24} />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-petrol-950">{item.title}</h3>
                {item.text ? <p className="mt-3 leading-relaxed text-muted">{item.text}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function StepsBlock({ block }: { block: StepsBlockType }) {
  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow={block.eyebrow}
          heading={block.heading}
          intro={block.intro}
          align="center"
        />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <div
            className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-[linear-gradient(90deg,transparent,var(--color-blush-300),transparent)] md:block"
            aria-hidden
          />
          {block.items?.map((step, i) => (
            <li key={step.id ?? i} className="relative text-center">
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-petrol-800 font-serif text-xl text-white ring-8 ring-white">
                {i + 1}
              </span>
              <h3 className="mt-6 font-serif text-2xl text-petrol-950">{step.title}</h3>
              {step.text ? (
                <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted">{step.text}</p>
              ) : null}
            </li>
          ))}
        </ol>
        {block.cta?.url ? (
          <div className="mt-14 text-center">
            <Button href={block.cta.url} size="lg">
              {block.cta.label || 'Prenota ora'} <ArrowRight size={18} aria-hidden />
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}

export async function LocationBlock({ block }: { block: LocationBlockType }) {
  const settings = await getSettings()
  return (
    <Section tone="cream" id="dove-siamo">
      <Container>
        <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        <LocationPanel
          settings={settings}
          showMap={block.showMap ?? true}
          showDirections={block.showDirections ?? false}
          className="mt-12"
        />
      </Container>
    </Section>
  )
}

export async function LatestNewsBlock({ block }: { block: LatestNewsBlockType }) {
  const categoryId = block.category
    ? typeof block.category === 'object'
      ? block.category.id
      : block.category
    : undefined
  const { docs } = await getArticles({ limit: block.limit ?? 3, categoryId })
  if (!docs.length) return null
  return (
    <Section tone="white">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
          <Button href="/notizie" variant="secondary" className="self-start md:self-auto">
            Tutte le notizie <ArrowRight size={16} aria-hidden />
          </Button>
        </div>
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function FaqBlock({ block }: { block: FaqBlockType }) {
  return (
    <Section tone="sand">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
          </div>
          <div className="lg:col-span-8">
            <FaqList items={block.items ?? []} />
          </div>
        </div>
      </Container>
    </Section>
  )
}

export async function CtaBlock({ block }: { block: CtaBlockType }) {
  const settings = await getSettings()
  return (
    <CtaBand
      heading={block.heading}
      text={block.text}
      primary={block.primary}
      phone={block.showPhone ? settings.phone : null}
      style={block.style}
    />
  )
}

export function ContentBlock({ block }: { block: ContentBlockType }) {
  return (
    <section className="py-14 md:py-20">
      <Container size={block.width === 'wide' ? 'default' : 'narrow'}>
        <RichText data={block.content} size="lg" />
      </Container>
    </section>
  )
}

export function ImageTextBlock({ block }: { block: ImageTextBlockType }) {
  const imageLeft = block.imagePosition === 'left'
  return (
    <Section tone="cream">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={cn(imageLeft && 'lg:order-2')}>
          {block.eyebrow ? <p className="eyebrow mb-4">{block.eyebrow}</p> : null}
          <h2 className="text-4xl leading-tight font-normal md:text-5xl">{block.heading}</h2>
          {block.content ? <RichText data={block.content} className="mt-6 text-lg" /> : null}
          {block.cta?.url ? (
            <Button href={block.cta.url} className="mt-8">
              {block.cta.label || 'Scopri di più'} <ArrowRight size={16} aria-hidden />
            </Button>
          ) : null}
        </div>
        <div
          className={cn(
            'relative aspect-[5/4] overflow-hidden rounded-[2rem] ring-1 ring-line',
            imageLeft && 'lg:order-1',
          )}
        >
          {block.image ? (
            <MediaImage media={block.image} sizes="(min-width: 1024px) 50vw, 100vw" />
          ) : (
            <HeroArt />
          )}
        </div>
      </Container>
    </Section>
  )
}

export function StatsBlock({ block }: { block: StatsBlockType }) {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <dl className="grid gap-8 rounded-[2rem] bg-petrol-900 px-8 py-12 text-center sm:grid-cols-2 md:px-12 lg:grid-cols-4">
          {block.items?.map((s, i) => (
            <div key={s.id ?? i} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-petrol-200">{s.label}</dt>
              <dd className="font-serif text-5xl font-light text-white">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
