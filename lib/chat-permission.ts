// Управление разрешением на push-уведомления как обязательным условием
// для открытия онлайн-чата.
//
// Бизнес-логика (жёсткий режим): онлайн-чат открывается ТОЛЬКО если пользователь
// дал браузеру разрешение на уведомления (Notification.permission === "granted").
// Без разрешения чат не открывается — это сделано намеренно, чтобы менеджер
// гарантированно мог достучаться до соискателя пуш-уведомлением о новой вакансии
// или ответе в чате.

export type ChatPermissionState =
  // Браузер не поддерживает Notification API — чат разрешаем (не блокируем
  // пользователей старых браузеров), но запросить разрешение нельзя.
  | "unsupported"
  // Разрешение ещё не запрашивалось — можно показать запрос.
  | "default"
  // Пользователь разрешил уведомления — чат доступен.
  | "granted"
  // Пользователь запретил уведомления — чат заблокирован, нужно включить
  // уведомления в настройках браузера.
  | "denied"

// Поддерживает ли окружение Notification API.
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window
}

// Текущее состояние разрешения.
export function getChatPermissionState(): ChatPermissionState {
  if (!isNotificationSupported()) return "unsupported"
  return Notification.permission as ChatPermissionState
}

// Разрешён ли сейчас доступ к чату.
// В жёстком режиме: только при granted (или unsupported — старые браузеры
// не должны полностью терять возможность обращения).
export function canUseChat(): boolean {
  const state = getChatPermissionState()
  return state === "granted" || state === "unsupported"
}

// Запросить разрешение на уведомления у браузера.
// Возвращает финальное состояние после ответа пользователя.
export async function requestChatPermission(): Promise<ChatPermissionState> {
  if (!isNotificationSupported()) return "unsupported"

  // Если уже определено — возвращаем как есть, повторный запрос браузер
  // проигнорирует.
  if (Notification.permission !== "default") {
    return Notification.permission as ChatPermissionState
  }

  try {
    const result = await Notification.requestPermission()
    return result as ChatPermissionState
  } catch {
    // Некоторые браузеры (старый Safari) используют колбэк-форму —
    // подстраховываемся и считаем, что разрешение не получено.
    return getChatPermissionState()
  }
}
