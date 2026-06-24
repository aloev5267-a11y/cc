"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "./header"
import { Footer } from "./footer"
import { IconSearch, IconPackage, IconTruck, IconCheck, IconClock, IconMapPin, IconArrow } from "./icons"
import { PromoMessengers } from "./promo/promo-messengers"

export function TrackingPage() {
  const [trackCode, setTrackCode] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackCode.trim()) return
    
    setIsSearching(true)
    // Simulate search
    setTimeout(() => {
      setIsSearching(false)
      setSearched(true)
    }, 1500)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-sm font-semibold text-blue-600 mb-6">
                  <IconClock className="w-4 h-4" />
                  В разработке
                </span>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6">
                  Отслеживание{" "}
                  <span className="gradient-text">посылки</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Мы работаем над созданием личного кабинета с полным функционалом отслеживания. 
                  Пока вы можете проверить статус по трек-коду.
                </p>
              </motion.div>

              {/* Search Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSearch}
                className="max-w-xl mx-auto"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IconSearch className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={trackCode}
                    onChange={(e) => setTrackCode(e.target.value)}
                    placeholder="Введите трек-код посылки"
                    className="w-full pl-12 pr-32 py-4 bg-card border border-border rounded-2xl text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !trackCode.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Поиск...
                      </>
                    ) : (
                      <>
                        Найти
                        <IconArrow className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>

              {/* Search Result */}
              {searched && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 card-elevated p-6 rounded-2xl text-left"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      <IconClock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-bold">Функционал в разработке</div>
                      <div className="text-sm text-muted-foreground">Трек-код: {trackCode}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Отслеживание по трек-коду будет доступно после запуска личного кабинета. 
                    Пока вы можете связаться с нами для уточнения статуса заказа.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                Что будет в личном кабинете
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Мы разрабатываем полноценный личный кабинет с широким функционалом
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: IconPackage,
                  title: "История заказов",
                  description: "Все ваши заказы в одном месте с полной историей",
                  status: "soon",
                },
                {
                  icon: IconMapPin,
                  title: "Отслеживание на карте",
                  description: "Следите за перемещением посылки в реальном времени",
                  status: "soon",
                },
                {
                  icon: IconTruck,
                  title: "Статус доставки",
                  description: "Подробная информация о каждом этапе доставки",
                  status: "soon",
                },
                {
                  icon: IconCheck,
                  title: "Уведомления",
                  description: "Push и SMS уведомления о статусе заказа",
                  status: "soon",
                },
                {
                  icon: IconClock,
                  title: "Расчётное время",
                  description: "Точный прогноз времени доставки с учётом маршрута",
                  status: "soon",
                },
                {
                  icon: IconSearch,
                  title: "Быстрый поиск",
                  description: "Поиск по трек-коду, номеру телефона или адресу",
                  status: "soon",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-elevated p-6 rounded-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs font-medium rounded-full">
                      Скоро
                    </span>
                  </div>
                  
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-8 text-center">
                Этапы разработки
              </h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

                {[
                  { date: "Июнь 2026", title: "Базовое отслеживание", description: "Поиск по трек-коду и базовая информация о статусе", done: false },
                  { date: "Июль 2026", title: "Личный кабинет", description: "Регистрация, авторизация и история заказов", done: false },
                  { date: "Август 2026", title: "Уведомления", description: "Push и SMS оповещения о статусе доставки", done: false },
                  { date: "Сентябрь 2026", title: "Карта отслеживания", description: "Отслеживание посылки на карте в реальном времени", done: false },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative pl-12 pb-8 md:pl-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 ${
                      item.done ? "bg-primary border-primary" : "bg-background border-primary"
                    } md:left-auto ${index % 2 === 0 ? "md:right-[-6px]" : "md:left-[-6px]"}`} />

                    <div className={`card-elevated p-4 sm:p-5 rounded-xl ${item.done ? "border-primary/30" : ""}`}>
                      <span className="text-xs font-semibold text-primary mb-1 block">{item.date}</span>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                Нужна помощь с заказом?
              </h2>
              <p className="text-muted-foreground mb-8">
                Наши менеджеры помогут отследить статус вашей посылки и ответят на любые вопросы
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <a
                  href="tel:+78001234567"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Позвонить
                </a>
                <div className="w-full max-w-sm">
                  <PromoMessengers options={{ source: "tracking-cta", page: "tracking" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
