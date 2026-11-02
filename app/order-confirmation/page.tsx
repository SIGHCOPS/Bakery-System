import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrderConfirmation } from '@/components/checkout/order-confirmation'

export const metadata: Metadata = { title: 'Order confirmed' }

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <OrderConfirmation />
    </Suspense>
  )
}
