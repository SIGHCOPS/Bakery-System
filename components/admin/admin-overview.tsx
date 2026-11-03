'use client'

import Link from 'next/link'
import { ArrowDownRight, ArrowRight, ArrowUpRight, BellRing, CakeSlice, CheckCircle2, Clock3, ClipboardList, Coins, PackageCheck, Plus, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { useAdmin } from './admin-provider'
import { EmptyState, formatDate, formatINR, PageHeading, StatusPill } from './admin-primitives'

const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export function AdminOverview() {
  const { orders, data } = useAdmin()
  const now = new Date()
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const day = new Date()
    day.setDate(now.getDate() - (6 - index))
    const key = dayKey(day)
    const count = orders.filter((order) => dayKey(new Date(order.orderDate)) === key).length
    return { label: new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(day), count, date: key }
  }), [orders, now.getDate(), now.getMonth(), now.getFullYear()])
  const peak = Math.max(1, ...days.map((day) => day.count))

  const pending = orders.filter((order) => order.status === 'Pending').length
  const preparing = orders.filter((order) => order.status === 'Preparing').length
  const completed = orders.filter((order) => order.status === 'Completed').length
  const paidRevenue = orders.filter((order) => order.paymentStatus === 'Paid' && order.status !== 'Cancelled').reduce((sum, order) => sum + order.amount, 0)
  const newRequests = data.requests.filter((request) => request.status === 'New').length
  const attention = orders.filter((order) => {
    if (order.status === 'Pending') return true
    if (['Completed', 'Cancelled'].includes(order.status)) return false
    const delivery = new Date(`${order.deliveryDate}T23:59:59`)
    const daysAway = (delivery.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000
    return daysAway >= 0 && daysAway <= 2
  }).slice(0, 4)

  const summary = [
    { label: 'Total orders', value: orders.length, caption: 'Across this demo workspace', icon: ClipboardList, tone: 'sand' },
    { label: 'Pending orders', value: pending, caption: 'Waiting for confirmation', icon: Clock3, tone: 'rose' },
    { label: 'In preparation', value: preparing, caption: 'Currently in the kitchen', icon: CakeSlice, tone: 'gold' },
    { label: 'Completed', value: completed, caption: 'Ready for a little celebration', icon: CheckCircle2, tone: 'sage' },
    { label: 'Total revenue', value: formatINR(paidRevenue), caption: 'Paid orders only · sample data', icon: Coins, tone: 'gold' },
    { label: 'New requests', value: newRequests, caption: 'Enquiries to follow up', icon: BellRing, tone: 'rose' },
  ]

  return (
    <div>
      <PageHeading eyebrow="Your bakery at a glance" title="A lovely day to bake" description="The essentials for the day, gathered in one quiet place." action={<Link href="/admin/orders" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition hover:bg-muted"><ClipboardList aria-hidden="true" className="size-4" /> Review today&apos;s orders</Link>} />

      <section aria-label="Bakery summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {summary.map(({ label, value, caption, icon: Icon, tone }) => (
          <article key={label} className="group rounded-2xl border border-border/80 bg-card p-4 shadow-[0_2px_10px_rgba(77,55,30,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(77,55,30,0.06)] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
              <span className={`grid size-9 place-items-center rounded-xl ${tone === 'rose' ? 'bg-blush/35 text-primary' : tone === 'sage' ? 'bg-[#eaf0e8] text-[#526749]' : tone === 'gold' ? 'bg-[#f5ecd8] text-[#826a37]' : 'bg-secondary text-primary'}`}><Icon aria-hidden="true" className="size-4" /></span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{caption}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6" aria-labelledby="recent-orders-title">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div><h2 id="recent-orders-title" className="text-2xl">Recent orders</h2><p className="mt-1 text-xs text-muted-foreground">A quick look at the latest bakery notes.</p></div>
            <Link href="/admin/orders" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-secondary">All orders <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
          </div>
          {orders.length === 0 ? <EmptyState title="No orders just yet" description="New customer orders will appear here when submitted through the storefront demo." /> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead><tr className="border-b border-border text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase"><th className="pb-3 pr-4">Order</th><th className="pb-3 pr-4">Customer</th><th className="pb-3 pr-4">Items</th><th className="pb-3 pr-4">Order date</th><th className="pb-3 pr-4">Delivery</th><th className="pb-3 pr-4">Amount</th><th className="pb-3">Status</th></tr></thead>
                <tbody>{[...orders].sort((a, b) => b.orderDate.localeCompare(a.orderDate)).slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-border/70 last:border-0">
                    <td className="py-3.5 pr-4"><Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline">{order.id}</Link><p className="mt-1 text-[10px] text-muted-foreground">{order.items.length} item{order.items.length === 1 ? '' : 's'}</p></td>
                    <td className="py-3.5 pr-4"><p className="max-w-40 truncate text-xs font-medium">{order.customer.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{order.customer.phone}</p></td>
                    <td className="py-3.5 pr-4"><p className="max-w-40 truncate text-xs">{order.items[0]?.name ?? 'Custom order'}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}</p><p className="mt-1 text-[10px] text-muted-foreground">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p></td>
                    <td className="py-3.5 pr-4 text-xs">{formatDate(order.orderDate, { day: 'numeric', month: 'short' })}</td>
                    <td className="py-3.5 pr-4 text-xs">{formatDate(order.deliveryDate, { day: 'numeric', month: 'short' })}<p className="mt-1 text-[10px] text-muted-foreground">{order.timeSlot}</p></td>
                    <td className="py-3.5 pr-4 text-xs font-semibold">{formatINR(order.amount)}</td>
                    <td className="py-3.5"><StatusPill status={order.status} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6" aria-labelledby="activity-title">
          <div className="mb-5"><h2 id="activity-title" className="text-2xl">Order activity</h2><p className="mt-1 text-xs text-muted-foreground">Orders received in the last seven days.</p></div>
          <div className="flex h-44 items-end gap-2 border-b border-border px-1 pb-1" role="img" aria-label="Bar chart of demo orders over the last seven days">
            {days.map((day) => (
              <div key={day.date} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] tabular-nums text-muted-foreground">{day.count}</span>
                <div className="flex h-[72%] w-full items-end justify-center"><div className="w-full max-w-9 rounded-t-lg bg-[#d8c29a] transition-all duration-500 hover:bg-primary" style={{ height: `${Math.max(6, day.count / peak * 100)}%` }} /></div>
                <span className="text-[10px] text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground"><span className="size-2 rounded-sm bg-[#d8c29a]" /> Sample order volume <span className="ml-auto">7 days</span></div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6" aria-labelledby="attention-title">
          <div className="mb-5 flex items-start justify-between gap-3"><div><h2 id="attention-title" className="text-2xl">A little attention</h2><p className="mt-1 text-xs text-muted-foreground">Pending confirmations and near-term deliveries.</p></div><span className="grid size-9 place-items-center rounded-xl bg-[#f5ecd8] text-[#826a37]"><Sparkles aria-hidden="true" className="size-4" /></span></div>
          {attention.length === 0 ? <div className="rounded-xl bg-[#edf2eb] px-4 py-5 text-sm text-[#54674c]">Everything is on track. No orders need a follow-up right now.</div> : <ul className="flex flex-col divide-y divide-border/80">{attention.map((order) => <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><PackageCheck aria-hidden="true" className="size-4" /></span><div className="min-w-0"><p className="truncate text-xs font-semibold">{order.id} <span className="font-normal text-muted-foreground">· {order.customer.name}</span></p><p className="mt-1 text-[10px] text-muted-foreground">Delivery {formatDate(order.deliveryDate, { weekday: 'short', day: 'numeric', month: 'short' })}</p></div></div><StatusPill status={order.status} /></li>)}</ul>}
        </section>

        <section className="rounded-2xl border border-border/80 bg-[#f3eee3] p-5 sm:p-6" aria-labelledby="quick-actions-title">
          <div className="mb-4 flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-card text-primary"><Sparkles aria-hidden="true" className="size-4" /></span><h2 id="quick-actions-title" className="text-2xl">Quick actions</h2></div>
          <div className="grid gap-2">
            <Link href="/admin/products" className="group flex min-h-12 items-center justify-between rounded-xl border border-border/70 bg-card px-4 text-xs font-medium transition hover:border-primary/25 hover:bg-background"><span className="flex items-center gap-2"><Plus aria-hidden="true" className="size-4 text-primary" /> Add a product</span><ArrowUpRight aria-hidden="true" className="size-3.5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            <Link href="/admin/orders?status=Pending" className="group flex min-h-12 items-center justify-between rounded-xl border border-border/70 bg-card px-4 text-xs font-medium transition hover:border-primary/25 hover:bg-background"><span className="flex items-center gap-2"><ArrowDownRight aria-hidden="true" className="size-4 text-primary" /> View pending orders <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">{pending}</span></span><ArrowUpRight aria-hidden="true" className="size-3.5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            <Link href="/admin/categories" className="group flex min-h-12 items-center justify-between rounded-xl border border-border/70 bg-card px-4 text-xs font-medium transition hover:border-primary/25 hover:bg-background"><span className="flex items-center gap-2"><CakeSlice aria-hidden="true" className="size-4 text-primary" /> Manage categories</span><ArrowUpRight aria-hidden="true" className="size-3.5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            <Link href="/admin/requests" className="group flex min-h-12 items-center justify-between rounded-xl border border-border/70 bg-card px-4 text-xs font-medium transition hover:border-primary/25 hover:bg-background"><span className="flex items-center gap-2"><BellRing aria-hidden="true" className="size-4 text-primary" /> Customer requests <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">{newRequests}</span></span><ArrowUpRight aria-hidden="true" className="size-3.5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
        </section>
      </div>
    </div>
  )
}
