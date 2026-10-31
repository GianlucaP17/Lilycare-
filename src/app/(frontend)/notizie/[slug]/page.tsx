import { ArrowRight, Info } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { ArticleCard } from '@/components/cards/ArticleCard'
import { Icon } from '@/components/icons/Icon'
import { MemberMini } from '@/components/page/MemberMini'
import { CtaBand } from '@/components/sections/CtaBand'
import { FaqList } from '@/components/sections/FaqList'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import {
  getArticle,
  getArticles,
  getPublishedSlugs,
  getSettings,
  populated,
  populatedList,
} from '@/lib/data'
import { paths } from '@/lib/paths'
import { articleSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { formatDate } from '@/lib/utils'
import type { ArticleCategory, Service, Team } from '@/payload-types'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await getPublishedSlugs('articles')).map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}
  const author = populated<Team>(article.author)
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: paths.article(slug),
    meta: article.meta,
    image: article.coverImage,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: author ? [author.name] : undefined,
    ogSubtitle: populated<ArticleCategory>(article.category)?.title,
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [article, settings] = await Promise.all([getArticle(slug), getSettings()])
  if (!article) notFound()

  const category = populated<ArticleCategory>(article.category)
  const author = populated<Team>(article.author)
  const reviewer = populated<Team>(article.reviewedBy)
  const services = populatedList<Service>(article.relatedServices)
  const { docs: more } = await getArticles({
    limit: 3,
    excludeId: article.id,
    categoryId: category?.id,
  })

  return (
    <>
      <article>
        <header className="relative overflow-hidden bg-sand-100">
          <Container className="relative pt-8 pb-14 md:pb-20">
            <Breadcrumbs
              items={[
                { label: 'Notizie', href: paths.news },
                ...(category
                  ? [{ label: category.title, href: paths.newsCategory(category.slug as string) }]
                  : []),
                { label: article.title, href: paths.article(slug) },
              ]}
            />
            <div className="mx-auto mt-12 max-w-3xl sm:px-8 md:mt-16">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                {category ? (
                  <Link
                    href={paths.newsCategory(category.slug as string)}
                    className="font-semibold text-blush-700 hover:underline"
                  >
                    {category.title}
                  </Link>
                ) : null}
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                {article.readingTime ? <span>· {article.readingTime} min di lettura</span> : null}
              </div>
              <h1 className="mt-5 text-4xl leading-[1.08] font-light md:text-[3.4rem]">
                {article.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
                {article.excerpt}
              </p>
              {author || reviewer ? (
                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-6">
                  {author ? <MemberMini member={author} label="Scritto da" /> : null}
                  {reviewer && reviewer.id !== author?.id ? (
                    <MemberMini member={reviewer} label="Revisione medica" />
                  ) : null}
                </div>
              ) : null}
            </div>
          </Container>
        </header>

        {article.coverImage ? (
          <Container className="-mb-6 pt-10">
            <div className="relative mx-auto aspect-[16/8] max-w-5xl overflow-hidden rounded-[2rem] ring-1 ring-line">
              <MediaImage
                media={article.coverImage}
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          </Container>
        ) : null}

        <div className="bg-cream py-16 md:py-20">
          <Container size="narrow">
            <RichText data={article.content} size="lg" />

            {article.faqs?.length ? (
              <section aria-labelledby="faq" className="mt-16">
                <h2 id="faq" className="mb-8 text-3xl font-normal">
                  Domande frequenti
                </h2>
                <FaqList items={article.faqs} />
              </section>
            ) : null}

            {services.length ? (
              <aside
                className="mt-16 rounded-3xl bg-white p-8 ring-1 ring-line"
                aria-labelledby="servizi-correlati"
              >
                <p id="servizi-correlati" className="font-serif text-2xl text-petrol-950">
                  Servizi correlati a LilyCare
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={paths.service(s.slug as string)}
                        className="group flex items-center gap-3 rounded-2xl bg-cream p-4 ring-1 ring-line transition-colors hover:ring-petrol-300"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-petrol-50 text-petrol-700">
                          <Icon name={s.icon} size={20} />
                        </span>
                        <span className="flex-1 font-medium text-petrol-950">{s.title}</span>
                        <ArrowRight
                          size={16}
                          className="text-petrol-400 group-hover:text-petrol-700"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            <p className="mt-12 flex gap-3 rounded-2xl bg-sand-100 p-5 text-sm leading-relaxed text-muted">
              <Info size={18} className="mt-0.5 shrink-0 text-petrol-600" aria-hidden />
              <span>
                Questo articolo ha scopo informativo e non sostituisce il parere del medico. Per una
                valutazione del tuo caso prenota una visita. Pubblicato il{' '}
                {formatDate(article.publishedAt)}
                {article.updatedAt &&
                article.updatedAt.slice(0, 10) !== article.publishedAt.slice(0, 10)
                  ? `, aggiornato il ${formatDate(article.updatedAt)}`
                  : ''}
                .
              </span>
            </p>
          </Container>
        </div>
      </article>

      {more.length ? (
        <section className="bg-white py-20">
          <Container>
            <h2 className="text-3xl font-normal md:text-4xl">Continua a leggere</h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {more.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand
        heading="Vuoi parlarne con un professionista?"
        text="Prenota una visita a LilyCare: valuteremo insieme il percorso più adatto a te."
        phone={settings.phone}
      />

      <JsonLd data={articleSchema(article, settings)} />
    </>
  )
}
