import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/structured-data"
import { breadcrumbSchema, absoluteUrl } from "@/lib/structured-data"
import { siteConfig } from "@/lib/config"
import { IconMapPin, IconClock, IconWallet } from "@/components/icons"
import { LpLeadForm } from "@/components/promo-lp/lp-lead-form"
import {
  LpTrustStrip,
  LpCategories,
  LpSteps,
  LpBenefits,
  LpReviews,
  LpFaq,
} from "@/components/promo-lp/lp-sections"
import { FAQ_ITEMS } from "@/components/promo-lp/faq-data"

const PAGE_PATH = "/rabota"
const TITLE = `Работа рядом с домом — быстрый выход на смену | ${siteConfig.name}`
const DESCRIPTION =
  "Подберём работу рядом с домом: курьер, склад, водитель. Выход на смену за 1–2 дня, выплаты каждый день, оформление официально. Бесплатно для соискателя — оставьте заявку."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  // Рекламный лендинг под Яндекс.Директ — закрываем от индексации, чтобы не
  // конкурировать с основными страницами в органике, но ссылки обходить разрешаем.
  robots: { index: false, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PAGE_PATH),
    type: "website",
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [absoluteUrl("/og-image.png")],
  },
}

const HERO_TRUST = [
  { icon: IconMapPin, label: "Вакансии в вашем районе" },
  { icon: IconClock, label: "Выход на смену за 1–2 дня" },
  { icon: IconWallet, label: "Выплаты каждый день" },
]

// FAQ-микроразметка (помогает в выдаче и подтверждает релевантность для модерации).
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

const breadcrumb = breadcrumbSchema([
  { name: "Главная", path: "/" },
  { name: "Работа рядом с домом", path: PAGE_PATH },
])

export default function RabotaLandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <JsonLd data={[breadcrumb, faqSchema]} />
      <Header />

      {/* ============ ГЕРО ============ */}
      <section className="relative overflow-x-clip">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:py-16">
          {/* Оффер */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              Работа рядом с домом
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-5xl">
              Работа рядом с домом — <span className="text-primary">выход на смену уже завтра</span>
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground lg:mx-0">
              Курьер, склад, водитель и другие направления. Подберём вакансию в вашем районе, поможем оформиться и быстро выйти на смену. Выплаты каждый день.
            </p>

            <ul className="mx-auto mt-6 flex max-w-lg flex-col gap-2.5 lg:mx-0">
              {HERO_TRUST.map((t) => (
                <li key={t.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{t.label}</span>
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-6 max-w-lg text-xs leading-relaxed text-muted-foreground lg:mx-0">
              Подбор бесплатный для соискателя. Доход и условия указаны работодателями и зависят от вакансии и города.
            </p>
          </div>

          {/* Форма-квиз */}
          <div className="flex min-w-0 justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <LpLeadForm />
            </div>
          </div>
        </div>
      </section>

      <LpTrustStrip />
      <LpCategories />
      <LpSteps />
      <LpBenefits />
      <LpReviews />
      <LpFaq />

      {/* ============ ФИНАЛЬНЫЙ CTA ============ */}
      <section className="border-t border-border bg-primary/5">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground text-balance sm:text-3xl">
            Готовы выйти на работу рядом с домом?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Оставьте заявку — менеджер подберёт вакансию и поможет выйти на смену в ближайшие дни.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <LpLeadForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
