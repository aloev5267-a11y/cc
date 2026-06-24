"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { siteConfig } from "@/lib/config"
import { IconPhone, IconMessage, IconSend, IconTelegram, IconWhatsapp, IconMail, IconMax, IconUser, IconAt } from "./icons"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"

const contactInfo = [
  {
    icon: IconMail,
    title: "Email",
    value: siteConfig.contact.email,
    description: "Ответим в течение часа",
  },
  {
    icon: IconMessage,
    title: "Поддержка",
    value: "Пн–Вс",
    description: "Ответим в течение рабочего дня",
  },
]

function MessengerLinks() {
  const telegram = useMessengerLink('telegram')
  const whatsapp = useMessengerLink('whatsapp')
  const max = useMessengerLink('max')

  const handleClick = (name: string) => {
    if (name === "Telegram") telegram.trackClick()
    if (name === "WhatsApp") whatsapp.trackClick()
    if (name === "Max") max.trackClick()
  }

  const items = [
    { type: 'telegram' as const, icon: IconTelegram, name: "Telegram", handle: telegram.loading ? "..." : telegram.account?.name || siteConfig.social.telegram, color: "bg-sky-500/10 text-sky-500", href: telegram.link || siteConfig.social.telegramUrl, messenger: telegram },
    { type: 'whatsapp' as const, icon: IconWhatsapp, name: "WhatsApp", handle: whatsapp.loading ? "..." : whatsapp.account?.name || "Написать", color: "bg-green-500/10 text-green-500", href: whatsapp.link || siteConfig.social.whatsappUrl, messenger: whatsapp },
    { type: 'max' as const, icon: IconMax, name: "Max", handle: max.loading ? "..." : max.account?.name || "Написать", color: "bg-purple-500/10 text-purple-500", href: max.link || siteConfig.social.maxUrl, messenger: max },
  ]

  return (
    <>
      {items.map((m, index) => {
        // Нет менеджеров для мессенджера — неактивная карточка с уведомлением
        if (!m.messenger.loading && !m.messenger.available) {
          return (
            <motion.button
              key={m.name}
              type="button"
              onClick={() => notifyMessengerUnavailable(m.type)}
              title={`${m.name} временно недоступен`}
              aria-disabled="true"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + index * 0.08 }}
              className="card-elevated p-4 rounded-xl flex items-center gap-3 text-left opacity-60 cursor-not-allowed"
              aria-label={`${m.name} временно недоступен`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">{m.name}</div>
                <div className="text-xs text-muted-foreground">Временно недоступен</div>
              </div>
            </motion.button>
          )
        }
        return (
          <motion.a
            key={m.name}
            href={m.href}
            target="_blank"
            rel="noopener noreferrer"
            title={m.name}
            onClick={() => handleClick(m.name)}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + index * 0.08 }}
            className="card-elevated p-4 rounded-xl flex items-center gap-3 hover:border-primary/50 transition-colors"
            aria-label={`Связаться через ${m.name}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.handle}</div>
            </div>
          </motion.a>
        )
      })}
    </>
  )
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [consent, setConsent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setIsSubmitting(true)
    setStatus("idle")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, source: "contact_form" }),
      })
      if (!res.ok) throw new Error("request failed")
      setStatus("success")
      setFormData({ name: "", email: "", phone: "", message: "" })
      setConsent(false)
    } catch {
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-16 md:py-20 lg:py-28 bg-muted/30">
      <div className="absolute inset-0 dot-pattern" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-primary/10 rounded-full text-xs sm:text-sm font-semibold text-primary mb-4">
            Контакты
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-foreground mb-3 md:mb-4">
            Свяжитесь с нами
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Выбирайте удобный способ связи — мы всегда рады помочь
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Contact cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className="card-elevated p-5 rounded-xl text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-lg font-bold text-primary mb-0.5">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Messengers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10"
          >
            <MessengerLinks />
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-elevated rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IconMessage className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Напишите нам</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-medium text-muted-foreground mb-2 block">Имя</label>
                    <div className="relative">
                      <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <input id="contact-name" type="text" placeholder="Ваше имя" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="text-sm font-medium text-muted-foreground mb-2 block">Телефон</label>
                    <div className="relative">
                      <IconPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <input id="contact-phone" type="tel" placeholder="+7 (___) ___-__-__" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full h-11 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm" required />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-sm font-medium text-muted-foreground mb-2 block">Email <span className="text-muted-foreground/60">(необязательно)</span></label>
                  <div className="relative">
                    <IconAt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <input id="contact-email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-11 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-sm font-medium text-muted-foreground mb-2 block">Сообщение</label>
                  <textarea id="contact-message" placeholder="Опишите ваш вопрос..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full min-h-[120px] p-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm" required />
                </div>
                <label htmlFor="contact-consent" className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
                    required
                  />
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    Я согласен на обработку персональных данных и принимаю{" "}
                    <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">
                      политику конфиденциальности
                    </a>
                  </span>
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button type="submit" disabled={isSubmitting || !consent} className="w-full md:w-auto px-6 h-12 btn-primary text-primary-foreground font-bold rounded-xl btn-shine flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? "Отправляем..." : <><IconSend className="w-4 h-4" />Отправить</>}
                  </button>
                  {status === "success" && (
                    <p role="status" className="text-sm font-medium text-green-600 dark:text-green-500">
                      Заявка отправлена! Мы свяжемся с вами в ближайшее время.
                    </p>
                  )}
                  {status === "error" && (
                    <p role="alert" className="text-sm font-medium text-destructive">
                      Не удалось отправить. Попробуйте ещё раз или позвоните нам.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
