import bcrypt from 'bcrypt'
import crypto from 'crypto'
import type Database from 'better-sqlite3'

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

// Session functions that work with the database
export function createSession(db: Database.Database, userId: string, token: string, expiresAt: Date) {
  // Ensure sessions table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  `)
  
  // Remove any existing sessions for this user (single session per user)
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
  
  // Create new session
  return db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(
    userId,
    token,
    expiresAt.toISOString()
  )
}

export function validateSession(db: Database.Database, token: string): { userId: string; expiresAt: string } | null {
  // Ensure sessions table exists
  try {
    const session = db.prepare(`
      SELECT user_id, expires_at FROM sessions 
      WHERE token = ? AND expires_at > datetime('now')
    `).get(token) as { user_id: string; expires_at: string } | undefined
    
    if (!session) return null
    
    return {
      userId: session.user_id,
      expiresAt: session.expires_at
    }
  } catch {
    return null
  }
}

export function deleteSession(db: Database.Database, token: string) {
  try {
    return db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
  } catch {
    return null
  }
}

export function deleteUserSessions(db: Database.Database, userId: string) {
  try {
    return db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
  } catch {
    return null
  }
}

export function cleanExpiredSessions(db: Database.Database) {
  try {
    return db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run()
  } catch {
    return null
  }
}
