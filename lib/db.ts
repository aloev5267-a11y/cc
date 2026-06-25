import { Pool, type PoolClient, type QueryResultRow } from 'pg'

// ============ Connection ============
// Единый пул соединений на процесс. Строка подключения берётся из DATABASE_URL.
// Для self-hosted Postgres на VPS SSL обычно не нужен — включается флагом DATABASE_SSL=true.
let pool: Pool | null = null
let initPromise: Promise<void> | null = null

function getPool(): Pool {
  if (pool) return pool

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Укажите строку подключения к PostgreSQL (например, postgres://user:pass@localhost:5432/elwork).',
    )
  }

  pool = new Pool({
    connectionString,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
  })

  pool.on('error', (err) => {
    console.error('[db] Unexpected Postgres pool error:', err)
  })

  return pool
}

// Инициализация схемы — идемпотентна и выполняется один раз за время жизни процесса.
async function ensureSchema(): Promise<void> {
  if (initPromise) return initPromise

  initPromise = (async () => {
    const p = getPool()
    await p.query(`
      CREATE TABLE IF NOT EXISTS managers (
        id TEXT PRIMARY KEY,
        telegram_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        is_available INTEGER DEFAULT 1,
        last_assigned TIMESTAMPTZ,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messenger_accounts (
        id TEXT PRIMARY KEY,
        messenger_type TEXT NOT NULL,
        account_id TEXT NOT NULL,
        account_name TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        order_index INTEGER DEFAULT 0,
        total_leads INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messenger_queue (
        id BIGSERIAL PRIMARY KEY,
        messenger_type TEXT NOT NULL UNIQUE,
        current_index INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS client_bindings (
        id BIGSERIAL PRIMARY KEY,
        client_id TEXT NOT NULL,
        manager_id TEXT,
        messenger_type TEXT,
        messenger_account_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(client_id, messenger_type)
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'operator',
        telegram_id TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS activity_log (
        id BIGSERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        admin_id TEXT,
        details TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS leads (
        id BIGSERIAL PRIMARY KEY,
        client_id TEXT NOT NULL,
        source TEXT NOT NULL,
        manager_id TEXT,
        messenger_account_id TEXT,
        status TEXT DEFAULT 'new',
        metadata TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_leads_client_id ON leads(client_id);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_client_bindings_client_id ON client_bindings(client_id);
      CREATE INDEX IF NOT EXISTS idx_messenger_accounts_type ON messenger_accounts(messenger_type);
    `)

    // Инициализация очередей мессенджеров
    for (const type of ['telegram', 'whatsapp', 'max']) {
      await p.query(
        'INSERT INTO messenger_queue (messenger_type, current_index) VALUES ($1, 0) ON CONFLICT (messenger_type) DO NOTHING',
        [type],
      )
    }
  })()

  return initPromise
}

// Базовый помощник: гарантирует схему и выполняет запрос.
async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  await ensureSchema()
  const res = await getPool().query<T>(text, params)
  return res.rows
}

async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  const rows = await query<T>(text, params)
  return rows[0]
}

// Экспортируем низкоуровневый доступ для функций сессий (lib/auth.ts).
export async function getClient(): Promise<PoolClient> {
  await ensureSchema()
  return getPool().connect()
}
export { query as dbQuery, queryOne as dbQueryOne }

// Совместимость: некоторые модули вызывали db() для получения соединения.
// Теперь они используют асинхронные хелперы напрямую, поэтому db() не нужен.

// ============ Types ============
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
  created_at: string
  updated_at: string
  }

// ============ Manager Functions ============
export async function addManager(id: string, telegramId: string, name: string, orderIndex: number) {
  return query(
    `INSERT INTO managers (id, telegram_id, name, order_index) VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET telegram_id = EXCLUDED.telegram_id, name = EXCLUDED.name, order_index = EXCLUDED.order_index`,
    [id, telegramId, name, orderIndex],
  )
}

export async function updateManager(
  id: string,
  data: { telegram_id?: string; name?: string; is_available?: boolean; order_index?: number },
) {
  // Имена колонок захардкожены (не из пользовательского ввода), значения параметризованы.
  const updates: string[] = []
  const values: (string | number)[] = []
  let i = 1

  if (data.telegram_id !== undefined) {
    updates.push(`telegram_id = $${i++}`)
    values.push(data.telegram_id)
  }
  if (data.name !== undefined) {
    updates.push(`name = $${i++}`)
    values.push(data.name)
  }
  if (data.is_available !== undefined) {
    updates.push(`is_available = $${i++}`)
    values.push(data.is_available ? 1 : 0)
  }
  if (data.order_index !== undefined) {
    updates.push(`order_index = $${i++}`)
    values.push(data.order_index)
  }

  if (updates.length === 0) return null
  values.push(id)

  return query(`UPDATE managers SET ${updates.join(', ')} WHERE id = $${i}`, values)
}

export async function deleteManager(id: string) {
  return query('DELETE FROM managers WHERE id = $1', [id])
}

