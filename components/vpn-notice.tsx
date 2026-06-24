"use client"

import { IconShield } from "./icons"
import { useIsRussianIp } from "@/hooks/use-geo"

// Уведомление для посетителей из России: мессенджеры могут быть недоступны
// из-за блокировок, поэтому просим включить VPN и обещаем бонус за обращение.
// Рендерится только если IP определён как российский.
export function VpnNotice() {
  const isRussia = useIsRussianIp()

  if (!isRussia) return null

  return (
    <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-left">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <IconShield className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-white">
            Включите VPN, чтобы написать нам
          </p>
          <p className="mt-1 text-pretty text-xs leading-relaxed text-white/70">
            Из-за блокировок Telegram и WhatsApp в России могут не открываться напрямую.
            Включите любой бесплатный VPN (или скачайте его из App Store / Google Play),
            затем напишите нам в мессенджер — специалист{" "}
            <span className="font-bold text-primary">ответит в течение рабочего дня</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
