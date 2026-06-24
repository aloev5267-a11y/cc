// Каталог вакансий ElWork — единый источник данных для главной (категории)
// и страницы /vacancies (карточки + квиз). Карточки генерируются детерминированно
// (без Math.random), чтобы не было расхождений между сервером и клиентом.
//
// ВАЖНО (для модерации): доход указываем диапазоном "от работодателя", без завышенных
// обещаний и без возрастного ценза. Компании — реальные средние работодатели, работающие
// в России, плюс несколько международных (отмечены foreign).

import {
  IconPackage,
  IconCar,
  IconUsers,
  IconCalculator,
  IconBriefcase,
  IconHeadphones,
  IconWarehouse,
  IconCode,
} from "@/components/icons"
import { siteConfig } from "./config"

export type QuizOption = { label: string; value: string }

export type QuizQuestion = {
  id: string
  question: string
  summaryLabel: string
  type: "select" | "input"
  options?: QuizOption[]
  placeholder?: string
  suggestions?: string[]
}

export type Employer = {
  name: string
  kind: string
  // Международная компания, работающая в РФ
  foreign?: boolean
}

export type Vacancy = {
  id: string
  categoryKey: CategoryKey
  categoryTitle: string
  title: string
  company: string
  companyKind: string
  foreign: boolean
  city: string
  salary: string
  schedule: string
  employment: string
  description: string
  requirements: string[]
  perks: string[]
  postedLabel: string
}

export type Category = {
  key: CategoryKey
  title: string
  // Для отображения зарплаты на карточке "Популярное"
  salaryHint: string
  icon: typeof IconPackage
  // Сколько вакансий показываем (реалистично, до 50)
  count: number
  // Для матчинга с поиском
  searchTerms: string[]
  roleVariants: string[]
  employers: Employer[]
  cities: string[]
  // Зарплатные вилки (нижняя/верхняя граница в тыс. ₽), берём по индексу
  salaryBands: [number, number][]
  schedules: string[]
  employments: string[]
  requirements: string[]
  perks: string[]
  quiz: QuizQuestion[]
}

export type CategoryKey =
  | "courier"
  | "driver"
  | "seller"
  | "cashier"
  | "manager"
  | "operator"
  | "warehouse"
  | "remote"

// Часто используемые города (по убыванию населения), общий пул
const RU_CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Краснодар",
  "Ростов-на-Дону",
]

// Общие вопросы анкеты
const cityQuestion: QuizQuestion = {
  id: "city",
  question: "В каком городе ищете работу?",
  summaryLabel: "Город",
  type: "input",
  placeholder: "Введите ваш город",
  suggestions: RU_CITIES.slice(0, 6),
}

