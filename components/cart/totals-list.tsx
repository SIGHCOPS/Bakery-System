import type { CartTotals } from '@/lib/cart-store'
import { formatINR } from '@/lib/styles'

export function TotalsList({
  totals,
  couponCode,
  slotFee = 0,
}: {
  totals: CartTotals
  couponCode: string | null
  slotFee?: number
}) {
  const grandTotal = totals.total + slotFee
  return (
    <dl className="mt-6 space-y-3 border-t pt-6 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal ({totals.itemCount} items)</dt>
        <dd className="text-primary tabular-nums">{formatINR(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Discount {couponCode && `(${couponCode})`}</dt>
          <dd className="text-accent-foreground tabular-nums">−{formatINR(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Delivery</dt>
        <dd className="text-primary tabular-nums">{totals.delivery === 0 ? 'Free' : formatINR(totals.delivery)}</dd>
      </div>
      {slotFee > 0 && (
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Midnight slot</dt>
          <dd className="text-primary tabular-nums">{formatINR(slotFee)}</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between border-t pt-4">
        <dt className="font-semibold text-primary">Total</dt>
        <dd className="font-serif text-3xl text-primary tabular-nums">{formatINR(grandTotal)}</dd>
      </div>
      <p className="text-xs text-muted-foreground">Inclusive of all taxes · Sample pricing</p>
    </dl>
  )
}
