"use client"

import { motion } from "framer-motion"
import { IconMessage, IconUsers, IconBriefcase, IconCheck } from "./icons"

const steps = [
  {
    icon: IconMessage,
    title: "Оставьте заявку",
    description: "Напишите нам в удобный мессенджер и коротко расскажите, какую работу ищете: город, график, опыт.",
  },
  {
    icon: IconUsers,
    title: "Подберём вакансии",
    description: "Наш специалист свяжется с вами и предложит подходящие варианты у проверенных работодателей.",
  },
  {
    icon: IconBriefcase,
    title: "Собеседование",
    description: "Поможем подготовиться и договоримся о встрече с работодателем в удобное время.",
  },
  {
    icon: IconCheck,
    title: "Выход на работу",
    description: "Сопроводим до оформления и поддержим на старте. Для вас всё бесплатно.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative py-16 md:py-28 scroll-mt-24 border-t border-border gradient-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <p className="text-sm font-semibold text-primary mb-3">Как это работает</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-balance leading-tight">
            Четыре простых шага до новой работы
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl text-pretty leading-relaxed">
            Без долгих анкет и оплат — только живое общение и реальные вакансии.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative bg-card border border-border rounded-2xl p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="font-display text-4xl text-muted-foreground/40 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2 text-balance">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
