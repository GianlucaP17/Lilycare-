import React from 'react'

import type { Page } from '@/payload-types'

import { GalleryBlock } from './components/GalleryBlock'
import { HeroBlock } from './components/HeroBlock'
import { ServicesGridBlock } from './components/ServicesGridBlock'
import {
  ContentBlock,
  CtaBlock,
  FaqBlock,
  FeaturesBlock,
  ImageTextBlock,
  LatestNewsBlock,
  LocationBlock,
  StatsBlock,
  StepsBlock,
} from './components/SimpleBlocks'
import { TeamGridBlock } from './components/TeamGridBlock'

type LayoutBlock = Page['layout'][number]

/**
 * Registro dei blocchi: associa ogni tipo di blocco (configurato in configs.ts)
 * al componente che lo disegna sul sito.
 */
const components: {
  [K in LayoutBlock['blockType']]: React.ComponentType<{
    block: Extract<LayoutBlock, { blockType: K }>
    isFirst?: boolean
  }>
} = {
  hero: HeroBlock,
  servicesGrid: ServicesGridBlock,
  teamGrid: TeamGridBlock,
  features: FeaturesBlock,
  steps: StepsBlock,
  location: LocationBlock,
  latestNews: LatestNewsBlock,
  faq: FaqBlock,
  cta: CtaBlock,
  content: ContentBlock,
  imageText: ImageTextBlock,
  stats: StatsBlock,
  gallery: GalleryBlock,
}

export function RenderBlocks({ blocks }: { blocks: Page['layout'] | null | undefined }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, index) => {
        const Component = components[block.blockType] as React.ComponentType<{
          block: LayoutBlock
          isFirst?: boolean
        }>
        if (!Component) return null
        return <Component key={block.id ?? index} block={block} isFirst={index === 0} />
      })}
    </>
  )
}
