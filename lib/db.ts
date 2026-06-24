import path from 'path'
import fs from 'fs'
import type Database from 'better-sqlite3'

// Lazy load better-sqlite3 to avoid build-time errors
let db: Database.Database | null = null

function getDb(): Database.Database {
  if (db) return db
  
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DatabaseConstructor = require('better-sqlite3')
  
  const dbPath = path.join(process.cwd(), 'data', 'chat.db')
  
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  const database: Database.Database = new DatabaseConstructor(dbPath)
  
  // Initialize tables
  database.exec(`
    -- Chats table
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      user_name TEXT NOT NULL,
      position TEXT NOT NULL,
      manager_id TEXT,
      client_id TEXT,
      status TEXT DEFAULT 'waiting',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Messages table
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id)
    );

    -- Chat managers table (for live chat)
    CREATE TABLE IF NOT EXISTS managers (
      id TEXT PRIMARY KEY,
      telegram_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      is_available INTEGER DEFAULT 1,
      last_assigned DATETIME,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Manager queue for round-robin distribution
    CREATE TABLE IF NOT EXISTS manager_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      current_index INTEGER DEFAULT 0
    );

    -- Messenger accounts table (for Telegram, WhatsApp, MAX)
    CREATE TABLE IF NOT EXISTS messenger_accounts (
      id TEXT PRIMARY KEY,
      messenger_type TEXT NOT NULL, -- 'telegram', 'whatsapp', 'max'
      account_id TEXT NOT NULL, -- username or phone number
      account_name TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      order_index INTEGER DEFAULT 0,
      total_leads INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Messenger queue for round-robin distribution
    CREATE TABLE IF NOT EXISTS messenger_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      messenger_type TEXT NOT NULL UNIQUE,
      current_index INTEGER DEFAULT 0
    );

    -- Client-manager bindings (for persistent lead assignment)
    CREATE TABLE IF NOT EXISTS client_bindings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT NOT NULL,
      manager_id TEXT,
      messenger_type TEXT,
      messenger_account_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(client_id, messenger_type)
    );

    -- Admin users table
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'operator', -- 'admin', 'operator'
      telegram_id TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Activity log
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      admin_id TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Lead tracking
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT NOT NULL,
      source TEXT NOT NULL, -- 'chat', 'telegram', 'whatsapp', 'max', 'form'
      manager_id TEXT,
      messenger_account_id TEXT,
      status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted', 'lost'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Миграция: добавляем недостающие колонки в leads (для существующих БД)
  const leadColumns = database.prepare("PRAGMA table_info(leads)").all() as { name: string }[]
  if (!leadColumns.some((c) => c.name === 'metadata')) {
    database.exec('ALTER TABLE leads ADD COLUMN metadata TEXT')
  }
  // Конверсионная связка: код заявки, ClientID Метрики, время подтверждения, флаг выгрузки в Метрику
  if (!leadColumns.some((c) => c.name === 'code')) {
    database.exec('ALTER TABLE leads ADD COLUMN code TEXT')
  }
  if (!leadColumns.some((c) => c.name === 'ym_client_id')) {
    database.exec('ALTER TABLE leads ADD COLUMN ym_client_id TEXT')
  }
  if (!leadColumns.some((c) => c.name === 'confirmed_at')) {
    database.exec('ALTER TABLE leads ADD COLUMN confirmed_at DATETIME')
  }
  if (!leadColumns.some((c) => c.name === 'ym_uploaded')) {
    database.exec('ALTER TABLE leads ADD COLUMN ym_uploaded INTEGER DEFAULT 0')
  }
  // Индекс для быстрого поиска заявки по коду при подтверждении
  database.exec('CREATE INDEX IF NOT EXISTS idx_leads_code ON leads(code)')

  // Initialize queues if empty
  const queueExists = database.prepare('SELECT * FROM manager_queue LIMIT 1').get()
  if (!queueExists) {
    database.prepare('INSERT INTO manager_queue (current_index) VALUES (0)').run()
  }

  // Initialize messenger queues
  const messengerTypes = ['telegram', 'whatsapp', 'max']
  for (const type of messengerTypes) {
    const exists = database.prepare('SELECT * FROM messenger_queue WHERE messenger_type = ?').get(type)
    if (!exists) {
      database.prepare('INSERT INTO messenger_queue (messenger_type, current_index) VALUES (?, 0)').run(type)
    }
  }
  
  db = database
  return database
}

export { getDb as db }

// ============ Types ============
export interface Chat {
  id: string
  user_name: string
  position: string
  manager_id: string | null
  client_id: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: number
  chat_id: string
  sender: string
  text: string
  created_at: string
}

export interface Manager {
  id: string
  telegram_id: string
  name: string
  is_available: number
  last_assigned: string | null
  order_index: number
  created_at: string
}

export interface MessengerAccountType {
  id: string
  messenger_type: string
  account_id: string
  account_name: string
  is_active: number
  order_index: number
  total_leads: number
  created_at: string
}

export interface AdminUser {
  id: string
  username: string
  password_hash: string
  role: string
  telegram_id: string | null
  is_active: number
  created_at: string
}

export interface Lead {
  id: number
  client_id: string
  source: string
  manager_id: string | null
  messenger_account_id: string | null
  status: string
  metadata: string | null
  code: string | null
  ym_client_id: string | null
  confirmed_at: string | null
  ym_uploaded: number
  created_at: string
  updated_at: string
}

// ============ Chat Functions ============
export function createChat(id: string, userName: string, position: string, clientId?: string) {
  const database = getDb()
  const stmt = database.prepare('INSERT INTO chats (id, user_name, position, client_id) VALUES (?, ?, ?, ?)')
  return stmt.run(id, userName, position, clientId || null)
}

export function getChat(id: string): Chat | undefined {
  const database = getDb()
  return database.prepare('SELECT * FROM chats WHERE id = ?').get(id) as Chat | undefined
}

export function getChatByClientId(clientId: string): Chat | undefined {
  const database = getDb()
  return database.prepare('SELECT * FROM chats WHERE client_id = ? ORDER BY created_at DESC LIMIT 1').get(clientId) as Chat | undefined
}

export function updateChatStatus(id: string, status: string, managerId?: string) {
  const database = getDb()
  if (managerId) {
    return database.prepare('UPDATE chats SET status = ?, manager_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, managerId, id)
  }
  return database.prepare('UPDATE chats SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id)
}

export function getAllChats(status?: string): Chat[] {
  const database = getDb()
  if (status) {
    return database.prepare('SELECT * FROM chats WHERE status = ? ORDER BY updated_at DESC').all(status) as Chat[]
  }
  return database.prepare('SELECT * FROM chats ORDER BY updated_at DESC').all() as Chat[]
}

// ============ Message Functions ============
export function addMessage(chatId: string, sender: string, text: string) {
  const database = getDb()
  return database.prepare('INSERT INTO messages (chat_id, sender, text) VALUES (?, ?, ?)').run(chatId, sender, text)
}

export function getMessages(chatId: string): Message[] {
  const database = getDb()
  return database.prepare('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC').all(chatId) as Message[]
}

// ============ Manager Functions ============
export function getNextManager(): Manager | null {
  const database = getDb()
  const queue = database.prepare('SELECT current_index FROM manager_queue LIMIT 1').get() as { current_index: number }
  const managers = database.prepare('SELECT * FROM managers WHERE is_available = 1 ORDER BY order_index').all() as Manager[]
  
  if (managers.length === 0) return null
  
  const nextIndex = queue.current_index % managers.length
  const manager = managers[nextIndex]
  
  database.prepare('UPDATE manager_queue SET current_index = ?').run((queue.current_index + 1) % managers.length)
  database.prepare('UPDATE managers SET last_assigned = CURRENT_TIMESTAMP WHERE id = ?').run(manager.id)
  
  return manager
}

export function getManagerByClientBinding(clientId: string): Manager | null {
  const database = getDb()
  const binding = database.prepare('SELECT manager_id FROM client_bindings WHERE client_id = ? AND messenger_type IS NULL').get(clientId) as { manager_id: string } | undefined
  if (binding?.manager_id) {
    return database.prepare('SELECT * FROM managers WHERE id = ? AND is_available = 1').get(binding.manager_id) as Manager | undefined ?? null
  }
  return null
}

export function bindClientToManager(clientId: string, managerId: string) {
  const database = getDb()
  return database.prepare('INSERT OR REPLACE INTO client_bindings (client_id, manager_id) VALUES (?, ?)').run(clientId, managerId)
}

export function addManager(id: string, telegramId: string, name: string, orderIndex: number) {
  const database = getDb()
  return database.prepare('INSERT OR REPLACE INTO managers (id, telegram_id, name, order_index) VALUES (?, ?, ?, ?)').run(id, telegramId, name, orderIndex)
}

// Whitelist of allowed column names to prevent SQL injection
const MANAGER_ALLOWED_COLUMNS = new Set(['telegram_id', 'name', 'is_available', 'order_index'])

export function updateManager(id: string, data: { telegram_id?: string; name?: string; is_available?: boolean; order_index?: number }) {
  const database = getDb()
  const updates: string[] = []
  const values: (string | number)[] = []
  
  // Only allow whitelisted columns to prevent SQL injection
  if (data.telegram_id !== undefined && MANAGER_ALLOWED_COLUMNS.has('telegram_id')) { 
    updates.push('telegram_id = ?'); values.push(data.telegram_id) 
  }
  if (data.name !== undefined && MANAGER_ALLOWED_COLUMNS.has('name')) { 
    updates.push('name = ?'); values.push(data.name) 
  }
  if (data.is_available !== undefined && MANAGER_ALLOWED_COLUMNS.has('is_available')) { 
    updates.push('is_available = ?'); values.push(data.is_available ? 1 : 0) 
  }
  if (data.order_index !== undefined && MANAGER_ALLOWED_COLUMNS.has('order_index')) { 
    updates.push('order_index = ?'); values.push(data.order_index) 
  }
  
  if (updates.length === 0) return null
  values.push(id)
  
  return database.prepare(`UPDATE managers SET ${updates.join(', ')} WHERE id = ?`).run(...values)
}

export function deleteManager(id: string) {
  const database = getDb()
  return database.prepare('DELETE FROM managers WHERE id = ?').run(id)
}

export function getAllManagers(): Manager[] {
  const database = getDb()
  return database.prepare('SELECT * FROM managers ORDER BY order_index').all() as Manager[]
}

export function setManagerAvailability(id: string, isAvailable: boolean) {
  const database = getDb()
  return database.prepare('UPDATE managers SET is_available = ? WHERE id = ?').run(isAvailable ? 1 : 0, id)
}

export function getChatByManagerTelegramId(telegramId: string): Chat | undefined {
  const database = getDb()
  return database.prepare(`
    SELECT c.* FROM chats c 
    JOIN managers m ON c.manager_id = m.id 
    WHERE m.telegram_id = ? AND c.status = 'active'
    ORDER BY c.updated_at DESC LIMIT 1
  `).get(telegramId) as Chat | undefined
}

// ============ Messenger Account Functions ============
export function getNextMessengerAccount(messengerType: string): MessengerAccountType | null {
  const database = getDb()
  const queue = database.prepare('SELECT current_index FROM messenger_queue WHERE messenger_type = ?').get(messengerType) as { current_index: number } | undefined
  if (!queue) return null
  
  const accounts = database.prepare('SELECT * FROM messenger_accounts WHERE messenger_type = ? AND is_active = 1 ORDER BY order_index').all(messengerType) as MessengerAccountType[]
  
  if (accounts.length === 0) return null
  
  const nextIndex = queue.current_index % accounts.length
  const account = accounts[nextIndex]
  
  database.prepare('UPDATE messenger_queue SET current_index = ? WHERE messenger_type = ?').run((queue.current_index + 1) % accounts.length, messengerType)
  database.prepare('UPDATE messenger_accounts SET total_leads = total_leads + 1 WHERE id = ?').run(account.id)
  
  return account
}

// Возвращает аккаунт, который СЕЙЧАС стоит в очереди, НЕ сдвигая её и не накручивая счётчик.
// Используется для отображения ссылки при загрузке страницы (без расхода очереди и лидов).
export function peekMessengerAccount(messengerType: string): MessengerAccountType | null {
  const database = getDb()
  const queue = database.prepare('SELECT current_index FROM messenger_queue WHERE messenger_type = ?').get(messengerType) as { current_index: number } | undefined
  if (!queue) return null

  const accounts = database.prepare('SELECT * FROM messenger_accounts WHERE messenger_type = ? AND is_active = 1 ORDER BY order_index').all(messengerType) as MessengerAccountType[]

  if (accounts.length === 0) return null

  const nextIndex = queue.current_index % accounts.length
  return accounts[nextIndex]
}

export function getMessengerAccountByClientBinding(clientId: string, messengerType: string): MessengerAccountType | null {
  const database = getDb()
  const binding = database.prepare('SELECT messenger_account_id FROM client_bindings WHERE client_id = ? AND messenger_type = ?').get(clientId, messengerType) as { messenger_account_id: string } | undefined
  if (binding?.messenger_account_id) {
    return database.prepare('SELECT * FROM messenger_accounts WHERE id = ? AND is_active = 1').get(binding.messenger_account_id) as MessengerAccountType | undefined ?? null
  }
  return null
}

export function bindClientToMessengerAccount(clientId: string, messengerType: string, accountId: string) {
  const database = getDb()
  return database.prepare('INSERT OR REPLACE INTO client_bindings (client_id, messenger_type, messenger_account_id) VALUES (?, ?, ?)').run(clientId, messengerType, accountId)
}

export function addMessengerAccount(id: string, messengerType: string, accountId: string, accountName: string, orderIndex: number) {
  const database = getDb()
  return database.prepare('INSERT OR REPLACE INTO messenger_accounts (id, messenger_type, account_id, account_name, order_index) VALUES (?, ?, ?, ?, ?)').run(id, messengerType, accountId, accountName, orderIndex)
}

// Whitelist of allowed column names to prevent SQL injection
const MESSENGER_ALLOWED_COLUMNS = new Set(['account_id', 'account_name', 'is_active', 'order_index'])

export function updateMessengerAccount(id: string, data: { account_id?: string; account_name?: string; is_active?: boolean; order_index?: number }) {
  const database = getDb()
  const updates: string[] = []
  const values: (string | number)[] = []
  
  // Only allow whitelisted columns to prevent SQL injection
  if (data.account_id !== undefined && MESSENGER_ALLOWED_COLUMNS.has('account_id')) { 
    updates.push('account_id = ?'); values.push(data.account_id) 
  }
  if (data.account_name !== undefined && MESSENGER_ALLOWED_COLUMNS.has('account_name')) { 
    updates.push('account_name = ?'); values.push(data.account_name) 
  }
  if (data.is_active !== undefined && MESSENGER_ALLOWED_COLUMNS.has('is_active')) { 
    updates.push('is_active = ?'); values.push(data.is_active ? 1 : 0) 
  }
  if (data.order_index !== undefined && MESSENGER_ALLOWED_COLUMNS.has('order_index')) { 
    updates.push('order_index = ?'); values.push(data.order_index) 
  }
  
  if (updates.length === 0) return null
  values.push(id)
  
  return database.prepare(`UPDATE messenger_accounts SET ${updates.join(', ')} WHERE id = ?`).run(...values)
}

export function deleteMessengerAccount(id: string) {
  const database = getDb()
  return database.prepare('DELETE FROM messenger_accounts WHERE id = ?').run(id)
}

export function getAllMessengerAccounts(messengerType?: string): MessengerAccountType[] {
  const database = getDb()
  if (messengerType) {
    return database.prepare('SELECT * FROM messenger_accounts WHERE messenger_type = ? ORDER BY order_index').all(messengerType) as MessengerAccountType[]
  }
  return database.prepare('SELECT * FROM messenger_accounts ORDER BY messenger_type, order_index').all() as MessengerAccountType[]
}

// ============ Admin User Functions ============
export function createAdminUser(id: string, username: string, passwordHash: string, role: string = 'operator', telegramId?: string) {
  const database = getDb()
  return database.prepare('INSERT INTO admin_users (id, username, password_hash, role, telegram_id) VALUES (?, ?, ?, ?, ?)').run(id, username, passwordHash, role, telegramId || null)
}

export function getAdminUserByUsername(username: string): AdminUser | undefined {
  const database = getDb()
  return database.prepare('SELECT * FROM admin_users WHERE username = ? AND is_active = 1').get(username) as AdminUser | undefined
}

export function getAdminUserById(id: string): AdminUser | undefined {
  const database = getDb()
  return database.prepare('SELECT * FROM admin_users WHERE id = ?').get(id) as AdminUser | undefined
}

export function getAllAdminUsers(): Omit<AdminUser, 'password_hash'>[] {
  const database = getDb()
  return database.prepare('SELECT id, username, role, telegram_id, is_active, created_at FROM admin_users ORDER BY created_at').all() as Omit<AdminUser, 'password_hash'>[]
}

// Whitelist of allowed column names to prevent SQL injection
const ADMIN_ALLOWED_COLUMNS = new Set(['username', 'password_hash', 'role', 'telegram_id', 'is_active'])

export function updateAdminUser(id: string, data: { username?: string; password_hash?: string; role?: string; telegram_id?: string; is_active?: boolean }) {
  const database = getDb()
  const updates: string[] = []
  const values: (string | number)[] = []
  
  // Only allow whitelisted columns to prevent SQL injection
  if (data.username !== undefined && ADMIN_ALLOWED_COLUMNS.has('username')) { 
    updates.push('username = ?'); values.push(data.username) 
  }
  if (data.password_hash !== undefined && ADMIN_ALLOWED_COLUMNS.has('password_hash')) { 
    updates.push('password_hash = ?'); values.push(data.password_hash) 
  }
  if (data.role !== undefined && ADMIN_ALLOWED_COLUMNS.has('role')) { 
    updates.push('role = ?'); values.push(data.role) 
  }
  if (data.telegram_id !== undefined && ADMIN_ALLOWED_COLUMNS.has('telegram_id')) { 
    updates.push('telegram_id = ?'); values.push(data.telegram_id) 
  }
  if (data.is_active !== undefined && ADMIN_ALLOWED_COLUMNS.has('is_active')) { 
    updates.push('is_active = ?'); values.push(data.is_active ? 1 : 0) 
  }
  
  if (updates.length === 0) return null
  values.push(id)
  
  return database.prepare(`UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`).run(...values)
}

export function deleteAdminUser(id: string) {
  const database = getDb()
  return database.prepare('DELETE FROM admin_users WHERE id = ?').run(id)
}

// ============ Activity Log Functions ============
export function logActivity(action: string, entityType?: string, entityId?: string, adminId?: string, details?: string) {
  const database = getDb()
  return database.prepare('INSERT INTO activity_log (action, entity_type, entity_id, admin_id, details) VALUES (?, ?, ?, ?, ?)').run(action, entityType || null, entityId || null, adminId || null, details || null)
}

export function getActivityLog(limit: number = 100) {
  const database = getDb()
  return database.prepare('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?').all(limit)
}

// ============ Lead Functions ============
export function createLead(clientId: string, source: string, managerId?: string, messengerAccountId?: string, metadata?: string) {
  const database = getDb()
  return database
    .prepare('INSERT INTO leads (client_id, source, manager_id, messenger_account_id, metadata) VALUES (?, ?, ?, ?, ?)')
    .run(clientId, source, managerId || null, messengerAccountId || null, metadata || null)
}

export function updateLeadStatus(id: number, status: string) {
  const database = getDb()
  return database.prepare('UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id)
}

// ============ Conversion (messenger lead) Functions ============

// Создаёт заявку с уникальным кодом и ClientID Метрики (статус 'new' = ожидает подтверждения).
export function createLeadWithCode(params: {
  code: string
  clientId: string
  ymClientId?: string | null
  source: string
  messengerAccountId?: string | null
  metadata?: string | null
}) {
  const database = getDb()
  return database
    .prepare(
      'INSERT INTO leads (client_id, source, messenger_account_id, metadata, code, ym_client_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .run(
      params.clientId,
      params.source,
      params.messengerAccountId || null,
      params.metadata || null,
      params.code,
      params.ymClientId || null,
      'new',
    )
}

export function getLeadByCode(code: string): Lead | undefined {
  const database = getDb()
  return database.prepare('SELECT * FROM leads WHERE code = ? ORDER BY created_at DESC LIMIT 1').get(code) as Lead | undefined
}

// Помечает заявку как подтверждённую (человек написал в мессенджер). Идемпотентно.
export function confirmLeadByCode(code: string) {
  const database = getDb()
  return database
    .prepare("UPDATE leads SET status = 'converted', confirmed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE code = ? AND status != 'converted'")
    .run(code)
}

// Помечает, что офлайн-конверсия успешно выгружена в Яндекс.Метрику.
export function markLeadUploaded(code: string) {
  const database = getDb()
  return database.prepare('UPDATE leads SET ym_uploaded = 1, updated_at = CURRENT_TIMESTAMP WHERE code = ?').run(code)
}

// Счётчики для админки.
export function getConversionStats() {
  const database = getDb()
  return {
    pending: (database.prepare("SELECT COUNT(*) as count FROM leads WHERE code IS NOT NULL AND status != 'converted'").get() as { count: number }).count,
    converted: (database.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'converted'").get() as { count: number }).count,
    convertedToday: (database.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'converted' AND DATE(confirmed_at) = DATE('now')").get() as { count: number }).count,
    // Подтверждены, но конверсия не уехала в Метрику (нет ClientID или сбой выгрузки) — кандидаты на досыл
    notUploaded: (database.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'converted' AND ym_uploaded = 0").get() as { count: number }).count,
  }
}

export function getLeadStats() {
  const database = getDb()
  return {
    total: (database.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number }).count,
    bySource: database.prepare('SELECT source, COUNT(*) as count FROM leads GROUP BY source').all(),
    byStatus: database.prepare('SELECT status, COUNT(*) as count FROM leads GROUP BY status').all(),
    today: (database.prepare("SELECT COUNT(*) as count FROM leads WHERE DATE(created_at) = DATE('now')").get() as { count: number }).count,
  }
}

// Последние заявки с данными опроса (для админки)
export function getRecentLeads(limit = 30): Lead[] {
  const database = getDb()
  return database
    .prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?')
    .all(limit) as Lead[]
}

export function getActiveChatByManagerTelegramId(telegramId: string): Chat | undefined {
  const database = getDb()
  return database.prepare(`
    SELECT * FROM chats
    WHERE manager_id = ? AND status = 'active'
    ORDER BY updated_at DESC LIMIT 1
  `).get(telegramId) as Chat | undefined
}
