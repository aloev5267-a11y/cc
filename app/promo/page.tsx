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
  // Рекламный лендинг — закрываем от индексации, чтобы он не попадал в органику
  // и не привлекал внимание алгоритмов/модерации как «кликбейт». Ссылки при этом
  // разрешаем обходить (follow), чтобы вес переходил на основные страницы.
  robots: { index: false, follow: true },
  openGraph: {
    title: `Колесо бонусов ${siteConfig.name}`,
    description: "Узнайте свой бонус за выход на работу и подберите вакансию рядом с домом.",
    url: `${siteUrlSafe()}/promo`,
    type: "website",
    images: [{ url: `${siteUrlSafe()}/og-promo.png`, width: 1200, height: 630, alt: `Колесо бонусов ${siteConfig.name}`, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Колесо бонусов ${siteConfig.name}`,
    description: "Узнайте свой бонус за выход на работу и подберите вакансию рядом с домом.",
    images: [`${siteUrlSafe()}/og-promo.png`],
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

      <section className="relative flex-1 overflow-x-clip">
        {/* Мягкий синий фон-акцент */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:py-16">
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
          <div className="flex min-w-0 justify-center lg:justify-end">
            <FortuneWheel />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
