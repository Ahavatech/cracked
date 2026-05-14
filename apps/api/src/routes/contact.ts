import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db/pool'
import { requireAuth } from '../middleware/auth'
import { requireRole } from '../middleware/role'
import { sendContactNotification } from '../services/email'

export const contactRouter = Router()
export const adminContactRouter = Router()

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional().default(''),
  message: z.string().min(10)
})

contactRouter.post('/', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Name, email, and a message are required.', issues: parsed.error.flatten() })
    return
  }

  const data = parsed.data
  const result = await query(
    `
    INSERT INTO contact_submissions (name, email, subject, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [data.name, data.email, data.subject || null, data.message]
  )

  await sendContactNotification({
    name: data.name,
    email: data.email,
    subject: data.subject,
    body: data.message
  }).catch(() => undefined)

  res.status(201).json({ submission: result.rows[0] })
})

adminContactRouter.use(requireAuth, requireRole('superadmin'))

adminContactRouter.get('/', async (_req, res) => {
  const result = await query('SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 25')
  res.json({ submissions: result.rows })
})
