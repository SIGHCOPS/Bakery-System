import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { getProduct } from '@/lib/products'

const POSTS = [
  { slug: 'gold-drip-macaron-cake', likes: '2.4k' },
  { slug: 'rose-pistachio-celebration-cake', likes: '1.8k' },
  { slug: 'assorted-pastry-box', likes: '3.1k' },
  { slug: 'pink-city-palace-cake', likes: '5.6k' },
  { slug: 'fudge-walnut-brownies', likes: '1.2k' },
  { slug: 'two-tier-floral-cake', likes: '4.3k' },
]

export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6 md:pt-28" aria-labelledby="instagram-heading">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">@gulabipatisserie</p>
        <h2 id="instagram-heading" className="mt-3 font-serif text-4xl text-primary md:text-5xl">
          Fresh from our feed
        </h2>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Tap any bake to order it. Tag <span className="font-medium text-primary">#GulabiMoments</span> to be featured.
        </p>
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {POSTS.map((post) => {
          const product = getProduct(post.slug)
          if (!product) return null
          return (
            <li key={post.slug}>
              <Link
                href={`/product/${product.slug}`}
                className="group relative block aspect-square overflow-hidden rounded-2xl bg-cream"
              >
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-primary/60 text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                    <Heart className="size-4 fill-current" aria-hidden /> {post.likes}
                  </span>
                  <span className="text-xs tracking-wide">Shop this bake</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
