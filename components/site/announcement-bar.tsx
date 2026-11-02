import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const MESSAGES = [
  'Free delivery across Jaipur on orders above ₹999',
  'Use FIRSTBITE for flat ₹150 off your first order',
  'Same-day delivery on orders placed before 4 PM',
  'Every cake available eggless on request',
  'Midnight surprise delivery available',
]

export function AnnouncementBar() {
  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-xs md:px-6">
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <p className="sr-only">{MESSAGES.join('. ')}</p>
          <div aria-hidden className="flex w-max animate-marquee gap-10 whitespace-nowrap">
            {[...MESSAGES, ...MESSAGES].map((m, i) => (
              <span key={i} className="inline-flex items-center gap-2 tracking-wide">
                <Sparkles className="size-3 text-gold" />
                {m}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/#offers"
          className="hidden shrink-0 font-medium tracking-wide text-gold underline-offset-4 hover:underline sm:inline"
        >
          View offers
        </Link>
      </div>
    </div>
  )
}
