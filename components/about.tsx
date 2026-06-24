"use client"

import { motion } from "framer-motion"
import { IconUsers, IconMapPin, IconShield, IconClock } from "./icons"

const stats = [
  { icon: IconClock, value: "2026", label: "старт проекта" },
  { icon: IconUsers, value: "Новая", label: "команда" },
  { icon: IconMapPin, value: "14", label: "регионов" },
  { icon: IconShield, value: "100%", label: "официально" },
]

export function About() {
  return (
    <section id="about" className="relative py-16 md:py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 dot-pattern" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-primary/10 rounded-full text-xs sm:text-sm font-semibold text-primary mb-4 sm:mb-6">
              О компании
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 md:mb-6 text-foreground">
              ООО «Феникс»
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8 text-sm sm:text-base">
              <p>
                <span className="text-foreground font-semibold">КурьерХаб</span> — 
                новая логистическая платформа от ООО «Фестивальное движение Феникс». 
                Мы только запустились в мае 2026 года и строим сервис, 
                который изменит рынок доставки в России.
              </p>
              <p>
                Наша миссия — сделать доставку простой и доступной для каждого. 
                Отправляй груз в любой город или присоединяйся к команде курьеров 
                и зарабатывай честно.
              </p>
            </div>

            {/* Legal info card */}
            <div className="card-elevated p-5 rounded-xl">
              <h4 className="font-bold text-foreground mb-4 text-sm">Реквизиты компании</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">ОГРН</span>
                  <div className="font-mono text-foreground">1269600016927</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">ИНН</span>
                  <div className="font-mono text-foreground">6686172964</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">КПП</span>
                  <div className="font-mono text-foreground">668601001</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Дата регистрации</span>
                  <div className="font-mono text-foreground">Май 2026</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground text-xs">Юридический адрес</span>
                  <div className="text-foreground text-sm mt-1">
                    Свердловская обл., г.о. Верхняя Пышма, г. Верхняя Пышма, ул. Пионерская, д. 21А
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                className="card-elevated p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
