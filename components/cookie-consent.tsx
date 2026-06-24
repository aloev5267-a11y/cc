"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const STORAGE_KEY = "cookie-consent"

function CookieIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21.5 12c0 5.247-4.253 9.5-9.5 9.5S2.5 17.247 2.5 12 6.753 2.5 12 2.5c.34 0 .5.36.32.64a2.4 2.4 0 0 0 2.54 3.64c.3-.06.6.14.64.44a2.4 2.4 0 0 0 2.86 2.02c.3-.06.6.13.65.43.06.42.34.78.74.92.3.1.5.39.5.71Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="13.5" r="1.1" fill="currentColor" />
      <circle cx="9.5" cy="15" r="1" fill="currentColor" />
      <circle cx="13" cy="9" r="0.85" fill="currentColor" />
    </svg>
  )
}

export function CookieConsent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        // небольшая задержка для плавного появления после загрузки
        const t = setTimeout(() => setOpen(true), 900)
        return () => clearTimeout(t)
      }
    } catch {
      setOpen(true)
    }
  }, [])

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore storage errors
    }
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Согласие на использование файлов cookie"
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6 motion-safe:animate-in motion-safe:slide-in-from-bottom-8 motion-safe:fade-in motion-safe:duration-500"
    >
      <div className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-foreground/10">
        <div className="h-1 w-full bg-primary" />
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary motion-safe:animate-bounce-slow">
              <CookieIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Любите печеньки? Мы тоже</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                Используем файлы cookie, чтобы сайт работал быстрее и удобнее. Подробнее — в{" "}
                <Link
                  href="/legal/privacy"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  политике конфиденциальности
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => decide("declined")}
              className="h-10 flex-1 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:flex-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Только нужные
            </button>
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="h-10 flex-1 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:flex-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
