// Серверная выгрузка офлайн-конверсий в Яндекс.Метрику.
//
// Используется для атрибуции конверсии "человек написал в мессенджер" к конкретному
// посетителю по его ClientID. Конверсия засчитывается не по клику, а только после
// подтверждения от внешней системы (вебхук /api/leads/confirm).
//
// Документация: Management API → offline_conversions/upload (client_id_type=CLIENT_ID).

const COUNTER_ID = process.env.YANDEX_METRIKA_COUNTER_ID || '109455099'
const OAUTH_TOKEN = process.env.YANDEX_OAUTH_TOKEN
// Идентификатор цели офлайн-конверсии в Метрике (создаётся один раз в настройках счётчика).
const TARGET = process.env.YANDEX_CONVERSION_TARGET || 'messenger_lead'

export interface OfflineConversionResult {
  ok: boolean
  // Причина неуспеха (для логов/админки), без выброса исключений наружу.
  reason?: string
}

/**
 * Загружает одну офлайн-конверсию в Яндекс.Метрику по ClientID.
 * Безопасна к ошибкам: никогда не бросает исключение — возвращает { ok, reason }.
 *
 * @param ymClientId ClientID Метрики, захваченный в браузере на клике.
 * @param dateTimeSec Время конверсии в Unix-секундах (по умолчанию — сейчас).
 */
export async function uploadOfflineConversion(
  ymClientId: string | null | undefined,
  dateTimeSec?: number,
): Promise<OfflineConversionResult> {
  if (!OAUTH_TOKEN) {
    return { ok: false, reason: 'no_oauth_token' }
  }
  if (!ymClientId) {
    return { ok: false, reason: 'no_client_id' }
  }

  const when = dateTimeSec ?? Math.floor(Date.now() / 1000)

  // CSV строго по формату Метрики: заголовок + одна строка данных.
  const csv = `ClientId,Target,DateTime\n${ymClientId},${TARGET},${when}\n`

  const url =
    `https://api-metrika.yandex.net/management/v1/counter/${COUNTER_ID}` +
    `/offline_conversions/upload?client_id_type=CLIENT_ID`

  try {
    // multipart/form-data с полем "file" — как требует Management API.
    const form = new FormData()
    form.append('file', new Blob([csv], { type: 'text/csv' }), 'conversions.csv')

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `OAuth ${OAUTH_TOKEN}`,
      },
      body: form,
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, reason: `http_${res.status}:${text.slice(0, 200)}` }
    }

    return { ok: true }
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'unknown_error'
    return { ok: false, reason }
  }
}
