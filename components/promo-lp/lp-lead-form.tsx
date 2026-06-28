"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconMapPin, IconBriefcase, IconCheck, IconArrow, IconClock } from "@/components/icons"
import { Messengers, type MessengersOptions } from "@/components/messengers"
import { useRegion } from "@/hooks/use-geo"
import { RUSSIAN_CITIES } from "@/lib/cities"

// Лид-форма конверсионного лендинга для Яндекс.Директа.
// Короткий путь: город + направление → переход в мессенджеры (Telegram приоритет).
// Анкета намеренно минимальна, чтобы не терять трафик из рекламы.

const ROLES = [
  { id: "courier", label: "Курьер", hint: "от 70 000 ₽" },
  { id: "warehouse", label: "Склад", hint: "от 60 000 ₽" },
  { id: "driver", label: "Водитель", hint: "от 90 000 ₽" },
  { id: "any", label: "Любая работа рядом", hint: "подберём" },
]

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
}

export function LpLeadForm() {
  const { city: detectedCity } = useRegion("Москва")

  const [submitted, setSubmitted] = useState(false)
  const [city, setCity] = useState("")
  const [cityTouched, setCityTouched] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  const effectiveCity = cityTouched ? city : city || detectedCity
  const canSubmit = Boolean(role) && effectiveCity.trim().length > 1

  const roleLabel = useMemo(() => ROLES.find((r) => r.id === role)?.label ?? "", [role])

  const messengerOptions: MessengersOptions = useMemo(
    () => ({
      source: "lp-rabota",
      page: "rabota",
      message: `Здравствуйте! Ищу работу рядом с домом${effectiveCity ? ` в городе ${effectiveCity.trim()}` : ""}${
        roleLabel ? `. Направление: ${roleLabel}` : ""
      }. Хочу быстро выйти на смену.`,
      metadata: {
        ...(effectiveCity ? { Город: effectiveCity.trim() } : {}),
        ...(roleLabel ? { Направление: roleLabel } : {}),
        Источник: "Лендинг «Работа рядом»",
      },
    }),
    [effectiveCity, roleLabel],
  )

  return (
    <div className="w-full rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/5 sm:p-7">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="form" {...fade}>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
              <IconClock className="h-4 w-4" />
              Подбор за 1 минуту
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-foreground text-balance sm:text-2xl">
              Найдём работу рядом с вашим домом
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Ответьте на 2 вопроса — менеджер подберёт вакансию и поможет выйти на смену уже в ближайшие дни.
            </p>

            {/* Город */}
            <div className="mt-5">
              <label htmlFor="lp-city" className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <IconMapPin className="h-4 w-4 text-primary" />
                Ваш город или район
              </label>
              <input
                id="lp-city"
                list="lp-cities"
                value={effectiveCity}
                onChange={(e) => {
                  setCity(e.target.value)
                  setCityTouched(true)
                }}
                placeholder="Например, Москва"
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
              <datalist id="lp-cities">
                {RUSSIAN_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {/* Направление */}
            <div className="mt-4">
              <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <IconBriefcase className="h-4 w-4 text-primary" />
                Кем хотите работать
              </span>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => {
                  const active = role === r.id
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      <span className="text-sm font-semibold">{r.label}</span>
                      <span className={`text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {r.hint}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => setSubmitted(true)}
              className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Подобрать вакансию
              <IconArrow className="h-5 w-5" />
            </button>

            <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
              Бесплатно для соискателя. Нажимая кнопку, вы соглашаетесь с обработкой данных.
            </p>
          </motion.div>
        ) : (
          <motion.div key="done" {...fade}>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary w-fit">
              <IconCheck className="h-4 w-4" />
              Анкета готова
            </div>
            <h2 className="mt-3 text-xl font-extrabold text-foreground text-balance sm:text-2xl">
              Остался один шаг — напишите менеджеру
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Менеджер уже видит вашу заявку{roleLabel ? ` («${roleLabel}»` : ""}
              {effectiveCity ? `, ${effectiveCity.trim()})` : roleLabel ? ")" : ""}. Напишите в Telegram — ответим за пару минут и подберём вакансию рядом.
            </p>

            <div className="mt-5">
              <Messengers options={messengerOptions} />
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-3 w-full text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Изменить ответы
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
