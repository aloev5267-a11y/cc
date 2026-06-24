import { Metadata } from "next"
import { AboutPage } from "@/components/about-page"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: `Об агентстве`,
  description: `${siteConfig.name} — кадровое агентство ${siteConfig.company.name}. Узнайте о нашей миссии, команде и ценностях.`,
  alternates: { canonical: "/about" },
}

export default function About() {
  return <AboutPage />
}
