import crypto from 'crypto'

// Уникальный идентификатор клиента для связи визитов и заявок (хранится в cookie).
export function generateClientId(): string {
  return `client_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`
}

// Экранирование для безопасной вставки текста в HTML (например, в Telegram parse_mode=HTML).
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
