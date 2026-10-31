import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { absoluteUrl, cn } from '@/lib/utils'

import { JsonLd } from './JsonLd'

export type Crumb = { label: string; href: string }

/** Percorso di navigazione ("Home › Servizi › Ozonoterapia") con dati strutturati per Google. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ label: 'Home', href: '/' }, ...items]
  return (
    <>
      <nav aria-label="Percorso" className={cn('text-sm text-muted', className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight size={14} className="text-petrol-300" aria-hidden /> : null}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-petrol-900">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-petrol-800">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </>
  )
}
