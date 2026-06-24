// Серверная фиксация перехода в онлайн-чат с промо-страницы.
// Используется, например, когда возраст не подошёл под вакансию и мы предлагаем чат.
// Записывает lead через тот же /api/messenger (тип 'chat'), чтобы клик не потерялся.
export function recordChatLead(source: string, metadata?: Record<string, string>) {
  if (typeof window === "undefined") return
  try {
    fetch("/api/messenger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        messengerType: "chat",
        source,
        ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {}),
      }),
    }).catch(() => {
      // Ошибка трекинга не должна мешать открытию чата
    })
  } catch {
    // no-op
  }
}
