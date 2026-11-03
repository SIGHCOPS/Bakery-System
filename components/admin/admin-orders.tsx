'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, ClipboardList, Clock3, PackageCheck, Search, X } from 'lucide-react'
import type { AdminOrder, OrderStatus } from '@/lib/admin/types'
import { ORDER_STATUSES } from '@/lib/admin/types'
import { useAdmin } from './admin-provider'
import { AdminModal, EmptyState, formatDate, formatINR, inputClass, labelClass, outlineButtonClass, PageHeading, selectClass, StatusPill } from './admin-primitives'

const transitions: Record<OrderStatus, OrderStatus[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Preparing', 'Cancelled'],
  Preparing: ['Ready for Pickup', 'Out for Delivery', 'Cancelled'],
  'Ready for Pickup': ['Completed', 'Cancelled'],
  'Out for Delivery': ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
}

function OrderDetails({ order, onClose, onStatus }: { order: AdminOrder; onClose: () => void; onStatus: (id: string, status: OrderStatus) => Promise<void> }) {
  const allowed = transitions[order.status]
  const changeStatus = async (status: OrderStatus) => {
    const prompt = status === 'Cancelled'
      ? `Cancel ${order.id}? This marks the demo order as cancelled. Payment status will remain ${order.paymentStatus}.`
      : `Mark ${order.id} as ${status.toLowerCase()}? Payment status will remain ${order.paymentStatus}.`
    if (!window.confirm(prompt)) return
    await onStatus(order.id, status)
    if (status === 'Cancelled' || status === 'Completed') onClose()
  }

  return (
    <AdminModal title={`Order ${order.id}`} description={`Received ${formatDate(order.orderDate, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}`} onClose={onClose} wide>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-xl">Customer</h3><a className="text-xs font-medium text-primary hover:underline" href={`tel:${order.customer.phone.replace(/[^+\d]/g, '')}`}>Call customer</a></div>
            <p className="text-sm font-semibold">{order.customer.name}</p><p className="mt-1 text-xs text-muted-foreground">{order.customer.phone}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{order.customer.address}<br />Pincode {order.customer.pincode}</p>
          </section>
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 text-xl">Items in this order</h3>
            <div className="flex flex-col divide-y divide-border">{order.items.map((item, index) => <div key={`${item.productId}-${index}`} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"><div><p className="text-xs font-semibold">{item.name} <span className="font-normal text-muted-foreground">× {item.quantity}</span></p><p className="mt-1 text-[10px] leading-5 text-muted-foreground">{item.size} · {item.flavour} · {item.eggless ? 'Eggless' : 'Regular'}{item.customisation ? ` · ${item.customisation}` : ''}</p></div><p className="shrink-0 text-xs font-medium">{formatINR(item.unitPrice * item.quantity)}</p></div>)}</div>
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 text-xs"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div><div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{order.deliveryCharge ? formatINR(order.deliveryCharge) : 'Complimentary'}</span></div>{order.discount > 0 && <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>−{formatINR(order.discount)}</span></div>}{order.slotFee > 0 && <div className="flex justify-between text-muted-foreground"><span>Time slot fee</span><span>{formatINR(order.slotFee)}</span></div>}<div className="flex justify-between pt-1 text-sm font-semibold"><span>Total</span><span>{formatINR(order.amount)}</span></div></div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 text-xl">Delivery details</h3>
            <div className="grid gap-3 sm:grid-cols-2"><div><p className={labelClass}>Delivery date</p><p className="text-xs">{formatDate(order.deliveryDate, { day: 'numeric', month: 'long', year: 'numeric' })}</p></div><div><p className={labelClass}>Time slot</p><p className="text-xs">{order.timeSlot}</p></div><div><p className={labelClass}>Method</p><p className="text-xs">{order.deliveryMethod}</p></div><div><p className={labelClass}>Special instructions</p><p className="text-xs text-muted-foreground">{order.instructions || 'No special instructions.'}</p></div></div>
          </section>
        </div>

        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-4 text-xl">Order & payment</h3>
            <div className="flex flex-col gap-3 text-xs"><div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Order status</span><StatusPill status={order.status} /></div><div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Payment status</span><StatusPill status={order.paymentStatus} /></div><div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Payment method</span><span className="font-medium">{order.paymentMethod}</span></div><div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Transaction ref.</span><span className="font-mono text-[10px]">{order.transactionReference || 'Not available'}</span></div></div>
            {order.originatingRequestId && <p className="mb-3 rounded-xl bg-[#f6efdf]/70 p-3 text-[10px] leading-5 text-[#685632]">Draft created from customer request <strong>{order.originatingRequestId}</strong>.</p>}
            <p className="mt-4 rounded-xl bg-secondary/70 p-3 text-[10px] leading-5 text-muted-foreground">Payment and order progress are separate. Updating this order will not mark its payment as paid.</p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-4 text-xl">Update order</h3>
            {allowed.length ? <div className="grid gap-2">{allowed.map((status) => <button key={status} type="button" onClick={() => changeStatus(status)} className={`flex min-h-10 items-center justify-between rounded-xl border px-3 text-left text-xs font-medium transition ${status === 'Cancelled' ? 'border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10' : 'border-border bg-background text-foreground hover:border-primary/30 hover:bg-secondary/50'}`}><span>{status === 'Cancelled' ? 'Cancel order' : `Mark ${status}`}</span>{status === 'Cancelled' ? <X aria-hidden="true" className="size-4" /> : <Check aria-hidden="true" className="size-4 text-primary" />}</button>)}</div> : <p className="rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">This order is {order.status.toLowerCase()} and has no further status actions.</p>}
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-4 text-xl">Activity timeline</h3>
            <ol className="flex flex-col gap-4">{[...order.timeline].reverse().map((event, index) => <li key={`${event.at}-${index}`} className="relative flex gap-3"><span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}>{index === 0 ? <PackageCheck aria-hidden="true" className="size-3.5" /> : <Clock3 aria-hidden="true" className="size-3.5" />}</span><div><p className="text-xs font-semibold">{event.status}</p><p className="mt-1 text-[10px] text-muted-foreground">{formatDate(event.at, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</p>{event.note && <p className="mt-1 text-[10px] text-muted-foreground">{event.note}</p>}</div></li>)}</ol>
          </section>
        </div>
      </div>
    </AdminModal>
  )
}

export function AdminOrders() {
  const { orders, updateOrderStatus } = useAdmin()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [payment, setPayment] = useState('all')
  const [orderDate, setOrderDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
  const [selected, setSelected] = useState<AdminOrder | null>(null)

  useEffect(() => {
    const initialStatus = new URLSearchParams(window.location.search).get('status')
    if (initialStatus === 'Pending') setStatus(initialStatus)
  }, [])

  const filtered = useMemo(() => orders.filter((order) => {
    const needle = query.trim().toLowerCase()
    if (needle && !order.id.toLowerCase().includes(needle) && !order.customer.name.toLowerCase().includes(needle)) return false
    if (status !== 'all' && order.status !== status) return false
    if (payment !== 'all' && order.paymentStatus !== payment) return false
    if (orderDate && order.orderDate.slice(0, 10) !== orderDate) return false
    if (deliveryDate && order.deliveryDate !== deliveryDate) return false
    return true
  }).sort((a, b) => sort === 'newest' ? b.orderDate.localeCompare(a.orderDate) : a.orderDate.localeCompare(b.orderDate)), [orders, query, status, payment, orderDate, deliveryDate, sort])

  const clearFilters = () => { setQuery(''); setStatus('all'); setPayment('all'); setOrderDate(''); setDeliveryDate(''); setSort('newest') }
  const filtersActive = !!query || status !== 'all' || payment !== 'all' || !!orderDate || !!deliveryDate

  return (
    <div>
      <PageHeading eyebrow="The heart of the day" title="Orders" description="Search, sort and keep each order moving. Order progress and payment status are managed separately." action={<span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs text-muted-foreground"><ClipboardIcon /> {orders.length} total</span>} />
      <section className="rounded-2xl border border-border/80 bg-card p-4 shadow-[0_2px_10px_rgba(77,55,30,0.025)] sm:p-5" aria-label="Order filters">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1"><label className={labelClass} htmlFor="order-search">Search orders</label><div className="relative"><Search aria-hidden="true" className="absolute top-3 left-3 size-4 text-muted-foreground" /><input id="order-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order ID or customer name" className={`${inputClass} pl-9`} /></div></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
            <div><label className={labelClass} htmlFor="order-status-filter">Order status</label><select id="order-status-filter" className={`${selectClass} min-w-36`} value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{ORDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <div><label className={labelClass} htmlFor="payment-filter">Payment</label><select id="payment-filter" className={`${selectClass} min-w-32`} value={payment} onChange={(event) => setPayment(event.target.value)}><option value="all">All payments</option>{['Pending', 'Paid', 'Failed', 'Refunded'].map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <div><label className={labelClass} htmlFor="order-sort">Sort by</label><select id="order-sort" className={`${selectClass} min-w-32`} value={sort} onChange={(event) => setSort(event.target.value as 'newest' | 'oldest')}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-border/70 pt-3">
          <div><label className={labelClass} htmlFor="placed-date">Order date</label><div className="relative"><CalendarDays aria-hidden="true" className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" /><input id="placed-date" type="date" className={`${inputClass} min-w-44 pl-9`} value={orderDate} onChange={(event) => setOrderDate(event.target.value)} /></div></div>
          <div><label className={labelClass} htmlFor="delivery-date">Delivery date</label><div className="relative"><CalendarDays aria-hidden="true" className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" /><input id="delivery-date" type="date" className={`${inputClass} min-w-44 pl-9`} value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} /></div></div>
          {filtersActive && <button type="button" onClick={clearFilters} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"><X aria-hidden="true" className="size-3.5" /> Clear filters</button>}
          <span className="ml-auto pb-2 text-[10px] text-muted-foreground">Showing {filtered.length} of {orders.length} orders</span>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-border/80 bg-card" aria-label="Orders table">
        {filtered.length === 0 ? <div className="p-4 sm:p-6"><EmptyState title="No orders match these filters" description="Try another search or clear the selected filters to see all demo orders." action={filtersActive ? <button type="button" onClick={clearFilters} className={outlineButtonClass}>Clear filters</button> : undefined} /></div> : <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead className="bg-[#f7f3eb]"><tr className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"><th className="px-5 py-3.5">Order</th><th className="px-4 py-3.5">Customer</th><th className="px-4 py-3.5">Items</th><th className="px-4 py-3.5">Order date</th><th className="px-4 py-3.5">Delivery</th><th className="px-4 py-3.5">Amount</th><th className="px-4 py-3.5">Payment</th><th className="px-4 py-3.5">Status</th><th className="px-5 py-3.5">Action</th></tr></thead>
            <tbody>{filtered.map((order) => <tr key={order.id} className="border-t border-border/70 transition hover:bg-[#fcfaf6]">
              <td className="px-5 py-4"><p className="text-xs font-semibold text-primary">{order.id}</p><p className="mt-1 text-[10px] text-muted-foreground">{order.deliveryMethod}</p></td>
              <td className="px-4 py-4"><p className="max-w-40 truncate text-xs font-medium">{order.customer.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{order.customer.phone}</p></td>
              <td className="px-4 py-4"><p className="max-w-40 truncate text-xs">{order.items[0]?.name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}</p><p className="mt-1 text-[10px] text-muted-foreground">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p></td>
              <td className="px-4 py-4 text-xs">{formatDate(order.orderDate, { day: 'numeric', month: 'short', year: '2-digit' })}<p className="mt-1 text-[10px] text-muted-foreground">{formatDate(order.orderDate, { hour: 'numeric', minute: '2-digit' })}</p></td>
              <td className="px-4 py-4 text-xs">{formatDate(order.deliveryDate, { day: 'numeric', month: 'short' })}<p className="mt-1 text-[10px] text-muted-foreground">{order.timeSlot}</p></td>
              <td className="px-4 py-4 text-xs font-semibold">{formatINR(order.amount)}</td>
              <td className="px-4 py-4"><StatusPill status={order.paymentStatus} /><p className="mt-1 text-[10px] text-muted-foreground">{order.paymentMethod}</p></td>
              <td className="px-4 py-4"><StatusPill status={order.status} /></td>
              <td className="px-5 py-4"><button type="button" onClick={() => setSelected(order)} className="rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-semibold transition hover:border-primary/30 hover:bg-secondary">View details</button></td>
            </tr>)}</tbody>
          </table>
        </div>}
      </section>
      {selected && <OrderDetails order={orders.find((order) => order.id === selected.id) ?? selected} onClose={() => setSelected(null)} onStatus={updateOrderStatus} />}
    </div>
  )
}

function ClipboardIcon() {
  return <ClipboardList aria-hidden="true" className="size-3.5" />
}
