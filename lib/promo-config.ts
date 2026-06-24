// Конфигурация промо-страниц вакансий ElWork (кадровое агентство)
// Каждая роль = отдельная промо-страница с анкетой и переходом в мессенджеры.
// ВАЖНО (для модерации): без завышенных обещаний дохода, без возрастного ценза.
// Доход указывается диапазоном "от работодателя" с дисклеймером.

import { siteConfig } from "./config"

export type PromoQuizOption = {
  label: string
  value: string
}

export type PromoQuizQuestion = {
  id: string
  question: string
  // Короткая подпись для сводки/сообщения (например, "Город", "Опыт")
  summaryLabel: string
  // Тип вопроса: выбор из вариантов или свободный ввод (город)
  type?: "select" | "input"
  options?: PromoQuizOption[]
  // Для type: "input"
  placeholder?: string
  suggestions?: string[]
}

export type PromoRoleKey = "courier" | "warehouse" | "driver"

export type PromoRole = {
  key: PromoRoleKey
  href: string
  image: string
  imageAlt: string
  badge: string
  title: string
  subtitle: string
  // Диапазон дохода (формулировка нейтральная, от работодателя)
  earn: string
  earnNote: string
  benefits: string[]
  stats: { value: string; label: string }[]
  quiz: PromoQuizQuestion[]
  matchTitle: string
  matchText: string
  // Вступительная фраза для предзаполненного сообщения в мессенджер
  messageIntro: string
}

const cityQuestion: PromoQuizQuestion = {
  id: "city",
  question: "В каком городе ищете работу?",
  summaryLabel: "Город",
  type: "input",
  placeholder: "Введите ваш город",
  suggestions: ["Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск", "Казань"],
}

const startQuestion: PromoQuizQuestion = {
  id: "start",
  question: "Когда готовы приступить?",
  summaryLabel: "Старт",
  type: "select",
  options: [
    { label: "В ближайшие дни", value: "В ближайшие дни" },
    { label: "В течение недели", value: "В течение недели" },
    { label: "Пока присматриваюсь", value: "Присматриваюсь" },
  ],
}

