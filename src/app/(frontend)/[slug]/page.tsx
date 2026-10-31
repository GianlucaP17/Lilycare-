import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { stripEmphasis } from '@/components/ui/Emphasis'
import { getPage } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  const hero = page.layout?.find((b) => b.blockType === 'hero')
  const description = hero && 'text' in hero ? hero.text : undefined
  return buildMetadata({
    title: page.title,
    description,
    path: `/${slug}`,
    meta: page.meta,
    ogSubtitle: hero && 'heading' in hero ? stripEmphasis(hero.heading) : undefined,
    noindex: ['privacy', 'note-legali'].includes(slug),
  })
}

export default async function GenericPage({ params }: Props) {
  const { slug } = await params
  if (slug === 'home') redirect('/')
  const page = await getPage(slug)
  if (!page) notFound()
  return <RenderBlocks blocks={page.layout} />
}
