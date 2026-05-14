'use client'

import { FormEvent, useEffect, useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { clientFetch } from '../../lib/client-api'
import type { Review } from '../../lib/types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ReviewCard } from './ReviewCard'

type Props = {
  initialReviews: Review[]
  reviewToken?: string
}

type VerifyState =
  | { status: 'idle' | 'loading' }
  | { status: 'valid'; client: { contact_name: string; company_name: string } }
  | { status: 'invalid'; message: string }
  | { status: 'submitted' }

export function ReviewsPageClient({ initialReviews, reviewToken }: Props) {
  const [verifyState, setVerifyState] = useState<VerifyState>({ status: reviewToken ? 'loading' : 'idle' })
  const [rating, setRating] = useState(5)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!reviewToken) return

    clientFetch<{ valid: boolean; client: { contact_name: string; company_name: string } }>(
      `/api/reviews/verify-token?rt=${encodeURIComponent(reviewToken)}`
    )
      .then((data) => setVerifyState({ status: 'valid', client: data.client }))
      .catch((err) => setVerifyState({ status: 'invalid', message: err instanceof Error ? err.message : 'Invalid link.' }))
  }, [reviewToken])

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)

    try {
      await clientFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          rt: reviewToken,
          rating,
          content: form.get('content')
        })
      })
      setVerifyState({ status: 'submitted' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit review.')
    }
  }

  if (reviewToken) {
    return (
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <Badge>Reviews</Badge>
            <h1 className="section-title">Share Your Experience</h1>
            <p className="section-copy">Your feedback helps future clients understand what it is like to work with us.</p>
          </div>
          {verifyState.status === 'loading' ? <Card className="contact-form">Verifying review link...</Card> : null}
          {verifyState.status === 'invalid' ? (
            <Card className="contact-form">
              <div className="status-message status-error">{verifyState.message}</div>
            </Card>
          ) : null}
          {verifyState.status === 'submitted' ? (
            <Card className="contact-form">
              <div className="status-message status-success">Thank you. Your review is pending approval.</div>
            </Card>
          ) : null}
          {verifyState.status === 'valid' ? (
            <Card className="contact-form">
              <form className="form-grid" onSubmit={submitReview}>
                <p>
                  Writing as {verifyState.client.contact_name} from {verifyState.client.company_name}
                </p>
                <div className="stars" aria-label="Choose star rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button className="small-btn" key={star} type="button" onClick={() => setRating(star)}>
                      {star <= rating ? <FaStar /> : <FaRegStar />}
                    </button>
                  ))}
                </div>
                <label className="form-grid">
                  <span>Review</span>
                  <textarea className="textarea" name="content" required minLength={10} />
                </label>
                {error ? <div className="status-message status-error">{error}</div> : null}
                <Button type="submit">Submit Review</Button>
              </form>
            </Card>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container section-header">
          <Badge>Reviews</Badge>
          <h1 className="section-title">What Our Clients Say</h1>
          <p className="section-copy">Real feedback from teams who trusted Cracked.dev with their digital presence.</p>
        </div>
      </section>
      <section className="section section-white">
        <div className="container review-grid">
          {initialReviews.map((review) => (
            <ReviewCard review={review} light key={review.id} />
          ))}
        </div>
      </section>
    </>
  )
}
