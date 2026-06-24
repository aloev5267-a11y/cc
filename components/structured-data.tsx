import { siteUrl, siteConfig } from '@/lib/config'

// Чистый телефон для tel:/schema (из номера WhatsApp).
const phone = `+${siteConfig.social.whatsapp.replace(/\D/g, '')}`

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "EmploymentAgency"],
  "@id": `${siteUrl}/#organization`,
  "name": siteConfig.name,
  "legalName": siteConfig.company.name,
  "url": siteUrl,
  "logo": {
    "@type": "ImageObject",
    "url": `${siteUrl}/logo.png`,
    "width": 512,
    "height": 512,
  },
  "image": `${siteUrl}/og-image.png`,
  "description": siteConfig.meta.description,
  "slogan": siteConfig.tagline,
  "foundingDate": String(siteConfig.stats.yearFounded),
  "taxID": siteConfig.company.inn,
  "vatID": siteConfig.company.inn,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": siteConfig.company.address,
    "addressLocality": "Москва",
    "addressRegion": "Москва",
    "addressCountry": "RU",
  },
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": phone,
    "email": siteConfig.contact.email,
    "contactType": "customer service",
    "availableLanguage": ["Russian"],
    "areaServed": "RU",
  }],
  "email": siteConfig.contact.email,
  "telephone": phone,
  "sameAs": [
    siteConfig.social.telegramUrl,
    siteConfig.social.whatsappUrl,
    siteConfig.social.maxUrl,
  ],
  "areaServed": { "@type": "Country", "name": "Россия" },
  "knowsLanguage": ["ru"],
  "knowsAbout": [
    "Подбор персонала",
    "Трудоустройство",
    "Рекрутинг",
    "Массовый подбор",
    "Линейный персонал",
  ],
  "serviceType": ["Подбор персонала", "Трудоустройство", "Рекрутинг", "Кадровое агентство"],
}

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  "name": siteConfig.name,
  "alternateName": `${siteConfig.name} — ${siteConfig.tagline}`,
  "url": siteUrl,
  "inLanguage": "ru-RU",
  "publisher": { "@id": `${siteUrl}/#organization` },
  // Sitelinks Searchbox — поиск по вакансиям прямо из выдачи.
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${siteUrl}/vacancies?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

// Глобальная микроразметка (Organization + WebSite). Монтируется один раз в layout.
export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  )
}

// Переиспользуемый рендер произвольной JSON-LD схемы (или массива схем) на странице.
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
