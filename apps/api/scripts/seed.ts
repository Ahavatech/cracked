import bcrypt from 'bcryptjs'
import { Client } from 'pg'
import { loadEnv } from '../src/config/env'

async function main() {
  const env = loadEnv(['DATABASE_URL', 'SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD'])
  const client = new Client({
    connectionString: env.DATABASE_URL,
    ssl: env.DATABASE_URL?.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined
  })

  try {
    await client.connect()
    const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD!, 12)
    await client.query(
      `
      INSERT INTO users (email, password_hash, role, is_active)
      VALUES ($1, $2, 'superadmin', TRUE)
      ON CONFLICT (email)
      DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'superadmin', is_active = TRUE
      `,
      [env.SEED_ADMIN_EMAIL, passwordHash]
    )
    console.log(`Seeded superadmin: ${env.SEED_ADMIN_EMAIL}`)
  } catch (error) {
    console.error('Seed failed. Check DATABASE_URL, migrations, and seed env values.')
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    await client.end().catch(() => undefined)
  }
}

main()
