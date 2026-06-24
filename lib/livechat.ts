// Хелпер для онлайн-чата Omnidesk. Виджет грузится first-party через прокси
// /__support/livechat.js (см. next.config.mjs и components/support-chat.tsx).
// Виджет подключается в app/layout.tsx и выставляет глобальный объект
// window.OmnideskLiveChat с публичным API:
//   OmnideskLiveChat.open({ name, subject, message })  // открыть + предзаполнить
//   OmnideskLiveChat.close()
//   OmnideskLiveChat.on(event, cb)
//
// Здесь мы оборачиваем open() так, чтобы:
//  1) предзаполнять чат теми же данными, что и "бизнес-ссылку" мессенджера
//     (текст сообщения + тема), и
//  2) корректно обрабатывать случай, когда виджет ещё не успел смонтироваться
//     (open() — no-op, пока instance не готов), делая несколько повторных попыток.

interface OmnideskPrefill {
  name?: string
  subject?: string
  message?: string
}

interface OmnideskLiveChatApi {
  open: (prefill?: OmnideskPrefill) => void
  close: () => void
  on: (event: string, cb: (...args: unknown[]) => void) => void
  readonly instance: unknown
}

declare global {
  interface Window {
    OmnideskLiveChat?: OmnideskLiveChatApi
  }
}

// Фоновая фиксация лида при переходе в онлайн-чат — тем же эндпоинтом, что и мессенджеры
// (messengerType: 'chat' создаёт lead без round-robin, см. /api/messenger).
// Не блокирует открытие чата и молча игнорирует ошибки.
export function trackLiveChatLead(source?: string, metadata?: Record<string, string>) {
  if (typeof window === "undefined") return
  fetch("/api/messenger", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      messengerType: "chat",
      ...(source ? { source } : {}),
      ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {}),
    }),
  }).catch(() => {
    // Ошибка трекинга не должна мешать открытию чата.
  })
}

// Готов ли виджет принять команду open (скрипт загружен и инстанс смонтирован).
export function isLiveChatReady(): boolean {
  if (typeof window === "undefined") return false
  const api = window.OmnideskLiveChat
  return !!(api && api.instance)
}

// Открыть онлайн-чат с предзаполнением. Возвращает Promise<boolean> —
// удалось ли открыть виджет (false, если скрипт так и не загрузился).
export function openLiveChat(prefill?: OmnideskPrefill): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false)

  return new Promise((resolve) => {
    const attempt = (triesLeft: number) => {
      const api = window.OmnideskLiveChat
      // Инстанс смонтирован — открываем с предзаполнением.
      if (api && api.instance) {
        api.open(prefill)
        resolve(true)
        return
      }
      // Скрипт ещё грузится — ждём и пробуем снова (до ~5 секунд).
      if (triesLeft <= 0) {
        resolve(false)
        return
      }
      setTimeout(() => attempt(triesLeft - 1), 250)
    }
    attempt(20)
  })
}
