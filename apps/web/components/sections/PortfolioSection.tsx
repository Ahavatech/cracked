import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import type { PortfolioProject } from '../../lib/types'
import { PortfolioCard } from '../portfolio/PortfolioCard'
import { Badge } from '../ui/Badge'
import { MotionGrid, MotionSection } from '../ui/Motion'

export function PortfolioSection({ projects }: { projects: PortfolioProject[] }) {
  return (
    <MotionSection className="section section-light portfolio-section">
      <div className="container">
        <div className="section-header">
          <Badge>Portfolio</Badge>
          <h2 className="section-title">Innovative Solutions Showcase</h2>
          <p className="section-copy">
            Explore our portfolio to see how we have transformed ideas into impactful designs that drive results.
          </p>
        </div>
        <MotionGrid className="portfolio-grid">
          {projects.slice(0, 2).map((project) => (
            <PortfolioCard project={project} key={project.id} />
          ))}
        </MotionGrid>
        <p className="section-link">
          <Link className="inline-icon-link" href="/portfolio">
            View All <FiArrowRight />
          </Link>
        </p>
      </div>
    </MotionSection>
  )
}
