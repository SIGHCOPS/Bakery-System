'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function CopyCodeButton({ code, variant = 'light' }: { code: string; variant?: 'light' | 'dark' }) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success(`Code ${code} copied`, { description: 'Paste it in your cart to apply the offer.' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast(`Your code: ${code}`, { description: 'Enter it in your cart to apply the offer.' })
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        'inline-flex h-11 items-center gap-3 rounded-full border border-dashed px-5 font-mono text-sm font-semibold tracking-widest transition-colors',
        variant === 'light'
          ? 'border-gold text-gold hover:bg-gold hover:text-primary'
          : 'border-accent-foreground/40 text-accent-foreground hover:bg-accent-foreground hover:text-accent',
      )}
    >
      {code}
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      <span className="sr-only">{copied ? 'Copied' : 'Copy code'}</span>
    </button>
  )
}
