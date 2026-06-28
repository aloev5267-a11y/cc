"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  IconMapPin,
  IconWallet,
  IconClock,
  IconShield,
  IconCheck,
  IconPackage,
  IconCar,
  IconWarehouse,
  IconFileText,
  IconUserPlus,
  IconHandshake,
  IconChevronDown,
  IconStar,
} from "@/components/icons"
import { siteConfig } from "@/lib/config"
import { FAQ_ITEMS } from "./faq-data"

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

// ============ Полоса доверия под героем ============
const TRUST = [
  { icon: IconMapPin, title: "Рядом с домом", text: "Вакансии в вашем районе — без долгой дороги" },
  { icon: IconClock, title: "Выход за 1–2 дня", text: "Оформление быстрое, смену получаете сразу" },
  { icon: IconWallet, title: "Выплаты каждый день", text: "Деньги на карту ежедневно, аванс в первый день" },
  { icon: IconShield, title: "Официально", text: "По ТК РФ или самозанятость — на ваш выбор" },
]

export function LpTrustStrip() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-10">
        {TRUST.map((t, i) => (
          <motion.div key={t.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <t.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">{t.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ============ Направления работы ============
const CATEGORIES = [
  {
    icon: IconPackage,
    title: "Курьер",
    salary: "от 70 000 ₽",
    points: ["Пеший, вело или авто", "Свободный график", "Работа в своём районе"],
  },
  {
    icon: IconWarehouse,
    title: "Склад",
    salary: "от 60 000 ₽",
    points: ["Комплектовщик, кладовщик", "Дневные и ночные смены", "Склады рядом с метро"],
  },
  {
    icon: IconCar,
    title: "Водитель",
    salary: "от 90 000 ₽",
    points: ["Категории B, C, E", "Свой или служебный транспорт", "Маршруты рядом с домом"],
  },
]

export function LpCategories() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <motion.div {...reveal} className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground text-balance sm:text-3xl">
          Самые востребованные направления
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
          Подберём вакансию рядом с домом под ваш график. Доход указан работодателями, зависит от смен и города.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.title}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{c.salary}</span>
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-foreground">{c.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {c.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ============ Как это работает ============
const STEPS = [
  { icon: IconFileText, title: "Оставьте заявку", text: "Заполните короткую анкету или напишите в Telegram — это займёт минуту." },
  { icon: IconUserPlus, title: "Получите подборку", text: "Менеджер подберёт вакансии рядом с домом под ваш график и опыт." },
  { icon: IconHandshake, title: "Выходите на смену", text: "Помогаем с оформлением — выход на работу уже в ближайшие 1–2 дня." },
]

export function LpSteps() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <motion.div {...reveal} className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground text-balance sm:text-3xl">
            Как начать работать
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Три простых шага — от заявки до первой смены.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="absolute right-5 top-5 text-3xl font-black text-primary/15">{i + 1}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ Преимущества ============
const BENEFITS = [
  "Вакансии рядом с домом — экономите время на дорогу",
  "Выплаты каждый день, аванс уже в первый рабочий день",
  "Без опыта — обучим и подберём подходящую смену",
  "Свободный и сменный график — работа под вашу жизнь",
  "Официальное оформление по ТК РФ или самозанятость",
  "Подбор полностью бесплатный для соискателя",
]

export function LpBenefits() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <motion.div {...reveal} className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground text-balance sm:text-3xl">
          Почему соискатели выбирают {siteConfig.name}
        </h2>
      </motion.div>
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconCheck className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-foreground">{b}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ============ Отзывы ============
const REVIEWS = [
  { name: "Алексей", role: "Курьер, Москва", text: "Нашёл работу в своём районе за день. Выплаты реально каждый день, дорога до точки 10 минут." },
  { name: "Марина", role: "Склад, Казань", text: "Помогли с оформлением, вышла на смену уже через два дня. График удобный, склад рядом с домом." },
  { name: "Дмитрий", role: "Водитель, СПб", text: "Подобрали маршруты недалеко от дома. Менеджер на связи, отвечал быстро в Telegram." },
]

export function LpReviews() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <motion.div {...reveal} className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground text-balance sm:text-3xl">
            Отзывы соискателей
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, k) => (
                  <IconStar key={k} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">{r.text}</p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm font-bold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ FAQ ============
export function LpFaq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <motion.div {...reveal} className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground text-balance sm:text-3xl">
          Частые вопросы
        </h2>
      </motion.div>
      <div className="mt-8 flex flex-col gap-3">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.q} className="overflow-hidden rounded-2xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-bold text-foreground sm:text-base">{item.q}</span>
                <IconChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
