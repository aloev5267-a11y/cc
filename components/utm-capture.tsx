"use client"

import { useEffect } from "react"
import { captureUtm } from "@/lib/utm"

// Невидимый компонент: при первой загрузке сохраняет рекламные метки (UTM/yclid/gclid)
// в sessionStorage, чтобы потом прикрепить их к лидам. Ничего не рендерит.
export function UtmCapture() {
  useEffect(() => {
    captureUtm()
  }, [])

  return null
}
