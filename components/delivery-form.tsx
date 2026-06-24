"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { 
  IconPackage, 
  IconMapPin, 
  IconArrow, 
  IconShield, 
  IconTruck,
  IconPhone,
  IconClose,
  IconClock,
  IconMail
} from "./icons"

// Кастомные иконки для формы (уникальные для этого компонента)
const IconScale = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3v18M3 12h18" />
    <path d="M5 9l7-6 7 6M5 15l7 6 7-6" />
  </svg>
)

const IconRuler = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2" />
    <path d="M21 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2" />
    <path d="M3 12h4M17 12h4M9 12h.01M12 12h.01M15 12h.01" strokeLinecap="round" />
  </svg>
)

const IconBolt = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" />
  </svg>
)

const IconLoader = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
)

const IconInfo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
  </svg>
)

// Модальное окно для заявки на оформление
function ContactModal({ 
  isOpen, 
  onClose, 
  estimatedPrice 
}: { 
  isOpen: boolean
  onClose: () => void
  estimatedPrice: number | null
}) {
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredContact: 'phone'
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [consent, setConsent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setIsSubmitting(true)
    setError(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...contactData,
          source: 'delivery_calc',
          estimatedPrice: estimatedPrice ?? undefined,
        }),
      })
      if (!res.ok) throw new Error('request failed')
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border p-6 z-50 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Закрыть"
            >
              <IconClose className="w-4 h-4" />
            </button>

            {!submitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconPackage className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Оформление заказа</h3>
                  <p className="text-muted-foreground text-sm">
                    Мы работаем над разработкой онлайн-оформления и личного кабинета. 
                    Оставьте свои данные, и мы свяжемся с вами для оформления заказа.
                  </p>
                  {estimatedPrice && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-xl">
                      <span className="text-sm text-muted-foreground">Предварительная стоимость: </span>
                      <span className="text-lg font-bold text-primary">{estimatedPrice.toLocaleString()} руб.</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Ваше имя</label>
                    <input
                      type="text"
                      required
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      placeholder="Иван Иванов"
                      className="w-full h-11 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Телефон</label>
                    <div className="relative">
                      <IconPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        placeholder="+7 (999) 123-45-67"
                        className="w-full h-11 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Email (необязательно)</label>
                    <div className="relative">
                      <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full h-11 pl-11 pr-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Удобный способ связи</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'phone', label: 'Звонок' },
                        { value: 'whatsapp', label: 'WhatsApp' },
                        { value: 'telegram', label: 'Telegram' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setContactData({ ...contactData, preferredContact: option.value })}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            contactData.preferredContact === option.value
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label htmlFor="delivery-consent" className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      id="delivery-consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
                      required
                    />
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      Я согласен на обработку персональных данных и принимаю{" "}
                      <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">
                        политику конфиденциальности
                      </a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || !consent}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Отправляем..." : <>Отправить заявку<IconArrow className="w-4 h-4" /></>}
                  </button>
                  {error && (
                    <p role="alert" className="text-sm font-medium text-destructive text-center">
                      Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.
                    </p>
                  )}
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-green-500">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Мы свяжемся с вами в ближайшее время для уточнения деталей заказа.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function DeliveryForm() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  })

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard')

  const calculatePrice = () => {
    setIsCalculating(true)
    setTimeout(() => {
      const basePrice = deliveryType === 'express' ? 800 : 500
      const weightFactor = parseFloat(formData.weight) * 50 || 0
      const volumeFactor = 
        ((parseFloat(formData.length) * parseFloat(formData.width) * parseFloat(formData.height)) / 5000) * 30 || 0
      
      const total = Math.round(basePrice + weightFactor + volumeFactor)
      setEstimatedPrice(total > basePrice ? total : basePrice)
      setIsCalculating(false)
    }, 800)
  }

  return (
    <section id="delivery" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-4">
            Калькулятор доставки
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-4">
            Узнай стоимость за минуту
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Рассчитайте примерную стоимость доставки онлайн. 
            Окончательную цену уточняйте у менеджера.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-5">
              {/* Form */}
              <div className="lg:col-span-3 p-6 md:p-8 space-y-6">
                {/* Delivery type toggle */}
                <div className="bg-muted rounded-xl p-1 flex gap-1">
                  <button
                    onClick={() => setDeliveryType('standard')}
                    className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                      deliveryType === 'standard' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <IconTruck className="w-4 h-4" />
                    Стандартная
                  </button>
                  <button
                    onClick={() => setDeliveryType('express')}
                    className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                      deliveryType === 'express' 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <IconBolt className="w-4 h-4" />
                    Экспресс
                  </button>
                </div>

                {/* Route */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Откуда</label>
                    <div className="relative">
                      <IconMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Город отправки"
                        value={formData.from}
                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                        className="w-full h-12 pl-12 pr-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Куда</label>
                    <div className="relative">
                      <IconMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <input
                        type="text"
                        placeholder="Город доставки"
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        className="w-full h-12 pl-12 pr-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Вес груза</label>
                  <div className="relative">
                    <IconScale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      placeholder="Введите вес"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full h-12 pl-12 pr-16 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">кг</span>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Габариты (см)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Длина"
                        value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-center"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Ширина"
                        value={formData.width}
                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-center"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Высота"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button 
                  onClick={calculatePrice}
                  disabled={isCalculating}
                  className="w-full h-14 btn-primary text-primary-foreground font-bold rounded-xl btn-shine flex items-center justify-center gap-2 disabled:opacity-50 text-base"
                >
                  {isCalculating ? (
                    <>
                      <IconLoader className="w-5 h-5 animate-spin" />
                      Считаем...
                    </>
                  ) : (
                    <>
                      Рассчитать стоимость
                      <IconArrow className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Result */}
              <div className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border">
                {estimatedPrice ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <p className="text-muted-foreground text-sm mb-2">Примерная стоимость</p>
                    <div className="text-4xl lg:text-5xl font-black text-foreground mb-2">
                      {estimatedPrice.toLocaleString()}<span className="text-xl text-primary"> руб.</span>
                    </div>
                    
                    {/* Delivery time */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm mb-4">
                      <IconClock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {deliveryType === 'express' ? '1-2 дня' : '3-5 дней'}
                      </span>
                    </div>

                    {/* Important notice */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-6 text-left">
                      <div className="flex gap-2">
                        <IconInfo className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                          <strong>Примерный расчёт.</strong> Окончательную стоимость доставки уточняйте у менеджера после оформления заявки.
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowContactModal(true)}
                      className="w-full py-4 btn-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      Оформить заявку
                      <IconArrow className="w-5 h-5" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <Image
                        src="/hero-bg.webp"
                        alt="Доставка"
                        fill
                        className="object-cover rounded-2xl opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconPackage className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6">Заполни форму для расчёта стоимости</p>
                    
                    <div className="space-y-3 text-left">
                      {[
                        { icon: IconBolt, text: "Расчёт за минуту" },
                        { icon: IconTruck, text: "14 регионов РФ" },
                        { icon: IconShield, text: "Страхование груза" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm text-foreground font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
        estimatedPrice={estimatedPrice}
      />
    </section>
  )
}
