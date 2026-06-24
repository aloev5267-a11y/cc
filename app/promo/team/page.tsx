import type { Metadata } from "next"
import { TeamPromo } from "@/components/promo/team-promo"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: `Найдём работу под вас | ${siteConfig.name}`,
  description:
    `${siteConfig.name} — кадровое агентство: расскажите о себе, и мы подберём подходящую вакансию у проверенного работодателя. Без оплаты для соискателя, поддержка на всех этапах трудоустройства.`,
  keywords: "поиск работы, подбор вакансии, кадровое агентство, трудоустройство, работа без опыта",
  alternates: { canonical: "/promo/team" },
  openGraph: {
    title: "Найдём работу под вас",
    description: "Расскажите о себе — подберём подходящую вакансию. Бесплатно для соискателей.",
    images: ["/promo/courier-hero.png"],
  },
}

export default function TeamPromoPage() {
  return <TeamPromo />
}
