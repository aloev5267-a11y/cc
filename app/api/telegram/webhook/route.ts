import { NextRequest, NextResponse } from 'next/server'
import { getChat, addMessage, updateChatStatus, getActiveChatByManagerTelegramId } from '@/lib/db'
import { checkRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { sendTelegramMessage } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    // Rate limit for webhook (using Telegram's IP as identifier would be ideal)
    const rateLimitResult = checkRateLimit(request, rateLimitConfigs.telegramWebhook, 'telegram_webhook')
    if (!rateLimitResult.success) {
      // Still return 200 to Telegram to prevent retries
      console.warn('[Telegram Webhook] Rate limit exceeded')
      return NextResponse.json({ ok: true })
    }

    const update = await request.json()

    // Handle callback_query (button clicks)
    if (update.callback_query) {
      const { data, from } = update.callback_query
      const managerId = from.id.toString()

      if (typeof data === 'string' && data.startsWith('connect_')) {
        const chatId = data.replace('connect_', '')
        const chat = await getChat(chatId)

        if (chat && chat.status === 'waiting') {
          await updateChatStatus(chatId, 'active', managerId)
          
          const managerName = from.first_name || 'менеджер'
          await addMessage(chatId, 'manager', `Добрый день! Меня зовут ${managerName}, я помогу вам с трудоустройством. Чем могу помочь?`)
          
          await sendTelegramMessage(
            managerId,
            `✅ Вы подключились к диалогу с ${chat.user_name}\n\nТеперь все ваши сообщения будут отправляться клиенту.`
          )
        } else {
          await sendTelegramMessage(
            managerId,
            '❌ Этот диалог уже взял другой менеджер или он был закрыт.'
          )
        }
      }

      if (typeof data === 'string' && data.startsWith('disconnect_')) {
        const chatId = data.replace('disconnect_', '')
        
        await updateChatStatus(chatId, 'closed')
        await addMessage(chatId, 'system', 'Диалог завершён. Спасибо за обращение!')
        
        await sendTelegramMessage(
          managerId,
          '✅ Диалог завершён.'
        )
      }

      return NextResponse.json({ ok: true })
    }

    // Handle text messages from manager
    if (update.message && update.message.text) {
      const managerId = update.message.from.id.toString()
      const text = update.message.text

      // Ignore commands
      if (text.startsWith('/')) {
        return NextResponse.json({ ok: true })
      }

      // Find active chat for this manager
      const activeChat = await getActiveChatByManagerTelegramId(managerId)

      if (activeChat) {
        await addMessage(activeChat.id, 'manager', text)
      }

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Telegram Webhook] Error:', error)
    // Return 200 to prevent Telegram from retrying
    return NextResponse.json({ ok: true })
  }
}

// GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook is active' })
}
