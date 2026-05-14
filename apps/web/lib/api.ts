import { cookies } from 'next/headers'
import { placeholderMembers, placeholderProjects, placeholderReviews } from './placeholders'
import type {
  AuthUser,
  PortfolioProject,
  Review,
  TeamMember
} from './types'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

type FetchOptions = RequestInit & {
  auth?: boolean
}

async function serverFetch<T>(path: string, options: FetchOptions = {}): Promise<T | null> {
  try {
    const headers = new Headers(options.headers)
    if (options.auth) {
      headers.set('cookie', cookies().toString())
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      cache: 'no-store'
    })

    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function getMembers() {
  const data = await serverFetch<{ members: TeamMember[] }>('/api/members')
  return data?.members?.length ? data.members : placeholderMembers
}

export async function getMember(slug: string) {
  const data = await serverFetch<{ member: TeamMember }>(`/api/members/${slug}`)
  return data?.member || placeholderMembers.find((member) => member.slug === slug) || null
}

export async function getReviews() {
  const data = await serverFetch<{ reviews: Review[] }>('/api/reviews')
  return data?.reviews?.length ? data.reviews : placeholderReviews
}

export async function getProjects() {
  const data = await serverFetch<{ projects: PortfolioProject[] }>('/api/portfolio')
  return data?.projects?.length ? data.projects : placeholderProjects
}

export async function getCurrentUser() {
  const data = await serverFetch<{ user: AuthUser }>('/api/auth/me', { auth: true })
  return data?.user || null
}
