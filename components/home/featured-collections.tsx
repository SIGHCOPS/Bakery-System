import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { COLLECTIONS, PRODUCTS } from '@/lib/products'
import { SectionHeading } from '@/components/shared/section-heading'
import { cn } from '@/lib/utils'

const LAYOUT = ['md:col-span-2 md:row-span-2', '', '', 'md:col-span-2']

export function FeaturedCollections() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6 md:pt-28" aria-labelledby="collections-heading">
      <SectionHeading
        eyebrow="Curated collections"
        title={<span id="collections-heading">Stories told in sugar & spice</span>}
        description="Edits from our pastry chefs, built around a feeling, a flavour or a moment."
      />
      <div className="mt-10 grid auto-rows-[16rem] gap-4 md:grid-cols-4 md:auto-rows-[15rem] md:gap-5">
        {COLLECTIONS.map((collection, i) => {
          const count = PRODUCTS.filter((p) => p.collections.includes(collection.slug)).length
          return (
            <Link
              key={collection.slug}
              href={`/shop?collection=${collection.slug}`}
              className={cn('group relative overflow-hidden rounded-[2rem] bg-cream', LAYOUT[i])}
            >
              <Image
                src={collection.image || '/placeholder.svg'}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-primary-foreground md:p-8">
                <div>
                  <p className="text-xs tracking-[0.2em] text-gold uppercase">{count} creations</p>
                  <h3 className={cn('mt-2 font-serif leading-none', i === 0 ? 'text-4xl md:text-5xl' : 'text-3xl')}>
                    {collection.name}
                  </h3>
                  <p
                    className={cn(
                      'mt-2 max-w-sm text-sm text-primary-foreground/80',
                      i === 0 ? 'block' : 'hidden lg:block',
                    )}
                  >
                    {collection.description}
                  </p>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-primary transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" aria-hidden />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
