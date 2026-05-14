import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db/pool'
import { requireAuth } from '../middleware/auth'
import { requireRole } from '../middleware/role'
import { sendReviewInvite, sendSetupEmail } from '../services/email'
import { createToken } from '../utils/tokens'

export const adminClientsRouter = Router()

const clientSchema = z.object({
  company_name: z.string().min(2),
  contact_name: z.string().min(2),
  email: z.string().email()
})

adminClientsRouter.use(requireAuth, requireRole('superadmin'))

adminClientsRouter.get('/', async (_req, res) => {
  const result = await query(`
    SELECT id, company_name, contact_name, email, is_active, review_token, review_token_expires, created_at
    FROM clients
    ORDER BY created_at DESC
  `)
  res.json({ clients: result.rows })
})

adminClientsRouter.post('/', async (req, res) => {
  const parsed = clientSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid client payload.', issues: parsed.error.flatten() })
    return
  }

  const setupToken = createToken()
  const result = await query(
    `
    INSERT INTO clients (company_name, contact_name, email, setup_token, token_expires, is_active)
    VALUES ($1, $2, $3, $4, NOW() + INTERVAL '48 hours', FALSE)
    RETURNING id, company_name, contact_name, email, is_active, created_at
    `,
    [parsed.data.company_name, parsed.data.contact_name, parsed.data.email, setupToken]
  )

  await sendSetupEmail(parsed.data.email, setupToken, 'client')
  res.status(201).json({ client: result.rows[0] })
})

adminClientsRouter.patch('/:id', async (req, res) => {
  const parsed = clientSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid client payload.', issues: parsed.error.flatten() })
    return
  }

  const data = parsed.data
  const result = await query(
    `
    UPDATE clients
    SET
      company_name = COALESCE($1, company_name),
      contact_name = COALESCE($2, contact_name),
      email = COALESCE($3, email)
    WHERE id = $4
    RETURNING id, company_name, contact_name, email, is_active, created_at
    `,
    [data.company_name, data.contact_name, data.email, req.params.id]
  )

  if (!result.rowCount) {
    res.status(404).json({ error: 'Client not found.' })
    return
  }

  res.json({ client: result.rows[0] })
})

adminClientsRouter.delete('/:id', async (req, res) => {
  await query('DELETE FROM clients WHERE id = $1', [req.params.id])
  res.json({ ok: true })
})

adminClientsRouter.post('/:id/resend-invite', async (req, res) => {
  const token = createToken()
  const result = await query<{ email: string }>(
    `
    UPDATE clients
    SET setup_token = $1, token_expires = NOW() + INTERVAL '48 hours'
    WHERE id = $2
    RETURNING email
    `,
    [token, req.params.id]
  )

  if (!result.rowCount) {
    res.status(404).json({ error: 'Client not found.' })
    return
  }

  await sendSetupEmail(result.rows[0].email, token, 'client')
  res.json({ ok: true })
})

adminClientsRouter.post('/:id/review-invite', async (req, res) => {
  const token = createToken()
  const result = await query<{ email: string }>(
    `
    UPDATE clients
    SET review_token = $1, review_token_expires = NOW() + INTERVAL '30 days'
    WHERE id = $2
    RETURNING email
    `,
    [token, req.params.id]
  )

  if (!result.rowCount) {
    res.status(404).json({ error: 'Client not found.' })
    return
  }

  await sendReviewInvite(result.rows[0].email, token)
  res.json({ ok: true })
})
