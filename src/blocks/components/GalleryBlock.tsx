import React from 'react'

import { Container, Section, SectionHeading } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/MediaImage'
import { asMedia } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { GalleryBlock as GalleryBlockType } from '@/payload-types'

/** Galleria foto: la prima immagine grande, le altre in griglia. */
export function GalleryBlock({ block }: { block: GalleryBlockType }) {
  const items = (block.images ?? []).filter((i) => asMedia(i.image))
  if (!items.length) return null

  return (
    <Section tone="white">
      <Container>
        <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        <ul
          className={cn(
            'grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:grid-rows-2',
            (block.eyebrow || block.heading || block.intro) && 'mt-12',
          )}
        >
          {items.map((item, i) => {
            const media = asMedia(item.image)
            const caption = item.caption || media?.caption
            const big = i === 0
            return (
              <li
                key={item.id ?? i}
                className={cn(
                  'group relative overflow-hidden rounded-3xl bg-sand-100 ring-1 ring-line',
                  big ? 'col-span-2 row-span-2 aspect-square lg:aspect-auto' : 'aspect-[4/5]',
                  // con più di 5 foto le successive vanno a capo in righe normali
                  i > 4 && 'lg:row-span-1',
                )}
              >
                <MediaImage
                  media={item.image}
                  sizes={big ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {caption ? (
                  <span className="absolute bottom-3 left-3 max-w-[85%] rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-navy-950 backdrop-blur md:text-sm">
                    {caption}
                  </span>
                ) : null}
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
