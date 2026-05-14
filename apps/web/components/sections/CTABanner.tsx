import { Button } from '../ui/Button'
import { MotionSection } from '../ui/Motion'

export function CTABanner() {
  return (
    <MotionSection className="cta-banner">
      <div className="container cta-grid">
        <div className="wire-shapes" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h2>Turn your big idea into a stunning website</h2>
        <div className="cta-actions">
          <Button href="/#contact">Get Started Now</Button>
          <Button href="/services" variant="ghostLight">
            See Pricing
          </Button>
        </div>
      </div>
    </MotionSection>
  )
}
