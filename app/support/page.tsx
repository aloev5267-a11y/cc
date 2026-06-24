import { Metadata } from 'next'
import { SupportPage } from '@/components/support-page'
import { faqItems } from '@/lib/faq'
import { siteConfig } from '@/lib/config'
import { JsonLd } from '@/components/structured-data'
import { breadcrumbSchema } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: `Поддержка`,
  description: `Служба поддержки ${siteConfig.name}. Свяжитесь с нами по вопросам трудоустройства и подбора персонала.`,
  alternates: { canonical: '/support' },
  openGraph: {
    title: `Поддержка — ${siteConfig.name}`,
    description: `Служба поддержки ${siteConfig.name}. Ответы на частые вопросы о трудоустройстве и подборе персонала.`,
    type: 'website',
    url: '/support',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Поддержка — ${siteConfig.name}` }],
  },
}

// FAQPage микроразметка (schema.org) — расширенные сниппеты с вопросами в поиске и Яндексе
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function Support() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema,
          breadcrumbSchema([
            { name: 'Главная', path: '/' },
            { name: 'Поддержка', path: '/support' },
          ]),
        ]}
      />
      <SupportPage />
    </>
  )
}
