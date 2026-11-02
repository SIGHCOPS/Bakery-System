import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Moon } from 'lucide-react'
import { buttonStyles } from '@/lib/styles'
import { CopyCodeButton } from './copy-code-button'

export function SpecialOffers() {
  return (
    <section id="offers" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 md:px-6 md:pt-28" aria-labelledby="offers-heading">
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground md:p-12 lg:col-span-3">
          <div className="relative z-10 max-w-sm">
            <p className="text-xs tracking-[0.3em] text-gold uppercase">Special offer</p>
            <h2 id="offers-heading" className="mt-4 font-serif text-5xl leading-none md:text-6xl">
              Flat <span className="text-gold">₹150</span> off your first bite
            </h2>
            <p className="mt-4 text-primary-foreground/75">
              New to Gulabi? Enjoy ₹150 off any order above ₹799. Apply the code in your cart.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopyCodeButton code="FIRSTBITE" />
              <Link href="/shop" className={buttonStyles({ variant: 'light' })}>
                Shop now <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 -bottom-16 hidden size-80 overflow-hidden rounded-full border-8 border-primary-foreground/10 sm:block md:size-96">
            <Image
              src="/images/products/gold-drip-macaron-cake.png"
              alt=""
              fill
              sizes="384px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
          <div className="flex flex-col justify-between rounded-[2rem] bg-accent p-8">
            <div>
              <p className="text-xs tracking-[0.3em] text-accent-foreground/70 uppercase">Celebration savings</p>
              <h3 className="mt-3 font-serif text-4xl leading-none text-accent-foreground">10% off ₹1,499+</h3>
              <p className="mt-3 text-sm text-accent-foreground/80">
                Planning a party? Save up to ₹400 on larger orders.
              </p>
            </div>
            <div className="mt-6">
              <CopyCodeButton code="SWEET10" variant="dark" />
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[2rem] border border-gold/40 bg-card p-8">
            <div>
              <Moon className="size-6 text-gold" aria-hidden />
              <h3 className="mt-4 font-serif text-4xl leading-none text-primary">Midnight surprises</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Choose the 11:30 PM – 12:00 AM slot at checkout to surprise someone right on time.
              </p>
            </div>
            <Link
              href="/shop?collection=celebrate-love"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              Shop anniversary picks
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
