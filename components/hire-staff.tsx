"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { IconCheck } from "./icons"
import { PromoMessengers } from "./promo/promo-messengers"

// Единая секция для работодателей: "Нужны люди? Давайте договоримся".
// Построена на том же рабочем мессенджер-потоке, что и блок для соискателей (FindWork):
// человек выбирает, кто нужен и сколько, ответы уходят в предзаполненное сообщение
// и в metadata лида (audience: "Работодатель"). Никаких форм-заглушек.

const points = [
  "Расскажите, кто и в каком количестве нужен",
  "Получите подходящих кандидатов из нашей базы",
  "Платите только за результат — за вышедших сотрудников",
]

const roles = [
  { id: "courier", label: "Курьеры" },
  { id: "driver", label: "Водители" },
  { id: "warehouse", label: "Склад, комплектовка" },
  { id: "retail", label: "Продавцы, кассиры" },
  { id: "production", label: "Производство, рабочие" },
  { id: "other", label: "Другое" },
]

const volumes = [
  { id: "1-5", label: "1–5 человек" },
  { id: "5-20", label: "5–20 человек" },
  { id: "20-50", label: "20–50 человек" },
  { id: "50+", label: "50+ человек" },
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3.5 py-2 rounded-full text-sm font-semibold border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  )
}

export function HireStaff({ source = "employer" }: { source?: string }) {
  const [role, setRole] = useState<string>("")
  const [volume, setVolume] = useState<string>("")

  const roleLabel = roles.find((r) => r.id === role)?.label ?? ""
  const volumeLabel = volumes.find((v) => v.id === volume)?.label ?? ""

  // Предзаполненное сообщение и metadata лида формируются из выбора работодателя.
  const { message, metadata } = useMemo(() => {
    const lines = ["Здравствуйте! Мы ищем сотрудников и хотим обсудить подбор."]
    if (roleLabel) lines.push(`Кто нужен: ${roleLabel}.`)
    if (volumeLabel) lines.push(`Сколько: ${volumeLabel}.`)
    lines.push("Подскажите, пожалуйста, условия сотрудничества.")
    const meta: Record<string, string> = { Сторона: "Работодатель" }
    if (roleLabel) meta["Кого ищут"] = roleLabel
    if (volumeLabel) meta["Объём"] = volumeLabel
    return { message: lines.join(" "), metadata: meta }
  }, [roleLabel, volumeLabel])

  return (
    <section id="hire" className="relative py-16 md:py-24 lg:py-28 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto card-elevated rounded-3xl p-6 sm:p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left — content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm font-semibold text-primary">Подбираем сотрудников сейчас</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground text-balance">
                Нужны люди? Давайте договоримся
              </h2>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed text-pretty">
                Напишите нам в удобный мессенджер — менеджер уточнит детали и подберёт
                персонал под ваши задачи. Берём на себя поиск, отбор и сопровождение
                кандидатов до выхода на работу.
              </p>

              <ul className="space-y-3">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <IconCheck className="w-4 h-4 text-primary" />
                    </span>
                    <span className="text-sm sm:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right — selector + messenger CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-muted/50 border border-border rounded-2xl p-6"
            >
              <div className="mb-5">
                <p className="text-sm font-semibold text-foreground mb-3">Кто вам нужен?</p>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <Chip key={r.id} active={role === r.id} onClick={() => setRole(r.id)}>
                      {r.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3">Сколько сотрудников?</p>
                <div className="flex flex-wrap gap-2">
                  {volumes.map((v) => (
                    <Chip key={v.id} active={volume === v.id} onClick={() => setVolume(v.id)}>
                      {v.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <p className="text-sm font-semibold text-foreground mb-3 text-center">
                Написать менеджеру по подбору
              </p>
              <PromoMessengers options={{ source, message, metadata }} />
              <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
                Нажимая на кнопку, вы соглашаетесь на обработку персональных данных
                в соответствии с политикой конфиденциальности.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
