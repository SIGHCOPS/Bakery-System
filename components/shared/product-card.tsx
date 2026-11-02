import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { calculateUnitPrice, getCategory, type Product } from '@/lib/products'
import { formatINR } from '@/lib/styles'
import { cn } from '@/lib/utils'
import { QuickAddButton } from './quick-add-button'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const fromPrice = calculateUnitPrice(
    product,
    product.sizes[0].label,
    product.flavours[0].name,
    false,
  )
  const category = getCategory(product.category)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/8">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-cream">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.isBestseller && <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>}
          {product.isNew && <Badge className="bg-gold text-primary">New</Badge>}
          {product.eggless === 'always' && <Badge className="bg-card/90 text-primary">100% Eggless</Badge>}
        </div>
        <span className="sr-only">View {product.name}</span>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">{category?.name}</span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <Star className="size-3.5 fill-gold text-gold" aria-hidden />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span className="hidden sm:inline">({product.reviews})</span>
          </span>
        </div>
        <h3 className="mt-2 font-serif text-xl leading-tight text-primary md:text-2xl">
          <Link href={`/product/${product.slug}`} className="hover:underline hover:decoration-gold hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 hidden text-sm sm:line-clamp-2 leading-relaxed text-muted-foreground sm:block">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
              {product.sizes[0].label}
            </p>
            <p className="text-lg font-semibold text-primary">{formatINR(fromPrice)}</p>
          </div>
          <QuickAddButton product={product} />
        </div>
      </div>
    </article>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider uppercase shadow-sm backdrop-blur',
        className,
      )}
    >
      {children}
    </span>
  )
}
