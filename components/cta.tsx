"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { IconArrow } from "./icons"

export function CTA() {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-3 sm:mb-4 text-foreground text-balance">
            Готовы начать поиск работы?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-10 max-w-xl mx-auto text-pretty">
            Посмотрите актуальные вакансии или напишите нам — подберём вариант под ваш опыт и график.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/vacancies"
              className="group w-full sm:w-auto px-8 py-4 btn-primary text-primary-foreground font-bold rounded-xl btn-shine flex items-center justify-center gap-2"
            >
              Смотреть вакансии
              <IconArrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#find"
              className="w-full sm:w-auto px-8 py-4 bg-card border-2 border-border text-foreground font-bold rounded-xl transition-all hover:border-primary/50 hover:shadow-lg flex items-center justify-center"
            >
              Написать в мессенджер
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
