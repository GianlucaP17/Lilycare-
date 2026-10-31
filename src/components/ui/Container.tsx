import React from 'react'

import { cn } from '@/lib/utils'

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide'
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8',
        size === 'narrow' && 'max-w-3xl',
        size === 'default' && 'max-w-7xl',
        size === 'wide' && 'max-w-[90rem]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Section({
  children,
  className,
  tone = 'cream',
  id,
  labelledBy,
}: {
  children: React.ReactNode
  className?: string
  tone?: 'cream' | 'white' | 'sand' | 'petrol' | 'blush'
  id?: string
  labelledBy?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative py-20 md:py-28',
        tone === 'cream' && 'bg-cream',
        tone === 'white' && 'bg-white',
        tone === 'sand' && 'bg-sand-100',
        tone === 'petrol' && 'bg-petrol-900 text-petrol-50',
        tone === 'blush' && 'bg-blush-50',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = 'left',
  id,
  as: As = 'h2',
  invert = false,
  className,
  children,
}: {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  align?: 'left' | 'center'
  id?: string
  as?: 'h1' | 'h2'
  invert?: boolean
  className?: string
  children?: React.ReactNode
}) {
  if (!eyebrow && !heading && !intro) return null
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center [&_.eyebrow]:justify-center',
        className,
      )}
    >
      {eyebrow ? <p className={cn('eyebrow mb-4', invert && 'text-blush-200')}>{eyebrow}</p> : null}
      {heading ? (
        <As
          id={id}
          className={cn('text-4xl leading-[1.08] font-normal md:text-5xl', invert && 'text-white')}
        >
          {heading}
        </As>
      ) : null}
      {intro ? (
        <p className={cn('mt-5 text-lg leading-relaxed text-muted', invert && 'text-petrol-100')}>
          {intro}
        </p>
      ) : null}
      {children}
    </div>
  )
}
