import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createLead } from '@/lib/db'
import { checkRateLimit, rateLimitConfigs, getClientIp } from '@/lib/rate-limit'
import { sendTelegramMessage } from '@/lib/telegram'
import { contactRequestSchema } from '@/lib/validations'
import { generateClientId, escapeHtml } from '@/lib/server-utils'

export async function POST(request: NextRequest) {
  try {
    // Антиспам: ограничение частоты отправок с одного IP
    const rateLimitResult = checkRateLimit(request, rateLimitConfigs.contact, `contact_${getClientIp(request)}`)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Слишком много заявок. Попробуйте через минуту.', retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000) },
        { status: 429 },
      )
    }

    const body = await request.json()
    const result = contactRequestSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Проверьте правильность заполнения формы', details: result.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const data = result.data

    // Идентификатор клиента из cookie (для связи заявок с визитами)
    const cookieStore = await cookies()
    let clientId = cookieStore.get('client_id')?.value
    if (!clientId) {
      clientId = generateClientId()
    }

    // Сохраняем лид в БД вместе с данными формы.
    // Кладём контакты в metadata (JSON), чтобы заявка не терялась,
    // даже если уведомление в Telegram не настроено или недоступно.
    const metadata = JSON.stringify({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message || null,
      preferredContact: data.preferredContact || null,
    })
    await createLead(clientId, 'form', undefined, undefined, metadata)

    // Уведомление менеджеру в Telegram (если настроен чат)
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID
    if (adminChatId) {
      const lines = [
        '<b>Новая заявка с сайта</b>',
        'Источник: Форма обратной связи',
        `Имя: ${escapeHtml(data.name)}`,
        `Телефон: ${escapeHtml(data.phone)}`,
        data.email ? `Email: ${escapeHtml(data.email)}` : null,
        data.preferredContact ? `Предпочтительный способ связи: ${escapeHtml(data.preferredContact)}` : null,
        data.message ? `Сообщение: ${escapeHtml(data.message)}` : null,
      ].filter(Boolean)
      // Не блокируем ответ пользователю из-за уведомления
      await sendTelegramMessage(adminChatId, lines.join('\n'))
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('client_id', clientId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
    return response
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
