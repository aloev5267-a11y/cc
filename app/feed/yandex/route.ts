import { promoPages } from "@/lib/promo-pages"
import { siteUrl } from "@/lib/config"

// Экранирование спецсимволов для XML
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

// UTM-метки, чтобы в Метрике видеть переходы из товарной кампании Директа
function withUtm(path: string, key: string): string {
  const url = `${siteUrl}${path}`
  const params = "utm_source=yandex&utm_medium=cpc&utm_campaign=promo_feed&utm_content=" + key
  return `${url}${url.includes("?") ? "&" : "?"}${params}`
}

/**
 * YML-фид (Yandex Market Language) для товарных/динамических кампаний и смарт-баннеров Яндекс.Директа.
 * Каждая промо-страница (вакансия) — это offer. URL фида: /feed/yandex
 */
export async function GET() {
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  // Уникальные категории
  const categories = Array.from(new Set(promoPages.map((p) => p.category)))
  const categoryId = (name: string) => categories.indexOf(name) + 1

  const offers = promoPages
    .map((p) => {
      const url = withUtm(p.path, p.key)
      return `      <offer id="${esc(p.key)}" available="true">
        <url>${esc(url)}</url>
        <price>${p.price}</price>
        <currencyId>RUR</currencyId>
        <categoryId>${categoryId(p.category)}</categoryId>
        <picture>${esc(siteUrl + p.image)}</picture>
        <name>${esc(p.name)}</name>
        <description>${esc(p.description)}</description>
        <vendor>КурьерХаб</vendor>
        <param name="Доход">${p.price.toLocaleString("ru-RU")} ₽ ${esc(p.priceNote)}</param>
      </offer>`
    })
    .join("\n")

  const categoriesXml = categories
    .map((c) => `      <category id="${categoryId(c)}">${esc(c)}</category>`)
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${dateStr}">
  <shop>
    <name>КурьерХаб</name>
    <company>ООО «Фестивальное движение Феникс»</company>
    <url>${siteUrl}</url>
    <currencies>
      <currency id="RUR" rate="1"/>
    </currencies>
    <categories>
${categoriesXml}
    </categories>
    <offers>
${offers}
    </offers>
  </shop>
</yml_catalog>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Кэшируем на час, обновление в фоне
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
