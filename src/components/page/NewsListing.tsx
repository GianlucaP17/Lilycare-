import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { ArticleCard } from '@/components/cards/ArticleCard'
import { Container } from '@/components/ui/Container'
import { getArticleCategories, getArticles } from '@/lib/data'
import { paths } from '@/lib/paths'
import { cn } from '@/lib/utils'

/** Elenco notizie con filtro per categoria e paginazione. */
export async function NewsListing({
  page,
  categoryId,
  basePath,
  activeSlug,
}: {
  page: number
  categoryId?: number
  basePath: string
  activeSlug?: string
}) {
  const [result, categories] = await Promise.all([
    getArticles({ page, limit: 10, categoryId }),
    getArticleCategories(),
  ])
  // Pagine oltre l'ultima: 404 (evita pagine vuote indicizzate da Google)
  if (page > 1 && page > result.totalPages) notFound()

  const [first, ...rest] = result.docs
  const showFeatured = page === 1 && first

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        {categories.length ? (
          <nav aria-label="Categorie" className="mb-14 flex flex-wrap gap-2">
            <Link
              href={paths.news}
              aria-current={!activeSlug ? 'page' : undefined}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors',
                !activeSlug
                  ? 'bg-navy-800 text-white ring-navy-800'
                  : 'bg-white text-navy-900 ring-line hover:ring-navy-300',
              )}
            >
              Tutte
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={paths.newsCategory(c.slug as string)}
                aria-current={activeSlug === c.slug ? 'page' : undefined}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors',
                  activeSlug === c.slug
                    ? 'bg-navy-800 text-white ring-navy-800'
                    : 'bg-white text-navy-900 ring-line hover:ring-navy-300',
                )}
              >
                {c.title}
              </Link>
            ))}
          </nav>
        ) : null}

        {!result.docs.length ? (
          <p className="rounded-3xl bg-cream p-10 text-center text-lg text-muted ring-1 ring-line">
            Non ci sono ancora articoli in questa sezione. Torna a trovarci presto!
          </p>
        ) : (
          <>
            {showFeatured ? (
              <ArticleCard article={first} featured className="mb-16 border-b border-line pb-16" />
            ) : null}
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {(showFeatured ? rest : result.docs).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}

        {result.totalPages > 1 ? (
          <nav
            aria-label="Paginazione"
            className="mt-16 flex items-center justify-between border-t border-line pt-8"
          >
            {result.hasPrevPage ? (
              <Link
                href={result.prevPage === 1 ? basePath : `${basePath}?pagina=${result.prevPage}`}
                className="inline-flex items-center gap-2 font-medium text-navy-800 hover:text-navy-950"
                rel="prev"
              >
                <ArrowLeft size={16} aria-hidden /> Più recenti
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm text-muted">
              Pagina {result.page} di {result.totalPages}
            </span>
            {result.hasNextPage ? (
              <Link
                href={`${basePath}?pagina=${result.nextPage}`}
                className="inline-flex items-center gap-2 font-medium text-navy-800 hover:text-navy-950"
                rel="next"
              >
                Meno recenti <ArrowRight size={16} aria-hidden />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </Container>
    </section>
  )
}

export const parsePage = (value: string | string[] | undefined) => {
  const n = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(n) && n > 0 && n < 1000 ? n : 1
}
