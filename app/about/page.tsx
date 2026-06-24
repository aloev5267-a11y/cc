import { Metadata } from "next"
import { AboutPage } from "@/components/about-page"
import { siteConfig, siteUrl } from "@/lib/config"
import { JsonLd } from "@/components/structured-data"
import { breadcrumbSchema, absoluteUrl } from "@/lib/structured-data"

export const metadata: Metadata = {
  title: `Об агентстве`,
  description: `${siteConfig.name} — кадровое агентство ${siteConfig.company.name}. Узнайте о нашей миссии, команде и ценностях.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `Об агентстве — ${siteConfig.name}`,
    description: `${siteConfig.name} — кадровое агентство ${siteConfig.company.name}: миссия, команда и ценности.`,
    type: "website",
    url: "/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `Об агентстве ${siteConfig.name}` }],
  },
}

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `Об агентстве ${siteConfig.name}`,
  url: absoluteUrl("/about"),
  inLanguage: "ru-RU",
  mainEntity: { "@id": `${siteUrl}/#organization` },
}

export default function About() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Об агентстве", path: "/about" },
          ]),
          aboutSchema,
        ]}
      />
      <AboutPage />
    </>
  )
}
