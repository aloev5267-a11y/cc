"use client"

import { useEffect, useState } from "react"
import { normalizeCityToRussian } from "@/lib/cities"

type GeoResponse = { country?: string | null; city?: string | null; isRussia?: boolean }

// Определяет, заходит ли посетитель из России (по IP).
// Возвращает: null — пока неизвестно, true/false — после ответа сервера.
// Нужно, чтобы предупредить о блокировках мессенджеров и предложить VPN.
export function useIsRussianIp() {
  const [isRussia, setIsRussia] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data: GeoResponse) => {
        if (!cancelled) setIsRussia(Boolean(data.isRussia))
      })
      .catch(() => {
        if (!cancelled) setIsRussia(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return isRussia
}

const REGION_STORAGE_KEY = "user-region"

// Определяет город посетителя по IP и хранит выбор пользователя.
// Логика как на hh.ru: автоматически определяем регион и спрашиваем «Ваш город — такой-то?».
export function useRegion(defaultCity = "Москва") {
  const [city, setCity] = useState<string>(defaultCity)
  // detectedCity — то, что определил сервер (для подсказки), confirmed — подтвердил ли пользователь.
  const [detectedCity, setDetectedCity] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Если пользователь уже выбирал город ранее — берём его и не спрашиваем снова.
    // Нормализуем на случай, если в кэше осталось латинское название (например,
    // "Moscow") — показываем корректное русское, иначе откатываемся к дефолту.
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(REGION_STORAGE_KEY) : null
    if (saved) {
      const normalized = normalizeCityToRussian(saved) ?? defaultCity
      setCity(normalized)
      if (normalized !== saved && typeof window !== "undefined") {
        window.localStorage.setItem(REGION_STORAGE_KEY, normalized)
      }
      setConfirmed(true)
      setReady(true)
      return
    }

    fetch("/api/geo")
      .then((res) => res.json())
      .then((data: GeoResponse) => {
        if (cancelled) return
        // API уже нормализует город, но прогоняем ещё раз для надёжности —
        // на латинице (если вдруг прошла) город не показываем.
        const found = normalizeCityToRussian(data.city)
        if (found && found.toLowerCase() !== defaultCity.toLowerCase()) {
          // Город отличается от дефолтного — показываем подтверждение.
          setDetectedCity(found)
          setCity(found)
          setConfirmed(false)
        }
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [defaultCity])

  // Пользователь подтвердил предложенный город.
  const confirm = () => {
    setConfirmed(true)
    if (typeof window !== "undefined") window.localStorage.setItem(REGION_STORAGE_KEY, city)
  }

  // Пользователь выбрал другой город вручную.
  const selectCity = (next: string) => {
    setCity(next)
    setDetectedCity(null)
    setConfirmed(true)
    if (typeof window !== "undefined") window.localStorage.setItem(REGION_STORAGE_KEY, next)
  }

  return { city, detectedCity, confirmed, ready, confirm, selectCity }
}
