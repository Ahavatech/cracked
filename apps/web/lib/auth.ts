import { clientFetch } from './client-api'
import type { AuthUser } from './types'

export async function login(email: string, password: string) {
  return clientFetch<{ user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export async function logout() {
  return clientFetch<{ ok: boolean }>('/api/auth/logout', {
    method: 'POST'
  })
}
