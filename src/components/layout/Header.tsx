'use client'

import { ArrowRight, ChevronDown, Menu, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/icons/Icon'
import { Button } from '@/components/ui/Button'
import { cn, toTelHref } from '@/lib/utils'

export type NavItem = { label: string; url: string; servicesMenu?: boolean | null }
export type MenuService = { title: string; slug: string; icon?: string | null }
export type MenuGroup = { title: string; services: MenuService[] }

type Props = {
  logo: React.ReactNode
  nav: NavItem[]
  groups: MenuGroup[]
  phone?: string | null
  address?: string
}

export function Header({ logo, nav, groups, phone, address }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [menuTop, setMenuTop] = useState(80)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Chiude i menu quando si cambia pagina
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMobileOpen(false)
    setMegaOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }, [])
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140)
  }, [])

  const isActive = (url: string) =>
    url === '/' ? pathname === '/' : pathname === url || pathname.startsWith(`${url}/`)

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled || megaOpen
          ? 'border-b border-line/80 bg-cream/90 shadow-[0_1px_0_rgb(0_0_0/0.02)] backdrop-blur-xl'
          : 'border-b border-transparent bg-cream',
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        {logo}

        <nav aria-label="Navigazione principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              item.servicesMenu && groups.length ? (
                <li key={item.url} onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                  <button
                    type="button"
                    aria-expanded={megaOpen}
                    aria-controls="menu-servizi"
                    onClick={() => setMegaOpen((v) => !v)}
                    className={cn(
                      'flex items-center gap-1 rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors',
                      isActive(item.url) || megaOpen
                        ? 'text-petrol-800'
                        : 'text-ink/80 hover:text-petrol-800',
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={cn('transition-transform', megaOpen && 'rotate-180')}
                      aria-hidden
                    />
                  </button>
                </li>
              ) : (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    aria-current={isActive(item.url) ? 'page' : undefined}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors',
                      isActive(item.url) ? 'text-petrol-800' : 'text-ink/80 hover:text-petrol-800',
                    )}
                  >
                    {item.label}
                    {isActive(item.url) ? (
                      <span
                        className="absolute inset-x-4 -bottom-0.5 h-px bg-blush-400"
                        aria-hidden
                      />
                    ) : null}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {phone ? (
            <a
              href={toTelHref(phone)}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-[0.95rem] font-medium text-petrol-800 transition-colors hover:bg-petrol-50 xl:inline-flex"
            >
              <Phone size={17} aria-hidden />
              {phone}
            </a>
          ) : null}
          <div className="hidden sm:block">
            <Button href="/prenota" size="md">
              Prenota una visita
            </Button>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-petrol-900 ring-1 ring-line lg:hidden"
            aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={mobileOpen}
            aria-controls="menu-mobile"
            onClick={() => {
              const bottom = headerRef.current?.getBoundingClientRect().bottom
              if (bottom) setMenuTop(Math.max(0, bottom))
              setMobileOpen((v) => !v)
            }}
          >
            {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Menu a tendina dei servizi (desktop) */}
      <div
        id="menu-servizi"
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
        className={cn(
          'absolute inset-x-0 top-full hidden border-b border-line bg-cream/97 shadow-lift backdrop-blur-xl transition-all duration-200 lg:block',
          megaOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
        )}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-10">
          <div className="col-span-3">
            <p className="eyebrow mb-3">Le nostre specialità</p>
            <p className="font-serif text-2xl leading-snug text-petrol-950">
              Diagnosi e cura nello stesso centro.
            </p>
            <Link
              href="/servizi"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-petrol-700 hover:text-petrol-900"
            >
              Tutti i servizi <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="col-span-9 grid grid-cols-2 gap-x-8 gap-y-8 xl:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/servizi/${s.slug}`}
                        className="group flex items-center gap-3 rounded-xl px-2 py-2 -mx-2 text-[0.95rem] text-ink transition-colors hover:bg-white"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700 transition-colors group-hover:bg-petrol-100">
                          <Icon name={s.icon} size={18} />
                        </span>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        style={{ top: menuTop }}
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-line bg-cream transition-all duration-300 lg:hidden',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <nav aria-label="Navigazione mobile" className="px-5 pt-4 pb-32 sm:px-8">
          <ul className="divide-y divide-line">
            {nav.map((item) =>
              item.servicesMenu && groups.length ? (
                <li key={item.url} className="py-2">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-serif text-2xl text-petrol-950">
                      {item.label}
                      <ChevronDown
                        size={20}
                        className="transition-transform group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <div className="space-y-5 pt-2 pb-4">
                      {groups.map((group) => (
                        <div key={group.title}>
                          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                            {group.title}
                          </p>
                          <ul className="space-y-1">
                            {group.services.map((s) => (
                              <li key={s.slug}>
                                <Link
                                  href={`/servizi/${s.slug}`}
                                  className="flex items-center gap-3 py-1.5 text-base text-ink"
                                >
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-petrol-50 text-petrol-700">
                                    <Icon name={s.icon} size={16} />
                                  </span>
                                  {s.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link
                        href="/servizi"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-petrol-700"
                      >
                        Tutti i servizi <ArrowRight size={16} aria-hidden />
                      </Link>
                    </div>
                  </details>
                </li>
              ) : (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className="block py-5 font-serif text-2xl text-petrol-950"
                    aria-current={isActive(item.url) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="mt-8 space-y-3">
            <Button href="/prenota" size="lg" className="w-full">
              Prenota una visita
            </Button>
            {phone ? (
              <Button href={toTelHref(phone)} variant="secondary" size="lg" className="w-full">
                <Phone size={18} aria-hidden /> Chiama {phone}
              </Button>
            ) : null}
            {address ? <p className="pt-3 text-center text-sm text-muted">{address}</p> : null}
          </div>
        </nav>
      </div>
    </header>
  )
}
