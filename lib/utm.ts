"use client"

// Захват и хранение рекламных меток (UTM + Яндекс/Google click id).
// Метки сохраняются в sessionStorage при первом заходе и затем прикрепляются
// к лидам — так в Метрике и в уведомлении менеджеру видно, с какой кампании
// и объявления пришёл человек.

const STORAGE_KEY = "elwork-utm"

export interface UtmData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  yclid?: string // Яндекс.Директ click id
  gclid?: string // Google Ads click id
  landing?: string // первая страница входа
  referrer?: string // источник перехода
}

const UTM_KEYS: (keyof UtmData)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "yclid",
  "gclid",
]

// Вызывается один раз при загрузке приложения. Если в URL есть метки —
// сохраняем их (вместе с лендингом и реферером). Первый источник не
// перезатираем повторными заходами внутри сессии.
export function captureUtm(): void {
  if (typeof window === "undefined") return

  try {
    const params = new URLSearchParams(window.location.search)
    const captured: UtmData = {}
    let hasAny = false

    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) {
        captured[key] = value.slice(0, 200)
        hasAny = true
      }
    }

    const existing = getUtm()

    // Сохраняем, только если в этой сессии меток ещё не было,
    // либо в новом URL действительно есть рекламные метки.
    if (hasAny || !existing) {
      const data: UtmData = {
        ...captured,
        landing: existing?.landing || window.location.pathname,
        referrer: existing?.referrer || document.referrer || undefined,
      }
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  } catch {
    // sessionStorage может быть недоступен — молча игнорируем.
  }
}

export function getUtm(): UtmData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UtmData) : null
  } catch {
    return null
  }
}

// Плоский объект меток для прикрепления к параметрам цели Метрики или к телу запроса.
export function getUtmParams(): Record<string, string> {
  const utm = getUtm()
  if (!utm) return {}
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(utm)) {
    if (value) out[key] = value
  }
  return out
}
