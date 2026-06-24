"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrow,
  IconArrowUpRight,
  IconCheck,
  IconWallet,
  IconClock,
  IconCalculator,
  IconPackage,
  IconWarehouse,
  IconCar,
} from "../icons"
import { PromoMessengers, type PromoMessengersOptions } from "./promo-messengers"
import { promoRoles, getOtherRoles, type PromoRoleKey } from "@/lib/promo-config"

const roleIcons: Record<PromoRoleKey, typeof IconCar> = {
  courier: IconPackage,
  warehouse: IconWarehouse,
  driver: IconCar,
}

const role = promoRoles.courier
const others = getOtherRoles("courier")

// Ставка фиксированная — 500 ₽ за заказ. Транспорт влияет на то, сколько заказов реально успеть за день.
const RATE_PER_ORDER = 500

const transports = [
  { id: "foot", label: "Пешком", rate: RATE_PER_ORDER, ordersMax: 12, hint: "В центре города" },
  { id: "bike", label: "Велосипед / самокат", rate: RATE_PER_ORDER, ordersMax: 20, hint: "Оптимальный баланс" },
  { id: "car", label: "Автомобиль", rate: RATE_PER_ORDER, ordersMax: 30, hint: "Максимальный доход" },
] as const

type TransportId = (typeof transports)[number]["id"]

// Плавный счётчик чисел для красивой анимации результата
function useAnimatedNumber(value: number, duration = 600) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    startRef.current = null

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return display
}

const ruble = (n: number) => `${n.toLocaleString("ru-RU")} ₽`

