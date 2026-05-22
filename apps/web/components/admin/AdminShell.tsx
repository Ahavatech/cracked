'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FiMenu } from 'react-icons/fi'
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
  const [open, setOpen] = useState(false)

  async function onLogout() {
    await logout().catch(() => undefined)
    router.push('/auth/login')
  }

  return (
    <div className="admin-layout">
      <aside className={open ? 'admin-sidebar admin-sidebar--open' : 'admin-sidebar'}>
        <Link href="/" className="logo">
          <span className="logo-mark">
            <Image src="/assets/logo-mark.png" alt="" width={44} height={44} />
          </span>
          <span>Cracked.dev</span>
        </Link>
        <nav className="admin-nav">
          {links.map((link) => (
            <Link
              className={pathname === link.href ? 'active' : ''}
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </aside>
      {open ? <div className="admin-drawer-backdrop" onClick={() => setOpen(false)} /> : null}
      <main className="admin-main">
        <button
          type="button"
          className="admin-menu-button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu />
          Menu
        </button>
        {children}
      </main>
    </div>
  )
}
