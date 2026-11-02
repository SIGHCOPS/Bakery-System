import Image from 'next/image'
import { Clock, Egg, Leaf, Truck } from 'lucide-react'

const REASONS = [
  {
    icon: Leaf,
    title: 'Real ingredients only',
    body: 'Belgian couverture, Kashmiri saffron, seasonal fruit. No premixes, no artificial flavours.',
  },
  {
    icon: Clock,
    title: 'Baked the same day',
    body: 'Every cake is baked and finished on the morning of delivery — never frozen.',
  },
  {
    icon: Egg,
    title: 'Eggless, any cake',
    body: 'A separate eggless kitchen line so every recipe tastes just as indulgent.',
  },
  {
    icon: Truck,
    title: 'Careful city delivery',
    body: 'Temperature-controlled vans across Jaipur, with midnight and same-day slots.',
  },
]

export function WhyChooseUs() {
  return (
    <section id="why-us" className="scroll-mt-28 pt-20 md:pt-28" aria-labelledby="why-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2.5rem] border border-border bg-cream p-2 sm:aspect-square lg:aspect-[4/5]">
            <div className="relative size-full overflow-hidden rounded-t-full rounded-b-[2rem]">
              <Image
                src="/images/kitchen.png"
                alt="A Gulabi pastry chef piping cream rosettes onto a cake in our Jaipur kitchen"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 left-6 rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/10 md:left-auto md:-right-6">
            <p className="font-serif text-5xl leading-none text-primary">10</p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground">years baking in Jaipur</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">Our promise</p>
          <h2 id="why-heading" className="mt-3 font-serif text-4xl leading-[1.05] text-primary md:text-5xl">
            Made by hand, <em className="text-accent-foreground">with heart,</em> in the Pink City.
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
            Gulabi began as a tiny home kitchen in C-Scheme. Today our team of 18 pastry chefs still
            follows the same rule: if we wouldn’t serve it at our own family table, it doesn’t leave the
            kitchen.
          </p>
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {REASONS.map((reason) => (
              <li key={reason.title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <reason.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold text-primary">{reason.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{reason.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
