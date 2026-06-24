"use client"

import { useEffect } from "react"
import { siteConfig } from "@/lib/config"

interface SupportChatProps {
  // Необязательное переопределение ключа виджета. Если не задан — берётся из БД
  // (через /api/livechat-config), что позволяет менять ключ из админки без деплоя.
  apiKey?: string
}

const SCRIPT_ID = "support-chat-widget"

// First-party загрузчик онлайн-чата. Скрипт виджета подгружается с нашего домена
// по пути /__support/livechat.js (rewrite-прокси, см. next.config.mjs), поэтому в
// разметке нет прямой ссылки на домен провайдера. Ключ берётся из админки (БД).
export function SupportChat({ apiKey }: SupportChatProps) {
  useEffect(() => {
    let cancelled = false

    async function mount() {
      // Уже смонтирован — повторно не вставляем.
      if (document.getElementById(SCRIPT_ID)) return

      let key = apiKey
      let scriptPath = siteConfig.livechat.scriptPath

      // Если ключ не передан пропом — тянем публичную конфигурацию (управляется из админки).
      if (!key) {
        try {
          const res = await fetch("/api/livechat-config", { cache: "no-store" })
          if (res.ok) {
            const data = (await res.json()) as {
              enabled?: boolean
              apiKey?: string
              scriptPath?: string
            }
            if (!data.enabled) return // Чат выключен в админке.
            key = data.apiKey
            if (data.scriptPath) scriptPath = data.scriptPath
          }
        } catch {
          // Сеть/БД недоступны — молча выходим, без чата страница работает.
          return
        }
      }

      if (cancelled || !key || document.getElementById(SCRIPT_ID)) return

      const script = document.createElement("script")
      script.id = SCRIPT_ID
      script.src = scriptPath
      script.async = true
      script.setAttribute("data-omnidesk-key", key)
      document.body.appendChild(script)
    }

    void mount()

    return () => {
      cancelled = true
    }
  }, [apiKey])

  return null
}
