import { redirect } from 'next/navigation'
import { AdminShell } from '../../components/admin/AdminShell'
import { getCurrentUser } from '../../lib/api'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'superadmin') {
    redirect('/auth/login')
  }

  return <AdminShell>{children}</AdminShell>
}
