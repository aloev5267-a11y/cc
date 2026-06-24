import Link from "next/link"
import Image from "next/image"
import { IconArrow, IconCheck } from "./icons"
import { siteConfig } from "@/lib/config"

const highlights = [
  "Бесплатно для соискателей",
  "Проверенные работодатели",
  "Отклик обычно в тот же день",
]

const stats = [
  { value: siteConfig.stats.candidatesPlaced, label: "трудоустроено" },
  { value: `${siteConfig.stats.partners}+`, label: "работодателей" },
  { value: `${siteConfig.stats.cities}+`, label: "городов" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden="true" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Left — editorial copy */}
          <div className="lg:col-span-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2.5 mb-7">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="eyebrow text-muted-foreground">{siteConfig.tagline}</span>
            </div>

            <h1 className="font-display text-[2.6rem] leading-[1.04] xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] text-foreground text-balance">
              Найдём работу,{" "}
              <span className="italic text-primary">которая вам&nbsp;подходит</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed text-pretty">
              {siteConfig.name} — кадровое агентство, которое связывает соискателей с
              надёжными работодателями. Подберём вакансию под ваш опыт и график,
              а работодателям поможем закрыть позиции.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm sm:text-[15px] text-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/12 flex items-center justify-center shrink-0">
                    <IconCheck className="w-3 h-3 text-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                href="#find"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 btn-primary font-semibold text-sm md:text-base rounded-full"
              >
                Подобрать работу
                <IconArrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-foreground/20 text-foreground font-semibold text-sm md:text-base rounded-full transition-colors hover:border-foreground/40 hover:bg-foreground/[0.03]"
              >
                Я работодатель
              </Link>
            </div>
          </div>

          {/* Right — framed image with floating stat */}
          <div className="lg:col-span-5">
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden border border-border shadow-[0_24px_60px_-30px_oklch(0.22_0.015_70/0.5)]">
                <Image
                  fetchPriority="high"
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  src="/hero-bg.png"
                  alt="Соискатели и работодатели находят друг друга с ElWork"
                  fill
                  className="object-cover object-center"
                  priority
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-card border border-border rounded-2xl px-5 py-4 shadow-[0_16px_40px_-20px_oklch(0.22_0.015_70/0.4)]">
                <div className="font-display text-3xl text-primary leading-none">{siteConfig.stats.avgPlacementDays}</div>
                <div className="text-xs text-muted-foreground mt-1.5">средний срок<br />до выхода на работу</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-border grid grid-cols-3 gap-4 max-w-2xl">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-none">{s.value}</div>
              <div className="mt-2 text-xs sm:text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
