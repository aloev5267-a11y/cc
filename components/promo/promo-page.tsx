"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconArrow, IconArrowUpRight, IconCheck, IconPackage, IconWarehouse, IconCar } from "../icons"
import { PromoMessengers } from "./promo-messengers"
import { VpnNotice } from "./vpn-notice"
import { siteConfig } from "@/lib/config"
import { buildLeadMessage, type PromoRole, type PromoRoleKey } from "@/lib/promo-config"

const roleIcons: Record<PromoRoleKey, typeof IconCar> = {
  courier: IconPackage,
  warehouse: IconWarehouse,
  driver: IconCar,
}

export function PromoPage({ role, others }: { role: PromoRole; others: PromoRole[] }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [textInput, setTextInput] = useState("")

  const total = role.quiz.length
  const completed = step >= total
  const current = role.quiz[step]
  const progress = Math.round((Math.min(step, total) / total) * 100)

  function commit(questionId: string, value: string) {
    const nextAnswers = { ...answers, [questionId]: value }
    setAnswers(nextAnswers)
    setTextInput("")
    setStep(step + 1)
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = textInput.trim()
    if (!value || !current) return
    commit(current.id, value)
  }

  function reset() {
    setStep(0)
    setAnswers({})
    setTextInput("")
  }

  // Готовое сообщение + читаемые метаданные для бизнес-ссылки
  const messengerOptions = useMemo(() => {
    if (!completed) return undefined
    const metadata: Record<string, string> = {}
    for (const q of role.quiz) {
      if (answers[q.id]) metadata[q.summaryLabel] = answers[q.id]
    }
    return {
      message: buildLeadMessage(role, answers),
      metadata,
      source: `promo-${role.key}`,
      page: role.key,
    }
  }, [completed, answers, role])

  return (
    <main className="relative flex min-h-[100svh] flex-col bg-zinc-950 text-white">
      {/* Фоновое изображение + затемнение */}
      <div className="absolute inset-0 z-0">
        <Image
          src={role.image || "/placeholder.svg"}
          alt={role.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center]"
        />
        {/* Горизонтальное затемнение: слева плотно (под текст), справа открываем фото */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 from-10% via-zinc-950/70 via-50% to-zinc-950/10" />
        {/* Лёгкий вертикальный скрим сверху и снизу */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/20 to-zinc-950/40" />
        {/* Изумрудное свечение */}
        <div className="absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-primary/20 blur-[130px]" />
      </div>

      {/* Шапка */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
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

      {/* Контент */}
      <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-8 px-4 py-6 sm:px-8 lg:min-h-0 lg:grid-cols-[1.1fr_440px] lg:gap-12 lg:py-4">
        {/* Левая часть — питч */}
        <section className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {role.badge}
          </span>

          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {role.title}
            <span className="mt-2 block text-primary">через {siteConfig.name}</span>
          </h1>

          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-4xl font-black text-white sm:text-5xl">{role.earn}</span>
            <span className="pb-1.5 text-base font-medium text-white/55">{role.earnNote}</span>
          </div>

          <p className="max-w-md text-pretty text-base text-white/70 sm:text-lg">{role.subtitle}</p>

          {/* Статы */}
          <div className="grid max-w-lg grid-cols-3 gap-3">
            {role.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
              >
                <div className="text-lg font-black leading-none text-primary sm:text-xl">{s.value}</div>
                <div className="mt-1.5 text-[11px] leading-tight text-white/55">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Преимущества */}
          <div className="flex flex-wrap gap-2">
            {role.benefits.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 backdrop-blur-sm"
              >
                <IconCheck className="h-3.5 w-3.5 text-primary" />
                {b}
              </span>
            ))}
          </div>
        </section>

        {/* Правая часть — стеклянная карточка анкеты */}
        <section className="w-full rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
          {/* Прогресс */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${completed ? 100 : progress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white/60">
              {Math.min(step + (completed ? 0 : 1), total)}/{total}
            </span>
          </div>

          {!completed && current ? (
            <div key={step} className="animate-fade-in-up">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Подбор за 30 секунд
              </p>
              <h2 className="mb-5 text-balance text-2xl font-extrabold leading-tight">{current.question}</h2>

              {current.type === "input" ? (
                <form onSubmit={handleTextSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={current.placeholder}
                    autoFocus
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-base font-medium text-white placeholder:text-white/40 outline-none transition-colors focus:border-primary"
                  />
                  {current.suggestions && (
                    <div className="flex flex-wrap gap-2">
                      {current.suggestions.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => commit(current.id, c)}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:border-primary hover:text-white"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Далее
                    <IconArrow className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {(current.options ?? []).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => commit(current.id, opt.value)}
                      className="group flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-left font-semibold text-white transition-all hover:border-primary hover:bg-primary/15"
                    >
                      <span>{opt.label}</span>
                      <IconArrow className="h-4 w-4 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                <IconCheck className="h-6 w-6" />
              </div>
              <h2 className="text-balance text-2xl font-black">{role.matchTitle}</h2>
              <p className="mt-2 text-pretty text-sm text-white/70">{role.matchText}</p>

              {/* Сводка ответов */}
              <div className="mt-4 flex flex-wrap gap-2">
                {role.quiz.map((q) =>
                  answers[q.id] ? (
                    <span
                      key={q.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
                    >
                      <span className="text-white/40">{q.summaryLabel}:</span>
                      <span className="font-semibold text-white">{answers[q.id]}</span>
                    </span>
                  ) : null,
                )}
              </div>

              <div className="mt-5">
                <VpnNotice />
                <PromoMessengers options={messengerOptions} />
              </div>
              <p className="mt-3 text-center text-xs text-white/45">
                Ответы уже в сообщении — просто нажмите «Отправить» в мессенджере
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-2 w-full text-center text-xs font-medium text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Пройти анкету заново
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Нижний блок — другие вакансии + дисклеймер */}
      <footer className="relative z-10 flex flex-col items-center justify-center gap-3 border-t border-white/10 bg-zinc-950/60 px-4 py-4 backdrop-blur sm:px-8">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <span className="text-sm font-semibold text-white/60">Не подошла вакансия? Выберите другую:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {others.map((o) => {
              const OIcon = roleIcons[o.key]
              return (
                <Link
                  key={o.key}
                  href={o.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-all hover:border-primary hover:bg-primary/15"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <OIcon className="h-3.5 w-3.5" />
                  </span>
                  {o.title}
                  <IconArrowUpRight className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-primary" />
                </Link>
              )
            })}
          </div>
        </div>
        <p className="max-w-2xl text-center text-[11px] leading-relaxed text-white/35">
          {siteConfig.company.name} — кадровое агентство. Услуги для соискателей бесплатны.
          Размер дохода зависит от работодателя, города, графика и объёма работы и не является публичной офертой.
        </p>
      </footer>
    </main>
  )
}
