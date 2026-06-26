"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconClose, IconArrowUpRight, IconStar } from "./icons"

const STORAGE_KEY = "promo-popup-dismissed"
const COOKIE_KEY = "cookie-consent"

// Небольшое всплывающее уведомление на главной, которое зовёт на страницу с
// колесом бонусов (/promo). Логика «не надоедать»:
//  - НЕ показывается, пока не принято решение по cookie-баннеру (иначе баннер
//    с z-[100] перекрывает попап и перехватывает клики — это и был баг);
//  - появляется через 3.5 секунды после того, как cookie-баннер закрыт;
//  - после закрытия не показывается до конца сессии (sessionStorage).
export function PromoPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Уже закрывали в этой сессии — больше не показываем.
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true)
      return
    }

    let showTimer: number | undefined
    let pollTimer: number | undefined

    const startShowTimer = () => {
      showTimer = window.setTimeout(() => setVisible(true), 3500)
    }

    // Ждём, пока пользователь примет/отклонит cookie-баннер. Пока решение не
    // принято — баннер занимает низ экрана и перекрывает попап.
    const cookieDecided = () => {
      try {
        return window.localStorage.getItem(COOKIE_KEY) !== null
      } catch {
        return true
      }
    }

    if (cookieDecided()) {
      startShowTimer()
    } else {
      pollTimer = window.setInterval(() => {
        if (cookieDecided()) {
          window.clearInterval(pollTimer)
          startShowTimer()
        }
      }, 500)
    }

    // Когда пользователь прокрутил вниз, его место занимает плавающая кнопка
    // Telegram (появляется при scrollY > 500). Прячем попап заранее и больше
    // не показываем в этой сессии-прокрутке, чтобы они не накладывались.
    const onScroll = () => {
      if (window.scrollY > 450) {
        setVisible(false)
        if (showTimer) window.clearTimeout(showTimer)
        if (pollTimer) window.clearInterval(pollTimer)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      if (showTimer) window.clearTimeout(showTimer)
      if (pollTimer) window.clearInterval(pollTimer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const close = () => {
    setVisible(false)
    setDismissed(true)
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, "1")
    }
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-4 right-4 z-[90] bottom-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] sm:right-auto sm:max-w-sm"
          role="dialog"
          aria-label="Бонусное предложение"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-foreground/10">
            {/* Кнопка закрытия */}
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <IconClose className="h-4 w-4" />
            </button>

            <Link
              href="/promo"
              onClick={close}
              className="flex items-center gap-4 p-4 pr-12"
            >
              {/* Иконка-«колесо» */}
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30">
                <IconStar className="h-6 w-6" />
              </span>

              <span className="flex min-w-0 flex-col">
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                  Бонус новичкам
                </span>
                <span className="mt-1 text-sm font-bold leading-tight text-foreground text-balance">
                  Колесо бонусов — узнайте свой бонус за выход на работу
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Открыть
                  <IconArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
