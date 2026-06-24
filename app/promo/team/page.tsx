import type { Metadata } from "next"
import { TeamPromo } from "@/components/promo/team-promo"

export const metadata: Metadata = {
  title: "Присоединяйся к команде | КурьерХаб",
  description:
    "Мы растём и набираем людей в команду КурьерХаб. Без резюме и собеседований — расскажи о себе, и мы подберём занятие под тебя. Стабильный доход, гибкий график, поддержка с первого дня.",
  keywords: "работа в команде, набор сотрудников, вакансии, работа без опыта, присоединиться к команде",
  alternates: { canonical: "/promo/team" },
  openGraph: {
    title: "Присоединяйся к нашей команде",
    description: "Набираем людей в команду: стабильный доход, гибкий график, поддержка с первого дня.",
    images: ["/promo/courier-hero.png"],
  },
}

export default function TeamPromoPage() {
  return <TeamPromo />
}
