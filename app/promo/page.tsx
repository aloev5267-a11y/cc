import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FortuneWheel } from "@/components/promo/fortune-wheel"
import { siteConfig } from "@/lib/config"
import { IconWallet, IconClock, IconCheck } from "@/components/icons"

export const metadata: Metadata = {
  title: `Колесо бонусов ${siteConfig.name} — работа с бонусом за выход на смену`,
  description:
    "Узнайте свой бонус при трудоустройстве через ElWork: выплаты каждый день, аванс в первый день, оформление за 1 день. Работа курьером, на складе и водителем. Подбор вакансии в Telegram.",
  alternates: { canonical: "/promo" },
  openGraph: {
    title: `Колесо бонусов ${siteConfig.name}`,
    description: "Узнайте свой бонус за выход на работу и подберите вакансию рядом с домом.",
    url: `${siteUrlSafe()}/promo`,
    type: "website",
  },
}

function siteUrlSafe() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

const TRUST = [
  { icon: IconWallet, label: "Выплаты каждый день" },
  { icon: IconClock, label: "Оформление за 1 день" },
  { icon: IconCheck, label: "Бонус каждому при выходе" },
]

export default function PromoPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />

      <section className="relative flex-1 overflow-hidden">
        {/* Мягкий синий фон-акцент */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:py-12">
          {/* Левая колонка — оффер */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              Бонус для новых соискателей
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-5xl">
              Узнайте свой <span className="text-primary">бонус</span> за выход на работу
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground lg:mx-0">
              Курьер, склад, водитель — подберём вакансию рядом с домом и поможем выйти на смену уже на этой неделе. Бонус закрепляем за вашей анкетой при трудоустройстве.
            </p>

            {/* Компактные преимущества */}
            <ul className="mx-auto mt-6 flex max-w-lg flex-col gap-2.5 lg:mx-0">
              {TRUST.map((t) => (
                <li key={t.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{t.label}</span>
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-6 max-w-lg text-xs leading-relaxed text-muted-foreground lg:mx-0">
              Бонусы предоставляются при трудоустройстве через {siteConfig.name} и зависят от вакансии и работодателя. Участие бесплатное для соискателя, не является лотереей или азартной игрой.
            </p>
          </div>

          {/* Правая колонка — колесо */}
          <div className="flex justify-center lg:justify-end">
            <FortuneWheel />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
