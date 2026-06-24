"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Header } from "./header"
import { Footer } from "./footer"
import { VacancyQuiz } from "./vacancy-quiz"
import { categories, searchVacancies, type Vacancy, type CategoryKey } from "@/lib/vacancies-data"
import {
  IconSearch,
  IconMapPin,
  IconWallet,
  IconClock,
  IconBriefcase,
  IconArrowUpRight,
  IconCheck,
} from "./icons"

const PAGE_SIZE = 12

export function VacanciesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState("")
  const [activeCat, setActiveCat] = useState<CategoryKey | "all">("all")
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState<Vacancy | null>(null)

  // Инициализация из URL (?q=...)
  useEffect(() => {
    const q = searchParams.get("q") ?? ""
    setQuery(q)
    // Если запрос совпадает с названием категории — активируем её фильтр
    const matched = categories.find((c) => c.title.toLowerCase() === q.trim().toLowerCase())
    setActiveCat(matched ? matched.key : "all")
  }, [searchParams])

  // Фильтрация: сначала поиск по строке, затем по категории
  const results = useMemo(() => {
    let list = searchVacancies(query)
    if (activeCat !== "all") list = list.filter((v) => v.categoryKey === activeCat)
    return list
  }, [query, activeCat])

  const visible = results.slice(0, limit)

  const updateQuery = (q: string) => {
    setQuery(q)
    setLimit(PAGE_SIZE)
    const params = new URLSearchParams()
    if (q.trim()) params.set("q", q.trim())
    router.replace(`/vacancies${params.toString() ? `?${params}` : ""}`, { scroll: false })
  }

  const selectCategory = (key: CategoryKey | "all") => {
    setActiveCat(key)
    setLimit(PAGE_SIZE)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Поиск */}
        <section className="bg-secondary/40 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-balance">
              Вакансии у проверенных работодателей
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {results.length.toLocaleString("ru-RU")}{" "}
              {pluralVacancies(results.length)} · подбор бесплатно для соискателя
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 flex items-center gap-3 bg-card border border-border rounded-2xl px-4 sm:px-5 h-14 focus-within:border-primary transition-colors">
                <IconSearch className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  placeholder="Профессия, должность или компания"
                  aria-label="Поиск вакансий"
                  className="flex-1 min-w-0 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => updateQuery("")}
                    className="text-sm text-muted-foreground hover:text-foreground shrink-0"
                  >
                    Сбросить
                  </button>
                )}
              </div>
            </form>

            {/* Фильтры категорий */}
            <div className="mt-4 flex flex-wrap gap-2">
              <CategoryChip label="Все" active={activeCat === "all"} onClick={() => selectCategory("all")} />
              {categories.map((c) => (
                <CategoryChip
                  key={c.key}
                  label={c.title}
                  active={activeCat === c.key}
                  onClick={() => selectCategory(c.key)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Результаты */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {visible.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <IconSearch className="w-6 h-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Ничего не нашлось</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Попробуйте изменить запрос или выберите категорию выше.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {visible.map((v, i) => (
                  <VacancyCard key={v.id} vacancy={v} index={i} onApply={() => setSelected(v)} />
                ))}
              </div>

              {limit < results.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setLimit((l) => l + PAGE_SIZE)}
                    className="inline-flex items-center justify-center h-12 px-8 rounded-2xl border border-border bg-card font-semibold text-foreground hover:border-primary/40 transition-colors"
                  >
                    Показать ещё {Math.min(PAGE_SIZE, results.length - limit)}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />

      {selected && <VacancyQuiz vacancy={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40"
      }`}
    >
      {label}
    </button>
  )
}

function VacancyCard({ vacancy, index, onApply }: { vacancy: Vacancy; index: number; onApply: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: (index % PAGE_SIZE) * 0.03 }}
      className="group flex flex-col bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-foreground text-balance leading-snug">{vacancy.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">{vacancy.company}</span>
            {vacancy.foreign && (
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
                Межд.
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{vacancy.companyKind}</p>
        </div>
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <IconBriefcase className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
        <IconWallet className="w-4 h-4" />
        {vacancy.salary}
      </div>

      <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <IconMapPin className="w-4 h-4 shrink-0" />
          {vacancy.city}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconClock className="w-4 h-4 shrink-0" />
          {vacancy.schedule} · {vacancy.employment}
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-1">
        {vacancy.perks.slice(0, 2).map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            {perk}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{vacancy.postedLabel}</span>
        <button
          type="button"
          onClick={onApply}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-5 btn-primary text-primary-foreground font-semibold rounded-xl text-sm"
        >
          Откликнуться
          <IconArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  )
}

function pluralVacancies(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return "вакансия"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "вакансии"
  return "вакансий"
}
