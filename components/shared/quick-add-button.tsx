'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { addToCart } from '@/lib/cart-store'
import { calculateUnitPrice, type Product } from '@/lib/products'

export function QuickAddButton({ product }: { product: Product }) {
  const router = useRouter()

  function onAdd() {
    const size = product.sizes[0].label
    const flavour = product.flavours[0].name
    const eggless = product.eggless === 'always'
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      size,
      flavour,
      eggless,
      message: '',
      unitPrice: calculateUnitPrice(product, size, flavour, eggless),
      quantity: 1,
    })
    toast.success(`${product.name} added`, {
      description: `${size} · ${flavour}`,
      action: { label: 'View cart', onClick: () => router.push('/cart') },
    })
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Quick add ${product.name} (${product.sizes[0].label}) to cart`}
      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-primary/20 px-3 text-xs font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground md:px-4"
    >
      <Plus className="size-4" />
      <span className="hidden sm:inline">Add</span>
    </button>
  )
}
