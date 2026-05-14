import type { PortfolioProject, Review, TeamMember } from './types'

export const placeholderMembers: TeamMember[] = [
  {
    id: 'bidemi-olaoba',
    name: 'Bidemi Olaoba',
    role_title: 'UI/UX Designer',
    bio: 'Designing intuitive, user-centered experiences for ambitious teams.',
    slug: 'bidemi-olaoba',
    social_links: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com'
    },
    skills: ['Product Strategy', 'UX Systems', 'Visual Design']
  },
  {
    id: 'ibrahim-ade',
    name: 'Ibrahim Ade',
    role_title: 'Frontend Engineer',
    bio: 'Building fast, accessible interfaces with measurable business impact.',
    slug: 'ibrahim-ade',
    social_links: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com'
    },
    skills: ['Next.js', 'Accessibility', 'Performance']
  },
  {
    id: 'amara-nweke',
    name: 'Amara Nweke',
    role_title: 'Brand Strategist',
    bio: 'Turning fuzzy positioning into clear identities and conversion paths.',
    slug: 'amara-nweke',
    social_links: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com'
    },
    skills: ['Brand Systems', 'Messaging', 'Launch Strategy']
  },
  {
    id: 'daniel-okon',
    name: 'Daniel Okon',
    role_title: 'Full-Stack Developer',
    bio: 'Shipping durable web platforms from database to polished interface.',
    slug: 'daniel-okon',
    social_links: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com'
    },
    skills: ['PostgreSQL', 'APIs', 'SaaS Platforms']
  }
]

export const placeholderReviews: Review[] = [
  {
    id: 'review-1',
    author_name: 'Ibrahim J.',
    company: 'Digital Company',
    content: 'Our business thrived thanks to cracked.dev. Innovative strategies and creative solutions.',
    rating: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'review-2',
    author_name: 'Tomi A.',
    company: 'Ajicore',
    content: 'The team translated our product story into a sharper website and helped us launch faster.',
    rating: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'review-3',
    author_name: 'Mariam K.',
    company: 'SaaS Founder',
    content: 'Every section had a purpose. The final build felt premium and easy for customers to understand.',
    rating: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'review-4',
    author_name: 'David O.',
    company: 'B2B Studio',
    content: 'Clear process, strong visuals, and clean execution from strategy through delivery.',
    rating: 5,
    created_at: new Date().toISOString()
  }
]

export const placeholderProjects: PortfolioProject[] = [
  {
    id: 'ajicore',
    title: 'Ajicore - B2B SaaS Website',
    category: 'B2B SaaS Website',
    description: 'A conversion-focused SaaS website designed for clarity, speed, and trust.',
    project_url: 'https://example.com',
    display_order: 0
  },
  {
    id: 'brandflow',
    title: 'Brandflow Identity System',
    category: 'Branding',
    description: 'A scalable identity system for a product-led team entering a crowded market.',
    project_url: 'https://example.com',
    display_order: 1
  },
  {
    id: 'marketpulse',
    title: 'MarketPulse Web Platform',
    category: 'SaaS',
    description: 'A polished analytics platform with a responsive marketing and onboarding flow.',
    project_url: 'https://example.com',
    display_order: 2
  }
]
