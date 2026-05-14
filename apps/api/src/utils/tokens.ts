import crypto from 'crypto'

export function createToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
