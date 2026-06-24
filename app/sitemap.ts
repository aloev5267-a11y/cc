import { MetadataRoute } from 'next'
import { siteUrl as baseUrl } from '@/lib/config'
import { categories, allVacancies } from '@/lib/vacancies-data'

// Полная карта сайта: статические страницы + категории вакансий + карточки вакансий.
// Приоритеты выстроены по бизнес-важности (главная → вакансии → категории → детали).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // 1. Ключевые статические страницы
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/vacancies`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/partners`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // 2. Страницы категорий вакансий (/vacancies/courier, /driver, ...)
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/vacancies/${c.key}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // 3. Карточки вакансий (/vacancies/job/courier-1, ...)
  const vacancyPages: MetadataRoute.Sitemap = allVacancies.map((v) => ({
    url: `${baseUrl}/vacancies/job/${v.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // 4. Юридические страницы
  const legalPages: MetadataRoute.Sitemap = [
    `${baseUrl}/legal/offer`,
    `${baseUrl}/legal/privacy`,
    `${baseUrl}/legal/terms`,
  ].map((url) => ({ url, lastModified: now, changeFrequency: 'yearly', priority: 0.3 }))

  return [...corePages, ...categoryPages, ...vacancyPages, ...legalPages]
}
