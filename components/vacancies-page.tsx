"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { Header } from "./header"
import { Footer } from "./footer"
import { useMessengerLink, notifyMessengerUnavailable } from "@/hooks/use-messenger"
import { PromoMessengers } from "./promo/promo-messengers"
import { VpnNotice } from "./promo/vpn-notice"
import {
  IconWallet,
  IconClock,
  IconShield,
  IconHeart,
  IconPackage,
  IconCar,
  IconWarehouse,
  IconSend,
  IconMessage,
  IconClose,
  IconArrow,
  IconPhone,
  IconCheck,
  IconTelegram,
  IconWhatsapp,
  IconMax
} from "./icons"

const vacancies = [
  {
    id: "courier-foot",
    title: "Пеший курьер",
    icon: IconPackage,
    salary: "от 80 000 руб/мес",
    schedule: "Гибкий график",
    image: "/images/courier-walk.webp",
    description: "Доставка мелких грузов и посылок по городу",
    closed: false,
    requirements: [
      "Возраст от 18 лет",
      "Смартфон на Android или iOS",
      "Знание города",
      "Пунктуальность"
    ],
    benefits: [
      "Свободный график работы",
      "Ежедневные выплаты",
      "Бонусы за скорость",
      "Бесплатное обучение"
    ]
  },
  {
    id: "courier-car",
    title: "Курьер на авто",
    icon: IconCar,
    salary: "от 120 000 руб/мес",
    schedule: "Полный день / Подработка",
    image: "/images/courier-driver.webp",
    description: "Доставка грузов на личном автомобиле",
    closed: true,
    requirements: [
      "Права категории B",
      "Личный автомобиль",
      "Стаж от 1 года",
      "Смартфон"
    ],
    benefits: [
      "Компенсация ГСМ",
      "Повышенные тарифы",
      "Приоритет на заказы",
      "Техподдержка 24/7"
    ]
  },
  {
    id: "warehouse",
    title: "Сотрудник склада",
    icon: IconWarehouse,
    salary: "от 65 000 руб/мес",
    schedule: "Сменный график 2/2",
    image: "/images/warehouse-worker.webp",
    description: "Приём, сортировка и комплектация заказов",
    closed: false,
    requirements: [
      "Возраст от 18 лет",
      "Готовность к физ. работе",
      "Внимательность",
      "Опыт приветствуется"
    ],
    benefits: [
      "Стабильный оклад",
      "Оплачиваемые переработки",
      "Бесплатное питание",
      "Карьерный рост"
    ]
  }
]

const advantages = [
  {
    icon: IconWallet,
    title: "Достойный заработок",
    description: "Прозрачная система оплаты. Бонусы за качество и скорость."
  },
  {
    icon: IconClock,
    title: "Гибкий график",
    description: "Сами решаете когда работать. Планируйте время под себя."
  },
  {
    icon: IconShield,
    title: "Официальное оформление",
    description: "Работа по договору с полным соц. пакетом."
  },
  {
    icon: IconHeart,
    title: "Забота о сотрудниках",
    description: "Комнаты отдыха, питание на складах, корпоративы."
  }
]

const steps = [
  { step: 1, title: "Оставьте заявку", description: "Заполните форму за 2 минуты" },
  { step: 2, title: "Пройдите интервью", description: "Короткий разговор с менеджером" },
  { step: 3, title: "Обучение", description: "Научим работе с приложением" },
  { step: 4, title: "Начните работать", description: "Выходите на линию" }
]

