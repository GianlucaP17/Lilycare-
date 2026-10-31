import type { Metadata } from 'next'
import React from 'react'

import { NewsListing, parsePage } from '@/components/page/NewsListing'
import { PageHeader } from '@/components/page/PageHeader'
import { paths } from '@/lib/paths'
import { buildMetadata } from '@/lib/seo'

type Props = { searchParams: Promise<{ pagina?: string | string[] }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePage((await searchParams).pagina)
  return {
    ...buildMetadata({
      title: page > 1 ? `Notizie e approfondimenti – pagina ${page}` : 'Notizie e approfondimenti',
      description:
        'Articoli e consigli dei professionisti di LilyCare su diagnostica per immagini, terapia del dolore, ozonoterapia, agopuntura e benessere.',
      path: page > 1 ? `${paths.news}?pagina=${page}` : paths.news,
      ogSubtitle: 'Consigli e approfondimenti dal nostro team',
    }),
  }
}

export default async function NewsPage({ searchParams }: Props) {
  const page = parsePage((await searchParams).pagina)
  return (
    <>
      <PageHeader
        eyebrow="Notizie"
        title={
          <>
            Notizie e <em className="text-orchid-600 italic">approfondimenti</em>
          </>
        }
        intro="Spiegazioni chiare sugli esami e sulle terapie, consigli per la salute e novità dal centro, scritti dai nostri professionisti."
        crumbs={[{ label: 'Notizie', href: paths.news }]}
      />
      <NewsListing page={page} basePath={paths.news} />
    </>
  )
}
