import type { Metadata } from "next"
import { CourierPromo } from "@/components/promo/courier-promo"
import { JobPostingSchema } from "@/components/promo/job-posting-schema"
import { promoRoles } from "@/lib/promo-config"

export const metadata: Metadata = {
  title: "Работа курьером — рассчитай свой доход | КурьерХаб",
  description:
    "Стань курьером КурьерХаб: ежедневные выплаты от 10 000 ₽, свободный график, старт за 1 день. Рассчитай свой доход интерактивно и напиши нам в мессенджер.",
  keywords: "работа курьером, вакансия курьер, подработка курьером, доставка, калькулятор дохода курьера",
  alternates: { canonical: "/promo/courier-calc" },
  openGraph: {
    title: "Работа курьером — рассчитай свой доход",
    description: "Ежедневные выплаты от 10 000 ₽, свободный график, старт за 1 день. Калькулятор дохода курьера.",
    images: ["/promo/courier-hero.png"],
  },
}

export default function CourierCalcPromoPage() {
  return (
    <>
      <JobPostingSchema role={promoRoles.courier} />
      <CourierPromo />
    </>
  )
}
