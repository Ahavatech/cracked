import jwt from 'jsonwebtoken'
import { getRuntimeEnv } from '../config/env'

export type AuthRole = 'superadmin' | 'member' | 'client'

export type AuthUser = {
  userId: string
  role: AuthRole
  accountType: 'user' | 'client'
}

const env = getRuntimeEnv()

export function signAccessToken(user: AuthUser) {
  return jwt.sign(user, env.jwtSecret, { expiresIn: '8h' })
}

export function verifyAccessToken(token: string): AuthUser {
  return jwt.verify(token, env.jwtSecret) as AuthUser
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.nodeEnv === 'production',
    domain: env.cookieDomain || undefined,
    maxAge: 8 * 60 * 60 * 1000
  }
}
