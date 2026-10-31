import { ArrowRight, Phone } from 'lucide-react'
import React from 'react'

import { LilyMark } from '@/components/icons/LilyMark'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { cn, toTelHref } from '@/lib/utils'

/** Fascia di invito all'azione: prenota o chiama. */
export function CtaBand({
  heading,
  text,
  primary,
  phone,
  style = 'dark',
}: {
  heading: string
  text?: string | null
  primary?: { label?: string | null; url?: string | null } | null
  phone?: string | null
  style?: 'dark' | 'light' | 'blush' | null
}) {
  const dark = style === 'dark'
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div
          className={cn(
            'relative overflow-hidden rounded-[2rem] px-8 py-14 md:px-16 md:py-20',
            dark && 'bg-petrol-900 text-white',
            style === 'light' && 'bg-white ring-1 ring-line',
            style === 'blush' && 'bg-blush-100',
          )}
        >
          <LilyMark
            size={420}
            mono
            className={cn(
              'pointer-events-none absolute -right-20 -bottom-24 opacity-[0.07]',
              dark ? 'text-white' : 'text-petrol-900',
            )}
          />
          <div className="relative max-w-2xl">
            <h2
              className={cn('text-4xl leading-tight font-normal md:text-5xl', dark && 'text-white')}
            >
              {heading}
            </h2>
            {text ? (
              <p
                className={cn(
                  'mt-5 text-lg leading-relaxed',
                  dark ? 'text-petrol-100' : 'text-muted',
                )}
              >
                {text}
              </p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                href={primary?.url || '/prenota'}
                variant={dark ? 'light' : 'primary'}
                size="lg"
              >
                {primary?.label || 'Prenota una visita'} <ArrowRight size={18} aria-hidden />
              </Button>
              {phone ? (
                <Button
                  href={toTelHref(phone)}
                  variant={dark ? 'ghost' : 'secondary'}
                  size="lg"
                  className={
                    dark ? 'text-white ring-1 ring-petrol-600 hover:bg-petrol-800' : undefined
                  }
                >
                  <Phone size={18} aria-hidden /> {phone}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
