'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { ArrowUpRight, CalendarDays, MessageCircle, Search, StickyNote, UserRound } from 'lucide-react'
import type { CustomerRequest, RequestStatus } from '@/lib/admin/types'
import { REQUEST_STATUSES } from '@/lib/admin/mock-data'
import { useAdmin } from './admin-provider'
import { AdminModal, EmptyState, formatDate, inputClass, labelClass, PageHeading, selectClass, StatusPill, textareaClass } from './admin-primitives'

function RequestDetails({ request, onClose, onSave, onConvert }: { request: CustomerRequest; onClose: () => void; onSave: (request: CustomerRequest) => Promise<void>; onConvert: (request: CustomerRequest) => Promise<void> }) {
  const [status, setStatus] = useState<RequestStatus>(request.status)
  const [notes, setNotes] = useState(request.internalNotes)
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    await onSave({ ...request, status, internalNotes: notes })
    setSaving(false)
    onClose()
  }

  async function convert() {
    if (!window.confirm('Create a linked draft order from this accepted request? It will have no confirmed price or payment.')) return
    setSaving(true)
    await onConvert({ ...request, status, internalNotes: notes })
    setSaving(false)
    onClose()
  }

  return <AdminModal title={`Request ${request.id}`} description={`Received ${formatDate(request.receivedAt, { day: 'numeric', month: 'long', year: 'numeric' })}`} onClose={onClose} wide>
    <form onSubmit={submit} className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
      <div className="flex flex-col gap-4">
        <section className="rounded-2xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl">{request.customerName}</h3><p className="mt-1 text-xs text-muted-foreground">{request.type}</p></div><StatusPill status={request.status} /></div><div className="mt-4 flex flex-wrap gap-2"><a href={`tel:${request.phone.replace(/[^+\d]/g, '')}`} className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-medium transition hover:bg-secondary"><UserRound aria-hidden="true" className="size-3.5" /> Call customer</a><a href={`https://wa.me/${request.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-medium transition hover:bg-secondary"><MessageCircle aria-hidden="true" className="size-3.5" /> Open WhatsApp</a></div><div className="mt-4 grid gap-2 rounded-xl bg-secondary/60 p-3 text-xs"><span><strong className="font-medium">Contact:</strong> {request.phone}</span><span className="flex items-center gap-1.5 text-muted-foreground"><CalendarDays aria-hidden="true" className="size-3.5" /> Requested for {formatDate(request.requestedDate, { day: 'numeric', month: 'long', year: 'numeric' })}</span></div></section>
        <section className="rounded-2xl border border-border bg-card p-4"><h3 className="mb-2 text-xl">What they&apos;re looking for</h3><p className="text-sm leading-6 text-muted-foreground">{request.description}</p>{request.referenceImage && <a href={request.referenceImage} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-3 rounded-xl border border-border p-2 transition hover:bg-secondary/50"><img src={request.referenceImage} alt="Customer reference" className="size-14 rounded-lg object-cover" /><span className="flex-1 text-xs font-medium">Reference image</span><ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" /></a>}</section>
        <div className="rounded-xl border border-[#e3d5b8] bg-[#f6efdf]/70 p-3 text-[10px] leading-5 text-[#685632]">Enquiries stay separate from orders until you explicitly create a linked draft. No payment is collected when a draft is created.</div>
      </div>
      <div className="flex flex-col gap-4">
        <div><label className={labelClass} htmlFor="request-status">Request status</label><select id="request-status" className={selectClass} value={status} onChange={(event) => setStatus(event.target.value as RequestStatus)}>{REQUEST_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
        <div className="flex-1"><label className={`${labelClass} inline-flex items-center gap-1.5`} htmlFor="request-notes"><StickyNote aria-hidden="true" className="size-3.5" /> Internal notes</label><textarea id="request-notes" className={`${textareaClass} min-h-36`} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1200} placeholder="Keep a private note for the bakery team…" /><p className="mt-1 text-[10px] text-muted-foreground">Visible only in this demo dashboard.</p></div>
        {request.convertedOrderId && <a href="/admin/orders" className="rounded-xl bg-secondary/60 p-3 text-xs font-medium text-primary hover:underline">Linked draft order: {request.convertedOrderId} · View orders</a>}
        <div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-4 sm:flex-row"><button type="button" onClick={onClose} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted">Close</button>{status === 'Accepted' && !request.convertedOrderId && <button type="button" onClick={convert} disabled={saving} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-primary/20 bg-secondary px-4 text-sm font-medium text-primary transition hover:bg-secondary/80 disabled:opacity-60">Create linked draft</button>}<button type="submit" disabled={saving} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">{saving ? 'Saving…' : 'Save request'}</button></div>
      </div>
    </form>
  </AdminModal>
}

