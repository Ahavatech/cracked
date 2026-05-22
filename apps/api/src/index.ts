import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { getRuntimeEnv } from './config/env'
import { authRouter } from './routes/auth'
import { adminClientsRouter } from './routes/clients'
import { adminContactRouter, contactRouter } from './routes/contact'
import { dashboardRouter } from './routes/dashboard'
import { adminMembersRouter, membersRouter } from './routes/members'
import { adminPortfolioRouter, portfolioRouter } from './routes/portfolio'
import { adminReviewsRouter, reviewsRouter } from './routes/reviews'

const env = getRuntimeEnv()
const app = express()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false
})

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(
  cors({
    origin: env.webUrl,
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authLimiter, authRouter)
app.use('/api/members', membersRouter)
app.use('/api/admin/members', adminMembersRouter)
app.use('/api/admin/clients', adminClientsRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/admin/reviews', adminReviewsRouter)
app.use('/api/portfolio', portfolioRouter)
app.use('/api/admin/portfolio', adminPortfolioRouter)
app.use('/api/contact', contactLimiter, contactRouter)
app.use('/api/admin/contact-submissions', adminContactRouter)
app.use('/api/admin', dashboardRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Unexpected server error.' })
})

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Cracked.dev API listening on http://localhost:${env.port}`)
})
