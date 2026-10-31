import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { NewsListing, parsePage } from '@/components/page/NewsListing'
import { PageHeader } from '@/components/page/PageHeader'
import { getArticleCategory } from '@/lib/data'
import { paths } from '@/lib/paths'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ pagina?: string | string[] }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = parsePage((await searchParams).pagina)
  const category = await getArticleCategory(slug)
  if (!category) return {}
  const path = paths.newsCategory(slug)
  return buildMetadata({
    title: `${category.title} – Notizie${page > 1 ? ` (pagina ${page})` : ''}`,
    description:
      category.description ||
      `Articoli su ${category.title.toLowerCase()} a cura del team di LilyCare.`,
    path: page > 1 ? `${path}?pagina=${page}` : path,
    ogSubtitle: 'Notizie e approfondimenti',
  })
}

export default async function NewsCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const page = parsePage((await searchParams).pagina)
  const category = await getArticleCategory(slug)
  if (!category) notFound()
  return (
    <>
      <PageHeader
        eyebrow="Notizie"
        title={category.title}
        intro={category.description}
        crumbs={[
          { label: 'Notizie', href: paths.news },
          { label: category.title, href: paths.newsCategory(slug) },
        ]}
      />
      <NewsListing
        page={page}
        categoryId={category.id}
        basePath={paths.newsCategory(slug)}
        activeSlug={slug}
      />
    </>
  )
}