export const promoRoles: Record<PromoRoleKey, PromoRole> = {
  courier: {
    key: "courier",
    href: "/promo/courier",
    image: "/promo/courier-hero.png",
    imageAlt: "Курьер с заказом в городе",
    badge: "Открыт набор",
    title: "Курьер",
    subtitle: "Подберём вакансию курьера у проверенного работодателя с удобным графиком",
    earn: "от 60 000 ₽",
    earnNote: "в месяц, по данным работодателей",
    benefits: [
      "Свободный или сменный график",
      "Выплаты от работодателя без задержек",
      "Оформление по ТК РФ или самозанятость",
      "Пешие, вело- и авто-вакансии",
    ],
    stats: [
      { value: "Бесплатно", label: "для соискателя" },
      { value: "1–3 дня", label: "на подбор" },
      { value: "30+", label: "городов" },
    ],
    quiz: [
      cityQuestion,
      {
        id: "transport",
        question: "Как вам удобнее работать?",
        summaryLabel: "Формат",
        type: "select",
        options: [
          { label: "Пешком", value: "Пешком" },
          { label: "Велосипед / самокат", value: "Велосипед / самокат" },
          { label: "Автомобиль", value: "Автомобиль" },
        ],
      },
      {
        id: "hours",
        question: "Какая занятость вам подходит?",
        summaryLabel: "Занятость",
        type: "select",
        options: [
          { label: "Подработка", value: "Подработка" },
          { label: "Частичная занятость", value: "Частичная занятость" },
          { label: "Полная занятость", value: "Полная занятость" },
        ],
      },
      startQuestion,
    ],
    matchTitle: "Отлично, у нас есть подходящие вакансии!",
    matchText: "Напишите нам в мессенджер — специалист подберёт вариант под ваш город и график.",
    messageIntro: `Здравствуйте! Ищу работу курьером через ${siteConfig.name}.`,
  },
  warehouse: {
    key: "warehouse",
    href: "/promo/warehouse",
    image: "/promo/warehouse-hero.png",
    imageAlt: "Сотрудник склада на современном складском комплексе",
    badge: "Есть вакансии на склад",
    title: "Сотрудник склада",
    subtitle: "Стабильная работа на складе с официальным оформлением и понятными задачами",
    earn: "от 55 000 ₽",
    earnNote: "в месяц, по данным работодателей",
    benefits: [
      "Официальное оформление по ТК РФ",
      "Сменный график, в том числе 2/2",
      "Стабильный оклад и аванс",
      "Обучение для новичков",
    ],
    stats: [
      { value: "Бесплатно", label: "для соискателя" },
      { value: "2/2", label: "удобный график" },
      { value: "Без опыта", label: "рассмотрим" },
    ],
    quiz: [
      cityQuestion,
      {
        id: "schedule",
        question: "Какой график вам удобнее?",
        summaryLabel: "График",
        type: "select",
        options: [
          { label: "Дневные смены", value: "День" },
          { label: "Ночные смены", value: "Ночь" },
          { label: "Любой", value: "Любой" },
        ],
      },
      {
        id: "experience",
        question: "Есть опыт работы на складе?",
        summaryLabel: "Опыт",
        type: "select",
        options: [
          { label: "Да, есть", value: "Опыт есть" },
          { label: "Немного", value: "Немного" },
          { label: "Нет, готов(а) учиться", value: "Без опыта" },
        ],
      },
      startQuestion,
    ],
    matchTitle: "Отлично, есть подходящие вакансии на склад!",
    matchText: "Напишите нам в мессенджер — расскажем про смены и условия оформления.",
    messageIntro: `Здравствуйте! Ищу работу на складе через ${siteConfig.name}.`,
  },
  driver: {
    key: "driver",
    href: "/promo/driver",
    image: "/promo/driver-hero.png",
    imageAlt: "Водитель рядом с автомобилем",
    badge: "Нужны водители",
    title: "Водитель",
    subtitle: "Вакансии водителя на личном или служебном авто с гибким графиком",
    earn: "от 80 000 ₽",
    earnNote: "в месяц, по данным работодателей",
    benefits: [
      "Вакансии на личном и служебном авто",
      "Компенсация топлива у ряда работодателей",
      "Гибкий график и маршруты",
      "Регулярные выплаты",
    ],
    stats: [
      { value: "Бесплатно", label: "для соискателя" },
      { value: "Гибкий", label: "график" },
      { value: "30+", label: "городов" },
    ],
    quiz: [
      cityQuestion,
      {
        id: "car",
        question: "На каком авто планируете работать?",
        summaryLabel: "Авто",
        type: "select",
        options: [
          { label: "Личный легковой", value: "Личный легковой" },
          { label: "Личный грузовой / каблук", value: "Грузовой / каблук" },
          { label: "Нужно служебное", value: "Служебное" },
        ],
      },
      {
        id: "load",
        question: "Какая занятость вам подходит?",
        summaryLabel: "Занятость",
        type: "select",
        options: [
          { label: "Подработка", value: "Подработка" },
          { label: "Полный день", value: "Полный день" },
          { label: "Максимальная загрузка", value: "Максимальная" },
        ],
      },
      startQuestion,
    ],
    matchTitle: "Отлично, есть подходящие вакансии для водителей!",
    matchText: "Напишите нам в мессенджер — подберём вариант под ваш город и тип авто.",
    messageIntro: `Здравствуйте! Ищу работу водителем через ${siteConfig.name}.`,
  },
}

// Формирует предзаполненное сообщение для мессенджера из ответов анкеты
export function buildLeadMessage(role: PromoRole, answers: Record<string, string>): string {
  const lines = [role.messageIntro]
  for (const q of role.quiz) {
    const value = answers[q.id]
    if (value) lines.push(`${q.summaryLabel}: ${value}`)
  }
  return lines.join("\n")
}

// Порядок ротации промо-страниц (для блока «не подошла вакансия»)
export const promoOrder: PromoRoleKey[] = ["courier", "warehouse", "driver"]

// Получить две другие роли для блока «выбери другую вакансию»
export function getOtherRoles(current: PromoRoleKey): PromoRole[] {
  return promoOrder.filter((k) => k !== current).map((k) => promoRoles[k])
}
