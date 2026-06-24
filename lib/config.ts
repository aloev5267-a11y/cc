// Централизованный конфиг сайта ElWork
// Все контактные данные, реквизиты и SEO в одном месте.
// Бренд, домен и реквизиты подтягиваются из ENV — при смене домена/юрлица
// достаточно поменять переменные окружения, не трогая код.

// Базовый URL сайта. Единый источник истины — переменная окружения NEXT_PUBLIC_APP_URL.
// Фолбэк используется только в локальной разработке, если переменная не задана.
export const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// ID счётчика Яндекс.Метрики. Задаётся через NEXT_PUBLIC_YANDEX_METRIKA_ID.
export const metrikaCounterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || ''

// Название бренда (можно переопределить через ENV, чтобы не трогать код).
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'ElWork'
// Бренд состоит из двух частей для двухцветного логотипа: "El" + "Work".
const brandPrefix = process.env.NEXT_PUBLIC_BRAND_PREFIX || 'El'
const brandSuffix = process.env.NEXT_PUBLIC_BRAND_SUFFIX || 'Work'

// Домен в человекочитаемом виде (для отображения в текстах).
const siteDomain = (() => {
  try {
    return new URL(siteUrl).host
  } catch {
    return 'elwork.ru'
  }
})()

export const siteConfig = {
  name: brandName,
  brandPrefix,
  brandSuffix,
  domain: siteDomain,
  tagline: 'Кадровое агентство по подбору персонала',
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'ООО «ЭлВорк»',
    ogrn: process.env.NEXT_PUBLIC_COMPANY_OGRN || '',
    inn: process.env.NEXT_PUBLIC_COMPANY_INN || '',
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'г. Москва',
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '8 (800) 500-70-30',
    phoneHref: `tel:${(process.env.NEXT_PUBLIC_CONTACT_PHONE || '88005007030').replace(/[^0-9+]/g, '')}`,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || `info@${siteDomain}`,
    emailHref: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || `info@${siteDomain}`}`,
  },
  social: {
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_HANDLE || '@elwork',
    telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/elwork',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '+78005007030',
    whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/78005007030',
    max: process.env.NEXT_PUBLIC_MAX_HANDLE || '@elwork',
    maxUrl: process.env.NEXT_PUBLIC_MAX_URL || 'https://max.ru/elwork',
  },
  stats: {
    partners: 250,
    candidatesPlaced: '12 000+',
    cities: 30,
    avgPlacementDays: '3 дня',
    yearFounded: 2025,
  },
  legal: {
    terms: '/legal/terms',
    privacy: '/legal/privacy',
    offer: '/legal/offer',
  },
  meta: {
    title: `${brandName} — кадровое агентство: подбор персонала и работа`,
    description: `${brandName} — кадровое агентство: помогаем соискателям найти работу, а работодателям — закрыть вакансии. Бесплатно для кандидатов, быстрый отклик, поддержка на всех этапах.`,
    keywords: 'кадровое агентство, подбор персонала, поиск работы, вакансии, трудоустройство, рекрутинг, агентство по трудоустройству, работа для соискателей, найм сотрудников',
  },
} as const

export type SiteConfig = typeof siteConfig
