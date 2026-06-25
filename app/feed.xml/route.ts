import { siteUrl, siteConfig } from "@/lib/config"
import { categories, allVacancies } from "@/lib/vacancies-data"

// YML-фид вакансий для Яндекс Директа (динамические объявления и смарт-баннеры).
// Формат yml_catalog с offers — Директ воспринимает каждую вакансию как «товар»
// и автоматически собирает под неё объявление. Доступен по адресу /feed.xml.
//
// Кэшируем на сервере: фид статичен в рамках сборки (вакансии детерминированы),
// поэтому пересобираем не чаще раза в час.
export const revalidate = 3600

// Экранирование спецсимволов XML, чтобы фид оставался валидным.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const base = siteUrl.replace(/\/$/, "")
  const now = new Date().toISOString().slice(0, 19)

  // Числовые id категорий — стабильны по порядку в каталоге.
  const categoryId = new Map(categories.map((c, i) => [c.key, i + 1]))

  const categoryXml = categories
    .map((c) => `      <category id="${categoryId.get(c.key)}">${escapeXml(c.title)}</category>`)
    .join("\n")

  const offersXml = allVacancies
    .map((v) => {
      const url = `${base}/vacancies/job/${v.id}`
      // salaryFrom хранится в тысячах рублей — переводим в рубли.
      const price = v.salaryFrom * 1000
      const name = `${v.title} — ${v.company}`
      const description = `${v.description} Доход: ${v.salary}. График: ${v.schedule}. Город: ${v.city}.`

      return [
        `      <offer id="${escapeXml(v.id)}" available="true">`,
        `        <url>${escapeXml(url)}</url>`,
        `        <price>${price}</price>`,
        `        <currencyId>RUR</currencyId>`,
        `        <categoryId>${categoryId.get(v.categoryKey)}</categoryId>`,
        `        <name>${escapeXml(name)}</name>`,
        `        <vendor>${escapeXml(v.company)}</vendor>`,
        `        <description>${escapeXml(description)}</description>`,
        `        <param name="Город">${escapeXml(v.city)}</param>`,
        `        <param name="Должность">${escapeXml(v.title)}</param>`,
        `        <param name="Зарплата">${escapeXml(v.salary)}</param>`,
        `        <param name="График">${escapeXml(v.schedule)}</param>`,
        `        <param name="Занятость">${escapeXml(v.employment)}</param>`,
        `        <param name="Опыт">${escapeXml(v.experience)}</param>`,
        `      </offer>`,
      ].join("\n")
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${now}">
  <shop>
    <name>${escapeXml(siteConfig.name)}</name>
    <company>${escapeXml(siteConfig.company.name)}</company>
    <url>${escapeXml(base)}</url>
    <currencies>
      <currency id="RUR" rate="1"/>
    </currencies>
    <categories>
${categoryXml}
    </categories>
    <offers>
${offersXml}
    </offers>
  </shop>
</yml_catalog>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
