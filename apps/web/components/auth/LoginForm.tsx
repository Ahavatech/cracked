'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { login } from '../../lib/auth'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)

    try {
      const { user } = await login(String(form.get('email')), String(form.get('password')))
      const requested = searchParams.get('next')
      if (user.role === 'superadmin') {
        router.push(requested || '/admin')
      } else if (user.role === 'member' && user.slug) {
        router.push(`/team/${user.slug}`)
      } else {
        router.push('/reviews')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <Card className="auth-card">
        <Link href="/" className="logo">
          <span className="logo-mark">
            <Image src="/assets/logo-mark.png" alt="" width={44} height={44} />
          </span>
          <span>Cracked.dev</span>
        </Link>
        <h1 className="section-title">Sign in</h1>
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="form-grid">
            <span>Email Address</span>
            <input className="input" name="email" type="email" required />
          </label>
          <label className="form-grid">
            <span>Password</span>
            <input className="input" name="password" type="password" required />
          </label>
          {error ? <div className="status-message status-error">{error}</div> : null}
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </main>
  )
}
