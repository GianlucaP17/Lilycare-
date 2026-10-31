import React from 'react'

import { MemberCard } from '@/components/cards/MemberCard'
import { Container, Section, SectionHeading } from '@/components/ui/Container'
import { getTeam } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { Team, TeamGridBlock as Block } from '@/payload-types'

export async function TeamGridBlock({ block }: { block: Block }) {
  const all = await getTeam()
  const members = block.members?.length
    ? block.members
        .map((m) => all.find((t) => t.id === (typeof m === 'object' ? m.id : m)))
        .filter((m): m is Team => Boolean(m))
    : all
  if (!members.length) return null

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        <div
          className={cn(
            'mt-14 grid',
            members.length >= 3
              ? 'gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3'
              : 'gap-8 lg:grid-cols-2',
          )}
        >
          {members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              layout={members.length >= 3 ? 'vertical' : 'horizontal'}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
