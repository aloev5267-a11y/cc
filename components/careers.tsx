"use client"

import { motion } from "framer-motion"
import { IconCheck } from "./icons"
import { Messengers } from "./messengers"

const points = [
  "Расскажите, какую работу ищете",
  "Получите подборку проверенных вакансий",
  "Бесплатное сопровождение до выхода на работу",
]

export function FindWork() {
  return (
    <section id="find" className="relative py-16 md:py-24 lg:py-28 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto card-elevated rounded-3xl p-6 sm:p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left — content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm font-semibold text-primary">Подбираем вакансии сейчас</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground text-balance">
                Напишите нам — подберём работу под вас
              </h2>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed text-pretty">
                Выберите удобный мессенджер. Специалист агентства ответит, уточнит детали
                и предложит подходящие вакансии. Это бесплатно для соискателя.
              </p>

              <ul className="space-y-3">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <IconCheck className="w-4 h-4 text-primary" />
                    </span>
                    <span className="text-sm sm:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right — messenger CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-muted/50 border border-border rounded-2xl p-6"
            >
              <p className="text-sm font-semibold text-foreground mb-4 text-center">
                Откликнуться в мессенджере
              </p>
              <Messengers options={{ source: "home-find", message: "Здравствуйте! Хочу найти работу через ElWork." }} />
              <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
                Нажимая на кнопку, вы соглашаетесь на обработку персональных данных
                в соответствии с политикой конфиденциальности.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
