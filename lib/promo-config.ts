// Конфигурация промо-страниц вакансий
// Каждая роль = отдельная промо-страница с опросником и переходом в мессенджеры

export type PromoQuizOption = {
  label: string
  value: string
}

export type PromoQuizQuestion = {
  id: string
  question: string
  // Короткая подпись для сводки/сообщения (например, "Город", "Транспорт")
  summaryLabel: string
  // Тип вопроса: выбор из вариантов, свободный ввод (город) или возраст с порогом
  type?: "select" | "input" | "age"
  options?: PromoQuizOption[]
  // Для type: "input" и "age"
  placeholder?: string
  suggestions?: string[]
  // Для type: "age" — допустимый диапазон (включительно)
  minAge?: number
  maxAge?: number
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

export const promoRoles: Record<PromoRoleKey, PromoRole> = {
  courier: {
    key: "courier",
    href: "/promo/courier",
    image: "/promo/courier-hero.png",
    imageAlt: "Курьер КурьерХаб на электросамокате в городе на закате",
    badge: "Набор открыт",
    title: "Курьер",
    subtitle: "Доставляй заказы и забирай деньги каждый день",
    earn: "от 10 000 ₽",
    earnNote: "в день",
    benefits: [
      "Выплаты каждый день",
      "Свободный график",
      "Старт за 1 день",
      "Пешком, на велосипеде или авто",
    ],
    stats: [
      { value: "1 день", label: "до первого заказа" },
      { value: "300 000 ₽", label: "доход в месяц" },
      { value: "14", label: "регионов" },
    ],
    quiz: [
      {
        id: "age",
        question: "Сколько тебе лет?",
        summaryLabel: "Возраст",
        type: "age",
        placeholder: "Введи свой возраст",
        minAge: 18,
        maxAge: 40,
      },
      {
        id: "city",
        question: "Из какого ты города?",
        summaryLabel: "Город",
        type: "input",
        placeholder: "Введи свой город",
        suggestions: ["Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск", "Казань"],
      },
      {
        id: "transport",
        question: "На чём планируешь работать?",
        summaryLabel: "Транспорт",
        type: "select",
        options: [
          { label: "Пешком", value: "Пешком" },
          { label: "Велосипед / самокат", value: "Велосипед / самокат" },
          { label: "Автомобиль", value: "Автомобиль" },
        ],
      },
      {
        id: "hours",
        question: "Сколько часов готов уделять в день?",
        summaryLabel: "Занятость",
        type: "select",
        options: [
          { label: "2–4 часа", value: "2–4 часа" },
          { label: "4–8 часов", value: "4–8 часов" },
          { label: "8+ часов", value: "8+ часов" },
        ],
      },
      {
        id: "start",
        question: "Когда хочешь начать?",
        summaryLabel: "Старт",
        type: "select",
        options: [
          { label: "Сегодня", value: "Сегодня" },
          { label: "На этой неделе", value: "На этой неделе" },
          { label: "Присматриваюсь", value: "Присматриваюсь" },
        ],
      },
    ],
    matchTitle: "Тебе подходит вакансия курьера!",
    matchText: "Напиши нам в мессенджер — оформим за 5 минут и дадим первый заказ уже завтра.",
    messageIntro: "Здравствуйте! Хочу работать курьером в КурьерХаб.",
  },
  warehouse: {
    key: "warehouse",
    href: "/promo/warehouse",
    image: "/promo/warehouse-hero.png",
    imageAlt: "Сотрудник склада КурьерХаб сканирует посылку в современном складском комплексе",
    badge: "Нужны люди на склад",
    title: "Сотрудник склада",
    subtitle: "Стабильная работа в тепле с понятными задачами",
    earn: "до 80 000 ₽",
    earnNote: "в месяц",
    benefits: [
      "Официальное оформление",
      "Сменный график 2/2",
      "Аванс и стабильный оклад",
      "Обучение с первого дня",
    ],
    stats: [
      { value: "2/2", label: "удобный график" },
      { value: "80 000 ₽", label: "оклад в месяц" },
      { value: "0 ₽", label: "вложений" },
    ],
    quiz: [
      {
        id: "age",
        question: "Сколько тебе лет?",
        summaryLabel: "Возраст",
        type: "age",
        placeholder: "Введи свой возраст",
        minAge: 18,
        maxAge: 40,
      },
      {
        id: "city",
        question: "Из какого ты города?",
        summaryLabel: "Город",
        type: "input",
        placeholder: "Введи свой город",
        suggestions: ["Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск", "Казань"],
      },
      {
        id: "schedule",
        question: "Какой график тебе удобнее?",
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
          { label: "Нет, готов учиться", value: "Без опыта" },
        ],
      },
      {
        id: "start",
        question: "Когда готов выйти?",
        summaryLabel: "Старт",
        type: "select",
        options: [
          { label: "Сразу", value: "Сразу" },
          { label: "На этой неделе", value: "На неделе" },
          { label: "Присматриваюсь", value: "Думаю" },
        ],
      },
    ],
    matchTitle: "Тебе подходит работа на складе!",
    matchText: "Напиши нам в мессенджер — расскажем про смены и оформим официально.",
    messageIntro: "Здравствуйте! Хочу работать на складе в КурьерХаб.",
  },
  driver: {
    key: "driver",
    href: "/promo/driver",
    image: "/promo/driver-hero.png",
    imageAlt: "Перевозчик КурьерХаб с посылкой рядом с фургоном на закате",
    badge: "Ищем водителей с авто",
    title: "Перевозчик на авто",
    subtitle: "Свой автомобиль? Превращай его в стабильный доход",
    earn: "до 150 000 ₽",
    earnNote: "в месяц",
    benefits: [
      "Оплата топлива и пробега",
      "Постоянный поток заказов",
      "Гибкий график и маршруты",
      "Еженедельные выплаты",
    ],
    stats: [
      { value: "150 000 ₽", label: "доход в месяц" },
      { value: "7 дней", label: "выплаты раз в неделю" },
      { value: "24/7", label: "поток заказов" },
    ],
    quiz: [
      {
        id: "age",
        question: "Сколько тебе лет?",
        summaryLabel: "Возраст",
        type: "age",
        placeholder: "Введи свой возраст",
        minAge: 18,
        maxAge: 40,
      },
      {
        id: "city",
        question: "Из какого ты города?",
        summaryLabel: "Город",
        type: "input",
        placeholder: "Введи свой город",
        suggestions: ["Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск", "Казань"],
      },
      {
        id: "car",
        question: "Какой у тебя автомобиль?",
        summaryLabel: "Авто",
        type: "select",
        options: [
          { label: "Легковой", value: "Легковой" },
          { label: "Каблук / минивэн", value: "Каблук" },
          { label: "Грузовой", value: "Грузовой" },
        ],
      },
      {
        id: "load",
        question: "Сколько готов работать?",
        summaryLabel: "Занятость",
        type: "select",
        options: [
          { label: "Подработка", value: "Подработка" },
          { label: "Полный день", value: "Полный день" },
          { label: "Максимум заказов", value: "Максимум" },
        ],
      },
      {
        id: "start",
        question: "Когда выходишь на линию?",
        summaryLabel: "Старт",
        type: "select",
        options: [
          { label: "Сегодня", value: "Сегодня" },
          { label: "На этой неделе", value: "На неделе" },
          { label: "Присматриваюсь", value: "Думаю" },
        ],
      },
    ],
    matchTitle: "Тебе подходит работа перевозчиком!",
    matchText: "Напиши нам в мессенджер — подключим к заказам и рассчитаем доход под твоё авто.",
    messageIntro: "Здравствуйте! Хочу работать перевозчиком в КурьерХаб.",
  },
}

// Формирует предзаполненное сообщение для мессенджера из ответов опроса
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
