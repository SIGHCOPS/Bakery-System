'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setEmail('')
    toast.success('You’re on the list!', {
      description: 'Demo only — no email will actually be sent.',
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="md:justify-self-end md:w-full md:max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/5 p-1.5 focus-within:border-gold">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-error' : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/50"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-medium text-primary transition-transform hover:scale-[1.02]"
        >
          Subscribe <ArrowRight className="size-4" />
        </button>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 pl-4 text-xs text-blush">
          {error}
        </p>
      )}
    </form>
  )
}
