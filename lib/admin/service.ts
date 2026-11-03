import { createDemoDatabase } from './mock-data'
import type { AdminCategory, AdminDatabase, AdminOrder, AdminProduct, BakerySettings, CustomerRequest } from './types'

const copy = <T,>(value: T): T => structuredClone(value)

export function createDemoId(prefix: string) {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${prefix}-${id}`
}

export function createAdminService(seed: AdminDatabase = createDemoDatabase()) {
  let database = copy(seed)

  return {
    getSnapshot: () => copy(database),
    saveOrder(order: AdminOrder) {
      database.orders = [order, ...database.orders.filter((item) => item.id !== order.id)]
      return this.getSnapshot()
    },
    saveProduct(product: AdminProduct) {
      const exists = database.products.some((item) => item.id === product.id)
      database.products = exists
        ? database.products.map((item) => item.id === product.id ? product : item)
        : [product, ...database.products]
      return this.getSnapshot()
    },
    deleteProduct(id: string) {
      database.products = database.products.filter((item) => item.id !== id)
      return this.getSnapshot()
    },
    saveCategory(category: AdminCategory) {
      const exists = database.categories.some((item) => item.id === category.id)
      database.categories = exists
        ? database.categories.map((item) => item.id === category.id ? category : item)
        : [...database.categories, category]
      return this.getSnapshot()
    },
    deleteCategory(id: string) {
      database.categories = database.categories.filter((item) => item.id !== id)
      return this.getSnapshot()
    },
    saveRequest(request: CustomerRequest) {
      database.requests = database.requests.map((item) => item.id === request.id ? request : item)
      return this.getSnapshot()
    },
    saveSettings(settings: BakerySettings) {
      database.settings = settings
      return this.getSnapshot()
    },
  }
}

export const adminService = createAdminService()
