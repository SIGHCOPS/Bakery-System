'use client'

import { useSyncExternalStore } from 'react'

export type CartItem = {
  key: string
  productId: string
  slug: string
  name: string
  image: string
  size: string
  flavour: string
  eggless: boolean
  message: string
  unitPrice: number
  quantity: number
}

export type Order = {
  orderNumber: string
  placedAt: string
  items: CartItem[]
  customer: {
    name: string
    mobile: string
    address: string
    pincode: string
    deliveryDate: string
    timeSlot: string
    instructions: string
  }
  paymentMethod: string
  totals: CartTotals & { slotFee: number; grandTotal: number }
}

export type Coupon = {
  code: string
  description: string
  minSubtotal: number
  compute: (subtotal: number) => number
}

export type CartTotals = {
  subtotal: number
  discount: number
  delivery: number
  total: number
  itemCount: number
}

type State = {
  items: CartItem[]
  couponCode: string | null
  orders: Order[]
}

export const MAX_QUANTITY = 10
export const FREE_DELIVERY_THRESHOLD = 999
export const DELIVERY_FEE = 79

export const COUPONS: Coupon[] = [
  {
    code: 'SWEET10',
    description: '10% off orders above ₹1,499 (up to ₹400)',
    minSubtotal: 1499,
    compute: (subtotal) => Math.min(Math.round(subtotal * 0.1), 400),
  },
  {
    code: 'FIRSTBITE',
    description: 'Flat ₹150 off orders above ₹799',
    minSubtotal: 799,
    compute: () => 150,
  },
]

const STORAGE_KEY = 'gulabi-demo-store-v1'
const EMPTY: State = { items: [], couponCode: null, orders: [] }

let state: State = EMPTY
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>
      state = {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        couponCode: typeof parsed.couponCode === 'string' ? parsed.couponCode : null,
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      }
    }
  } catch {
    state = EMPTY
  }
}

function setState(updater: (prev: State) => State) {
  load()
  state = updater(state)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable (private mode); the in-memory cart still works.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false
      load()
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function getSnapshot() {
  load()
  return state
}

function getServerSnapshot() {
  return EMPTY
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function buildItemKey(item: Pick<CartItem, 'productId' | 'size' | 'flavour' | 'eggless' | 'message'>) {
  return [item.productId, item.size, item.flavour, item.eggless ? 'e' : 'r', item.message.trim()].join('|')
}

export function addToCart(item: Omit<CartItem, 'key'>) {
  const key = buildItemKey(item)
  setState((prev) => {
    const existing = prev.items.find((i) => i.key === key)
    const items = existing
      ? prev.items.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + item.quantity) } : i,
        )
      : [...prev.items, { ...item, key }]
    return { ...prev, items }
  })
}

export function updateQuantity(key: string, quantity: number) {
  const safe = Math.max(1, Math.min(MAX_QUANTITY, Math.floor(quantity)))
  setState((prev) => ({
    ...prev,
    items: prev.items.map((i) => (i.key === key ? { ...i, quantity: safe } : i)),
  }))
}

export function removeFromCart(key: string) {
  setState((prev) => ({ ...prev, items: prev.items.filter((i) => i.key !== key) }))
}

export function applyCoupon(code: string): { ok: boolean; message: string } {
  const coupon = COUPONS.find((c) => c.code === code.trim().toUpperCase())
  if (!coupon) return { ok: false, message: 'That code isn’t valid. Try SWEET10 or FIRSTBITE.' }
  const subtotal = getSnapshot().items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      message: `Add items worth ₹${(coupon.minSubtotal - subtotal).toLocaleString('en-IN')} more to use ${coupon.code}.`,
    }
  }
  setState((prev) => ({ ...prev, couponCode: coupon.code }))
  return { ok: true, message: `${coupon.code} applied — ${coupon.description}.` }
}

export function removeCoupon() {
  setState((prev) => ({ ...prev, couponCode: null }))
}

export function computeTotals(items: CartItem[], couponCode: string | null): CartTotals {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const coupon = COUPONS.find((c) => c.code === couponCode)
  const discount = coupon && subtotal >= coupon.minSubtotal ? coupon.compute(subtotal) : 0
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  return { subtotal, discount, delivery, total: Math.max(0, subtotal - discount + delivery), itemCount }
}

export function generateOrderNumber() {
  const now = new Date()
  const datePart = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}`
  const random = Math.floor(1000 + Math.random() * 9000)
  return `GP-${datePart}-${random}`
}

export function placeOrder(order: Order) {
  setState((prev) => ({
    items: [],
    couponCode: null,
    orders: [order, ...prev.orders].slice(0, 10),
  }))
}
