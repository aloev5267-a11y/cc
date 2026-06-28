// Каталог вакансий ElWork — единый источник данных для главной (категории)
// и страницы /vacancies (карточки + квиз). Карточки генерируются детерминированно
// (без Math.random), чтобы не было расхождений между сервером и клиентом.
//
// ВАЖНО (для модерации): доход указываем диапазоном "от работодателя", без завышенных
// обещаний и без возрастного ценза. Компании — реальные средние работодатели, работающие
// в России, плюс несколько международных (отмечены foreign).

import { IconPackage, IconCar, IconWarehouse } from "@/components/icons"
import { siteConfig } from "./config"
import { RUSSIAN_CITIES } from "./cities"

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
  salaryFrom: number
  schedule: string
  employment: string
  experience: string
  description: string
  responsibilities: string[]
  requirements: string[]
  perks: string[]
  postedLabel: string
  // Деривативные флаги для разнообразия карточек (детерминированы по индексу)
  hot: boolean
  noExperience: boolean
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

export type CategoryKey = "courier" | "driver" | "warehouse"

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
  // Полный справочник городов РФ для автоподсказки.
  suggestions: RUSSIAN_CITIES,
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
]

const POSTED_LABELS = ["Сегодня", "Вчера", "2 дня назад", "3 дня назад", "На этой неделе"]
const EXPERIENCE_LABELS = ["Без опыта", "Без опыта", "От 1 года", "От 3 лет"]

function formatSalary(band: [number, number]): string {
  const fmt = (n: number) => `${n} 000`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `от ${fmt(band[0])} до ${fmt(band[1])} ₽`
}

// Готовим список обязанностей: первые два пункта — общие для роли, остальные из требований.
function buildResponsibilities(cat: Category, title: string): string[] {
  const base = [
    `Выполнять задачи по направлению «${title.toLowerCase()}»`,
    "Соблюдать стандарты и регламенты компании",
    "Поддерживать порядок на рабочем месте и отчётность",
  ]
  const extra = cat.requirements.slice(0, 2).map((r) => r.replace(/^[А-ЯA-Z]/, (c) => c.toLowerCase()))
  return [...base, ...extra]
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
    const experience = EXPERIENCE_LABELS[(i * 2) % EXPERIENCE_LABELS.length]
    const noExperience = experience === "Без опыта"
    // «Срочно» — каждая третья вакансия, детерминированно
    const hot = i % 3 === 0

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
      salaryFrom: band[0],
      schedule,
      employment,
      experience,
      description: `Компания «${employer.name}» (${employer.kind.toLowerCase()}) приглашает на позицию «${title.toLowerCase()}» в городе ${city}. Подбор бесплатный для соискателя, официальное оформление и сопровождение нашего специалиста до выхода на работу.`,
      responsibilities: buildResponsibilities(cat, title),
      requirements: cat.requirements,
      perks: cat.perks,
      postedLabel: posted,
      hot,
      noExperience,
    })
  }
  return list
}

// Все вакансии одним списком (для поиска)
export const allVacancies: Vacancy[] = categories.flatMap(generateVacancies)

export function getCategory(key: CategoryKey): Category | undefined {
  return categories.find((c) => c.key === key)
}

// Категории доступны по человекочитаемому слагу (= ключ категории, латиницей):
// /vacancies/courier, /vacancies/driver и т.д.
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.key === slug)
}

export function getVacancyById(id: string): Vacancy | undefined {
  return allVacancies.find((v) => v.id === id)
}

// Похожие вакансии (та же категория, кроме текущей) — для блока на детальной странице
export function getRelatedVacancies(vacancy: Vacancy, count = 4): Vacancy[] {
  return allVacancies
    .filter((v) => v.categoryKey === vacancy.categoryKey && v.id !== vacancy.id)
    .slice(0, count)
}

// Инициалы компании для аватара карточки
export function getCompanyInitials(name: string): string {
  const cleaned = name.replace(/["«»]/g, "").trim()
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return cleaned.slice(0, 2).toUpperCase()
}

// Детерминированный оттенок аватара в сине-бирюзовом диапазоне бренда (195–230)
export function getCompanyHue(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return 195 + (h % 36)
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
