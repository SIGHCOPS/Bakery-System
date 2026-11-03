'use client'

import { useState, type FormEvent } from 'react'
import { Clock3, MapPin, Plus, Settings2, Trash2 } from 'lucide-react'
import type { BakerySettings } from '@/lib/admin/types'
import { useAdmin } from './admin-provider'
import { inputClass, labelClass, outlineButtonClass, PageHeading } from './admin-primitives'

export function AdminSettings() {
  const { data, saveSettings } = useAdmin()
  const [settings, setSettings] = useState<BakerySettings>(data.settings)
  const [newSlot, setNewSlot] = useState('')
  const [saving, setSaving] = useState(false)

  function update<K extends keyof BakerySettings>(key: K, value: BakerySettings[K]) {
    setSettings((previous) => ({ ...previous, [key]: value }))
  }

  function addSlot() {
    const value = newSlot.trim()
    if (!value || settings.deliveryTimeSlots.includes(value)) return
    update('deliveryTimeSlots', [...settings.deliveryTimeSlots, value])
    setNewSlot('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    await saveSettings(settings)
    setSaving(false)
  }

  return <div>
    <PageHeading eyebrow="Behind the counter" title="Bakery settings" description="A few small details to keep close. These demo settings are not connected to the storefront." action={<span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs text-muted-foreground"><Settings2 aria-hidden="true" className="size-4" /> Demo configuration</span>} />
    <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[1fr_0.92fr]">
      <div className="flex flex-col gap-5">
        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><MapPin aria-hidden="true" className="size-4" /></span><div><h2 className="text-2xl">Business information</h2><p className="mt-1 text-xs text-muted-foreground">The essentials customers may need to find you.</p></div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="bakery-name">Bakery name</label><input id="bakery-name" className={inputClass} value={settings.bakeryName} onChange={(event) => update('bakeryName', event.target.value)} required maxLength={100} /></div>
            <div><label className={labelClass} htmlFor="contact-number">Contact number</label><input id="contact-number" className={inputClass} type="tel" value={settings.contactNumber} onChange={(event) => update('contactNumber', event.target.value)} required maxLength={32} /></div>
            <div><label className={labelClass} htmlFor="whatsapp-number">WhatsApp number</label><input id="whatsapp-number" className={inputClass} type="tel" value={settings.whatsappNumber} onChange={(event) => update('whatsappNumber', event.target.value)} required maxLength={32} /></div>
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="bakery-address">Bakery address</label><textarea id="bakery-address" className="min-h-24 w-full resize-y rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" value={settings.address} onChange={(event) => update('address', event.target.value)} required maxLength={240} /></div>
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="opening-hours">Opening hours</label><input id="opening-hours" className={inputClass} value={settings.openingHours} onChange={(event) => update('openingHours', event.target.value)} required maxLength={120} /></div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f5ecd8] text-[#826a37]"><Clock3 aria-hidden="true" className="size-4" /></span><div><h2 className="text-2xl">Delivery time slots</h2><p className="mt-1 text-xs text-muted-foreground">Keep availability windows clear and manageable.</p></div></div>
          <ul className="flex flex-col gap-2">{settings.deliveryTimeSlots.map((slot) => <li key={slot} className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 text-xs"><span>{slot}</span><button type="button" onClick={() => update('deliveryTimeSlots', settings.deliveryTimeSlots.filter((item) => item !== slot))} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove ${slot}`}><Trash2 aria-hidden="true" className="size-3.5" /></button></li>)}</ul>
          <div className="mt-3 flex gap-2"><input aria-label="New delivery time slot" className={inputClass} value={newSlot} onChange={(event) => setNewSlot(event.target.value)} placeholder="e.g. 7:00 PM – 9:00 PM" onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); addSlot() } }} /><button type="button" onClick={addSlot} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium transition hover:bg-secondary"><Plus aria-hidden="true" className="size-4" /> Add slot</button></div>
          {settings.deliveryTimeSlots.length === 0 && <p className="mt-2 text-[10px] text-destructive">Add at least one delivery slot before saving.</p>}
        </section>
      </div>

      <div className="flex flex-col gap-5">
        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6">
          <div className="mb-5"><h2 className="text-2xl">Delivery settings</h2><p className="mt-1 text-xs text-muted-foreground">Rates and thresholds for a future storefront connection.</p></div>
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4"><span><span className="block text-xs font-semibold">Delivery availability</span><span className="mt-1 block text-[10px] text-muted-foreground">Allow orders to be delivered in the demo configuration.</span></span><input type="checkbox" role="switch" aria-label="Delivery available" checked={settings.deliveryEnabled} onChange={(event) => update('deliveryEnabled', event.target.checked)} className="size-5 accent-primary" /></label>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass} htmlFor="delivery-charge">Delivery charge (₹)</label><input id="delivery-charge" className={inputClass} type="number" min="0" step="1" required value={settings.deliveryCharge} onChange={(event) => update('deliveryCharge', Number(event.target.value))} /></div>
            <div><label className={labelClass} htmlFor="free-threshold">Free delivery from (₹)</label><input id="free-threshold" className={inputClass} type="number" min="0" step="1" required value={settings.freeDeliveryThreshold} onChange={(event) => update('freeDeliveryThreshold', Number(event.target.value))} /></div>
            <div className="sm:col-span-2"><label className={labelClass} htmlFor="minimum-order">Minimum order amount (₹)</label><input id="minimum-order" className={inputClass} type="number" min="0" step="1" required value={settings.minimumOrder} onChange={(event) => update('minimumOrder', Number(event.target.value))} /></div>
          </div>
        </section>
        <div className="rounded-2xl border border-[#e3d5b8] bg-[#f6efdf]/70 p-4 text-[11px] leading-5 text-[#685632]"><strong>Prepared for the next step.</strong> Settings are shaped as a single data object, so they can later be read by a Supabase-backed service and shared with relevant storefront components.</div>
        <div className="flex justify-end"><button type="submit" disabled={saving || settings.deliveryTimeSlots.length === 0} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">{saving ? 'Saving…' : 'Save settings'}</button></div>
      </div>
    </form>
  </div>
}
