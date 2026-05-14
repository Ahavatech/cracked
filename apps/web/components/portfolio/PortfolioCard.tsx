import { FiExternalLink } from 'react-icons/fi'
import type { PortfolioProject } from '../../lib/types'
import { Button } from '../ui/Button'

export function PortfolioCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="portfolio-card">
      <div className="portfolio-cover">
        <span className="mockup-label">MacBook Air</span>
      </div>
      <div className="portfolio-body">
        <span className="category-pill">{project.category || 'Web Design'}</span>
        <h3>{project.title}</h3>
        <p>{project.description || 'A strategic digital experience crafted for measurable outcomes.'}</p>
        <Button href={project.project_url || '/portfolio'}>
          Open Project <FiExternalLink />
        </Button>
      </div>
    </article>
  )
}
