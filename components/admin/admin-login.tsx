'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { ArrowLeft, CakeSlice, LockKeyhole, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { buttonClass, inputClass, labelClass } from './admin-primitives'

const DEMO_EMAIL = 'owner@demo.gulabi.test'
const DEMO_PASSWORD = 'gulabi-demo'

export function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Those demo credentials do not match. Use the details shown below.')
      toast.error('Demo sign-in failed.')
      return
    }
    sessionStorage.setItem('gulabi-admin-demo-auth', '1')
    toast.success('Demo session started. Changes are temporary.')
    router.replace('/admin')
  }

  return (
    <main id="main" className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.85fr)]">
      <section className="relative hidden overflow-hidden bg-primary px-12 py-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-24 -bottom-36 size-[30rem] rounded-full border border-primary-foreground/10" />
        <div className="absolute -right-4 -bottom-16 size-[22rem] rounded-full border border-primary-foreground/10" />
        <Link href="/" className="relative inline-flex w-fit items-center gap-3 text-primary-foreground">
          <span className="grid size-11 place-items-center rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10"><CakeSlice aria-hidden="true" className="size-5" /></span>
          <span className="font-serif text-2xl">Gulabi Patisserie</span>
        </Link>
        <div className="relative max-w-xl pb-10">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary-foreground/65 uppercase">A little more behind the counter</p>
          <h1 className="mt-5 text-5xl leading-[1.08] xl:text-6xl">Made with care.<br /><span className="italic text-[#dfc18e]">Managed with ease.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/70">A calmer way to look after today&apos;s orders, seasonal favourites and the little details that make every celebration feel special.</p>
          <div className="mt-10 flex items-center gap-3 text-xs tracking-wide text-primary-foreground/70">
            <span className="size-2 rounded-full bg-[#d7b36d]" /> Demonstration environment · sample records only
          </div>
        </div>
        <p className="relative text-xs text-primary-foreground/50">Jaipur, Rajasthan · Handcrafted with a little extra love</p>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground lg:hidden">
            <CakeSlice aria-hidden="true" className="size-4" /> Gulabi Patisserie
          </Link>
          <div className="mb-8">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-primary/70 uppercase">Owner&apos;s desk</p>
            <h2 className="text-4xl text-foreground">Welcome back</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to the bakery dashboard demonstration.</p>
          </div>

          <div className="mb-6 flex gap-3 rounded-2xl border border-[#dcc893]/70 bg-[#f4ecd7]/50 p-4 text-[#6c5428]">
            <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p className="text-xs leading-5"><strong>Demo access only.</strong> This client-side sign-in is not real authentication or security. Demo edits reset if you refresh or close this tab.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelClass} htmlFor="admin-email">Email address</label>
              <input id="admin-email" className={inputClass} type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="admin-password">Password</label>
              <div className="relative">
                <LockKeyhole aria-hidden="true" className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
                <input id="admin-password" className={`${inputClass} pl-10`} type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <button className={`${buttonClass} mt-1 w-full`} type="submit">Enter demo dashboard</button>
          </form>

          <div className="mt-6 rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Demo credentials</p>
            <div className="mt-3 grid gap-1 text-sm text-foreground">
              <p><span className="text-muted-foreground">Email</span><span className="ml-3 font-medium">{DEMO_EMAIL}</span></p>
              <p><span className="text-muted-foreground">Password</span><span className="ml-3 font-medium">{DEMO_PASSWORD}</span></p>
            </div>
          </div>
          <Link href="/" className="mt-7 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-primary">
            <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to the customer website
          </Link>
        </div>
      </section>
    </main>
  )
}
