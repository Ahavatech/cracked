import { FaStar } from 'react-icons/fa'
import type { Review } from '../../lib/types'

export function ReviewCard({ review, light = false }: { review: Review; light?: boolean }) {
  const rating = review.rating || 5

  return (
    <article className={`review-card ${light ? 'light' : ''}`}>
      <div className="review-author">
        <div className="review-avatar" aria-hidden="true" />
        <div>
          <strong>{review.author_name}</strong>
          <div className="review-company">{review.company || 'Cracked.dev Client'}</div>
        </div>
      </div>
      <h3>Results-Driven Agency</h3>
      <p>{review.content}</p>
      <div className="stars" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }).map((_, index) => (
          <FaStar key={index} />
        ))}
      </div>
    </article>
  )
}
