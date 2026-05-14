import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db/pool'
import { requireAuth } from '../middleware/auth'
import { cookieOptions, signAccessToken, type AuthRole } from '../utils/jwt'

export const authRouter = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const setupSchema = z.object({
  token: z.string().min(16),
  password: z.string().min(8),
  type: z.enum(['member', 'client']).default('member')
})

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Email and password are required.' })
    return
  }

  const { email, password } = parsed.data

  const userResult = await query<{
    id: string
    email: string
    password_hash: string | null
    role: AuthRole
    is_active: boolean
    slug: string | null
  }>(
    `
    SELECT users.id, users.email, users.password_hash, users.role, users.is_active, team_members.slug
    FROM users
    LEFT JOIN team_members ON team_members.user_id = users.id
    WHERE users.email = $1
    `,
    [email]
  )

  if (userResult.rowCount) {
    const user = userResult.rows[0]
    const valid = user.password_hash ? await bcrypt.compare(password, user.password_hash) : false
    if (!valid || !user.is_active) {
      res.status(401).json({ error: 'Invalid credentials.' })
      return
    }

    const token = signAccessToken({ userId: user.id, role: user.role, accountType: 'user' })
    res.cookie('token', token, cookieOptions())
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        accountType: 'user',
        slug: user.slug
      }
    })
    return
  }

  const clientResult = await query<{
    id: string
    email: string
    password_hash: string | null
    is_active: boolean
  }>('SELECT id, email, password_hash, is_active FROM clients WHERE email = $1', [email])

  if (!clientResult.rowCount) {
    res.status(401).json({ error: 'Invalid credentials.' })
    return
  }

  const client = clientResult.rows[0]
  const valid = client.password_hash ? await bcrypt.compare(password, client.password_hash) : false
  if (!valid || !client.is_active) {
    res.status(401).json({ error: 'Invalid credentials.' })
    return
  }

  const token = signAccessToken({ userId: client.id, role: 'client', accountType: 'client' })
  res.cookie('token', token, cookieOptions())
  res.json({
    user: {
      id: client.id,
      email: client.email,
      role: 'client',
      accountType: 'client'
    }
  })
})

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('token', cookieOptions())
  res.json({ ok: true })
})

authRouter.get('/me', requireAuth, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' })
    return
  }

  if (req.user.accountType === 'client') {
    const result = await query<{ id: string; email: string; contact_name: string; company_name: string }>(
      'SELECT id, email, contact_name, company_name FROM clients WHERE id = $1',
      [req.user.userId]
    )
    res.json({ user: { ...req.user, ...result.rows[0] } })
    return
  }

  const result = await query<{ id: string; email: string; role: AuthRole; slug: string | null }>(
    `
    SELECT users.id, users.email, users.role, team_members.slug
    FROM users
    LEFT JOIN team_members ON team_members.user_id = users.id
    WHERE users.id = $1
    `,
    [req.user.userId]
  )
  res.json({ user: { ...req.user, ...result.rows[0] } })
})

authRouter.get('/verify-setup-token', async (req, res) => {
  const token = String(req.query.token || '')
  const type = req.query.type === 'client' ? 'client' : 'member'

  if (!token) {
    res.status(400).json({ valid: false, error: 'Token is required.' })
    return
  }

  const table = type === 'client' ? 'clients' : 'users'
  const result = await query<{ email: string }>(
    `SELECT email FROM ${table} WHERE setup_token = $1 AND token_expires > NOW()`,
    [token]
  )

  if (!result.rowCount) {
    res.status(404).json({ valid: false, error: 'This setup link is invalid or expired.' })
    return
  }

  res.json({ valid: true, type, email: result.rows[0].email })
})

authRouter.post('/setup', async (req, res) => {
  const parsed = setupSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'A valid token and password of at least 8 characters are required.' })
    return
  }

  const { token, password, type } = parsed.data
  const passwordHash = await bcrypt.hash(password, 12)

  if (type === 'client') {
    const result = await query<{ id: string; email: string }>(
      `
      UPDATE clients
      SET password_hash = $1, is_active = TRUE, setup_token = NULL, token_expires = NULL
      WHERE setup_token = $2 AND token_expires > NOW()
      RETURNING id, email
      `,
      [passwordHash, token]
    )

    if (!result.rowCount) {
      res.status(400).json({ error: 'This setup link is invalid or expired.' })
      return
    }

    const client = result.rows[0]
    const accessToken = signAccessToken({ userId: client.id, role: 'client', accountType: 'client' })
    res.cookie('token', accessToken, cookieOptions())
    res.json({ user: { ...client, role: 'client', accountType: 'client' } })
    return
  }

  const result = await query<{ id: string; email: string; role: AuthRole; slug: string | null }>(
    `
    UPDATE users
    SET password_hash = $1, is_active = TRUE, setup_token = NULL, token_expires = NULL
    WHERE setup_token = $2 AND token_expires > NOW()
    RETURNING id, email, role
    `,
    [passwordHash, token]
  )

  if (!result.rowCount) {
    res.status(400).json({ error: 'This setup link is invalid or expired.' })
    return
  }

  const user = result.rows[0]
  const profile = await query<{ slug: string }>('SELECT slug FROM team_members WHERE user_id = $1', [user.id])
  const accessToken = signAccessToken({ userId: user.id, role: user.role, accountType: 'user' })
  res.cookie('token', accessToken, cookieOptions())
  res.json({ user: { ...user, slug: profile.rows[0]?.slug || null, accountType: 'user' } })
})
