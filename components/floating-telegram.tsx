"use client"

import { useEffect, useState } from "react"
import { IconTelegram } from "./icons"
import { useMessengerLink } from "@/hooks/use-messenger"
import { siteConfig } from "@/lib/config"

// Плавающая кнопка «Написать в Telegram» — всегда под рукой при скролле.
// Появляется после небольшого прокручивания, чтобы не перекрывать hero.
// Размещена слева снизу, чтобы не конфликтовать с виджетом онлайн-чата справа.
export function FloatingTelegram() {
  const [visible, setVisible] = useState(false)
  const messenger = useMessengerLink("telegram", { source: "floating" })

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Если в Telegram нет ни одного менеджера — кнопку не показываем.
  if (!messenger.loading && !messenger.available) return null

  const href = messenger.link || siteConfig.social.telegramUrl

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => messenger.trackClick()}
      aria-label="Написать в Telegram"
      className={`fixed left-4 z-40 flex items-center gap-2 h-12 rounded-full bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/30 transition-all duration-300 hover:bg-sky-600 hover:scale-105 ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
      }`}
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)", paddingLeft: "0.875rem", paddingRight: "1.125rem" }}
    >
      <IconTelegram className="w-5 h-5 shrink-0" />
      <span className="text-sm">Telegram</span>
    </a>
  )
}
