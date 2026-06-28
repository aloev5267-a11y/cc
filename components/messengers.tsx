"use client"

import { toast } from "sonner"
import { IconTelegram, IconVk, IconWhatsapp, IconMax, IconHeadphones } from "./icons"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"
import { openLiveChat, trackLiveChatLead } from "@/lib/livechat"
import { ChatWithNotification } from "./chat-with-notification"
import { siteConfig } from "@/lib/config"

// Кнопки перехода в мессенджеры. Telegram и ВКонтакте — два равноправных
// приоритетных канала: оба вынесены в крупные главные кнопки. ВКонтакте важен,
// потому что не блокируется в РФ и открывается без VPN. WhatsApp, Max и
// онлайн-чат показаны компактным вторичным рядом ниже.
//
// GET подтягивает аккаунт из БД (round-robin), клик создаёт заявку через trackClick
// и сохраняет ответы опроса (metadata) на сервере.

export type MessengersOptions = {
  message?: string
  metadata?: Record<string, string>
  source?: string
  // Метка страницы (например, "courier").
  page?: string
}

const secondaryConfig = {
  whatsapp: {
    icon: IconWhatsapp,
    label: "WhatsApp",
    accent: "text-green-600",
    fallbackUrl: siteConfig.social.whatsappUrl,
  },
  max: {
    icon: IconMax,
    label: "Max",
    accent: "text-violet-600",
    fallbackUrl: siteConfig.social.maxUrl,
  },
} as const

type SecondaryType = keyof typeof secondaryConfig

// Telegram игнорирует ?text= для личных аккаунтов, а у Max своего параметра нет.
// Предзаполнение текста работает только в WhatsApp — туда и добавляем.
function withText(url: string, type: SecondaryType, message?: string) {
  if (type !== "whatsapp" || !message) return url
  return `${url}${url.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}`
}

// ============ Главные кнопки (Telegram и ВКонтакте) ============
// Telegram и ВКонтакте имеют равный приоритет — оба показаны крупными кнопками.
const primaryConfig = {
  telegram: {
    icon: IconTelegram,
    label: "Написать в Telegram",
    subtitle: "Обычно отвечаем за пару минут",
    unavailableLabel: "Telegram временно недоступен",
    // Бренд Telegram (голубой).
    bg: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/25",
    fallbackUrl: siteConfig.social.telegramUrl,
  },
  vk: {
    icon: IconVk,
    label: "Написать ВКонтакте",
    subtitle: "Работает без VPN — отвечаем быстро",
    unavailableLabel: "ВКонтакте временно недоступен",
    // Бренд ВКонтакте (синий).
    bg: "bg-[#0077FF] hover:bg-[#0066e0] shadow-[#0077FF]/25",
    fallbackUrl: siteConfig.social.vkUrl,
  },
} as const

type PrimaryType = keyof typeof primaryConfig

function PrimaryButton({ type, options }: { type: PrimaryType; options?: MessengersOptions }) {
  const messenger = useMessengerLink(type, options)
  const config = primaryConfig[type]

  // Нет ни одного менеджера в канале — мягко предлагаем другой.
  if (!messenger.loading && !messenger.available) {
    return (
      <button
        type="button"
        onClick={() => notifyMessengerUnavailable(type)}
        aria-disabled="true"
        className="flex items-center justify-center gap-3 min-h-16 py-3 px-5 rounded-2xl font-bold bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
      >
        <config.icon className="w-6 h-6 shrink-0" />
        <span className="text-sm">{config.unavailableLabel}</span>
      </button>
    )
  }

  const href = messenger.link || config.fallbackUrl

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => messenger.trackClick()}
      className={`group flex items-center gap-3 sm:gap-4 min-h-16 py-3 px-4 sm:px-5 rounded-2xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.01] ${config.bg}`}
    >
      <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 shrink-0">
        <config.icon className="w-6 h-6" />
      </span>
      <span className="flex flex-col text-left leading-tight min-w-0 flex-1">
        <span className="text-base sm:text-lg">{config.label}</span>
        <span className="text-xs font-medium text-white/85 mt-0.5">{config.subtitle}</span>
      </span>
      <span className="text-xl shrink-0 transition-transform group-hover:translate-x-1">{"\u2192"}</span>
    </a>
  )
}

// ============ Вторичные кнопки мессенджеров ============
function SecondaryButton({ type, options }: { type: SecondaryType; options?: MessengersOptions }) {
  const messenger = useMessengerLink(type, options)
  const config = secondaryConfig[type]

  if (!messenger.loading && !messenger.available) {
    return (
      <button
        type="button"
        onClick={() => notifyMessengerUnavailable(type)}
        aria-disabled="true"
        className="flex flex-col items-center justify-center gap-1.5 min-h-16 py-2.5 px-2 rounded-xl text-xs font-semibold text-center border border-border bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
      >
        <config.icon className={`w-5 h-5 ${config.accent}`} />
        <span>{config.label}</span>
      </button>
    )
  }

  const fallback = withText(config.fallbackUrl, type, options?.message)

  return (
    <a
      href={messenger.link || fallback}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => messenger.trackClick()}
      className="flex flex-col items-center justify-center gap-1.5 min-h-16 py-2.5 px-2 rounded-xl text-xs font-semibold text-center border border-border bg-card text-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-muted"
    >
      <config.icon className={`w-5 h-5 ${config.accent}`} />
      <span>{config.label}</span>
    </a>
  )
}

// Кнопка онлайн-чата (LiveChat). Вторичный канал в общем ряду.
// Открытие чата возможно ТОЛЬКО после разрешения уведомлений — логика вынесена
// в обёртку ChatWithNotification (жёсткий режим).
function LiveChatButton({ options }: { options?: MessengersOptions }) {
  const subject = options?.source || options?.page || "Заявка с сайта"

  // Фактическое открытие чата. Вызывается обёрткой только при наличии разрешения.
  const openChat = async () => {
    const opened = await openLiveChat({ subject, message: options?.message })
    if (!opened) {
      toast.error("Онлайн-чат пока недоступен", {
        description: "Чат не успел загрузиться. Пожалуйста, напишите нам в Telegram выше.",
      })
    }
    return opened
  }

  return (
    <ChatWithNotification
      onOpenChat={openChat}
      onBeforeOpen={() => trackLiveChatLead(options?.source, options?.metadata)}
    >
      {({ open, opening }) => (
        <button
          type="button"
          onClick={open}
          aria-busy={opening}
          className="flex flex-col items-center justify-center gap-1.5 min-h-16 py-2.5 px-2 rounded-xl text-xs font-semibold text-center border border-border bg-card text-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-muted"
        >
          <IconHeadphones className="w-5 h-5 text-primary" />
          <span>Онлайн-чат</span>
        </button>
      )}
    </ChatWithNotification>
  )
}

export function Messengers({ options }: { options?: MessengersOptions }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Два равноправных главных канала: Telegram и ВКонтакте */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <PrimaryButton type="telegram" options={options} />
        <PrimaryButton type="vk" options={options} />
      </div>
      {/* Вторичные каналы */}
      <div className="grid grid-cols-3 gap-2">
        <SecondaryButton type="whatsapp" options={options} />
        <SecondaryButton type="max" options={options} />
        <LiveChatButton options={options} />
      </div>
    </div>
  )
}
