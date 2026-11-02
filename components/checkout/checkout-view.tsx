'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Banknote, CreditCard, Landmark, Loader2, Lock, Smartphone } from 'lucide-react'
import {
  computeTotals,
  generateOrderNumber,
  placeOrder,
  useHydrated,
  useStore,
  type Order,
} from '@/lib/cart-store'
import { buttonStyles, formatINR, inputStyles } from '@/lib/styles'
import { TotalsList } from '@/components/cart/totals-list'
import { cn } from '@/lib/utils'

export const TIME_SLOTS = [
  { value: '10:00 AM – 1:00 PM', fee: 0 },
  { value: '1:00 PM – 4:00 PM', fee: 0 },
  { value: '4:00 PM – 7:00 PM', fee: 0 },
  { value: '7:00 PM – 10:00 PM', fee: 0 },
  { value: '11:30 PM – 12:00 AM (Midnight)', fee: 199 },
]

const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI', detail: 'GPay, PhonePe, Paytm', icon: Smartphone },
  { value: 'Card', label: 'Credit / Debit card', detail: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { value: 'Net banking', label: 'Net banking', detail: 'All major Indian banks', icon: Landmark },
  { value: 'Cash on delivery', label: 'Cash on delivery', detail: 'Pay when it arrives', icon: Banknote },
]

type Fields = {
  name: string
  mobile: string
  address: string
  pincode: string
  deliveryDate: string
  timeSlot: string
  instructions: string
  paymentMethod: string
  upiId: string
  cardNumber: string
  cardExpiry: string
  cardCvv: string
}

type Errors = Partial<Record<keyof Fields, string>>

function toDateInput(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function validate(f: Fields, today: string): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Please enter the recipient’s full name.'
  if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = 'Enter a valid 10-digit Indian mobile number.'
  if (f.address.trim().length < 10) e.address = 'Please enter a complete address (house, street, area).'
  if (!/^\d{6}$/.test(f.pincode)) e.pincode = 'Pincode must be 6 digits.'
  else if (!/^30[23]\d{3}$/.test(f.pincode)) e.pincode = 'We currently deliver within Jaipur (302xxx / 303xxx).'
  if (!f.deliveryDate) e.deliveryDate = 'Choose a delivery date.'
  else if (f.deliveryDate < today) e.deliveryDate = 'Delivery date can’t be in the past.'
  if (!f.timeSlot) e.timeSlot = 'Choose a delivery time slot.'
  if (!f.paymentMethod) e.paymentMethod = 'Choose a payment method.'
  if (f.paymentMethod === 'UPI' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(f.upiId)) e.upiId = 'Enter a valid UPI ID, e.g. name@okhdfc.'
  if (f.paymentMethod === 'Card') {
    if (!/^\d{16}$/.test(f.cardNumber.replace(/\s/g, ''))) e.cardNumber = 'Card number must be 16 digits.'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.cardExpiry)) e.cardExpiry = 'Use MM/YY.'
    if (!/^\d{3}$/.test(f.cardCvv)) e.cardCvv = '3 digits.'
  }
  return e
}

