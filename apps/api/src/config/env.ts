import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

export type RuntimeEnv = {
  databaseUrl: string
  jwtSecret: string
  smtpHost?: string
  smtpPort: number
  smtpUser?: string
  smtpPass?: string
  webUrl: string
  cookieDomain?: string
  cookieSameSite: 'strict' | 'lax' | 'none'
  port: number
  nodeEnv: string
}

const envPath = path.resolve(process.cwd(), '.env')

function missingEnvMessage(required: string[]) {
  return [
    'Missing required API environment configuration.',
    '',
    `Expected env file: ${envPath}`,
    '',
    'Create it from the example file:',
    '  Copy-Item apps/api/.env.example apps/api/.env',
    '',
    `Then fill these values: ${required.join(', ')}`,
    '',
    'DATABASE_URL must come from your hosted PostgreSQL provider. This app never generates database credentials.'
  ].join('\n')
}

export function loadEnv(required: string[]): NodeJS.ProcessEnv {
  if (!fs.existsSync(envPath)) {
    const hasProcessEnv = required.every((key) => process.env[key]?.trim())
    if (hasProcessEnv) {
      return process.env
    }

    console.error(missingEnvMessage(required))
    process.exit(1)
  }

  dotenv.config({ path: envPath })

  const missing = required.filter((key) => !process.env[key]?.trim())
  if (missing.length > 0) {
    console.error(missingEnvMessage(missing))
    process.exit(1)
  }

  return process.env
}

export function getRuntimeEnv(): RuntimeEnv {
  const env = loadEnv(['DATABASE_URL', 'JWT_SECRET', 'WEB_URL'])

  return {
    databaseUrl: env.DATABASE_URL!,
    jwtSecret: env.JWT_SECRET!,
    smtpHost: env.SMTP_HOST,
    smtpPort: Number(env.SMTP_PORT || 465),
    smtpUser: env.SMTP_USER,
    smtpPass: env.SMTP_PASS,
    webUrl: env.WEB_URL!,
    cookieDomain: env.COOKIE_DOMAIN,
    cookieSameSite: env.COOKIE_SAMESITE === 'none' ? 'none' : env.COOKIE_SAMESITE === 'lax' ? 'lax' : 'strict',
    port: Number(env.PORT || 4000),
    nodeEnv: env.NODE_ENV || 'development'
  }
}
