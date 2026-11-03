'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import {
  Bell, CakeSlice, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard,
  LogOut, Menu, Package, Plus, Settings, Tags, UserRound, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAdmin } from './admin-provider'
import { AdminOverview } from './admin-overview'
import { AdminOrders } from './admin-orders'
import { AdminProducts } from './admin-products'
import { AdminCategories } from './admin-categories'
import { AdminRequests } from './admin-requests'
import { AdminSettings } from './admin-settings'
import { buttonClass, outlineButtonClass } from './admin-primitives'

const navigation = [
  { key: 'overview', label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { key: 'orders', label: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { key: 'products', label: 'Products', href: '/admin/products', icon: Package },
  { key: 'categories', label: 'Categories', href: '/admin/categories', icon: Tags },
  { key: 'requests', label: 'Customer requests', href: '/admin/requests', icon: Bell },
  { key: 'settings', label: 'Settings', href: '/admin/settings', icon: Settings },
]

const pageCopy: Record<string, { title: string; description: string }> = {
  overview: { title: 'Good morning, baker', description: 'A gentle overview of what is happening across your bakery today.' },
  orders: { title: 'Orders', description: 'Keep every celebration on track, from first confirmation to hand-off.' },
  products: { title: 'Products', description: 'Shape the catalogue with the treats your customers love.' },
  categories: { title: 'Categories', description: 'Keep your menu thoughtful, easy to browse and in season.' },
  requests: { title: 'Customer requests', description: 'Give special enquiries the attention and follow-up they deserve.' },
  settings: { title: 'Bakery settings', description: 'A few practical details that will eventually guide your storefront.' },
}

function SectionContent({ section }: { section: string }) {
  switch (section) {
    case 'overview': return <AdminOverview />
    case 'orders': return <AdminOrders />
    case 'products': return <AdminProducts />
    case 'categories': return <AdminCategories />
    case 'requests': return <AdminRequests />
    case 'settings': return <AdminSettings />
    default: return <div className="rounded-2xl border border-border bg-card p-8"><h2 className="text-2xl">Page not found</h2><p className="mt-2 text-sm text-muted-foreground">Choose a section from the navigation.</p></div>
  }
}

export function AdminShell({ section }: { section: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { orders, data } = useAdmin()
  const [authenticated, setAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pendingCount = orders.filter((order) => order.status === 'Pending').length + data.requests.filter((request) => request.status === 'New').length
  const page = pageCopy[section] ?? pageCopy.overview

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('gulabi-admin-demo-auth') === '1'
    setAuthenticated(isAuthenticated)
    setAuthChecked(true)
    if (!isAuthenticated) router.replace('/admin/login')
  }, [router])

  useEffect(() => setMobileOpen(false), [pathname])

  if (!authChecked || !authenticated) {
    return <main id="main" className="grid min-h-dvh place-items-center bg-background px-5" aria-busy="true"><div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground"><span className="size-2 animate-pulse rounded-full bg-gold" /> Checking demo session…</div></main>
  }

  function logout() {
    sessionStorage.removeItem('gulabi-admin-demo-auth')
    toast.success('Demo session ended.')
    router.replace('/admin/login')
  }

  const sidebar = (
    <aside className={`flex h-full flex-col border-r border-border bg-[#fbf8f2] transition-[width] duration-200 ${collapsed ? 'w-[76px]' : 'w-[252px]'} ${mobileOpen ? 'fixed inset-y-0 left-0 z-50 w-[280px] shadow-2xl lg:relative lg:shadow-none' : 'hidden lg:flex'}`}>
      <div className={`flex h-[76px] items-center border-b border-border/80 px-4 ${collapsed && !mobileOpen ? 'justify-center' : 'justify-between'}`}>
        <Link href="/admin" className="flex min-w-0 items-center gap-3" aria-label="Gulabi Patisserie admin overview">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><CakeSlice aria-hidden="true" className="size-5" /></span>
          {(!collapsed || mobileOpen) && <span className="min-w-0"><span className="block truncate font-serif text-lg leading-tight">Gulabi Patisserie</span><span className="mt-0.5 block text-[9px] font-semibold tracking-[0.19em] text-muted-foreground uppercase">Owner&apos;s desk</span></span>}
        </Link>
        {mobileOpen && <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Close navigation"><X aria-hidden="true" className="size-4" /></button>}
      </div>

      <div className="px-3 pt-6">
        {(!collapsed || mobileOpen) && <p className="mb-3 px-3 text-[9px] font-semibold tracking-[0.18em] text-muted-foreground/80 uppercase">Workspace</p>}
        <nav aria-label="Admin navigation" className="flex flex-col gap-1">
          {navigation.map(({ key, label, href, icon: Icon }) => {
            const active = key === 'overview' ? section === 'overview' : section === key
            const count = key === 'requests' ? data.requests.filter((request) => request.status === 'New').length : key === 'orders' ? orders.filter((order) => order.status === 'Pending').length : 0
            return (
              <Link key={key} href={href} aria-current={active ? 'page' : undefined} title={collapsed && !mobileOpen ? label : undefined} className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'} ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}`}>
                <Icon aria-hidden="true" className="size-[17px] shrink-0" />
                {(!collapsed || mobileOpen) && <><span className="min-w-0 flex-1 truncate">{label}</span>{count > 0 && <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] ${active ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>{count}</span>}</>}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto px-3 pb-3">
        <div className={`mb-3 flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 ${collapsed && !mobileOpen ? 'justify-center px-1' : ''}`}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blush/50 text-sm font-semibold text-primary">GP</span>
          {(!collapsed || mobileOpen) && <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">Bakery owner</span><span className="mt-0.5 block text-[10px] text-muted-foreground">Demo account</span></span>}
          {(!collapsed || mobileOpen) && <UserRound aria-hidden="true" className="size-4 text-muted-foreground" />}
        </div>
        <button type="button" onClick={logout} title={collapsed && !mobileOpen ? 'Log out' : undefined} className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}`}>
          <LogOut aria-hidden="true" className="size-4 shrink-0" /> {(!collapsed || mobileOpen) && 'Log out'}
        </button>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="mt-1 hidden min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs text-muted-foreground transition hover:bg-muted lg:flex" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight aria-hidden="true" className="size-4" /> : <><ChevronLeft aria-hidden="true" className="size-4" /> Collapse sidebar</>}
        </button>
      </div>
    </aside>
  )

  return (
    <main id="main" className="min-h-dvh bg-[#f8f6f1] text-foreground">
      {mobileOpen && <button type="button" aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-foreground/35 backdrop-blur-[2px] lg:hidden" />}
      <div className="min-h-dvh lg:grid" style={{ gridTemplateColumns: collapsed ? '76px minmax(0,1fr)' : '252px minmax(0,1fr)' }}>
        {sidebar}
        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-border/80 bg-background/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground lg:hidden"><Menu aria-hidden="true" className="size-4" /></button>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-muted-foreground">{new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</p>
                <p className="mt-0.5 truncate font-serif text-lg leading-tight sm:text-xl">{page.title}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="hidden items-center gap-1.5 rounded-full border border-[#e4d6b6] bg-[#f8f1e2] px-3 py-1.5 text-[10px] font-medium text-[#725d35] sm:inline-flex"><span className="size-1.5 rounded-full bg-[#b9944f]" /> Demo mode</span>
              <Link href="/admin/requests" aria-label={`${pendingCount} new notifications`} className="relative grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground">
                <Bell aria-hidden="true" className="size-4" />
                {pendingCount > 0 && <span className="absolute -top-1 -right-1 grid size-[17px] place-items-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">{pendingCount > 9 ? '9+' : pendingCount}</span>}
              </Link>
              <Link href="/admin/products" className={`${buttonClass} min-h-9 px-3 text-xs`}><Plus aria-hidden="true" className="size-3.5" /><span className="hidden sm:inline">Add product</span><span className="sm:hidden">Add</span></Link>
            </div>
          </header>
          <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-9">
            <div className="mb-6 rounded-2xl border border-[#e3d5b8] bg-[#f6efdf]/80 px-4 py-3 text-[11px] leading-5 text-[#685632] sm:flex sm:items-center sm:justify-between sm:gap-4">
              <span><strong>Demonstration data.</strong> Sample records and edits are temporary; refreshing this page resets them. Nothing is saved to a database.</span>
              <span className="mt-1 block shrink-0 text-[#88734a] sm:mt-0">Customer storefront remains separate</span>
            </div>
            <SectionContent section={section} />
            <footer className="mt-10 border-t border-border/80 pt-5 text-[10px] leading-5 text-muted-foreground">
              Gulabi Patisserie · Admin demonstration <span className="mx-1.5">·</span> Dashboard edits reset on refresh and do not change the customer catalogue.
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}
