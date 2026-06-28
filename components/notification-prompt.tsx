"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconClose, IconCheck } from "./icons"
import type { ChatPermissionState } from "@/lib/chat-permission"

// Модальное окно запроса разрешения на уведомления перед открытием онлайн-чата.
// Жёсткий режим: чат не откроется, пока пользователь не разрешит уведомления.
// Кнопки "Пропустить"/закрытия НЕ открывают чат — они только закрывают окно.

type NotificationPromptProps = {
  open: boolean
  // Текущее состояние разрешения — от него зависит текст и доступные действия.
  state: ChatPermissionState
  // Идёт ли запрос разрешения у браузера прямо сейчас.
  requesting?: boolean
  // Пользователь нажал "Включить уведомления".
  onAllow: () => void
  // Пользователь закрыл окно / нажал "Не сейчас" — чат не откроется.
  onDismiss: () => void
}

const BENEFITS = [
  "Сообщим, когда менеджер ответит в чате",
  "Пришлём подходящие вакансии рядом с домом",
  "Уведомим о приглашении на смену и выплатах",
]

export function NotificationPrompt({ open, state, requesting, onAllow, onDismiss }: NotificationPromptProps) {
  // Блокируем прокрутку фона, пока окно открыто.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Если уведомления запрещены на уровне браузера — даём инструкцию,
  // как их включить (кнопка запроса в этом случае браузером игнорируется).
  const isDenied = state === "denied"

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notif-prompt-title"
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Затемнение. Клик по фону = закрыть (чат не откроется). */}
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
              {/* Иконка-колокольчик */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </div>

              <h2 id="notif-prompt-title" className="mt-5 text-center text-xl font-extrabold text-foreground text-balance">
                {isDenied ? "Включите уведомления в браузере" : "Включите уведомления, чтобы открыть чат"}
              </h2>

              <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground text-pretty">
                {isDenied
                  ? "Чтобы написать в онлайн-чат, разрешите уведомления для этого сайта в настройках браузера (значок замка в адресной строке), затем обновите страницу."
                  : "Онлайн-чат работает с уведомлениями — так вы не пропустите ответ менеджера и приглашение на работу."}
              </p>

              {!isDenied && (
                <ul className="mt-5 flex flex-col gap-2.5">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-medium text-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-col gap-2.5">
                {!isDenied && (
                  <button
                    type="button"
                    onClick={onAllow}
                    disabled={requesting}
                    aria-busy={requesting}
                    className="flex h-12 items-center justify-center rounded-xl bg-primary px-5 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {requesting ? "Ожидаем разрешение…" : "Включить уведомления"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onDismiss}
                  className="flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Не сейчас
                </button>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                Без уведомлений онлайн-чат недоступен. Вы всегда можете написать нам в Telegram или WhatsApp.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
