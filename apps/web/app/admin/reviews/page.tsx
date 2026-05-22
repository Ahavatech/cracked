'use client'

import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { clientFetch, type AdminReviewsResponse } from '../../../lib/client-api'
import type { Review } from '../../../lib/types'
import { Card } from '../../../components/ui/Card'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [status, setStatus] = useState('')

  function loadReviews() {
    clientFetch<AdminReviewsResponse>('/api/admin/reviews')
      .then((data) => setReviews(data.reviews))
      .catch((err) => setStatus(err instanceof Error ? err.message : 'Unable to load reviews.'))
  }

  useEffect(loadReviews, [])

  async function approve(id: string) {
    await clientFetch(`/api/admin/reviews/${id}/approve`, { method: 'PATCH' })
    setStatus('Review approved.')
    loadReviews()
  }

  async function reject(id: string) {
    await clientFetch(`/api/admin/reviews/${id}/reject`, { method: 'PATCH' })
    setStatus('Review rejected.')
    loadReviews()
  }

  async function deleteReview(id: string) {
    await clientFetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    setStatus('Review deleted.')
    loadReviews()
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="admin-title">Reviews</h1>
      </div>
      {status ? <div className="status-message status-success">{status}</div> : null}
      <Card className="admin-panel">
        <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Company</th>
              <th>Rating</th>
              <th>Excerpt</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.author_name}</td>
                <td>{review.company}</td>
                <td>
                  <span className="stars">
                    {Array.from({ length: review.rating || 5 }).map((_, index) => (
                      <FaStar key={index} />
                    ))}
                  </span>
                </td>
                <td>{review.content.slice(0, 120)}</td>
                <td>{review.is_approved ? 'Approved' : 'Pending'}</td>
                <td>
                  <div className="actions">
                    <button className="small-btn" type="button" onClick={() => approve(review.id)}>
                      Approve
                    </button>
                    <button className="small-btn" type="button" onClick={() => reject(review.id)}>
                      Reject
                    </button>
                    <button className="small-btn danger" type="button" onClick={() => deleteReview(review.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </>
  )
}
