import { Metadata } from 'next'
import { PartnersPage } from '@/components/partners-page'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Работодателям`,
  description: `Подбор линейного и массового персонала для бизнеса от кадрового агентства ${siteConfig.name}. Быстро закрываем вакансии проверенными кандидатами.`,
  alternates: { canonical: '/partners' },
}

export default function Partners() {
  return <PartnersPage />
}
