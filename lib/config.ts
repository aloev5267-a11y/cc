// Централизованный конфиг сайта
// Все контактные данные и настройки в одном месте

export const siteConfig = {
  name: "КурьерХаб",
  company: {
    name: 'ООО «Фестивальное движение Феникс»',
    ogrn: '1269600016927',
    inn: '6686172964',
    address: 'Свердловская обл., г. Верхняя Пышма, ул. Пионерская, д. 21А',
  },
  contact: {
    phone: '8 (800) 555-35-35',
    phoneHref: 'tel:+78005553535',
    email: 'info@ccourierhub.ru',
    emailHref: 'mailto:info@ccourierhub.ru',
  },
  social: {
    telegram: '@ccourierhub',
    telegramUrl: 'https://t.me/ccourierhub',
    whatsapp: '+78005553535',
    whatsappUrl: 'https://wa.me/78005553535',
    max: '@ccourierhub',
    maxUrl: 'https://max.ru/ccourierhub',
  },
  stats: {
    regions: 14,
    support: '24/7',
    firstOrderDays: '1 день',
    yearFounded: 2025,
  },
  legal: {
    terms: '/legal/terms',
    privacy: '/legal/privacy',
    offer: '/legal/offer',
  },
  meta: {
    title: 'КурьерХаб — Курьерская доставка по России',
    description: 'КурьерХаб — курьерская служба для быстрой и надёжной доставки грузов и посылок по всей России. Оформление за минуту, 14 регионов, поддержка 24/7.',
    keywords: 'курьерская доставка, доставка грузов, доставка посылок, курьерская служба, логистика, грузоперевозки, доставка по России',
  },
} as const

export type SiteConfig = typeof siteConfig
