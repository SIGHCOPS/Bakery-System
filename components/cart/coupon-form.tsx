'use client'

import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { applyCoupon, COUPONS, removeCoupon, useStore } from '@/lib/cart-store'
import { cn } from '@/lib/utils'

export function CouponForm() {
  const { couponCode } = useStore()
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null)

  function submit(value: string) {
    if (!value.trim()) {
      setFeedback({ ok: false, message: 'Enter a coupon code.' })
      return
    }
    const result = applyCoupon(value)
    setFeedback(result)
    if (result.ok) setCode('')
  }

  if (couponCode) {
    return (
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-gold bg-cream px-4 py-3 text-sm">
        <span className="flex items-center gap-2 text-primary">
          <Tag className="size-4 text-gold" aria-hidden />
          <span className="font-mono font-semibold tracking-wider">{couponCode}</span> applied
        </span>
        <button
          type="button"
          onClick={() => {
            removeCoupon()
            setFeedback(null)
          }}
          className="inline-flex size-7 items-center justify-center rounded-full hover:bg-card"
          aria-label="Remove coupon"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(code)
        }}
        className="flex rounded-full border bg-background p-1 focus-within:border-primary/40"
      >
        <label htmlFor="coupon" className="sr-only">
          Coupon code
        </label>
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="min-w-0 flex-1 bg-transparent px-4 font-mono text-sm tracking-wider uppercase outline-none placeholder:font-sans placeholder:tracking-normal placeholder:normal-case"
          aria-invalid={feedback ? !feedback.ok : undefined}
          aria-describedby="coupon-feedback"
        />
        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Apply
        </button>
      </form>
      <p
        id="coupon-feedback"
        aria-live="polite"
        className={cn('mt-2 min-h-4 text-xs', feedback?.ok ? 'text-primary' : 'text-destructive')}
      >
        {feedback?.message}
      </p>
      <div className="flex flex-wrap gap-2">
        {COUPONS.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => submit(c.code)}
            className="rounded-full border border-dashed border-gold/60 px-3 py-1 text-left text-xs text-muted-foreground transition-colors hover:border-gold hover:bg-cream"
          >
            <span className="font-mono font-semibold text-primary">{c.code}</span> · {c.description}
          </button>
        ))}
      </div>
    </div>
  )
}
