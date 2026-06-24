import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/db'
import { siteConfig } from '@/lib/config'

// Публичная конфигурация онлайн-чата для клиентского компонента <SupportChat />.
// Возвращает только публичный ключ виджета (он и так виден в браузере) и флаг
// включения. Ключ редактируется в админке; при пустой БД берётся дефолт из конфига.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSettings(['livechat_api_key', 'livechat_enabled'])

    const apiKey = settings.livechat_api_key?.trim() || siteConfig.livechat.defaultApiKey
    // Включён по умолчанию (если в БД явно не выключен значением '0'/'false').
    const enabledRaw = settings.livechat_enabled
    const enabled = enabledRaw === null ? true : enabledRaw === '1' || enabledRaw === 'true'

    return NextResponse.json(
      {
        enabled: enabled && Boolean(apiKey),
        apiKey,
        scriptPath: siteConfig.livechat.scriptPath,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('Get livechat config error:', error)
    // При ошибке БД отдаём дефолт, чтобы чат не пропадал.
    return NextResponse.json(
      {
        enabled: Boolean(siteConfig.livechat.defaultApiKey),
        apiKey: siteConfig.livechat.defaultApiKey,
        scriptPath: siteConfig.livechat.scriptPath,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
