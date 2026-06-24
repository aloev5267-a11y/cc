"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const steps = [
  {
    id: 1,
    title: "Оформление заявки",
    description: "Заполните простую форму на сайте или свяжитесь с менеджером. Укажите откуда и куда нужно доставить груз, габариты и вес посылки.",
    image: "/steps/step-1.webp",
  },
  {
    id: 2,
    title: "Расчёт стоимости",
    description: "Мгновенный расчёт стоимости на основе веса, габаритов и расстояния. Никаких скрытых платежей — вы сразу видите итоговую цену.",
    image: "/steps/step-2.webp",
  },
  {
    id: 3,
    title: "Забор груза",
    description: "Курьер приедет в удобное для вас время. Аккуратно упакует и заберёт груз. Вы получите SMS с подтверждением.",
    image: "/steps/step-3.webp",
  },
  {
    id: 4,
    title: "Отслеживание",
    description: "Следите за перемещением груза в реальном времени через личный кабинет. Уведомления на каждом этапе доставки.",
    image: "/steps/step-4.webp",
  },
  {
    id: 5,
    title: "Доставка",
    description: "Быстрая и бережная доставка до двери получателя. При необходимости — проверка содержимого перед передачей.",
    image: "/steps/step-5.webp",
  },
  {
    id: 6,
    title: "Подтверждение",
    description: "Получатель подтверждает получение груза. Вы мгновенно получаете уведомление об успешной доставке.",
    image: "/steps/step-6.webp",
  },
]

export function HowItWorks() {
  const [openStep, setOpenStep] = useState<number | null>(0)

  const toggleStep = (index: number) => {
    setOpenStep(openStep === index ? null : index)
  }

  return (
    <section id="services" className="relative py-16 md:py-24 overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
            Как это работает
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            Простая доставка для всех
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Отправляй грузы или зарабатывай на доставке — выбор за тобой
          </p>
        </motion.div>

        {/* Vertical Accordion */}
        <div className="max-w-4xl mx-auto space-y-3">
          {steps.map((step, index) => {
            const isOpen = openStep === index
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleStep(index)}
                  className="w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-base md:text-lg shrink-0 transition-colors ${
                    isOpen 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.id}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base md:text-lg">{step.title}</h3>
                    {!isOpen && (
                      <p className="text-sm text-muted-foreground truncate hidden sm:block">
                        {step.description}
                      </p>
                    )}
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}>
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 md:px-5 md:pb-5">
                        {/* Image */}
                        <div className="relative w-full h-48 sm:h-56 md:h-72 rounded-xl overflow-hidden mb-4">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                              Шаг {step.id} из {steps.length}
                            </span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        
                        {/* Progress */}
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${((index + 1) / steps.length) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {Math.round(((index + 1) / steps.length) * 100)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
