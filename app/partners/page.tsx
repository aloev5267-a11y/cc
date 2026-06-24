import { Metadata } from 'next'
import { PartnersPage } from '@/components/partners-page'

export const metadata: Metadata = {
  title: 'Партнёрам — КурьерХаб',
  description: 'Станьте партнёром КурьерХаб. Выгодные условия сотрудничества для бизнеса.',
  alternates: { canonical: '/partners' },
}

export default function Partners() {
  return <PartnersPage />
}
