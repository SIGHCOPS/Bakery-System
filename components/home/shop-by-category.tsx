import Image from 'next/image'
import Link from 'next/link'
import { CATEGORIES, PRODUCTS } from '@/lib/products'
import { SectionHeading } from '@/components/shared/section-heading'

export function ShopByCategory() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6 md:pt-28" aria-labelledby="categories-heading">
      <SectionHeading
        eyebrow="Shop by occasion"
        title={<span id="categories-heading">Something for every celebration</span>}
        action={{ href: '/shop', label: 'Browse the full menu' }}
      />
      <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-7">
        {CATEGORIES.map((category) => {
          const count = PRODUCTS.filter((p) => p.category === category.slug).length
          return (
            <li key={category.slug} className="w-36 shrink-0 snap-start md:w-auto">
              <Link href={`/shop?category=${category.slug}`} className="group block text-center">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl border border-border bg-cream p-1.5 transition-colors group-hover:border-gold">
                  <div className="relative size-full overflow-hidden rounded-t-full rounded-b-[1.25rem]">
                    <Image
                      src={category.image || '/placeholder.svg'}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 160px, (min-width: 768px) 22vw, 144px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
                <h3 className="mt-4 font-serif text-xl leading-tight text-primary">{category.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{count} creations</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
