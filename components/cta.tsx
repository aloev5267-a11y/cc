"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { IconArrow } from "./icons"

// Кастомная иконка
const IconBolt = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" />
  </svg>
)

export function CTA() {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-3 sm:mb-4 text-foreground">
            Стань частью команды
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-10 max-w-xl mx-auto">
            Мы только запустились и ищем людей, готовых строить 
            будущее логистики вместе с нами. Присоединяйся!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href="/vacancies"
                className="group w-full sm:w-auto px-8 py-4 btn-primary text-primary-foreground font-bold rounded-xl btn-shine flex items-center justify-center gap-2"
              >
                <IconBolt className="w-5 h-5" />
                Смотреть вакансии
                <IconArrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.a
              href="#about"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full sm:w-auto px-8 py-4 bg-card border-2 border-border text-foreground font-bold rounded-xl transition-all hover:border-primary/50 hover:shadow-lg flex items-center justify-center"
            >
              О компании
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
