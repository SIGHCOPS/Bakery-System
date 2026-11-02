'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import {
  CATEGORIES,
  PRODUCTS,
  SORT_OPTIONS,
  getCategory,
  getCollection,
  type Product,
  type SortValue,
} from '@/lib/products'
import { ProductCard } from '@/components/shared/product-card'
import { buttonStyles } from '@/lib/styles'
import { cn } from '@/lib/utils'

const PRICE_RANGES = [
  { value: 'under-600', label: 'Under ₹600', test: (p: number) => p < 600 },
  { value: '600-900', label: '₹600 – ₹900', test: (p: number) => p >= 600 && p <= 900 },
  { value: 'over-900', label: 'Above ₹900', test: (p: number) => p > 900 },
] as const

function sortProducts(list: Product[], sort: SortValue) {
  const sorted = [...list]
  switch (sort) {
    case 'bestselling':
      return sorted.sort((a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller) || b.reviews - a.reviews)
    case 'price-asc':
      return sorted.sort((a, b) => a.basePrice - b.basePrice)
    case 'price-desc':
      return sorted.sort((a, b) => b.basePrice - a.basePrice)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    case 'newest':
      return sorted.sort((a, b) => b.addedOrder - a.addedOrder)
    default:
      return sorted
  }
}

export function Catalogue() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const query = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const collection = params.get('collection') ?? ''
  const price = params.get('price') ?? ''
  const egglessOnly = params.get('eggless') === '1'
  const sortParam = params.get('sort') ?? 'featured'
  const sort = (SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam : 'featured') as SortValue

  const [draftQuery, setDraftQuery] = useState(query)
  const [lastQuery, setLastQuery] = useState(query)
  if (query !== lastQuery) {
    setLastQuery(query)
    setDraftQuery(query)
  }
  const [filtersOpen, setFiltersOpen] = useState(false)

  function update(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString())
    for (const [key, value] of Object.entries(next)) {
      if (value) sp.set(key, value)
      else sp.delete(key)
    }
    const qs = sp.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const range = PRICE_RANGES.find((r) => r.value === price)
    const filtered = PRODUCTS.filter((p) => {
      if (category && p.category !== category) return false
      if (collection && !p.collections.includes(collection as Product['collections'][number])) return false
      if (range && !range.test(p.basePrice)) return false
      if (egglessOnly && p.eggless === 'none') return false
      if (q) {
        const haystack = [p.name, p.shortDescription, p.description, getCategory(p.category)?.name ?? '', ...p.flavours.map((f) => f.name)]
          .join(' ')
          .toLowerCase()
        if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false
      }
      return true
    })
    return sortProducts(filtered, sort)
  }, [query, category, collection, price, egglessOnly, sort])

  const activeCategory = getCategory(category)
  const activeCollection = getCollection(collection)
  const activeFilters = [
    query && { key: 'q', label: `“${query}”` },
    activeCollection && { key: 'collection', label: activeCollection.name },
    price && { key: 'price', label: PRICE_RANGES.find((r) => r.value === price)?.label ?? price },
    egglessOnly && { key: 'eggless', label: 'Eggless available' },
  ].filter(Boolean) as { key: string; label: string }[]

  const title = activeCollection?.name ?? activeCategory?.name ?? (query ? 'Search results' : 'The full menu')
  const description =
    activeCollection?.description ??
    activeCategory?.blurb ??
    'Every cake, pastry and dessert from our Jaipur kitchen — baked fresh to order.'

  const filterPanel = (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Price</legend>
        <div className="mt-3 space-y-1">
          {PRICE_RANGES.map((r) => (
            <label key={r.value} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-secondary">
              <input
                type="radio"
                name="price"
                checked={price === r.value}
                onChange={() => update({ price: r.value })}
                className="size-4 accent-primary"
              />
              {r.label}
            </label>
          ))}
          {price && (
            <button type="button" onClick={() => update({ price: null })} className="px-2 text-xs text-accent-foreground underline underline-offset-4">
              Clear price
            </button>
          )}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Dietary</legend>
        <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-secondary">
          <input
            type="checkbox"
            checked={egglessOnly}
            onChange={(e) => update({ eggless: e.target.checked ? '1' : null })}
            className="size-4 accent-primary"
          />
          Eggless available
        </label>
      </fieldset>
      <fieldset>
        <legend className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Collections</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {['pink-city', 'midnight-chocolate', 'little-indulgences', 'celebrate-love'].map((slug) => {
            const c = getCollection(slug)!
            const active = collection === slug
            return (
              <button
                key={slug}
                type="button"
                aria-pressed={active}
                onClick={() => update({ collection: active ? null : slug })}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs transition-colors',
                  active ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/40',
                )}
              >
                {c.name}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
      <section className="py-10 md:py-14">
        <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">Shop</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-primary md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            update({ q: draftQuery.trim() || null })
          }}
          className="mt-8 flex max-w-xl items-center rounded-full border bg-card pl-5 shadow-sm focus-within:border-primary/40"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <input
            id="shop-search"
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            placeholder="Search rasmalai, truffle, photo cake…"
            className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm outline-none"
          />
          {draftQuery && (
            <button
              type="button"
              onClick={() => {
                setDraftQuery('')
                update({ q: null })
              }}
              aria-label="Clear search"
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X className="size-4" />
            </button>
          )}
          <button type="submit" className={buttonStyles({ size: 'sm', className: 'm-1.5' })}>
            Search
          </button>
        </form>
      </section>

      <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
        <ul className="flex gap-2 pb-2">
          <li>
            <button
              type="button"
              aria-pressed={!category}
              onClick={() => update({ category: null })}
              className={cn(
                'rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors',
                !category ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              All
            </button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                aria-pressed={category === c.slug}
                onClick={() => update({ category: category === c.slug ? null : c.slug })}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors',
                  category === c.slug
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card hover:border-primary/40',
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <strong className="font-semibold text-primary">{results.length}</strong>{' '}
              {results.length === 1 ? 'product' : 'products'}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className={buttonStyles({ variant: 'outline', size: 'sm', className: 'lg:hidden' })}
              >
                <SlidersHorizontal /> Filters
                {activeFilters.length > 0 && (
                  <span className="rounded-full bg-gold px-1.5 text-[0.65rem] text-primary">{activeFilters.length}</span>
                )}
              </button>
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}
                  className="h-9 appearance-none rounded-full border border-border bg-card pr-9 pl-4 text-sm text-primary outline-none focus-visible:border-primary/50"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      Sort: {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              </div>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => update({ [f.key]: null })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground hover:bg-blush"
                >
                  {f.label}
                  <X className="size-3" aria-hidden />
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => router.replace(pathname, { scroll: false })}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                Clear all
              </button>
            </div>
          )}

          {results.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 xl:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center rounded-[2rem] border border-dashed bg-card px-6 py-20 text-center">
              <p className="font-serif text-3xl text-primary">Nothing on the menu matches that</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try a different flavour or clear your filters to see everything we bake.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDraftQuery('')
                  router.replace(pathname, { scroll: false })
                }}
                className={buttonStyles({ className: 'mt-6' })}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 animate-in fade-in bg-primary/30 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-in slide-in-from-bottom overflow-y-auto rounded-t-[2rem] bg-background p-6 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-3xl text-primary">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>
            {filterPanel}
            <button type="button" onClick={() => setFiltersOpen(false)} className={buttonStyles({ className: 'mt-8 w-full' })}>
              Show {results.length} {results.length === 1 ? 'product' : 'products'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
