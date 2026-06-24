"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrowUpRight,
  IconCheck,
  IconSearch,
  IconWallet,
  IconClock,
  IconShield,
  IconSend,
  IconPackage,
  IconWarehouse,
  IconCar,
  IconStar,
} from "../icons"
import { PromoMessengers, type PromoMessengersOptions } from "./promo-messengers"
import { siteConfig } from "@/lib/config"
import { promoRoles, type PromoRoleKey } from "@/lib/promo-config"

const roleIcons: Record<PromoRoleKey, typeof IconCar> = {
  courier: IconPackage,
  warehouse: IconWarehouse,
  driver: IconCar,
}

// Приоритеты пользователя → очки для каждой вакансии (умный подбор)
type Scores = Record<PromoRoleKey, number>

type Priority = {
  id: string
  label: string
  icon: typeof IconWallet
  scores: Partial<Scores>
}

const priorities: Priority[] = [
  {
    id: "money",
    label: "Максимальный доход",
    icon: IconWallet,
    scores: { driver: 3, courier: 2, warehouse: 1 },
  },
  {
    id: "flex",
    label: "Свободный график",
    icon: IconClock,
    scores: { courier: 3, driver: 2, warehouse: 0 },
  },
  {
    id: "stable",
    label: "Стабильность и оформление",
    icon: IconShield,
    scores: { warehouse: 3, driver: 1, courier: 0 },
  },
  {
    id: "noexp",
    label: "Старт без опыта",
    icon: IconStar,
    scores: { courier: 3, warehouse: 2, driver: 1 },
  },
]

type WorkStyle = {
  id: string
  label: string
  hint: string
  scores: Partial<Scores>
}

const workStyles: WorkStyle[] = [
  { id: "move", label: "В движении по городу", hint: "Пешком, велосипед, самокат", scores: { courier: 4, driver: 1, warehouse: 0 } },
  { id: "indoor", label: "В тепле на месте", hint: "Склад, понятные задачи", scores: { warehouse: 4, courier: 0, driver: 0 } },
  { id: "car", label: "За рулём своего авто", hint: "Превратить машину в доход", scores: { driver: 4, courier: 1, warehouse: 0 } },
]

const roleOrder: PromoRoleKey[] = ["courier", "warehouse", "driver"]

