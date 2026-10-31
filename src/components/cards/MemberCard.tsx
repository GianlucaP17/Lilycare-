import Link from 'next/link'
import React from 'react'

import { PortraitArt } from '@/components/ui/Art'
import { MediaImage } from '@/components/ui/MediaImage'
import { paths } from '@/lib/paths'
import { cn } from '@/lib/utils'
import type { Team } from '@/payload-types'

/**
 * Scheda di un membro del team.
 * - "vertical": foto sopra e testo sotto (griglie da 3 o più persone)
 * - "horizontal": foto a sinistra e testo a destra (ideale con 1–2 persone)
 */
export function MemberCard({
  member,
  className,
  layout = 'vertical',
}: {
  member: Team
  className?: string
  layout?: 'vertical' | 'horizontal'
}) {
  const fullName = [member.prefix, member.name].filter(Boolean).join(' ')
  const horizontal = layout === 'horizontal'
  return (
    <Link
      href={paths.member(member.slug as string)}
      className={cn(
        'group block',
        horizontal &&
          'grid items-center gap-8 rounded-[2rem] bg-white p-6 ring-1 ring-line transition-shadow duration-300 hover:shadow-lift sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:p-8',
        className,
      )}
    >
      <div
        className={cn(
          'arch relative aspect-[4/5] overflow-hidden bg-petrol-100 ring-1 ring-line transition-shadow duration-300',
          !horizontal && 'group-hover:shadow-lift',
        )}
      >
        {member.photo ? (
          <MediaImage
            media={member.photo}
            sizes={
              horizontal
                ? '(min-width: 1024px) 20vw, (min-width: 640px) 35vw, 90vw'
                : '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw'
            }
            className="transition-transform duration-700 group-hover:scale-[1.03]"
            alt={`${fullName}, ${member.role}`}
          />
        ) : (
          <PortraitArt name={member.name} />
        )}
      </div>
      <div className={horizontal ? undefined : 'mt-6'}>
        <h3 className="font-serif text-2xl text-petrol-950 transition-colors group-hover:text-petrol-700 md:text-[1.7rem]">
          {fullName}
        </h3>
        <p className="mt-1 text-sm font-medium tracking-wide text-blush-700">{member.role}</p>
        <p className="mt-3 leading-relaxed text-muted">{member.shortBio}</p>
        {horizontal && member.specialties?.length ? (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {member.specialties.slice(0, 4).map((s) => (
              <li
                key={s.id ?? s.text}
                className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-petrol-800 ring-1 ring-line"
              >
                {s.text}
              </li>
            ))}
          </ul>
        ) : null}
        <span className="mt-5 inline-block text-sm font-semibold text-petrol-700 underline-offset-4 group-hover:underline">
          Curriculum e prestazioni →
        </span>
      </div>
    </Link>
  )
}
