'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { CATEGORIES } from '@/lib/products'
import { useStore } from '@/lib/cart-store'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

const NAV = [
  { href: '/shop', label: 'All Cakes' },
  { href: '/shop?category=birthday', label: 'Birthday' },
  { href: '/shop?category=anniversary', label: 'Anniversary' },
  { href: '/shop?category=designer', label: 'Designer' },
  { href: '/shop?category=chocolate', label: 'Chocolate' },
  { href: '/shop?category=photo', label: 'Photo Cakes' },
  { href: '/shop?category=pastries', label: 'Pastries' },
  { href: '/shop?category=brownies-desserts', label: 'Desserts' },
]

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { items } = useStore()
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setSearchOpen(false)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 md:h-20 md:px-6">
        <button
          type="button"
          className="-ml-2 inline-flex size-10 items-center justify-center rounded-full text-primary hover:bg-secondary lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Menu className="size-5" />
        </button>

        <Logo />

        <nav aria-label="Primary" className="ml-8 hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative rounded-full px-3 py-2 text-sm text-foreground/80 transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:text-primary hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <form
            onSubmit={submitSearch}
            role="search"
            className={cn(
              'hidden items-center overflow-hidden rounded-full border transition-all duration-300 md:flex',
              searchOpen ? 'w-64 border-border bg-card pl-4' : 'w-10 border-transparent',
            )}
          >
            <label htmlFor="header-search" className="sr-only">
              Search cakes and desserts
            </label>
            <input
              id="header-search"
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
              placeholder="Search cakes, flavours…"
              tabIndex={searchOpen ? 0 : -1}
              className={cn(
                'min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground',
                !searchOpen && 'w-0 flex-none',
              )}
            />
            <button
              type={searchOpen ? 'submit' : 'button'}
              onClick={() => !searchOpen && setSearchOpen(true)}
              aria-label={searchOpen ? 'Submit search' : 'Open search'}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-primary hover:bg-secondary"
            >
              <Search className="size-5" />
            </button>
          </form>

          <Link
            href="/account"
            aria-label="Account"
            className={cn(
              'inline-flex size-10 items-center justify-center rounded-full text-primary hover:bg-secondary',
              pathname === '/account' && 'bg-secondary',
            )}
          >
            <User className="size-5" />
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
            className={cn(
              'relative inline-flex size-10 items-center justify-center rounded-full text-primary hover:bg-secondary',
              pathname === '/cart' && 'bg-secondary',
            )}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex min-w-5 animate-in zoom-in items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] leading-5 font-semibold text-primary">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 animate-in fade-in bg-primary/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm animate-in slide-in-from-left flex-col overflow-y-auto bg-background p-6 shadow-2xl duration-300">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full text-primary hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={submitSearch} role="search" className="mt-6 flex items-center rounded-full border bg-card pl-4">
              <label htmlFor="mobile-search" className="sr-only">
                Search cakes and desserts
              </label>
              <input
                id="mobile-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cakes, flavours…"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
              />
              <button type="submit" aria-label="Search" className="inline-flex size-11 items-center justify-center text-primary">
                <Search className="size-5" />
              </button>
            </form>
            <nav aria-label="Mobile" className="mt-6">
              <Link
                href="/shop"
                onClick={() => setMenuOpen(false)}
                className="block border-b py-3 font-serif text-2xl text-primary"
              >
                Shop all
              </Link>
              <ul>
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/shop?category=${c.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-baseline justify-between border-b py-3"
                    >
                      <span className="font-serif text-xl text-primary">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto grid grid-cols-2 gap-3 pt-8 text-sm">
              <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-secondary p-4 text-primary">
                <User className="mb-2 size-5" />
                My account
              </Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-accent p-4 text-accent-foreground">
                <ShoppingBag className="mb-2 size-5" />
                Cart ({count})
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
