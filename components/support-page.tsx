"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "./header"
import { Footer } from "./footer"
import { siteConfig } from "@/lib/config"
import { faqItems } from "@/lib/faq"
import { 
  IconMail, 
  IconTelegram, 
  IconWhatsapp,
  IconSend,
  IconCheck,
  IconClock,
  IconMessage
} from "./icons"

export function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: IconMail, label: "Email", value: siteConfig.contact.email, href: siteConfig.contact.emailHref, color: "text-blue-500" },
                { icon: IconTelegram, label: "Telegram", value: siteConfig.social.telegram, href: siteConfig.social.telegramUrl, color: "text-sky-500" },
                { icon: IconWhatsapp, label: "WhatsApp", value: "Написать", href: siteConfig.social.whatsappUrl, color: "text-green-500" },
              ].map((contact, index) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target={contact.label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${contact.color}`}>
                    <contact.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{contact.label}</div>
                    <div className="font-semibold group-hover:text-primary transition-colors">{contact.value}</div>
                  </div>
                </motion.a>
              ))}
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
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    Отправить сообщение
                    <IconSend className="w-5 h-5" />
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
