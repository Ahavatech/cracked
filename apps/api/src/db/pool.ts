import { Pool, type QueryResultRow } from 'pg'
import { getRuntimeEnv } from '../config/env'

const env = getRuntimeEnv()

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : undefined
})

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) {
  return pool.query<T>(text, params)
}
