"use client"

import { useEffect, useState } from "react"

// Определяет, заходит ли посетитель из России (по IP).
// Возвращает: null — пока неизвестно, true/false — после ответа сервера.
// Нужно, чтобы предупредить о блокировках мессенджеров и предложить VPN.
export function useIsRussianIp() {
  const [isRussia, setIsRussia] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data: { isRussia?: boolean }) => {
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
