import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Icon } from '@/components/icons/Icon'
import { paths } from '@/lib/paths'
import { cn, truncate } from '@/lib/utils'
import type { Service } from '@/payload-types'

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  const category = typeof service.category === 'object' ? service.category?.title : null
  return (
    <Link
      href={paths.service(service.slug as string)}
      className={cn(
        'group relative flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-navy-200',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-700 transition-colors duration-300 group-hover:bg-navy-800 group-hover:text-white">
          <Icon name={service.icon} size={26} />
        </span>
        <ArrowUpRight
          size={20}
          className="text-navy-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy-700"
          aria-hidden
        />
      </div>
      {category ? (
        <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-orchid-700 uppercase">
          {category}
        </p>
      ) : null}
      <h3
        className={cn(
          'font-serif text-2xl leading-tight text-navy-950',
          category ? 'mt-2' : 'mt-6',
        )}
      >
        {service.title}
      </h3>
      <p className="mt-3 flex-1 leading-relaxed text-muted">{truncate(service.summary, 150)}</p>
      <span className="mt-6 text-sm font-semibold text-navy-700">Scopri di più</span>
    </Link>
  )
}
