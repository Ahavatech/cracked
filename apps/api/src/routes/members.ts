import { Router } from 'express'
import { z } from 'zod'
import { pool, query } from '../db/pool'
import { requireAuth } from '../middleware/auth'
import { requireRole } from '../middleware/role'
import { sendSetupEmail } from '../services/email'
import { createToken, slugify } from '../utils/tokens'

export const membersRouter = Router()
export const adminMembersRouter = Router()

const memberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role_title: z.string().min(2),
  bio: z.string().optional().default(''),
  avatar_url: z.string().url().optional().or(z.literal('')).default(''),
  social_links: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      dribbble: z.string().optional()
    })
    .optional()
    .default({}),
  skills: z.array(z.string()).optional().default([]),
  display_order: z.coerce.number().int().optional().default(0),
  is_visible: z.boolean().optional().default(true)
})

const updateMemberSchema = memberSchema.partial().omit({ email: true }).extend({
  email: z.string().email().optional()
})

membersRouter.get('/', async (_req, res) => {
  const result = await query(`
    SELECT team_members.*, users.email, users.is_active
    FROM team_members
    LEFT JOIN users ON users.id = team_members.user_id
    WHERE team_members.is_visible = TRUE
    ORDER BY team_members.display_order ASC, team_members.created_at ASC
  `)
  res.json({ members: result.rows })
})

membersRouter.get('/:slug', async (req, res) => {
  const result = await query(
    `
    SELECT team_members.*, users.email, users.is_active
    FROM team_members
    LEFT JOIN users ON users.id = team_members.user_id
    WHERE team_members.slug = $1 AND team_members.is_visible = TRUE
    `,
    [req.params.slug]
  )

  if (!result.rowCount) {
    res.status(404).json({ error: 'Team member not found.' })
    return
  }

  res.json({ member: result.rows[0] })
})

adminMembersRouter.use(requireAuth, requireRole('superadmin'))

adminMembersRouter.get('/', async (_req, res) => {
  const result = await query(`
    SELECT team_members.*, users.email, users.is_active
    FROM team_members
    LEFT JOIN users ON users.id = team_members.user_id
    ORDER BY team_members.display_order ASC, team_members.created_at ASC
  `)
  res.json({ members: result.rows })
})

adminMembersRouter.post('/', async (req, res) => {
  const parsed = memberSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid member payload.', issues: parsed.error.flatten() })
    return
  }

  const data = parsed.data
  const client = await pool.connect()
  const setupToken = createToken()
  const baseSlug = slugify(data.name)

  try {
    await client.query('BEGIN')
    const userResult = await client.query<{ id: string }>(
      `
      INSERT INTO users (email, role, setup_token, token_expires, is_active)
      VALUES ($1, 'member', $2, NOW() + INTERVAL '48 hours', FALSE)
      RETURNING id
      `,
      [data.email, setupToken]
    )

    let slug = baseSlug
    let suffix = 1
    while (true) {
      const existing = await client.query('SELECT id FROM team_members WHERE slug = $1', [slug])
      if (!existing.rowCount) break
      suffix += 1
      slug = `${baseSlug}-${suffix}`
    }

    const memberResult = await client.query(
      `
      INSERT INTO team_members
        (user_id, name, role_title, bio, avatar_url, slug, social_links, skills, display_order, is_visible)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        userResult.rows[0].id,
        data.name,
        data.role_title,
        data.bio,
        data.avatar_url || null,
        slug,
        JSON.stringify(data.social_links),
        JSON.stringify(data.skills),
        data.display_order,
        data.is_visible
      ]
    )
    await client.query('COMMIT')
    await sendSetupEmail(data.email, setupToken, 'member')
    res.status(201).json({ member: memberResult.rows[0] })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to create member.' })
  } finally {
    client.release()
  }
})

adminMembersRouter.patch('/:id', async (req, res) => {
  const parsed = updateMemberSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid member payload.', issues: parsed.error.flatten() })
    return
  }

  const data = parsed.data
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const current = await client.query<{ user_id: string }>('SELECT user_id FROM team_members WHERE id = $1', [
      req.params.id
    ])
    if (!current.rowCount) {
      await client.query('ROLLBACK')
      res.status(404).json({ error: 'Team member not found.' })
      return
    }

    if (data.email) {
      await client.query('UPDATE users SET email = $1 WHERE id = $2', [data.email, current.rows[0].user_id])
    }

    const result = await client.query(
      `
      UPDATE team_members
      SET
        name = COALESCE($1, name),
        role_title = COALESCE($2, role_title),
        bio = COALESCE($3, bio),
        avatar_url = COALESCE($4, avatar_url),
        social_links = COALESCE($5::jsonb, social_links),
        skills = COALESCE($6::jsonb, skills),
        display_order = COALESCE($7, display_order),
        is_visible = COALESCE($8, is_visible)
      WHERE id = $9
      RETURNING *
      `,
      [
        data.name,
        data.role_title,
        data.bio,
        data.avatar_url,
        data.social_links ? JSON.stringify(data.social_links) : null,
        data.skills ? JSON.stringify(data.skills) : null,
        data.display_order,
        data.is_visible,
        req.params.id
      ]
    )
    await client.query('COMMIT')
    res.json({ member: result.rows[0] })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to update member.' })
  } finally {
    client.release()
  }
})

adminMembersRouter.delete('/:id', async (req, res) => {
  await query('UPDATE team_members SET is_visible = FALSE WHERE id = $1', [req.params.id])
  res.json({ ok: true })
})

adminMembersRouter.post('/:id/resend-invite', async (req, res) => {
  const token = createToken()
  const result = await query<{ email: string }>(
    `
    UPDATE users
    SET setup_token = $1, token_expires = NOW() + INTERVAL '48 hours'
    FROM team_members
    WHERE team_members.user_id = users.id AND team_members.id = $2
    RETURNING users.email
    `,
    [token, req.params.id]
  )

  if (!result.rowCount) {
    res.status(404).json({ error: 'Team member not found.' })
    return
  }

  await sendSetupEmail(result.rows[0].email, token, 'member')
  res.json({ ok: true })
})
