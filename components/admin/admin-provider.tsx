'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { useStore, type Order as StorefrontOrder } from '@/lib/cart-store'
import { adminService, createDemoId } from '@/lib/admin/service'
import type { AdminCategory, AdminDatabase, AdminOrder, AdminProduct, BakerySettings, CustomerRequest, OrderStatus } from '@/lib/admin/types'

function fromStorefrontOrder(order: StorefrontOrder, saved?: AdminOrder): AdminOrder {
  const subtotal = order.totals.subtotal
  const deliveryCharge = order.totals.delivery
  const discount = order.totals.discount
  return {
    id: order.orderNumber,
    source: 'storefront',
    customer: {
      name: order.customer.name,
      phone: order.customer.mobile,
      address: order.customer.address,
      pincode: order.customer.pincode,
    },
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      flavour: item.flavour,
      eggless: item.eggless,
      unitPrice: item.unitPrice,
      customisation: item.message || undefined,
    })),
    orderDate: order.placedAt,
    deliveryDate: order.customer.deliveryDate,
    timeSlot: order.customer.timeSlot,
    amount: order.totals.grandTotal,
    subtotal,
    deliveryCharge,
    discount,
    slotFee: order.totals.slotFee,
    status: saved?.status ?? 'Pending',
    paymentStatus: saved?.paymentStatus ?? 'Pending',
    paymentMethod: order.paymentMethod,
    deliveryMethod: 'Delivery',
    instructions: order.customer.instructions,
    timeline: saved?.timeline ?? [{ status: 'Pending', at: order.placedAt, note: 'Received from the customer checkout demo' }],
    originatingRequestId: saved?.originatingRequestId,
  }
}

type AdminContextValue = {
  data: AdminDatabase
  orders: AdminOrder[]
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
  saveProduct: (product: AdminProduct) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  saveCategory: (category: AdminCategory) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  saveRequest: (request: CustomerRequest) => Promise<void>
  convertRequestToOrder: (request: CustomerRequest) => Promise<void>
  saveSettings: (settings: BakerySettings) => Promise<void>
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const storefront = useStore()
  const [data, setData] = useState<AdminDatabase>(() => adminService.getSnapshot())

  const orders = useMemo(() => {
    const connected = storefront.orders.map((order) => {
      const saved = data.orders.find((item) => item.id === order.orderNumber)
      return fromStorefrontOrder(order, saved)
    })
    return [...data.orders.filter((order) => order.source !== 'storefront'), ...connected]
  }, [data.orders, storefront.orders])

  const refresh = () => setData(adminService.getSnapshot())

  const value: AdminContextValue = {
    data,
    orders,
    async updateOrderStatus(id, status) {
      const current = orders.find((order) => order.id === id)
      if (!current || current.status === status) return
      try {
        adminService.saveOrder({
          ...current,
          status,
          timeline: [...current.timeline, { status, at: new Date().toISOString(), note: `Status updated to ${status}` }],
        })
        refresh()
        toast.success(`Order ${id} marked ${status.toLowerCase()}.`)
      } catch {
        toast.error('The order could not be updated. Please try again.')
      }
    },
    async saveProduct(product) {
      try {
        adminService.saveProduct(product)
        refresh()
        toast.success('Product saved in this demo session.')
      } catch {
        toast.error('The product could not be saved. Please try again.')
      }
    },
    async deleteProduct(id) {
      try {
        adminService.deleteProduct(id)
        refresh()
        toast.success('Product removed from the demo catalogue.')
      } catch {
        toast.error('The product could not be removed. Please try again.')
      }
    },
    async saveCategory(category) {
      try {
        adminService.saveCategory(category)
        refresh()
        toast.success('Category saved in this demo session.')
      } catch {
        toast.error('The category could not be saved. Please try again.')
      }
    },
    async deleteCategory(id) {
      try {
        adminService.deleteCategory(id)
        refresh()
        toast.success('Category removed from the demo catalogue.')
      } catch {
        toast.error('The category could not be removed. Please try again.')
      }
    },
    async saveRequest(request) {
      try {
        adminService.saveRequest(request)
        refresh()
        toast.success('Customer request updated.')
      } catch {
        toast.error('The request could not be updated. Please try again.')
      }
    },
    async convertRequestToOrder(request) {
      if (request.status !== 'Accepted') {
        toast.error('Set this request to Accepted before creating a linked order.')
        return
      }
      if (request.convertedOrderId) {
        toast.error(`This request is already linked to ${request.convertedOrderId}.`)
        return
      }
      try {
        const id = createDemoId('GP-DRAFT')
        const createdAt = new Date().toISOString()
        const order: AdminOrder = {
          id,
          customer: { name: request.customerName, phone: request.phone, address: 'Address to be confirmed', pincode: '—' },
          items: [{ productId: 'custom-request', name: `Custom order · ${request.type}`, quantity: 1, size: 'Custom brief', flavour: 'To be confirmed', eggless: false, unitPrice: 0, customisation: request.description }],
          orderDate: createdAt,
          deliveryDate: request.requestedDate,
          timeSlot: 'To be confirmed',
          amount: 0,
          subtotal: 0,
          deliveryCharge: 0,
          discount: 0,
          slotFee: 0,
          status: 'Pending',
          paymentStatus: 'Pending',
          paymentMethod: 'To be arranged',
          deliveryMethod: 'Delivery',
          instructions: 'Draft created from a customer request. Confirm items, price, address and delivery details before accepting.',
          timeline: [{ status: 'Pending', at: createdAt, note: `Draft linked to ${request.id}` }],
          originatingRequestId: request.id,
        }
        adminService.saveRequest({ ...request, convertedOrderId: id })
        adminService.saveOrder(order)
        refresh()
        toast.success(`Draft ${id} created and linked to ${request.id}.`)
      } catch {
        toast.error('A linked order could not be created. Please try again.')
      }
    },
    async saveSettings(settings) {
      try {
        adminService.saveSettings(settings)
        refresh()
        toast.success('Bakery settings saved for this demo session.')
      } catch {
        toast.error('Settings could not be saved. Please try again.')
      }
    },
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const value = useContext(AdminContext)
  if (!value) throw new Error('useAdmin must be used inside AdminProvider')
  return value
}
