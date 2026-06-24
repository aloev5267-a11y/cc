import Link from "next/link"
import type { ReactNode } from "react"
import { siteConfig } from "@/lib/config"
import { IconArrow, IconFileText, IconMail, IconMapPin, IconShield, IconHandshake } from "@/components/icons"

export type LegalSection = {
  id: string
  title: string
  body: ReactNode
}

type LegalDocument = "terms" | "privacy" | "offer"

const DOC_ICON: Record<LegalDocument, (props: { className?: string }) => ReactNode> = {
  terms: IconFileText,
  privacy: IconShield,
  offer: IconHandshake,
}

const DOC_KICKER: Record<LegalDocument, string> = {
  terms: "Правовая информация",
  privacy: "Защита данных",
  offer: "Правовая информация",
}

export function LegalPage({
  doc,
  title,
  description,
  updatedAt,
  sections,
}: {
  doc: LegalDocument
  title: string
  description: string
  updatedAt: string
  sections: LegalSection[]
}) {
  const Icon = DOC_ICON[doc]

  return (
    <main className="min-h-screen bg-muted/40">
      {/* Шапка документа */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <nav aria-label="Хлебные крошки" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span aria-hidden className="text-border">
              /
            </span>
            <span className="text-foreground">Правовые документы</span>
          </nav>

          <div className="flex items-start gap-4 sm:gap-5">
            <span className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow text-primary mb-2">{DOC_KICKER[doc]}</p>
              <h1 className="font-display text-pretty text-2xl sm:text-3xl lg:text-4xl text-foreground">{title}</h1>
              <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">{description}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                Редакция от {updatedAt}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* Оглавление */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="eyebrow mb-4 text-muted-foreground">Содержание</p>
              <nav aria-label="Содержание документа" className="flex flex-col gap-1">
                {sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group flex items-start gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <span className="mt-0.5 font-mono text-xs text-primary/70 group-hover:text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-snug">{s.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Содержимое */}
          <article className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-24 border-b border-border px-5 py-6 sm:px-8 sm:py-8 last:border-b-0"
                >
                  <h2 className="mb-3 flex items-baseline gap-3 text-lg font-semibold text-foreground sm:text-xl">
                    <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-balance">{s.title}</span>
                  </h2>
                  <div className="leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>

            {/* Карточка реквизитов */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-8">
              <h2 className="mb-5 text-lg font-semibold text-foreground sm:text-xl">Реквизиты</h2>
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <Detail label="Наименование" value={siteConfig.company.name} />
                <Detail label="ОГРН" value={siteConfig.company.ogrn} mono />
                <Detail label="ИНН" value={siteConfig.company.inn} mono />
                <Detail label="КПП" value={siteConfig.company.kpp} mono />
                <div className="sm:col-span-2">
                  <Detail
                    label="Юридический адрес"
                    value={
                      <span className="inline-flex items-start gap-2">
                        <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        {siteConfig.company.address}
                      </span>
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Detail
                    label="Электронная почта"
                    value={
                      <a href={siteConfig.contact.emailHref} className="inline-flex items-center gap-2 text-primary">
                        <IconMail className="h-4 w-4 shrink-0" />
                        {siteConfig.contact.email}
                      </a>
                    }
                  />
                </div>
              </dl>
            </div>

            {/* Навигация к другим документам */}
            <nav aria-label="Другие документы" className="mt-6 grid gap-3 sm:grid-cols-3">
              <DocLink href={siteConfig.legal.terms} label="Пользовательское соглашение" active={doc === "terms"} />
              <DocLink href={siteConfig.legal.privacy} label="Политика конфиденциальности" active={doc === "privacy"} />
              <DocLink href={siteConfig.legal.offer} label="Публичная оферта" active={doc === "offer"} />
            </nav>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <IconArrow className="h-4 w-4 rotate-180" />
              Вернуться на главную
            </Link>
          </article>
        </div>
      </div>
    </main>
  )
}

function Detail({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-sm text-foreground ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  )
}

function DocLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  if (active) {
    return (
      <span
        aria-current="page"
        className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
      >
        {label}
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      </span>
    )
  }
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
    >
      {label}
      <IconArrow className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  )
}
