// Каталог промо-страниц (вакансий).
// Используется в sitemap.xml как список маршрутов промо-лендингов.

export type PromoPageInfo = {
  // Уникальный ключ страницы
  key: string
  // Путь страницы на сайте
  path: string
  // Короткое название (заголовок / H1)
  name: string
}

export const promoPages: PromoPageInfo[] = [
  { key: "courier", path: "/promo/courier", name: "Работа курьером" },
  { key: "driver", path: "/promo/driver", name: "Работа водителем" },
  { key: "warehouse", path: "/promo/warehouse", name: "Работа на складе" },
  { key: "jobs", path: "/promo/jobs", name: "Подбор вакансии" },
  { key: "team", path: "/promo/team", name: "Найдём работу под вас" },
]
