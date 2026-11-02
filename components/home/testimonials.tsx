import Link from 'next/link'
import { Quote, Star } from 'lucide-react'
import { getProduct } from '@/lib/products'

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    area: 'Malviya Nagar',
    product: 'rasmalai-saffron-cake',
    quote:
      'The rasmalai cake was the star of my parents’ 30th anniversary. Not too sweet, beautifully decorated, and delivered exactly on time.',
  },
  {
    name: 'Rohan Mehta',
    area: 'Vaishali Nagar',
    product: 'belgian-chocolate-truffle-cake',
    quote:
      'I’ve tried every bakery in Jaipur for chocolate cake. Gulabi’s truffle is the only one my daughter asks for by name.',
  },
  {
    name: 'Priya Rathore',
    area: 'C-Scheme',
    product: 'pink-city-palace-cake',
    quote:
      'Ordered the Pink City Palace cake for my destination wedding guests. Everyone wanted a photo before cutting it!',
  },
]

export function Testimonials() {
  return (
    <section className="pt-20 md:pt-28" aria-labelledby="testimonials-heading">
      <div className="bg-secondary py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">Kind words</p>
            <h2 id="testimonials-heading" className="mt-3 font-serif text-4xl text-primary md:text-5xl">
              Loved across the Pink City
            </h2>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => {
              const product = getProduct(t.product)
              return (
                <li key={t.name} className="flex flex-col rounded-[2rem] bg-card p-8 transition-shadow hover:shadow-lg hover:shadow-primary/5">
                  <Quote className="size-8 text-blush" aria-hidden />
                  <div className="mt-4 flex" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-gold text-gold" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 font-serif text-xl leading-snug text-primary md:text-2xl">
                    “{t.quote}”
                  </blockquote>
                  <div className="mt-8 flex items-end justify-between gap-4 border-t pt-5">
                    <div>
                      <p className="font-medium text-primary">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.area}, Jaipur</p>
                    </div>
                    {product && (
                      <Link
                        href={`/product/${product.slug}`}
                        className="text-right text-xs text-accent-foreground underline-offset-4 hover:underline"
                      >
                        {product.name}
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-8 text-center text-xs text-muted-foreground">Sample testimonials for presentation purposes.</p>
        </div>
      </div>
    </section>
  )
}
