import type { IconType } from 'react-icons'
import { FiBarChart2, FiCheck, FiCode, FiCpu, FiPenTool, FiSearch, FiSettings } from 'react-icons/fi'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { CTABanner } from '../../components/sections/CTABanner'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

const services: Array<[string, string, IconType]> = [
  ['UI/UX Design', 'Interfaces shaped around clarity, conversion, and usable product flows.', FiPenTool],
  ['Web Development', 'Responsive Next.js and full-stack builds with reliable delivery practices.', FiCode],
  ['Brand Identity', 'Visual systems and messaging that make the business easier to remember.', FiCpu],
  ['SaaS Platforms', 'Product architecture, dashboards, and flows built for subscription products.', FiBarChart2],
  ['SEO & Performance', 'Technical foundations that make pages fast, crawlable, and measurable.', FiSearch],
  ['Maintenance & Support', 'Ongoing improvements, fixes, performance reviews, and launch support.', FiSettings]
]

const tiers: Array<[string, string, string[]]> = [
  ['Starter', '$1.5k', ['Landing page', 'Core brand polish', 'Contact flow', 'Launch support']],
  ['Growth', '$4k', ['Multi-page website', 'CMS-ready structure', 'Conversion copy support', 'Analytics setup']],
  ['Enterprise', 'Custom', ['SaaS platform', 'Admin workflows', 'Integrations', 'Ongoing support']]
]

export default function ServicesPage() {
  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container section-header">
          <Badge>Services</Badge>
          <h1 className="section-title">Our Services</h1>
          <p className="section-copy">
            Strategy, design, and engineering for teams that need a sharper digital product and a cleaner launch path.
          </p>
          <Button href="/#contact">Start a Project</Button>
        </div>
      </section>
      <section className="section section-white">
        <div className="container services-grid">
          {services.map(([name, description, Icon]) => (
            <Card className="service-card" key={name}>
              <div className="service-icon">
                <Icon />
              </div>
              <h2>{name}</h2>
              <p className="section-copy">{description}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <Badge>Pricing</Badge>
            <h2 className="section-title">Choose the Right Build Path</h2>
          </div>
          <div className="pricing-grid">
            {tiers.map(([name, price, features]) => (
              <Card className={`pricing-card ${name === 'Growth' ? 'highlight' : ''}`} key={name}>
                <h3>{name}</h3>
                <div className="price">{price}</div>
                <ul className="feature-list">
                  {features.map((feature) => (
                    <li key={feature}>
                      <FiCheck /> {feature}
                    </li>
                  ))}
                </ul>
                <Button href="/#contact" variant={name === 'Growth' ? 'ghostLight' : 'primary'}>
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <CTABanner />
    </PublicLayout>
  )
}
