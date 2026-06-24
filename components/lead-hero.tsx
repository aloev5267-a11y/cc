"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import {
  IconUser,
  IconArrow,
  IconMapPin,
  IconBriefcase,
  IconClock,
  IconCheck,
  IconStar,
} from "./icons"
import { Messengers, type MessengersOptions } from "./messengers"
import { useRegion } from "@/hooks/use-geo"
import { siteConfig } from "@/lib/config"

const POPULAR_CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Краснодар",
  "Ростов-на-Дону",
  "Уфа",
  "Воронеж",
]

// Сферы работы — то, что соискатель ищет
const FIELDS = [
  { id: "courier", label: "Курьер", icon: IconBriefcase },
  { id: "warehouse", label: "Склад", icon: IconBriefcase },
  { id: "driver", label: "Водитель", icon: IconBriefcase },
  { id: "sales", label: "Продажи", icon: IconBriefcase },
  { id: "service", label: "Сервис и общепит", icon: IconBriefcase },
  { id: "other", label: "Другое", icon: IconBriefcase },
]

// Опыт работы
const EXPERIENCE = [
  { id: "none", label: "Без опыта" },
  { id: "lt1", label: "До 1 года" },
  { id: "1-3", label: "1–3 года" },
  { id: "gt3", label: "Более 3 лет" },
]

// График
const SCHEDULE = [
  { id: "full", label: "Полный день" },
  { id: "shift", label: "Сменный график" },
  { id: "flex", label: "Свободный график" },
  { id: "part", label: "Подработка" },
]

