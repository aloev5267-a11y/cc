import type { Metadata } from "next"
import { PromoPage } from "@/components/promo/promo-page"
import { JobPostingSchema } from "@/components/promo/job-posting-schema"
import { promoRoles, getOtherRoles } from "@/lib/promo-config"

export const metadata: Metadata = {
  title: "Работа перевозчиком на авто — до 150 000 ₽ в месяц | КурьерХаб",
  description:
    "Перевозчик с личным авто в КурьерХаб: оплата топлива, постоянный поток заказов, еженедельные выплаты. Пройди опрос и напиши нам в мессенджер.",
  keywords: "работа водителем, перевозчик на авто, работа с личным авто, курьер на авто",
  alternates: { canonical: "/promo/driver" },
  openGraph: {
    title: "Работа перевозчиком на авто — до 150 000 ₽ в месяц",
    description: "Оплата топлива, постоянный поток заказов, еженедельные выплаты.",
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
