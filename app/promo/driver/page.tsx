import type { Metadata } from "next"
import { PromoPage } from "@/components/promo/promo-page"
import { JobPostingSchema } from "@/components/promo/job-posting-schema"
import { siteConfig } from "@/lib/config"
import { promoRoles, getOtherRoles } from "@/lib/promo-config"

export const metadata: Metadata = {
  title: `Работа водителем — вакансии на авто | ${siteConfig.name}`,
  description:
    `${siteConfig.name} — кадровое агентство: подберём вакансию водителя на личном или служебном авто с гибким графиком. Услуги для соискателей бесплатны. Заполните анкету и напишите нам в мессенджер.`,
  keywords: "работа водителем, вакансия водитель, работа с личным авто, водитель доставки, кадровое агентство",
  alternates: { canonical: "/promo/driver" },
  openGraph: {
    title: "Работа водителем — вакансии на авто",
    description: "Подберём вакансию водителя с гибким графиком. Бесплатно для соискателей.",
    images: ["/promo/driver-hero.png"],
  },
}

export default function DriverPromoPage() {
  return (
    <>
      <JobPostingSchema role={promoRoles.driver} />
      <PromoPage role={promoRoles.driver} others={getOtherRoles("driver")} />
    </>
  )
}
