"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { getCategory, buildVacancyMessage, type Vacancy } from "@/lib/vacancies-data"
import { useRegion } from "@/hooks/use-geo"
import { siteConfig } from "@/lib/config"
import { PromoMessengers, type PromoMessengersOptions } from "./promo/promo-messengers"
import { VpnNotice } from "./promo/vpn-notice"
import {
  IconClose,
  IconArrow,
  IconUser,
  IconMapPin,
  IconCheck,
  IconWallet,
  IconClock,
} from "./icons"

const spring = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }

export function VacancyQuiz({ vacancy, onClose }: { vacancy: Vacancy; onClose: () => void }) {
  const cat = getCategory(vacancy.categoryKey)
  const questions = cat?.quiz ?? []
  const { city: detectedCity, ready } = useRegion("Москва")

  // step 0 — имя, 1..N — вопросы, N+1 — мессенджеры
  const totalSteps = questions.length + 2
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const firstName = name.trim().split(/\s+/)[0] || ""
  const isNameStep = step === 0
  const isMessengerStep = step === questions.length + 1
  const currentQuestion = !isNameStep && !isMessengerStep ? questions[step - 1] : null

  // Город по умолчанию из гео-определения
  const cityValue = answers.city ?? (ready && currentQuestion?.id === "city" ? detectedCity : "")

  const setAnswer = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }))

  const canAdvanceQuestion = currentQuestion
    ? Boolean((currentQuestion.id === "city" ? cityValue : answers[currentQuestion.id])?.trim())
    : true

  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps - 1))
  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  // Сохраняем определённый город в ответы при переходе с шага города
  const handleQuestionNext = () => {
    if (currentQuestion?.id === "city" && !answers.city && cityValue) {
      setAnswer("city", cityValue)
    }
    goNext()
  }

  const messengerOptions: PromoMessengersOptions = useMemo(() => {
    const fullAnswers = { ...answers, name: name.trim() }
    return {
      message: buildVacancyMessage(vacancy, fullAnswers),
      metadata: {
        Имя: name.trim() || "—",
        Вакансия: vacancy.title,
        Компания: vacancy.company,
        Город: (answers.city || cityValue || "—").trim(),
        Зарплата: vacancy.salary,
      },
      source: "vacancy-quiz",
      page: vacancy.categoryKey,
    }
  }, [answers, name, vacancy, cityValue])

  const progress = ((step + 1) / totalSteps) * 100

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Затемнение */}
        <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Анкета для вакансии ${vacancy.title}`}
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={spring}
          className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl max-h-[92vh] overflow-y-auto"
        >
          {/* Шапка вакансии */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-5 sm:px-6 pt-5 pb-4 rounded-t-3xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-foreground text-balance leading-tight">{vacancy.title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground truncate">
                  {vacancy.company} · {vacancy.city}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <IconWallet className="w-3.5 h-3.5" />
                {vacancy.salary}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                <IconClock className="w-3.5 h-3.5" />
                {vacancy.schedule}
              </span>
            </div>
            {/* Прогресс */}
            <div className="mt-4 h-1 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={spring}
              />
            </div>
          </div>

          <div className="px-5 sm:px-6 py-6">
            <AnimatePresence mode="wait">
              {/* Шаг имени */}
              {isNameStep && (
                <motion.div key="name" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={spring}>
                  <h3 className="text-xl font-bold text-foreground">Как к вам обращаться?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Заполните короткую анкету — и мы передадим её напрямую работодателю «{vacancy.company}».
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (name.trim().length >= 2) goNext()
                    }}
                    className="mt-5"
                  >
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 h-12 focus-within:ring-2 focus-within:ring-primary/30">
                      <IconUser className="w-5 h-5 text-muted-foreground shrink-0" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ваше имя"
                        aria-label="Ваше имя"
                        autoFocus
                        className="flex-1 min-w-0 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={name.trim().length < 2}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 btn-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50"
                    >
                      Продолжить
                      <IconArrow className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Шаги вопросов */}
              {currentQuestion && (
                <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={spring}>
                  <h3 className="text-xl font-bold text-foreground text-balance">{currentQuestion.question}</h3>

                  {currentQuestion.type === "input" ? (
                    <div className="mt-5">
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2">
                        <IconMapPin className="w-4 h-4 text-primary" />
                        {currentQuestion.summaryLabel}
                      </label>
                      <input
                        list={`sugg-${currentQuestion.id}`}
                        value={cityValue}
                        onChange={(e) => setAnswer("city", e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        autoFocus
                        className="w-full rounded-xl border border-border bg-background px-4 h-12 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      {currentQuestion.suggestions && (
                        <datalist id={`sugg-${currentQuestion.id}`}>
                          {currentQuestion.suggestions.map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      )}
                    </div>
                  ) : (
                    <div className="mt-5 flex flex-col gap-2.5">
                      {currentQuestion.options?.map((opt) => {
                        const active = answers[currentQuestion.id] === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setAnswer(currentQuestion.id, opt.value)
                            }}
                            className={`w-full text-left rounded-xl border px-4 py-3.5 font-medium transition-all flex items-center justify-between gap-3 ${
                              active
                                ? "border-primary bg-primary/5 text-foreground"
                                : "border-border bg-background text-foreground hover:border-primary/40"
                            }`}
                          >
                            {opt.label}
                            <span
                              className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                                active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                              }`}
                            >
                              {active && <IconCheck className="w-3 h-3" />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center justify-center h-12 px-5 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/70 transition-colors"
                    >
                      Назад
                    </button>
                    <button
                      type="button"
                      disabled={!canAdvanceQuestion}
                      onClick={handleQuestionNext}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-12 btn-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50"
                    >
                      Далее
                      <IconArrow className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Финальный шаг — мессенджеры */}
              {isMessengerStep && (
                <motion.div key="messengers" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={spring}>
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-green-600">
                    <IconCheck className="w-4 h-4" />
                    Анкета готова
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-foreground text-balance">
                    Класс{firstName ? `, ${firstName}` : ""}! Напишите работодателю напрямую
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Анкета уже в сообщении — выберите удобный мессенджер, и владелец «{vacancy.company}» подберёт вам смену и условия.
                  </p>

                  {/* Сводка */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[name.trim(), (answers.city || cityValue).trim(), ...getCategory(vacancy.categoryKey)!.quiz
                      .filter((q) => q.id !== "city" && answers[q.id])
                      .map((q) => answers[q.id])]
                      .filter(Boolean)
                      .map((chip, idx) => (
                        <span key={`${chip}-${idx}`} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                          {chip}
                        </span>
                      ))}
                  </div>

                  <div className="mt-5">
                    <VpnNotice />
                    <PromoMessengers options={messengerOptions} />
                  </div>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Подбор бесплатный для соискателя. Нажимая, вы принимаете{" "}
                    <a href={siteConfig.legal.privacy} className="underline underline-offset-2">политику конфиденциальности</a>.
                  </p>

                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-3 w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Изменить анкету
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
