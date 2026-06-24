"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Header } from "./header"
import { Footer } from "./footer"
import { IconMapPin, IconTruck, IconCheck, IconArrow } from "./icons"

const regions = [
  {
    name: "Московская область",
    cities: ["Москва", "Подольск", "Люберцы", "Мытищи", "Королёв", "Химки", "Балашиха"],
    active: true,
  },
  {
    name: "Ивановская область",
    cities: ["Иваново", "Кинешма", "Шуя", "Вичуга"],
    active: true,
  },
  {
    name: "Воронежская область",
    cities: ["Воронеж", "Борисоглебск", "Россошь", "Лиски"],
    active: true,
  },
  {
    name: "Тверская область",
    cities: ["Тверь", "Ржев", "Вышний Волочёк", "Кимры"],
    active: true,
  },
  {
    name: "Нижегородская область",
    cities: ["Нижний Новгород", "Дзержинск", "Арзамас", "Саров"],
    active: true,
  },
  {
    name: "Новгородская область",
    cities: ["Великий Новгород", "Боровичи", "Старая Русса"],
    active: true,
  },
  {
    name: "Ярославская область",
    cities: ["Ярославль", "Рыбинск", "Переславль-Залесский"],
    active: true,
  },
  {
    name: "Владимирская область",
    cities: ["Владимир", "Ковров", "Муром", "Александров"],
    active: true,
  },
  {
    name: "Краснодарский край",
    cities: ["Краснодар", "Сочи", "Новороссийск", "Армавир", "Анапа"],
    active: true,
  },
  {
    name: "Республика Башкортостан",
    cities: ["Уфа", "Стерлитамак", "Салават", "Нефтекамск"],
    active: true,
  },
  {
    name: "Свердловская область",
    cities: ["Екатеринбург", "Нижний Тагил", "Каменск-Уральский", "Первоуральск"],
    active: true,
  },
  {
    name: "Тульская область",
    cities: ["Тула", "Новомосковск", "Донской", "Алексин"],
    active: true,
  },
  {
    name: "Рязанская область",
    cities: ["Рязань", "Касимов", "Скопин", "Сасово"],
    active: true,
  },
  {
    name: "Челябинская область",
    cities: ["Челябинск", "Магнитогорск", "Златоуст", "Миасс"],
    active: true,
  },
]

export function CitiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left - Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-6">
                  География доставки
                </span>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6">
                  Доставляем по{" "}
                  <span className="gradient-text">всей России</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                  КурьерХаб работает в 14 регионах России. Мы постоянно расширяем географию, 
                  чтобы быть ближе к каждому клиенту.
                </p>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border">
                    <IconMapPin className="w-5 h-5 text-primary" />
                    <span className="font-bold">14 регионов</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border">
                    <IconTruck className="w-5 h-5 text-primary" />
                    <span className="font-bold">50+ городов</span>
                  </div>
                </div>
              </motion.div>

              {/* Right - Map Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/russia-map.webp"
                    alt="Карта доставки КурьерХаб"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm text-white/80 text-center">
                      Оранжевые метки — города присутствия КурьерХаб
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Regions Grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                Регионы доставки
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Выберите свой регион, чтобы узнать о возможностях доставки в вашем городе
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {regions.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group card-elevated p-5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconMapPin className="w-5 h-5 text-primary" />
                    </div>
                    {region.active && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-full text-xs font-medium text-green-600">
                        <IconCheck className="w-3 h-3" />
                        Активен
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {region.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1">
                    {region.cities.slice(0, 4).map((city) => (
                      <span
                        key={city}
                        className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground"
                      >
                        {city}
                      </span>
                    ))}
                    {region.cities.length > 4 && (
                      <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                        +{region.cities.length - 4}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-transparent to-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                Не нашли свой город?
              </h2>
              <p className="text-muted-foreground mb-8">
                Мы постоянно расширяем географию присутствия. Свяжитесь с нами, 
                и мы обсудим возможности доставки в ваш регион.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Связаться с нами
                  <IconArrow className="w-4 h-4" />
                </Link>
                <Link
                  href="/vacancies"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border font-bold rounded-xl hover:bg-muted transition-colors"
                >
                  Стать курьером
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
