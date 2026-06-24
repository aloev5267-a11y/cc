"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { IconMail, IconArrowUpRight } from "../icons"
import { navItems } from "./nav-config"
import { MessengerPill } from "./messenger-pill"
import { RegionPicker } from "./region-picker"
import { siteConfig } from "@/lib/config"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-background lg:hidden flex flex-col pt-16"
        >
          <div className="flex-1 overflow-y-auto px-5 py-8 flex flex-col">
            {/* Сегментированный переключатель режимов */}
            <div className="flex items-center p-1 rounded-full bg-secondary mb-6">
              <Link
                href="/"
                onClick={onClose}
                className="flex-1 text-center px-4 py-2.5 text-sm font-semibold rounded-full bg-card text-foreground shadow-sm"
              >
                Ищу работу
              </Link>
              <Link
                href="/partners"
                onClick={onClose}
                className="flex-1 text-center px-4 py-2.5 text-sm font-semibold rounded-full text-muted-foreground"
              >
                Ищу сотрудника
              </Link>
            </div>

            {/* Big nav links */}
            <nav className="flex flex-col">
              {navItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between gap-4 py-4 border-b border-border"
                    >
                      <span className="flex items-center gap-4">
                        <span className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </span>
                        <span className="text-xl font-bold text-foreground">{item.label}</span>
                      </span>
                      <IconArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Регион */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + navItems.length * 0.05 }}
              className="mt-8"
            >
              <RegionPicker />
            </motion.div>

            {/* Contacts */}
            <div className="mt-auto pt-10 space-y-4">
              <p className="eyebrow text-muted-foreground">Напишите нам в мессенджер</p>
              <MessengerPill />
              <a
                href={siteConfig.contact.emailHref}
                className="flex items-center gap-3 text-foreground/80"
              >
                <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
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
