import Link from 'next/link'
import React from 'react'

import { ArticleArt } from '@/components/ui/Art'
import { MediaImage } from '@/components/ui/MediaImage'
import { paths } from '@/lib/paths'
import { cn, formatDate } from '@/lib/utils'
import type { Article } from '@/payload-types'

export function ArticleCard({
  article,
  className,
  featured = false,
}: {
  article: Article
  className?: string
  featured?: boolean
}) {
  const category = typeof article.category === 'object' ? article.category : null
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col',
        featured && 'lg:flex-row lg:gap-10',
        className,
      )}
    >
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden rounded-3xl bg-navy-50 ring-1 ring-line',
          featured && 'lg:aspect-auto lg:min-h-[22rem] lg:w-3/5',
        )}
      >
        {article.coverImage ? (
          <MediaImage
            media={article.coverImage}
            sizes={
              featured
                ? '(min-width: 1024px) 60vw, 100vw'
                : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
            }
            className="transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <ArticleArt label={category?.title} seed={article.id} />
        )}
      </div>
      <div className={cn('flex flex-1 flex-col pt-6', featured && 'lg:justify-center lg:pt-0')}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {category ? <span className="font-medium text-orchid-700">{category.title}</span> : null}
          <time dateTime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt)}</time>
          {featured && article.readingTime ? (
            <span>· {article.readingTime} min di lettura</span>
          ) : null}
        </div>
        <h3
          className={cn(
            'mt-3 font-serif leading-snug text-navy-950 transition-colors group-hover:text-navy-700',
            featured ? 'text-3xl md:text-4xl' : 'text-2xl',
          )}
        >
          <Link
            href={paths.article(article.slug as string)}
            className="after:absolute after:inset-0"
          >
            {article.title}
          </Link>
        </h3>
        <p className={cn('mt-3 leading-relaxed text-muted', featured && 'text-lg')}>
          {article.excerpt}
        </p>
      </div>
    </article>
  )
}
