import { NextRequest, NextResponse } from 'next/server'
import { getSettings, setSetting, logActivity } from '@/lib/db'
import { checkAdminAuth } from '@/lib/admin-auth'
import { siteConfig } from '@/lib/config'

// Управление настройками онлайн-чата из админки.
// GET — текущие значения (ключ виджета + флаг включения).
// PUT — сохранить новые значения.

export async function GET() {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await getSettings(['livechat_api_key', 'livechat_enabled'])
    const enabledRaw = settings.livechat_enabled

    return NextResponse.json({
      success: true,
      settings: {
        livechat_api_key: settings.livechat_api_key ?? '',
        livechat_enabled: enabledRaw === null ? true : enabledRaw === '1' || enabledRaw === 'true',
        // Дефолтный ключ — подсказка в плейсхолдере, если поле пустое.
        default_api_key: siteConfig.livechat.defaultApiKey,
        script_path: siteConfig.livechat.scriptPath,
      },
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { livechat_api_key, livechat_enabled } = body as {
      livechat_api_key?: unknown
      livechat_enabled?: unknown
    }

    if (livechat_api_key !== undefined) {
      const key = typeof livechat_api_key === 'string' ? livechat_api_key.trim() : ''
      // Базовая валидация формата ключа виджета (lc_...), пустое значение разрешено (сброс на дефолт).
      if (key && !/^lc_[a-zA-Z0-9]+$/.test(key)) {
        return NextResponse.json({ error: 'Неверный формат ключа (ожидается lc_...)' }, { status: 400 })
      }
      await setSetting('livechat_api_key', key)
    }

    if (livechat_enabled !== undefined) {
      const enabled = livechat_enabled === true || livechat_enabled === '1' || livechat_enabled === 'true'
      await setSetting('livechat_enabled', enabled ? '1' : '0')
    }

    await logActivity('settings_updated', 'settings', 'livechat', adminId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
