import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Реальная проверка доступности БД: для self-hosted VPS это важный сигнал
  // для мониторинга/health-проб (nginx, systemd, uptime-чекеры).
  let database: 'up' | 'down' = 'down'
  try {
    await dbQuery('SELECT 1')
    database = 'up'
  } catch (error) {
    console.error('[health] Database check failed:', error)
  }

  const ok = database === 'up'
  return NextResponse.json(
    {
      status: ok ? 'ok' : 'degraded',
      database,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: ok ? 200 : 503 },
  )
}
