"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { IconMail, IconArrowUpRight, IconArrow } from "../icons"
import { navItems } from "./nav-config"
import { MessengerPill } from "./messenger-pill"
import { RegionPicker } from "./region-picker"
import { siteConfig } from "@/lib/config"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const employerMode = pathname.startsWith("/partners")

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-background lg:hidden flex flex-col pt-[4.75rem]"
        >
          <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-5">
            {/* Сегментированный переключатель режимов */}
            <div className="flex items-center p-1 rounded-2xl bg-secondary">
              <Link
                href="/"
                onClick={onClose}
                className={`flex-1 text-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  !employerMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Ищу работу
              </Link>
              <Link
                href="/partners"
                onClick={onClose}
                className={`flex-1 text-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  employerMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Ищу сотрудника
              </Link>
            </div>

            {/* Навигация — карточки */}
            <nav className="flex flex-col gap-2.5">
              {navItems.map((item, i) => {
                const Icon = item.icon
                const active = item.href === pathname
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between gap-4 rounded-2xl border p-3.5 transition-colors ${
                        active ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <span className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </span>
                        <span className="text-lg font-bold text-foreground">{item.label}</span>
                      </span>
                      <IconArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Основной CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + navItems.length * 0.04 }}
            >
              <Link
                href={employerMode ? "/partners#hire" : "/#lead"}
                onClick={onClose}
                className="flex items-center justify-center gap-2 h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-semibold shadow-sm transition-transform active:scale-[0.99]"
              >
                {employerMode ? "Подобрать персонал" : "Подобрать вакансию"}
                <IconArrow className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Регион */}
            <div className="rounded-2xl border border-border bg-card p-1.5">
              <RegionPicker />
            </div>

            {/* Контакты — закреплены снизу */}
            <div className="mt-auto pt-4 border-t border-border space-y-3">
              <p className="eyebrow text-muted-foreground">Напишите нам в мессенджер</p>
              <MessengerPill />
              <a
                href={siteConfig.contact.emailHref}
                className="flex items-center gap-3 text-sm text-foreground/80"
              >
                <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <IconMail className="w-4 h-4 text-primary" />
                </span>
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
