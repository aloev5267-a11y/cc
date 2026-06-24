"use client"

import { useEffect, useRef, useState } from "react"
import { IconMapPin, IconCheck, IconClose } from "../icons"
import { useRegion } from "@/hooks/use-geo"

const POPULAR_CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Краснодар",
  "Ростов-на-Дону",
  "Уфа",
  "Воронеж",
]

export function RegionPicker() {
  const { city, detectedCity, confirmed, ready, confirm, selectCity } = useRegion("Москва")
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // Закрываем выпадающий список при клике вне.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  // Показываем подтверждение определённого города, как на hh.ru.
  const showConfirm = ready && !confirmed && detectedCity

  const filtered = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        aria-label={`Ваш регион: ${city}. Изменить`}
        aria-expanded={open}
      >
        <IconMapPin className="w-4 h-4 text-muted-foreground" />
        {city}
      </button>

      {/* Подтверждение автоопределённого города — баллон под кнопкой */}
      {showConfirm && !open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border bg-card p-4 shadow-lg z-50">
          <button
            type="button"
            onClick={confirm}
            aria-label="Закрыть"
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            <IconClose className="w-4 h-4" />
          </button>
          <p className="text-sm font-semibold text-foreground pr-6">
            Ваш город — {detectedCity}?
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={confirm}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <IconCheck className="w-4 h-4" />
              Да, верно
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Нет
            </button>
          </div>
        </div>
      )}

      {/* Выпадающий список выбора города */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border bg-card p-3 shadow-lg z-50">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск города"
              autoFocus
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <ul className="mt-2 max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">Ничего не найдено</li>
            )}
            {filtered.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => {
                    selectCity(c)
                    setOpen(false)
                    setQuery("")
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                    c === city ? "font-semibold text-primary" : "text-foreground"
                  }`}
                >
                  {c}
                  {c === city && <IconCheck className="w-4 h-4 text-primary" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
