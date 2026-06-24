import {
  IconBriefcase,
  IconUsers,
  IconHandshake,
  IconUserPlus,
  IconHeadphones,
  IconHeart,
} from "../icons"

export type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const navItems: NavItem[] = [
  { href: "/vacancies", label: "Вакансии", icon: IconUserPlus },
  { href: "/#find", label: "Найти работу", icon: IconBriefcase },
  { href: "/about", label: "О нас", icon: IconUsers },
  { href: "/partners", label: "Работодателям", icon: IconHandshake },
]

export const serviceItems: NavItem[] = [
  { href: "/vacancies", label: "Открытые вакансии", icon: IconUserPlus },
  { href: "/#find", label: "Соискателям", icon: IconHeart },
  { href: "/partners", label: "Работодателям", icon: IconHandshake },
  { href: "/support", label: "Поддержка", icon: IconHeadphones },
]
