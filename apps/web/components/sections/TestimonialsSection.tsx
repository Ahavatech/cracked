import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import type { Review } from '../../lib/types'
import { ReviewCard } from '../reviews/ReviewCard'
import { Badge } from '../ui/Badge'
import { MotionGrid, MotionSection } from '../ui/Motion'

export function TestimonialsSection({ reviews }: { reviews: Review[] }) {
  return (
    <MotionSection className="section section-dark testimonials-section">
      <div className="container testimonials-layout">
        <div className="section-header left testimonials-copy">
          <Badge dark>Testimonials</Badge>
          <h2 className="section-title">What Our Clients Say About Us</h2>
          <p className="section-copy">We pride ourselves on delivering exceptional results, but do not take our word for it.</p>
        </div>
        <MotionGrid className="review-grid">
          {reviews.slice(0, 4).map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </MotionGrid>
        <p className="section-link">
          <Link className="inline-icon-link" href="/reviews">
            See all reviews <FiArrowRight />
          </Link>
        </p>
      </div>
    </MotionSection>
  )
}
