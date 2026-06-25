// Хелпер для онлайн-чата (виджет charter-panel.com/widget.js).
// Виджет подключается одним скриптом в app/layout.tsx (см. components/support-chat.tsx)
// и выставляет глобальный объект window.SupportChat с публичным API:
//   SupportChat.open({ name, subject, message })  // открыть + предзаполнить
//   SupportChat.close()
//   SupportChat.on(event, cb)                      // напр. событие 'ready'
//
// Здесь мы оборачиваем open() так, чтобы:
//  1) предзаполнять чат теми же данными, что и "бизнес-ссылку" мессенджера
//     (текст сообщения + тема), и
//  2) корректно обрабатывать случай, когда виджет ещё не успел смонтироваться
//     (open() — no-op, пока instance не готов): пробуем повторно и дополнительно
//     открываем по событию 'ready'.

import { trackLead } from "@/lib/metrika"

interface SupportChatPrefill {
  name?: string
  subject?: string
  message?: string
}

interface SupportChatApi {
  open: (prefill?: SupportChatPrefill) => void
  close: () => void
  on: (event: string, cb: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    SupportChat?: SupportChatApi
  }
}

// Фоновая фиксация лида при переходе в онлайн-чат — тем же эндпоинтом, что и мессенджеры
// (messengerType: 'chat' создаёт lead без round-robin, см. /api/messenger).
// Не блокирует открытие чата и молча игнорирует ошибки.
export function trackLiveChatLead(source?: string, metadata?: Record<string, string>) {
  if (typeof window === "undefined") return

  // Единая цель "ЛИД" в Яндекс.Метрике — на открытие онлайн-чата
  // (та же цель, что и для кликов по мессенджерам).
  trackLead({ channel: "chat", ...(source ? { source } : {}) })

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

// Загружен ли скрипт виджета (глобальный объект уже доступен).
export function isLiveChatReady(): boolean {
  if (typeof window === "undefined") return false
  return typeof window.SupportChat?.open === "function"
}

// Открыть онлайн-чат с предзаполнением. Возвращает Promise<boolean> —
// удалось ли обратиться к виджету (false, если скрипт так и не загрузился).
export function openLiveChat(prefill?: SupportChatPrefill): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false)

  return new Promise((resolve) => {
    const attempt = (triesLeft: number) => {
      const api = window.SupportChat
      if (api && typeof api.open === "function") {
        // Открываем сразу (сработает, если виджет уже готов)…
        api.open(prefill)
        // …и подстраховываемся: повторяем open по событию готовности,
        // если instance смонтировался чуть позже.
        if (typeof api.on === "function") {
          api.on("ready", () => api.open(prefill))
        }
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
