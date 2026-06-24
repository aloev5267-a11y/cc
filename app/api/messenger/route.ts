import { NextRequest, NextResponse } from 'next/server'
import { getNextMessengerAccount, peekMessengerAccount, createLead } from '@/lib/db'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { generateClientId } from '@/lib/server-utils'

// Validation schema
// 'chat' — переход в онлайн-чат (например, когда возраст не подошёл под вакансию).
// Для 'chat' аккаунт мессенджера не нужен, но клик всё равно фиксируется как lead.
const messengerRequestSchema = z.object({
  messengerType: z.enum(['telegram', 'whatsapp', 'max', 'chat']),
  // Источник лида (например, "vacancy-quiz"). По умолчанию = тип мессенджера.
  source: z.string().max(60).optional(),
  // Произвольные данные опроса (город, транспорт и т.д.) — до 20 полей.
  metadata: z.record(z.string(), z.string().max(200)).optional(),
})

// GET - получить аккаунт без создания lead (при загрузке страницы)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messengerType = searchParams.get('type') as 'telegram' | 'whatsapp' | 'max'
    
    if (!messengerType || !['telegram', 'whatsapp', 'max'].includes(messengerType)) {
      return NextResponse.json({ error: 'Invalid messenger type' }, { status: 400 })
    }

    // Получаем client ID из cookie
    const cookieStore = await cookies()
    let clientId = cookieStore.get('client_id')?.value
    
    // Если нет — генерируем новый
    if (!clientId) {
      clientId = generateClientId()
    }

    // Показываем менеджера, который СЕЙЧАС стоит в очереди — без сдвига очереди
    // и без создания привязки. Реальный сдвиг происходит только при клике (POST),
    // поэтому каждый следующий клик уходит следующему менеджеру по кругу.
    const account = await peekMessengerAccount(messengerType)

    if (!account) {
      return NextResponse.json({ error: 'No active accounts available' }, { status: 404 })
    }

    const response = NextResponse.json({
      success: true,
      account: {
        id: account.account_id,
        name: account.account_name,
      },
      clientId,
    })

    // Устанавливаем cookie с client ID
    response.cookies.set('client_id', clientId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 год
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Messenger GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - создать lead (только при клике на кнопку)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация
    const result = messengerRequestSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    
    const { messengerType, source, metadata } = result.data

    // Получаем client ID из cookie
    const cookieStore = await cookies()
    let clientId = cookieStore.get('client_id')?.value
    
    if (!clientId) {
      clientId = generateClientId()
    }

    // Для онлайн-чата аккаунт мессенджера не требуется — это отдельный канал.
    let account: Awaited<ReturnType<typeof getNextMessengerAccount>> = null
    if (messengerType !== 'chat') {
      // КАЖДЫЙ клик сдвигает очередь round-robin и уходит следующему менеджеру.
      // Привязка клиента к одному менеджеру больше не используется.
      account = await getNextMessengerAccount(messengerType)
    }

    // Создаём lead при КАЖДОМ клике — даже если аккаунт мессенджера не настроен
    // или это переход в онлайн-чат. Так ни один переход не теряется.
    // source отличает промо-лиды, metadata хранит ответы опроса (JSON).
    const metadataJson =
      metadata && Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : undefined

    await createLead(clientId, source || messengerType, undefined, account?.id, metadataJson)

    const response = NextResponse.json({
      success: true,
      account: account
        ? { id: account.account_id, name: account.account_name }
        : null,
    })

    // Устанавливаем cookie
    response.cookies.set('client_id', clientId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Messenger POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
