// Централизованные билдеры микроразметки schema.org (JSON-LD).
// Чистые функции без JSX — можно импортировать в любых серверных компонентах.
// Рендерятся через <JsonLd> из components/structured-data.tsx.

import { siteUrl, siteConfig } from "@/lib/config"
import type { Vacancy } from "@/lib/vacancies-data"
import { getCategory } from "@/lib/vacancies-data"

// Абсолютный URL из относительного пути (schema.org требует абсолютные ссылки).
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

// ====== Хлебные крошки ======
export type Crumb = { name: string; path: string }

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

// ====== Список вакансий (ItemList) ======
export function vacancyItemListSchema(vacancies: Vacancy[], listName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: vacancies.length,
    itemListElement: vacancies.map((v, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/vacancies/job/${v.id}`),
      name: `${v.title} — ${v.company}, ${v.city}`,
    })),
  }
}

// ====== JobPosting (Google for Jobs / Яндекс) ======

// Сколько дней назад опубликована вакансия (из относительной метки).
function daysAgoFromLabel(label: string): number {
  const map: Record<string, number> = {
    Сегодня: 0,
    Вчера: 1,
    "2 дня назад": 2,
    "3 дня назад": 3,
    "На этой неделе": 5,
  }
  return map[label] ?? 0
}

function isoDateDaysAgo(days: number): string {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString()
}

// Парсим нижнюю/верхнюю границу зарплаты из строки вида "от 70 000 до 110 000 ₽".
function parseSalary(salary: string): { min?: number; max?: number } {
  const nums = (salary.match(/\d[\d\s]*/g) || []).map((n) => Number(n.replace(/\s/g, ""))).filter((n) => n > 0)
  if (nums.length >= 2) return { min: nums[0], max: nums[1] }
  if (nums.length === 1) return { min: nums[0] }
  return {}
}

// Маппинг занятости в типы schema.org.
function employmentType(employment: string): string[] {
  const e = employment.toLowerCase()
  if (e.includes("полная")) return ["FULL_TIME"]
  if (e.includes("частичная") || e.includes("подработка")) return ["PART_TIME"]
  if (e.includes("проект")) return ["CONTRACTOR"]
  if (e.includes("вахта")) return ["FULL_TIME", "OTHER"]
  return ["FULL_TIME"]
}

export function jobPostingSchema(vacancy: Vacancy) {
  const datePosted = isoDateDaysAgo(daysAgoFromLabel(vacancy.postedLabel))
  // Срок актуальности — 30 дней с даты публикации (требование Google).
  const validThrough = (() => {
    const d = new Date(datePosted)
    d.setUTCDate(d.getUTCDate() + 30)
    return d.toISOString()
  })()

  const { min, max } = parseSalary(vacancy.salary)
  const isRemote = /удал[её]н/i.test(vacancy.city)
  const cityName = vacancy.city.replace(/\s*\(.*\)\s*/, "").trim()

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: [
      vacancy.description,
      "Обязанности: " + vacancy.responsibilities.join("; ") + ".",
      "Требования: " + vacancy.requirements.join("; ") + ".",
      "Условия: " + vacancy.perks.join("; ") + ".",
    ].join(" "),
    datePosted,
    validThrough,
    employmentType: employmentType(vacancy.employment),
    industry: vacancy.categoryTitle,
    url: absoluteUrl(`/vacancies/job/${vacancy.id}`),
    directApply: false,
    hiringOrganization: {
      "@type": "Organization",
      name: vacancy.company,
      sameAs: siteUrl,
    },
    identifier: {
      "@type": "PropertyValue",
      name: vacancy.company,
      value: vacancy.id,
    },
  }

  // Локация / удалёнка
  if (isRemote) {
    schema.jobLocationType = "TELECOMMUTE"
    schema.applicantLocationRequirements = {
      "@type": "Country",
      name: "Россия",
    }
  }
  schema.jobLocation = {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: isRemote ? "Москва" : cityName,
      addressCountry: "RU",
    },
  }

  // Зарплата (в месяц, ₽)
  if (min) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "RUB",
      value: {
        "@type": "QuantitativeValue",
        minValue: min,
        ...(max ? { maxValue: max } : {}),
        unitText: "MONTH",
      },
    }
  }

  // Опыт
  if (vacancy.noExperience) {
    schema.experienceRequirements = {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: 0,
    }
    schema.experienceInPlaceOfEducation = true
  }

  return schema
}

// ====== Страница услуг/работодателям (Service) ======
export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType: "Подбор персонала",
    areaServed: { "@type": "Country", name: "Россия" },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteUrl,
    },
  }
}

// ====== Коллекция (CollectionPage) ======
export function collectionPageSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteUrl },
    inLanguage: "ru-RU",
  }
}

// Вспомогательное: ссылки для крошек вакансии (категория опциональна).
export function vacancyBreadcrumb(vacancy: Vacancy): Crumb[] {
  const cat = getCategory(vacancy.categoryKey)
  return [
    { name: "Главная", path: "/" },
    { name: "Вакансии", path: "/vacancies" },
    ...(cat ? [{ name: cat.title, path: `/vacancies/${cat.key}` }] : []),
    { name: vacancy.title, path: `/vacancies/job/${vacancy.id}` },
  ]
}
