"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  IconWallet, 
  IconClock, 
  IconPhone as IconSmartphone, 
  IconCheck,
  IconMapPin,
  IconArrow
} from "./icons"

const benefits = [
  {
    icon: IconWallet,
    value: "80К+",
    label: "рублей в месяц",
    description: "Реальный доход"
  },
  {
    icon: IconClock,
    value: "Гибкий",
    label: "график работы",
    description: "Работай когда удобно"
  },
  {
    icon: IconWallet,
    value: "1 день",
    label: "до выплаты",
    description: "Быстрые выплаты"
  },
  {
    icon: IconSmartphone,
    value: "Удобно",
    label: "всё в телефоне",
    description: "Простое приложение"
  },
]

const requirements = [
  "Гражданство РФ или разрешение на работу",
  "Возраст от 18 лет",
  "Смартфон с интернетом",
  "Ответственность и пунктуальность",
]

const cities = [
  "Москва", "Иваново", "Воронеж", "Тверь", 
  "Н.Новгород", "В.Новгород", "Ярославль", "Владимир",
  "Краснодар", "Уфа", "Екатеринбург", "Тула", "Рязань", "Челябинск"
]

export function Careers() {
  return (
    <section id="careers" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-green-600">Набираем команду</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 md:mb-6 text-foreground">
              Стань частью{" "}
              <span className="gradient-text">КурьерХаб</span>
            </h2>

            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Мы создаём новый логистический сервис и ищем ответственных людей в нашу команду. 
              Работай в своём темпе без начальников над головой — только ты решаешь, когда и сколько работать.
            </p>

            {/* Benefits grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
                >
                  <benefit.icon className="w-6 h-6 text-primary mb-2" />
                  <div className="text-2xl font-black text-foreground">{benefit.value}</div>
                  <div className="text-xs text-muted-foreground">{benefit.description}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href="/vacancies"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 btn-primary text-primary-foreground font-bold rounded-xl btn-shine"
              >
                Смотреть вакансии
                <IconArrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
              >
                Задать вопрос
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Requirements card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
              {/* Header with image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/hero-bg.webp"
                  alt="Работа курьером"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <div className="flex items-center gap-2 mb-1">
                    <IconCheck className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-500">Быстрый старт</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Что нужно для работы
                  </h3>
                </div>
              </div>

              {/* Requirements */}
              <div className="p-6 space-y-4">
                {requirements.map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <IconCheck className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-foreground">{req}</span>
                  </motion.div>
                ))}
              </div>

              {/* Cities */}
              <div className="p-6 bg-muted/50 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <IconMapPin className="w-5 h-5 text-primary" />
                  <span className="font-bold text-foreground">Ищем в городах:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <span
                      key={city}
                      className="px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
