import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { dbQuery, dbQueryOne } from './db'

const SALT_ROUNDS = 12

// ============ Password Hashing ============

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Synchronous version for scripts
export function hashPasswordSync(password: string): string {
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

// ============ Session Management ============

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateSessionExpiry(hours: number = 24): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

// Session functions backed by PostgreSQL (lib/db ensures the sessions table exists).
export async function createSession(userId: string, token: string, expiresAt: Date) {
  // Single session per user: remove existing sessions first.
  await dbQuery('DELETE FROM sessions WHERE user_id = $1', [userId])
  return dbQuery('INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)', [
    userId,
    token,
    expiresAt.toISOString(),
  ])
}

export async function validateSession(token: string): Promise<{ userId: string; expiresAt: string } | null> {
  try {
    const session = await dbQueryOne<{ user_id: string; expires_at: string }>(
      'SELECT user_id, expires_at FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token],
    )
    if (!session) return null
    return { userId: session.user_id, expiresAt: session.expires_at }
  } catch {
    return null
  }
}

export async function deleteSession(token: string) {
  try {
    return await dbQuery('DELETE FROM sessions WHERE token = $1', [token])
  } catch {
    return null
  }
}

export async function deleteUserSessions(userId: string) {
  try {
    return await dbQuery('DELETE FROM sessions WHERE user_id = $1', [userId])
  } catch {
    return null
  }
}

export async function cleanExpiredSessions() {
  try {
    return await dbQuery('DELETE FROM sessions WHERE expires_at <= NOW()')
  } catch {
    return null
  }
}
