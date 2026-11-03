import { AdminShell } from '@/components/admin/admin-shell'

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  return <AdminShell section={section} />
}
