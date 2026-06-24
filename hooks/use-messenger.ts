"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'

interface MessengerAccount {
  id: string
  name: string
}

type MessengerType = 'telegram' | 'whatsapp' | 'max'

// Человекочитаемые названия мессенджеров для уведомлений
const messengerLabels: Record<MessengerType, string> = {
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  max: 'Max',
}

// Уведомление при попытке открыть мессенджер, для которого в админке не добавлен ни один менеджер.
// Просим написать в другой (активный) мессенджер.
export function notifyMessengerUnavailable(type: MessengerType) {
  const label = messengerLabels[type] ?? 'Этот мессенджер'
  toast.error(`${label} пока недоступен`, {
    description: 'К сожалению, сейчас этот мессенджер не подключён. Пожалуйста, напишите нам в другой мессенджер.',
  })
}

// Опции для формирования "бизнес-ссылки" с предзаполненными данными.
// message — текст, который подставится в окно чата (работает в WhatsApp и Telegram-ботах).
// metadata — ответы опроса (город, транспорт и т.д.), сохраняются в lead.
// source — метка источника лида (например, "vacancy-quiz").
interface MessengerLinkOptions {
  message?: string
  metadata?: Record<string, string>
  source?: string
}

export function useMessengerLink(
  type: MessengerType,
  options?: MessengerLinkOptions,
) {
  const [account, setAccount] = useState<MessengerAccount | null>(null)
  const [loading, setLoading] = useState(true)
  // Есть ли вообще активные менеджеры для этого мессенджера.
  // Оптимистично true, пока грузим; становится false только при 404 (нет менеджеров).
  const [available, setAvailable] = useState(true)

  const baseMessage = options?.message
  const metadata = options?.metadata
  const source = options?.source

  // Текст сообщения для предзаполнения чата. Если базовый текст не задан —
  // подставляем короткое приветствие.
  const message = useMemo(() => {
    if (baseMessage && baseMessage.trim().length > 0) {
      return baseMessage
    }
    return 'Здравствуйте!'
  }, [baseMessage])

  // GET запрос — только получает текущего менеджера из очереди, не создаёт lead и не сдвигает очередь
  const fetchAccount = useCallback(() => {
    // Проверяем что мы на клиенте
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    fetch(`/api/messenger?type=${type}`, {
      method: 'GET',
      credentials: 'include', // Важно для cookie
    })
      .then(res => {
        // 404 — для этого мессенджера не добавлено ни одного менеджера
        if (res.status === 404) {
          setAvailable(false)
          throw new Error('No account')
        }
        if (!res.ok) throw new Error('No account')
        return res.json()
      })
      .then(data => {
        if (data.success) {
          setAccount(data.account)
          setAvailable(true)
        }
      })
      .catch(() => {
        // Молча — аккаунт не настроен
      })
      .finally(() => setLoading(false))
  }, [type])

  // Загрузка аккаунта при монтировании
  useEffect(() => {
    fetchAccount()
  }, [fetchAccount])

  // Функция для создания lead (вызывается при клике).
  // POST отправляется ВСЕГДА — даже если аккаунт ещё не загрузился или не настроен,
  // чтобы ни один переход в мессенджер не потерялся (серверная фиксация лида).
  const trackClick = useCallback(() => {
    // Фоном создаём заявку. Переход в мессенджер происходит мгновенно через href —
    // этот POST его не задерживает.
    fetch('/api/messenger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        messengerType: type,
        ...(source ? { source } : {}),
        ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {}),
      }),
    })
      .then(() => {
        // Очередь сдвинулась — подтягиваем следующего менеджера, чтобы
        // следующий клик ушёл уже ему (чередование на каждый клик).
        fetchAccount()
      })
      .catch(() => {
        // Ошибка трекинга не должна мешать переходу
      })
  }, [type, metadata, source, fetchAccount])

  const getLink = useCallback(() => {
    if (!account) return null
    // Предзаполненный текст сообщения (бизнес-ссылка)
    const encoded = message ? encodeURIComponent(message) : null
    switch (type) {
      case 'telegram':
        return encoded ? `https://t.me/${account.id}?text=${encoded}` : `https://t.me/${account.id}`
      case 'whatsapp':
        return encoded ? `https://wa.me/${account.id}?text=${encoded}` : `https://wa.me/${account.id}`
      case 'max':
        return `https://max.ru/${account.id}`
      default:
        return null
    }
  }, [account, type, message])

  return { account, loading, available, link: getLink(), trackClick }
}
