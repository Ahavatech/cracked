import { Router } from 'express'
import { query } from '../db/pool'
import { requireAuth } from '../middleware/auth'
import { requireRole } from '../middleware/role'

export const dashboardRouter = Router()

dashboardRouter.use(requireAuth, requireRole('superadmin'))

dashboardRouter.get('/stats', async (_req, res) => {
  const [members, clients, pendingReviews, projects] = await Promise.all([
    query<{ count: string }>('SELECT COUNT(*) FROM team_members WHERE is_visible = TRUE'),
    query<{ count: string }>('SELECT COUNT(*) FROM clients'),
    query<{ count: string }>('SELECT COUNT(*) FROM reviews WHERE is_approved = FALSE'),
    query<{ count: string }>('SELECT COUNT(*) FROM portfolio_projects WHERE is_visible = TRUE')
  ])

  res.json({
    stats: {
      members: Number(members.rows[0].count),
      clients: Number(clients.rows[0].count),
      pendingReviews: Number(pendingReviews.rows[0].count),
      projects: Number(projects.rows[0].count)
    }
  })
})
