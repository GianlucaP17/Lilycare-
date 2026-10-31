import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'blush'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-navy-800 text-white shadow-soft hover:bg-navy-700 active:bg-navy-900 focus-visible:outline-navy-600',
  secondary:
    'bg-white text-navy-900 ring-1 ring-inset ring-line hover:ring-navy-300 hover:bg-navy-50',
  ghost: 'text-navy-800 hover:bg-navy-50',
  light: 'bg-white text-navy-900 hover:bg-navy-50 shadow-soft',
  blush: 'bg-orchid-500 text-white hover:bg-orchid-600 shadow-soft',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.95rem] gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}

type LinkProps = CommonProps & {
  href: string
  external?: boolean
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>

type NativeButtonProps = CommonProps & {
  href?: undefined
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )
}

export function Button(props: LinkProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props
  const classes = buttonClasses(variant, size, className)

  if (props.href !== undefined) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
    if (isExternal) {
      const newTab = /^https?:/.test(href)
      return (
        <a
          href={href}
          className={classes}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...rest}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
