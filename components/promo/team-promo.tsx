"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrowUpRight,
  IconCheck,
  IconUsers,
  IconWallet,
  IconClock,
  IconShield,
  IconSend,
  IconHeart,
  IconHandshake,
  IconStar,
  IconTarget,
} from "../icons"
import { PromoMessengers, type PromoMessengersOptions } from "./promo-messengers"
import { siteConfig } from "@/lib/config"

// Промо-страница "присоединяйся к команде" — без привязки к конкретным вакансиям.
// Интерактивный шаг: человек выбирает, кто он и что ищет, ответы уходят в предзаполненное
// сообщение мессенджера и в metadata лида (source: "promo-team").

type Vibe = {
  id: string
  emoji?: never
  label: string
  hint: string
}

// "Кто ты" — мягкая самоидентификация без конкретных вакансий
const vibes: Vibe[] = [
  { id: "active", label: "Люблю движение", hint: "Не сидится на месте" },
  { id: "stable", label: "Ищу стабильность", hint: "Хочу уверенность в завтра" },
  { id: "extra", label: "Нужна подработка", hint: "Совмещаю с делами" },
  { id: "start", label: "Начинаю с нуля", hint: "Без опыта, но с желанием" },
]

// "Что важно" — приоритеты, тоже без конкретики по ролям
const wants: { id: string; label: string; icon: typeof IconWallet }[] = [
  { id: "money", label: "Достойный доход", icon: IconWallet },
  { id: "free", label: "Удобный график", icon: IconClock },
  { id: "care", label: "Поддержка на старте", icon: IconHeart },
  { id: "fair", label: "Официальное оформление", icon: IconShield },
]

const values = [
  {
    icon: IconHandshake,
    title: "Сопровождаем кандидата",
    text: "Помогаем на каждом этапе: от анкеты до оформления у работодателя.",
  },
  {
    icon: IconWallet,
    title: "Бесплатно для соискателя",
    text: "Услуги агентства для кандидатов бесплатны — их оплачивает работодатель.",
  },
  {
    icon: IconTarget,
    title: "Подбираем под вас",
    text: "Учитываем ваши пожелания по графику, городу и формату занятости.",
  },
  {
    icon: IconClock,
    title: "Ценим ваше время",
    text: "Быстрый отклик и подбор вариантов без долгих ожиданий.",
  },
]