const startQuestion: QuizQuestion = {
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

const experienceQuestion: QuizQuestion = {
  id: "experience",
  question: "Какой у вас опыт?",
  summaryLabel: "Опыт",
  type: "select",
  options: [
    { label: "Без опыта", value: "Без опыта" },
    { label: "До 1 года", value: "До 1 года" },
    { label: "1–3 года", value: "1–3 года" },
    { label: "Более 3 лет", value: "Более 3 лет" },
  ],
}

const employmentQuestion: QuizQuestion = {
  id: "employment",
  question: "Какая занятость вам подходит?",
  summaryLabel: "Занятость",
  type: "select",
  options: [
    { label: "Подработка", value: "Подработка" },
    { label: "Частичная занятость", value: "Частичная занятость" },
    { label: "Полная занятость", value: "Полная занятость" },
  ],
}

export const categories: Category[] = [
  {
    key: "courier",
    title: "Курьер",
    salaryHint: "от 70 000 ₽",
    icon: IconPackage,
    count: 42,
    searchTerms: ["курьер", "доставка", "велокурьер", "пеший", "доставщик"],
    roleVariants: ["Пеший курьер", "Велокурьер", "Курьер на авто", "Курьер-сборщик", "Курьер на самокате"],
    employers: [
      { name: "Самокат", kind: "Сервис быстрой доставки" },
      { name: "ВкусВилл", kind: "Сеть продуктовых магазинов" },
      { name: "Купер", kind: "Сервис доставки продуктов" },
      { name: "Достависта", kind: "Сервис курьерской доставки" },
      { name: "СДЭК", kind: "Логистическая компания" },
      { name: "Boxberry", kind: "Служба доставки" },
      { name: "Wolt", kind: "Сервис доставки", foreign: true },
    ],
    cities: RU_CITIES,
    salaryBands: [[70, 110], [80, 130], [60, 95], [90, 150]],
    schedules: ["Свободный график", "Сменный график 2/2", "Гибкий график"],
    employments: ["Подработка", "Частичная занятость", "Полная занятость"],
    requirements: [
      "Гражданство РФ или разрешение на работу",
      "Смартфон на Android или iOS",
      "Знание города или навигатор",
      "Ответственность и пунктуальность",
    ],
    perks: [
      "Ежедневные или еженедельные выплаты",
      "Свободный график — сами выбираете смены",
      "Подбор бесплатно для соискателя",
      "Бонусы за количество доставок",
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
      employmentQuestion,
      startQuestion,
    ],
  },
  {
    key: "driver",
    title: "Водитель",
    salaryHint: "от 90 000 ₽",
    icon: IconCar,
    count: 36,
    searchTerms: ["водитель", "шофёр", "дальнобой", "экспедитор", "доставка"],
    roleVariants: ["Водитель-экспедитор", "Водитель категории B", "Водитель грузового авто", "Водитель-курьер", "Персональный водитель"],
    employers: [
      { name: "СДЭК", kind: "Логистическая компания" },
      { name: "ПЭК", kind: "Транспортная компания" },
      { name: "Деловые Линии", kind: "Транспортно-логистическая компания" },
      { name: "Globaltruck", kind: "Грузоперевозки" },
      { name: "Магнит", kind: "Розничная сеть, логистика" },
      { name: "Boxberry", kind: "Служба доставки" },
    ],
    cities: RU_CITIES,
    salaryBands: [[90, 140], [100, 160], [80, 120], [110, 180]],
    schedules: ["Сменный график 5/2", "Вахта 15/15", "Гибкий график"],
    employments: ["Полная занятость", "Вахта", "Частичная занятость"],
    requirements: [
      "Водительское удостоверение нужной категории",
      "Стаж вождения от 1 года",
      "Внимательность на дороге",
      "Готовность к командировкам (по согласованию)",
    ],
    perks: [
      "Служебное авто или компенсация ГСМ",
      "Официальное оформление по ТК РФ",
      "Регулярные выплаты без задержек",
      "Оплата переработок",
    ],
    quiz: [
      cityQuestion,
      {
        id: "category",
        question: "Какая у вас категория прав?",
        summaryLabel: "Категория",
        type: "select",
        options: [
          { label: "B (легковой)", value: "B" },
          { label: "C (грузовой)", value: "C" },
          { label: "B и C", value: "B, C" },
          { label: "E (с прицепом)", value: "E" },
        ],
      },
      {
        id: "car",
        question: "На каком авто планируете работать?",
        summaryLabel: "Авто",
        type: "select",
        options: [
          { label: "Личный автомобиль", value: "Личный" },
          { label: "Нужно служебное", value: "Служебное" },
          { label: "Не имеет значения", value: "Любое" },
        ],
      },
      startQuestion,
    ],
  },
  {
    key: "seller",
    title: "Продавец",
    salaryHint: "от 55 000 ₽",
    icon: IconUsers,
    count: 44,
    searchTerms: ["продавец", "консультант", "продавец-кассир", "торговля", "ритейл"],
    roleVariants: ["Продавец-консультант", "Продавец-кассир", "Старший продавец", "Консультант торгового зала", "Продавец выходного дня"],
    employers: [
      { name: "Магнит", kind: "Розничная сеть" },
      { name: "Пятёрочка", kind: "Продуктовый ритейл" },
      { name: "Лента", kind: "Сеть гипермаркетов" },
      { name: "Спортмастер", kind: "Сеть спортивных товаров" },
      { name: "Л'Этуаль", kind: "Сеть парфюмерии и косметики" },
      { name: "Золотое Яблоко", kind: "Сеть магазинов косметики" },
      { name: "METRO", kind: "Оптовая торговля", foreign: true },
      { name: "Леруа Мерлен", kind: "Гипермаркет товаров для дома", foreign: true },
    ],
    cities: RU_CITIES,
    salaryBands: [[55, 85], [60, 95], [50, 75], [70, 110]],
    schedules: ["Сменный график 2/2", "График 5/2", "Гибкий график"],
    employments: ["Полная занятость", "Частичная занятость", "Подработка"],
    requirements: [
      "Доброжелательность и грамотная речь",
      "Готовность работать с людьми",
      "Опыт в продажах приветствуется",
      "Аккуратность и ответственность",
    ],
    perks: [
      "Оклад + премии за продажи",
      "Официальное оформление по ТК РФ",
      "Скидки для сотрудников",
      "Обучение за счёт работодателя",
    ],
    quiz: [
      cityQuestion,
      experienceQuestion,
      {
        id: "format",
        question: "Какой формат магазина интереснее?",
        summaryLabel: "Формат",
        type: "select",
        options: [
          { label: "Продукты", value: "Продукты" },
          { label: "Одежда / спорт", value: "Одежда / спорт" },
          { label: "Косметика", value: "Косметика" },
          { label: "Не важно", value: "Любой" },
        ],
      },
      startQuestion,
    ],
  },
  {
    key: "cashier",
    title: "Кассир",
    salaryHint: "от 50 000 ₽",
    icon: IconCalculator,
    count: 38,
    searchTerms: ["кассир", "касса", "оператор кассы", "продавец-кассир"],
    roleVariants: ["Кассир", "Кассир-операционист", "Кассир торгового зала", "Старший кассир", "Кассир выходного дня"],
    employers: [
      { name: "Магнит", kind: "Розничная сеть" },
      { name: "Пятёрочка", kind: "Продуктовый ритейл" },
      { name: "Лента", kind: "Сеть гипермаркетов" },
      { name: "ВкусВилл", kind: "Сеть продуктовых магазинов" },
      { name: "METRO", kind: "Оптовая торговля", foreign: true },
      { name: "Ашан", kind: "Сеть гипермаркетов", foreign: true },
    ],
    cities: RU_CITIES,
    salaryBands: [[50, 75], [55, 80], [48, 68], [60, 90]],
    schedules: ["Сменный график 2/2", "График 3/3", "Гибкий график"],
    employments: ["Полная занятость", "Частичная занятость", "Подработка"],
    requirements: [
      "Внимательность к деталям",
      "Базовые навыки работы с ПК / кассой",
      "Честность и ответственность",
      "Опыт на кассе приветствуется",
    ],
    perks: [
      "Стабильный оклад + премии",
      "Официальное оформление по ТК РФ",
      "Обучение работе на кассе",
      "Скидки сотрудникам",
    ],
    quiz: [
      cityQuestion,
      experienceQuestion,
      employmentQuestion,
      startQuestion,
    ],
  },
  {
    key: "manager",
    title: "Менеджер",
    salaryHint: "от 80 000 ₽",
    icon: IconBriefcase,
    count: 40,
    searchTerms: ["менеджер", "продажи", "клиенты", "аккаунт", "по работе с клиентами"],
    roleVariants: ["Менеджер по продажам", "Менеджер по работе с клиентами", "Аккаунт-менеджер", "Менеджер по сопровождению", "Офис-менеджер"],
    employers: [
      { name: "СКБ Контур", kind: "Разработчик онлайн-сервисов" },
      { name: "МойСклад", kind: "Сервис учёта для бизнеса" },
      { name: "Skillbox", kind: "Образовательная платформа" },
      { name: "Profi.ru", kind: "Сервис поиска специалистов" },
      { name: "Битрикс24", kind: "CRM и сервисы для бизнеса" },
      { name: "Ozon", kind: "Маркетплейс" },
    ],
    cities: RU_CITIES,
    salaryBands: [[80, 140], [90, 160], [70, 120], [100, 180]],
    schedules: ["График 5/2", "Гибкое начало дня", "Гибрид (офис + удалёнка)"],
    employments: ["Полная занятость", "Частичная занятость"],
    requirements: [
      "Грамотная устная и письменная речь",
      "Навыки работы с CRM приветствуются",
      "Ориентация на результат",
      "Опыт в продажах будет плюсом",
    ],
    perks: [
      "Оклад + прозрачная система бонусов",
      "Официальное оформление по ТК РФ",
      "Обучение и наставник на старте",
      "Возможность роста до руководителя",
    ],
    quiz: [
      cityQuestion,
      experienceQuestion,
      {
        id: "direction",
        question: "Какое направление ближе?",
        summaryLabel: "Направление",
        type: "select",
        options: [
          { label: "Активные продажи", value: "Активные продажи" },
          { label: "Работа с текущими клиентами", value: "Сопровождение клиентов" },
          { label: "Входящие обращения", value: "Входящие обращения" },
        ],
      },
      startQuestion,
    ],
  },
  {
    key: "operator",
    title: "Оператор",
    salaryHint: "от 45 000 ₽",
    icon: IconHeadphones,
    count: 34,
    searchTerms: ["оператор", "колл-центр", "поддержка", "call", "контакт-центр"],
    roleVariants: ["Оператор колл-центра", "Оператор контакт-центра", "Специалист поддержки", "Оператор чата", "Оператор на телефоне"],
    employers: [
      { name: "Ростелеком", kind: "Телеком-оператор" },
      { name: "МТС", kind: "Телеком-оператор" },
      { name: "билайн", kind: "Телеком-оператор" },
      { name: "Телеконтакт", kind: "Аутсорсинговый контакт-центр" },
      { name: "Wildberries", kind: "Маркетплейс" },
      { name: "Т-Банк", kind: "Банк" },
    ],
    cities: RU_CITIES,
    salaryBands: [[45, 70], [50, 80], [42, 65], [55, 90]],
    schedules: ["Сменный график 2/2", "График 5/2", "Удалённо, гибкие смены"],
    employments: ["Полная занятость", "Частичная занятость", "Подработка"],
    requirements: [
      "Грамотная речь и доброжелательность",
      "Базовые навыки работы с ПК",
      "Усидчивость и внимательность",
      "Опыт не обязателен — обучим",
    ],
    perks: [
      "Оклад + премии за качество",
      "Можно работать из дома",
      "Оплачиваемое обучение",
      "Удобные смены",
    ],
    quiz: [
      cityQuestion,
      {
        id: "place",
        question: "Где удобнее работать?",
        summaryLabel: "Место",
        type: "select",
        options: [
          { label: "Из дома (удалённо)", value: "Удалённо" },
          { label: "В офисе", value: "Офис" },
          { label: "Не важно", value: "Любой" },
        ],
      },
      employmentQuestion,
      startQuestion,
    ],
  },
  {
    key: "warehouse",
    title: "Складской персонал",
    salaryHint: "от 60 000 ₽",
    icon: IconWarehouse,
    count: 46,
    searchTerms: ["склад", "комплектовщик", "грузчик", "кладовщик", "сборщик", "складской"],
    roleVariants: ["Комплектовщик", "Кладовщик", "Сборщик заказов", "Грузчик", "Оператор склада"],
    employers: [
      { name: "Wildberries", kind: "Маркетплейс" },
      { name: "Ozon", kind: "Маркетплейс" },
      { name: "X5 Group", kind: "Продуктовый ритейл" },
      { name: "Сберлогистика", kind: "Логистическая компания" },
      { name: "СДЭК", kind: "Логистическая компания" },
      { name: "Магнит", kind: "Розничная сеть, логистика" },
    ],
    cities: RU_CITIES,
    salaryBands: [[60, 95], [70, 110], [55, 85], [80, 120]],
    schedules: ["Сменный график 2/2", "Вахта 30/15", "Дневные смены"],
    employments: ["Полная занятость", "Вахта", "Подработка"],
    requirements: [
      "Готовность к физической работе",
      "Внимательность и аккуратность",
      "Дисциплинированность",
      "Опыт на складе приветствуется",
    ],
    perks: [
      "Стабильный оклад + выплаты за объём",
      "Официальное оформление по ТК РФ",
      "Бесплатное питание на ряде складов",
      "Обучение для новичков",
    ],
    quiz: [
      cityQuestion,
      {
        id: "shift",
        question: "Какой график удобнее?",
        summaryLabel: "График",
        type: "select",
        options: [
          { label: "Дневные смены", value: "День" },
          { label: "Ночные смены", value: "Ночь" },
          { label: "Вахта", value: "Вахта" },
          { label: "Любой", value: "Любой" },
        ],
      },
      experienceQuestion,
      startQuestion,
    ],
  },
  {
    key: "remote",
    title: "Удалённая работа",
    salaryHint: "от 70 000 ₽",
    icon: IconCode,
    count: 30,
    searchTerms: ["удалённая", "удаленная", "из дома", "онлайн", "remote", "дистанционно"],
    roleVariants: ["Специалист поддержки (удалённо)", "Менеджер по продажам (удалённо)", "Контент-менеджер", "Ассистент руководителя", "Оператор чата"],
    employers: [
      { name: "СКБ Контур", kind: "Разработчик онлайн-сервисов" },
      { name: "Skyeng", kind: "Онлайн-школа английского" },
      { name: "Нетология", kind: "Образовательная платформа" },
      { name: "Т-Банк", kind: "Банк" },
      { name: "EPAM", kind: "ИТ-компания", foreign: true },
      { name: "Wrike", kind: "Сервис управления проектами", foreign: true },
    ],
    cities: ["Удалённо (вся Россия)", "Москва", "Санкт-Петербург", "Екатеринбург", "Казань"],
    salaryBands: [[70, 120], [80, 140], [60, 100], [90, 160]],
    schedules: ["Удалённо, гибкий график", "Удалённо, 5/2", "Удалённо, гибкие смены"],
    employments: ["Полная занятость", "Частичная занятость", "Проектная работа"],
    requirements: [
      "Стабильный интернет и свой компьютер",
      "Самоорганизация",
      "Грамотная письменная речь",
      "Опыт в смежной сфере приветствуется",
    ],
    perks: [
      "Работа из любого города России",
      "Гибкий график",
      "Официальное оформление или самозанятость",
      "Обучение и поддержка наставника",
    ],
    quiz: [
      cityQuestion,
      {
        id: "direction",
        question: "Что вам ближе?",
        summaryLabel: "Направление",
        type: "select",
        options: [
          { label: "Поддержка / чат", value: "Поддержка" },
          { label: "Продажи", value: "Продажи" },
          { label: "Контент / тексты", value: "Контент" },
          { label: "Ассистент", value: "Ассистент" },
        ],
      },
      employmentQuestion,
      startQuestion,
    ],
  },
]

const POSTED_LABELS = ["Сегодня", "Вчера", "2 дня назад", "3 дня назад", "На этой неделе"]

function formatSalary(band: [number, number]): string {
  const fmt = (n: number) => `${n} 000`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `от ${fmt(band[0])} до ${fmt(band[1])} ₽`
}

// Детерминированная генерация карточек: индекс задаёт компанию, роль, город, вилку и т.д.
function generateVacancies(cat: Category): Vacancy[] {
  const list: Vacancy[] = []
  for (let i = 0; i < cat.count; i++) {
    const employer = cat.employers[i % cat.employers.length]
    const title = cat.roleVariants[i % cat.roleVariants.length]
    const city = cat.cities[(i * 3) % cat.cities.length]
    const band = cat.salaryBands[i % cat.salaryBands.length]
    const schedule = cat.schedules[i % cat.schedules.length]
    const employment = cat.employments[i % cat.employments.length]
    const posted = POSTED_LABELS[i % POSTED_LABELS.length]

    list.push({
      id: `${cat.key}-${i + 1}`,
      categoryKey: cat.key,
      categoryTitle: cat.title,
      title,
      company: employer.name,
      companyKind: employer.kind,
      foreign: Boolean(employer.foreign),
      city,
      salary: formatSalary(band),
      schedule,
      employment,
      description: `${title} в компанию «${employer.name}» (${employer.kind.toLowerCase()}). ${cat.title} — подбор бесплатно для соискателя, официальное оформление.`,
      requirements: cat.requirements,
      perks: cat.perks,
      postedLabel: posted,
    })
  }
  return list
}

// Все вакансии одним списком (для поиска)
export const allVacancies: Vacancy[] = categories.flatMap(generateVacancies)

export function getCategory(key: CategoryKey): Category | undefined {
  return categories.find((c) => c.key === key)
}

export function getVacancyById(id: string): Vacancy | undefined {
  return allVacancies.find((v) => v.id === id)
}

// Поиск: по названию, компании, городу, категории и ключевым словам
export function searchVacancies(query: string): Vacancy[] {
  const q = query.trim().toLowerCase()
  if (!q) return allVacancies
  return allVacancies.filter((v) => {
    const cat = getCategory(v.categoryKey)
    const haystack = [
      v.title,
      v.company,
      v.companyKind,
      v.city,
      v.categoryTitle,
      ...(cat?.searchTerms ?? []),
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(q)
  })
}

// Формирует предзаполненное сообщение для мессенджера — обращение напрямую к работодателю
export function buildVacancyMessage(vacancy: Vacancy, answers: Record<string, string>): string {
  const greeting = answers.name
    ? `Здравствуйте! Меня зовут ${answers.name}.`
    : "Здравствуйте!"
  const lines = [
    `${greeting} Хочу откликнуться на вакансию «${vacancy.title}» в компании «${vacancy.company}» (${vacancy.city}).`,
    `Нашёл(ла) вакансию через ${siteConfig.name}.`,
  ]
  const cat = getCategory(vacancy.categoryKey)
  if (cat) {
    for (const question of cat.quiz) {
      const value = answers[question.id]
      if (value) lines.push(`${question.summaryLabel}: ${value}`)
    }
  }
  return lines.join("\n")
}
