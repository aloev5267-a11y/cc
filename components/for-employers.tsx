"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconArrow, IconUsers, IconClock, IconShield } from "./icons"

const benefits = [
  { icon: IconUsers, title: "База кандидатов", text: "Подберём линейный и квалифицированный персонал под ваши задачи." },
  { icon: IconClock, title: "Быстро закрываем", text: "Первых кандидатов присылаем в короткие сроки после заявки." },
  { icon: IconShield, title: "Гарантия замены", text: "Если кандидат не подошёл — бесплатно подберём замену." },
]

export function ForEmployers() {
  return (
    <section className="relative py-16 md:py-24 bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/20 rounded-full text-sm font-semibold text-primary mb-4">
              Работодателям
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-balance">
              Закроем ваши вакансии подходящими людьми
            </h2>
            <p className="text-background/70 mb-8 leading-relaxed max-w-lg text-pretty">
              {`Берём на себя поиск, первичный отбор и сопровождение кандидатов. Вы получаете готовых
              к работе сотрудников и платите только за результат.`}
            </p>
            <Link
              href="/partners"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl btn-shine"
            >
              Оставить заявку на подбор
              <IconArrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid gap-4">
            {benefits.map((b, index) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-4 bg-background/5 border border-background/10 rounded-2xl p-5"
              >
                <div className="w-11 h-11 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <b.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-balance">{b.title}</h3>
                  <p className="text-sm text-background/70 leading-relaxed text-pretty">{b.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
