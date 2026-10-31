import type { Metadata } from 'next'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { stripEmphasis } from '@/components/ui/Emphasis'
import { getPage, getSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import type { Page } from '@/payload-types'

export const revalidate = 300

/** Composizione di riserva, usata solo se la homepage non è ancora stata creata nel pannello admin. */
const fallbackLayout = [
  {
    blockType: 'hero',
    variant: 'home',
    heading: 'Diagnosi e terapia, *in un unico centro*',
    showPhoneButton: true,
  },
  { blockType: 'servicesGrid', heading: 'Le nostre specialità', source: 'all' },
  { blockType: 'teamGrid', heading: 'Il nostro team' },
  { blockType: 'location', heading: 'Dove siamo', showMap: true },
] as unknown as Page['layout']

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage('home'), getSettings()])
  const hero = page?.layout?.find((b) => b.blockType === 'hero')
  const heading = hero && 'heading' in hero ? stripEmphasis(hero.heading) : settings.tagline || ''
  const metadata = buildMetadata({
    title: `${settings.clinicName} – ${settings.tagline || heading}`,
    description: settings.description,
    path: '/',
    meta: page?.meta,
    ogSubtitle: heading,
  })
  return {
    ...metadata,
    title: page?.meta?.title
      ? { absolute: page.meta.title }
      : { absolute: `${settings.clinicName} | ${settings.tagline || 'Centro medico'}` },
  }
}

export default async function HomePage() {
  const page = await getPage('home')
  return <RenderBlocks blocks={page?.layout?.length ? page.layout : fallbackLayout} />
}
