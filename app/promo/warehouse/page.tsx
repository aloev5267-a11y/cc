import type { Metadata } from "next"
import { PromoPage } from "@/components/promo/promo-page"
import { JobPostingSchema } from "@/components/promo/job-posting-schema"
import { siteConfig } from "@/lib/config"
import { promoRoles, getOtherRoles } from "@/lib/promo-config"

export const metadata: Metadata = {
  title: `Работа на складе — вакансии с официальным оформлением | ${siteConfig.name}`,
  description:
    `${siteConfig.name} — кадровое агентство: подберём вакансию на складе с официальным оформлением и графиком 2/2. Рассмотрим и без опыта. Услуги для соискателей бесплатны. Заполните анкету и напишите нам.`,
  keywords: "работа на складе, вакансия комплектовщик, сотрудник склада, склад, кадровое агентство",
  alternates: { canonical: "/promo/warehouse" },
  openGraph: {
    title: "Работа на складе — вакансии с официальным оформлением",
    description: "Подберём вакансию на складе с графиком 2/2. Бесплатно для соискателей.",
    images: ["/promo/warehouse-hero.png"],
  },
}

export default function WarehousePromoPage() {
  return (
    <>
      <JobPostingSchema role={promoRoles.warehouse} />
      <PromoPage role={promoRoles.warehouse} others={getOtherRoles("warehouse")} />
    </>
  )
}
