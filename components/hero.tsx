import Link from "next/link"
import Image from "next/image"
import { IconArrow } from "./icons"
import { siteConfig } from "@/lib/config"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image fetchPriority="high" loading="eager" sizes="100vw"
          src="/hero-bg.webp"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={75}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-3xl">
          
          <div className="animate-fade-in-up">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground mb-4 md:mb-6 text-balance">
              Доставка по России{" "}
              <span className="gradient-text">без границ</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Отправляй грузы в любой город за минуту. Или присоединяйся к команде курьеров — 
              <span className="text-foreground font-semibold"> гибкий график и честные выплаты</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
              <a 
                href="#delivery"
                className="group px-6 md:px-8 py-3.5 md:py-4 btn-primary text-primary-foreground font-bold text-sm md:text-base rounded-xl btn-shine flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                Оформить доставку
              </a>
              
              <Link 
                href="/vacancies"
                className="group px-6 md:px-8 py-3.5 md:py-4 bg-card/80 backdrop-blur-sm border-2 border-border text-foreground font-bold text-sm md:text-base rounded-xl transition-all hover:border-primary/50 hover:bg-card flex items-center justify-center gap-2"
              >
                Работа у нас
                <IconArrow className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 md:gap-10 pt-8 border-t border-border/50">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">{siteConfig.stats.regions}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">регионов РФ</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-primary">{siteConfig.stats.support}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">поддержка</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">{siteConfig.stats.firstOrderDays}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">до первого заказа</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
