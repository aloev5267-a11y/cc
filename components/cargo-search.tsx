"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { IconMapPin, IconPackage, IconArrow, IconClock, IconClose } from "./icons"

// Иконка ракеты (для срочных заказов)
const IconRocket = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Иконка шеврона вниз
const IconChevronDown = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Города и их районы (реальная география работы)
const cities = [
  {
    id: "moscow",
    name: "Москва и МО",
    districts: ["Центр", "Северный", "Северо-Восточный", "Восточный", "Юго-Восточный", "Южный", "Юго-Западный", "Западный", "Северо-Западный", "Зеленоград", "Новая Москва"]
  },
  {
    id: "ivanovo",
    name: "Ивановская область",
    districts: ["Иваново", "Кинешма", "Шуя", "Вичуга", "Фурманов", "Тейково", "Родники"]
  },
  {
    id: "voronezh",
    name: "Воронежская область",
    districts: ["Воронеж", "Борисоглебск", "Россошь", "Лиски", "Острогожск", "Нововоронеж"]
  },
  {
    id: "tver",
    name: "Тверская область",
    districts: ["Тверь", "Ржев", "Вышний Волочёк", "Кимры", "Торжок", "Конаково"]
  },
  {
    id: "nn",
    name: "Нижегородская область",
    districts: ["Нижний Новгород", "Дзержинск", "Арзамас", "Саров", "Бор", "Кстово", "Выкса"]
  },
  {
    id: "novgorod",
    name: "Новгородская область",
    districts: ["Великий Новгород", "Боровичи", "Старая Русса", "Валдай", "Чудово"]
  },
  {
    id: "yaroslavl",
    name: "Ярославская область",
    districts: ["Ярославль", "Рыбинск", "Переславль-Залесский", "Тутаев", "Углич", "Ростов"]
  },
  {
    id: "vladimir",
    name: "Владимирская область",
    districts: ["Владимир", "Ковров", "Муром", "Александров", "Гусь-Хрустальный", "Кольчугино"]
  },
  {
    id: "krasnodar",
    name: "Краснодарский край",
    districts: ["Краснодар", "Сочи", "Новороссийск", "Армавир", "Ейск", "Анапа", "Геленджик"]
  },
  {
    id: "ufa",
    name: "Башкортостан, Уфа",
    districts: ["Уфа", "Стерлитамак", "Салават", "Нефтекамск", "Октябрьский", "Белорецк"]
  },
  {
    id: "ekb",
    name: "Свердловская область",
    districts: ["Екатеринбург", "Нижний Тагил", "Каменск-Уральский", "Первоуральск", "Серов", "Новоуральск"]
  },
  {
    id: "tula",
    name: "Тульская область",
    districts: ["Тула", "Новомосковск", "Донской", "Алексин", "Щёкино", "Узловая"]
  },
  {
    id: "ryazan",
    name: "Рязанская область",
    districts: ["Рязань", "Касимов", "Скопин", "Сасово", "Ряжск", "Михайлов"]
  },
  {
    id: "chelyabinsk",
    name: "Челябинск",
    districts: ["Центр", "Металлургический", "Ленинский", "Курчатовский", "Калининский", "Советский", "Тракторозаводский"]
  }
]