export function AdminRequests() {
  const { data, saveRequest, convertRequestToOrder } = useAdmin()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<CustomerRequest | null>(null)
  const filtered = useMemo(() => data.requests.filter((request) => {
    const needle = query.trim().toLowerCase()
    if (needle && !request.id.toLowerCase().includes(needle) && !request.customerName.toLowerCase().includes(needle) && !request.type.toLowerCase().includes(needle)) return false
    if (status !== 'all' && request.status !== status) return false
    return true
  }).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)), [data.requests, query, status])
  const counts = data.requests.reduce<Record<RequestStatus, number>>((result, item) => { result[item.status] += 1; return result }, { New: 0, Contacted: 0, Quoted: 0, Accepted: 0, Rejected: 0, Completed: 0 })

  return <div>
    <PageHeading eyebrow="A thoughtful follow-up" title="Customer requests" description="Custom cakes, celebration ideas and larger orders — kept separate from confirmed orders." action={<span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs text-muted-foreground"><MessageCircle aria-hidden="true" className="size-4" /> {counts.New} new enquiries</span>} />
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{REQUEST_STATUSES.map((item) => <button type="button" key={item} onClick={() => setStatus(status === item ? 'all' : item)} className={`rounded-2xl border px-4 py-3 text-left transition ${status === item ? 'border-primary/30 bg-secondary' : 'border-border/80 bg-card hover:bg-secondary/50'}`}><span className="text-[10px] text-muted-foreground">{item}</span><span className="mt-1 block text-xl font-semibold">{counts[item]}</span></button>)}</div>
    <section className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div className="w-full sm:max-w-md"><label htmlFor="request-search" className={labelClass}>Search requests</label><div className="relative"><Search aria-hidden="true" className="absolute top-3 left-3 size-4 text-muted-foreground" /><input id="request-search" className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, request type or ID" /></div></div><div className="sm:w-48"><label htmlFor="request-status-filter" className={labelClass}>Filter by status</label><select id="request-status-filter" className={selectClass} value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{REQUEST_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}</select></div></div>
      {filtered.length === 0 ? <EmptyState title="No matching requests" description="Try another search or status to find customer enquiries." /> : <div className="grid gap-3 lg:grid-cols-2">{filtered.map((request) => <article key={request.id} className="rounded-2xl border border-border bg-background p-4 transition hover:border-primary/20 hover:shadow-[0_6px_20px_rgba(77,55,30,0.04)]"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blush/30 text-primary"><MessageCircle aria-hidden="true" className="size-4" /></span><div className="min-w-0"><p className="truncate text-xs font-semibold">{request.customerName}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">{request.id} · {request.type}{request.convertedOrderId ? ` · ${request.convertedOrderId}` : ''}</p></div></div><StatusPill status={request.status} /></div><p className="mt-4 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">{request.description}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"><span className="text-[10px] text-muted-foreground">Received {formatDate(request.receivedAt, { day: 'numeric', month: 'short' })} · Needed {formatDate(request.requestedDate, { day: 'numeric', month: 'short' })}</span><button type="button" onClick={() => setSelected(request)} className="rounded-lg border border-border px-3 py-2 text-[10px] font-semibold transition hover:bg-secondary">View request</button></div></article>)}</div>}
    </section>
    {selected && <RequestDetails request={data.requests.find((item) => item.id === selected.id) ?? selected} onClose={() => setSelected(null)} onSave={saveRequest} onConvert={convertRequestToOrder} />}
  </div>
}
