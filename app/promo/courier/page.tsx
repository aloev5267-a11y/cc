import type { Metadata } from "next"
import { PromoPage } from "@/components/promo/promo-page"
import { JobPostingSchema } from "@/components/promo/job-posting-schema"
import { promoRoles, getOtherRoles } from "@/lib/promo-config"

export const metadata: Metadata = {
  title: "Работа курьером — от 10 000 ₽ в день | КурьерХаб",
  description:
    "Стань курьером КурьерХаб: ежедневные выплаты от 10 000 ₽, свободный график, старт за 1 день. Пройди короткий опрос и напиши нам в мессенджер.",
  keywords: "работа курьером, вакансия курьер, подработка курьером, доставка",
  alternates: { canonical: "/promo/courier" },
  openGraph: {
    title: "Работа курьером — от 10 000 ₽ в день",
    description: "Ежедневные выплаты от 10 000 ₽, свободный график, старт за 1 день.",
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
