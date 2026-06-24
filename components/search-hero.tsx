"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconSearch, IconMapPin } from "./icons"

const popularQueries = [
  "Курьер",
  "Водитель",
  "Продавец",
  "Кассир",
  "Менеджер",
  "Оператор",
  "Склад",
  "Удалённо",
]

export function SearchHero() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""
    router.push(`/vacancies${params}`)
  }

  return (
    <section className="bg-background pt-24 md:pt-28 pb-10 md:pb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6 text-balance">
          Поиск работы в Москве
        </h1>

        {/* Поисковая строка */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 bg-card border border-border rounded-2xl px-4 sm:px-5 h-14 focus-within:border-primary transition-colors">
            <IconSearch className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Профессия, должность или компания"
              aria-label="Поиск вакансий"
              className="flex-1 min-w-0 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 btn-primary font-semibold rounded-2xl shrink-0"
          >
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

        {/* Популярные запросы */}
        <div className="mt-7">
          <p className="text-sm font-semibold text-muted-foreground mb-3">Популярное</p>
          <div className="flex flex-wrap gap-2">
            {popularQueries.map((q) => (
              <Link
                key={q}
                href={`/vacancies?q=${encodeURIComponent(q)}`}
                className="px-4 py-2 rounded-full bg-secondary text-sm font-medium text-foreground/80 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
