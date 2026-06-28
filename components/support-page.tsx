"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Header } from "./header"
import { Footer } from "./footer"
import { siteConfig } from "@/lib/config"
import { faqItems } from "@/lib/faq"
import { openLiveChat, trackLiveChatLead } from "@/lib/livechat"
import { trackLead } from "@/lib/metrika"
import { getUtmParams } from "@/lib/utm"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"
import { 
  IconMail, 
  IconTelegram, 
  IconVk,
  IconWhatsapp,
  IconMax,
  IconSend,
  IconCheck,
  IconClock,
  IconMessage,
  IconHeadphones
} from "./icons"

// Плитка контакта-мессенджера для страницы поддержки. Использует ту же единую
// структуру, что и хедер/футер/формы: аккаунт берётся из админки (round-robin
// через useMessengerLink), клик фиксирует лид и единую цель "ЛИД" в Метрике,
// при отсутствии активных менеджеров — мягкое уведомление.
const supportMessengers = {
  telegram: { icon: IconTelegram, label: "Telegram", color: "text-sky-500", fallbackUrl: siteConfig.social.telegramUrl },
  vk: { icon: IconVk, label: "ВКонтакте", color: "text-[#0077FF]", fallbackUrl: siteConfig.social.vkUrl },
  whatsapp: { icon: IconWhatsapp, label: "WhatsApp", color: "text-green-500", fallbackUrl: siteConfig.social.whatsappUrl },
  max: { icon: IconMax, label: "Max", color: "text-violet-500", fallbackUrl: siteConfig.social.maxUrl },
} as const

function MessengerContactTile({
  type,
  delay,
}: {
  type: "telegram" | "vk" | "whatsapp" | "max"
  delay: number
}) {
  const messenger = useMessengerLink(type)
  const cfg = supportMessengers[type]
  const Icon = cfg.icon

  if (!messenger.loading && !messenger.available) {
    return (
      <motion.button
        type="button"
        onClick={() => notifyMessengerUnavailable(type)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        aria-disabled="true"
        className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border opacity-60 cursor-not-allowed text-left"
      >
        <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${cfg.color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{cfg.label}</div>
          <div className="font-semibold">Недоступен</div>
        </div>
      </motion.button>
    )
  }

  return (
    <motion.a
      href={messenger.link || cfg.fallbackUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => messenger.trackClick()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors group"
    >
      <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${cfg.color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{cfg.label}</div>
        <div className="font-semibold group-hover:text-primary transition-colors">Написать</div>
      </div>
    </motion.a>
  )
}

export function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)

  // Человекочитаемые названия тем — добавляем в текст заявки, чтобы менеджер
  // сразу видел, о чём вопрос (в схеме API отдельного поля для темы нет).
  const subjectLabels: Record<string, string> = {
    general: "Общий вопрос",
    jobseeker: "Поиск работы",
    application: "Статус заявки",
    employer: "Подбор персонала (работодателям)",
    other: "Другое",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)

    const subjectLabel = subjectLabels[formData.subject] || "Общий вопрос"
    const message = `Тема: ${subjectLabel}\n${formData.message}`.trim()
    const utm = getUtmParams()

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || "",
          message,
          source: "contact_form",
          ...(Object.keys(utm).length > 0 ? { utm } : {}),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        toast.error(data?.error || "Не удал��сь отправить сообщение", {
          description: "Попробуйте ещё раз или напишите нам в мессенджер.",
        })
        setSending(false)
        return
      }

      // Единая цель "ЛИД" в Метрике — заявка с формы теперь учитывается в
      // статистике и оптимизации рекламных кампаний (как и клики по мессенджерам).
      trackLead({ channel: "form", source: "support-form", ...utm })
      setSubmitted(true)
    } catch {
      toast.error("Ошибка сети", {
        description: "Проверьте соединение и попробуйте ещё раз.",
      })
    } finally {
      setSending(false)
    }
  }

  // Открыть онлайн-чат с темой "Поддержка" и зафиксировать лид (канал 'chat').
  const handleOpenLiveChat = async () => {
    trackLiveChatLead("support")
    const opened = await openLiveChat({ subject: "Поддержка" })
    if (!opened) {
      toast.error("Онлайн-чат пока недоступен", {
        description: "Чат не успел загрузиться. Пожалуйста, напишите нам в мессенджер или на email.",
      })
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <IconMessage className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Поддержка</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
                Мы всегда <span className="gradient-text">на связи</span>
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Есть вопросы о трудоустройстве или подборе персонала? Напишите нам — 
                специалист ответит в течение рабочего дня.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact options */}
        <section className="py-12 border-t border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Онлайн-чат — быстрый ответ прямо на сайте */}
              <motion.button
                type="button"
                onClick={handleOpenLiveChat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-5 bg-primary text-primary-foreground rounded-2xl border border-primary hover:bg-primary/90 transition-colors text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
                  <IconHeadphones className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/70">Онлайн-чат</div>
                  <div className="font-semibold">Ответим сразу</div>
                </div>
              </motion.button>

              {/* Email — прямая ссылка (не мессенджер) */}
              <motion.a
                href={siteConfig.contact.emailHref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-blue-500">
                  <IconMail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold group-hover:text-primary transition-colors">{siteConfig.contact.email}</div>
                </div>
              </motion.a>

              {/* Мессенджеры — единая структура (управление из админки + фиксация лида) */}
              <MessengerContactTile type="telegram" delay={0.2} />
              <MessengerContactTile type="vk" delay={0.3} />
              <MessengerContactTile type="whatsapp" delay={0.4} />
              <MessengerContactTile type="max" delay={0.5} />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Имя</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ваше имя"
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Телефон</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7 (999) 123-45-67"
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Тема обращения</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="general">Общий вопрос</option>
                      <option value="jobseeker">Поиск работы</option>
                      <option value="application">Статус моей заявки</option>
                      <option value="employer">Подбор персонала (работодателям)</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Сообщение</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Опишите ваш вопрос..."
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "Отправляем…" : "Отправить сообщение"}
                    {!sending && <IconSend className="w-5 h-5" />}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 px-6 bg-green-500/10 rounded-2xl border border-green-500/20"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconCheck className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Сообщение отправлено!</h3>
                  <p className="text-muted-foreground mb-6">
                    Мы ответим вам в ближайшее время — как правило, в течение рабочего дня.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' })
                    }}
                    className="px-6 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
                  >
                    Отправить ещё
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6">Частые вопросы</h2>
              
              <div className="space-y-3">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{item.question}</span>
                      <svg
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          activeQuestion === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeQuestion === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="px-5 pb-4"
                      >
                        <p className="text-muted-foreground text-sm">{item.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Response time */}
              <div className="mt-8 p-5 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <IconClock className="w-5 h-5 text-primary" />
                  <span className="font-bold">Время ответа</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Мы стараемся отвечать на все обращения в течение рабочего дня. 
                  По срочным вопросам пишите нам в мессенджеры.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
