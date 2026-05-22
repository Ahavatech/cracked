'use client'

import { useEffect } from 'react'
import { API_URL } from '../../lib/client-api'

export function BackendWarmup() {
  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)

    fetch(`${API_URL}/api/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    }).catch(() => undefined)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return null
}