type Step = 1 | 2 | 3

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export function LeadHero() {
  const { city: detectedCity, ready } = useRegion("Москва")

  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [field, setField] = useState<string | null>(null)
  const [experience, setExperience] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<string | null>(null)

  // Подставляем определённый по гео город как значение по умолчанию.
  const effectiveCity = city || (ready ? detectedCity : "")

  const firstName = name.trim().split(/\s+/)[0] || ""

  const canContinueStep1 = name.trim().length >= 2
  const canContinueStep2 = Boolean(effectiveCity.trim() && field && experience)

  const fieldLabel = FIELDS.find((f) => f.id === field)?.label
  const experienceLabel = EXPERIENCE.find((e) => e.id === experience)?.label
  const scheduleLabel = SCHEDULE.find((s) => s.id === schedule)?.label

  // Формируем "бизнес-ссылку" с предзаполненным сообщением и сохраняем анкету в lead.
  const messengerOptions: MessengersOptions = useMemo(() => {
    const lines = [
      `Здравствуйте! Меня зовут ${name.trim() || "соискатель"}.`,
      `Ищу работу через ${siteConfig.name}, помогите подобрать вакансию.`,
    ]
    if (effectiveCity.trim()) lines.push(`Город: ${effectiveCity.trim()}`)
    if (fieldLabel) lines.push(`Сфера: ${fieldLabel}`)
    if (experienceLabel) lines.push(`Опыт: ${experienceLabel}`)
    if (scheduleLabel) lines.push(`График: ${scheduleLabel}`)

    return {
      message: lines.join("\n"),
      metadata: {
        Имя: name.trim() || "—",
        Город: effectiveCity.trim() || "—",
        Сфера: fieldLabel ?? "—",
        Опыт: experienceLabel ?? "—",
        График: scheduleLabel ?? "—",
      },
      source: "hero-lead",
      page: "home",
    }
  }, [name, effectiveCity, fieldLabel, experienceLabel, scheduleLabel])

  return (
    <section className="relative isolate overflow-hidden bg-background pt-20 md:pt-24 pb-10 md:pb-14">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          {/* Фоновое фото */}
          <div className="absolute inset-0">
            <Image
              src="/lead-hero.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-right"
            />
            {/* Затемнение слева под текст — синяя фирменная гамма */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent md:hidden" />
          </div>

          {/* Контент */}
          <div className="relative grid min-h-[30rem] md:min-h-[34rem]">
            <div className="flex flex-col justify-center px-5 py-9 sm:p-10 lg:p-14 max-w-2xl">
              {/* Индикатор шагов */}
              <div className="mb-6 flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s === step ? "w-8 bg-primary-foreground" : s < step ? "w-8 bg-primary-foreground/70" : "w-4 bg-primary-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* ШАГ 1 — имя */}
                {step === 1 && (
                  <motion.div key="step1" {...fade}>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground text-balance leading-[1.1]">
                      Как вас зовут?
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-primary-foreground/80 text-pretty max-w-md">
                      Заполните короткую анкету — и наш менеджер подберёт вам подходящую вакансию. Бесплатно для соискателя.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (canContinueStep1) setStep(2)
                      }}
                      className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl"
                    >
                      <div className="flex-1 flex items-center gap-3 bg-card rounded-2xl px-5 h-14 shadow-sm">
                        <IconUser className="w-5 h-5 text-muted-foreground shrink-0" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ваше имя"
                          aria-label="Ваше имя"
                          autoFocus
                          className="flex-1 min-w-0 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!canContinueStep1}
                        className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-card text-primary font-semibold shrink-0 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                      >
                        Продолжить
                        <IconArrow className="w-4 h-4" />
                      </button>
                    </form>

                    <p className="mt-4 text-xs text-primary-foreground/60 max-w-md">
                      Продолжая, вы принимаете{" "}
                      <a href={siteConfig.legal.terms} className="underline underline-offset-2 hover:text-primary-foreground">
                        условия
                      </a>{" "}
                      и{" "}
                      <a href={siteConfig.legal.privacy} className="underline underline-offset-2 hover:text-primary-foreground">
                        политику конфиденциальности
                      </a>
                      .
                    </p>
                  </motion.div>
                )}

                {/* ШАГ 2 — анкета */}
                {step === 2 && (
                  <motion.div key="step2" {...fade}>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary-foreground text-balance leading-[1.1]">
                      Привет, {firstName}!
                    </h2>
                    <p className="mt-3 text-base text-primary-foreground/80 text-pretty max-w-md">
                      Расскажите немного о себе — это поможет подобрать вакансию точнее.
                    </p>

                    <div className="mt-6 rounded-2xl bg-card p-5 sm:p-6 shadow-sm flex flex-col gap-5">
                      {/* Город */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2">
                          <IconMapPin className="w-4 h-4 text-primary" />
                          Ваш город
                        </label>
                        <input
                          list="cities"
                          value={effectiveCity}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Начните вводить город"
                          className="w-full rounded-xl border border-border bg-background px-4 h-11 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <datalist id="cities">
                          {POPULAR_CITIES.map((c) => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      </div>

                      {/* Сфера */}
                      <div>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2">
                          <IconBriefcase className="w-4 h-4 text-primary" />
                          Кем хотите работать
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {FIELDS.map((f) => {
                            const active = field === f.id
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => setField(f.id)}
                                className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background text-foreground hover:border-primary/40"
                                }`}
                              >
                                {f.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Опыт */}
                      <div>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2">
                          <IconStar className="w-4 h-4 text-primary" />
                          Опыт работы
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {EXPERIENCE.map((e) => {
                            const active = experience === e.id
                            return (
                              <button
                                key={e.id}
                                type="button"
                                onClick={() => setExperience(e.id)}
                                className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background text-foreground hover:border-primary/40"
                                }`}
                              >
                                {e.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* График */}
                      <div>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2">
                          <IconClock className="w-4 h-4 text-primary" />
                          Удобный график
                          <span className="font-normal text-muted-foreground">— необязательно</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {SCHEDULE.map((s) => {
                            const active = schedule === s.id
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => setSchedule((prev) => (prev === s.id ? null : s.id))}
                                className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background text-foreground hover:border-primary/40"
                                }`}
                              >
                                {s.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center justify-center h-12 px-5 rounded-2xl bg-primary-foreground/10 text-primary-foreground font-semibold transition-colors hover:bg-primary-foreground/20"
                      >
                        Назад
                      </button>
                      <button
                        type="button"
                        disabled={!canContinueStep2}
                        onClick={() => setStep(3)}
                        className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 h-12 px-8 rounded-2xl bg-card text-primary font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                      >
                        Подобрать вакансию
                        <IconArrow className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ШАГ 3 — мессенджеры */}
                {step === 3 && (
                  <motion.div key="step3" {...fade}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                      <IconCheck className="w-4 h-4" />
                      Анкета готова
                    </span>
                    <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary-foreground text-balance leading-[1.1]">
                      Класс, {firstName}!
                    </h2>
                    <p className="mt-3 text-base sm:text-lg text-primary-foreground/85 text-pretty max-w-md">
                      Напишите нам в удобный мессенджер — анкета уже в сообщении, и наш менеджер подберёт для вас вакансию.
                    </p>

                    <div className="mt-6 rounded-2xl bg-card p-5 sm:p-6 shadow-sm max-w-md">
                      {/* Сводка анкеты */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {[effectiveCity.trim(), fieldLabel, experienceLabel, scheduleLabel]
                          .filter(Boolean)
                          .map((chip) => (
                            <span
                              key={chip as string}
                              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                            >
                              {chip}
                            </span>
                          ))}
                      </div>
                      <Messengers options={messengerOptions} />
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="mt-3 w-full text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Изменить анкету
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
