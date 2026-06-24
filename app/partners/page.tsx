import { Metadata } from 'next'
import { PartnersPage } from '@/components/partners-page'
import { siteConfig } from '@/lib/config'
import { JsonLd } from '@/components/structured-data'
import { breadcrumbSchema, serviceSchema } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: `Работодателям`,
  description: `Подбор линейного и массового персонала для бизнеса от кадрового агентства ${siteConfig.name}. Быстро закрываем вакансии проверенными кандидатами.`,
  alternates: { canonical: '/partners' },
  openGraph: {
    title: `Работодателям — ${siteConfig.name}`,
    description: `Подбор линейного и массового персонала для бизнеса от ${siteConfig.name}. Быстро закрываем вакансии проверенными кандидатами.`,
    type: 'website',
    url: '/partners',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Работодателям — ${siteConfig.name}` }],
  },
}

export default function Partners() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Главная', path: '/' },
            { name: 'Работодателям', path: '/partners' },
          ]),
          serviceSchema(
            'Подбор персонала для бизнеса',
            `Подбор линейного и массового персонала для бизнеса от кадрового агентства ${siteConfig.name}.`,
            '/partners',
          ),
        ]}
      />
      <PartnersPage />
    </>
  )
}
