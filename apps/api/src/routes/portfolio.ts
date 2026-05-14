import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db/pool'
import { requireAuth } from '../middleware/auth'
import { requireRole } from '../middleware/role'

export const portfolioRouter = Router()
export const adminPortfolioRouter = Router()

const projectSchema = z.object({
  title: z.string().min(2),
  category: z.string().optional().default('Web Design'),
  description: z.string().optional().default(''),
  cover_url: z.string().url().optional().or(z.literal('')).default(''),
  project_url: z.string().url().optional().or(z.literal('')).default(''),
  display_order: z.coerce.number().int().optional().default(0),
  is_visible: z.boolean().optional().default(true)
})

portfolioRouter.get('/', async (_req, res) => {
  const result = await query(`
    SELECT *
    FROM portfolio_projects
    WHERE is_visible = TRUE
    ORDER BY display_order ASC, created_at DESC
  `)
  res.json({ projects: result.rows })
})

adminPortfolioRouter.use(requireAuth, requireRole('superadmin'))

adminPortfolioRouter.get('/', async (_req, res) => {
  const result = await query('SELECT * FROM portfolio_projects ORDER BY display_order ASC, created_at DESC')
  res.json({ projects: result.rows })
})

adminPortfolioRouter.post('/', async (req, res) => {
  const parsed = projectSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid project payload.', issues: parsed.error.flatten() })
    return
  }

  const data = parsed.data
  const result = await query(
    `
    INSERT INTO portfolio_projects
      (title, category, description, cover_url, project_url, display_order, is_visible)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      data.title,
      data.category,
      data.description,
      data.cover_url || null,
      data.project_url || null,
      data.display_order,
      data.is_visible
    ]
  )
  res.status(201).json({ project: result.rows[0] })
})

adminPortfolioRouter.patch('/reorder', async (req, res) => {
  const parsed = z.array(z.object({ id: z.string().uuid(), display_order: z.number().int() })).safeParse(req.body.items)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid reorder payload.' })
    return
  }

  for (const item of parsed.data) {
    await query('UPDATE portfolio_projects SET display_order = $1 WHERE id = $2', [item.display_order, item.id])
  }

  res.json({ ok: true })
})

adminPortfolioRouter.patch('/:id', async (req, res) => {
  const parsed = projectSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid project payload.', issues: parsed.error.flatten() })
    return
  }

  const data = parsed.data
  const result = await query(
    `
    UPDATE portfolio_projects
    SET
      title = COALESCE($1, title),
      category = COALESCE($2, category),
      description = COALESCE($3, description),
      cover_url = COALESCE($4, cover_url),
      project_url = COALESCE($5, project_url),
      display_order = COALESCE($6, display_order),
      is_visible = COALESCE($7, is_visible)
    WHERE id = $8
    RETURNING *
    `,
    [
      data.title,
      data.category,
      data.description,
      data.cover_url,
      data.project_url,
      data.display_order,
      data.is_visible,
      req.params.id
    ]
  )

  if (!result.rowCount) {
    res.status(404).json({ error: 'Project not found.' })
    return
  }

  res.json({ project: result.rows[0] })
})

adminPortfolioRouter.delete('/:id', async (req, res) => {
  await query('UPDATE portfolio_projects SET is_visible = FALSE WHERE id = $1', [req.params.id])
  res.json({ ok: true })
})
