import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { pathForDoc } from '@/lib/paths'
import { cn } from '@/lib/utils'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const doc = linkNode.fields.doc
      if (!doc) return '/'
      const value = doc.value as { slug?: string } | number
      const slug = typeof value === 'object' ? value?.slug : undefined
      return pathForDoc(doc.relationTo, slug)
    },
  }),
})

/** Testo formattato scritto nel pannello admin. */
export function RichText({
  data,
  className,
  size = 'base',
}: {
  data: unknown
  className?: string
  size?: 'base' | 'lg'
}) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  return (
    <PayloadRichText
      data={data as SerializedEditorState}
      converters={converters}
      className={cn(
        'prose prose-lily max-w-none',
        size === 'lg' && 'prose-lg',
        'prose-headings:font-serif prose-headings:font-normal prose-h2:text-3xl prose-h3:text-2xl',
        className,
      )}
    />
  )
}
