import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FortuneWheel } from "@/components/promo/fortune-wheel"
import { siteConfig } from "@/lib/config"
import { IconWallet, IconClock, IconCheck } from "@/components/icons"

export const metadata: Metadata = {
  title: `Колесо бонусов ${siteConfig.name} — крути и забирай работу с бонусом`,
  description:
    "Крути колесо и получи гарантированный бонус: выплаты каждый день, аванс в первый день, трудоустройство за 1 день. Работа курьером, на складе и водителем. Забери бонус в Telegram.",
  alternates: { canonical: "/promo" },
  openGraph: {
    title: `Колесо бонусов ${siteConfig.name}`,
    description: "Крути колесо — бонус получает каждый. Забери работу с бонусом уже сегодня.",
    url: `${siteUrlSafe()}/promo`,
    type: "website",
  },
}

function siteUrlSafe() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

const TRUST = [
  { icon: IconWallet, label: "Выплаты", value: "каждый день" },
  { icon: IconClock, label: "Оформление", value: "за 1 день" },
  { icon: IconCheck, label: "Бонус", value: "каждому" },
]

export default function PromoPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden">
        {/* Мягкий синий фон-акцент сверху */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              Только для новых соискателей
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground text-balance">
              Крути колесо.{" "}
              <span className="text-primary">Забери бонус</span> и работу.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
              Никакого развода — бонус получает каждый. Курьер, склад, водитель: подберём вакансию рядом с домом и поможем выйти на смену уже на этой неделе.
            </p>
          </div>

          {/* Колесо */}
          <div className="mt-10 flex justify-center">
            <FortuneWheel />
          </div>

          {/* Доверительные метрики */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {TRUST.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <t.icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{t.label}</p>
                  <p className="text-base font-bold text-foreground">{t.value}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-lg text-center text-xs text-muted-foreground">
            Бонусы предоставляются при трудоустройстве через {siteConfig.name} и зависят от вакансии и работодателя. Участие бесплатное для соискателя.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
