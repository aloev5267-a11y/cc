import { Metadata } from "next"
import { Suspense } from "react"
import { VacanciesPage } from "@/components/vacancies-page"
import { siteConfig } from "@/lib/config"

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
  },
}

export default function Vacancies() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <VacanciesPage />
    </Suspense>
  )
}
