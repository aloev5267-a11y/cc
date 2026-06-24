#!/usr/bin/env node

/**
 * Script to create admin user with bcrypt password hashing
 * Usage: node scripts/create-admin.mjs <username> <password> [role]
 * Example: node scripts/create-admin.mjs admin mySecurePassword123 admin
 */

import bcrypt from 'bcrypt'
import Database from 'better-sqlite3'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SALT_ROUNDS = 12

async function createAdmin() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.log('Usage: node scripts/create-admin.mjs <username> <password> [role]')
    console.log('Roles: admin, operator (default: operator)')
    process.exit(1)
  }
  
  const [username, password, role = 'operator'] = args
  
  if (!['admin', 'operator'].includes(role)) {
    console.error('Invalid role. Must be "admin" or "operator"')
    process.exit(1)
  }
  
  if (password.length < 8) {
    console.error('Password must be at least 8 characters')
    process.exit(1)
  }
  
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '..', 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  const dbPath = path.join(dataDir, 'chat.db')
  const db = new Database(dbPath)
  
  // Ensure admin_users table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'operator',
      telegram_id TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  
  // Check if user already exists
  const existing = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username)
  if (existing) {
    console.error(`User "${username}" already exists`)
    process.exit(1)
  }
  
  // Hash password with bcrypt
  console.log('Hashing password...')
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  
  // Generate unique ID
  const id = crypto.randomUUID()
  
  // Insert user
  db.prepare('INSERT INTO admin_users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(
    id,
    username,
    passwordHash,
    role
  )
  
  console.log(`Successfully created ${role} user: ${username}`)
  console.log(`User ID: ${id}`)
  
  db.close()
}

createAdmin().catch(console.error)
