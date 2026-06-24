"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  IconPackage,
  IconCar,
  IconWarehouse,
  IconUsers,
  IconHeadphones,
  IconBriefcase,
  IconArrow,
} from "./icons"

const categories = [
  { icon: IconPackage, title: "Курьеры и пешие доставщики", count: "Много вакансий", href: "/vacancies" },
  { icon: IconCar, title: "Водители", count: "Личный и корпоративный транспорт", href: "/vacancies" },
  { icon: IconWarehouse, title: "Склад и логистика", count: "Комплектовщики, кладовщики", href: "/vacancies" },
  { icon: IconUsers, title: "Линейный персонал", count: "Продавцы, кассиры, упаковщики", href: "/vacancies" },
  { icon: IconHeadphones, title: "Поддержка и операторы", count: "Колл-центр, чат-поддержка", href: "/vacancies" },
  { icon: IconBriefcase, title: "Офис и администрирование", count: "Менеджеры, ассистенты", href: "/vacancies" },
]

export function JobCategories() {
  return (
    <section className="relative py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
              Направления
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-balance">
              Кому мы помогаем найти работу
            </h2>
          </div>
          <Link
            href="/vacancies"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all shrink-0"
          >
            Все вакансии
            <IconArrow className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                href={cat.href}
                className="group card-elevated rounded-2xl p-6 flex items-center gap-4 h-full"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground text-primary">
                  <cat.icon className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-foreground mb-0.5 text-balance">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count}</p>
                </div>
                <IconArrow className="w-5 h-5 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
