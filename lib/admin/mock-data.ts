import { CATEGORIES, PRODUCTS } from '@/lib/products'
import type { AdminDatabase, AdminOrder, AdminProduct, CustomerRequest, OrderStatus, PaymentStatus, RequestStatus } from './types'

const dateAt = (offset: number, hour = 12) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

const dateOnly = (offset: number) => dateAt(offset).slice(0, 10)

const orderStatuses: OrderStatus[] = [
  'Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Completed', 'Cancelled', 'Pending', 'Preparing', 'Confirmed', 'Completed',
]
const paymentStatuses: PaymentStatus[] = ['Pending', 'Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Pending', 'Refunded', 'Paid', 'Pending', 'Paid', 'Paid']
const demoNames = ['Aanya Kapoor', 'Rohan Sharma', 'Meera Joshi', 'Kabir Malhotra', 'Ishita Jain', 'Arjun Singh', 'Tara Mehta', 'Nikhil Bansal', 'Ananya Rao', 'Dev Khanna', 'Sana Gupta', 'Vihaan Parekh']
const productPicks = [0, 10, 4, 7, 14, 5, 8, 15, 2, 3, 16, 6]

const createOrders = (): AdminOrder[] => orderStatuses.map((status, index) => {
  const product = PRODUCTS[productPicks[index] % PRODUCTS.length]
  const quantity = index % 4 === 0 ? 2 : 1
  const itemPrice = product.basePrice
  const subtotal = itemPrice * quantity
  const deliveryCharge = subtotal >= 999 ? 0 : 79
  const discount = index % 5 === 0 ? 50 : 0
  const paymentStatus = paymentStatuses[index]
  const orderDate = dateAt(-(index % 7), 10 + (index % 8))
  const deliveryDate = dateOnly(index % 5 === 0 ? 0 : (index % 4) + 1)
  const id = `GP-DEMO-${String(1001 + index).padStart(4, '0')}`

  return {
    id,
    customer: {
      name: `${demoNames[index]} · demo`,
      phone: `+91 90000 000${String(index + 1).padStart(2, '0')}`,
      address: `${12 + index}, Demo Lane, C-Scheme, Jaipur, Rajasthan`,
      pincode: '302001',
    },
    items: [{
      productId: product.id,
      name: product.name,
      quantity,
      size: product.sizes[0]?.label ?? 'Regular',
      flavour: product.flavours[0]?.name ?? 'Chef’s choice',
      eggless: index % 2 === 0,
      unitPrice: itemPrice,
      customisation: index % 3 === 0 ? 'Add a small birthday message' : undefined,
    }],
    orderDate,
    deliveryDate,
    timeSlot: ['10:00 AM – 1:00 PM', '1:00 PM – 4:00 PM', '4:00 PM – 7:00 PM'][index % 3],
    amount: subtotal + deliveryCharge - discount,
    subtotal,
    deliveryCharge,
    discount,
    slotFee: 0,
    status,
    paymentStatus,
    paymentMethod: ['UPI', 'Cash on delivery', 'Card'][index % 3],
    transactionReference: paymentStatus === 'Paid' ? `DEMO-TXN-${2201 + index}` : undefined,
    deliveryMethod: index % 6 === 0 ? 'Pickup' : 'Delivery',
    instructions: index % 4 === 0 ? 'Please call on arrival. Sample order note.' : undefined,
    timeline: [
      { status: 'Pending', at: orderDate, note: 'Demo order received' },
      ...(status !== 'Pending' ? [{ status, at: dateAt(-(index % 3), 14), note: `Demo status: ${status}` }] : []),
    ],
  }
})

const createRequests = (): CustomerRequest[] => {
  const rows: Array<Pick<CustomerRequest, 'type' | 'status' | 'description' | 'requestedDate' | 'internalNotes' | 'referenceImage'>> = [
    { type: 'Custom birthday cake', status: 'New', description: 'A two-tier garden cake in ivory and blush, with a small fondant cat topper.', requestedDate: dateOnly(3), internalNotes: '', referenceImage: '/images/products/two-tier-floral-cake.png' },
    { type: 'Wedding cake', status: 'Contacted', description: 'Enquiring about a three-tier cake for a daytime garden wedding, around 80 guests.', requestedDate: dateOnly(28), internalNotes: 'Discussed tasting appointment · demo note' },
    { type: 'Bulk order', status: 'Quoted', description: 'Assorted pastry boxes for a team gathering, approximately 40 guests.', requestedDate: dateOnly(8), internalNotes: 'Quote shared · demo note' },
    { type: 'Photo cake', status: 'New', description: 'A square photo cake with a family picture and a simple gold border.', requestedDate: dateOnly(5), internalNotes: '', referenceImage: '/images/products/classic-photo-cake.png' },
    { type: 'Anniversary cake', status: 'Accepted', description: 'A small red velvet heart cake with a floral finish.', requestedDate: dateOnly(2), internalNotes: 'Customer approved the design · demo note' },
    { type: 'Corporate order', status: 'Completed', description: 'Individual dessert jars with a custom message card for a launch event.', requestedDate: dateOnly(-4), internalNotes: 'Sample request marked complete · demo note' },
  ]
  return rows.map((row, index) => ({
    id: `DEMO-RQ-${String(401 + index).padStart(4, '0')}`,
    customerName: `${['Ira Sethi', 'Aarav Khandelwal', 'Mihika Doshi', 'Reyansh Kapoor', 'Zoya Arora', 'Neel Shah'][index]} · demo`,
    phone: `+91 90000 001${String(index + 1).padStart(2, '0')}`,
    receivedAt: dateAt(-(index % 5), 11),
    ...row,
  }))
}

export function createDemoDatabase(): AdminDatabase {
  const products: AdminProduct[] = PRODUCTS.map((product, index) => ({
    ...product,
    category: product.category === 'brownies-desserts' ? (product.slug === 'fudge-walnut-brownies' ? 'brownies' : 'desserts') : product.category,
    sizes: product.sizes.map((size) => ({ ...size })),
    flavours: product.flavours.map((flavour) => ({ ...flavour })),
    collections: [...product.collections],
    highlights: [...product.highlights],
    isAvailable: index !== 17,
    isFeatured: index < 4,
    customisationOptions: product.allowsMessage ? ['Message on cake'] : [],
  }))

  return {
    products,
    categories: [
      ...CATEGORIES.map((category) => ({ id: `cat-${category.slug}`, slug: category.slug === 'brownies-desserts' ? 'brownies' : category.slug, name: category.slug === 'brownies-desserts' ? 'Brownies' : category.name, image: category.image, isActive: true })),
      { id: 'cat-desserts', slug: 'desserts', name: 'Desserts', image: '/images/products/biscoff-cheesecake-jars.png', isActive: true },
    ],
    orders: createOrders(),
    requests: createRequests(),
    settings: {
      bakeryName: 'Gulabi Patisserie',
      contactNumber: '+91 141 234 5678',
      whatsappNumber: '+91 90000 00000',
      address: 'C-Scheme, Jaipur, Rajasthan 302001',
      openingHours: '10:00 AM – 8:00 PM, every day',
      deliveryEnabled: true,
      deliveryCharge: 79,
      freeDeliveryThreshold: 999,
      minimumOrder: 299,
      deliveryTimeSlots: ['10:00 AM – 1:00 PM', '1:00 PM – 4:00 PM', '4:00 PM – 7:00 PM'],
    },
  }
}

export const REQUEST_STATUSES: RequestStatus[] = ['New', 'Contacted', 'Quoted', 'Accepted', 'Rejected', 'Completed']
