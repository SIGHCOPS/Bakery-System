import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { CATEGORIES, COLLECTIONS } from '@/lib/products'
import { Logo } from './logo'
import { NewsletterForm } from './newsletter-form'

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 border-b border-primary-foreground/10 py-14 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-xs tracking-[0.3em] text-gold uppercase">The Gulabi Letter</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
              Seasonal flavours & sweet offers, <em className="text-blush">once a month.</em>
            </h2>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed text-primary-foreground/70">
              Handcrafted cakes and patisserie, baked fresh every morning in the Pink City since 2016.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold tracking-[0.2em] text-gold uppercase">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop?category=${c.slug}`}
                    className="text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold tracking-[0.2em] text-gold uppercase">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COLLECTIONS.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop?collection=${c.slug}`}
                    className="text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#why-us" className="text-primary-foreground/75 hover:text-primary-foreground">
                  Our promise
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-primary-foreground/75 hover:text-primary-foreground">
                  My orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold tracking-[0.2em] text-gold uppercase">Visit & contact</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-primary-foreground/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>12 Bhagwan Das Road, C-Scheme, Jaipur, Rajasthan 302001</span>
              </li>
              <li>
                <a href="tel:+911412345678" className="flex gap-3 hover:text-primary-foreground">
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
                  +91 141 234 5678
                </a>
              </li>
              <li>
                <a href="mailto:hello@gulabipatisserie.in" className="flex gap-3 hover:text-primary-foreground">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                  hello@gulabipatisserie.in
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>Open daily, 9:00 AM – 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-primary-foreground/10 py-6 text-xs text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Gulabi Patisserie. FSSAI Lic. No. 10000000000000 (sample).</p>
          <p className="rounded-full border border-gold/40 px-3 py-1 text-gold">
            Design prototype — all products, prices and business details are sample data.
          </p>
        </div>
      </div>
    </footer>
  )
}