// Компонент чата
export function VacanciesPage() {
  const [formStep, setFormStep] = useState(0)
  const [formData, setFormData] = useState({ name: '', position: '' })


  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/courier-scooter.webp" 
            alt="Курьер КурьерХаб" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 sm:mb-8 transition-colors group"
              >
                <IconArrow className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                На главную
              </Link>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 sm:mb-6 text-balance">
                Зарабатывай{" "}
                <span className="gradient-text">достойно</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Присоединяйся к команде КурьерХаб. Гибкий график, официальное оформление и стабильный доход.
              </p>

              <a 
                href="#apply"
                className="px-6 sm:px-8 py-3 sm:py-4 btn-primary text-primary-foreground font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl btn-shine inline-flex items-center justify-center gap-2 sm:gap-3 hover:scale-105 transition-transform"
              >
                Откликнуться
                <IconArrow className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats - Компактный блок */}
      <section className="py-10 sm:py-12 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary">89</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Регионов России</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Поддержка</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary">1 день</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">До первого заказа</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-4xl font-black text-primary">Каждый день</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Выплаты</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
              Почему выбирают <span className="gradient-text">нас</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {advantages.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vacancies */}
      <section id="vacancies" className="py-12 sm:py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">Открытые вакансии</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Выберите подходящую позицию</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {vacancies.map((vacancy, i) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group bg-card rounded-2xl border overflow-hidden transition-all duration-300 ${
                  vacancy.closed 
                    ? 'border-border/50 opacity-75' 
                    : 'border-border hover:shadow-xl'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={vacancy.image} 
                    alt={vacancy.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      vacancy.closed ? 'grayscale' : 'group-hover:scale-105'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  
                  {/* Badge for closed vacancy */}
                  {vacancy.closed && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-3 py-1.5 rounded-full bg-muted/90 backdrop-blur-sm border border-border text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                        Набор закрыт
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        vacancy.closed ? 'bg-muted' : 'bg-primary'
                      }`}>
                        <vacancy.icon className={`w-5 h-5 ${vacancy.closed ? 'text-muted-foreground' : 'text-white'}`} />
                      </div>
                      <div>
                        <div className="font-bold">{vacancy.title}</div>
                        <div className="text-xs text-muted-foreground">{vacancy.schedule}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm mb-4 ${
                    vacancy.closed 
                      ? 'bg-muted text-muted-foreground' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <IconWallet className="w-4 h-4" />
                    {vacancy.salary}
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">{vacancy.description}</p>

                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2 text-muted-foreground">Требования:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {vacancy.requirements.map((req, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded-md bg-muted">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-1.5 mb-5">
                    {vacancy.benefits.slice(0, 3).map((benefit, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex items-center gap-2">
                        <IconCheck className={`w-3.5 h-3.5 shrink-0 ${vacancy.closed ? 'text-muted-foreground' : 'text-green-500'}`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {vacancy.closed ? (
                    <div className="w-full py-3 bg-muted text-muted-foreground font-medium rounded-xl flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Набор временно закрыт
                    </div>
                  ) : (
                    <a 
                      href="#apply"
                      className="w-full py-3 btn-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 text-sm"
                    >
                      Откликнуться
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-black">Как начать работать</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-5 border border-border text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-xs">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section id="apply" className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-black mb-4">Связаться с нами</h2>
              <p className="text-muted-foreground">Выберите удобный способ</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left - Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 lg:p-8 border border-border"
              >
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <IconMessage className="w-5 h-5 text-primary" />
                  Напишите менеджеру в мессенджер
                </h3>

                {formStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ваше имя</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Как вас зовут?"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <button 
                      onClick={() => formData.name && setFormStep(1)}
                      disabled={!formData.name}
                      className="w-full py-3 btn-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50"
                    >
                      Продолжить
                    </button>
                  </div>
                )}

                {formStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Желаемая должность</label>
                      <div className="space-y-2">
                        {vacancies.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setFormData({ ...formData, position: v.title })}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${
                              formData.position === v.title 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <v.icon className="w-5 h-5 text-primary" />
                              <div>
                                <div className="font-medium">{v.title}</div>
                                <div className="text-xs text-muted-foreground">{v.salary}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    {formData.position ? (
                      <div>
                        <VpnNotice />
                        <PromoMessengers
                          options={{
                            message: `Здравствуйте! Меня зовут ${formData.name}. Хочу откликнуться на вакансию «${formData.position}».`,
                            metadata: { Имя: formData.name, Вакансия: formData.position },
                            source: "vacancies-form",
                            page: "vacancies",
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">
                        Выберите должность, чтобы написать менеджеру
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Right - Contact options */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="font-bold text-xl mb-6">Или свяжитесь напрямую</h3>

                <a 
                  href={siteConfig.contact.phoneHref}
                  className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <IconPhone className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="font-bold">{siteConfig.contact.phone}</div>
                    <div className="text-sm text-muted-foreground">Бесплатно по России</div>
                  </div>
                </a>

                <MessengerContact type="telegram" />

                <MessengerContact type="whatsapp" />

                {/* Max — скоро будет доступен */}
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border opacity-50 cursor-not-allowed">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <IconMax className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-bold">Max</div>
                    <div className="text-sm text-muted-foreground">Скоро будет доступен</div>
                  </div>
                </div>

                {/* Legal */}
                <div className="p-5 bg-muted/50 rounded-2xl text-xs text-muted-foreground">
                  <p className="mb-2"><strong>{siteConfig.company.name}</strong></p>
                  <p>ОГРН: {siteConfig.company.ogrn} | ИНН: {siteConfig.company.inn}</p>
                  <p>{siteConfig.company.address}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </main>
    <Footer />
    </>
  )
}

function MessengerContact({ type }: { type: 'telegram' | 'whatsapp' }) {
  const messenger = useMessengerLink(type)
  const isTelegram = type === 'telegram'
  const config = isTelegram
    ? { icon: IconTelegram, color: "bg-blue-500/10 text-blue-500", fallbackName: siteConfig.social.telegram, fallbackUrl: siteConfig.social.telegramUrl }
    : { icon: IconWhatsapp, color: "bg-green-500/10 text-green-500", fallbackName: "Напишите нам", fallbackUrl: siteConfig.social.whatsappUrl }

  // Нет менеджеров для мессенджера — неактивная карточка с уведомлением
  if (!messenger.loading && !messenger.available) {
    return (
      <button
        type="button"
        onClick={() => notifyMessengerUnavailable(type)}
        aria-disabled="true"
        className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border text-left opacity-60 cursor-not-allowed w-full"
      >
        <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
          <config.icon className="w-6 h-6" />
        </div>
        <div>
          <div className="font-bold">{isTelegram ? 'Telegram' : 'WhatsApp'}</div>
          <div className="text-sm text-muted-foreground">Временно недоступен</div>
        </div>
      </button>
    )
  }

  return (
    <a
      href={messenger.link || config.fallbackUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => messenger.trackClick()}
      className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
    >
      <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
        <config.icon className="w-6 h-6" />
      </div>
      <div>
        <div className="font-bold">{isTelegram ? 'Telegram' : 'WhatsApp'}</div>
        <div className="text-sm text-muted-foreground">
          {messenger.loading ? '...' : messenger.account?.name || config.fallbackName}
        </div>
      </div>
    </a>
  )
}
