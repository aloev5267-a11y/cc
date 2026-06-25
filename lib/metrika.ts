// Единая обёртка над Яндекс.Метрикой для отправки целей (goals).
// ID счётчика — тот же, что и в components/yandex-metrika.tsx
// (переопределяется через NEXT_PUBLIC_YANDEX_METRIKA_ID).
const YM_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '110121319')

// Идентификатор единой цели "ЛИД". В Яндекс.Метрике нужно создать цель
// типа «JavaScript-событие» с идентификатором LEAD — на неё засчитываются
// все обращения пользователя: клик по любому мессенджеру (Telegram / WhatsApp / Max)
// или открытие онлайн-чата.
export const LEAD_GOAL = 'LEAD'

type YmFunction = (id: number, action: string, ...args: unknown[]) => void

declare global {
  interface Window {
    ym?: YmFunction
  }
}

// Отправить достижение произвольной цели в Метрику.
// Молча игнорирует, если счётчик ещё не загружен или произошла ошибка —
// аналитика никогда не должна влиять на работу сайта.
export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try {
    window.ym?.(YM_ID, 'reachGoal', goal, params)
  } catch {
    // no-op
  }
}

// Единая цель "ЛИД": вызывается при любом обращении пользователя
// (клик по мессенджеру или открытие онлайн-чата). params — необязательный
// контекст (канал, источник) для сегментации в отчётах Метрики.
export function trackLead(params?: Record<string, unknown>) {
  reachGoal(LEAD_GOAL, params)
}
