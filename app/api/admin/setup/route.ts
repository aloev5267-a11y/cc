import { NextRequest, NextResponse } from 'next/server'
import { addManager, createAdminUser, getAdminUserByUsername, countAdminUsers } from '@/lib/db'
import { checkRateLimit, rateLimitConfigs, getClientIp } from '@/lib/rate-limit'
import { getTelegramApiUrl } from '@/lib/telegram'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Rate limit for admin endpoints
    const rateLimitResult = checkRateLimit(request, rateLimitConfigs.admin, `admin_${getClientIp(request)}`)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000) },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { action, secret } = body

    // Check admin secret
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    switch (action) {
      case 'create_admin': {
        // Защита от повторного использования эндпойнта: первичная настройка
        // создаёт только ПЕРВОГО админа. Дальнейшее управление пользователями —
        // через защищённую сессией админку (/api/admin/users), а не через этот
        // эндпойнт на общем секрете. Это закрывает риск, если ADMIN_SECRET утечёт.
        if (countAdminUsers() > 0) {
          return NextResponse.json(
            { error: 'Setup already completed. Manage admins from the authenticated admin panel.' },
            { status: 403 }
          )
        }

        const { username, password } = body
        if (!username || !password) {
          return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
        }

        const existing = getAdminUserByUsername(username)
        if (existing) {
          return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const id = `admin_${Date.now()}`
        const passwordHash = await hashPassword(password)
        createAdminUser(id, username, passwordHash, 'admin')

        return NextResponse.json({ success: true, message: 'Admin user created', id })
      }

      case 'add_managers': {
        const { managers } = body
        if (!managers || !Array.isArray(managers)) {
          return NextResponse.json({ error: 'Managers array required' }, { status: 400 })
        }

        for (let i = 0; i < managers.length; i++) {
          const m = managers[i]
          addManager(m.id || `manager_${Date.now()}_${i}`, m.telegramId, m.name, i)
        }
        return NextResponse.json({ success: true, count: managers.length })
      }

      case 'setup_webhook': {
        const token = body.botToken || process.env.TELEGRAM_BOT_TOKEN
        
        if (!token) {
          return NextResponse.json({ error: 'Bot token required' }, { status: 400 })
        }

        const url = getTelegramApiUrl('setWebhook', token)

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: body.webhookUrl,
            allowed_updates: ['message', 'callback_query']
          })
        })

        const result = await response.json()
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Admin Setup API] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
