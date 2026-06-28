"use client"

import { useEffect, useState } from "react"
import { IconTelegram, IconVk } from "./icons"
import { useMessengerLink } from "@/hooks/use-messenger"
import { siteConfig } from "@/lib/config"

// Плавающие кнопки быстрой связи — всегда под рукой при скролле.
// Telegram и ВКонтакте имеют равный приоритет: показываем обе кнопки,
// сложенные вертикально. ВКонтакте важен, потому что не блокируется в РФ.
// Появляются после небольшого прокручивания, чтобы не перекрывать hero.
// Размещены слева снизу, чтобы не конфликтовать с виджетом онлайн-чата справа.

type FloatingConfig = {
  type: "telegram" | "vk"
  icon: typeof IconTelegram
  label: string
  bg: string
  fallbackUrl: string
}

const floatingChannels: FloatingConfig[] = [
  {
    type: "telegram",
    icon: IconTelegram,
    label: "Telegram",
    bg: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/30",
    fallbackUrl: siteConfig.social.telegramUrl,
  },
  {
    type: "vk",
    icon: IconVk,
    label: "ВКонтакте",
    bg: "bg-[#0077FF] hover:bg-[#0066e0] shadow-[#0077FF]/30",
    fallbackUrl: siteConfig.social.vkUrl,
  },
]

function FloatingButton({ config, visible }: { config: FloatingConfig; visible: boolean }) {
  const messenger = useMessengerLink(config.type, { source: "floating" })

  // Если в канале нет ни одного менеджера — кнопку не показываем.
  if (!messenger.loading && !messenger.available) return null

  const href = messenger.link || config.fallbackUrl
  const Icon = config.icon

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => messenger.trackClick()}
      aria-label={`Написать в ${config.label}`}
      className={`flex items-center gap-2 h-12 rounded-full text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 ${config.bg} ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
      }`}
      style={{ paddingLeft: "0.875rem", paddingRight: "1.125rem" }}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm">{config.label}</span>
    </a>
  )
}

export function FloatingTelegram() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="fixed left-4 z-40 flex flex-col items-start gap-2"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
    >
      {floatingChannels.map((channel) => (
        <FloatingButton key={channel.type} config={channel} visible={visible} />
      ))}
    </div>
  )
}
