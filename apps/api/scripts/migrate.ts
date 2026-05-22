import fs from 'fs'
import path from 'path'
import { Client } from 'pg'
import { loadEnv } from '../src/config/env'

async function main() {
  const env = loadEnv(['DATABASE_URL'])
  const connectionString = env.DIRECT_URL?.trim() || env.DATABASE_URL
  const migrationsDir = path.resolve(__dirname, '..', 'src', 'db', 'migrations')
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort()

  if (files.length === 0) {
    console.log('No migration files found.')
    return
  }

  const client = new Client({
    connectionString,
    ssl: connectionString?.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined
  })

  try {
    await client.connect()
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    for (const file of files) {
      const existing = await client.query('SELECT filename FROM schema_migrations WHERE filename = $1', [file])
      if (existing.rowCount) {
        console.log(`Skipping ${file}`)
        continue
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      await client.query('BEGIN')
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file])
      await client.query('COMMIT')
      console.log(`Applied ${file}`)
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    console.error('Migration failed. Check DATABASE_URL and database connectivity.')
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    await client.end().catch(() => undefined)
  }
}

main()
