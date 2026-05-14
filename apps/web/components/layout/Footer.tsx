import Link from 'next/link'
import { FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi'
import { SiAirbrake } from 'react-icons/si'
import { Button } from '../ui/Button'

const quickLinks = [
  { href: '/#about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/reviews', label: 'Reviews' }
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <form className="footer-subscribe">
            <input aria-label="Email address" placeholder="Email Address" type="email" />
            <Button type="submit">Subscribe</Button>
          </form>
          <div>
            <h3 className="footer-title">Quick Link</h3>
            <ul className="footer-list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="footer-title">Get In Touch</h3>
            <ul className="footer-list">
              <li>Cracked.dev@yahoo.com</li>
              <li>55 Fajuyi Str., Awolowo Hall Obafemi Awolowo University</li>
              <li>Ile-Ife</li>
            </ul>
          </div>
          <div className="social-row">
            <Link href="https://instagram.com" aria-label="Instagram">
              <FiInstagram />
            </Link>
            <Link href="https://linkedin.com" aria-label="LinkedIn">
              <FiLinkedin />
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter">
              <FiTwitter />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <Link href="/" className="logo">
            <span className="logo-mark">
              <SiAirbrake />
            </span>
            <span>Cracked.dev</span>
          </Link>
          <span>Copyright @2026 Cracked.dev All rights Reserved</span>
          <span />
        </div>
      </div>
    </footer>
  )
}
