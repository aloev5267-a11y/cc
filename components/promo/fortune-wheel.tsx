"use client"

import { useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMessengerLink } from "@/hooks/use-messenger"
import { useIsRussianIp } from "@/hooks/use-geo"
import { siteConfig } from "@/lib/config"
import {
  IconTelegram,
  IconShield,
  IconArrowUpRight,
  IconCheck,
  IconStar,
} from "@/components/icons"

// Призы колеса. Логика «всегда выигрыш»: каждый сектор — реальный бонус,
// проигрышей нет. weight задаёт, насколько часто выпадает приз (крупные
// денежные — чуть реже, но всё равно выпадают). Тексты можно менять свободно.
type Prize = {
  id: string
  label: string
  short: string
  weight: number
}

const PRIZES: Prize[] = [
  { id: "bonus5000", label: "Бонус 5 000 ₽ за выход на смену", short: "5 000 ₽", weight: 2 },
  { id: "daily", label: "Выплаты каждый день", short: "Каждый день", weight: 4 },
  { id: "advance", label: "Аванс уже в первый день", short: "Аванс", weight: 3 },
  { id: "priority", label: "Приоритетная смена — выбираешь сам", short: "Своя смена", weight: 4 },
  { id: "taxi", label: "Промокод на такси до работы", short: "Такси", weight: 3 },
  { id: "fast", label: "Трудоустройство за 1 день", short: "За 1 день", weight: 4 },
  { id: "firstday", label: "Бонус 3 000 ₽ в первый день", short: "3 000 ₽", weight: 3 },
  { id: "merch", label: "Фирменный мерч ElWork", short: "Мерч", weight: 2 },
]

const SEGMENTS = PRIZES.length
const SEG_ANGLE = 360 / SEGMENTS

// Геометрия: точка на окружности (angle от верхней точки, по часовой).
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function wedgePath(i: number) {
  const cx = 100
  const cy = 100
  const r = 96
  const a0 = i * SEG_ANGLE
  const a1 = (i + 1) * SEG_ANGLE
  const [x0, y0] = polar(cx, cy, r, a0)
  const [x1, y1] = polar(cx, cy, r, a1)
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`
}

// Взвешенный случайный выбор сектора (всегда валидный приз).
function pickPrizeIndex() {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight
    if (r <= 0) return i
  }
  return PRIZES.length - 1
}

export function FortuneWheel() {
  const isRussia = useIsRussianIp()
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<Prize | null>(null)
  const spunRef = useRef(false)

  // Сообщение для Telegram зависит от выпавшего приза — менеджер сразу видит бонус.
  const message = result
    ? `Здравствуйте! Кручу колесо ElWork — мне выпал бонус: «${result.label}». Хочу забрать его и выйти на работу.`
    : undefined

  const telegram = useMessengerLink("telegram", {
    source: "promo-wheel",
    message,
    metadata: result ? { Бонус: result.label, Источник: "Колесо фортуны" } : undefined,
  })

  const spin = () => {
    if (spinning || spunRef.current) return
    spunRef.current = true
    setSpinning(true)
    setResult(null)

    const index = pickPrizeIndex()
    // Центр выбранного сектора должен оказаться вверху (под стрелкой).
    const centerAngle = index * SEG_ANGLE + SEG_ANGLE / 2
    const extraSpins = 6
    const target = 360 * extraSpins + (360 - centerAngle)
    setRotation(target)

    // Результат показываем после завершения анимации (см. transition 4.2s).
    window.setTimeout(() => {
      setResult(PRIZES[index])
      setSpinning(false)
    }, 4300)
  }

  const segmentLabelTransform = (i: number) => {
    const mid = i * SEG_ANGLE + SEG_ANGLE / 2
    return `rotate(${mid} 100 100)`
  }

  return (
    <div className="flex w-full flex-col items-center">
      {/* Колесо */}
      <div className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[380px]">
        {/* Мягкое свечение под колесом */}
        <div className="pointer-events-none absolute inset-2 rounded-full bg-primary/20 blur-2xl" aria-hidden="true" />

        {/* Внешнее кольцо-обод */}
        <div className="pointer-events-none absolute -inset-2 rounded-full border-4 border-primary/15" aria-hidden="true" />

        {/* Стрелка-указатель сверху */}
        <div className="absolute left-1/2 -top-2 z-20 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[15px] border-r-[15px] border-t-[28px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
        </div>

        {/* Вращающийся круг */}
        <div
          className="absolute inset-0"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4.2s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            {PRIZES.map((p, i) => {
              const isEven = i % 2 === 0
              return (
                <g key={p.id}>
                  <path
                    d={wedgePath(i)}
                    fill={isEven ? "var(--color-primary)" : "#eaf1ff"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x="100"
                    y="22"
                    textAnchor="middle"
                    transform={segmentLabelTransform(i)}
                    className="font-bold"
                    style={{
                      fontSize: "8.5px",
                      fill: isEven ? "#ffffff" : "var(--color-primary)",
                    }}
                  >
                    {p.short}
                  </text>
                </g>
              )
            })}
            {/* Центральная втулка */}
            <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="3" />
          </svg>
        </div>

        {/* Кнопка по центру */}
        <button
          type="button"
          onClick={spin}
          disabled={spinning || spunRef.current}
          aria-label="Крутить колесо"
          className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 sm:h-20 sm:w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground font-extrabold text-sm shadow-lg transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {spinning ? "..." : spunRef.current ? <IconStar className="w-7 h-7" /> : "КРУТИ"}
        </button>
      </div>

      {/* Подсказка / результат */}
      <div className="mt-6 w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="rounded-3xl border border-primary/20 bg-card p-6 shadow-lg"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <IconCheck className="w-4 h-4" />
                Ваш бонус при трудоустройстве
              </span>
              <p className="mt-3 text-2xl font-extrabold text-foreground text-balance">{result.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Напишите нам в Telegram — менеджер закрепит бонус за вашей анкетой и подберёт работу рядом с домом.
              </p>

              <a
                href={telegram.link || siteConfig.social.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => telegram.trackClick()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 h-14 text-base font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-[0.99]"
              >
                <IconTelegram className="w-6 h-6" />
                Забрать бонус в Telegram
              </a>
              <p className="mt-3 text-xs text-muted-foreground">Обычно отвечаем за пару минут</p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-base text-muted-foreground"
            >
              Нажмите на колесо и узнайте, какой <span className="font-bold text-foreground">бонус</span> мы закрепим за вами при выходе на работу.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Блок VPN — показываем только для РФ-аудитории */}
      {isRussia && (
        <div className="mt-6 w-full max-w-md rounded-3xl border border-border bg-secondary/60 p-5 text-left">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconShield className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">Нет VPN? Telegram не открывается?</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Из-за блокировок мессенджер может не открыться напрямую. Скачай любой бесплатный VPN, включи его — и забирай бонус.
              </p>
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://apps.apple.com/ru/search?term=vpn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 h-11 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
                >
                  VPN в App Store
                  <IconArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="https://play.google.com/store/search?q=vpn&c=apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 h-11 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
                >
                  VPN в Play Market
                  <IconArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
