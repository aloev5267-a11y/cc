import { Metadata } from 'next'
import { ApiPage } from '@/components/api-page'

export const metadata: Metadata = {
  title: 'API — КурьерХаб',
  description: 'API КурьерХаб для интеграции с вашими системами. Документация в разработке.',
  alternates: { canonical: '/api-docs' },
}

export default function Api() {
  return <ApiPage />
}
