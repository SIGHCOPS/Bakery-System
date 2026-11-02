import { cva, type VariantProps } from 'class-variance-authority'

export const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20',
        outline:
          'border border-primary/25 bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground',
        soft: 'bg-accent text-accent-foreground hover:bg-blush',
        light: 'bg-card text-primary hover:bg-cream shadow-sm',
        ghost: 'text-primary hover:bg-secondary',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonStyleProps = VariantProps<typeof buttonStyles>

export const inputStyles =
  'w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors outline-none focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/15'

export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
