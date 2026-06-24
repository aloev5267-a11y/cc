"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "./header"
import { Footer } from "./footer"
import { IconSend, IconCheck, IconClock } from "./icons"

export function ApiPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute inset-0 dot-pattern opacity-30" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                <IconClock className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600">В разработке</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
                API для <span className="gradient-text">интеграции</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Мы активно работаем над созданием API для интеграции с вашими системами. 
                Скоро вы сможете автоматизировать оформление доставок, отслеживание грузов 
                и получение статусов прямо из вашего приложения.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Что будет доступно</h2>
              <p className="text-muted-foreground">Планируемый функционал API</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "Создание заказов",
                  description: "Программное оформление доставки с автоматическим расчётом стоимости",
                  status: "planned"
                },
                {
                  title: "Отслеживание",
                  description: "Получение статуса доставки и местоположения груза в реальном времени",
                  status: "planned"
                },
                {
                  title: "Webhooks",
                  description: "Уведомления о событиях: забор груза, доставка, проблемы",
                  status: "planned"
                },
                {
                  title: "Расчёт стоимости",
                  description: "Калькулятор стоимости доставки для интеграции в ваш сайт",
                  status: "planned"
                },
                {
                  title: "Печать этикеток",
                  description: "Генерация транспортных этикеток и документов",
                  status: "planned"
                },
                {
                  title: "Статистика",
                  description: "Отчёты по доставкам, аналитика и история заказов",
                  status: "planned"
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-amber-500/10 text-amber-600 rounded">
                      Планируется
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Notify Form */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Узнайте первыми</h2>
                <p className="text-muted-foreground mb-8">
                  Оставьте email, и мы сообщим вам, когда API будет готов к использованию
                </p>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ваш email"
                      className="flex-1 h-12 px-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      type="submit"
                      className="px-6 h-12 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      <IconSend className="w-5 h-5" />
                      <span className="hidden sm:inline">Уведомить</span>
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-3 py-4 px-6 bg-green-500/10 rounded-xl border border-green-500/20"
                  >
                    <IconCheck className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">Мы уведомим вас о запуске API</span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl font-bold mb-4">Нужна интеграция сейчас?</h2>
              <p className="text-muted-foreground mb-6">
                Если вам требуется интеграция прямо сейчас, свяжитесь с нами — 
                мы обсудим индивидуальное решение для вашего бизнеса.
              </p>
              <a 
                href="/support"
                className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
              >
                Связаться с нами
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
