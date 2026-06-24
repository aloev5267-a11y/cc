import { Metadata } from "next"
import { notFound } from "next/navigation"
import { VacancyDetail } from "@/components/vacancy-detail"
import { getVacancyById, allVacancies } from "@/lib/vacancies-data"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/structured-data"
import { jobPostingSchema, breadcrumbSchema, vacancyBreadcrumb } from "@/lib/structured-data"

// Предрендерим все карточки вакансий (статическая генерация + полная индексация).
export function generateStaticParams() {
  return allVacancies.map((v) => ({ id: v.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const vacancy = getVacancyById(id)
  if (!vacancy) {
    return { title: "Вакансия не найдена" }
  }
  const title = `${vacancy.title} — ${vacancy.company}, ${vacancy.city}`
  const description = `${vacancy.title} в «${vacancy.company}» (${vacancy.city}). Зарплата ${vacancy.salary}, ${vacancy.schedule.toLowerCase()}. Отклик через ${siteConfig.name} — бесплатно для соискателя.`
  return {
    title,
    description,
    keywords: [vacancy.title, vacancy.company, vacancy.city, vacancy.categoryTitle, "вакансия", "работа"].join(", "),
    alternates: { canonical: `/vacancies/job/${vacancy.id}` },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description,
      type: "website",
      url: `/vacancies/job/${vacancy.id}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function VacancyJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vacancy = getVacancyById(id)
  if (!vacancy) notFound()

  return (
    <>
      <JsonLd data={[jobPostingSchema(vacancy), breadcrumbSchema(vacancyBreadcrumb(vacancy))]} />
      <VacancyDetail vacancy={vacancy} />
    </>
  )
}
