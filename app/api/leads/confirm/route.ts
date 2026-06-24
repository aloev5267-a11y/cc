import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getLeadByCode, confirmLeadByCode, markLeadUploaded } from '@/lib/db'
import { uploadOfflineConversion } from '@/lib/yandex-metrika-server'

// Вебхук подтверждения: внешняя система сообщает, что по заявке с этим номером
// пришло входящее сообщение. Только после этого засчитываем конверсию и грузим
// офлайн-конверсию в Яндекс.Метрику (по ClientID, захваченному на клике).
//
// Авторизация: заголовок X-Webhook-Secret должен совпадать с CONVERSION_WEBHOOK_SECRET.
// Идемпотентно: повторный вызов по тому же коду не создаёт дубль конверсии.

const confirmSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{4,12}$/),
})

export async function POST(request: NextRequest) {
  // 1. Проверка секрета
  const secret = process.env.CONVERSION_WEBHOOK_SECRET
  if (!secret) {
    // Секрет не настроен на сервере — отклоняем, чтобы не принимать неаутентифицированные запросы.
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 })
  }
  const provided = request.headers.get('x-webhook-secret')
  if (!provided || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Валидация тела
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = confirmSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }
  const { code } = parsed.data

  // 3. Находим заявку
  const lead = getLeadByCode(code)
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  // 4. Идемпотентность: если уже подтверждена и выгружена — просто отвечаем ОК.
  const alreadyConverted = lead.status === 'converted'
  if (alreadyConverted && lead.ym_uploaded === 1) {
    return NextResponse.json({ success: true, status: 'already_confirmed' })
  }

  // 5. Помечаем подтверждение (если ещё не подтверждена)
  if (!alreadyConverted) {
    confirmLeadByCode(code)
  }

  // 6. Грузим офлайн-конверсию в Метрику. Безопасно к ошибкам — заявка остаётся
  //    подтверждённой в нашей БД в любом случае; ym_uploaded ставим только при успехе.
  let uploaded = false
  let uploadReason: string | undefined
  if (lead.ym_uploaded !== 1) {
    const res = await uploadOfflineConversion(lead.ym_client_id)
    uploaded = res.ok
    uploadReason = res.reason
    if (res.ok) {
      markLeadUploaded(code)
    }
  } else {
    uploaded = true
  }

  return NextResponse.json({
    success: true,
    status: 'confirmed',
    uploaded,
    ...(uploaded ? {} : { uploadReason }),
  })
}
