'use client'

import { useMemo, useState } from 'react'
import type { PortfolioProject } from '../../lib/types'
import { Badge } from '../ui/Badge'
import { PortfolioCard } from './PortfolioCard'

export function PortfolioPageClient({ projects }: { projects: PortfolioProject[] }) {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((project) => project.category || 'Web Design')))],
    [projects]
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const visibleProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => (project.category || 'Web Design') === activeCategory)

  return (
    <>
      <section className="page-hero">
        <div className="container section-header">
          <Badge>Portfolio</Badge>
          <h1 className="section-title">Full Portfolio</h1>
          <p className="section-copy">Browse selected launches, identities, and product experiences.</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container">
          <div className="filter-row">
            {categories.map((category) => (
              <button
                className={`filter-pill ${activeCategory === category ? 'active' : ''}`}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="portfolio-grid">
            {visibleProjects.map((project) => (
              <PortfolioCard project={project} key={project.id} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
