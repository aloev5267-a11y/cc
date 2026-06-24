"use client"

import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/lib/config"
import { IconPhone, IconMapPin, IconSend, IconTelegram, IconWhatsapp, IconMail, IconMax, IconArrowUpRight } from "./icons"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"

const footerLinks = {
  services: [
    { label: "Оформить доставку", href: "/#delivery" },
    { label: "Биржа грузов", href: "/#cargo" },
    { label: "Работа курьером", href: "/vacancies" },
    { label: "Отследить груз", href: "/tracking" },
  ],
  company: [
    { label: "О компании", href: "/about" },
    { label: "Поддержка", href: "/support" },
    { label: "Вакансии", href: "/vacancies" },
    { label: "Партнёрам", href: "/partners" },
  ],
  legal: [
    { label: "Пользовательское соглашение", href: "/legal/terms" },
    { label: "Политика конфиденциальности", href: "/legal/privacy" },
    { label: "Публичная оферта", href: "/legal/offer" },
  ],
}

function FooterSocials() {
  const telegram = useMessengerLink('telegram')
  const whatsapp = useMessengerLink('whatsapp')
  const max = useMessengerLink('max')

  const socials = [
    { type: 'telegram' as const, icon: IconTelegram, href: telegram.link || siteConfig.social.telegramUrl, label: "Telegram", messenger: telegram },
    { type: 'whatsapp' as const, icon: IconWhatsapp, href: whatsapp.link || siteConfig.social.whatsappUrl, label: "WhatsApp", messenger: whatsapp },
    { type: 'max' as const, icon: IconMax, href: max.link || siteConfig.social.maxUrl, label: "Max", messenger: max },
  ]

  return (
    <div className="flex items-center gap-2">
      {socials.map((s) => {
        // Нет менеджеров для мессенджера — неактивная кнопка с уведомлением
        if (!s.messenger.loading && !s.messenger.available) {
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => notifyMessengerUnavailable(s.type)}
              className="w-9 h-9 bg-background/5 rounded-lg flex items-center justify-center text-background/30 cursor-not-allowed transition-colors"
              aria-label={`${s.label} (недоступен)`}
              aria-disabled="true"
              title={`${s.label} временно недоступен`}
            >
              <s.icon className="w-4 h-4" />
            </button>
          )
        }
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center text-background/70 hover:text-primary hover:bg-background/20 transition-colors"
            aria-label={s.label}
            title={s.label}
            onClick={() => s.messenger.trackClick()}
          >
            <s.icon className="w-4 h-4" />
          </a>
        )
      })}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background">
      <div className="container mx-auto px-4 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          <div className="col-span-2 lg:col-span-4">
            <Link className="flex items-center gap-3 mb-6" href="/">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <Image alt="КурьерХаб" loading="lazy" width="48" height="48" decoding="async" className="w-full h-full object-cover" src="/logo.webp" />
              </div>
              <div>
                <span className="text-2xl font-black text-background">Курьер<span className="text-primary">Хаб</span></span>
              </div>
            </Link>
            <p className="text-background/60 mb-6 max-w-sm leading-relaxed text-sm">
              Новая логистическая платформа для быстрой и надёжной доставки грузов по всей России. Запустились в 2025.
            </p>
            <div className="space-y-3 mb-6">
              <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                <div className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center"><IconPhone className="w-4 h-4" /></div>
                <span className="text-sm font-medium">{siteConfig.contact.phone}</span>
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                <div className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center"><IconMail className="w-4 h-4" /></div>
                <span className="text-sm font-medium">{siteConfig.contact.email}</span>
              </a>
              <div className="flex items-start gap-3 text-background/70">
                <div className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center shrink-0"><IconMapPin className="w-4 h-4" /></div>
                <span className="text-xs pt-2.5 leading-relaxed">{siteConfig.company.address}</span>
              </div>
            </div>
            <FooterSocials />
          </div>
          <div className="col-span-1 lg:col-span-2 lg:col-start-6">
            <h4 className="font-bold text-background mb-5 text-sm tracking-wide">Услуги</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-background/60 hover:text-primary transition-colors text-sm flex items-center gap-1 group">{link.label}<IconArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-bold text-background mb-5 text-sm tracking-wide">Компания</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-background/60 hover:text-primary transition-colors text-sm flex items-center gap-1 group">{link.label}<IconArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-bold text-background mb-5 text-sm tracking-wide">Документы</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-background/60 hover:text-primary transition-colors text-sm flex items-center gap-1 group">{link.label}<IconArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-bold text-background mb-5 text-sm tracking-wide">Подписка на новости</h4>
            <p className="text-background/60 text-sm mb-4">Получай информацию о скидках и акциях первым</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Ваш email" className="flex-1 px-4 py-2.5 bg-background/10 border border-background/20 rounded-lg text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary" aria-label="Email для подписки" />
              <button type="submit" className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" aria-label="Подписаться"><IconSend className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-[10px] sm:text-xs text-background/50">2025 ООО «Фестивальное движение Феникс». Все права защищены.</div>
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-background/50">
              <span className="font-mono">ОГРН {siteConfig.company.ogrn}</span>
              <span className="w-1 h-1 bg-background/30 rounded-full" />
              <span className="font-mono">ИНН {siteConfig.company.inn}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
