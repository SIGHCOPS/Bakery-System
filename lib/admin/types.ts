import type { Product } from '@/lib/products'

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready for Pickup',
  'Out for Delivery',
  'Completed',
  'Cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded'
export type RequestStatus = 'New' | 'Contacted' | 'Quoted' | 'Accepted' | 'Rejected' | 'Completed'

export type AdminCustomer = {
  name: string
  phone: string
  address: string
  pincode: string
}

export type AdminOrderItem = {
  productId: string
  name: string
  quantity: number
  size: string
  flavour: string
  eggless: boolean
  unitPrice: number
  customisation?: string
}

export type OrderActivity = {
  status: OrderStatus
  at: string
  note?: string
}

export type AdminOrder = {
  id: string
  source?: 'storefront'
  customer: AdminCustomer
  items: AdminOrderItem[]
  orderDate: string
  deliveryDate: string
  timeSlot: string
  amount: number
  subtotal: number
  deliveryCharge: number
  discount: number
  slotFee: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  transactionReference?: string
  deliveryMethod: 'Delivery' | 'Pickup'
  instructions?: string
  timeline: OrderActivity[]
  originatingRequestId?: string
}

export type AdminProduct = Omit<Product, 'category'> & {
  category: string
  isAvailable: boolean
  isFeatured: boolean
  customisationOptions: string[]
}

export type AdminCategory = {
  id: string
  slug: string
  name: string
  image: string
  isActive: boolean
}

export type CustomerRequest = {
  id: string
  customerName: string
  phone: string
  type: string
  description: string
  requestedDate: string
  receivedAt: string
  referenceImage?: string
  status: RequestStatus
  internalNotes: string
  convertedOrderId?: string
}

export type BakerySettings = {
  bakeryName: string
  contactNumber: string
  whatsappNumber: string
  address: string
  openingHours: string
  deliveryEnabled: boolean
  deliveryCharge: number
  freeDeliveryThreshold: number
  minimumOrder: number
  deliveryTimeSlots: string[]
}

export type AdminDatabase = {
  products: AdminProduct[]
  categories: AdminCategory[]
  orders: AdminOrder[]
  requests: CustomerRequest[]
  settings: BakerySettings
}
