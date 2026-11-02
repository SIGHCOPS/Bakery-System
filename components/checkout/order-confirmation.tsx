'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CalendarDays, Check, Clock, CreditCard, MapPin, Phone } from 'lucide-react'
import { useHydrated, useStore } from '@/lib/cart-store'
import { buttonStyles, formatINR } from '@/lib/styles'

function formatDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function OrderConfirmation() {
  const hydrated = useHydrated()
  const params = useSearchParams()
  const { orders } = useStore()
  const orderNumber = params.get('order')
  const order = orders.find((o) => o.orderNumber === orderNumber) ?? (orderNumber ? undefined : orders[0])

  if (!hydrated) return <div className="min-h-[60vh]" />

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-serif text-5xl text-primary">Order not found</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn’t find that demo order on this device. Orders are stored locally for this prototype.
        </p>
        <Link href="/shop" className={buttonStyles({ size: 'lg', className: 'mt-8' })}>
          Continue shopping
        </Link>
      </div>
    )
  }

  const { customer, totals } = order

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-20 animate-in zoom-in items-center justify-center rounded-full bg-primary text-primary-foreground duration-500">
          <Check className="size-9" aria-hidden />
        </span>
        <p className="mt-6 text-xs font-medium tracking-[0.3em] text-gold uppercase">Order confirmed</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-primary md:text-6xl">
          Thank you, {customer.name.split(' ')[0]}!
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Our pastry chefs will start on your order the morning of delivery. A confirmation would be sent to +91 {customer.mobile}.
        </p>
        <div className="mt-6 rounded-full border border-dashed border-gold bg-cream px-6 py-3">
          <span className="text-xs text-muted-foreground">Order number </span>
          <span className="font-mono font-semibold tracking-wider text-primary">{order.orderNumber}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">This is a demonstration order. No payment was taken.</p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-5">
        <section className="rounded-[2rem] border bg-card p-6 md:col-span-2 md:p-8" aria-labelledby="delivery-info">
          <h2 id="delivery-info" className="font-serif text-2xl text-primary">
            Delivery
          </h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span className="text-primary">{formatDate(customer.deliveryDate)}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span className="text-primary">{customer.timeSlot}</span>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span className="text-primary">
                {customer.name}
                <span className="block text-muted-foreground">
                  {customer.address}, Jaipur {customer.pincode}
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span className="text-primary">+91 {customer.mobile}</span>
            </li>
            <li className="flex gap-3">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span className="text-primary">{order.paymentMethod} (simulated)</span>
            </li>
          </ul>
          {customer.instructions && (
            <p className="mt-5 rounded-2xl bg-secondary p-4 text-sm text-primary">“{customer.instructions}”</p>
          )}
        </section>

        <section className="rounded-[2rem] border bg-card p-6 md:col-span-3 md:p-8" aria-labelledby="items-info">
          <h2 id="items-info" className="font-serif text-2xl text-primary">
            Order summary
          </h2>
          <ul className="mt-5 divide-y">
            {order.items.map((item) => (
              <li key={item.key} className="flex gap-3 py-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <Image src={item.image || '/placeholder.svg'} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium text-primary">
                    {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} · {item.flavour}
                    {item.eggless && ' · Eggless'}
                    {item.message && ` · “${item.message}”`}
                  </p>
                </div>
                <p className="text-sm font-medium text-primary tabular-nums">{formatINR(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-primary tabular-nums">{formatINR(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="text-accent-foreground tabular-nums">−{formatINR(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-primary tabular-nums">{totals.delivery ? formatINR(totals.delivery) : 'Free'}</dd>
            </div>
            {totals.slotFee > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Midnight slot</dt>
                <dd className="text-primary tabular-nums">{formatINR(totals.slotFee)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t pt-3">
              <dt className="font-semibold text-primary">Total paid</dt>
              <dd className="font-serif text-3xl text-primary tabular-nums">{formatINR(totals.grandTotal)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className={buttonStyles({ size: 'lg' })}>
          Continue shopping
        </Link>
        <Link href="/account" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
          View my orders
        </Link>
      </div>
    </div>
  )
}