export async function getAllManagers(): Promise<Manager[]> {
  return query<Manager>('SELECT * FROM managers ORDER BY order_index')
}

export async function setManagerAvailability(id: string, isAvailable: boolean) {
  return query('UPDATE managers SET is_available = $1 WHERE id = $2', [isAvailable ? 1 : 0, id])
}

// ============ Messenger Account Functions ============
export async function getNextMessengerAccount(messengerType: string): Promise<MessengerAccountType | null> {
  // Атомарный round-robin по типу мессенджера: блокируем строку очереди (FOR UPDATE),
  // чтобы одновременные клики распределялись по аккаунтам без коллизий индекса.
  await ensureSchema()
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')

    const queueRes = await client.query<{ current_index: number }>(
      'SELECT current_index FROM messenger_queue WHERE messenger_type = $1 FOR UPDATE',
      [messengerType],
    )
    const queue = queueRes.rows[0]
    if (!queue) {
      await client.query('COMMIT')
      return null
    }

    const accountsRes = await client.query<MessengerAccountType>(
      'SELECT * FROM messenger_accounts WHERE messenger_type = $1 AND is_active = 1 ORDER BY order_index',
      [messengerType],
    )
    const accounts = accountsRes.rows
    if (accounts.length === 0) {
      await client.query('COMMIT')
      return null
    }

    const nextIndex = queue.current_index % accounts.length
    const account = accounts[nextIndex]

    await client.query('UPDATE messenger_queue SET current_index = $1 WHERE messenger_type = $2', [
      (queue.current_index + 1) % accounts.length,
      messengerType,
    ])
    await client.query('UPDATE messenger_accounts SET total_leads = total_leads + 1 WHERE id = $1', [account.id])

    await client.query('COMMIT')
    return account
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// Возвращает аккаунт, который СЕЙЧАС стоит в очереди, НЕ сдвигая её и не накручивая счётчик.
export async function peekMessengerAccount(messengerType: string): Promise<MessengerAccountType | null> {
  const queue = await queryOne<{ current_index: number }>(
    'SELECT current_index FROM messenger_queue WHERE messenger_type = $1',
    [messengerType],
  )
  if (!queue) return null

  const accounts = await query<MessengerAccountType>(
    'SELECT * FROM messenger_accounts WHERE messenger_type = $1 AND is_active = 1 ORDER BY order_index',
    [messengerType],
  )
  if (accounts.length === 0) return null

  const nextIndex = queue.current_index % accounts.length
  return accounts[nextIndex]
}

export async function getMessengerAccountByClientBinding(
  clientId: string,
  messengerType: string,
): Promise<MessengerAccountType | null> {
  const binding = await queryOne<{ messenger_account_id: string | null }>(
    'SELECT messenger_account_id FROM client_bindings WHERE client_id = $1 AND messenger_type = $2',
    [clientId, messengerType],
  )
  if (binding?.messenger_account_id) {
    return (
      (await queryOne<MessengerAccountType>('SELECT * FROM messenger_accounts WHERE id = $1 AND is_active = 1', [
        binding.messenger_account_id,
      ])) ?? null
    )
  }
  return null
}

export async function bindClientToMessengerAccount(clientId: string, messengerType: string, accountId: string) {
  return query(
    `INSERT INTO client_bindings (client_id, messenger_type, messenger_account_id) VALUES ($1, $2, $3)
     ON CONFLICT (client_id, messenger_type) DO UPDATE SET messenger_account_id = EXCLUDED.messenger_account_id`,
    [clientId, messengerType, accountId],
  )
}

export async function addMessengerAccount(
  id: string,
  messengerType: string,
  accountId: string,
  accountName: string,
  orderIndex: number,
) {
  return query(
    `INSERT INTO messenger_accounts (id, messenger_type, account_id, account_name, order_index)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET messenger_type = EXCLUDED.messenger_type, account_id = EXCLUDED.account_id,
       account_name = EXCLUDED.account_name, order_index = EXCLUDED.order_index`,
    [id, messengerType, accountId, accountName, orderIndex],
  )
}

export async function updateMessengerAccount(
  id: string,
  data: { account_id?: string; account_name?: string; is_active?: boolean; order_index?: number },
) {
  // Имена колонок захардкожены (не из пользовательского ввода), значения параметризованы.
  const updates: string[] = []
  const values: (string | number)[] = []
  let i = 1

  if (data.account_id !== undefined) {
    updates.push(`account_id = $${i++}`)
    values.push(data.account_id)
  }
  if (data.account_name !== undefined) {
    updates.push(`account_name = $${i++}`)
    values.push(data.account_name)
  }
  if (data.is_active !== undefined) {
    updates.push(`is_active = $${i++}`)
    values.push(data.is_active ? 1 : 0)
  }
  if (data.order_index !== undefined) {
    updates.push(`order_index = $${i++}`)
    values.push(data.order_index)
  }

  if (updates.length === 0) return null
  values.push(id)

  return query(`UPDATE messenger_accounts SET ${updates.join(', ')} WHERE id = $${i}`, values)
}

export async function deleteMessengerAccount(id: string) {
  return query('DELETE FROM messenger_accounts WHERE id = $1', [id])
}

export async function getAllMessengerAccounts(messengerType?: string): Promise<MessengerAccountType[]> {
  if (messengerType) {
    return query<MessengerAccountType>(
      'SELECT * FROM messenger_accounts WHERE messenger_type = $1 ORDER BY order_index',
      [messengerType],
    )
  }
  return query<MessengerAccountType>('SELECT * FROM messenger_accounts ORDER BY messenger_type, order_index')
}

// ============ Admin User Functions ============
export async function createAdminUser(
  id: string,
  username: string,
  passwordHash: string,
  role: string = 'operator',
  telegramId?: string,
) {
  return query('INSERT INTO admin_users (id, username, password_hash, role, telegram_id) VALUES ($1, $2, $3, $4, $5)', [
    id,
    username,
    passwordHash,
    role,
    telegramId || null,
  ])
}

export async function getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
  return queryOne<AdminUser>('SELECT * FROM admin_users WHERE username = $1 AND is_active = 1', [username])
}

