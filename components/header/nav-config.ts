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
  { href: "/#lead", label: "Подобрать вакансию", icon: IconUserPlus },
  { href: "/#how", label: "Как это работает", icon: IconBriefcase },
  { href: "/about", label: "О нас", icon: IconUsers },
  { href: "/partners", label: "Работодателям", icon: IconHandshake },
]

export const serviceItems: NavItem[] = [
  { href: "/#lead", label: "Подобрать вакансию", icon: IconUserPlus },
  { href: "/#how", label: "Соискателям", icon: IconHeart },
  { href: "/partners", label: "Работодателям", icon: IconHandshake },
  { href: "/support", label: "Поддержка", icon: IconHeadphones },
]
