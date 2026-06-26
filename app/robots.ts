import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/config'

// Запрещённые к индексации служебные и рекламные разделы.
// /promo — посадочная под платный трафик, в органике ей делать нечего.
const disallow = ['/admin', '/admin/', '/api/', '/_next/', '/promo']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Базовое правило для всех поисковых роботов.
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      // Явные правила для основных рынка РФ — Яндекс и Google.
      {
        userAgent: ['Yandex', 'Googlebot'],
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
