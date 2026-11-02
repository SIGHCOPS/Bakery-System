import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  description?: string
  action?: { href: string; label: string }
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-primary md:text-5xl">{title}</h2>
        {description && <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary"
        >
          <span className="border-b border-primary/30 pb-0.5 transition-colors group-hover:border-primary">
            {action.label}
          </span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
