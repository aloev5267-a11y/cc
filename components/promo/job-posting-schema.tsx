import type { PromoRole } from "@/lib/promo-config"
import { siteUrl } from "@/lib/config"

// Извлекаем число из строки вида "от 10 000 ₽" → 10000
function parseSalary(earn: string): number | null {
  const digits = earn.replace(/[^\d]/g, "")
  return digits ? Number.parseInt(digits, 10) : null
}

// "в день" → DAY, "в месяц" → MONTH, иначе MONTH по умолчанию
function salaryUnit(earnNote: string): "DAY" | "HOUR" | "MONTH" {
  const n = earnNote.toLowerCase()
  if (n.includes("день") || n.includes("дн")) return "DAY"
  if (n.includes("час")) return "HOUR"
  return "MONTH"
}

/**
 * JobPosting микроразметка (schema.org) для промо-страниц вакансий.
 * Помогает поисковикам (в т.ч. Яндексу) показывать расширенные сниппеты вакансий.
 */
export function JobPostingSchema({ role }: { role: PromoRole }) {
  const salary = parseSalary(role.earn)
  const unit = salaryUnit(role.earnNote)

  // Дата публикации — сегодня; срок актуальности — +60 дней
  const now = new Date()
  const validThrough = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: `${role.title} — КурьерХаб`,
    description: `${role.subtitle}. ${role.benefits.join(". ")}.`,
    datePosted: now.toISOString().split("T")[0],
    validThrough: validThrough.toISOString().split("T")[0],
    employmentType: ["FULL_TIME", "PART_TIME", "CONTRACTOR"],
    hiringOrganization: {
      "@type": "Organization",
      name: "КурьерХаб",
      sameAs: siteUrl,
      logo: `${siteUrl}/logo.jpg`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "RU",
        addressRegion: "Россия",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Россия",
    },
    jobLocationType: "TELECOMMUTE",
    directApply: true,
    url: `${siteUrl}${role.href}`,
  }

  if (salary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "RUB",
      value: {
        "@type": "QuantitativeValue",
        value: salary,
        unitText: unit,
      },
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
