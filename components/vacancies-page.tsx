"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Header } from "./header"
import { Footer } from "./footer"
import { VacancyQuiz } from "./vacancy-quiz"
import {
  categories,
  searchVacancies,
  getCategory,
  getCompanyInitials,
  getCompanyHue,
  type Vacancy,
  type CategoryKey,
} from "@/lib/vacancies-data"
import {
  IconSearch,
  IconMapPin,
  IconWallet,
  IconClock,
  IconCheck,
  IconStar,
  IconArrowUpRight,
} from "./icons"

const PAGE_SIZE = 12

export function VacanciesPage({ initialCategory }: { initialCategory?: CategoryKey }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState("")
  const [activeCat, setActiveCat] = useState<CategoryKey | "all">(initialCategory ?? "all")
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState<Vacancy | null>(null)

  const basePath = initialCategory ? `/vacancies/${initialCategory}` : "/vacancies"

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "")
    setActiveCat(initialCategory ?? "all")
    setLimit(PAGE_SIZE)
  }, [searchParams, initialCategory])

  const results = useMemo(() => {
    let list = searchVacancies(query)
    if (activeCat !== "all") list = list.filter((v) => v.categoryKey === activeCat)
    return list
  }, [query, activeCat])

  const visible = results.slice(0, limit)
  const hasMore = limit < results.length

  // Автоматическая подгрузка при прокрутке к концу списка (без кнопки «Показать ещё»)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadMore = useCallback(() => {
    setLimit((l) => Math.min(l + PAGE_SIZE, results.length))
  }, [results.length])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore, visible.length])

  const updateQuery = (q: string) => {
    setQuery(q)
    setLimit(PAGE_SIZE)
    const params = new URLSearchParams()
    if (q.trim()) params.set("q", q.trim())
    router.replace(`${basePath}${params.toString() ? `?${params}` : ""}`, { scroll: false })
  }

  const selectCategory = (key: CategoryKey | "all") => {
    setActiveCat(key)
    setLimit(PAGE_SIZE)
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    const path = key === "all" ? "/vacancies" : `/vacancies/${key}`
    router.push(`${path}${params.toString() ? `?${params}` : ""}`, { scroll: false })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary/30 pt-24 sm:pt-28">
        {/* Шапка поиска */}
        <section className="bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 max-w-5xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-balance">
              Вакансии у проверенных работодателей
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {results.length.toLocaleString("ru-RU")} {pluralVacancies(results.length)} · подбор бесплатно для соискателя
            </p>

            {/* Поле поиска — на всю ширину, крупное и удобное на мобильных */}
            <form onSubmit={(e) => e.preventDefault()} className="mt-5">
              <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 sm:px-5 h-14 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-colors">
                <IconSearch className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  placeholder="Профессия или компания"
                  aria-label="Поиск вакансий"
                  className="min-w-0 flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => updateQuery("")}
                    aria-label="Сбросить поиск"
                    className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Сбросить
                  </button>
                )}
              </div>
            </form>

            {/* Категории — горизонтальный скролл на мобильных, перенос на десктопе */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl">
          {visible.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <IconSearch className="w-6 h-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Ничего не нашлось</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Попробуйте изменить запрос или выберите другую категорию.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:gap-4">
                {visible.map((v, i) => (
                  <VacancyCard key={v.id} vacancy={v} index={i} onApply={() => setSelected(v)} />
                ))}
              </div>

              {/* Сентинел для автоподгрузки */}
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-8" aria-hidden="true">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    Загружаем ещё…
                  </div>
                </div>
              )}

              {!hasMore && (
                <p className="text-center text-sm text-muted-foreground py-8">Это все вакансии по вашему запросу</p>
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
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium border transition-all ${
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
  const cat = getCategory(vacancy.categoryKey)
  const CatIcon = cat?.icon
  const hue = getCompanyHue(vacancy.company)
  const href = `/vacancies/job/${vacancy.id}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index % PAGE_SIZE, 8) * 0.025 }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5 transition-all hover:border-primary/40 hover:shadow-md"
    >
      {/* Кликабельная вся карточка ведёт на детальную страницу */}
      <Link href={href} className="absolute inset-0 rounded-2xl" aria-label={`Подробнее: ${vacancy.title}`} />

      <div className="flex items-start gap-3">
        {/* Аватар компании — у каждой карточки свой оттенок и инициалы */}
        <div
          className="shrink-0 grid place-items-center w-12 h-12 rounded-xl font-bold text-base"
          style={{ backgroundColor: `hsl(${hue} 70% 94%)`, color: `hsl(${hue} 72% 38%)` }}
          aria-hidden="true"
        >
          {getCompanyInitials(vacancy.company)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-foreground leading-snug text-pretty group-hover:text-primary transition-colors">
            {vacancy.title}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
            <span className="font-medium text-foreground/80">{vacancy.company}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{vacancy.companyKind}</span>
          </div>
        </div>

        {CatIcon && (
          <div className="shrink-0 hidden sm:grid place-items-center w-9 h-9 rounded-lg bg-primary/10">
            <CatIcon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>

      {/* Зарплата */}
      <div className="inline-flex items-center gap-1.5 self-start rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
        <IconWallet className="w-4 h-4" />
        {vacancy.salary}
      </div>

      {/* Параметры */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <IconMapPin className="w-4 h-4 shrink-0" />
          {vacancy.city}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconClock className="w-4 h-4 shrink-0" />
          {vacancy.schedule}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconStar className="w-4 h-4 shrink-0" />
          {vacancy.experience}
        </span>
      </div>

      {/* Теги-отличия */}
      <div className="flex flex-wrap gap-2">
        {vacancy.hot && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
            Срочный набор
          </span>
        )}
        {vacancy.noExperience && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <IconCheck className="w-3.5 h-3.5" />
            Можно без опыта
          </span>
        )}
        {vacancy.foreign && (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
            Международная компания
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{vacancy.description}</p>

      <div className="mt-1 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{vacancy.postedLabel}</span>
        <div className="flex items-center gap-2">
          <Link
            href={href}
            className="relative z-10 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Подробнее
            <IconArrowUpRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={onApply}
            className="relative z-10 inline-flex items-center justify-center h-10 px-5 btn-primary text-primary-foreground font-semibold rounded-xl text-sm"
          >
            Откликнуться
          </button>
        </div>
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
