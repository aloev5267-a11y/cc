"use client"

import Link from "next/link"
import { siteConfig } from "@/lib/config"
import {
  IconTelegram,
  IconWhatsapp,
  IconMax,
  IconMail,
  IconMapPin,
} from "./icons"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"
import { LogoMark } from "./logo"

const footerColumns = [
  {
    title: siteConfig.name,
    links: [
      { label: "О компании", href: "/about" },
      { label: "Вакансии", href: "/vacancies" },
      { label: "Работодателям", href: "/partners" },
      { label: "Найти работу", href: "/#find" },
      { label: "Поддержка", href: "/support" },
    ],
  },
  {
    title: "Соискателям",
    links: [
      { label: "Найти работу", href: "/#find" },
      { label: "Открытые вакансии", href: "/vacancies" },
      { label: "Частые вопросы", href: "/support" },
      { label: "Подобрать вакансию", href: "/#find" },
    ],
  },
  {
    title: "Документы",
    links: [
      { label: "Пользовательское соглашение", href: "/legal/terms" },
      { label: "Политика конфиденциальности", href: "/legal/privacy" },
      { label: "Согласие на обработку данных", href: "/legal/offer" },
    ],
  },
]

function NotificationBots() {
  const telegram = useMessengerLink("telegram")
  const whatsapp = useMessengerLink("whatsapp")
  const max = useMessengerLink("max")

  const bots = [
    { type: "telegram" as const, icon: IconTelegram, href: telegram.link || siteConfig.social.telegramUrl, label: "Telegram", messenger: telegram },
    { type: "whatsapp" as const, icon: IconWhatsapp, href: whatsapp.link || siteConfig.social.whatsappUrl, label: "WhatsApp", messenger: whatsapp },
    { type: "max" as const, icon: IconMax, href: max.link || siteConfig.social.maxUrl, label: "Max", messenger: max },
  ]

  return (
    <div className="flex items-center gap-3">
      {bots.map((b) => {
        if (!b.messenger.loading && !b.messenger.available) {
          return (
            <button
              key={b.label}
              type="button"
              onClick={() => notifyMessengerUnavailable(b.type)}
              className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground/40 cursor-not-allowed"
              aria-label={`${b.label} (недоступен)`}
              aria-disabled="true"
              title={`${b.label} временно недоступен`}
            >
              <b.icon className="w-5 h-5" />
            </button>
          )
        }
        return (
          <a
            key={b.label}
            href={b.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label={b.label}
            title={b.label}
            onClick={() => b.messenger.trackClick()}
          >
            <b.icon className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-foreground mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Боты для уведомлений + контакты */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-bold text-foreground mb-5">Боты для уведомлений</h4>
            <NotificationBots />

            <div className="mt-7 space-y-2.5">
              <a
                href={siteConfig.contact.emailHref}
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <IconMail className="w-4 h-4 shrink-0" />
                {siteConfig.contact.email}
              </a>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <IconMapPin className="w-4 h-4 shrink-0" />
                {siteConfig.company.address}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <LogoMark size={28} />
              <span className="text-xs text-muted-foreground">
                © {siteConfig.stats.yearFounded} {siteConfig.company.name}. Все права защищены.
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              {siteConfig.company.ogrn && <span className="font-mono">ОГРН {siteConfig.company.ogrn}</span>}
              {siteConfig.company.ogrn && siteConfig.company.inn && <span className="w-1 h-1 bg-border rounded-full" />}
              {siteConfig.company.inn && <span className="font-mono">ИНН {siteConfig.company.inn}</span>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
