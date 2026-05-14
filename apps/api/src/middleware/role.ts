import type { NextFunction, Request, Response } from 'express'
import type { AuthRole } from '../utils/jwt'

export function requireRole(role: AuthRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ error: 'Insufficient permissions.' })
      return
    }

    next()
  }
}
