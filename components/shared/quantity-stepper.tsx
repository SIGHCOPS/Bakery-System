'use client'

import { Minus, Plus } from 'lucide-react'
import { MAX_QUANTITY } from '@/lib/cart-store'
import { cn } from '@/lib/utils'

export function QuantityStepper({
  value,
  onChange,
  size = 'md',
  label = 'Quantity',
}: {
  value: number
  onChange: (value: number) => void
  size?: 'sm' | 'md'
  label?: string
}) {
  const btn = cn(
    'inline-flex items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent',
    size === 'sm' ? 'size-8' : 'size-11',
  )
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center rounded-full border bg-card', size === 'sm' ? 'p-0.5' : 'p-1')}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <span className={cn('text-center font-medium tabular-nums text-primary', size === 'sm' ? 'w-7 text-sm' : 'w-10')} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
