"use client"

import { IconTelegram, IconVk, IconWhatsapp, IconMax } from "../icons"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"
import { useMessengerGate } from "../messenger-gate"
import { siteConfig } from "@/lib/config"

export function MessengerPill() {
  const { handleMessengerClick } = useMessengerGate()
  const telegram = useMessengerLink('telegram')
  const vk = useMessengerLink('vk')
  const whatsapp = useMessengerLink('whatsapp')
  const max = useMessengerLink('max')

  const messengers = [
    {
      type: 'telegram' as const,
      icon: IconTelegram,
      href: telegram.link || siteConfig.social.telegramUrl,
      label: "Telegram",
      color: "bg-sky-500/10 text-sky-500 hover:bg-sky-500/20",
      messenger: telegram,
    },
    {
      type: 'vk' as const,
      icon: IconVk,
      href: vk.link || siteConfig.social.vkUrl,
      label: "ВКонтакте",
      color: "bg-[#0077FF]/10 text-[#0077FF] hover:bg-[#0077FF]/20",
      messenger: vk,
    },
    {
      type: 'whatsapp' as const,
      icon: IconWhatsapp,
      href: whatsapp.link || siteConfig.social.whatsappUrl,
      label: "WhatsApp",
      color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      messenger: whatsapp,
    },
    {
      type: 'max' as const,
      icon: IconMax,
      href: max.link || siteConfig.social.maxUrl,
      label: "Max",
      color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      messenger: max,
    },
  ]

  return (
    <div className="flex items-center gap-1">
      {messengers.map((m) => {
        // Идёт загрузка статуса — серая неактивная иконка (без мигания цветом)
        if (m.messenger.loading) {
          return (
            <span
              key={m.label}
              title={`${m.label}`}
              aria-label={`${m.label} — проверяем доступность`}
              aria-busy="true"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-muted text-muted-foreground/40 cursor-default transition-all duration-200"
            >
              <m.icon className="w-4 h-4" />
            </span>
          )
        }
        // Нет менеджеров для мессенджера — неактивная кнопка с уведомлением
        if (!m.messenger.available) {
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => notifyMessengerUnavailable(m.type)}
              title={`${m.label} временно недоступен`}
              aria-label={`${m.label} временно недоступен`}
              aria-disabled="true"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-muted text-muted-foreground/50 cursor-not-allowed transition-all duration-200"
            >
              <m.icon className="w-4 h-4" />
            </button>
          )
        }
        return (
          <a
            key={m.label}
            href={m.href}
            target="_blank"
            rel="noopener noreferrer"
            title={m.label}
            onClick={(e) => handleMessengerClick(e, m.type, m.href, () => m.messenger.trackClick())}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${m.color}`}
          >
            <m.icon className="w-4 h-4" />
          </a>
        )
      })}
    </div>
  )
}
