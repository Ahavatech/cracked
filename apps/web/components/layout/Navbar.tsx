'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import { SiAirbrake } from 'react-icons/si'
import { clientFetch } from '../../lib/client-api'
import type { AuthUser } from '../../lib/types'
import { Button } from '../ui/Button'

const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/reviews', label: 'Reviews' }
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    clientFetch<{ user: AuthUser }>('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => undefined)
  }, [])

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="logo" aria-label="Cracked.dev home">
            <span className="logo-mark">
              <SiAirbrake />
            </span>
            <span>Cracked.dev</span>
          </Link>
          <nav className="nav-links" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            {user ? <Link href="/admin">Dashboard</Link> : null}
          </nav>
          <div className="navbar-actions">
            <Button href="/#contact">Book us</Button>
            <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)}>
              <FiMenu />
              <span>Menu</span>
            </button>
          </div>
        </div>
        {open ? (
          <nav className="mobile-menu" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link href="/admin" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            ) : null}
            <Button href="/#contact">Book us</Button>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
