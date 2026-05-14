'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SiAirbrake } from 'react-icons/si'
import { logout } from '../../lib/auth'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/members', label: 'Members' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/portfolio', label: 'Portfolio' },
  { href: '/admin/reviews', label: 'Reviews' }
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function onLogout() {
    await logout().catch(() => undefined)
    router.push('/auth/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/" className="logo">
          <span className="logo-mark">
            <SiAirbrake />
          </span>
          <span>Cracked.dev</span>
        </Link>
        <nav className="admin-nav">
          {links.map((link) => (
            <Link className={pathname === link.href ? 'active' : ''} href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
