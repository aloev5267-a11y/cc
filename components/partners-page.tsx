"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "./header"
import { Footer } from "./footer"
import { siteConfig } from "@/lib/config"
import {
  IconCheck,
  IconArrow,
  IconUsers,
  IconClock,
  IconShield,
  IconSend,
  IconBriefcase,
} from "./icons"

const benefits = [
  {
    title: "Быстрый подбор",
    description: "Закрываем вакансии в среднем за несколько дней благодаря собственной базе кандидатов.",
    icon: IconClock,
  },
  {
    title: "Проверенные кандидаты",
    description: "Предварительный отбор и собеседования — вы получаете только релевантных соискателей.",
    icon: IconShield,
  },
  {
    title: "Массовый и точечный найм",
    description: "Закрываем как единичные позиции, так и массовый подбор линейного персонала.",
    icon: IconUsers,
  },
  {
    title: "Персональный менеджер",
    description: "Закреплённый специалист сопровождает подбор и решает все вопросы.",
    icon: IconBriefcase,
  },
]

const partnerTypes = [
  {
    title: "Логистика и доставка",
    description: "Курьеры, водители, комплектовщики и сотрудники складов.",
    features: ["Массовый подбор", "Линейный персонал", "Быстрый выход"],
  },
  {
    title: "Ритейл и сервис",
    description: "Продавцы, кассиры, сотрудники торговых залов и общепита.",
    features: ["Подбор под смены", "Сезонный найм", "Замены"],
  },
  {
    title: "Производство",
    description: "Рабочие специальности и линейный персонал для предприятий.",
    features: ["Рабочие на линию", "Вахта", "Регулярные потоки"],
  },
]

export function PartnersPage() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    type: "logistics",
    volume: "",
    message: "",
  })
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
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <span className="text-sm font-semibold text-primary">Работодателям</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
                Закроем ваши вакансии <span className="gradient-text">быстро</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {siteConfig.name} — кадровое агентство полного цикла. Подбираем линейный и массовый персонал
                из собственной базы кандидатов и берём на себя весь процесс найма.
              </p>

              <a
                href="#form"
                className="inline-flex items-center gap-2 px-8 py-4 btn-primary text-primary-foreground font-bold rounded-xl"
              >
                Оставить заявку на подбор
                <IconArrow className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Почему работодатели выбирают нас</h2>
              <p className="text-muted-foreground">Берём на себя поиск, отбор и сопровождение кандидатов</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Кого подбираем</h2>
              <p className="text-muted-foreground">Решения для разных отраслей</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {partnerTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <IconCheck className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section id="form" className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Заявка на подбор персонала</h2>
                <p className="text-muted-foreground">
                  Заполните форму, и менеджер свяжется с вами, чтобы обсудить условия сотрудничества
                </p>
              </motion.div>

              {!submitted ? (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Название компании</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="ООО «Компания»"
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Контактное лицо</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Иван Иванов"
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
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
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@company.ru"
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Отрасль</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="logistics">Логистика и доставка</option>
                        <option value="retail">Ритейл и сервис</option>
                        <option value="manufacturing">Производство</option>
                        <option value="horeca">HoReCa</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Сколько сотрудников нужно</label>
                      <select
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Выберите</option>
                        <option value="1-5">1-5 человек</option>
                        <option value="5-20">5-20 человек</option>
                        <option value="20-50">20-50 человек</option>
                        <option value="50+">50+ человек</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Комментарий</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Расскажите, какие позиции нужно закрыть и в какие сроки..."
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    Отправить заявку
                    <IconSend className="w-5 h-5" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 px-6 bg-green-500/10 rounded-2xl border border-green-500/20"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconCheck className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
                  <p className="text-muted-foreground">
                    Наш менеджер свяжется с вами в течение рабочего дня, чтобы обсудить условия подбора персонала.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
