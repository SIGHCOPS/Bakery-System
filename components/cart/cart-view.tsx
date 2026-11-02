'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Leaf, ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  FREE_DELIVERY_THRESHOLD,
  computeTotals,
  removeFromCart,
  updateQuantity,
  useHydrated,
  useStore,
  addToCart,
} from '@/lib/cart-store'
import { buttonStyles, formatINR } from '@/lib/styles'
import { QuantityStepper } from '@/components/shared/quantity-stepper'
import { CouponForm } from './coupon-form'
import { TotalsList } from './totals-list'

export function CartView() {
  const hydrated = useHydrated()
  const { items, couponCode } = useStore()
  const totals = computeTotals(items, couponCode)
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - totals.subtotal)
  const progress = Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100)

  if (!hydrated) return <div className="mx-auto min-h-[60vh] max-w-7xl px-4 md:px-6" />

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ShoppingBag className="size-8" aria-hidden />
        </span>
        <h1 className="mt-6 font-serif text-5xl text-primary">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Looks like you haven’t picked a treat yet. Our ovens are warm and waiting.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className={buttonStyles({ size: 'lg' })}>
            Start shopping <ArrowRight />
          </Link>
          <Link href="/shop?sort=bestselling" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
            View bestsellers
          </Link>
        </div>
      </div>
    )
  }

  function remove(key: string) {
    const item = items.find((i) => i.key === key)
    removeFromCart(key)
    if (item) {
      toast(`${item.name} removed`, {
        action: {
          label: 'Undo',
          onClick: () => {
            const { key: _key, ...rest } = item
            addToCart(rest)
          },
        },
      })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">Your cart</p>
          <h1 className="mt-3 font-serif text-5xl leading-none text-primary">
            {totals.itemCount} {totals.itemCount === 1 ? 'treat' : 'treats'} selected
          </h1>
        </div>
        <Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
          Continue shopping
        </Link>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div>
          <div className="rounded-2xl bg-secondary p-4 text-sm">
            <p className="text-primary">
              {remainingForFree > 0 ? (
                <>
                  Add <strong>{formatINR(remainingForFree)}</strong> more for free delivery
                </>
              ) : (
                <strong>You’ve unlocked free delivery</strong>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card" aria-hidden>
              <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="mt-6 divide-y border-y">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-6 sm:gap-6">
                <Link href={`/product/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-cream sm:size-32">
                  <Image src={item.image || '/placeholder.svg'} alt={item.name} fill sizes="128px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/product/${item.slug}`} className="font-serif text-xl leading-tight text-primary hover:underline sm:text-2xl">
                        {item.name}
                      </Link>
                      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex gap-1">
                          <dt>Size:</dt>
                          <dd className="text-primary">{item.size}</dd>
                        </div>
                        <div className="flex gap-1">
                          <dt>Flavour:</dt>
                          <dd className="text-primary">{item.flavour}</dd>
                        </div>
                        {item.eggless && (
                          <div className="flex items-center gap-1 text-accent-foreground">
                            <Leaf className="size-3" aria-hidden />
                            <dt className="sr-only">Dietary:</dt>
                            <dd>Eggless</dd>
                          </div>
                        )}
                      </dl>
                      {item.message && (
                        <p className="mt-2 inline-block rounded-lg bg-cream px-2 py-1 text-xs text-primary">
                          Message: “{item.message}”
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-right font-semibold text-primary">
                      {formatINR(item.unitPrice * item.quantity)}
                      {item.quantity > 1 && (
                        <span className="block text-xs font-normal text-muted-foreground">{formatINR(item.unitPrice)} each</span>
                      )}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <QuantityStepper
                      size="sm"
                      value={item.quantity}
                      onChange={(v) => updateQuantity(item.key, v)}
                      label={`Quantity for ${item.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" aria-hidden /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start" aria-labelledby="summary-heading">
          <div className="rounded-[2rem] border bg-card p-6 md:p-8">
            <h2 id="summary-heading" className="font-serif text-3xl text-primary">
              Order summary
            </h2>
            <CouponForm />
            <TotalsList totals={totals} couponCode={couponCode} />
            <Link href="/checkout" className={buttonStyles({ size: 'lg', className: 'mt-6 w-full' })}>
              Proceed to checkout <ArrowRight />
            </Link>
            <Link href="/shop" className={buttonStyles({ variant: 'ghost', className: 'mt-2 w-full' })}>
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