export function TeamPromo() {
  const [vibe, setVibe] = useState<string | null>(null)
  const [selectedWants, setSelectedWants] = useState<string[]>([])

  const toggleWant = (id: string) =>
    setSelectedWants((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]))

  const hasInput = vibe !== null || selectedWants.length > 0

  const messengerOptions: PromoMessengersOptions = useMemo(() => {
    const lines = ["Здравствуйте! Хочу присоединиться к вашей команде."]
    if (vibe) {
      const v = vibes.find((x) => x.id === vibe)
      if (v) lines.push(`О себе: ${v.label.toLowerCase()}`)
    }
    if (selectedWants.length) {
      const labels = wants.filter((w) => selectedWants.includes(w.id)).map((w) => w.label.toLowerCase())
      lines.push(`Что важно: ${labels.join(", ")}`)
    }
    return {
      message: lines.join("\n"),
      metadata: {
        "О себе": vibe ? (vibes.find((x) => x.id === vibe)?.label ?? "—") : "—",
        Приоритеты: selectedWants.length
          ? wants.filter((w) => selectedWants.includes(w.id)).map((w) => w.label).join(", ")
          : "—",
      },
      source: "promo-team",
      page: "team",
    }
  }, [vibe, selectedWants])

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-zinc-950 text-white">
      {/* Фоновое свечение */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-40 -top-20 h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[150px]" />
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
          Набираем людей в команду
        </span>

        <h1 className="mx-auto mt-5 max-w-4xl text-balance text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          Присоединяйся
          <span className="mt-2 block text-primary">к нашей команде</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
          Мы помогаем соискателям найти подходящую работу у проверенных работодателей. Расскажите о себе —
          и специалист подберёт вакансии под ваши пожелания.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#join"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <IconUsers className="h-4 w-4" />
            Хочу в команду
          </a>
          <a
            href="#values"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            Почему мы
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

      {/* Интерактивный шаг "расскажи о себе" */}
      <section id="join" className="relative z-10 mx-auto max-w-6xl scroll-mt-6 px-4 py-12 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px]">
            {/* Вопросы */}
            <div className="flex flex-col gap-7 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <IconUsers className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black sm:text-2xl">Расскажи о себе</h2>
                  <p className="text-sm text-white/55">Пара кликов — и мы знаем, чем тебя увлечь</p>
                </div>
              </div>

              {/* Кто ты */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Что тебе ближе</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {vibes.map((v) => {
                    const isActive = vibe === v.id
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVibe((prev) => (prev === v.id ? null : v.id))}
                        className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                          isActive
                            ? "border-primary bg-primary/15 shadow-[0_0_0_1px_var(--color-primary)]"
                            : "border-white/15 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <span className={`text-sm font-bold ${isActive ? "text-white" : "text-white/80"}`}>
                          {v.label}
                        </span>
                        <span className="text-[11px] text-white/50">{v.hint}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Что важно */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Что для тебя важно</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {wants.map((w) => {
                    const isActive = selectedWants.includes(w.id)
                    const WIcon = w.icon
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => toggleWant(w.id)}
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
                          <WIcon className="h-5 w-5" />
                        </span>
                        <span className={`text-sm font-bold ${isActive ? "text-white" : "text-white/80"}`}>
                          {w.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Результат / приглашение */}
            <div className="relative flex flex-col justify-center gap-5 border-t border-white/10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex flex-col gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/25 text-primary">
                  <IconHandshake className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-2xl font-black leading-tight">
                    {hasInput ? "Похоже, тебе у нас понравится" : "Будем рады тебе"}
                  </h3>
                  <p className="mt-2 text-sm text-white/65">
                    {hasInput
                      ? "Напиши нам — мы уже добавили твои ответы в сообщение. Подберём занятие под тебя за пару минут."
                      : "Отметь, что тебе ближе, или просто напиши нам — поможем определиться вместе."}
                  </p>
                </div>

                <ul className="flex flex-col gap-2">
                  {["Ответим в течение рабочего дня", "Бесплатно для соискателя", "Подбор вариантов под ваш запрос"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-white/75">
                      <IconCheck className="h-4 w-4 shrink-0 text-primary" />
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl border border-white/15 bg-zinc-950/40 p-4 backdrop-blur">
                  <p className="mb-3 text-center text-sm font-semibold text-white">Напиши нам в удобный мессенджер</p>
                  <PromoMessengers options={messengerOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ценности команды */}
      <section id="values" className="relative z-10 mx-auto max-w-6xl scroll-mt-6 px-4 py-12 sm:px-8">
        <h2 className="mb-2 text-balance text-3xl font-black sm:text-4xl">Почему с нами хорошо</h2>
        <p className="mb-7 text-pretty text-white/60">Мы строим команду, в которой хочется оставаться</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const VIcon = v.icon
            return (
              <div key={v.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <VIcon className="h-6 w-6" />
                </span>
                <h3 className="mt-3 text-lg font-bold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-white/60">{v.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Отзыв / соцдоказательство */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm sm:p-10">
          <div className="flex gap-1 text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStar key={i} className="h-5 w-5" />
            ))}
          </div>
          <blockquote className="mt-4 text-balance text-xl font-semibold leading-snug sm:text-2xl">
            «Искал работу, но не хотел тратить недели на поиски. Специалисты агентства быстро подобрали несколько
            вариантов под мой график и помогли с оформлением. Всё по-человечески».
          </blockquote>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-primary">
              <IconUsers className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold">Алексей, соискатель</div>
              <div className="text-xs text-white/50">Москва</div>
            </div>
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-8">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-primary/30 bg-primary/10 p-8 text-center sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/25 text-primary">
            <IconSend className="h-7 w-7" />
          </span>
          <h2 className="text-balance text-3xl font-black sm:text-4xl">Станешь частью команды?</h2>
          <p className="max-w-md text-pretty text-sm text-white/70 sm:text-base">
            Напиши нам в удобный мессенджер — познакомимся, ответим на вопросы и поможем начать.
          </p>
          <div className="w-full max-w-sm">
            <PromoMessengers options={messengerOptions} />
          </div>
          <p className="text-[11px] text-white/45">Ответим в течение рабочего дня · бесплатно для соискателя</p>
        </div>
      </section>
    </main>
  )
}
