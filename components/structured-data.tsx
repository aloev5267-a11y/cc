import { siteUrl } from '@/lib/config'

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "КурьерХаб",
  "alternateName": "CourierHub",
  "url": siteUrl,
  "logo": `${siteUrl}/logo.jpg`,
  "description": "Современная логистическая платформа для доставки грузов по России",
  "foundingDate": "2025",
  "founder": {
    "@type": "Organization",
    "name": "ООО «Фестивальное движение Феникс»"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Пионерская, д. 21А",
    "addressLocality": "Верхняя Пышма",
    "addressRegion": "Свердловская область",
    "postalCode": "624090",
    "addressCountry": "RU"
  },
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+7-800-555-35-35",
    "contactType": "customer service",
    "availableLanguage": "Russian",
    "areaServed": "RU"
  }],
  "sameAs": ["https://t.me/ccourierhub", "https://wa.me/78005553535"],
  "areaServed": { "@type": "Country", "name": "Россия" },
  "serviceType": ["Доставка грузов", "Курьерская доставка", "Логистика"]
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "КурьерХаб",
  "image": `${siteUrl}/logo.jpg`,
  "url": siteUrl,
  "telephone": "+7-800-555-35-35",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Пионерская, д. 21А",
    "addressLocality": "Верхняя Пышма",
    "addressRegion": "Свердловская область",
    "postalCode": "624090",
    "addressCountry": "RU"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 56.9769, "longitude": 60.5817 },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }
}

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "КурьерХаб",
  "url": siteUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${siteUrl}/tracking?code={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
}

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  )
}
