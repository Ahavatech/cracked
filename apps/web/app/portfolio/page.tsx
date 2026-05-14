import { PublicLayout } from '../../components/layout/PublicLayout'
import { PortfolioPageClient } from '../../components/portfolio/PortfolioPageClient'
import { getProjects } from '../../lib/api'

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <PublicLayout>
      <PortfolioPageClient projects={projects} />
    </PublicLayout>
  )
}
