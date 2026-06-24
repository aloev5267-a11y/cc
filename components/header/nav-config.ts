import {
  IconMapPin,
  IconUsers,
  IconSearch,
  IconCalculator,
  IconBriefcase,
  IconUserPlus,
  IconPackage,
  IconTruck,
  IconHeadphones,
  IconHandshake,
  IconCode,
} from "../icons"

export type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const navItems: NavItem[] = [
  { href: "/cities", label: "Города", icon: IconMapPin },
  { href: "/about", label: "О нас", icon: IconUsers },
  { href: "/tracking", label: "Отслеживание", icon: IconSearch },
  { href: "/#delivery", label: "Калькулятор", icon: IconCalculator },
  { href: "/#careers", label: "Работа у нас", icon: IconBriefcase },
  { href: "/vacancies", label: "Вакансии", icon: IconUserPlus },
]

export const serviceItems: NavItem[] = [
  { href: "/#delivery", label: "Доставка", icon: IconPackage },
  { href: "/#cargo", label: "Грузы", icon: IconTruck },
  { href: "/support", label: "Поддержка", icon: IconHeadphones },
  { href: "/partners", label: "Партнёрам", icon: IconHandshake },
  { href: "/api-docs", label: "API", icon: IconCode },
]
