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
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <p className="eyebrow text-primary mb-5">Почему нам доверяют</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground text-balance leading-[1.08]">
            Помогаем найти работу{" "}
            <span className="italic text-primary">честно и спокойно</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl text-pretty leading-relaxed">
            Мы на стороне соискателя: подбираем вакансии под ваши навыки и сопровождаем до выхода на работу.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {advantages.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative pt-6 border-t-2 border-foreground/15 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display text-2xl text-muted-foreground/60 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2.5 text-balance">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
