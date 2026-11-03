'use client'

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { ImagePlus, Package, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import type { AdminProduct } from '@/lib/admin/types'
import { createDemoId } from '@/lib/admin/service'
import { useAdmin } from './admin-provider'
import { AdminModal, EmptyState, formatINR, inputClass, labelClass, outlineButtonClass, PageHeading, selectClass, textareaClass } from './admin-primitives'

function slugify(value: string) {
  return value.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function ProductEditor({ initial, onClose, onSave }: { initial?: AdminProduct; onClose: () => void; onSave: (product: AdminProduct) => Promise<void> }) {
  const { data } = useAdmin()
  const [image, setImage] = useState(initial?.image ?? '/images/products/rose-pistachio-celebration-cake.png')
  const [imageError, setImageError] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setImageError('Choose an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { setImageError('Choose an image smaller than 5 MB.'); return }
    setImageError('')
    setImage(URL.createObjectURL(file))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const category = String(form.get('category') ?? '')
    const price = Number(form.get('price'))
    const description = String(form.get('description') ?? '').trim()
    if (!name || !category || !description || !Number.isFinite(price) || price <= 0) return
    const sizesText = String(form.get('sizes') ?? '')
    const flavoursText = String(form.get('flavours') ?? '')
    const customisationsText = String(form.get('customisations') ?? '')
    const sizes = sizesText.split(',').map((value) => value.trim()).filter(Boolean).map((label, index) => initial?.sizes.find((size) => size.label === label) ?? { label, detail: '', multiplier: index + 1 })
    const flavours = flavoursText.split(',').map((value) => value.trim()).filter(Boolean).map((name) => initial?.flavours.find((flavour) => flavour.name === name) ?? { name, extra: 0 })
    const customisationOptions = customisationsText.split(',').map((value) => value.trim()).filter(Boolean)
    if (sizes.length === 0 || flavours.length === 0) { setFormError('Add at least one size and one flavour, separated by commas.'); return }

    const product: AdminProduct = {
      id: initial?.id ?? createDemoId('product'),
      slug: initial?.slug ?? slugify(name),
      name,
      category,
      collections: initial?.collections ?? [],
      image,
      shortDescription: description.slice(0, 120),
      description,
      highlights: initial?.highlights ?? [],
      basePrice: price,
      rating: initial?.rating ?? 0,
      reviews: initial?.reviews ?? 0,
      isBestseller: form.get('bestseller') === 'on',
      isFeatured: form.get('featured') === 'on',
      isAvailable: form.get('available') === 'on',
      customisationOptions,
      isNew: initial?.isNew,
      sizes,
      flavours,
      eggless: String(form.get('eggless')) as AdminProduct['eggless'],
      allowsMessage: initial?.allowsMessage ?? true,
      addedOrder: initial?.addedOrder ?? Date.now(),
    }
    setSaving(true)
    await onSave(product)
    setSaving(false)
    onClose()
  }

  return (
    <AdminModal title={initial ? 'Edit product' : 'Add a product'} description="Product changes are temporary in this demo and do not update the customer catalogue." onClose={onClose} wide>
      <form onSubmit={submit} className="flex flex-col gap-5">
        {formError && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{formError}</p>}
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="flex flex-col gap-4">
            <div><label className={labelClass} htmlFor="product-name">Product name <span className="text-destructive">*</span></label><input id="product-name" name="name" className={inputClass} required maxLength={100} defaultValue={initial?.name ?? ''} placeholder="e.g. Rose Pistachio Celebration Cake" /></div>
            <div><label className={labelClass} htmlFor="product-description">Description <span className="text-destructive">*</span></label><textarea id="product-description" name="description" className={textareaClass} required maxLength={800} defaultValue={initial?.description ?? ''} placeholder="A few words about the flavours and finish…" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={labelClass} htmlFor="product-category">Category <span className="text-destructive">*</span></label><select id="product-category" name="category" className={selectClass} required defaultValue={initial?.category ?? data.categories[0]?.slug ?? ''}>{data.categories.map((category) => <option key={category.id} value={category.slug}>{category.name}{category.isActive ? '' : ' · hidden'}</option>)}</select></div>
              <div><label className={labelClass} htmlFor="product-price">Base price (₹) <span className="text-destructive">*</span></label><input id="product-price" name="price" type="number" className={inputClass} required min="1" max="1000000" step="1" defaultValue={initial?.basePrice ?? ''} placeholder="649" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={labelClass} htmlFor="product-sizes">Available sizes <span className="text-destructive">*</span></label><input id="product-sizes" name="sizes" className={inputClass} required defaultValue={initial?.sizes.map((size) => size.label).join(', ') ?? '0.5 kg, 1 kg'} placeholder="0.5 kg, 1 kg" /><p className="mt-1 text-[10px] text-muted-foreground">Separate options with commas.</p></div>
              <div><label className={labelClass} htmlFor="product-flavours">Available flavours <span className="text-destructive">*</span></label><input id="product-flavours" name="flavours" className={inputClass} required defaultValue={initial?.flavours.map((flavour) => flavour.name).join(', ') ?? 'Vanilla'} placeholder="Vanilla, Chocolate" /><p className="mt-1 text-[10px] text-muted-foreground">Separate options with commas.</p></div>
            </div>
            <div><label className={labelClass} htmlFor="product-eggless">Eggless availability</label><select id="product-eggless" name="eggless" className={selectClass} defaultValue={initial?.eggless ?? 'optional'}><option value="optional">Eggless option available</option><option value="always">Always eggless</option><option value="none">Regular only</option></select></div>
            <div><label className={labelClass} htmlFor="product-customisations">Customisation options</label><input id="product-customisations" name="customisations" className={inputClass} defaultValue={initial?.customisationOptions.join(', ') ?? 'Message on cake'} placeholder="Message on cake, colour palette" /><p className="mt-1 text-[10px] text-muted-foreground">Separate options with commas.</p></div>
          </div>
          <div>
            <label className={labelClass} htmlFor="product-image">Product image</label>
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary/50">
              <img src={image} alt="Product preview" className="aspect-square w-full object-cover" />
              <label htmlFor="product-image" className="flex min-h-11 cursor-pointer items-center justify-center gap-2 px-3 text-xs font-medium text-foreground transition hover:bg-secondary"><ImagePlus aria-hidden="true" className="size-4" /> Choose image</label>
              <input id="product-image" type="file" accept="image/*" className="sr-only" onChange={handleImage} />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">Preview only. Images are not uploaded or stored in this demo.</p>
            {imageError && <p role="alert" className="mt-2 text-xs text-destructive">{imageError}</p>}
          </div>
        </div>
        <fieldset className="grid gap-2 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
          <legend className="px-1 text-xs font-semibold">Product options</legend>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="available" defaultChecked={initial?.isAvailable ?? true} className="size-4 accent-primary" /> Available to order</label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="featured" defaultChecked={initial?.isFeatured ?? false} className="size-4 accent-primary" /> Featured product</label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="bestseller" defaultChecked={initial?.isBestseller ?? false} className="size-4 accent-primary" /> Bestseller</label>
        </fieldset>
        <div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-4 sm:flex-row">
          <button type="button" onClick={onClose} className={outlineButtonClass}>Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">{saving ? 'Saving…' : initial ? 'Save changes' : 'Add product'}</button>
        </div>
      </form>
    </AdminModal>
  )
}

export function AdminProducts() {
  const { data, saveProduct, deleteProduct } = useAdmin()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<AdminProduct | undefined>()

  const filtered = useMemo(() => data.products.filter((product) => {
    const needle = query.trim().toLowerCase()
    if (needle && !product.name.toLowerCase().includes(needle)) return false
    if (category !== 'all' && product.category !== category) return false
    if (availability === 'available' && !product.isAvailable) return false
    if (availability === 'unavailable' && product.isAvailable) return false
    return true
  }), [data.products, query, category, availability])

  function editProduct(product?: AdminProduct) { setEditing(product); setEditorOpen(true) }
  async function removeProduct(product: AdminProduct) {
    if (!window.confirm(`Delete “${product.name}” from the demo catalogue? This cannot be undone during this session.`)) return
    await deleteProduct(product.id)
  }
  async function toggleAvailability(product: AdminProduct) {
    await saveProduct({ ...product, isAvailable: !product.isAvailable })
  }

  return (
    <div>
      <PageHeading eyebrow="Your catalogue" title="Products" description="Update what is on the menu, and keep product options easy to understand." action={<button type="button" onClick={() => editProduct()} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"><Plus aria-hidden="true" className="size-4" /> Add product</button>} />
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:flex-row sm:items-end sm:p-5">
        <div className="min-w-0 flex-1"><label className={labelClass} htmlFor="product-search">Search products</label><div className="relative"><Search aria-hidden="true" className="absolute top-3 left-3 size-4 text-muted-foreground" /><input id="product-search" className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “chocolate” or “birthday”" /></div></div>
        <div className="grid grid-cols-2 gap-3 sm:flex"><div><label className={labelClass} htmlFor="product-category-filter">Category</label><select id="product-category-filter" className={`${selectClass} min-w-36`} value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{data.categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></div><div><label className={labelClass} htmlFor="availability-filter">Availability</label><select id="availability-filter" className={`${selectClass} min-w-36`} value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="all">All products</option><option value="available">Available</option><option value="unavailable">Unavailable</option></select></div></div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/80 bg-card" aria-label="Products">
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-xl">Product list</h2><p className="mt-1 text-[10px] text-muted-foreground">{filtered.length} of {data.products.length} sample products</p></div><span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-medium text-primary">Demo catalogue</span></div>
        {!filtered.length ? <div className="p-4 sm:p-6"><EmptyState title="No products found" description="Try changing the search or category filter, or add a new product." action={<button type="button" onClick={() => editProduct()} className={outlineButtonClass}>Add product</button>} /></div> : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-[#f7f3eb]"><tr className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"><th className="px-5 py-3.5">Product</th><th className="px-4 py-3.5">Category</th><th className="px-4 py-3.5">Price</th><th className="px-4 py-3.5">Availability</th><th className="px-4 py-3.5">Merchandising</th><th className="px-5 py-3.5">Actions</th></tr></thead><tbody>{filtered.map((product) => {
          const categoryName = data.categories.find((item) => item.slug === product.category)?.name ?? 'Uncategorised'
          return <tr key={product.id} className="border-t border-border/70 hover:bg-[#fcfaf6]"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><img src={product.image} alt="" className="size-12 rounded-xl border border-border/70 object-cover" /><div className="min-w-0"><p className="max-w-64 truncate text-xs font-semibold">{product.name}</p><p className="mt-1 max-w-64 truncate text-[10px] text-muted-foreground">{product.shortDescription}</p></div></div></td><td className="px-4 py-4 text-xs">{categoryName}</td><td className="px-4 py-4 text-xs font-semibold">{formatINR(product.basePrice)}</td><td className="px-4 py-4"><button type="button" role="switch" aria-checked={product.isAvailable} onClick={() => toggleAvailability(product)} className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[10px] font-semibold transition ${product.isAvailable ? 'bg-[#eaf0e8] text-[#526749]' : 'bg-muted text-muted-foreground'}`}><span className={`size-1.5 rounded-full ${product.isAvailable ? 'bg-[#6b8d5c]' : 'bg-muted-foreground/50'}`} />{product.isAvailable ? 'Available' : 'Unavailable'}</button></td><td className="px-4 py-4"><div className="flex gap-1.5">{product.isFeatured && <span className="rounded-full bg-[#f5ecd8] px-2 py-1 text-[9px] font-medium text-[#826a37]">Featured</span>}{product.isBestseller && <span className="inline-flex items-center gap-1 rounded-full bg-blush/35 px-2 py-1 text-[9px] font-medium text-primary"><Star aria-hidden="true" className="size-2.5" /> Bestseller</span>}{!product.isFeatured && !product.isBestseller && <span className="text-[10px] text-muted-foreground">—</span>}</div></td><td className="px-5 py-4"><div className="flex items-center gap-1"><button type="button" onClick={() => editProduct(product)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium text-foreground transition hover:bg-secondary" aria-label={`Edit ${product.name}`}><Pencil aria-hidden="true" className="size-3" /> Edit</button><button type="button" onClick={() => removeProduct(product)} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive" aria-label={`Delete ${product.name}`}><Trash2 aria-hidden="true" className="size-3.5" /></button></div></td></tr>
        })}</tbody></table></div>}
      </section>
      {editorOpen && <ProductEditor key={editing?.id ?? 'new'} initial={editing} onClose={() => setEditorOpen(false)} onSave={saveProduct} />}
    </div>
  )
}
