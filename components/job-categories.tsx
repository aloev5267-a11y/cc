"use client"

import { motion } from "framer-motion"
import {
  IconPackage,
  IconCar,
  IconWarehouse,
  IconUsers,
  IconHeart,
  IconBriefcase,
  IconArrow,
} from "./icons"
import { startLead, type LeadField } from "@/lib/lead"

// Направления соответствуют сферам в квизе LeadHero — клик заполняет анкету и
// прокручивает к ней, чтобы соискатель сразу продолжил с нужной сферой.
const directions: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  hint: string
  field: LeadField
}[] = [
  { icon: IconPackage, title: "Курьеры и доставка", hint: "Пешие, авто, вело и самокат", field: "courier" },
  { icon: IconCar, title: "Водители", hint: "Личный и корпоративный транспорт", field: "driver" },
  { icon: IconWarehouse, title: "Склад и логистика", hint: "Комплектовщики, кладовщики, грузчики", field: "warehouse" },
  { icon: IconUsers, title: "Продавцы и кассиры", hint: "Розница, торговые залы, маркеты", field: "sales" },
  { icon: IconHeart, title: "Сервис и общепит", hint: "Повара, бариста, официанты, клининг", field: "service" },
  { icon: IconBriefcase, title: "Другие профессии", hint: "Офис, поддержка, производство", field: "other" },
]

export function JobCategories() {
  return (
    <section className="relative py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-8 md:mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-balance">
            Работа по направлениям
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty leading-relaxed">
            Выберите, что вам ближе — мы заполним анкету и подберём подходящие вакансии в вашем городе.
            Это бесплатно для соискателя.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {directions.map((dir, index) => (
            <motion.div
              key={dir.field}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <button
                type="button"
                onClick={() => startLead(dir.field)}
                className="group card-elevated rounded-2xl p-6 flex items-center gap-4 h-full w-full text-left"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground text-primary">
                  <dir.icon className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-foreground mb-0.5 text-balance">{dir.title}</h3>
                  <p className="text-sm text-muted-foreground">{dir.hint}</p>
                </div>
                <IconArrow className="w-5 h-5 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            type="button"
            onClick={() => startLead()}
            className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold"
          >
            Подобрать вакансию
            <IconArrow className="w-4 h-4" />
          </button>
          <p className="text-sm text-muted-foreground">
            Не нашли своё направление? Заполните анкету — менеджер предложит варианты.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
