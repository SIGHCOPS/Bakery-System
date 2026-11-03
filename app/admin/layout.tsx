import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminProvider } from '@/components/admin/admin-provider'
import './admin.css'

export const metadata: Metadata = {
  title: 'Bakery Admin',
  description: 'A demonstration admin workspace for managing Gulabi Patisserie orders, products and customer requests.',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>
}
