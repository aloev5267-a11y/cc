"use client"

import { motion } from "framer-motion"
import { 
  IconPackage, 
  IconTruck, 
  IconWallet, 
  IconMapPin, 
  IconClock, 
  IconShield,
  IconArrow 
} from "./icons"

const services = [
  {
    icon: IconPackage,
    title: "Оформление доставки",
    description: "Заполни форму за 2 минуты — курьер заберёт груз в тот же день",
    link: "#delivery"
  },
  {
    icon: IconTruck,
    title: "Биржа грузов",
    description: "Выбирай заказы по маршруту и зарабатывай в своём темпе",
    link: "#cargo"
  },
  {
    icon: IconWallet,
    title: "Честные выплаты",
    description: "Деньги на карту ежедневно. Без задержек и скрытых комиссий",
    link: "#payments"
  },
  {
    icon: IconMapPin,
    title: "Вся Россия",
    description: "Работаем в 14 регионах — от Калининграда до Владивостока",
    link: "#coverage"
  },
  {
    icon: IconClock,
    title: "Гибкий график",
    description: "Работай когда удобно. Никаких штрафов за выходные",
    link: "#careers"
  },
  {
    icon: IconShield,
    title: "Официально",
    description: "Договор, страхование груза, юридическая защита",
    link: "#about"
  },
]

export function Services() {
  return (
    <section id="services" className="relative py-16 md:py-20 lg:py-28">
      <div className="absolute inset-0 dot-pattern" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-primary/10 rounded-full text-xs sm:text-sm font-semibold text-primary mb-4">
            Как это работает
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-foreground mb-3 md:mb-4">
            Простая доставка для всех
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Отправляй грузы или зарабатывай на доставке — выбор за тобой
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map((service, index) => (
            <motion.a
              key={service.title}
              href={service.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group card-elevated p-5 md:p-6 lg:p-8 rounded-2xl"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all">
                <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              
              <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                Подробнее
                <IconArrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
