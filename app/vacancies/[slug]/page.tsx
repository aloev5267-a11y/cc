import { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { VacanciesPage } from "@/components/vacancies-page"
import { categories, getCategoryBySlug, allVacancies } from "@/lib/vacancies-data"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/structured-data"
import { breadcrumbSchema, vacancyItemListSchema, collectionPageSchema } from "@/lib/structured-data"

// Человекочитаемые слаги категорий: /vacancies/courier, /vacancies/driver и т.д.
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.key }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) {
    return { title: "Вакансии" }
  }
  const title = `${category.title} — вакансии`
  const description = `${category.title}: актуальные вакансии у проверенных работодателей через ${siteConfig.name}. Зарплата ${category.salaryHint}, подбор бесплатно для соискателя.`
  return {
    title,
    description,
    keywords: [category.title, ...category.searchTerms, "вакансии", "поиск работы"].join(", "),
    alternates: { canonical: `/vacancies/${category.key}` },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description,
      type: "website",
      url: `/vacancies/${category.key}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function VacancyCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const path = `/vacancies/${category.key}`
  const vacancies = allVacancies.filter((v) => v.categoryKey === category.key)

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Вакансии", path: "/vacancies" },
            { name: category.title, path },
          ]),
          collectionPageSchema(
            `${category.title} — вакансии`,
            `Актуальные вакансии «${category.title}» через ${siteConfig.name}.`,
            path,
          ),
          vacancyItemListSchema(vacancies.slice(0, 30), `${category.title} — вакансии`),
        ]}
      />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <VacanciesPage initialCategory={category.key} />
      </Suspense>
    </>
  )
}
