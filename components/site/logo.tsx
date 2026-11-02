import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <Link
      href="/"
      aria-label="Gulabi Patisserie home"
      className={cn('group inline-flex flex-col items-start leading-none', className)}
    >
      <span
        className={cn(
          'font-serif text-[1.75rem] font-semibold italic tracking-tight transition-colors md:text-3xl',
          tone === 'dark' ? 'text-primary' : 'text-primary-foreground',
        )}
      >
        Gulabi
      </span>
      <span
        className={cn(
          'mt-0.5 text-[0.6rem] font-medium tracking-[0.32em] uppercase',
          tone === 'dark' ? 'text-gold' : 'text-gold',
        )}
      >
        Patisserie · Jaipur
      </span>
    </Link>
  )
}
