import type { Metadata } from "next"
import { PromoPage } from "@/components/promo/promo-page"
import { JobPostingSchema } from "@/components/promo/job-posting-schema"
import { siteConfig } from "@/lib/config"
import { promoRoles, getOtherRoles } from "@/lib/promo-config"

export const metadata: Metadata = {
  title: `Работа курьером — вакансии у проверенных работодателей | ${siteConfig.name}`,
  description:
    `${siteConfig.name} — кадровое агентство: подберём вакансию курьера с удобным графиком в вашем городе. Услуги для соискателей бесплатны. Заполните короткую анкету и напишите нам в мессенджер.`,
  keywords: "работа курьером, вакансия курьер, подработка курьером, доставка, кадровое агентство",
  alternates: { canonical: "/promo/courier" },
  openGraph: {
    title: "Работа курьером — вакансии у проверенных работодателей",
    description: "Подберём вакансию курьера с удобным графиком в вашем городе. Бесплатно для соискателей.",
    images: ["/promo/courier-hero.png"],
  },
}

export default function CourierPromoPage() {
  return (
    <>
      <JobPostingSchema role={promoRoles.courier} />
      <PromoPage role={promoRoles.courier} others={getOtherRoles("courier")} />
    </>
  )
}
