import type { Metadata } from "next"
import { JobsPromo } from "@/components/promo/jobs-promo"

export const metadata: Metadata = {
  title: "Ищешь работу? Лучшие вакансии с доходом до 300 000 ₽ | КурьерХаб",
  description:
    "Подбери работу под себя: курьер, сотрудник склада или перевозчик. Свободный график, выплаты без задержек, старт без опыта за 1 день. Пройди умный подбор вакансии.",
  keywords: "работа, вакансии, поиск работы, подработка, работа без опыта, работа с ежедневной оплатой",
  alternates: { canonical: "/promo/jobs" },
  openGraph: {
    title: "Ищешь работу? Мы собрали лучшие вакансии",
    description: "Курьер, склад, перевозчик — подбери вакансию под себя за минуту. Доход до 300 000 ₽ в месяц.",
    images: ["/promo/courier-hero.png"],
  },
}

export default function JobsPromoPage() {
  return <JobsPromo />
}
