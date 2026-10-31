import { Plus } from 'lucide-react'
import React from 'react'

import { JsonLd } from '@/components/ui/JsonLd'
import { faqSchema } from '@/lib/schema'
import { cn } from '@/lib/utils'

/** Domande frequenti a fisarmonica (senza JavaScript) + dati strutturati FAQPage. */
export function FaqList({
  items,
  className,
  withSchema = true,
}: {
  items: Array<{ question: string; answer: string; id?: string | null }>
  className?: string
  withSchema?: boolean
}) {
  if (!items?.length) return null
  const schema = withSchema ? faqSchema(items) : null
  return (
    <>
      <div
        className={cn(
          'divide-y divide-line rounded-3xl bg-white px-6 ring-1 ring-line md:px-8',
          className,
        )}
      >
        {items.map((item, i) => (
          <details key={item.id ?? i} className="group py-1" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left">
              <h3 className="font-sans text-lg font-medium text-petrol-950">{item.question}</h3>
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700 transition-transform duration-300 group-open:rotate-45">
                <Plus size={18} aria-hidden />
              </span>
            </summary>
            <p className="max-w-3xl pb-6 leading-relaxed whitespace-pre-line text-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
      {schema ? <JsonLd data={schema} /> : null}
    </>
  )
}
