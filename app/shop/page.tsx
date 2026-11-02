import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Catalogue } from '@/components/shop/catalogue'

export const metadata: Metadata = {
  title: 'Shop cakes & desserts',
  description: 'Browse birthday, anniversary, designer, chocolate and photo cakes, pastries and desserts.',
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[60vh] max-w-7xl px-4 md:px-6" />}>
      <Catalogue />
    </Suspense>
  )
}
