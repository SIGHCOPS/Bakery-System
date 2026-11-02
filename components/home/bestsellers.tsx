import { PRODUCTS } from '@/lib/products'
import { ProductCard } from '@/components/shared/product-card'
import { SectionHeading } from '@/components/shared/section-heading'

export function Bestsellers() {
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 8)

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6 md:pt-28" aria-labelledby="bestsellers-heading">
      <SectionHeading
        eyebrow="Jaipur’s favourites"
        title={
          <span id="bestsellers-heading">
            Our <em className="text-accent-foreground">bestselling</em> bakes
          </span>
        }
        description="The cakes our customers come back for, again and again."
        action={{ href: '/shop?sort=bestselling', label: 'See all bestsellers' }}
      />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {bestsellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
