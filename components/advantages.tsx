"use client"

import { motion } from "framer-motion"
import { IconHeart, IconShield, IconClock, IconHeadphones } from "./icons"

const advantages = [
  {
    icon: IconHeart,
    title: "Бесплатно для соискателей",
    description: "Подбор вакансий и сопровождение на собеседованиях не стоят вам ничего. Услуги оплачивает работодатель.",
  },
  {
    icon: IconShield,
    title: "Только проверенные компании",
    description: "Работаем с официально оформленными работодателями. Проверяем условия до того, как предложить вам вакансию.",
  },
  {
    icon: IconClock,
    title: "Быстрый отклик",
    description: "Не ждите неделями. Обычно мы возвращаемся с подходящими вариантами в день обращения.",
  },
  {
    icon: IconHeadphones,
    title: "Поддержка на всех этапах",
    description: "Поможем составить резюме, подготовиться к собеседованию и сопроводим до выхода на работу.",
  },
]

export function Advantages() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
            Почему нам доверяют
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-balance">
            Помогаем найти работу честно и спокойно
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Мы на стороне соискателя: подбираем вакансии под ваши навыки и сопровождаем до выхода на работу.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {advantages.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card-elevated rounded-2xl p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2 text-balance">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
