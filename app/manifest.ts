import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config'

// PWA-манифест генерируется из конфига: бренд и тексты подтягиваются из ENV,
// а тема совпадает с брендовым синим (#1f6bff), как в layout viewport.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.meta.description,
    start_url: '/?utm_source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#1f6bff',
    lang: 'ru',
    dir: 'ltr',
    categories: ['business', 'jobs'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Вакансии',
        short_name: 'Вакансии',
        description: 'Актуальные вакансии у проверенных работодателей',
        url: '/vacancies',
      },
      {
        name: 'Работодателям',
        short_name: 'Бизнесу',
        description: 'Подбор персонала для бизнеса',
        url: '/partners',
      },
      {
        name: 'Поддержка',
        short_name: 'Поддержка',
        description: 'Связаться со службой поддержки',
        url: '/support',
      },
    ],
  }
}
