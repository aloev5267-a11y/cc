"use client"

import { createContext, useContext, useState, useRef, useCallback, useEffect, type MouseEvent, type ReactNode } from "react"
import { useIsRussianIp } from "@/hooks/use-geo"
import { useMessengerLink } from "@/hooks/use-messenger"
import { siteConfig } from "@/lib/config"
import { VpnGateModal } from "./vpn-gate-modal"

// Каналы, которые в России могут не работать без VPN.
type GatedChannel = "telegram" | "whatsapp"
const GATED_CHANNELS = new Set<string>(["telegram", "whatsapp"])

// Ключ сессии: один раз подтвердив наличие VPN, посетитель больше не видит окно.
const CONFIRM_KEY = "vpn-confirmed"

type GateHandler = (
  e: MouseEvent,
  channel: string,
  href: string,
  track: () => void,
) => void

const MessengerGateContext = createContext<{ handleMessengerClick: GateHandler }>({
  // По умолчанию (без провайдера) — обычное поведение: отправляем цель и переходим по ссылке.
  handleMessengerClick: (_e, _channel, _href, track) => track(),
})

export function useMessengerGate() {
  return useContext(MessengerGateContext)
}

export function MessengerGateProvider({ children }: { children: ReactNode }) {
  const isRussia = useIsRussianIp()
  // Запасной канал без VPN — берём актуальный аккаунт ВКонтакте из админки.
  const vk = useMessengerLink("vk")

  const [confirmed, setConfirmed] = useState(false)
  const [open, setOpen] = useState(false)
  const [channel, setChannel] = useState<GatedChannel>("telegram")
  // Отложенное действие: переход + отправка цели, выполняется после подтверждения VPN.
  const pendingRef = useRef<(() => void) | null>(null)

  // Восстанавливаем подтверждение из сессии.
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.sessionStorage.getItem(CONFIRM_KEY) === "1") setConfirmed(true)
  }, [])

  const handleMessengerClick = useCallback<GateHandler>(
    (e, ch, href, track) => {
      // Гейтим только Telegram/WhatsApp, только для РФ и только до подтверждения VPN.
      if (isRussia && GATED_CHANNELS.has(ch) && !confirmed) {
        e.preventDefault()
        pendingRef.current = () => {
          track()
          window.open(href, "_blank", "noopener,noreferrer")
        }
        setChannel(ch as GatedChannel)
        setOpen(true)
        return
      }
      // Обычный путь — цель уходит сразу, переход по href происходит штатно.
      track()
    },
    [isRussia, confirmed],
  )

  const handleConfirm = useCallback(() => {
    setConfirmed(true)
    if (typeof window !== "undefined") window.sessionStorage.setItem(CONFIRM_KEY, "1")
    setOpen(false)
    // Выполняем отложенный переход в том же пользовательском жесте (клик по кнопке),
    // поэтому всплывающее окно не блокируется браузером.
    const proceed = pendingRef.current
    pendingRef.current = null
    if (proceed) proceed()
  }, [])

  const handleDismiss = useCallback(() => {
    pendingRef.current = null
    setOpen(false)
  }, [])

  return (
    <MessengerGateContext.Provider value={{ handleMessengerClick }}>
      {children}
      <VpnGateModal
        open={open}
        channel={channel}
        onConfirm={handleConfirm}
        onDismiss={handleDismiss}
        vkHref={vk.link || siteConfig.social.vkUrl}
        onVkClick={() => vk.trackClick()}
      />
    </MessengerGateContext.Provider>
  )
}
