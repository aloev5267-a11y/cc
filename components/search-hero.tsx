"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconSearch, IconMapPin } from "./icons"
import { categories } from "@/lib/vacancies-data"

function pluralVacancies(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return "вакансия"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "вакансии"
  return "вакансий"
}

// Карточки "Популярное" формируются из единого каталога вакансий —
// количество и зарплаты совпадают с тем, что показано на /vacancies.
const popularCards = categories.map((c) => ({
  slug: c.key,
  title: c.title,
  salary: c.salaryHint,
  count: `${c.count} ${pluralVacancies(c.count)}`,
}))

export function SearchHero() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) {
      router.push("/vacancies")
      return
    }
    // Если запрос точно совпадает с категорией — ведём на человекочитаемый путь.
    const matched = categories.find(
      (c) => c.title.toLowerCase() === q.toLowerCase() || c.searchTerms.includes(q.toLowerCase()),
    )
    if (matched) {
      router.push(`/vacancies/${matched.key}`)
      return
    }
    router.push(`/vacancies?q=${encodeURIComponent(q)}`)
  }

  return (
    <section className="bg-background pt-4 md:pt-6 pb-10 md:pb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6 text-balance">
          Поиск работы в Москве
        </h1>

        {/* Поисковая строка */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-border bg-card px-4 sm:px-5 h-14 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-colors">
            <IconSearch className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Профессия или компания"
              aria-label="Поиск вакансий"
              className="min-w-0 flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 px-8 btn-primary font-semibold rounded-2xl shrink-0"
          >
            <IconSearch className="w-5 h-5 sm:hidden" />
            Найти
          </button>
        </form>

        {/* Доп. строка */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
          <Link href="/partners" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Я ищу сотрудника
          </Link>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <IconMapPin className="w-4 h-4" />
            Москва
          </span>
        </div>

        {/* Популярное */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-foreground mb-5">Популярное</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCards.map((card) => (
              <Link
                key={card.slug}
                href={`/vacancies/${card.slug}`}
                className="group flex flex-col bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <span className="font-bold text-foreground text-balance">{card.title}</span>
                <span className="mt-1 text-sm font-semibold text-foreground/80 tabular-nums">{card.salary}</span>
                <span className="mt-6 text-sm text-muted-foreground tabular-nums">{card.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
