"use client"

import { IconTelegram, IconWhatsapp, IconMax } from "./icons"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"
import { siteConfig } from "@/lib/config"

// Кнопки перехода в мессенджеры — повторяют рабочий паттерн сайта:
// GET подтягивает аккаунт из БД (round-robin), клик создаёт заявку через trackClick.
// Опционально формируют "бизнес-ссылку" с предзаполненным сообщением и сохраняют ответы опроса.

export type MessengersOptions = {
  message?: string
  metadata?: Record<string, string>
  source?: string
  // Метка страницы (например, "courier").
  page?: string
}

const messengerConfig = {
  telegram: {
    icon: IconTelegram,
    label: "Telegram",
    color: "bg-sky-500 text-white hover:bg-sky-600",
    fallbackUrl: siteConfig.social.telegramUrl,
  },
  whatsapp: {
    icon: IconWhatsapp,
    label: "WhatsApp",
    color: "bg-green-500 text-white hover:bg-green-600",
    fallbackUrl: siteConfig.social.whatsappUrl,
  },
  max: {
    icon: IconMax,
    label: "Max",
    color: "bg-violet-500 text-white hover:bg-violet-600",
    fallbackUrl: siteConfig.social.maxUrl,
  },
} as const

function MessengerButton({ type, options }: { type: "telegram" | "whatsapp" | "max"; options?: MessengersOptions }) {
  const messenger = useMessengerLink(type, options)
  const config = messengerConfig[type]

  // Если для этого мессенджера не добавлено ни одного менеджера — кнопка неактивна,
  // по клику показываем уведомление с просьбой написать в другой мессенджер.
  if (!messenger.loading && !messenger.available) {
    return (
      <button
        type="button"
        onClick={() => notifyMessengerUnavailable(type)}
        aria-disabled="true"
        className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl font-bold bg-muted text-muted-foreground opacity-60 cursor-not-allowed transition-all"
      >
        <config.icon className="w-5 h-5 shrink-0" />
        <span className="truncate">{config.label}</span>
      </button>
    )
  }

  // Если аккаунт из БД не загрузился — используем запасную ссылку, но тоже с предзаполненным текстом
  const fallbackWithText =
    options?.message && config.fallbackUrl
      ? `${config.fallbackUrl}${config.fallbackUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent(options.message)}`
      : config.fallbackUrl

  return (
    <a
      href={messenger.link || fallbackWithText}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        // Создаём заявку в БД (фиксируем переход в мессенджер).
        messenger.trackClick()
      }}
      className={`flex items-center justify-center gap-2 h-12 px-4 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] ${config.color}`}
    >
      <config.icon className="w-5 h-5 shrink-0" />
      <span className="truncate">{config.label}</span>
    </a>
  )
}

export function Messengers({ options }: { options?: MessengersOptions }) {
  return (
    <div className="flex flex-col gap-2.5">
      <MessengerButton type="telegram" options={options} />
      <MessengerButton type="whatsapp" options={options} />
      <MessengerButton type="max" options={options} />
    </div>
  )
}
