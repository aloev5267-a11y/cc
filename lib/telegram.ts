// Централизованный доступ к Telegram Bot API.
// Базовый адрес настраивается через переменную окружения TELEGRAM_API_BASE,
// что позволяет использовать прокси (актуально для РФ) без правок кода.
// По умолчанию используется официальный адрес Telegram.

const TELEGRAM_API_BASE = (process.env.TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/$/, '')
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export function getTelegramApiUrl(method: string, token?: string): string {
  const botToken = token || TELEGRAM_BOT_TOKEN
  return `${TELEGRAM_API_BASE}/bot${botToken}/${method}`
}

/**
 * Отправить текстовое сообщение в Telegram.
 * Не бросает исключения — ошибки логируются, чтобы не ломать основной поток.
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options: { parseMode?: 'HTML' | 'Markdown'; replyMarkup?: unknown } = {},
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false

  try {
    const res = await fetch(getTelegramApiUrl('sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options.parseMode ?? 'HTML',
        ...(options.replyMarkup ? { reply_markup: options.replyMarkup } : {}),
      }),
    })
    return res.ok
  } catch (error) {
    console.error('[Telegram] sendMessage error:', error)
    return false
  }
}
