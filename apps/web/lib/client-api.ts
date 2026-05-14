import type {
  Client,
  ContactSubmission,
  DashboardStats,
  PortfolioProject,
  Review,
  TeamMember
} from './types'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function clientFetch<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  })

  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error(data.error || 'Request failed.')
  }

  return data
}

export type AdminMembersResponse = { members: TeamMember[] }
export type AdminClientsResponse = { clients: Client[] }
export type AdminProjectsResponse = { projects: PortfolioProject[] }
export type AdminReviewsResponse = { reviews: Review[] }
export type ContactSubmissionsResponse = { submissions: ContactSubmission[] }
export type StatsResponse = { stats: DashboardStats }
