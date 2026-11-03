'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ImagePlus, Pencil, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import type { AdminCategory } from '@/lib/admin/types'
import { createDemoId } from '@/lib/admin/service'
import { useAdmin } from './admin-provider'
import { AdminModal, inputClass, labelClass, outlineButtonClass, PageHeading } from './admin-primitives'

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function CategoryEditor({ initial, onClose, onSave }: { initial?: AdminCategory; onClose: () => void; onSave: (category: AdminCategory) => Promise<void> }) {
  const { data } = useAdmin()
  const [image, setImage] = useState(initial?.image ?? '/images/products/assorted-pastry-box.png')
  const [imageError, setImageError] = useState('')
  const [error, setError] = useState('')
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
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    setError('')
    if (!name) return
    const slug = initial?.slug ?? slugify(name)
    const duplicate = data.categories.some((category) => category.id !== initial?.id && (category.slug === slug || category.name.toLowerCase() === name.toLowerCase()))
    if (duplicate) { setError('A category with this name already exists.'); return }
    await onSave({ id: initial?.id ?? createDemoId('category'), slug, name, image, isActive: form.get('active') === 'on' })
    onClose()
  }

  return <AdminModal title={initial ? 'Edit category' : 'Add a category'} description="Categories are demo records and do not change the customer storefront." onClose={onClose}>
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div><label className={labelClass} htmlFor="category-name">Category name <span className="text-destructive">*</span></label><input id="category-name" name="name" className={inputClass} required maxLength={60} defaultValue={initial?.name ?? ''} placeholder="e.g. Celebration cakes" />{error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}</div>
      <div><label className={labelClass} htmlFor="category-image">Category image</label><div className="overflow-hidden rounded-2xl border border-border bg-secondary/50"><img src={image} alt="Category preview" className="aspect-[16/7] w-full object-cover" /><label htmlFor="category-image" className="flex min-h-11 cursor-pointer items-center justify-center gap-2 px-3 text-xs font-medium transition hover:bg-secondary"><ImagePlus aria-hidden="true" className="size-4" /> Choose image</label><input id="category-image" type="file" accept="image/*" className="sr-only" onChange={handleImage} /></div><p className="mt-2 text-[10px] leading-4 text-muted-foreground">Preview only. Uploads are not stored in this demo.</p>{imageError && <p role="alert" className="mt-2 text-xs text-destructive">{imageError}</p>}</div>
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="active" defaultChecked={initial?.isActive ?? true} className="size-4 accent-primary" /> Show category as active</label>
      <div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-4 sm:flex-row"><button type="button" onClick={onClose} className={outlineButtonClass}>Cancel</button><button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">{initial ? 'Save category' : 'Add category'}</button></div>
    </form>
  </AdminModal>
}

export function AdminCategories() {
  const { data, saveCategory, saveProduct, deleteCategory } = useAdmin()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<AdminCategory | undefined>()

  function openEditor(category?: AdminCategory) { setEditing(category); setEditorOpen(true) }
  async function removeCategory(category: AdminCategory) {
    const assigned = data.products.filter((product) => product.category === category.slug)
    const fallback = data.categories.find((item) => item.id !== category.id && item.isActive)
    const consequence = assigned.length && fallback
      ? ` ${assigned.length} assigned product${assigned.length === 1 ? '' : 's'} will be moved to “${fallback.name}”.`
      : ''
    if (!window.confirm(`Delete “${category.name}”?${consequence} This cannot be undone during this demo session.`)) return
    if (assigned.length && !fallback) { window.alert('Create or activate another category before deleting this one.'); return }
    if (fallback) await Promise.all(assigned.map((product) => saveProduct({ ...product, category: fallback.slug })))
    await deleteCategory(category.id)
  }

  return <div>
    <PageHeading eyebrow="A menu with a little order" title="Categories" description="Keep the catalogue simple to browse, with the right pastries in the right places." action={<button type="button" onClick={() => openEditor()} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"><Plus aria-hidden="true" className="size-4" /> Add category</button>} />
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#e3d5b8] bg-[#f6efdf]/70 p-4 text-xs leading-5 text-[#685632]"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#e9dcc0] text-[11px] font-bold">i</span><p><strong>Product assignments stay tidy.</strong> When you delete a category with products, we&apos;ll ask first and move those sample products into another active category.</p></div>
    <section className="overflow-hidden rounded-2xl border border-border/80 bg-card" aria-label="Bakery categories">
      <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-xl">Your categories</h2><p className="mt-1 text-[10px] text-muted-foreground">{data.categories.length} sample categories</p></div><span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-medium text-primary">Demo catalogue</span></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-[#f7f3eb]"><tr className="text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"><th className="px-5 py-3.5">Category</th><th className="px-4 py-3.5">Products</th><th className="px-4 py-3.5">Visibility</th><th className="px-5 py-3.5">Actions</th></tr></thead><tbody>{data.categories.map((category) => {
        const count = data.products.filter((product) => product.category === category.slug).length
        return <tr key={category.id} className="border-t border-border/70 hover:bg-[#fcfaf6]"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><img src={category.image} alt="" className="size-12 rounded-xl border border-border/70 object-cover" /><div><p className="text-xs font-semibold">{category.name}</p><p className="mt-1 text-[10px] text-muted-foreground">/{category.slug}</p></div></div></td><td className="px-4 py-4"><span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-foreground">{count} product{count === 1 ? '' : 's'}</span></td><td className="px-4 py-4"><button type="button" role="switch" aria-checked={category.isActive} onClick={() => saveCategory({ ...category, isActive: !category.isActive })} className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[10px] font-semibold transition ${category.isActive ? 'bg-[#eaf0e8] text-[#526749]' : 'bg-muted text-muted-foreground'}`}>{category.isActive ? <ToggleRight aria-hidden="true" className="size-4" /> : <ToggleLeft aria-hidden="true" className="size-4" />}{category.isActive ? 'Active' : 'Hidden'}</button></td><td className="px-5 py-4"><div className="flex items-center gap-1"><button type="button" onClick={() => openEditor(category)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium transition hover:bg-secondary" aria-label={`Edit ${category.name}`}><Pencil aria-hidden="true" className="size-3" /> Edit</button><button type="button" onClick={() => removeCategory(category)} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive" aria-label={`Delete ${category.name}`}><Trash2 aria-hidden="true" className="size-3.5" /></button></div></td></tr>
      })}</tbody></table></div>
    </section>
    {editorOpen && <CategoryEditor key={editing?.id ?? 'new'} initial={editing} onClose={() => setEditorOpen(false)} onSave={saveCategory} />}
  </div>
}
