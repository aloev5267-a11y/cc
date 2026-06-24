"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { Header } from "./header"
import { Footer } from "./footer"
import { IconUsers, IconMapPin, IconShield, IconClock, IconBriefcase, IconHeart, IconTarget, IconStar, IconArrow } from "./icons"

const stats = [
  { icon: IconClock, value: String(siteConfig.stats.yearFounded), label: "год основания" },
  { icon: IconUsers, value: siteConfig.stats.candidatesPlaced, label: "трудоустроено" },
  { icon: IconMapPin, value: `${siteConfig.stats.cities}+`, label: "городов" },
  { icon: IconShield, value: "100%", label: "официально" },
]

const values = [
  {
    icon: IconHeart,
    title: "Забота о кандидате",
    description: "Сопровождаем соискателя на каждом этапе — от анкеты до выхода на работу. Бесплатно.",
  },
  {
    icon: IconShield,
    title: "Проверенные работодатели",
    description: "Сотрудничаем только с компаниями, которые оформляют сотрудников официально по ТК РФ.",
  },
  {
    icon: IconTarget,
    title: "Точный подбор",
    description: "Учитываем пожелания по графику, городу и формату занятости, чтобы предложить релевантное.",
  },
  {
    icon: IconStar,
    title: "Качество сервиса",
    description: "Высокие стандарты работы и честная коммуникация с соискателями и работодателями.",
  },
]

const team = [
  { role: "Руководитель агентства", description: "Стратегия и развитие направлений подбора" },
  { role: "Руководитель подбора", description: "Управление командой рекрутеров" },
  { role: "Менеджеры по подбору", description: "Работа с соискателями и вакансиями" },
  { role: "Клиентский отдел", description: "Сопровождение работодателей" },
]

export function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 dot-pattern opacity-30" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-6"
              >
                Об агентстве
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6"
              >
                Мы — <span className="gradient-text">{siteConfig.name}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Кадровое агентство {siteConfig.company.name}. Помогаем соискателям найти подходящую работу,
                а работодателям — закрыть вакансии проверенными кандидатами.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="card-elevated p-4 sm:p-6 rounded-2xl text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6">
                  Наша миссия
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Сделать поиск работы простым и честным. Мы верим, что каждый соискатель заслуживает
                    прозрачных условий, а работодатель — мотивированных и подходящих сотрудников.
                  </p>
                  <p>
                    Мы берём на себя рутину подбора: анализируем запрос, подбираем варианты у проверенных
                    работодателей и сопровождаем кандидата вплоть до выхода на работу.
                  </p>
                </div>

                <div className="mt-8 p-6 bg-card rounded-2xl border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <IconBriefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold">Бесплатно для соискателей</div>
                      <div className="text-sm text-muted-foreground">Услуги агентства оплачивает работодатель</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 flex items-center justify-center">
                  <div className="relative w-48 h-48 overflow-hidden rounded-3xl">
                    <Image
                      src="/logo.png"
                      alt={siteConfig.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                Наши ценности
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Принципы, которыми мы руководствуемся в работе каждый день
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-elevated p-6 rounded-2xl text-center group hover:border-primary/30 transition-all"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                Команда
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Специалисты, которые помогают людям находить работу
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-elevated p-6 rounded-2xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                    <IconUsers className="w-8 h-8 text-primary/60" />
                  </div>
                  <h3 className="font-bold mb-1">{member.role}</h3>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Info Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <div className="card-elevated p-6 sm:p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6">Реквизиты компании</h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm text-muted-foreground">Полное наименование</span>
                    <div className="font-medium mt-1">{siteConfig.company.name}</div>
                  </div>
                  {siteConfig.company.ogrn && (
                    <div>
                      <span className="text-sm text-muted-foreground">ОГРН</span>
                      <div className="font-mono font-medium mt-1">{siteConfig.company.ogrn}</div>
                    </div>
                  )}
                  {siteConfig.company.inn && (
                    <div>
                      <span className="text-sm text-muted-foreground">ИНН</span>
                      <div className="font-mono font-medium mt-1">{siteConfig.company.inn}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">Статус</span>
                    <div className="font-medium mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Действующая организация
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-sm text-muted-foreground">Адрес</span>
                    <div className="font-medium mt-1">{siteConfig.company.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>
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
                Ищете работу или сотрудников?
              </h2>
              <p className="text-muted-foreground mb-8">
                Подберём подходящие вакансии для соискателей и закроем потребность в персонале для работодателей.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/vacancies"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Смотреть вакансии
                  <IconArrow className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border font-bold rounded-xl hover:bg-muted transition-colors"
                >
                  На главную
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
