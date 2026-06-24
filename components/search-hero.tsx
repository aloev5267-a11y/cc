"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconSearch, IconMapPin } from "./icons"

const popularCards = [
  { title: "Курьер", salary: "до 315 000 ₽", count: "4 810 вакансий" },
  { title: "Водитель", salary: "25 000 – 370 000 ₽", count: "6 554 вакансии" },
  { title: "Продавец", salary: "20 000 – 250 000 ₽", count: "14 057 вакансий" },
  { title: "Кассир", salary: "20 000 – 155 000 ₽", count: "9 774 вакансии" },
  { title: "Менеджер", salary: "до 500 000 ₽", count: "38 137 вакансий" },
  { title: "Оператор", salary: "20 000 – 335 000 ₽", count: "7 633 вакансии" },
  { title: "Складской персонал", salary: "от 40 000 ₽", count: "11 306 вакансий" },
  { title: "Удалённая работа", salary: "до 500 000 ₽", count: "43 237 вакансий" },
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
    <section className="bg-background pt-4 md:pt-6 pb-10 md:pb-14">
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

        {/* Популярное */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-foreground mb-5">Популярное</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCards.map((card) => (
              <Link
                key={card.title}
                href={`/vacancies?q=${encodeURIComponent(card.title)}`}
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