export async function getAdminUserById(id: string): Promise<AdminUser | undefined> {
  return queryOne<AdminUser>('SELECT * FROM admin_users WHERE id = $1', [id])
}

export async function getAllAdminUsers(): Promise<Omit<AdminUser, 'password_hash'>[]> {
  return query<Omit<AdminUser, 'password_hash'>>(
    'SELECT id, username, role, telegram_id, is_active, created_at FROM admin_users ORDER BY created_at',
  )
}

export async function countAdminUsers(): Promise<number> {
  const row = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM admin_users')
  return Number(row?.count ?? 0)
}

export async function updateAdminUser(
  id: string,
  data: { username?: string; password_hash?: string; role?: string; telegram_id?: string; is_active?: boolean },
) {
  // Имена колонок захардкожены (не из пользовательского ввода), значения параметризованы.
  const updates: string[] = []
  const values: (string | number)[] = []
  let i = 1

  if (data.username !== undefined) {
    updates.push(`username = $${i++}`)
    values.push(data.username)
  }
  if (data.password_hash !== undefined) {
    updates.push(`password_hash = $${i++}`)
    values.push(data.password_hash)
  }
  if (data.role !== undefined) {
    updates.push(`role = $${i++}`)
    values.push(data.role)
  }
  if (data.telegram_id !== undefined) {
    updates.push(`telegram_id = $${i++}`)
    values.push(data.telegram_id)
  }
  if (data.is_active !== undefined) {
    updates.push(`is_active = $${i++}`)
    values.push(data.is_active ? 1 : 0)
  }

  if (updates.length === 0) return null
  values.push(id)

  return query(`UPDATE admin_users SET ${updates.join(', ')} WHERE id = $${i}`, values)
}

export async function deleteAdminUser(id: string) {
  return query('DELETE FROM admin_users WHERE id = $1', [id])
}

// ============ Activity Log Functions ============
export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  adminId?: string,
  details?: string,
) {
  return query('INSERT INTO activity_log (action, entity_type, entity_id, admin_id, details) VALUES ($1, $2, $3, $4, $5)', [
    action,
    entityType || null,
    entityId || null,
    adminId || null,
    details || null,
  ])
}

export async function getActivityLog(limit: number = 100, offset: number = 0) {
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 500)
  const safeOffset = Math.max(0, Math.floor(offset))
  return query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT $1 OFFSET $2', [safeLimit, safeOffset])
}

// ============ Lead Functions ============
export async function createLead(
  clientId: string,
  source: string,
  managerId?: string,
  messengerAccountId?: string,
  metadata?: string,
) {
  return query(
    'INSERT INTO leads (client_id, source, manager_id, messenger_account_id, metadata) VALUES ($1, $2, $3, $4, $5)',
    [clientId, source, managerId || null, messengerAccountId || null, metadata || null],
  )
}

export async function updateLeadStatus(id: number, status: string) {
  return query('UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2', [status, id])
}

export async function getLeadStats() {
  const total = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM leads')
  const bySource = await query('SELECT source, COUNT(*) as count FROM leads GROUP BY source')
  const byStatus = await query('SELECT status, COUNT(*) as count FROM leads GROUP BY status')
  const today = await queryOne<{ count: string }>(
    'SELECT COUNT(*) as count FROM leads WHERE created_at::date = CURRENT_DATE',
  )
  return {
    total: Number(total?.count ?? 0),
    bySource,
    byStatus,
    today: Number(today?.count ?? 0),
  }
}

export async function getRecentLeads(limit = 30, offset = 0): Promise<Lead[]> {
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 500)
  const safeOffset = Math.max(0, Math.floor(offset))
  return query<Lead>('SELECT * FROM leads ORDER BY created_at DESC LIMIT $1 OFFSET $2', [safeLimit, safeOffset])
}

