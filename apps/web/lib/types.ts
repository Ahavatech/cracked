export type SocialLinks = {
  twitter?: string
  linkedin?: string
  dribbble?: string
}

export type TeamMember = {
  id: string
  user_id?: string
  email?: string
  name: string
  role_title: string
  bio?: string
  avatar_url?: string
  slug: string
  social_links?: SocialLinks
  skills?: string[]
  display_order?: number
  is_visible?: boolean
  is_active?: boolean
}

export type Review = {
  id: string
  client_id?: string
  author_name: string
  company?: string
  content: string
  rating: number
  is_approved?: boolean
  created_at: string
}

export type PortfolioProject = {
  id: string
  title: string
  category?: string
  description?: string
  cover_url?: string
  project_url?: string
  display_order?: number
  is_visible?: boolean
  created_at?: string
}

export type Client = {
  id: string
  company_name: string
  contact_name: string
  email: string
  is_active: boolean
  review_token?: string | null
  review_token_expires?: string | null
  created_at?: string
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  created_at: string
}

export type DashboardStats = {
  members: number
  clients: number
  pendingReviews: number
  projects: number
}

export type AuthUser = {
  id: string
  userId?: string
  email: string
  role: 'superadmin' | 'member' | 'client'
  accountType: 'user' | 'client'
  slug?: string | null
}
