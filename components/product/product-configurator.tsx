'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Leaf, ShoppingBag, Truck, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { addToCart, MAX_QUANTITY } from '@/lib/cart-store'
import { calculateUnitPrice, EGGLESS_FEE_PER_UNIT, type Product } from '@/lib/products'
import { buttonStyles, formatINR, inputStyles } from '@/lib/styles'
import { QuantityStepper } from '@/components/shared/quantity-stepper'
import { cn } from '@/lib/utils'

const MESSAGE_LIMIT = 30

export function ProductConfigurator({ product }: { product: Product }) {
  const router = useRouter()
  const [size, setSize] = useState(product.sizes[0].label)
  const [flavour, setFlavour] = useState(product.flavours[0].name)
  const [eggless, setEggless] = useState(product.eggless === 'always')
  const [message, setMessage] = useState('')
  const [quantity, setQuantity] = useState(1)

  const unitPrice = calculateUnitPrice(product, size, flavour, eggless)
  const total = unitPrice * quantity
  const selectedSize = product.sizes.find((s) => s.label === size) ?? product.sizes[0]
  const basePriceForSize = calculateUnitPrice(product, size, product.flavours[0].name, false)

  function add(goToCart: boolean) {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      size,
      flavour,
      eggless,
      message: message.trim(),
      unitPrice,
      quantity: Math.min(quantity, MAX_QUANTITY),
    })
    if (goToCart) {
      router.push('/cart')
      return
    }
    toast.success(`${product.name} added to cart`, {
      description: `${quantity} × ${size} · ${flavour}${eggless ? ' · Eggless' : ''}`,
      action: { label: 'View cart', onClick: () => router.push('/cart') },
    })
  }

  return (
    <div className="mt-8 space-y-8 border-t pt-8">
      <div className="flex items-end gap-3">
        <p className="font-serif text-5xl leading-none text-primary" aria-live="polite">
          {formatINR(total)}
        </p>
        {quantity > 1 && <p className="pb-1 text-sm text-muted-foreground">{formatINR(unitPrice)} each</p>}
      </div>

      <fieldset>
        <legend className="flex w-full items-center justify-between text-sm font-semibold text-primary">
          Weight / size
          <span className="text-xs font-normal text-muted-foreground">{selectedSize.detail}</span>
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {product.sizes.map((s) => {
            const active = s.label === size
            return (
              <label
                key={s.label}
                className={cn(
                  'flex cursor-pointer flex-col items-center rounded-2xl border px-3 py-3 text-center transition-all has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
                  active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <input type="radio" name="size" value={s.label} checked={active} onChange={() => setSize(s.label)} className="sr-only" />
                <span className="text-sm font-semibold">{s.label}</span>
                <span className={cn('mt-0.5 text-xs', active ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {formatINR(calculateUnitPrice(product, s.label, flavour, eggless))}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {product.flavours.length > 1 && (
        <fieldset>
          <legend className="text-sm font-semibold text-primary">Flavour</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.flavours.map((f) => {
              const active = f.name === flavour
              const extra = Math.round(f.extra * selectedSize.multiplier)
              return (
                <label
                  key={f.name}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
                    active ? 'border-primary bg-secondary text-primary' : 'border-border bg-card hover:border-primary/40',
                  )}
                >
                  <input type="radio" name="flavour" value={f.name} checked={active} onChange={() => setFlavour(f.name)} className="sr-only" />
                  {active && <Check className="size-3.5" aria-hidden />}
                  {f.name}
                  {extra > 0 && <span className="text-xs text-muted-foreground">+{formatINR(extra)}</span>}
                </label>
              )
            })}
          </div>
        </fieldset>
      )}

      {product.eggless === 'optional' && (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 has-[:checked]:border-gold has-[:checked]:bg-cream">
          <span className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Leaf className="size-4" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold text-primary">Make it eggless</span>
              <span className="text-xs text-muted-foreground">
                +{formatINR(Math.round(EGGLESS_FEE_PER_UNIT * selectedSize.multiplier))} · prepared on our eggless line
              </span>
            </span>
          </span>
          <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
            <input
              type="checkbox"
              checked={eggless}
              onChange={(e) => setEggless(e.target.checked)}
              className="peer sr-only"
            />
            <span className="absolute inset-0 rounded-full bg-border transition-colors peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/30" />
            <span className="absolute left-0.5 size-5 rounded-full bg-card shadow transition-transform peer-checked:translate-x-5" />
          </span>
        </label>
      )}
      {product.eggless === 'always' && (
        <p className="flex items-center gap-2 rounded-2xl bg-cream p-4 text-sm text-primary">
          <Leaf className="size-4 text-gold" aria-hidden /> This recipe is 100% eggless.
        </p>
      )}

      {product.allowsMessage && (
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="cake-message" className="text-sm font-semibold text-primary">
              Message on cake <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {message.length}/{MESSAGE_LIMIT}
            </span>
          </div>
          <input
            id="cake-message"
            value={message}
            maxLength={MESSAGE_LIMIT}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Happy Birthday Aarav!"
            className={cn(inputStyles, 'mt-2')}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Piped by hand in chocolate. Free of charge.</p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <QuantityStepper value={quantity} onChange={(v) => setQuantity(Math.max(1, Math.min(MAX_QUANTITY, v)))} />
        <button type="button" onClick={() => add(false)} className={buttonStyles({ size: 'lg', className: 'flex-1' })}>
          <ShoppingBag /> Add to cart · {formatINR(total)}
        </button>
      </div>
      <button type="button" onClick={() => add(true)} className={buttonStyles({ variant: 'outline', size: 'lg', className: 'w-full' })}>
        <Zap /> Buy now
      </button>

      <ul className="grid gap-3 rounded-2xl bg-secondary p-5 text-sm sm:grid-cols-2">
        <li className="flex items-start gap-3">
          <Truck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
          <span className="text-primary">
            Free delivery over ₹999
            <span className="block text-xs text-muted-foreground">Across Jaipur city limits</span>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
          <span className="text-primary">
            Same-day & midnight slots
            <span className="block text-xs text-muted-foreground">
              Starting at {formatINR(basePriceForSize)} for {size}
            </span>
          </span>
        </li>
      </ul>
    </div>
  )
}
