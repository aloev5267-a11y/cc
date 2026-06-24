import type { Metadata } from "next"
import { PromoPage } from "@/components/promo/promo-page"
import { JobPostingSchema } from "@/components/promo/job-posting-schema"
import { promoRoles, getOtherRoles } from "@/lib/promo-config"

export const metadata: Metadata = {
  title: "Работа на складе — до 80 000 ₽ в месяц | КурьерХаб",
  description:
    "Сотрудник склада в КурьерХаб: официальное оформление, график 2/2, стабильный оклад, обучение с первого дня. Пройди опрос и напиши нам.",
  keywords: "работа на складе, вакансия комплектовщик, сотрудник склада, склад",
  alternates: { canonical: "/promo/warehouse" },
  openGraph: {
    title: "Работа на складе — до 80 000 ₽ в месяц",
    description: "Официальное оформление, график 2/2, стабильный оклад.",
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
