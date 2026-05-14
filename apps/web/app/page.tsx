import { PublicLayout } from '../components/layout/PublicLayout'
import { About } from '../components/sections/About'
import { ContactSection } from '../components/sections/ContactSection'
import { CTABanner } from '../components/sections/CTABanner'
import { Hero } from '../components/sections/Hero'
import { PortfolioSection } from '../components/sections/PortfolioSection'
import { TeamSection } from '../components/sections/TeamSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { getMembers, getProjects, getReviews } from '../lib/api'

export default async function HomePage() {
  const [members, reviews, projects] = await Promise.all([getMembers(), getReviews(), getProjects()])

  return (
    <PublicLayout>
      <Hero />
      <About />
      <TeamSection members={members} />
      <TestimonialsSection reviews={reviews} />
      <PortfolioSection projects={projects} />
      <CTABanner />
      <ContactSection />
    </PublicLayout>
  )
}