function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-primary">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function CheckoutView() {
  const router = useRouter()
  const hydrated = useHydrated()
  const { items, couponCode } = useStore()
  const totals = computeTotals(items, couponCode)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [fields, setFields] = useState<Fields>({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    deliveryDate: '',
    timeSlot: '',
    instructions: '',
    paymentMethod: 'UPI',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const today = toDateInput(new Date())
  const slotFee = TIME_SLOTS.find((s) => s.value === fields.timeSlot)?.fee ?? 0
  const grandTotal = totals.total + slotFee

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function aria(key: keyof Fields) {
    return { 'aria-invalid': !!errors[key] || undefined, 'aria-describedby': errors[key] ? `${key}-error` : undefined }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validate(fields, today)
    setErrors(found)
    const firstKey = Object.keys(found)[0]
    if (firstKey) {
      document.getElementById(firstKey)?.focus()
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    const order: Order = {
      orderNumber: generateOrderNumber(),
      placedAt: new Date().toISOString(),
      items,
      customer: {
        name: fields.name.trim(),
        mobile: fields.mobile,
        address: fields.address.trim(),
        pincode: fields.pincode,
        deliveryDate: fields.deliveryDate,
        timeSlot: fields.timeSlot,
        instructions: fields.instructions.trim(),
      },
      paymentMethod: fields.paymentMethod,
      totals: { ...totals, slotFee, grandTotal },
    }
    placeOrder(order)
    router.push(`/order-confirmation?order=${order.orderNumber}`)
  }

  if (!hydrated) return <div className="mx-auto min-h-[60vh] max-w-7xl px-4 md:px-6" />

  if (items.length === 0 && !submitting) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-serif text-5xl text-primary">Nothing to check out yet</h1>
        <p className="mt-3 text-muted-foreground">Add a cake or two to your cart, then come back here.</p>
        <Link href="/shop" className={buttonStyles({ size: 'lg', className: 'mt-8' })}>
          Browse the menu
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <Link href="/cart" className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> Back to cart
      </Link>
      <h1 className="mt-4 font-serif text-5xl leading-none text-primary">Checkout</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Demonstration checkout — no real order is placed and no payment is taken.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_26rem]">
        <div className="space-y-8">
          <section className="rounded-[2rem] border bg-card p-6 md:p-8" aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="flex items-center gap-3 font-serif text-3xl text-primary">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary font-sans text-sm text-primary-foreground">1</span>
              Delivery details
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Recipient name" error={errors.name}>
                <input id="name" autoComplete="name" value={fields.name} onChange={(e) => set('name', e.target.value)} className={inputStyles} placeholder="Ananya Sharma" {...aria('name')} />
              </Field>
              <Field id="mobile" label="Mobile number" error={errors.mobile}>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-input bg-secondary px-3 text-sm text-muted-foreground">+91</span>
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={fields.mobile}
                    onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={cn(inputStyles, 'rounded-l-none')}
                    placeholder="98290 12345"
                    {...aria('mobile')}
                  />
                </div>
              </Field>
              <Field id="address" label="Delivery address" error={errors.address} className="sm:col-span-2">
                <textarea
                  id="address"
                  rows={3}
                  autoComplete="street-address"
                  value={fields.address}
                  onChange={(e) => set('address', e.target.value)}
                  className={cn(inputStyles, 'resize-none')}
                  placeholder="House / flat no., street, area, landmark"
                  {...aria('address')}
                />
              </Field>
              <Field id="pincode" label="Pincode" error={errors.pincode} hint="Delivering across Jaipur (302xxx, 303xxx)">
                <input
                  id="pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={fields.pincode}
                  onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={inputStyles}
                  placeholder="302001"
                  {...aria('pincode')}
                />
              </Field>
              <Field id="deliveryDate" label="Delivery date" error={errors.deliveryDate}>
                <input
                  id="deliveryDate"
                  type="date"
                  min={today}
                  value={fields.deliveryDate}
                  onChange={(e) => set('deliveryDate', e.target.value)}
                  className={inputStyles}
                  {...aria('deliveryDate')}
                />
              </Field>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-primary">Delivery time slot</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" id="timeSlot" tabIndex={-1}>
                {TIME_SLOTS.map((slot) => (
                  <label
                    key={slot.value}
                    className={cn(
                      'flex cursor-pointer flex-col rounded-2xl border px-4 py-3 text-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
                      fields.timeSlot === slot.value ? 'border-primary bg-secondary' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot.value}
                      checked={fields.timeSlot === slot.value}
                      onChange={() => set('timeSlot', slot.value)}
                      className="sr-only"
                    />
                    <span className="font-medium text-primary">{slot.value}</span>
                    <span className="text-xs text-muted-foreground">{slot.fee ? `+${formatINR(slot.fee)}` : 'Free'}</span>
                  </label>
                ))}
              </div>
              {errors.timeSlot && <p className="mt-1.5 text-xs text-destructive">{errors.timeSlot}</p>}
            </fieldset>

            <Field id="instructions" label="Special instructions (optional)" className="mt-6">
              <textarea
                id="instructions"
                rows={2}
                maxLength={200}
                value={fields.instructions}
                onChange={(e) => set('instructions', e.target.value)}
                className={cn(inputStyles, 'resize-none')}
                placeholder="e.g. Call before arriving, it’s a surprise!"
              />
            </Field>
          </section>

          <section className="rounded-[2rem] border bg-card p-6 md:p-8" aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="flex items-center gap-3 font-serif text-3xl text-primary">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary font-sans text-sm text-primary-foreground">2</span>
              Payment
            </h2>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden /> Simulated payment — nothing will be charged.
            </p>
            <fieldset className="mt-6">
              <legend className="sr-only">Payment method</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
                      fields.paymentMethod === m.value ? 'border-primary bg-secondary' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.value}
                      checked={fields.paymentMethod === m.value}
                      onChange={() => set('paymentMethod', m.value)}
                      className="size-4 accent-primary"
                    />
                    <m.icon className="size-5 text-gold" aria-hidden />
                    <span>
                      <span className="block text-sm font-medium text-primary">{m.label}</span>
                      <span className="text-xs text-muted-foreground">{m.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {fields.paymentMethod === 'UPI' && (
              <Field id="upiId" label="UPI ID" error={errors.upiId} hint="Demo only — try anything like name@okhdfc" className="mt-6 sm:max-w-sm">
                <input id="upiId" value={fields.upiId} onChange={(e) => set('upiId', e.target.value.trim())} className={inputStyles} placeholder="yourname@okhdfc" {...aria('upiId')} />
              </Field>
            )}
            {fields.paymentMethod === 'Card' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <Field id="cardNumber" label="Card number" error={errors.cardNumber} hint="Demo — use 4111 1111 1111 1111" className="sm:col-span-2">
                  <input
                    id="cardNumber"
                    inputMode="numeric"
                    autoComplete="off"
                    value={fields.cardNumber}
                    onChange={(e) =>
                      set(
                        'cardNumber',
                        e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 16)
                          .replace(/(\d{4})(?=\d)/g, '$1 '),
                      )
                    }
                    className={inputStyles}
                    placeholder="4111 1111 1111 1111"
                    {...aria('cardNumber')}
                  />
                </Field>
                <Field id="cardExpiry" label="Expiry" error={errors.cardExpiry}>
                  <input
                    id="cardExpiry"
                    inputMode="numeric"
                    autoComplete="off"
                    value={fields.cardExpiry}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, '').slice(0, 4)
                      set('cardExpiry', d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
                    }}
                    className={inputStyles}
                    placeholder="MM/YY"
                    {...aria('cardExpiry')}
                  />
                </Field>
                <Field id="cardCvv" label="CVV" error={errors.cardCvv}>
                  <input
                    id="cardCvv"
                    inputMode="numeric"
                    autoComplete="off"
                    type="password"
                    value={fields.cardCvv}
                    onChange={(e) => set('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className={inputStyles}
                    placeholder="•••"
                    {...aria('cardCvv')}
                  />
                </Field>
              </div>
            )}
            {fields.paymentMethod === 'Net banking' && (
              <p className="mt-6 rounded-2xl bg-cream p-4 text-sm text-primary">
                You’d be redirected to your bank in a live store. For this demo, we’ll simulate a successful payment.
              </p>
            )}
            {fields.paymentMethod === 'Cash on delivery' && (
              <p className="mt-6 rounded-2xl bg-cream p-4 text-sm text-primary">
                Pay by cash or UPI to our delivery partner when your order arrives.
              </p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start" aria-labelledby="checkout-summary">
          <div className="rounded-[2rem] border bg-card p-6 md:p-8">
            <h2 id="checkout-summary" className="font-serif text-3xl text-primary">
              Order summary
            </h2>
            <ul className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image src={item.image || '/placeholder.svg'} alt="" fill sizes="64px" className="object-cover" />
                    <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-medium text-primary">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} · {item.flavour}
                      {item.eggless && ' · Eggless'}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-primary tabular-nums">{formatINR(item.unitPrice * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <TotalsList totals={totals} couponCode={couponCode} slotFee={slotFee} />
            <button type="submit" disabled={submitting} className={buttonStyles({ size: 'lg', className: 'mt-6 w-full' })}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" /> Processing demo payment…
                </>
              ) : (
                <>
                  <Lock /> Place order · {formatINR(grandTotal)}
                </>
              )}
            </button>
          </div>
        </aside>
      </form>
    </div>
  )
}
