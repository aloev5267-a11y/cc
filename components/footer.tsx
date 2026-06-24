"use client"

import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/lib/config"
import {
  IconPhone,
  IconMapPin,
  IconTelegram,
  IconWhatsapp,
  IconMail,
  IconMax,
  IconArrowUpRight,
  IconArrow,
} from "./icons"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"

const footerLinks = {
  seekers: [
    { label: "Найти работу", href: "/#find" },
    { label: "Вакансии", href: "/vacancies" },
    { label: "Как это работает", href: "/#how" },
    { label: "Частые вопросы", href: "/support" },
  ],
  company: [
    { label: "О компании", href: "/about" },
    { label: "Работодателям", href: "/partners" },
    { label: "Поддержка", href: "/support" },
  ],
  legal: [
    { label: "Пользовательское соглашение", href: "/legal/terms" },
    { label: "Политика конфиденциальности", href: "/legal/privacy" },
    { label: "Согласие на обработку данных", href: "/legal/offer" },
  ],
}

function FooterSocials() {
  const telegram = useMessengerLink("telegram")
  const whatsapp = useMessengerLink("whatsapp")
  const max = useMessengerLink("max")

  const socials = [
    { type: "telegram" as const, icon: IconTelegram, href: telegram.link || siteConfig.social.telegramUrl, label: "Telegram", messenger: telegram },
    { type: "whatsapp" as const, icon: IconWhatsapp, href: whatsapp.link || siteConfig.social.whatsappUrl, label: "WhatsApp", messenger: whatsapp },
    { type: "max" as const, icon: IconMax, href: max.link || siteConfig.social.maxUrl, label: "Max", messenger: max },
  ]

  return (
    <div className="flex items-center gap-2.5">
      {socials.map((s) => {
        if (!s.messenger.loading && !s.messenger.available) {
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => notifyMessengerUnavailable(s.type)}
              className="w-11 h-11 bg-background/5 rounded-xl flex items-center justify-center text-background/30 cursor-not-allowed"
              aria-label={`${s.label} (недоступен)`}
              aria-disabled="true"
              title={`${s.label} временно недоступен`}
            >
              <s.icon className="w-5 h-5" />
            </button>
          )
        }
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 bg-background/10 rounded-xl flex items-center justify-center text-background/80 hover:text-primary-foreground hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"
            aria-label={s.label}
            title={s.label}
            onClick={() => s.messenger.trackClick()}
          >
            <s.icon className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-bold text-background mb-5 text-xs uppercase tracking-[0.15em] text-background/50">{title}</h4>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-sm text-background/70 hover:text-primary transition-colors"
            >
              {link.label}
              <IconArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* CTA band */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-balance">
                Сделайте следующий шаг <span className="text-primary">в карьере</span>
              </h2>
              <p className="mt-3 text-background/60 text-pretty leading-relaxed">
                Оставьте заявку — подберём подходящую вакансию у проверенного работодателя. Для соискателей бесплатно.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/#find"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 btn-primary text-primary-foreground font-bold rounded-2xl btn-shine"
              >
                Подобрать работу
                <IconArrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-background/5 border border-background/15 text-background font-bold rounded-2xl hover:bg-background/10 transition-colors"
              >
                Я работодатель
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-8">
          {/* Brand + contacts */}
          <div className="col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl overflow-hidden ring-1 ring-background/15">
                <Image alt={siteConfig.name} loading="lazy" width="44" height="44" decoding="async" className="w-full h-full object-cover" src="/logo.png" />
              </div>
              <span className="text-2xl font-black">
                {siteConfig.brandPrefix}<span className="text-primary">{siteConfig.brandSuffix}</span>
              </span>
            </Link>
            <p className="text-background/60 mb-7 max-w-sm leading-relaxed text-sm text-pretty">
              {siteConfig.tagline}. Помогаем соискателям найти подходящую работу, а работодателям — закрыть вакансии. Консультация бесплатна.
            </p>

            <div className="space-y-3 mb-7">
              <a href={siteConfig.contact.phoneHref} className="group flex items-center gap-3 text-background/80 hover:text-primary transition-colors">
                <span className="w-10 h-10 bg-background/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors"><IconPhone className="w-4 h-4" /></span>
                <span className="text-sm font-bold tabular-nums">{siteConfig.contact.phone}</span>
              </a>
              <a href={siteConfig.contact.emailHref} className="group flex items-center gap-3 text-background/80 hover:text-primary transition-colors">
                <span className="w-10 h-10 bg-background/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors"><IconMail className="w-4 h-4" /></span>
                <span className="text-sm font-medium">{siteConfig.contact.email}</span>
              </a>
              <div className="flex items-start gap-3 text-background/60">
                <span className="w-10 h-10 bg-background/10 rounded-xl flex items-center justify-center shrink-0"><IconMapPin className="w-4 h-4" /></span>
                <span className="text-xs leading-relaxed pt-3">{siteConfig.company.address}</span>
              </div>
            </div>

            <FooterSocials />
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          <div className="col-span-1 lg:col-span-2">
            <LinkColumn title="Соискателям" links={footerLinks.seekers} />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <LinkColumn title="Компания" links={footerLinks.company} />
          </div>
          <div className="col-span-2 lg:col-span-2">
            <LinkColumn title="Документы" links={footerLinks.legal} />
          </div>
        </div>
      </div>

      {/* Giant decorative wordmark */}
      <div aria-hidden="true" className="container mx-auto px-4 sm:px-6 lg:px-8 select-none pointer-events-none">
        <div className="font-black tracking-tighter leading-none text-background/[0.04] text-[22vw] lg:text-[18vw] -mb-[0.12em]">
          {siteConfig.name}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-[11px] sm:text-xs text-background/50">
              © {siteConfig.stats.yearFounded} {siteConfig.company.name}. Все права защищены.
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-background/50">
              {siteConfig.company.ogrn && <span className="font-mono">ОГРН {siteConfig.company.ogrn}</span>}
              {siteConfig.company.ogrn && siteConfig.company.inn && <span className="w-1 h-1 bg-background/30 rounded-full" />}
              {siteConfig.company.inn && <span className="font-mono">ИНН {siteConfig.company.inn}</span>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
