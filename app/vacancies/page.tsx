import { Metadata } from "next"
import { Suspense } from "react"
import { VacanciesPage } from "@/components/vacancies-page"
import { allVacancies } from "@/lib/vacancies-data"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/structured-data"
import { breadcrumbSchema, vacancyItemListSchema, collectionPageSchema } from "@/lib/structured-data"

export const metadata: Metadata = {
  title: `Вакансии — поиск работы`,
  description: `Актуальные вакансии у проверенных работодателей через ${siteConfig.name}. Подбор бесплатно для соискателя, официальное оформление, гибкий график.`,
  keywords: "вакансии, поиск работы, работа, трудоустройство, кадровое агентство, подбор персонала",
  alternates: {
    canonical: "/vacancies",
  },
  openGraph: {
    title: `Вакансии — ${siteConfig.name}`,
    description: `Актуальные вакансии у проверенных работодателей через ${siteConfig.name}. Подбор бесплатно для соискателя.`,
    type: "website",
    url: "/vacancies",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `Вакансии — ${siteConfig.name}` }],
  },
}

export default function Vacancies() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Вакансии", path: "/vacancies" },
          ]),
          collectionPageSchema(
            `Вакансии — ${siteConfig.name}`,
            `Актуальные вакансии у проверенных работодателей через ${siteConfig.name}.`,
            "/vacancies",
          ),
          vacancyItemListSchema(allVacancies.slice(0, 30), `Вакансии — ${siteConfig.name}`),
        ]}
      />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <VacanciesPage />
      </Suspense>
    </>
  )
}
