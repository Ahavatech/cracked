import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db/pool'
import { requireAuth } from '../middleware/auth'
import { requireRole } from '../middleware/role'

export const reviewsRouter = Router()
export const adminReviewsRouter = Router()

const reviewSchema = z.object({
  rt: z.string().optional(),
  content: z.string().min(10),
  rating: z.coerce.number().int().min(1).max(5)
})

reviewsRouter.get('/', async (_req, res) => {
  const result = await query(`
    SELECT id, author_name, company, content, rating, created_at
    FROM reviews
    WHERE is_approved = TRUE
    ORDER BY created_at DESC
  `)
  res.json({ reviews: result.rows })
})

reviewsRouter.get('/verify-token', async (req, res) => {
  const token = String(req.query.rt || '')
  if (!token) {
    res.status(400).json({ valid: false, error: 'Review token is required.' })
    return
  }

  const result = await query<{ contact_name: string; company_name: string }>(
    `
    SELECT contact_name, company_name
    FROM clients
    WHERE review_token = $1 AND review_token_expires > NOW()
    `,
    [token]
  )

  if (!result.rowCount) {
    res.status(404).json({ valid: false, error: 'This review link is invalid or has expired.' })
    return
  }

  res.json({ valid: true, client: result.rows[0] })
})

reviewsRouter.post('/', async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Review text and a 1-5 rating are required.', issues: parsed.error.flatten() })
    return
  }

  const { rt, content, rating } = parsed.data
  let clientId: string | undefined

  if (rt) {
    const client = await query<{ id: string; contact_name: string; company_name: string }>(
      `
      SELECT id, contact_name, company_name
      FROM clients
      WHERE review_token = $1 AND review_token_expires > NOW()
      `,
      [rt]
    )

    if (!client.rowCount) {
      res.status(400).json({ error: 'This review link is invalid or has expired.' })
      return
    }

    clientId = client.rows[0].id
    const review = await query(
      `
      INSERT INTO reviews (client_id, author_name, company, content, rating, is_approved)
      VALUES ($1, $2, $3, $4, $5, FALSE)
      RETURNING *
      `,
      [clientId, client.rows[0].contact_name, client.rows[0].company_name, content, rating]
    )
    await query('UPDATE clients SET review_token = NULL, review_token_expires = NULL WHERE id = $1', [clientId])
    res.status(201).json({ review: review.rows[0] })
    return
  }

  const token = req.cookies?.token
  if (!token) {
    res.status(401).json({ error: 'A review invite or client session is required.' })
    return
  }

  requireAuth(req, res, async () => {
    if (!req.user || req.user.role !== 'client') {
      res.status(403).json({ error: 'Only clients can submit reviews.' })
      return
    }

    const client = await query<{ id: string; contact_name: string; company_name: string }>(
      'SELECT id, contact_name, company_name FROM clients WHERE id = $1',
      [req.user.userId]
    )

    if (!client.rowCount) {
      res.status(404).json({ error: 'Client not found.' })
      return
    }

    const review = await query(
      `
      INSERT INTO reviews (client_id, author_name, company, content, rating, is_approved)
      VALUES ($1, $2, $3, $4, $5, FALSE)
      RETURNING *
      `,
      [client.rows[0].id, client.rows[0].contact_name, client.rows[0].company_name, content, rating]
    )
    res.status(201).json({ review: review.rows[0] })
  })
})

adminReviewsRouter.use(requireAuth, requireRole('superadmin'))

adminReviewsRouter.get('/', async (_req, res) => {
  const result = await query(`
    SELECT reviews.*, clients.email
    FROM reviews
    LEFT JOIN clients ON clients.id = reviews.client_id
    ORDER BY reviews.created_at DESC
  `)
  res.json({ reviews: result.rows })
})

adminReviewsRouter.patch('/:id/approve', async (req, res) => {
  const result = await query('UPDATE reviews SET is_approved = TRUE WHERE id = $1 RETURNING *', [req.params.id])
  if (!result.rowCount) {
    res.status(404).json({ error: 'Review not found.' })
    return
  }
  res.json({ review: result.rows[0] })
})

adminReviewsRouter.patch('/:id/reject', async (req, res) => {
  const result = await query('UPDATE reviews SET is_approved = FALSE WHERE id = $1 RETURNING *', [req.params.id])
  if (!result.rowCount) {
    res.status(404).json({ error: 'Review not found.' })
    return
  }
  res.json({ review: result.rows[0] })
})

adminReviewsRouter.delete('/:id', async (req, res) => {
  await query('DELETE FROM reviews WHERE id = $1', [req.params.id])
  res.json({ ok: true })
})
