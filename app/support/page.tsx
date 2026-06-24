import { Metadata } from 'next'
import { SupportPage } from '@/components/support-page'
import { faqItems } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Поддержка — КурьерХаб',
  description: 'Служба поддержки КурьерХаб. Свяжитесь с нами для решения любых вопросов по доставке грузов.',
  alternates: { canonical: '/support' },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SupportPage />
    </>
  )
}
