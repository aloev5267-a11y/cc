"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconClose, IconCheck, IconShield, IconVk } from "./icons"

// Модальное окно «мягкой» проверки VPN для посетителей из России.
// Telegram и WhatsApp могут не открываться без VPN, поэтому при клике на них
// мы не переходим сразу, а спрашиваем: «У вас включён VPN?».
// Переход (и отправка цели в Метрику) происходит ТОЛЬКО после подтверждения.
// Альтернатива без VPN — кнопка «Написать ВКонтакте».

type GatedChannel = "telegram" | "whatsapp"

const channelLabels: Record<GatedChannel, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
}

type VpnGateModalProps = {
  open: boolean
  channel: GatedChannel
  // Пользователь подтвердил, что VPN включён — пропускаем и отправляем цель.
  onConfirm: () => void
  // Окно закрыто без перехода.
  onDismiss: () => void
  // Запасной канал без VPN.
  vkHref: string
  onVkClick: () => void
}

export function VpnGateModal({ open, channel, onConfirm, onDismiss, vkHref, onVkClick }: VpnGateModalProps) {
  // step "ask" — спрашиваем про VPN; "enable" — инструкция, если VPN нет.
  const [step, setStep] = useState<"ask" | "enable">("ask")
  const label = channelLabels[channel]

  // Блокируем прокрутку фона и сбрасываем шаг при каждом открытии.
  useEffect(() => {
    if (!open) return
    setStep("ask")
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="vpn-gate-title"
          className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onDismiss} aria-hidden="true" />

          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <IconClose className="h-5 w-5" />
            </button>

            <div className="px-6 pb-6 pt-8 sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconShield className="h-8 w-8" />
              </div>

              <h2 id="vpn-gate-title" className="mt-5 text-center text-xl font-extrabold text-foreground text-balance">
                {step === "ask" ? `Для ${label} нужен VPN` : "Включите VPN и возвращайтесь"}
              </h2>

              <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground text-pretty">
                {step === "ask" ? (
                  <>
                    В России {label} может не открываться из-за блокировок. Чтобы написать нам в этот мессенджер,
                    включите VPN. Подскажите, VPN сейчас включён?
                  </>
                ) : (
                  <>
                    Включите любой бесплатный VPN (или установите его из App Store / Google Play), затем вернитесь и
                    нажмите «VPN включён». Либо напишите нам во ВКонтакте — он работает без VPN.
                  </>
                )}
              </p>

              {step === "ask" ? (
                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:brightness-110"
                  >
                    <IconCheck className="h-5 w-5" />
                    Да, VPN включён — продолжить
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("enable")}
                    className="flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Нет, VPN выключен
                  </button>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:brightness-110"
                  >
                    <IconCheck className="h-5 w-5" />
                    VPN включён — продолжить
                  </button>
                  <a
                    href={vkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      onVkClick()
                      onDismiss()
                    }}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0077FF] px-5 font-bold text-white shadow-lg shadow-[#0077FF]/25 transition-all duration-200 hover:brightness-110"
                  >
                    <IconVk className="h-5 w-5" />
                    Написать ВКонтакте — без VPN
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={onDismiss}
                className="mx-auto mt-4 flex h-9 items-center justify-center px-5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Не сейчас
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
