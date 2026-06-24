"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "./header"
import { Footer } from "./footer"
import { VacancyQuiz } from "./vacancy-quiz"
import {
  getCategory,
  getRelatedVacancies,
  getCompanyInitials,
  getCompanyHue,
  type Vacancy,
} from "@/lib/vacancies-data"
import {
  IconMapPin,
  IconWallet,
  IconClock,
  IconStar,
  IconCheck,
  IconShield,
  IconBriefcase,
  IconArrow,
  IconArrowUpRight,
} from "./icons"

export function VacancyDetail({ vacancy }: { vacancy: Vacancy }) {
  const [applyOpen, setApplyOpen] = useState(false)
  const cat = getCategory(vacancy.categoryKey)
  const CatIcon = cat?.icon ?? IconBriefcase
  const hue = getCompanyHue(vacancy.company)
  const related = getRelatedVacancies(vacancy, 4)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary/30 pt-24 sm:pt-28 pb-28 lg:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Хлебные крошки */}
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground" aria-label="Навигация">
            <Link href="/" className="hover:text-foreground">
              Главная
            </Link>
            <span>/</span>
            <Link href="/vacancies" className="hover:text-foreground">
              Вакансии
            </Link>
            <span>/</span>
            <Link href={`/vacancies/${vacancy.categoryKey}`} className="hover:text-foreground">
              {vacancy.categoryTitle}
            </Link>
          </nav>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* Основная колонка */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Заголовок */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 grid place-items-center w-14 h-14 rounded-2xl font-bold text-lg"
                    style={{ backgroundColor: `hsl(${hue} 70% 94%)`, color: `hsl(${hue} 72% 38%)` }}
                    aria-hidden="true"
                  >
                    {getCompanyInitials(vacancy.company)}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground text-balance">
                      {vacancy.title}
                    </h1>
                    <p className="mt-1 text-sm text-foreground/80">
                      <span className="font-medium">{vacancy.company}</span>
                      <span className="text-muted-foreground"> · {vacancy.companyKind}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-2 text-base font-bold text-primary">
                  <IconWallet className="w-5 h-5" />
                  {vacancy.salary}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {vacancy.hot && (
                    <Tag solid>Срочный набор</Tag>
                  )}
                  {vacancy.noExperience && <Tag>Можно без опыта</Tag>}
                  {vacancy.foreign && <Tag muted>Международная компания</Tag>}
                  <Tag muted>{vacancy.categoryTitle}</Tag>
                </div>
              </div>

              {/* Ключевые параметры */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="text-base font-bold text-foreground">Коротко о вакансии</h2>
                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <Fact icon={<IconMapPin className="w-5 h-5" />} label="Город" value={vacancy.city} />
                  <Fact icon={<IconClock className="w-5 h-5" />} label="График" value={vacancy.schedule} />
                  <Fact icon={<CatIcon className="w-5 h-5" />} label="Занятость" value={vacancy.employment} />
                  <Fact icon={<IconStar className="w-5 h-5" />} label="Опыт" value={vacancy.experience} />
                </dl>
              </div>

              {/* Описание */}
              <Section title="Описание">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{vacancy.description}</p>
              </Section>

              {/* Обязанности */}
              <Section title="Обязанности">
                <ul className="flex flex-col gap-2.5">
                  {vacancy.responsibilities.map((item) => (
                    <ListItem key={item}>{item}</ListItem>
                  ))}
                </ul>
              </Section>

              {/* Требования */}
              <Section title="Требования">
                <ul className="flex flex-col gap-2.5">
                  {vacancy.requirements.map((item) => (
                    <ListItem key={item}>{item}</ListItem>
                  ))}
                </ul>
              </Section>

              {/* Условия */}
              <Section title="Мы предлагаем">
                <ul className="flex flex-col gap-2.5">
                  {vacancy.perks.map((item) => (
                    <ListItem key={item}>{item}</ListItem>
                  ))}
                </ul>
              </Section>
            </div>

            {/* Боковая панель отклика */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 flex flex-col gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-lg font-extrabold text-primary">{vacancy.salary}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{vacancy.postedLabel} · {vacancy.city}</p>

                  <button
                    type="button"
                    onClick={() => setApplyOpen(true)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 h-12 btn-primary text-primary-foreground font-semibold rounded-xl"
                  >
                    Откликнуться
                    <IconArrowUpRight className="w-4 h-4" />
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <IconShield className="w-3.5 h-3.5 text-primary" />
                    Подбор бесплатный для соискателя
                  </p>
                </div>

                <Link
                  href="/vacancies"
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <IconArrow className="w-4 h-4 rotate-180" />
                  Ко всем вакансиям
                </Link>
              </div>
            </aside>
          </div>

          {/* Похожие вакансии */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Похожие вакансии</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {related.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vacancies/job/${v.id}`}
                    className="group rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <h3 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {v.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{v.company} · {v.city}</p>
                    <p className="mt-2 text-sm font-bold text-primary">{v.salary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Мобильная закреплённая панель отклика */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-primary">{vacancy.salary}</p>
            <p className="truncate text-xs text-muted-foreground">{vacancy.city}</p>
          </div>
          <button
            type="button"
            onClick={() => setApplyOpen(true)}
            className="shrink-0 inline-flex items-center justify-center h-11 px-6 btn-primary text-primary-foreground font-semibold rounded-xl"
          >
            Откликнуться
          </button>
        </div>
      </div>

      <Footer />

      {applyOpen && <VacancyQuiz vacancy={vacancy} onClose={() => setApplyOpen(false)} />}
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-primary/10 text-primary">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm sm:text-base text-muted-foreground">
      <IconCheck className="w-5 h-5 shrink-0 text-primary mt-0.5" />
      <span className="leading-relaxed">{children}</span>
    </li>
  )
}

function Tag({
  children,
  solid,
  muted,
}: {
  children: React.ReactNode
  solid?: boolean
  muted?: boolean
}) {
  const cls = solid
    ? "bg-primary text-primary-foreground"
    : muted
      ? "bg-secondary text-secondary-foreground"
      : "bg-primary/10 text-primary"
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>
}
