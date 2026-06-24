"use client"

import { motion } from "framer-motion"
import { Header } from "./header"
import { Footer } from "./footer"
import { HireStaff } from "./hire-staff"
import { siteConfig } from "@/lib/config"
import {
  IconCheck,
  IconArrow,
  IconUsers,
  IconClock,
  IconShield,
  IconBriefcase,
} from "./icons"

const benefits = [
  {
    title: "Быстрый подбор",
    description: "Закрываем вакансии в среднем за несколько дней благодаря собственной базе кандидатов.",
    icon: IconClock,
  },
  {
    title: "Проверенные кандидаты",
    description: "Предварительный отбор и собеседования — вы получаете только релевантных соискателей.",
    icon: IconShield,
  },
  {
    title: "Массовый и точечный найм",
    description: "Закрываем как единичные позиции, так и массовый подбор линейного персонала.",
    icon: IconUsers,
  },
  {
    title: "Персональный менеджер",
    description: "Закреплённый специалист сопровождает подбор и решает все вопросы.",
    icon: IconBriefcase,
  },
]

const partnerTypes = [
  {
    title: "Логистика и доставка",
    description: "Курьеры, водители, комплектовщики и сотрудники складов.",
    features: ["Массовый подбор", "Линейный персонал", "Быстрый выход"],
  },
  {
    title: "Ритейл и сервис",
    description: "Продавцы, кассиры, сотрудники торговых залов и общепита.",
    features: ["Подбор под смены", "Сезонный найм", "Замены"],
  },
  {
    title: "Производство",
    description: "Рабочие специальности и линейный персонал для предприятий.",
    features: ["Рабочие на линию", "Вахта", "Регулярные потоки"],
  },
]

export function PartnersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <span className="text-sm font-semibold text-primary">Работодателям</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
                Нужны люди? Закроем ваши вакансии <span className="gradient-text">быстро</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {siteConfig.name} — кадровое агентство полного цикла. Подбираем линейный и массовый персонал
                из собственной базы кандидатов и берём на себя весь процесс найма.
              </p>

              <a
                href="#hire"
                className="inline-flex items-center gap-2 px-8 py-4 btn-primary text-primary-foreground font-bold rounded-xl"
              >
                Договориться о подборе
                <IconArrow className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Почему работодатели выбирают нас</h2>
              <p className="text-muted-foreground">Берём на себя поиск, отбор и сопровождение кандидатов</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Кого подбираем</h2>
              <p className="text-muted-foreground">Решения для разных отраслей</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {partnerTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <IconCheck className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Единый рабочий CTA — связь с менеджером по подбору через мессенджер */}
        <HireStaff source="employer-partners" />
      </main>
      <Footer />
    </>
  )
}
