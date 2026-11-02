import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Star } from 'lucide-react'
import { PRODUCTS, getCategory, getProduct, getRelatedProducts } from '@/lib/products'
import { ProductConfigurator } from '@/components/product/product-configurator'
import { ProductCard } from '@/components/shared/product-card'
import { SectionHeading } from '@/components/shared/section-heading'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: 'Product not found' }
  return { title: product.name, description: product.shortDescription }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const category = getCategory(product.category)
  const related = getRelatedProducts(product)

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <nav aria-label="Breadcrumb" className="py-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li>
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
          </li>
          {category && (
            <>
              <ChevronRight className="size-3" aria-hidden />
              <li>
                <Link href={`/shop?category=${category.slug}`} className="hover:text-primary">
                  {category.name}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="size-3" aria-hidden />
          <li aria-current="page" className="text-primary">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-cream">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute top-5 left-5 flex flex-col items-start gap-2">
              {product.isBestseller && (
                <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
                  Bestseller
                </span>
              )}
              {product.isNew && (
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-medium text-primary">New</span>
              )}
            </div>
          </div>
        </div>

        <div className="pb-4">
          <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">{category?.name}</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-primary md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.round(product.rating) ? 'size-4 fill-gold text-gold' : 'size-4 text-border'}
                />
              ))}
            </div>
            <span className="font-medium text-primary">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.highlights.map((h) => (
              <li key={h} className="rounded-full bg-secondary px-3 py-1 text-xs text-primary">
                {h}
              </li>
            ))}
          </ul>

          <ProductConfigurator product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-20 md:pt-28" aria-labelledby="related-heading">
          <SectionHeading
            eyebrow="You may also love"
            title={<span id="related-heading">Pairs beautifully with</span>}
            action={category ? { href: `/shop?category=${category.slug}`, label: `More ${category.name.toLowerCase()}` } : undefined}
          />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
