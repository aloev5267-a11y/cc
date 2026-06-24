// Хелпер для управления онлайн-чатом Omnidesk (charter-panel livechat.js).
//
// Виджет подключается асинхронным скриптом и кладёт в window глобальный объект
// (обычно window.OmnideskLiveChat). Точный набор методов у кастомного виджета
// заранее неизвестен, поэтому открываем чат и передаём текст максимально
// устойчиво: перебираем вероятные имена методов и тихо игнорируем ошибки.
//
// Если виджет ещё не загрузился — ждём его появления небольшим опросом.

type ChatApi = Record<string, unknown> & {
  on?: (event: string, cb: () => void) => void
}

const OPEN_METHODS = ["open", "show", "openChat", "expand", "maximize", "toggle"]
const MESSAGE_METHODS = ["sendMessage", "setMessage", "setText", "prefill", "writeMessage", "setInput"]

function getChat(): ChatApi | null {
  if (typeof window === "undefined") return null
  const w = window as unknown as { OmnideskLiveChat?: ChatApi; omnideskLiveChat?: ChatApi }
  return w.OmnideskLiveChat ?? w.omnideskLiveChat ?? null
}

function call(chat: ChatApi, methods: string[], arg?: string): boolean {
  for (const name of methods) {
    const fn = chat[name]
    if (typeof fn === "function") {
      try {
        ;(fn as (...a: unknown[]) => unknown).call(chat, ...(arg !== undefined ? [arg] : []))
        return true
      } catch {
        // пробуем следующий метод
      }
    }
  }
  return false
}

/**
 * Открывает онлайн-чат и (по возможности) подставляет текст сообщения.
 * Возвращает true, если чат удалось открыть.
 */
export function openLiveChat(message?: string): boolean {
  let attempts = 0
  const maxAttempts = 20 // ~5 секунд при интервале 250мс

  const tryOpen = (): boolean => {
    const chat = getChat()
    if (!chat) return false

    const opened = call(chat, OPEN_METHODS)

    // Текст подставляем после открытия — даём виджету отрисовать поле ввода
    if (message) {
      call(chat, MESSAGE_METHODS, message)
      setTimeout(() => {
        const c = getChat()
        if (c) call(c, MESSAGE_METHODS, message)
      }, 600)
    }

    return opened
  }

  if (tryOpen()) return true

  // Виджет мог ещё не загрузиться — ждём и пробуем снова
  const interval = setInterval(() => {
    attempts++
    if (tryOpen() || attempts >= maxAttempts) {
      clearInterval(interval)
    }
  }, 250)

  return false
}
