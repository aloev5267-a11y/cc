import { Metadata } from "next"
import { TrackingPage } from "@/components/tracking-page"

export const metadata: Metadata = {
  title: "Отслеживание посылки — КурьерХаб",
  description: "Отслеживайте свою посылку по трек-номеру. Личный кабинет КурьерХаб находится в разработке.",
  alternates: { canonical: "/tracking" },
}

export default function Tracking() {
  return <TrackingPage />
}
