import type { Metadata } from "next"
import { JobsPromo } from "@/components/promo/jobs-promo"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: `Ищете работу? Подберём вакансию бесплатно | ${siteConfig.name}`,
  description:
    `${siteConfig.name} — кадровое агентство: поможем найти работу курьером, на складе или водителем у проверенных работодателей. Удобный график, официальное оформление. Услуги для соискателей бесплатны.`,
  keywords: "работа, вакансии, поиск работы, подработка, работа без опыта, кадровое агентство, трудоустройство",
  alternates: { canonical: "/promo/jobs" },
  openGraph: {
    title: "Ищете работу? Подберём вакансию бесплатно",
    description: "Курьер, склад, водитель — подберём вакансию под вас. Бесплатно для соискателей.",
    images: ["/promo/courier-hero.png"],
  },
}

export default function JobsPromoPage() {
  return <JobsPromo />
}
