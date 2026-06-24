import { Metadata } from "next"
import { AboutPage } from "@/components/about-page"

export const metadata: Metadata = {
  title: "О компании — КурьерХаб | ООО Феникс",
  description: "КурьерХаб — логистическая платформа от ООО «Фестивальное движение Феникс». Узнайте о нашей миссии, команде и ценностях.",
  alternates: { canonical: "/about" },
}

export default function About() {
  return <AboutPage />
}
