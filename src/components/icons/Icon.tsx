import {
  Accessibility,
  Activity,
  Bone,
  Bus,
  CalendarCheck,
  Car,
  Clock,
  Flower2,
  HandHeart,
  Heart,
  Leaf,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  SquareParking,
  Stethoscope,
  Syringe,
  TrainFront,
  Users,
  type LucideProps,
} from 'lucide-react'
import React from 'react'

import type { IconName } from '@/fields/icon'

type SvgProps = React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }

const base = ({ size = 24, strokeWidth = 1.5, ...rest }: SvgProps) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...rest,
})

/** Sonda ecografica con onde. */
const Ultrasound = (props: SvgProps) => (
  <svg {...base(props)}>
    <path d="M10 2.5h4v6.2l2.2 2.8v1.5H7.8v-1.5L10 8.7V2.5Z" />
    <path d="M7.3 16.2c2.9 1.9 6.5 1.9 9.4 0" />
    <path d="M5.4 19.3c4 2.6 9.2 2.6 13.2 0" />
  </svg>
)

/** Molecola di ozono (O₃). */
const Ozone = (props: SvgProps) => (
  <svg {...base(props)}>
    <circle cx="5.5" cy="15.5" r="3" />
    <circle cx="12" cy="8.5" r="3" />
    <circle cx="18.5" cy="15.5" r="3" />
    <path d="M7.6 13.3 9.9 10.8M14.1 10.8l2.3 2.5" />
  </svg>
)

/** Onde d'urto: applicatore con onde concentriche. */
const Shockwave = (props: SvgProps) => (
  <svg {...base(props)}>
    <rect x="2" y="9.5" width="5" height="5" rx="1.2" />
    <path d="M10 8.8a4.5 4.5 0 0 1 0 6.4" />
    <path d="M13.4 6.2a8.2 8.2 0 0 1 0 11.6" />
    <path d="M16.9 3.6a12 12 0 0 1 0 16.8" />
  </svg>
)

/** Aghi da agopuntura. */
const Acupuncture = (props: SvgProps) => (
  <svg {...base(props)}>
    <path d="M3.5 20.5 13.2 10.8" />
    <circle cx="15" cy="9" r="2.3" />
    <path d="M9 21.5l6.4-6.4" />
    <circle cx="17" cy="13.5" r="1.7" />
    <path d="M19.5 3.5v2.5M18.25 4.75h2.5" />
  </svg>
)

const lucideMap: Record<string, React.ComponentType<LucideProps>> = {
  xray: Bone,
  doppler: Activity,
  syringe: Syringe,
  nursing: HandHeart,
  aesthetic: Flower2,
  stethoscope: Stethoscope,
  shield: ShieldCheck,
  users: Users,
  calendar: CalendarCheck,
  clock: Clock,
  pin: MapPin,
  heart: Heart,
  leaf: Leaf,
  sparkles: Sparkles,
  route: Route,
  car: Car,
  train: TrainFront,
  bus: Bus,
  parking: SquareParking,
  accessibility: Accessibility,
}

const customMap: Record<string, (props: SvgProps) => React.ReactElement> = {
  ultrasound: Ultrasound,
  ozone: Ozone,
  shockwave: Shockwave,
  acupuncture: Acupuncture,
}

type Props = {
  name?: IconName | string | null
  size?: number
  strokeWidth?: number
  className?: string
}

/** Icona per nome (vedi src/fields/icon.ts per l'elenco). */
export function Icon({ name, size = 24, strokeWidth = 1.5, className }: Props) {
  const key = name || 'stethoscope'
  const Custom = customMap[key]
  if (Custom) return <Custom size={size} strokeWidth={strokeWidth} className={className} />
  const Lucide = lucideMap[key] ?? Stethoscope
  return <Lucide size={size} strokeWidth={strokeWidth} className={className} aria-hidden />
}