// Статические заказы по городам (без Math.random для избежания hydration mismatch)
const staticOrders: Record<string, Array<{
  id: string
  from: string
  to: string
  city: string
  weight: string
  price: number
  deadline: string
  urgent: boolean
  distance: string
}>> = {
  moscow: [
    { id: "moscow-1", from: "Центр", to: "Северный", city: "Москва и МО", weight: "2 кг", price: 750, deadline: "1 час", urgent: true, distance: "12 км" },
    { id: "moscow-2", from: "Восточный", to: "Южный", city: "Москва и МО", weight: "1 кг", price: 550, deadline: "2 часа", urgent: false, distance: "8 км" },
    { id: "moscow-3", from: "Западный", to: "Центр", city: "Москва и МО", weight: "3 кг", price: 850, deadline: "30 мин", urgent: true, distance: "6 км" },
    { id: "moscow-4", from: "Зеленоград", to: "Северо-Западный", city: "Москва и МО", weight: "5 кг", price: 1250, deadline: "Сегодня", urgent: false, distance: "18 км" },
    { id: "moscow-5", from: "Новая Москва", to: "Юго-Западный", city: "Москва и МО", weight: "0.5 кг", price: 450, deadline: "1 час", urgent: false, distance: "15 км" },
    { id: "moscow-6", from: "Северо-Восточный", to: "Юго-Восточный", city: "Москва и МО", weight: "2 кг", price: 650, deadline: "2 часа", urgent: true, distance: "10 км" },
  ],
  ivanovo: [
    { id: "ivanovo-1", from: "Иваново", to: "Кинешма", city: "Ивановская область", weight: "3 кг", price: 950, deadline: "Сегодня", urgent: false, distance: "95 км" },
    { id: "ivanovo-2", from: "Шуя", to: "Иваново", city: "Ивановская область", weight: "1 кг", price: 450, deadline: "2 часа", urgent: true, distance: "32 км" },
    { id: "ivanovo-3", from: "Вичуга", to: "Фурманов", city: "Ивановская область", weight: "2 кг", price: 550, deadline: "1 час", urgent: false, distance: "45 км" },
    { id: "ivanovo-4", from: "Тейково", to: "Иваново", city: "Ивановская область", weight: "5 кг", price: 750, deadline: "30 мин", urgent: true, distance: "28 км" },
    { id: "ivanovo-5", from: "Родники", to: "Кинешма", city: "Ивановская область", weight: "0.5 кг", price: 650, deadline: "Сегодня", urgent: false, distance: "55 км" },
    { id: "ivanovo-6", from: "Иваново", to: "Шуя", city: "Ивановская область", weight: "2 кг", price: 450, deadline: "1 час", urgent: false, distance: "32 км" },
  ],
  voronezh: [
    { id: "voronezh-1", from: "Воронеж", to: "Борисоглебск", city: "Воронежская область", weight: "2 кг", price: 1100, deadline: "Сегодня", urgent: false, distance: "210 км" },
    { id: "voronezh-2", from: "Россошь", to: "Воронеж", city: "Воронежская область", weight: "1 кг", price: 850, deadline: "2 часа", urgent: true, distance: "165 км" },
    { id: "voronezh-3", from: "Лиски", to: "Острогожск", city: "Воронежская область", weight: "3 кг", price: 550, deadline: "1 час", urgent: false, distance: "35 км" },
    { id: "voronezh-4", from: "Нововоронеж", to: "Воронеж", city: "Воронежская область", weight: "5 кг", price: 650, deadline: "30 мин", urgent: true, distance: "45 км" },
    { id: "voronezh-5", from: "Воронеж", to: "Лиски", city: "Воронежская область", weight: "0.5 кг", price: 450, deadline: "Сегодня", urgent: false, distance: "95 км" },
    { id: "voronezh-6", from: "Борисоглебск", to: "Россошь", city: "Воронежская область", weight: "2 кг", price: 950, deadline: "1 час", urgent: false, distance: "180 км" },
  ],
  tver: [
    { id: "tver-1", from: "Тверь", to: "Ржев", city: "Тверская область", weight: "2 кг", price: 750, deadline: "Сегодня", urgent: false, distance: "130 км" },
    { id: "tver-2", from: "Вышний Волочёк", to: "Тверь", city: "Тверская область", weight: "1 кг", price: 650, deadline: "2 часа", urgent: true, distance: "120 км" },
    { id: "tver-3", from: "Кимры", to: "Конаково", city: "Тверская область", weight: "3 кг", price: 550, deadline: "1 час", urgent: false, distance: "45 км" },
    { id: "tver-4", from: "Торжок", to: "Тверь", city: "Тверская область", weight: "5 кг", price: 450, deadline: "30 мин", urgent: true, distance: "60 км" },
    { id: "tver-5", from: "Тверь", to: "Кимры", city: "Тверская область", weight: "0.5 кг", price: 550, deadline: "Сегодня", urgent: false, distance: "85 км" },
    { id: "tver-6", from: "Конаково", to: "Тверь", city: "Тверская область", weight: "2 кг", price: 450, deadline: "1 час", urgent: false, distance: "75 км" },
  ],
  nn: [
    { id: "nn-1", from: "Нижний Новгород", to: "Дзержинск", city: "Нижегородская область", weight: "2 кг", price: 450, deadline: "30 мин", urgent: true, distance: "35 км" },
    { id: "nn-2", from: "Арзамас", to: "Нижний Новгород", city: "Нижегородская область", weight: "1 кг", price: 850, deadline: "Сегодня", urgent: false, distance: "110 км" },
    { id: "nn-3", from: "Саров", to: "Арзамас", city: "Нижегородская область", weight: "3 кг", price: 550, deadline: "1 час", urgent: false, distance: "75 км" },
    { id: "nn-4", from: "Бор", to: "Нижний Новгород", city: "Нижегородская область", weight: "5 кг", price: 450, deadline: "30 мин", urgent: true, distance: "12 км" },
    { id: "nn-5", from: "Кстово", to: "Выкса", city: "Нижегородская область", weight: "0.5 кг", price: 950, deadline: "Сегодня", urgent: false, distance: "140 км" },
    { id: "nn-6", from: "Нижний Новгород", to: "Кстово", city: "Нижегородская область", weight: "2 кг", price: 450, deadline: "1 час", urgent: false, distance: "25 км" },
  ],
  novgorod: [
    { id: "novgorod-1", from: "Великий Новгород", to: "Боровичи", city: "Новгородская область", weight: "2 кг", price: 750, deadline: "Сегодня", urgent: false, distance: "190 км" },
    { id: "novgorod-2", from: "Старая Русса", to: "Великий Новгород", city: "Новгородская область", weight: "1 кг", price: 550, deadline: "2 часа", urgent: true, distance: "95 км" },
    { id: "novgorod-3", from: "Валдай", to: "Боровичи", city: "Новгородская область", weight: "3 кг", price: 650, deadline: "1 час", urgent: false, distance: "85 км" },
    { id: "novgorod-4", from: "Чудово", to: "Великий Новгород", city: "Новгородская область", weight: "5 кг", price: 550, deadline: "30 мин", urgent: true, distance: "70 км" },
    { id: "novgorod-5", from: "Великий Новгород", to: "Валдай", city: "Новгородская область", weight: "0.5 кг", price: 650, deadline: "Сегодня", urgent: false, distance: "140 км" },
    { id: "novgorod-6", from: "Боровичи", to: "Старая Русса", city: "Новгородская область", weight: "2 кг", price: 850, deadline: "1 час", urgent: false, distance: "180 км" },
  ],
  yaroslavl: [
    { id: "yaroslavl-1", from: "Ярославль", to: "Рыбинск", city: "Ярославская область", weight: "2 кг", price: 650, deadline: "1 час", urgent: true, distance: "85 км" },
    { id: "yaroslavl-2", from: "Переславль-Залесский", to: "Ярославль", city: "Ярославская область", weight: "1 кг", price: 750, deadline: "2 часа", urgent: false, distance: "120 км" },
    { id: "yaroslavl-3", from: "Тутаев", to: "Рыбинск", city: "Ярославская область", weight: "3 кг", price: 450, deadline: "30 мин", urgent: true, distance: "45 км" },
    { id: "yaroslavl-4", from: "Углич", to: "Ярославль", city: "Ярославская область", weight: "5 кг", price: 850, deadline: "Сегодня", urgent: false, distance: "110 км" },
    { id: "yaroslavl-5", from: "Ростов", to: "Переславль-Залесский", city: "Ярославская область", weight: "0.5 кг", price: 450, deadline: "1 час", urgent: false, distance: "65 км" },
    { id: "yaroslavl-6", from: "Ярославль", to: "Углич", city: "Ярославская область", weight: "2 кг", price: 750, deadline: "2 часа", urgent: false, distance: "110 км" },
  ],
  vladimir: [
    { id: "vladimir-1", from: "Владимир", to: "Ковров", city: "Владимирская область", weight: "2 кг", price: 550, deadline: "1 час", urgent: true, distance: "65 км" },
    { id: "vladimir-2", from: "Муром", to: "Владимир", city: "Владимирская область", weight: "1 кг", price: 850, deadline: "Сегодня", urgent: false, distance: "135 км" },
    { id: "vladimir-3", from: "Александров", to: "Владимир", city: "Владимирская область", weight: "3 кг", price: 650, deadline: "2 часа", urgent: false, distance: "120 км" },
    { id: "vladimir-4", from: "Гусь-Хрустальный", to: "Ковров", city: "Владимирская область", weight: "5 кг", price: 750, deadline: "30 мин", urgent: true, distance: "70 км" },
    { id: "vladimir-5", from: "Кольчугино", to: "Александров", city: "Владимирская область", weight: "0.5 кг", price: 450, deadline: "1 час", urgent: false, distance: "40 км" },
    { id: "vladimir-6", from: "Владимир", to: "Муром", city: "Владимирская область", weight: "2 кг", price: 850, deadline: "Сегодня", urgent: false, distance: "135 км" },
  ],
  krasnodar: [
    { id: "krasnodar-1", from: "Краснодар", to: "Сочи", city: "Краснодарский край", weight: "2 кг", price: 1250, deadline: "Сегодня", urgent: false, distance: "290 км" },
    { id: "krasnodar-2", from: "Новороссийск", to: "Краснодар", city: "Краснодарский край", weight: "1 кг", price: 850, deadline: "2 часа", urgent: true, distance: "150 км" },
    { id: "krasnodar-3", from: "Армавир", to: "Краснодар", city: "Краснодарский край", weight: "3 кг", price: 750, deadline: "1 час", urgent: false, distance: "200 км" },
    { id: "krasnodar-4", from: "Ейск", to: "Краснодар", city: "Краснодарский край", weight: "5 кг", price: 950, deadline: "Сегодня", urgent: false, distance: "250 км" },
    { id: "krasnodar-5", from: "Анапа", to: "Геленджик", city: "Краснодарский край", weight: "0.5 кг", price: 550, deadline: "30 мин", urgent: true, distance: "85 км" },
    { id: "krasnodar-6", from: "Сочи", to: "Геленджик", city: "Краснодарский край", weight: "2 кг", price: 1100, deadline: "1 час", urgent: false, distance: "180 км" },
  ],
  ufa: [
    { id: "ufa-1", from: "Уфа", to: "Стерлитамак", city: "Башкортостан, Уфа", weight: "2 кг", price: 750, deadline: "1 час", urgent: true, distance: "130 км" },
    { id: "ufa-2", from: "Салават", to: "Уфа", city: "Башкортостан, Уфа", weight: "1 кг", price: 850, deadline: "2 часа", urgent: false, distance: "160 км" },
    { id: "ufa-3", from: "Нефтекамск", to: "Уфа", city: "Башкортостан, Уфа", weight: "3 кг", price: 950, deadline: "Сегодня", urgent: false, distance: "220 км" },
    { id: "ufa-4", from: "Октябрьский", to: "Стерлитамак", city: "Башкортостан, Уфа", weight: "5 кг", price: 650, deadline: "30 мин", urgent: true, distance: "85 км" },
    { id: "ufa-5", from: "Белорецк", to: "Уфа", city: "Башкортостан, Уфа", weight: "0.5 кг", price: 1100, deadline: "Сегодня", urgent: false, distance: "260 км" },
    { id: "ufa-6", from: "Уфа", to: "Нефтекамск", city: "Башкортостан, Уфа", weight: "2 кг", price: 950, deadline: "1 час", urgent: false, distance: "220 км" },
  ],
  ekb: [
    { id: "ekb-1", from: "Екатеринбург", to: "Нижний Тагил", city: "Свердловская область", weight: "2 кг", price: 850, deadline: "1 час", urgent: true, distance: "140 км" },
    { id: "ekb-2", from: "Каменск-Уральский", to: "Екатеринбург", city: "Свердловская область", weight: "1 кг", price: 650, deadline: "2 часа", urgent: false, distance: "100 км" },
    { id: "ekb-3", from: "Первоуральск", to: "Екатеринбург", city: "Свердловская область", weight: "3 кг", price: 450, deadline: "30 мин", urgent: true, distance: "40 км" },
    { id: "ekb-4", from: "Серов", to: "Нижний Тагил", city: "Свердловская область", weight: "5 кг", price: 750, deadline: "Сегодня", urgent: false, distance: "180 км" },
    { id: "ekb-5", from: "Новоуральск", to: "Екатеринбург", city: "Свердловская область", weight: "0.5 кг", price: 450, deadline: "1 час", urgent: false, distance: "70 км" },
    { id: "ekb-6", from: "Екатеринбург", to: "Серов", city: "Свердловская область", weight: "2 кг", price: 1100, deadline: "Сегодня", urgent: false, distance: "340 км" },
  ],
  tula: [
    { id: "tula-1", from: "Тула", to: "Новомосковск", city: "Тульская область", weight: "2 кг", price: 550, deadline: "1 час", urgent: true, distance: "60 км" },
    { id: "tula-2", from: "Донской", to: "Тула", city: "Тульская область", weight: "1 кг", price: 650, deadline: "2 часа", urgent: false, distance: "65 км" },
    { id: "tula-3", from: "Алексин", to: "Тула", city: "Тульская область", weight: "3 кг", price: 450, deadline: "30 мин", urgent: true, distance: "55 км" },
    { id: "tula-4", from: "Щёкино", to: "Новомосковск", city: "Тульская область", weight: "5 кг", price: 550, deadline: "1 час", urgent: false, distance: "45 км" },
    { id: "tula-5", from: "Узловая", to: "Тула", city: "Тульская область", weight: "0.5 кг", price: 550, deadline: "Сегодня", urgent: false, distance: "75 км" },
    { id: "tula-6", from: "Тула", to: "Алексин", city: "Тульская область", weight: "2 кг", price: 450, deadline: "2 часа", urgent: false, distance: "55 км" },
  ],
  ryazan: [
    { id: "ryazan-1", from: "Рязань", to: "Касимов", city: "Рязанская область", weight: "2 кг", price: 850, deadline: "Сегодня", urgent: false, distance: "165 км" },
    { id: "ryazan-2", from: "Скопин", to: "Рязань", city: "Рязанская область", weight: "1 кг", price: 650, deadline: "2 часа", urgent: true, distance: "100 км" },
    { id: "ryazan-3", from: "Сасово", to: "Рязань", city: "Рязанская область", weight: "3 кг", price: 750, deadline: "1 час", urgent: false, distance: "180 км" },
    { id: "ryazan-4", from: "Ряжск", to: "Скопин", city: "Рязанская область", weight: "5 кг", price: 450, deadline: "30 мин", urgent: true, distance: "45 км" },
    { id: "ryazan-5", from: "Михайлов", to: "Рязань", city: "Рязанская область", weight: "0.5 кг", price: 450, deadline: "1 час", urgent: false, distance: "70 км" },
    { id: "ryazan-6", from: "Рязань", to: "Сасово", city: "Рязанская область", weight: "2 кг", price: 750, deadline: "Сегодня", urgent: false, distance: "180 км" },
  ],
  chelyabinsk: [
    { id: "chelyabinsk-1", from: "Центр", to: "Металлургический", city: "Челябинск", weight: "2 кг", price: 450, deadline: "30 мин", urgent: true, distance: "12 км" },
    { id: "chelyabinsk-2", from: "Ленинский", to: "Центр", city: "Челябинск", weight: "1 кг", price: 450, deadline: "1 час", urgent: false, distance: "8 км" },
    { id: "chelyabinsk-3", from: "Курчатовский", to: "Калининский", city: "Челябинск", weight: "3 кг", price: 550, deadline: "2 часа", urgent: false, distance: "15 км" },
    { id: "chelyabinsk-4", from: "Советский", to: "Центр", city: "Челябинск", weight: "5 кг", price: 650, deadline: "30 мин", urgent: true, distance: "10 км" },
    { id: "chelyabinsk-5", from: "Тракторозаводский", to: "Ленинский", city: "Челябинск", weight: "0.5 кг", price: 450, deadline: "1 час", urgent: false, distance: "14 км" },
    { id: "chelyabinsk-6", from: "Металлургический", to: "Курчатовский", city: "Челябинск", weight: "2 кг", price: 550, deadline: "Сегодня", urgent: false, distance: "18 км" },
  ],
}

