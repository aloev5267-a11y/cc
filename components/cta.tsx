"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { IconArrow } from "./icons"

export function CTA() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-foreground text-background px-6 py-14 sm:px-12 md:px-16 md:py-20"
        >
          {/* decorative wordmark */}
          <div
            aria-hidden="true"
            className="absolute -right-6 -bottom-10 font-display text-background/[0.05] text-[14rem] leading-none select-none pointer-events-none"
          >
            ✦
          </div>

          <div className="relative max-w-2xl">
            <p className="eyebrow text-background/50 mb-5">Начните сегодня</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.06] text-balance">
              Готовы начать{" "}
              <span className="italic text-primary-foreground/90 underline decoration-primary decoration-2 underline-offset-[6px]">
                поиск работы?
              </span>
            </h2>
            <p className="mt-5 text-background/70 text-base md:text-lg max-w-xl text-pretty leading-relaxed">
              Посмотрите актуальные вакансии или напишите нам — подберём вариант под ваш опыт и график. Для соискателей бесплатно.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                href="/vacancies"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-background text-foreground font-semibold rounded-full transition-transform hover:scale-[1.02]"
              >
                Смотреть вакансии
                <IconArrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#find"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-background/25 text-background font-semibold rounded-full transition-colors hover:bg-background/10"
              >
                Написать в мессенджер
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
