import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { buttonStyles } from '@/lib/styles'

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-cream md:rounded-[2.5rem]">
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]">
            <Image
              src="/images/hero.png"
              alt="Two-tier chocolate and rose buttercream cake topped with fresh garden roses and gold leaf"
              fill
              priority
              sizes="(min-width: 1280px) 1240px, 100vw"
              className="object-cover object-[70%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent sm:bg-gradient-to-r sm:from-background/95 sm:via-background/70 sm:to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-end sm:items-center">
            <div className="w-full max-w-xl animate-fade-up p-6 sm:p-10 lg:p-16">
              <p className="inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.2em] text-primary uppercase backdrop-blur">
                <span className="size-1.5 rounded-full bg-gold" aria-hidden />
                Baked fresh in Jaipur
              </p>
              <h1 className="mt-5 font-serif text-5xl leading-[0.95] text-primary-foreground sm:text-primary md:text-6xl lg:text-7xl">
                Cakes worth <em className="text-blush sm:text-accent-foreground">celebrating</em> for.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-primary-foreground/90 sm:text-muted-foreground md:text-lg">
                Handcrafted each morning with Belgian chocolate, Kashmiri saffron and real fruit — delivered
                to your door across the Pink City.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/shop" className={buttonStyles({ size: 'lg' })}>
                  Shop all cakes <ArrowRight />
                </Link>
                <Link
                  href="/shop?category=designer"
                  className={buttonStyles({ variant: 'light', size: 'lg', className: 'sm:border sm:border-primary/15' })}
                >
                  Designer collection
                </Link>
              </div>
              <div className="mt-8 hidden items-center gap-6 text-sm sm:flex">
                <div className="flex items-center gap-2">
                  <div className="flex" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    <strong className="font-semibold text-primary">4.9</strong> from 12,000+ orders
                  </span>
                </div>
                <span className="h-4 w-px bg-border" aria-hidden />
                <span className="text-muted-foreground">Same-day delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
