import Link from "next/link"
import Image from "next/image"
import { IconArrow, IconCheck } from "./icons"
import { siteConfig } from "@/lib/config"

const highlights = [
  "Помощь бесплатна для соискателей",
  "Проверенные работодатели",
  "Быстрый отклик — обычно в тот же день",
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image fetchPriority="high" loading="eager" sizes="100vw"
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={75}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-3xl">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm font-semibold text-primary">{siteConfig.tagline}</span>
            </div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground mb-4 md:mb-6 text-balance">
              Найдём работу,{" "}
              <span className="gradient-text">которая вам подходит</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-6 leading-relaxed text-pretty">
              {siteConfig.name} — кадровое агентство, которое связывает соискателей с
              надёжными работодателями. Подберём вакансию под ваш опыт и график,
              а работодателям поможем закрыть позиции.
            </p>

            <ul className="space-y-2.5 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm sm:text-base text-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <IconCheck className="w-3.5 h-3.5 text-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
              <Link
                href="#find"
                className="group px-6 md:px-8 py-3.5 md:py-4 btn-primary text-primary-foreground font-bold text-sm md:text-base rounded-xl btn-shine flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                Подобрать работу
                <IconArrow className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/partners"
                className="group px-6 md:px-8 py-3.5 md:py-4 bg-card/80 backdrop-blur-sm border-2 border-border text-foreground font-bold text-sm md:text-base rounded-xl transition-all hover:border-primary/50 hover:bg-card flex items-center justify-center gap-2"
              >
                Я работодатель
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 md:gap-10 pt-8 border-t border-border/50">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">{siteConfig.stats.candidatesPlaced}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">трудоустроено</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-primary">{siteConfig.stats.partners}+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">работодателей</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">{siteConfig.stats.cities}+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">городов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
