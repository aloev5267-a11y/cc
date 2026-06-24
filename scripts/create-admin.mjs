#!/usr/bin/env node

/**
 * Создание администратора/оператора в PostgreSQL с хешированием пароля bcrypt.
 *
 * Использование:
 *   node scripts/create-admin.mjs <username> <password> [role]
 * Пример:
 *   node scripts/create-admin.mjs admin mySecurePassword123 admin
 *
 * Требуется переменная окружения DATABASE_URL (строка подключения к PostgreSQL).
 * Можно задать инлайн:
 *   DATABASE_URL=postgres://user:pass@localhost:5432/elwork node scripts/create-admin.mjs admin pass admin
 * либо положить её в .env.local / .env и подгрузить через `node --env-file=.env ...`.
 */

import bcrypt from 'bcrypt'
import crypto from 'crypto'
import pg from 'pg'

const { Client } = pg
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

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Укажите строку подключения к PostgreSQL.')
    console.error('Пример: DATABASE_URL=postgres://user:pass@localhost:5432/elwork node scripts/create-admin.mjs admin pass admin')
    process.exit(1)
  }

  const client = new Client({
    connectionString,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  })

  try {
    await client.connect()

    // Гарантируем наличие таблицы (на случай первичной настройки до запуска приложения).
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'operator',
        telegram_id TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    const existing = await client.query('SELECT 1 FROM admin_users WHERE username = $1', [username])
    if (existing.rowCount > 0) {
      console.error(`User "${username}" already exists`)
      process.exit(1)
    }

    console.log('Hashing password...')
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const id = crypto.randomUUID()

    await client.query(
      'INSERT INTO admin_users (id, username, password_hash, role) VALUES ($1, $2, $3, $4)',
      [id, username, passwordHash, role],
    )

    console.log(`Successfully created ${role} user: ${username}`)
    console.log(`User ID: ${id}`)
  } finally {
    await client.end()
  }
}

createAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
