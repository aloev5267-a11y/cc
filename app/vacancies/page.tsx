import { Metadata } from "next"
import { VacanciesPage } from "@/components/vacancies-page"

export const metadata: Metadata = {
  title: "Вакансии — КурьерХаб | Работа курьером и на складе",
  description: "Работа в КурьерХаб: вакансии курьеров, водителей-курьеров и сотрудников склада. Стабильный доход от 80 000 рублей, гибкий график, официальное оформление. Присоединяйтесь к команде!",
  keywords: "работа курьером, вакансии курьер, работа водителем, работа на складе, КурьерХаб вакансии, работа в доставке",
  alternates: {
    canonical: "/vacancies",
  },
  openGraph: {
    title: "Вакансии — КурьерХаб | Работа курьером и на складе",
    description: "Работа в КурьерХаб: вакансии курьеров, водителей-курьеров и сотрудников склада. Стабильный доход от 80 000 рублей, гибкий график.",
    type: "website",
  },
}

export default function Vacancies() {
  return <VacanciesPage />
}
