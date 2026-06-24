import { Metadata } from "next"
import { CitiesPage } from "@/components/cities-page"

export const metadata: Metadata = {
  title: "География доставки",
  description: "КурьерХаб осуществляет доставку грузов в 14 регионах России: Москва и МО, Ивановская, Воронежская, Тверская, Нижегородская области, Краснодарский край, Башкортостан, Свердловская область и другие.",
  keywords: ["доставка Москва", "доставка Краснодар", "доставка Екатеринбург", "доставка по России", "курьерская служба"],
  alternates: { canonical: "/cities" },
  openGraph: {
    title: "География доставки — КурьерХаб",
    description: "Доставка грузов в 14 регионах России",
    images: ["/russia-map.webp"],
  },
}

export default function Cities() {
  return <CitiesPage />
}
