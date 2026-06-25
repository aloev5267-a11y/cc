import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/config'

// Запрещённые к индексации служебные разделы.
const disallow = ['/admin', '/admin/', '/api/', '/_next/']

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
