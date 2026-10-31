import Link from 'next/link'
import React from 'react'

import { MediaImage } from '@/components/ui/MediaImage'
import { paths } from '@/lib/paths'
import { initials } from '@/lib/utils'
import type { Team } from '@/payload-types'

/** Mini-scheda di un professionista (foto/iniziali, nome, ruolo). */
export function MemberMini({ member, label }: { member: Team; label?: string }) {
  const fullName = [member.prefix, member.name].filter(Boolean).join(' ')
  return (
    <Link href={paths.member(member.slug as string)} className="group flex items-center gap-4">
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-100 font-serif text-lg text-navy-800 ring-2 ring-white">
        {member.photo ? (
          <MediaImage media={member.photo} sizes="56px" alt={fullName} />
        ) : (
          initials(member.name)
        )}
      </span>
      <span>
        {label ? <span className="block text-xs text-muted">{label}</span> : null}
        <span className="block font-medium text-navy-950 group-hover:text-navy-700">
          {fullName}
        </span>
        <span className="block text-sm text-muted">{member.role}</span>
      </span>
    </Link>
  )
}
