import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/jwt'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.token
  const header = req.header('authorization')
  const bearerToken = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  const token = cookieToken || bearerToken

  if (!token) {
    res.status(401).json({ error: 'Authentication required.' })
    return
  }

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' })
  }
}
