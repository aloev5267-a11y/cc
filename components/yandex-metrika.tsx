"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { metrikaCounterId } from "@/lib/config"

const METRIKA_ID = Number(metrikaCounterId)

// Declare ym function type for TypeScript
declare global {
  interface Window {
    ym: (id: number, action: string, ...args: unknown[]) => void
  }
}

/**
 * Возвращает ClientID Яндекс.Метрики текущего посетителя.
 * Нужен для серверной атрибуции офлайн-конверсии "написал в мессенджер".
 * Если Метрика недоступна (блокировщик и т.п.) — резолвится в null с таймаутом.
 */
export function getMetrikaClientId(timeoutMs = 1500): Promise<string | null> {
  if (typeof window === "undefined" || typeof window.ym !== "function") {
    return Promise.resolve(null)
  }
  return new Promise((resolve) => {
    let settled = false
    const finish = (value: string | null) => {
      if (settled) return
      settled = true
      resolve(value)
    }
    const timer = setTimeout(() => finish(null), timeoutMs)
    try {
      window.ym(METRIKA_ID, "getClientID", (clientId: string) => {
        clearTimeout(timer)
        finish(clientId || null)
      })
    } catch {
      clearTimeout(timer)
      finish(null)
    }
  })
}

// Отслеживание просмотров страниц (SPA-навигация). Целей больше нет — только hit.
function MetrikaPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined" && window.ym) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
      window.ym(METRIKA_ID, "hit", url)
    }
  }, [pathname, searchParams])

  return null
}

export function YandexMetrika() {
  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');

            ym(${METRIKA_ID}, 'init', {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: 'dataLayer',
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      <Suspense fallback={null}>
        <MetrikaPageTracker />
      </Suspense>
    </>
  )
}