// Заказы по городу - теперь возвращает статические данные
const getOrdersForCity = (cityId: string) => {
  return staticOrders[cityId] || staticOrders.moscow
}

// Модальное окно для перехода на вакансии
function JobModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border p-6 z-50"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Закрыть"
            >
              <IconClose className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IconRocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Хотите работать с нами?</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Присоединяйтесь к команде КурьерХаб! Гибкий график, стабильный заработок и ежедневные выплаты.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/vacancies"
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  Перейти к вакансиям
                  <IconArrow className="w-4 h-4" />
                </Link>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function CargoSearch() {
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [showJobModal, setShowJobModal] = useState(false)
  const [displayCount, setDisplayCount] = useState(6)
  const [allOrders, setAllOrders] = useState(() => getOrdersForCity(cities[0].id))

  const handleCityChange = (city: typeof cities[0]) => {
    setSelectedCity(city)
    setAllOrders(getOrdersForCity(city.id))
    setDisplayCount(6)
    setCityDropdownOpen(false)
  }

  const handleShowMore = () => {
    // Добавляем еще заказов
    const moreOrders = getOrdersForCity(selectedCity.id)
    setAllOrders(prev => [...prev, ...moreOrders])
    setDisplayCount(prev => prev + 6)
  }

  const displayedOrders = allOrders.slice(0, displayCount)

  return (
    <section id="cargo" className="relative py-16 md:py-20 lg:py-28 bg-muted/30">
      <div className="absolute inset-0 dot-pattern" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-primary/10 rounded-full text-xs sm:text-sm font-semibold text-primary mb-4">
            Доставка по городу
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-foreground mb-3 md:mb-4">
            Найди заказ под себя
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Доставка от района до района. Выбери город и начни зарабатывать.
          </p>
        </motion.div>

        {/* City selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="w-full p-4 card-elevated rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IconMapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Город</div>
                  <div className="font-bold text-foreground">{selectedCity.name}</div>
                </div>
              </div>
              <IconChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {cityDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-20"
                >
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCityChange(city)}
                      className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between ${
                        selectedCity.id === city.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <span className="font-medium">{city.name}</span>
                      {selectedCity.id === city.id && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between max-w-6xl mx-auto mb-5">
          <p className="text-muted-foreground text-sm">
            Заказы в <span className="text-foreground font-bold">{selectedCity.name}</span>: <span className="text-primary font-bold">{allOrders.length}+</span>
          </p>
        </div>

        {/* Cargo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {displayedOrders.map((order, index) => (
            <motion.div
              key={`${order.id}-${index}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (index % 6) * 0.05 }}
              className="group card-elevated p-5 rounded-xl cursor-pointer relative"
            >
              {/* Urgent badge */}
              {order.urgent && (
                <div className="absolute -top-2 -right-2 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                  <IconRocket className="w-3 h-3" />
                  Срочно
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <IconClock className="w-3.5 h-3.5" />
                  {order.deadline}
                </div>
                <div className="text-xl font-black text-primary">
                  {order.price}<span className="text-sm"> руб.</span>
                </div>
              </div>

              {/* Route */}
              <div className="flex gap-3 mb-4">
                <div className="flex flex-col items-center py-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-muted-foreground" />
                  <div className="w-0.5 h-8 bg-gradient-to-b from-muted-foreground to-primary" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{order.from}</p>
                  <p className="text-xs text-muted-foreground mb-2">{order.distance}</p>
                  <p className="font-semibold text-foreground text-sm">{order.to}</p>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                <span className="flex items-center gap-1">
                  <IconPackage className="w-3.5 h-3.5" />
                  {order.weight}
                </span>
                <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                  {order.city}
                </span>
              </div>

              {/* CTA */}
              <button 
                onClick={() => setShowJobModal(true)}
                className="w-full py-2.5 bg-muted text-foreground font-semibold rounded-lg flex items-center justify-center gap-2 text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Взять заказ
                <IconArrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <button 
            onClick={handleShowMore}
            className="px-6 py-3 bg-card border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary/50 hover:shadow-lg transition-all text-sm"
          >
            Показать ещё 50+ заказов
          </button>
        </motion.div>
      </div>

      {/* Job Modal */}
      <JobModal isOpen={showJobModal} onClose={() => setShowJobModal(false)} />
    </section>
  )
}