export function CourierPromo() {
  const [transport, setTransport] = useState<TransportId>("bike")
  const [orders, setOrders] = useState(20)
  const [days, setDays] = useState(5)
  const [tip, setTip] = useState(true)

  const active = transports.find((t) => t.id === transport)!

  // Если заказов больше, чем тянет транспорт — мягко ограничиваем
  useEffect(() => {
    if (orders > active.ordersMax) setOrders(active.ordersMax)
  }, [active.ordersMax, orders])

  const perDay = useMemo(() => {
    const base = orders * active.rate
    const bonus = tip ? Math.round(base * 0.12) : 0 // чаевые и бонусы за рейтинг ~12%
    return base + bonus
  }, [orders, active.rate, tip])

  const perWeek = perDay * days
  const perMonth = Math.round(perWeek * 4.33)

  const animatedMonth = useAnimatedNumber(perMonth)
  const animatedDay = useAnimatedNumber(perDay)

  // Предзаполненное сообщение в мессенджер с расчётом дохода
  const messengerOptions: PromoMessengersOptions = useMemo(() => {
    const message = [
      role.messageIntro,
      `Транспорт: ${active.label}`,
      `Заказов в день: ${orders}`,
      `Дней в неделю: ${days}`,
      `Мой расчётный доход: ~${ruble(perMonth)} в месяц`,
    ].join("\n")

    return {
      message,
      metadata: {
        Транспорт: active.label,
        "Заказов в день": String(orders),
        "Дней в неделю": String(days),
        "Расчёт дохода": ruble(perMonth),
      },
      source: "promo-courier-calc",
      page: "courier",
    }
  }, [active.label, orders, days, perMonth])

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-zinc-950 text-white">
      {/* Фоновое свечение */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute -right-32 top-1/3 h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      {/* Шапка */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9">
            <Image src="/logo.webp" alt="КурьерХаб" fill className="object-contain" priority />
          </div>
          <span className="text-base font-extrabold tracking-tight">
            Курьер<span className="text-primary">Хаб</span>
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
      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-10 pt-6 sm:px-8 lg:grid-cols-[1.05fr_440px] lg:gap-12 lg:pt-10">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {role.badge}
          </span>

          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Работа курьером
            <span className="mt-2 block text-primary">на твоих условиях</span>
          </h1>

          <p className="max-w-md text-pretty text-base text-white/70 sm:text-lg">
            Двигай ползунки и смотри, сколько сможешь зарабатывать уже завтра. Выплаты каждый день, свободный график,
            старт за 1 день.
          </p>

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

          <div className="mt-1 grid max-w-lg grid-cols-3 gap-3">
            {role.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <div className="text-lg font-black leading-none text-primary sm:text-xl">{s.value}</div>
                <div className="mt-1.5 text-[11px] leading-tight text-white/55">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero-изображение */}
        <div className="relative hidden aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 lg:block">
          <Image
            src={role.image || "/placeholder.svg"}
            alt={role.imageAlt}
            fill
            priority
            sizes="440px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        </div>
      </section>

      {/* Калькулятор дохода */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px]">
            {/* Управление */}
            <div className="flex flex-col gap-7 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <IconCalculator className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black sm:text-2xl">Калькулятор дохода</h2>
                  <p className="text-sm text-white/55">Настрой под себя — расчёт в реальном времени</p>
                </div>
              </div>

              {/* Транспорт */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">На чём работаешь</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {transports.map((t) => {
                    const isActive = t.id === transport
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTransport(t.id)}
                        className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                          isActive
                            ? "border-primary bg-primary/15 shadow-[0_0_0_1px_var(--color-primary)]"
                            : "border-white/15 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <span className={`text-sm font-bold ${isActive ? "text-white" : "text-white/80"}`}>
                          {t.label}
                        </span>
                        <span className="text-[11px] text-white/50">{t.hint}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Заказов в день */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">Заказов в день</span>
                  <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-sm font-black text-primary">{orders}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={active.ordersMax}
                  value={orders}
                  onChange={(e) => setOrders(Number(e.target.value))}
                  className="promo-range"
                  aria-label="Заказов в день"
                />
                <div className="flex justify-between text-[11px] text-white/40">
                  <span>5</span>
                  <span>{active.ordersMax} макс.</span>
                </div>
              </div>

              {/* Дней в неделю */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">Дней в неделю</span>
                  <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-sm font-black text-primary">{days}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="promo-range"
                  aria-label="Дней в неделю"
                />
                <div className="flex justify-between text-[11px] text-white/40">
                  <span>1</span>
                  <span>7</span>
                </div>
              </div>

              {/* Чаевые/бонусы */}
              <button
                type="button"
                onClick={() => setTip((v) => !v)}
                className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all ${
                  tip ? "border-primary/50 bg-primary/10" : "border-white/15 bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-white/85">
                  <IconWallet className="h-5 w-5 text-primary" />
                  Учитывать чаевые и бонусы за рейтинг
                </span>
                <span
                  className={`relative h-6 w-11 rounded-full transition-colors ${tip ? "bg-primary" : "bg-white/20"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      tip ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>

            {/* Результат */}
            <div className="relative flex flex-col justify-between gap-6 border-t border-white/10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/55">Твой доход в месяц</span>
                <div className="mt-2 flex items-end gap-1.5">
                  <span className="text-5xl font-black leading-none text-white tabular-nums sm:text-6xl">
                    {animatedMonth.toLocaleString("ru-RU")}
                  </span>
                  <span className="pb-1.5 text-2xl font-black text-primary">₽</span>
                </div>
                <p className="mt-2 text-sm text-white/55">при {orders} заказах · {days} дн./нед.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/50">
                    <IconClock className="h-3.5 w-3.5" /> В день
                  </div>
                  <div className="mt-1 text-xl font-black text-white tabular-nums">{ruble(animatedDay)}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/50">
                    <IconWallet className="h-3.5 w-3.5" /> В неделю
                  </div>
                  <div className="mt-1 text-xl font-black text-white tabular-nums">{ruble(perWeek)}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-zinc-950/40 p-4 backdrop-blur">
                <p className="mb-3 text-center text-sm font-semibold text-white">
                  Напиши нам — расчёт уже в сообщении
                </p>
                <PromoMessengers options={messengerOptions} />
                <p className="mt-2.5 text-center text-[11px] text-white/45">
                  Оформим за 5 минут · первый заказ уже завтра
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-white/40">
          Расчёт ориентировочный и зависит от города, спроса и количества выполненных заказов.
        </p>
      </section>

      {/* Как начать */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-8">
        <h2 className="mb-6 text-balance text-2xl font-black sm:text-3xl">Как начать зарабатывать</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { n: "01", t: "Напиши в мессенджер", d: "Расчёт дохода и ответы уже в сообщении — просто отправь." },
            { n: "02", t: "Короткое оформление", d: "Регистрируем за 5 минут, без бумажной волокиты и собеседований." },
            { n: "03", t: "Бери заказы", d: "Первый заказ уже завтра. Выплаты приходят каждый день." },
          ].map((step) => (
            <div key={step.n} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <span className="text-3xl font-black text-primary/40">{step.n}</span>
              <h3 className="mt-2 text-lg font-bold">{step.t}</h3>
              <p className="mt-1.5 text-sm text-white/60">{step.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-primary/30 bg-primary/10 p-6 text-center sm:p-8">
          <h3 className="text-balance text-2xl font-black sm:text-3xl">Готов начать?</h3>
          <p className="max-w-md text-pretty text-sm text-white/70">
            Напиши нам в удобный мессенджер — твой расчёт дохода уже прикреплён к сообщению.
          </p>
          <div className="w-full max-w-sm">
            <PromoMessengers options={messengerOptions} />
          </div>
        </div>
      </section>

      {/* Другие вакансии */}
      <footer className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 border-t border-white/10 px-4 py-6 sm:flex-row sm:gap-4 sm:px-8">
        <span className="text-sm font-semibold text-white/60">Не подошла вакансия? Выбери другую:</span>
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
      </footer>
    </main>
  )
}