export function JobsPromo() {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [style, setStyle] = useState<string | null>(null)

  const togglePriority = (id: string) =>
    setSelectedPriorities((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))

  const hasInput = selectedPriorities.length > 0 || style !== null

  // Считаем очки каждой вакансии по выбранным предпочтениям
  const scored = useMemo(() => {
    const base: Scores = { courier: 0, warehouse: 0, driver: 0 }
    for (const p of priorities) {
      if (selectedPriorities.includes(p.id)) {
        for (const k of roleOrder) base[k] += p.scores[k] ?? 0
      }
    }
    if (style) {
      const s = workStyles.find((w) => w.id === style)
      if (s) for (const k of roleOrder) base[k] += s.scores[k] ?? 0
    }
    const ranked = [...roleOrder].sort((a, b) => base[b] - base[a])
    return { base, ranked }
  }, [selectedPriorities, style])

  const bestKey = hasInput ? scored.ranked[0] : null
  const bestRole = bestKey ? promoRoles[bestKey] : null

  const maxScore = Math.max(scored.base.courier, scored.base.warehouse, scored.base.driver, 1)

  const messengerOptions: PromoMessengersOptions = useMemo(() => {
    const intro = bestRole
      ? `Здравствуйте! Ищу работу, по подбору мне подходит вакансия «${bestRole.title}».`
      : `Здравствуйте! Ищу работу через ${siteConfig.name}, подскажите по актуальным вакансиям.`
    const lines = [intro]
    if (selectedPriorities.length) {
      const labels = priorities.filter((p) => selectedPriorities.includes(p.id)).map((p) => p.label)
      lines.push(`Что важно: ${labels.join(", ")}`)
    }
    if (style) {
      const s = workStyles.find((w) => w.id === style)
      if (s) lines.push(`Формат работы: ${s.label}`)
    }
    return {
      message: lines.join("\n"),
      metadata: {
        Подбор: bestRole?.title ?? "Не выбрано",
        Приоритеты: selectedPriorities.length
          ? priorities.filter((p) => selectedPriorities.includes(p.id)).map((p) => p.label).join(", ")
          : "—",
      },
      source: "promo-jobs",
      page: "jobs",
    }
  }, [bestRole, selectedPriorities, style])

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-zinc-950 text-white">
      {/* Фоновое свечение */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-40 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute right-0 top-1/2 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      {/* Шапка */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg">
            <Image src="/logo.png" alt={siteConfig.name} fill className="object-cover" priority />
          </div>
          <span className="text-base font-extrabold tracking-tight">
            {siteConfig.brandPrefix}<span className="text-primary">{siteConfig.brandSuffix}</span>
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
        >
          На сайт
          <IconArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-8 text-center sm:px-8 lg:pt-14">
        <span className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Кадровое агентство — бесплатно для соискателей
        </span>

        <h1 className="mx-auto mt-5 max-w-4xl text-balance text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          Ищешь работу?
          <span className="mt-2 block text-primary">Мы собрали лучшие вакансии</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
          Удобный график и официальное оформление у проверенных работодателей. Ответьте на пару вопросов — подберём
          вакансию, которая подходит именно вам. Бесплатно для соискателя.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#match"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <IconSearch className="h-4 w-4" />
            Подобрать вакансию
          </a>
          <a
            href="#vacancies"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            Смотреть все вакансии
          </a>
        </div>

        {/* Доверие */}
        <div className="mx-auto mt-9 grid max-w-2xl grid-cols-3 gap-3">
          {[
            { value: "Бесплатно", label: "для соискателя" },
            { value: "1–3 дня", label: "на подбор" },
            { value: "30+", label: "городов России" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="text-lg font-black leading-none text-primary sm:text-2xl">{s.value}</div>
              <div className="mt-1.5 text-[11px] leading-tight text-white/55 sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Интерактивный подбор */}
      <section id="match" className="relative z-10 mx-auto max-w-6xl scroll-mt-6 px-4 py-12 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px]">
            {/* Вопросы */}
            <div className="flex flex-col gap-7 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <IconSearch className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black sm:text-2xl">Умный подбор вакансии</h2>
                  <p className="text-sm text-white/55">Отметь, что важно — покажем лучший вариант</p>
                </div>
              </div>

              {/* Приоритеты */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Что для тебя важно</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {priorities.map((p) => {
                    const isActive = selectedPriorities.includes(p.id)
                    const PIcon = p.icon
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePriority(p.id)}
                        className={`flex items-center gap-2.5 rounded-2xl border p-3.5 text-left transition-all ${
                          isActive
                            ? "border-primary bg-primary/15 shadow-[0_0_0_1px_var(--color-primary)]"
                            : "border-white/15 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isActive ? "bg-primary/25 text-primary" : "bg-white/10 text-white/60"
                          }`}
                        >
                          <PIcon className="h-5 w-5" />
                        </span>
                        <span className={`text-sm font-bold ${isActive ? "text-white" : "text-white/80"}`}>
                          {p.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Формат работы */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Как хочешь работать</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {workStyles.map((w) => {
                    const isActive = style === w.id
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setStyle((prev) => (prev === w.id ? null : w.id))}
                        className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                          isActive
                            ? "border-primary bg-primary/15 shadow-[0_0_0_1px_var(--color-primary)]"
                            : "border-white/15 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <span className={`text-sm font-bold ${isActive ? "text-white" : "text-white/80"}`}>
                          {w.label}
                        </span>
                        <span className="text-[11px] text-white/50">{w.hint}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Результат подбора */}
            <div className="relative flex flex-col justify-between gap-5 border-t border-white/10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6 sm:p-8 lg:border-l lg:border-t-0">
              <span className="text-xs font-bold uppercase tracking-widest text-white/55">Рекомендуем тебе</span>

              {bestRole ? (
                <div className="flex flex-col gap-4">
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10">
                    <Image
                      src={bestRole.image || "/placeholder.svg"}
                      alt={bestRole.imageAlt}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-2xl font-black leading-none">{bestRole.title}</div>
                      <div className="mt-1 text-sm text-white/70">{bestRole.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5">
                    <span className="text-sm text-white/60">Доход</span>
                    <span className="text-xl font-black text-primary">
                      {bestRole.earn}
                      <span className="ml-1 text-xs font-medium text-white/50">{bestRole.earnNote}</span>
                    </span>
                  </div>

                  {/* Шкалы совпадения */}
                  <div className="flex flex-col gap-2">
                    {scored.ranked.map((k) => {
                      const r = promoRoles[k]
                      const pct = Math.round((scored.base[k] / maxScore) * 100)
                      const isBest = k === bestKey
                      return (
                        <div key={k} className="flex items-center gap-2.5">
                          <span className={`w-28 shrink-0 text-xs font-semibold ${isBest ? "text-white" : "text-white/50"}`}>
                            {r.title}
                          </span>
                          <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                            <span
                              className={`block h-full rounded-full transition-all duration-500 ${isBest ? "bg-primary" : "bg-white/30"}`}
                              style={{ width: `${Math.max(pct, 6)}%` }}
                            />
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-zinc-950/40 p-4 backdrop-blur">
                    <p className="mb-3 text-center text-sm font-semibold text-white">Напиши нам — подбор уже в сообщении</p>
                    <PromoMessengers options={messengerOptions} />
                    <Link
                      href={bestRole.href}
                      className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-primary transition-colors hover:text-white"
                    >
                      Подробнее о вакансии
                      <IconArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 py-12 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white/40">
                    <IconSearch className="h-7 w-7" />
                  </span>
                  <p className="max-w-[14rem] text-sm text-white/50">
                    Отметь, что для тебя важно — и мы подберём лучшую вакансию
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Все вакансии */}
      <section id="vacancies" className="relative z-10 mx-auto max-w-6xl scroll-mt-6 px-4 py-12 sm:px-8">
        <h2 className="mb-2 text-balance text-3xl font-black sm:text-4xl">Открытые вакансии</h2>
        <p className="mb-7 text-pretty text-white/60">Выберите направление — подберём вакансию у проверенного работодателя</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {roleOrder.map((k) => {
            const r = promoRoles[k]
            const RIcon = roleIcons[k]
            const isBest = k === bestKey
            return (
              <Link
                key={k}
                href={r.href}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white/5 transition-all hover:-translate-y-1 ${
                  isBest ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]" : "border-white/10 hover:border-white/25"
                }`}
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={r.image || "/placeholder.svg"}
                    alt={r.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                  {isBest && (
                    <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-primary-foreground">
                      Твой выбор
                    </span>
                  )}
                  <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950/60 text-primary backdrop-blur">
                    <RIcon className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <h3 className="text-xl font-black">{r.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{r.subtitle}</p>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-primary">{r.earn}</span>
                    <span className="text-xs text-white/50">{r.earnNote}</span>
                  </div>
                  <ul className="mt-1 flex flex-col gap-1.5">
                    {r.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-white/70">
                        <IconCheck className="h-4 w-4 shrink-0 text-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-primary">
                    Откликнуться
                    <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Почему мы */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <h2 className="mb-7 text-balance text-3xl font-black sm:text-4xl">Почему работают с нами</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: IconWallet, t: "Бесплатно для соискателя", d: "Услуги агентства для кандидатов бесплатны — оплачивает работодатель." },
            { icon: IconClock, t: "Гибкий график", d: "Подберём вакансию под вас: подработка или полная занятость." },
            { icon: IconShield, t: "Проверенные работодатели", d: "Прозрачные условия и официальное оформление по ТК РФ." },
            { icon: IconSend, t: "Быстрый отклик", d: "Заполните анкету — специалист свяжется и подберёт варианты." },
          ].map((f) => {
            const FIcon = f.icon
            return (
              <div key={f.t} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <FIcon className="h-6 w-6" />
                </span>
                <h3 className="mt-3 text-lg font-bold">{f.t}</h3>
                <p className="mt-1.5 text-sm text-white/60">{f.d}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-8">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-primary/30 bg-primary/10 p-8 text-center sm:p-10">
          <h2 className="text-balance text-3xl font-black sm:text-4xl">Готов начать зарабатывать?</h2>
          <p className="max-w-md text-pretty text-sm text-white/70 sm:text-base">
            Напиши нам в удобный мессенджер — поможем выбрать вакансию и оформим за пару минут.
          </p>
          <div className="w-full max-w-sm">
            <PromoMessengers options={messengerOptions} />
          </div>
          <p className="text-[11px] text-white/45">Ответим в течение нескольких минут · без опыта · с 18 лет</p>
        </div>
      </section>
    </main>
  )
}
