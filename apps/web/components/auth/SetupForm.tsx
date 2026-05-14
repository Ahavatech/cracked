'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { SiAirbrake } from 'react-icons/si'
import { clientFetch } from '../../lib/client-api'
import type { AuthUser } from '../../lib/types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

type VerifyState =
  | { status: 'loading' }
  | { status: 'valid'; email: string }
  | { status: 'invalid'; message: string }

export function SetupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const type = searchParams.get('type') === 'client' ? 'client' : 'member'
  const [verifyState, setVerifyState] = useState<VerifyState>({ status: 'loading' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setVerifyState({ status: 'invalid', message: 'Setup token is missing.' })
      return
    }

    clientFetch<{ valid: boolean; email: string }>(
      `/api/auth/verify-setup-token?token=${encodeURIComponent(token)}&type=${type}`
    )
      .then((data) => setVerifyState({ status: 'valid', email: data.email }))
      .catch((err) => setVerifyState({ status: 'invalid', message: err instanceof Error ? err.message : 'Invalid link.' }))
  }, [token, type])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password'))
    const confirm = String(form.get('confirm'))

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { user } = await clientFetch<{ user: AuthUser }>('/api/auth/setup', {
        method: 'POST',
        body: JSON.stringify({ token, password, type })
      })

      if (user.role === 'superadmin') router.push('/admin')
      else if (user.role === 'member' && user.slug) router.push(`/team/${user.slug}`)
      else router.push('/reviews')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to set password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <Card className="auth-card">
        <Link href="/" className="logo">
          <span className="logo-mark">
            <SiAirbrake />
          </span>
          <span>Cracked.dev</span>
        </Link>
        <h1 className="section-title">Set up account</h1>
        {verifyState.status === 'loading' ? <p>Verifying setup link...</p> : null}
        {verifyState.status === 'invalid' ? (
          <div className="status-message status-error">{verifyState.message}</div>
        ) : null}
        {verifyState.status === 'valid' ? (
          <form className="form-grid" onSubmit={onSubmit}>
            <p className="section-copy">Activating account for {verifyState.email}</p>
            <label className="form-grid">
              <span>Password</span>
              <input className="input" name="password" type="password" minLength={8} required />
            </label>
            <label className="form-grid">
              <span>Confirm Password</span>
              <input className="input" name="confirm" type="password" minLength={8} required />
            </label>
            {error ? <div className="status-message status-error">{error}</div> : null}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Activate Account'}
            </Button>
          </form>
        ) : null}
      </Card>
    </main>
  )
}
