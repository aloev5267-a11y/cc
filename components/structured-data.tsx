import { siteUrl, siteConfig } from '@/lib/config'

const phone = siteConfig.contact.phone.replace(/[^0-9+]/g, '')

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "EmploymentAgency"],
  "name": siteConfig.name,
  "url": siteUrl,
  "logo": `${siteUrl}/logo.png`,
  "description": siteConfig.meta.description,
  "foundingDate": String(siteConfig.stats.yearFounded),
  "founder": {
    "@type": "Organization",
    "name": siteConfig.company.name,
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": siteConfig.company.address,
    "addressCountry": "RU",
  },
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": phone,
    "contactType": "customer service",
    "availableLanguage": "Russian",
    "areaServed": "RU",
  }],
  "sameAs": [siteConfig.social.telegramUrl, siteConfig.social.whatsappUrl],
  "areaServed": { "@type": "Country", "name": "Россия" },
  "serviceType": ["Подбор персонала", "Трудоустройство", "Рекрутинг", "Кадровое агентство"],
}

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": siteConfig.name,
  "url": siteUrl,
  "inLanguage": "ru-RU",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  )
}
